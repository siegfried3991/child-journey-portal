import portal from './index';
import {authenticatedRequest,type AccessSettings} from '../lib/erp/access-auth';
export default {
 async fetch(request:Request,env:Cloudflare.Env & AccessSettings & {ASSETS:Fetcher},ctx:Parameters<typeof portal.fetch>[2]){
  let authenticated:Request;
  try{authenticated=await authenticatedRequest(request,env)}catch{
   return new Response('Private portal. Sign in using the configured Cloudflare Access address.',{status:403,headers:{'Cache-Control':'private, no-store','Content-Type':'text/plain; charset=utf-8','X-Content-Type-Options':'nosniff'}});
  }
  if(new URL(request.url).pathname==='/signout-with-chatgpt')return Response.redirect(new URL('/cdn-cgi/access/logout',request.url).href,302);
  if(request.method==='GET'||request.method==='HEAD'){
   const asset=await env.ASSETS.fetch(authenticated);
   if(asset.status!==404)return asset;
  }
  return portal.fetch(authenticated,env,ctx);
 }
};
