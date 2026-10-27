import {archive,createStatements,database,failure,identity,readJSON,records,response,save,ApiError} from '@/lib/erp/server';
import {fingerprint,validate,validateRelations,type Entry,type Result} from '@/lib/erp/academic';
import {demoEntries} from '@/lib/erp/demo';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const owner=await identity();const id=new URL(req.url).searchParams.get('history');if(id){const result=await database().prepare('SELECT revision,action,reason,snapshot,created_at FROM erp_changes WHERE owner_id=? AND record_id=? ORDER BY revision DESC').bind(owner,id).all();return response({changes:result.results.map((r:any)=>({...r,snapshot:JSON.parse(r.snapshot)}))})}
 const all=await records(owner);const files=await database().prepare('SELECT id,record_id AS recordId,name,content_type AS contentType,size,created_at AS createdAt FROM erp_attachments WHERE owner_id=? ORDER BY created_at').bind(owner).all();return response({records:all,attachments:files.results});}catch(e){return failure(e)}}
export async function POST(req:Request){try{const owner=await identity(req),input=await readJSON(req);if(input.action==='save')return response(await save(owner,input));if(input.action==='archive')return response(await archive(owner,input));
 if(input.action==='import'){
 if(!Array.isArray(input.rows)||input.rows.length<1||input.rows.length>200)throw new ApiError('每次請匯入 1–200 行');const all=await records(owner);const seen=new Set(all.filter(r=>r.kind==='result').map(r=>fingerprint(r.body as Result)));let skipped=0;const statements=[];
 for(const row of input.rows){const body=validate('result',row) as Result;validateRelations('result',body,all);if(!body.reviewed)throw new ApiError('請核對匯入資料。');const key=fingerprint(body);if(seen.has(key)){skipped++;continue}seen.add(key);statements.push(...createStatements(owner,crypto.randomUUID(),'result',body,'核對後由 CSV 匯入'));}
 if(all.length+statements.length/2>10000)throw new ApiError('此版本最多儲存 10,000 份記錄。',413);if(statements.length)await database().batch(statements);return response({imported:statements.length/2,skipped});}
 if(input.action==='demo'){
 const all=await records(owner);const present=all.find(r=>r.kind==='student'&&(r.body as any).isDemo);if(present)return response({studentId:present.id});const entries=demoEntries();if(all.length+entries.length>10000)throw new ApiError('此版本最多儲存 10,000 份記錄。',413);let working=[...all];const statements=[];for(const e of entries){const body=validate(e.kind,e.body);validateRelations(e.kind,body,working);statements.push(...createStatements(owner,e.id,e.kind,body,'建立獨立示例資料'));working.push(e)}await database().batch(statements);return response({studentId:entries[0].id});}
 throw new ApiError('未知操作');}catch(e){return failure(e)}}
