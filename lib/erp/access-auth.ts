import {createRemoteJWKSet,jwtVerify,type JWTVerifyGetKey} from 'jose';
export type AccessSettings={CF_ACCESS_TEAM_DOMAIN?:string;CF_ACCESS_AUD?:string;ERP_OWNER_EMAILS?:string};
const keysets=new Map<string,JWTVerifyGetKey>();
export function accessConfig(settings:AccessSettings){
 const domain=settings.CF_ACCESS_TEAM_DOMAIN?.trim().toLowerCase();
 const audience=settings.CF_ACCESS_AUD?.trim();
 const owners=(settings.ERP_OWNER_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 if(!domain||!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain)||!audience||!owners.length)throw new Error('Private access configuration is incomplete');
 return {issuer:domain,audience,owners};
}
/** Every standalone request is verified, including assets and APIs. Never trust identity headers from the client. */
export async function authenticatedRequest(request:Request,settings:AccessSettings,verificationKey?:JWTVerifyGetKey){
 const config=accessConfig(settings),token=request.headers.get('Cf-Access-Jwt-Assertion');
 if(!token)throw new Error('Sign in through Cloudflare Access');
 let keys=verificationKey||keysets.get(config.issuer);
 if(!keys){keys=createRemoteJWKSet(new URL(config.issuer+'/cdn-cgi/access/certs'));keysets.set(config.issuer,keys)}
 const {payload}=await jwtVerify(token,keys,{issuer:config.issuer,audience:config.audience,algorithms:['RS256'],requiredClaims:['exp','iat','sub','email'],maxTokenAge:'24h'});
 if(typeof payload.sub!=='string'||!payload.sub||typeof payload.email!=='string'||!config.owners.includes(payload.email.toLowerCase()))throw new Error('This account is not allowed');
 const headers=new Headers(request.headers);
 for(const name of [...headers.keys()])if(name.toLowerCase().startsWith('oai-authenticated-'))headers.delete(name);
 headers.set('oai-authenticated-user-id','cf-access:'+payload.sub);
 headers.set('oai-authenticated-user-email',payload.email.toLowerCase());
 return new Request(request,{headers});
}
