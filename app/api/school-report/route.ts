import {env} from 'cloudflare:workers';
import {ApiError,database,failure,identity,records,response,save} from '@/lib/erp/server';
import {REFERENCE_ID,referenceSchema,termId} from '@/lib/erp/reference';
import {schoolReportImport,mergeSchoolReport} from '@/lib/erp/school-report';
import {validate,type Report,type Course} from '@/lib/erp/academic';
export async function POST(req:Request){try{
 const owner=await identity(req);if(!env.BUCKET)throw new ApiError('檔案儲存尚未連接。',503);
 if(Number(req.headers.get('content-length'))>11*1024*1024)throw new ApiError('檔案太大。',413);
 const form=await req.formData(),file=form.get('file'),patch=form.get('patch');if(!(file instanceof File)||!(patch instanceof File)||patch.size>200000||file.size>10*1024*1024)throw new ApiError('請選擇核對資料及不超過 10 MB 的原始 PDF。');
 const p=schoolReportImport.parse(JSON.parse(await patch.text())),bytes=new Uint8Array(await file.arrayBuffer());if(![37,80,68,70,45].every((v,i)=>bytes[i]===v))throw new ApiError('原件必須是 PDF。');
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(v=>v.toString(16).padStart(2,'0')).join('');if(hash!==p.sha256||bytes.length!==p.bytes)throw new ApiError('原件與核對資料不符。',409);
 const all=await records(owner),report=all.find(r=>r.id===REFERENCE_ID&&r.kind==='report'&&!r.archived);if(!report)throw new ApiError('請先建立成績單資料庫。',404);const rb=report.body as Report;
 const expected=Number(form.get('revision'));if(report.revision!==expected)throw new ApiError('資料庫已更新，請重新整理再匯入。',409);
 const next=referenceSchema.parse(mergeSchoolReport(rb.data,p,file.name));
 const updates=p.rows.map(row=>{const old=all.find(r=>r.id===row.courseId);if(old&&(old.kind!=='course'||old.archived||(old.body as Course).studentId!==rb.studentId||(old.body as Course).termId!==termId(p.schoolYear)))throw new ApiError('課程與學生／學年不符。');const oldBody=old?.body as Course|undefined;const body=validate('course',{...(oldBody||{studentId:rb.studentId,termId:termId(p.schoolYear),code:'',credits:null,policy:{confirmed:false,emptyCategories:'require_all',bands:[],categories:[{id:'school-report',name:'School report',weight:null,method:'points'}]}}),name:row.course,teacher:row.teacher,level:row.course.startsWith('AP ')?'AP':row.course.startsWith('Honors ')?'Honors':'Other',reportedGrade:row.raw,reportedSource:`${p.sourceId} · ${p.term} 學校公布 · ${p.reportDate}`});return{old,id:row.courseId,body}});
 if(!all.some(r=>r.kind==='term'&&r.id===termId(p.schoolYear)&&!r.archived))throw new ApiError('請先建立此學年的學期。');
 const reportBody={...rb,data:next,sourceIds:next.source_documents.filter(s=>s.included_as_student_record).map(s=>s.id)};
 const reason=`匯入 ${p.schoolYear} ${p.term} 學校原始成績單（${p.reportDate}）；保留期中快照與歷史版本`;
 if(JSON.stringify(rb)!==JSON.stringify(reportBody))await save(owner,{id:report.id,kind:'report',body:reportBody,revision:report.revision,reason});
 const fileId='reference-'+p.sourceId+'-'+hash.slice(0,16),key=owner+'/'+fileId;
 if(!await database().prepare('SELECT id FROM erp_attachments WHERE owner_id=? AND id=?').bind(owner,fileId).first()){
 await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:'application/pdf'}});
 await database().prepare('INSERT INTO erp_attachments (id,owner_id,record_id,name,content_type,size,object_key,created_at) VALUES (?,?,?,?,?,?,?,?)').bind(fileId,owner,report.id,p.sourceId+' · '+file.name,'application/pdf',bytes.length,key,new Date().toISOString()).run();}
 for(const u of updates)if(!u.old||JSON.stringify(u.old.body)!==JSON.stringify(u.body))await save(owner,{id:u.id,kind:'course',body:u.body,revision:u.old?.revision,reason});
 return response({imported:p.rows.length,sourceId:p.sourceId,fileId,sha256:hash});
 }catch(e){return failure(e)}}
