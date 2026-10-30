// Synthetic local verification only; never run against production.
import assert from 'node:assert/strict';
const origin='http://127.0.0.1:5174';
const headers={Cookie:'__sites_local_auth=1','Content-Type':'application/json',Origin:origin};
const studentId=crypto.randomUUID(),planId='admissions-'+studentId;
async function call(data,status=200,custom={}){const r=await fetch(origin+'/api/erp',{method:data?'POST':'GET',headers:{...headers,...custom},...(data?{body:JSON.stringify(data)}:{})});const text=await r.text();assert.equal(r.status,status,text);try{return JSON.parse(text)}catch{return text}}
assert.equal((await fetch(origin+'/api/erp')).status,401);
await call({action:'save',kind:'student',id:studentId,body:{name:'Admissions synthetic QA',school:'Local QA only',grade:'9',curriculum:'US',isDemo:true}});
const body={studentId,title:'Synthetic university plan',entryYear:2030,subject:'Exploration',targets:[{universityId:'northwestern',roundId:'regular-decision0'}],tasks:[{id:'explore',done:true,note:'Synthetic completion',due:''}],evidence:[{id:crypto.randomUUID(),title:'Synthetic completed project',kind:'project',start:'2026-09-01',end:'2026-10-01',role:'Builder',hours:null,outcome:'Synthetic prototype',source:'Synthetic QA',status:'completed',reviewed:true}],academicIds:[],customTasks:[{id:crypto.randomUUID(),title:'Synthetic test registration',due:'2029-08-01',owner:'Student',deliverable:'Register',source:''}]};
await call({action:'save',kind:'applicationPlan',id:planId,body},403,{Origin:'https://untrusted.example'});
await call({action:'save',kind:'applicationPlan',id:planId,body});
let state=await call();const saved=state.records.find(r=>r.id===planId);assert.deepEqual(saved.body,body);assert.equal(saved.revision,1);
await call({action:'save',kind:'applicationPlan',id:planId,body:{...body,subject:'Updated synthetic interest'},revision:1,reason:'Synthetic correction'});
await call({action:'save',kind:'applicationPlan',id:planId,body,revision:1,reason:'Stale edit'},409);
await call({action:'save',kind:'applicationPlan',id:crypto.randomUUID(),body:{...body,studentId:'not-owned'}} ,400);
await call({action:'save',kind:'applicationPlan',id:crypto.randomUUID(),body:{...body,academicIds:['not-owned']}} ,400);
await call({action:'save',kind:'applicationPlan',id:crypto.randomUUID(),body:{...body,targets:[{universityId:'northwestern',roundId:'invented'}]}} ,400);
const history=await (await fetch(origin+'/api/erp?history='+planId,{headers})).json();assert.equal(history.changes.length,2);assert.equal(history.changes[1].snapshot.body.subject,'Exploration');
console.log('PASS: authenticated save/read, synthetic evidence and milestones, cross-origin rejection, student relationships, round validation, stale edits and revision history.');
