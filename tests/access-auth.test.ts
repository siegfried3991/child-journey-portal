import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPair,SignJWT} from 'jose';
import {authenticatedRequest,accessConfig} from '../lib/erp/access-auth.ts';
const settings={CF_ACCESS_TEAM_DOMAIN:'https://example.cloudflareaccess.com',CF_ACCESS_AUD:'test-audience',ERP_OWNER_EMAILS:'parent@example.test'};
const {privateKey,publicKey}=await generateKeyPair('RS256');
const resolver=async()=>publicKey;
async function token(email='parent@example.test',audience='test-audience',expires='1h',issuer=settings.CF_ACCESS_TEAM_DOMAIN){return new SignJWT({email}).setProtectedHeader({alg:'RS256'}).setSubject('test-subject').setIssuer(issuer).setAudience(audience).setIssuedAt().setExpirationTime(expires).sign(privateKey)}
function request(t?:string){return new Request('https://portal.example.test/api/erp',{headers:{...(t?{'Cf-Access-Jwt-Assertion':t}:{}),'oai-authenticated-user-id':'spoofed','oai-authenticated-user-email':'intruder@example.test','oai-authenticated-user-full-name':'spoofed name'}})}
test('standalone refuses missing config and missing token even with spoofed identity',async()=>{assert.throws(()=>accessConfig({}));await assert.rejects(authenticatedRequest(request(),settings,resolver));await assert.rejects(authenticatedRequest(request(await token()),{},resolver))});
test('verified Access identity replaces all client identity headers',async()=>{const r=await authenticatedRequest(request(await token()),settings,resolver);assert.equal(r.headers.get('oai-authenticated-user-id'),'cf-access:test-subject');assert.equal(r.headers.get('oai-authenticated-user-email'),'parent@example.test');assert.equal(r.headers.get('oai-authenticated-user-full-name'),null)});
test('wrong owner, audience, issuer, expiry and signature are rejected',async()=>{for(const t of [await token('other@example.test'),await token(undefined,'other-aud'),await token(undefined,undefined,'-1h'),await token(undefined,undefined,undefined,'https://other.cloudflareaccess.com')])await assert.rejects(authenticatedRequest(request(t),settings,resolver));const wrong=await generateKeyPair('RS256');await assert.rejects(authenticatedRequest(request(await token()),settings,async()=>wrong.publicKey))});
