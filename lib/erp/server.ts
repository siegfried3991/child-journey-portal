import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {assertNoDuplicate,fingerprint,kinds,message,validate,validateRelations,type Body,type Entry,type Kind,type Result} from './academic';
export class ApiError extends Error{status:number;constructor(text:string,status=400){super(text);this.status=status}}
export function database(){if(!env.DB)throw new ApiError('資料庫尚未連接，請稍後再試。',503);return env.DB}
export async function identity(req?:Request){const user=await getChatGPTUser();if(!user)throw new ApiError('請先登入，再存取學生資料。',401);if(req&&req.method!=='GET'){const origin=req.headers.get('origin');if(req.headers.get('sec-fetch-site')==='cross-site'||(origin&&origin!==new URL(req.url).origin))throw new ApiError('請從此網站提交操作。',403)}return env.ERP_WORKSPACE_EMAIL&&env.ERP_WORKSPACE_ID&&user.email.toLowerCase()===env.ERP_WORKSPACE_EMAIL.toLowerCase()?env.ERP_WORKSPACE_ID:user.userId}
export function unpack(r:any):Entry{return{id:r.id,kind:r.kind,body:JSON.parse(r.body),revision:r.revision,archived:!!r.archived,createdAt:r.created_at,updatedAt:r.updated_at}}
export async function records(owner:string){const rows=await database().prepare('SELECT * FROM erp_records WHERE owner_id = ? ORDER BY created_at,id LIMIT 10001').bind(owner).all();if(rows.results.length>10000)throw new ApiError('資料量超出此版本限制，請聯絡管理員。',413);return rows.results.map(unpack)}
export function response(body:unknown,status=200){return Response.json(body,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}})}
export function failure(e:unknown){if(e instanceof ApiError)return response({error:e.message},e.status);if(e instanceof Error&&/UNIQUE constraint/.test(e.message))return response({error:'已有相同記錄。請重新整理並查看原記錄。'},409);if(e instanceof Error&&/D1_ERROR|SQLITE|binding|database/i.test(e.message)){console.error('Academic storage operation failed');return response({error:'資料暫未儲存，請稍後重試。'},503)}return response({error:message(e)},400)}
export async function readJSON(req:Request){if(!req.headers.get('content-type')?.includes('application/json'))throw new ApiError('需要 JSON 資料');const text=await req.text();if(text.length>600000)throw new ApiError('一次提交的資料太大。',413);try{return JSON.parse(text)}catch{throw new ApiError('資料格式錯誤')}}
function dedupe(kind:Kind,body:Body){if(kind==='result')return fingerprint(body as Result);if(kind==='course'){const c=body as any;return 'course:'+c.studentId+':'+c.termId+':'+c.name.toLowerCase()}return null}
export function createStatements(owner:string,id:string,kind:Kind,body:Body,reason='建立記錄'){
 const now=new Date().toISOString();const b=body as any;const snapshot=JSON.stringify({body,archived:false});const d=database();return[
 d.prepare('INSERT INTO erp_records (id,owner_id,kind,student_id,term_id,course_id,body,revision,archived,created_at,updated_at,dedupe_key) VALUES (?,?,?,?,?,?,?,1,0,?,?,?)').bind(id,owner,kind,b.studentId||null,b.termId||null,b.courseId||null,JSON.stringify(body),now,now,dedupe(kind,body)),
 d.prepare('INSERT INTO erp_changes (id,owner_id,record_id,revision,action,reason,snapshot,created_at) VALUES (?,?,?,1,?,?,?,?)').bind(crypto.randomUUID(),owner,id,'create',reason,snapshot,now)
 ]
}
export async function save(owner:string,input:any){
 if(!kinds.includes(input.kind))throw new ApiError('未知記錄類型');const kind=input.kind as Kind;const id=typeof input.id==='string'&&/^[\w-]{8,80}$/.test(input.id)?input.id:crypto.randomUUID();const all=await records(owner);const old=all.find(r=>r.id===id);const body=validate(kind,input.body);
 if(old&&old.kind!==kind)throw new ApiError('不可更改記錄類型');if(old?.archived)throw new ApiError('請先還原封存記錄，再編輯');
 validateRelations(kind,body,all,old);if(kind==='result')assertNoDuplicate(body as Result,all,id);
 const d=database();if(!old){if(all.length>=10000)throw new ApiError('此版本最多儲存 10,000 份記錄。',413);if(input.revision!==undefined)throw new ApiError('記錄不存在，請重新整理。',404);await d.batch(createStatements(owner,id,kind,body));return{id,revision:1};}
 if(input.revision!==old.revision)throw new ApiError('此記錄已在其他頁面修改。請重新整理後再編輯。',409);
 const reason=typeof input.reason==='string'?input.reason.trim():'';if(!reason||reason.length>500)throw new ApiError('請填寫修訂原因（最多 500 字）');
 const now=new Date().toISOString();const next=old.revision+1;
 const results=await d.batch([
 d.prepare('UPDATE erp_records SET body=?,revision=revision+1,updated_at=?,dedupe_key=? WHERE owner_id=? AND id=? AND revision=? RETURNING id').bind(JSON.stringify(body),now,dedupe(kind,body),owner,id,old.revision),
 d.prepare('INSERT INTO erp_changes (id,owner_id,record_id,revision,action,reason,snapshot,created_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM erp_records WHERE owner_id=? AND id=? AND revision=? AND updated_at=?)').bind(crypto.randomUUID(),owner,id,next,'edit',reason,JSON.stringify({body,archived:false}),now,owner,id,next,now)
 ]);if(!results[0].results.length)throw new ApiError('記錄已更新，請重新整理。',409);return{id,revision:next};
}
export async function archive(owner:string,input:any){const all=await records(owner),old=all.find(r=>r.id===input.id);if(!old)throw new ApiError('找不到記錄。',404);if(old.kind!=='result')throw new ApiError('此版本僅提供成績封存。');if(old.revision!==input.revision)throw new ApiError('記錄已更新，請重新整理。',409);const archived=input.archived===true;const reason=typeof input.reason==='string'?input.reason.trim():'';if(!reason||reason.length>500)throw new ApiError('請填寫封存或還原原因。');if(!archived)validateRelations(old.kind,old.body,all,old);const now=new Date().toISOString(),next=old.revision+1;
 const res=await database().batch([
 database().prepare('UPDATE erp_records SET archived=?,revision=revision+1,updated_at=? WHERE owner_id=? AND id=? AND revision=? RETURNING id').bind(archived?1:0,now,owner,old.id,old.revision),
 database().prepare('INSERT INTO erp_changes (id,owner_id,record_id,revision,action,reason,snapshot,created_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM erp_records WHERE owner_id=? AND id=? AND revision=? AND updated_at=?)').bind(crypto.randomUUID(),owner,old.id,next,archived?'archive':'restore',reason,JSON.stringify({body:old.body,archived}),now,owner,old.id,next,now)
 ]);if(!res[0].results.length)throw new ApiError('記錄已更新，請重新整理。',409);return{id:old.id};}
