// Small private evidence store for Workers Free. No R2 subscription is required.
export const EVIDENCE_CHUNK_BYTES=256*1024;
export const EVIDENCE_MAX_BYTES=10*1024*1024;
export const EVIDENCE_BUDGET_BYTES=64*1024*1024;
const hash=async(bytes:Uint8Array)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes as Uint8Array<ArrayBuffer>))).map(v=>v.toString(16).padStart(2,'0')).join('');
export function d1Evidence(db:D1Database){return {
 async put(key:string,input:Uint8Array){
  const bytes=new Uint8Array(input);
  if(!bytes.length||bytes.length>EVIDENCE_MAX_BYTES)throw new Error('附件上限為 10 MB。');
  const sha=await hash(bytes),existing=await db.prepare('SELECT size,sha256 FROM erp_evidence_objects WHERE object_key=?').bind(key).first<{size:number;sha256:string}>();
  if(existing){if(existing.size===bytes.length&&existing.sha256===sha)return;throw new Error('來源檔案編號已被使用；不覆蓋原件。')}
  const statements=[db.prepare('INSERT INTO erp_evidence_objects (object_key,size,sha256) SELECT ?,?,? WHERE (SELECT COALESCE(SUM(size),0) FROM erp_evidence_objects)+?<=?').bind(key,bytes.length,sha,bytes.length,EVIDENCE_BUDGET_BYTES)];
  for(let offset=0,index=0;offset<bytes.length;offset+=EVIDENCE_CHUNK_BYTES,index++)statements.push(db.prepare('INSERT INTO erp_evidence_chunks (object_key,part,data) SELECT ?,?,? WHERE EXISTS (SELECT 1 FROM erp_evidence_objects WHERE object_key=? AND sha256=?)').bind(key,index,bytes.slice(offset,offset+EVIDENCE_CHUNK_BYTES).buffer,key,sha));
  const results=await db.batch(statements);
  if(!results[0].meta.changes)throw new Error('免費附件空間已達 64 MB 上限；請先備份並整理附件，不會自動啟用收費儲存。');
 },
 async get(key:string){
  const manifest=await db.prepare('SELECT size,sha256 FROM erp_evidence_objects WHERE object_key=?').bind(key).first<{size:number;sha256:string}>();if(!manifest)return null;
  const rows=await db.prepare('SELECT part,data FROM erp_evidence_chunks WHERE object_key=? ORDER BY part').bind(key).all<{part:number;data:number[]|ArrayBuffer|Uint8Array}>();
  const bytes=new Uint8Array(manifest.size);let offset=0;
  for(const [index,row] of rows.results.entries()){const part=new Uint8Array(row.data as ArrayBuffer);if(row.part!==index||offset+part.length>bytes.length)throw new Error('附件資料不完整。');bytes.set(part,offset);offset+=part.length}
  if(offset!==manifest.size||await hash(bytes)!==manifest.sha256)throw new Error('附件完整性核對失敗。');
  return {body:bytes,arrayBuffer:async()=>bytes.buffer};
 },
 async delete(key:string){await db.batch([db.prepare('DELETE FROM erp_evidence_chunks WHERE object_key=?').bind(key),db.prepare('DELETE FROM erp_evidence_objects WHERE object_key=?').bind(key)])}
}}
