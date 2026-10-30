import {scrypt,timingSafeEqual,randomBytes,createHash} from 'node:crypto';
import {authenticatedRequest,type AccessSettings} from './access-auth.ts';
import {authPage} from './password-pages.ts';
export type AuthEnv=AccessSettings & {DB?:D1Database;ERP_WORKSPACE_EMAIL?:string;ERP_WORKSPACE_ID?:string};
export type Member={id:string;username:string|null;role:'owner'|'viewer';must_change:number;disabled:number;password_hash:string|null};
export type LoginSession={member:Member;hash:string;method:string;created:number};
const COOKIE='__Host-journey',HOURS=12*3600,IDLE=3600;
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export function validUsername(s:unknown):string{if(typeof s!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9_.-]{2,39}$/.test(s))throw new AuthError('用戶名稱需為 3–40 個英文字母、數字、點、底線或短橫線。');return s.toLowerCase()}
export function validPassword(s:unknown):string{if(typeof s!=='string'||s.length<14||s.length>128)throw new AuthError('密碼需為 14–128 個字元；可以使用容易記住的長句。');return s}
function derive(password:string,salt:string){return new Promise<Buffer>((resolve,reject)=>scrypt(password,salt,32,{N:32768,r:8,p:3,maxmem:40*1024*1024},(err,key)=>err?reject(err):resolve(key)))}
export async function hashPassword(password:string){validPassword(password);const salt=randomBytes(16).toString('hex');return 'scrypt-32768-8-3$'+salt+'$'+(await derive(password,salt)).toString('hex')}
export async function checkPassword(password:string,stored:string){const [kind,salt,hash]=stored.split('$');if(kind!=='scrypt-32768-8-3'||!/^[a-f0-9]{32}$/.test(salt)||!/^[a-f0-9]{64}$/.test(hash))return false;return timingSafeEqual(await derive(password,salt),Buffer.from(hash,'hex'))}
export class AuthError extends Error{status:number;constructor(message:string,status=400){super(message);this.status=status}}
const db=(env:AuthEnv)=>{if(!env.DB)throw new AuthError('登入服務暫時未能使用。',503);return env.DB};
const now=()=>Math.floor(Date.now()/1000);
export const cookie=(value:string,age=HOURS)=>`${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
export function sameOrigin(req:Request){if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')throw new AuthError('請從此網站提交操作。',403)}
async function body(req:Request){sameOrigin(req);if(Number(req.headers.get('content-length')||0)>4096)throw new AuthError('提交的資料太長。',413);if(!req.headers.get('content-type')?.includes('application/json'))throw new AuthError('需要 JSON 資料。');const reader=req.body?.getReader();let bytes=0,parts:Uint8Array[]=[];if(reader)while(true){const r=await reader.read();if(r.done)break;bytes+=r.value.length;if(bytes>4096){await reader.cancel();throw new AuthError('提交的資料太長。',413)}parts.push(r.value)}try{return JSON.parse(Buffer.concat(parts).toString())}catch{throw new AuthError('資料格式錯誤。')}}
export function json(data:unknown,status=200,extra:Record<string,string>={}){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff',...extra}})}
function redirect(path:string,setCookie?:string){return new Response(null,{status:303,headers:{Location:path,'Cache-Control':'private, no-store',...(setCookie?{'Set-Cookie':setCookie}:{})}})}
async function limit(env:AuthEnv,key:string,max:number){const window=Math.floor(now()/900);const row=await db(env).prepare('INSERT INTO portal_login_limits (key,window,hits) VALUES (?,?,1) ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN window=excluded.window THEN hits+1 ELSE 1 END,window=excluded.window RETURNING hits').bind(key,window).first<{hits:number}>();if(!row||row.hits>max)throw new AuthError('嘗試次數過多，請於 15 分鐘後再試。',429)}
export async function session(req:Request,env:AuthEnv):Promise<LoginSession|null>{const token=req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;const hash=digest(token),t=now();const row=await db(env).prepare('SELECT u.*,s.method,s.created AS session_created,s.last_seen FROM portal_sessions s JOIN portal_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires>? AND s.last_seen>? AND u.disabled=0').bind(hash,t,t-IDLE).first<Member & {method:string;session_created:number;last_seen:number}>();if(!row)return null;if(t-row.last_seen>60)await db(env).prepare('UPDATE portal_sessions SET last_seen=? WHERE token_hash=?').bind(t,hash).run();return{member:row,hash,method:row.method,created:row.session_created}}
async function issue(env:AuthEnv,userId:string,method:string){const token=randomBytes(32).toString('hex'),t=now();await db(env).batch([db(env).prepare('DELETE FROM portal_sessions WHERE expires<? OR last_seen<?').bind(t,t-IDLE),db(env).prepare('DELETE FROM portal_login_limits WHERE window<?').bind(Math.floor(t/900)-2),db(env).prepare('INSERT INTO portal_sessions (token_hash,user_id,method,created,last_seen,expires) VALUES (?,?,?,?,?,?)').bind(digest(token),userId,method,t,t,t+HOURS)]);return cookie(token)}
export function workspaceRequest(req:Request,env:AuthEnv,s:LoginSession){if(!env.ERP_WORKSPACE_EMAIL||!env.ERP_WORKSPACE_ID)throw new AuthError('私人工作區設定未完成。',503);const headers=new Headers(req.headers);for(const name of [...headers.keys()])if(name.toLowerCase().startsWith('oai-authenticated-')||name.toLowerCase().startsWith('x-journey-'))headers.delete(name);headers.set('oai-authenticated-user-id',env.ERP_WORKSPACE_ID);headers.set('oai-authenticated-user-email',env.ERP_WORKSPACE_EMAIL);headers.set('x-journey-role',s.member.role);headers.set('x-journey-username',s.member.username||'Owner');return new Request(req,{headers})}
export function accessAllowed(s:LoginSession,method:string){return !s.member.must_change&&(s.member.role==='owner'||method==='GET'||method==='HEAD')}
export async function authRoute(req:Request,env:AuthEnv):Promise<Response|null>{const path=new URL(req.url).pathname;
 if(path==='/owner-login'&&req.method==='GET'){
  try{await authenticatedRequest(req,env)}catch{return json({error:'請使用 Cloudflare 管理員帳戶登入。'},403)}
  const id='cloudflare-owner';await db(env).prepare("INSERT INTO portal_users (id,role,must_change,disabled,created) VALUES (?,'owner',0,0,?) ON CONFLICT(id) DO NOTHING").bind(id,now()).run();return redirect('/account',await issue(env,id,'cloudflare'));
 }
 if((path==='/login'||path==='/signin-with-chatgpt')&&req.method==='GET')return authPage('login');
 if(path==='/signout-with-chatgpt'&&req.method==='GET')return redirect('/account');
 if(!path.startsWith('/api/auth/')&&path!=='/account')return null;
 try{
  if(path==='/api/auth/login'&&req.method==='POST'){
   const input=await body(req);const username=typeof input.username==='string'?input.username.toLowerCase():'';const password=typeof input.password==='string'?input.password:'';
   await limit(env,'global',200);await limit(env,'ip:'+digest(req.headers.get('cf-connecting-ip')||'local'),30);await limit(env,'name:'+digest(username.slice(0,100)),8);
   if(!/^[a-z0-9][a-z0-9_.-]{2,39}$/.test(username)||password.length>128)throw new AuthError('用戶名稱或密碼不正確。',401);
   const user=await db(env).prepare('SELECT * FROM portal_users WHERE username=?').bind(username).first<Member>();
   // A fixed dummy hash gives unknown/disabled users the same expensive verification path.
   const dummy='scrypt-32768-8-3$00000000000000000000000000000000$0000000000000000000000000000000000000000000000000000000000000000';
   const valid=await checkPassword(password,user?.password_hash||dummy);
   if(!valid||!user||user.disabled)throw new AuthError('用戶名稱或密碼不正確。',401);
   return json({ok:true,redirect:user.must_change?'/account':'/'},200,{'Set-Cookie':await issue(env,user.id,'password')});
  }
  const s=await session(req,env);if(!s)return path==='/account'?redirect('/login'):json({error:'請先登入。'},401);
  const u=s.member;
  if(path==='/account'&&req.method==='GET')return authPage('account');
  if(path==='/api/auth/me'&&req.method==='GET')return json({username:u.username,role:u.role,mustChange:!!u.must_change});
  if(path==='/api/auth/users'&&req.method==='GET'){if(u.role!=='owner')throw new AuthError('只有管理員可以管理帳戶。',403);const rows=await db(env).prepare('SELECT id,username,role,disabled,must_change FROM portal_users ORDER BY created,id').all();return json({users:rows.results})}
  if(req.method!=='POST')throw new AuthError('找不到此操作。',404);
  const input=await body(req);
  if(path==='/api/auth/logout'){await db(env).prepare('DELETE FROM portal_sessions WHERE token_hash=?').bind(s.hash).run();return json({ok:true},200,{'Set-Cookie':cookie('',0)})}
  if(path==='/api/auth/password'){
   const freshCF=s.method==='cloudflare'&&now()-s.created<900;
   if(u.password_hash&&!freshCF){await limit(env,'password:'+u.id,8);if(typeof input.currentPassword!=='string'||input.currentPassword.length>128||!await checkPassword(input.currentPassword,u.password_hash))throw new AuthError('目前密碼不正確。',403)}
   if(!u.password_hash&&!freshCF)throw new AuthError('請先使用 Cloudflare 管理員登入，再設定帳戶。',403);
   const username=u.username||validUsername(input.username),hashed=await hashPassword(validPassword(input.password));
   await db(env).batch([db(env).prepare('UPDATE portal_users SET username=?,password_hash=?,must_change=0 WHERE id=?').bind(username,hashed,u.id),db(env).prepare('DELETE FROM portal_sessions WHERE user_id=?').bind(u.id)]);
   return json({ok:true},200,{'Set-Cookie':await issue(env,u.id,'password')});
  }
  if(u.role!=='owner'||u.must_change)throw new AuthError('此帳戶只有閱讀權限。',403);
  if(path==='/api/auth/users'){
   const username=validUsername(input.username),hashed=await hashPassword(validPassword(input.password));
   const count=await db(env).prepare('SELECT COUNT(*) AS n FROM portal_users').first<{n:number}>();if(!count||count.n>=25)throw new AuthError('目前最多可建立 25 個帳戶。');
   await db(env).prepare("INSERT INTO portal_users (id,username,password_hash,role,must_change,disabled,created) VALUES (?,?,?,'viewer',1,0,?)").bind(crypto.randomUUID(),username,hashed,now()).run();return json({ok:true});
  }
  if(path==='/api/auth/user'){
   const target=typeof input.id==='string'?await db(env).prepare('SELECT id,role FROM portal_users WHERE id=?').bind(input.id).first<{id:string;role:string}>():null;
   if(!target||target.role!=='viewer')throw new AuthError('只能管理受邀閱讀者帳戶。');
   if(input.action==='disable'||input.action==='enable'){await db(env).batch([db(env).prepare('UPDATE portal_users SET disabled=? WHERE id=?').bind(input.action==='disable'?1:0,target.id),db(env).prepare('DELETE FROM portal_sessions WHERE user_id=?').bind(target.id)])}
   else if(input.action==='reset'){const hashed=await hashPassword(validPassword(input.password));await db(env).batch([db(env).prepare('UPDATE portal_users SET password_hash=?,must_change=1 WHERE id=?').bind(hashed,target.id),db(env).prepare('DELETE FROM portal_sessions WHERE user_id=?').bind(target.id)])}
   else throw new AuthError('未知操作。');return json({ok:true});
  }
  throw new AuthError('找不到此操作。',404);
 }catch(e){if(e instanceof AuthError)return json({error:e.message},e.status);if(e instanceof Error&&/UNIQUE/.test(e.message))return json({error:'此用戶名稱已被使用。'},409);console.error('Portal account operation failed');return json({error:'登入服務暫時未能完成操作，請稍後重試。'},503)}
}
