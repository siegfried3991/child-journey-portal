import portal from './index';
import {authRoute,session,workspaceRequest,accessAllowed,json,sameOrigin,type AuthEnv} from '../lib/erp/password-auth';
export default {
 async fetch(request:Request,env:Cloudflare.Env & AuthEnv & {ASSETS:Fetcher},ctx:Parameters<typeof portal.fetch>[2]){
  try{
   const route=await authRoute(request,env);if(route)return route;
   const s=await session(request,env),path=new URL(request.url).pathname;
   if(!s)return path.startsWith('/api/')?json({error:'請先登入。'},401):new Response(null,{status:303,headers:{Location:'/login','Cache-Control':'private, no-store'}});
   if(s.member.must_change&&!path.startsWith('/api/')&&(request.method==='GET'||request.method==='HEAD'))return new Response(null,{status:303,headers:{Location:'/account','Cache-Control':'private, no-store'}});
   if(!accessAllowed(s,request.method))return json({error:s.member.must_change?'請先到帳戶頁面更新密碼。':'此帳戶只有閱讀權限。'},403);
   if(request.method!=='GET'&&request.method!=='HEAD')sameOrigin(request);
   const authenticated=workspaceRequest(request,env,s);
   let response:Response;
   if(request.method==='GET'||request.method==='HEAD'){
    const asset=await env.ASSETS.fetch(authenticated);
    response=asset.status!==404?asset:await portal.fetch(authenticated,env,ctx);
   }else response=await portal.fetch(authenticated,env,ctx);
   const headers=new Headers(response.headers);headers.set('Cache-Control','private, no-store');headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','same-origin');headers.set('X-Frame-Options','DENY');
   return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  }catch{return json({error:'私人登入服務暫時無法使用，請稍後重試。'},503)}
 }
};
