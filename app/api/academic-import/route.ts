import {env} from 'cloudflare:workers';
import {ApiError,createStatements,database,failure,records,response} from '@/lib/erp/server';
import {buildReferenceEntries,REFERENCE_ID,referenceSchema} from '@/lib/erp/reference';
import {type Report,type Entry} from '@/lib/erp/academic';
export const dynamic='force-dynamic';

async function authorize(req:Request){
 if(!env.ERP_IMPORT_KEY||!env.ERP_WORKSPACE_ID)throw new ApiError('匯入服務未設定。',503);
 const supplied=req.headers.get('X-ERP-Import-Key')||'';
 const encoder=new TextEncoder();
 const digest=async(s:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(s)));
 const [a,b]=await Promise.all([digest(supplied),digest(env.ERP_IMPORT_KEY)]);let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
 if(!supplied||diff!==0)throw new ApiError('無權使用匯入服務。',401);
 const origin=req.headers.get('origin');if(req.headers.get('sec-fetch-site')==='cross-site'||(origin&&origin!==new URL(req.url).origin))throw new ApiError('來源不符。',403);
 return env.ERP_WORKSPACE_ID;
}
export async function GET(req:Request){try{
 const owner=await authorize(req),all=await records(owner);
 const files=await database().prepare('SELECT id,record_id,name,content_type,size,object_key FROM erp_attachments WHERE owner_id=? ORDER BY name').bind(owner).all();
 const check=new URL(req.url).searchParams.get('verifyFiles')==='1';
 const evidence=[];for(const f of files.results as any[]){let sha256:string|null=null;if(check){const o=await env.BUCKET?.get(f.object_key);if(o)sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await o.arrayBuffer()))).map(v=>v.toString(16).padStart(2,'0')).join('');}evidence.push({id:f.id,name:f.name,size:f.size,sha256});}
 return response({records:all,attachments:evidence});
}catch(e){return failure(e)}}
export async function POST(req:Request){try{
 const owner=await authorize(req);
 if(req.headers.get('content-type')?.includes('multipart/form-data')){
  if(!env.BUCKET)throw new ApiError('檔案儲存尚未連接。',503);
  if(Number(req.headers.get('content-length'))>11*1024*1024)throw new ApiError('檔案太大。',413);
  const form=await req.formData(),sid=String(form.get('sourceId')||''),file=form.get('file');
  if(!(file instanceof File)||!file.size||file.size>10*1024*1024)throw new ApiError('檔案上限為 10 MB。',413);
  const row=await database().prepare("SELECT body FROM erp_records WHERE owner_id=? AND id=? AND kind='report'").bind(owner,REFERENCE_ID).first<{body:string}>();
  if(!row)throw new ApiError('請先匯入資料。',404);
  const d=referenceSchema.parse((JSON.parse(row.body) as Report).data),s=d.source_documents.find(s=>s.id===sid&&s.included_as_student_record);
  if(!s)throw new ApiError('找不到此來源。',404);
  const bytes=new Uint8Array(await file.arrayBuffer());const sha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(v=>v.toString(16).padStart(2,'0')).join('');
  if(sha!==s.sha256||bytes.length!==s.bytes)throw new ApiError('檔案與核對過的來源不符。',409);
  let type='';if(bytes[0]===37&&bytes[1]===80&&bytes[2]===68&&bytes[3]===70&&bytes[4]===45)type='application/pdf';
  if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)type='image/jpeg';
  if(s.name.toLowerCase().endsWith('.docx')&&bytes[0]===80&&bytes[1]===75)type='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if(!type)throw new ApiError('不支援此來源檔案。');
  const id='reference-'+sid+'-'+sha.slice(0,16),key=owner+'/'+id;
  const existing=await database().prepare('SELECT id FROM erp_attachments WHERE owner_id=? AND id=?').bind(owner,id).first();
  if(existing)return response({id,skipped:true});
  await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:type}});
  try{await database().prepare('INSERT INTO erp_attachments (id,owner_id,record_id,name,content_type,size,object_key,created_at) VALUES (?,?,?,?,?,?,?,?)').bind(id,owner,REFERENCE_ID,sid+' · '+s.name,type,bytes.length,key,new Date().toISOString()).run()}catch(e){await env.BUCKET.delete(key);throw e;}
  return response({id,uploaded:true});
 }
 if(!req.headers.get('content-type')?.includes('application/json'))throw new ApiError('需要 JSON 資料。');
 const raw=await req.text();if(raw.length>600000)throw new ApiError('匯入資料太大。',413);
 const input=JSON.parse(raw),{entries,dataset}=buildReferenceEntries(input.dataset);
 const all=await records(owner),statements=[];let skipped=0;
 const canonical=(x:any):string=>x&&typeof x==='object'?Array.isArray(x)?'['+x.map(canonical).join(',')+']':'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
 for(const e of entries){const old=all.find(r=>r.id===e.id);if(old){if(old.kind!==e.kind||canonical(old.body)!==canonical(e.body))throw new ApiError('已有匯入記錄被修訂；請保留現有修改並核對差異。',409);skipped++;continue;}statements.push(...createStatements(owner,e.id,e.kind,e.body,'由已核對的成績單參考資料匯入；來源與日期確定程度保留'));}
 if(all.length+statements.length/2>10000)throw new ApiError('資料量超出限制。',413);
 if(statements.length)await database().batch(statements);
 return response({imported:statements.length/2,skipped,expectedFiles:dataset.source_documents.filter(s=>s.included_as_student_record).length,reportId:REFERENCE_ID});
}catch(e){return failure(e)}}
