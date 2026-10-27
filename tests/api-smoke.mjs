// Run only against the official local preview. All records are synthetic.
import assert from 'node:assert/strict';
const origin='http://127.0.0.1:5174';
const headers={'Cookie':'__sites_local_auth=1','Content-Type':'application/json','Origin':origin};
const ids=Array.from({length:5},()=>crypto.randomUUID());
async function call(data,expected=200,extra={}){const res=await fetch(origin+'/api/erp',{method:data?'POST':'GET',headers:{...headers,...extra},...(data?{body:JSON.stringify(data)}:{})});const text=await res.text();assert.equal(res.status,expected,text);try{return JSON.parse(text)}catch{return text}}
async function save(kind,id,body,rest={}){return call({action:'save',kind,id,body,...rest})}
assert.equal((await fetch(origin+'/api/erp')).status,401);
assert.equal((await fetch(origin+'/api/erp',{headers:{'oai-authenticated-user-id':'forged','oai-authenticated-user-email':'forged@example.test'}})).status,401);
await call({action:'demo'},403,{Origin:'https://untrusted.example'});
const student={name:'QA temporary '+ids[0].slice(0,6),school:'Synthetic local QA',grade:'9',curriculum:'US',isDemo:false};
const term={name:'QA Fall '+ids[1].slice(0,6),year:'2026',start:'2026-08-01',end:'2026-12-31'};
const course={studentId:ids[0],termId:ids[1],name:'QA Algebra',code:'',teacher:'',level:'Honors',credits:1,reportedGrade:'B+',reportedSource:'Synthetic report',policy:{confirmed:true,emptyCategories:'available',bands:[],categories:[{id:'test',name:'Tests',weight:100,method:'points'}]}};
const result={studentId:ids[0],termId:ids[1],courseId:ids[2],title:'QA synthetic exam',date:'2026-10-25',type:'exam',categoryId:'test',status:'graded',scoreType:'numeric',score:0,maximum:100,grade:'',include:true,reviewed:true,feedback:'Original zero',nextStep:'Review',topics:'Algebra',source:'Synthetic QA',externalId:'',attempt:1,series:'QA series'};
await save('student',ids[0],student);await save('term',ids[1],term);await save('course',ids[2],course);await save('result',ids[3],result);
await call({action:'save',kind:'result',id:ids[4],body:result},400);
await save('result',ids[3],{...result,score:82},{revision:1,reason:'Synthetic correction'});
await call({action:'save',kind:'result',id:ids[3],body:result,revision:1,reason:'Stale edit'},409);
await call({action:'save',kind:'result',id:crypto.randomUUID(),body:{...result,courseId:'not-owned'}},400);
await call({action:'archive',id:ids[3],revision:2,archived:true,reason:'Synthetic archive'});
assert.equal((await call()).records.find(r=>r.id===ids[3]).archived,true);
await call({action:'archive',id:ids[3],revision:3,archived:false,reason:'Synthetic restore'});
const history=await (await fetch(origin+'/api/erp?history='+ids[3],{headers})).json();
assert.deepEqual(history.changes.map(h=>h.action),['restore','archive','edit','create']);assert.equal(history.changes[3].snapshot.body.score,0);assert.equal(history.changes[2].snapshot.body.score,82);
const imported={...result,title:'CSV sample',score:20,maximum:25};
assert.deepEqual(await call({action:'import',rows:[imported,imported]}),{imported:1,skipped:1});
const before=(await call()).records.length;
await call({action:'import',rows:[{...result,title:'Should rollback'},{...result,score:101}]},400);
assert.equal((await call()).records.length,before);
const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/iioAAAAASUVORK5CYII=','base64');
const form=new FormData();form.set('recordId',ids[3]);form.set('file',new File([bytes],'synthetic-evidence.png',{type:'image/png'}));
const upload=await fetch(origin+'/api/attachments',{method:'POST',headers:{Cookie:headers.Cookie,Origin:origin},body:form});assert.equal(upload.status,200,await upload.clone().text());const file=await upload.json();
const download=await fetch(origin+'/api/attachments/'+file.id,{headers});assert.equal(download.status,200);assert.deepEqual(Buffer.from(await download.arrayBuffer()),bytes);assert.ok(download.headers.get('content-disposition').startsWith('attachment'));
assert.equal((await fetch(origin+'/api/attachments/'+file.id)).status,401);
assert.equal((await fetch(origin+'/api/attachments/not-owned',{headers})).status,404);
const bad=new FormData();bad.set('recordId',ids[3]);bad.set('file',new File(['<script>bad</script>'],'fake.pdf',{type:'application/pdf'}));assert.equal((await fetch(origin+'/api/attachments',{method:'POST',headers:{Cookie:headers.Cookie,Origin:origin},body:bad})).status,400);
const state=await call();assert.equal(state.records.find(r=>r.id===ids[3]).body.score,82);assert.equal(state.attachments.find(f=>f.id===file.id).recordId,ids[3]);
console.log('PASS: auth, spoof rejection, cross-origin rejection, create, duplicate, correction, stale edit, relationship checks, archive/restore, history, atomic import, file roundtrip and protected download.');
