import {z} from 'zod';
import {lessonSchema,type Lesson} from './lessons.ts';
import {applicationPlanSchema,type ApplicationPlan} from './admissions.ts';
const short=z.string().trim().min(1).max(160); const optional=z.string().trim().max(2000).default('');
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'請使用有效日期').refine(v=>{const d=new Date(v+'T12:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v},'日期不存在');
export const kinds=['student','term','course','result','report','applicationPlan','lesson'] as const;
export type Kind=typeof kinds[number];
export const categorySchema=z.object({id:short,name:short,weight:z.number().min(0).max(100).nullable(),method:z.enum(['points','equal'])});
export const policySchema=z.object({confirmed:z.boolean(),categories:z.array(categorySchema).min(1).max(12),emptyCategories:z.enum(['require_all','available']),bands:z.array(z.object({label:short,min:z.number().min(0).max(100)})).max(16)}).superRefine((p,ctx)=>{
 if(new Set(p.categories.map(c=>c.id)).size!==p.categories.length)ctx.addIssue({code:'custom',message:'評分類別不可重複'});
 if(new Set(p.categories.map(c=>c.name.toLowerCase())).size!==p.categories.length)ctx.addIssue({code:'custom',message:'評分類別名稱不可重複'});
 if(p.confirmed&&p.categories.some(c=>c.weight===null))ctx.addIssue({code:'custom',message:'核對規則前請填寫所有類別權重'});
 if(p.categories.every(c=>c.weight!==null)&&Math.abs(p.categories.reduce((s,c)=>s+(c.weight??0),0)-100)>0.001)ctx.addIssue({code:'custom',message:'類別權重總和必須為 100%'});
 if(new Set(p.bands.map(b=>b.min)).size!==p.bands.length)ctx.addIssue({code:'custom',message:'等級分界不可重複'});
});
export const schemas={
 lesson:lessonSchema,
 applicationPlan:applicationPlanSchema,
 student:z.object({name:short,school:z.string().trim().max(160),grade:z.string().trim().max(80),curriculum:z.string().trim().max(120),isDemo:z.boolean().default(false)}).strict(),
 term:z.object({name:short,year:short,start:date.nullable(),end:date.nullable()}).strict().refine(t=>!t.start||!t.end||t.start<=t.end,'學期結束日期必須晚於開始日期'),
 course:z.object({studentId:short,termId:short,name:short,code:z.string().trim().max(80),teacher:z.string().trim().max(160),level:z.enum(['Regular','Honors','AP','Other']),credits:z.number().min(0).max(20).nullable(),reportedGrade:z.string().trim().max(80),reportedSource:z.string().trim().max(300),policy:policySchema}).strict(),
 result:z.object({studentId:short,termId:short,courseId:short,title:short,date:date,type:z.enum(['homework','quiz','test','exam','project','participation']),categoryId:short,status:z.enum(['graded','pending','missing','absent','exempt','unknown']),scoreType:z.enum(['numeric','letter','comment']),score:z.number().min(0).max(100000).nullable(),maximum:z.number().positive().max(100000).nullable(),grade:z.string().trim().max(80),include:z.boolean(),feedback:optional,nextStep:optional,topics:z.string().trim().max(500),source:z.string().trim().max(300),externalId:z.string().trim().max(160),attempt:z.number().int().min(1).max(20),series:z.string().trim().max(160),reviewed:z.boolean()}).strict().superRefine((r,ctx)=>{
 if(r.status==='graded'&&r.scoreType==='numeric'&&(r.score===null||r.maximum===null))ctx.addIssue({code:'custom',message:'已評分的數字成績需要得分及滿分'});
 if(r.status==='graded'&&r.scoreType==='letter'&&!r.grade)ctx.addIssue({code:'custom',message:'請填寫原始等級'});
 if(r.status!=='graded'&&(r.score!==null||r.grade!==''))ctx.addIssue({code:'custom',message:'未評分記錄不可填入得分或等級'});
 if(r.scoreType!=='numeric'&&(r.score!==null||r.maximum!==null))ctx.addIssue({code:'custom',message:'等級或評語記錄不可含數字分數'});
 if(r.score!==null&&r.maximum!==null&&r.score>r.maximum)ctx.addIssue({code:'custom',message:'得分不可高於滿分；額外加分請另按學校規則記錄'});
 if(r.scoreType==='comment'&&r.status==='graded'&&!r.feedback)ctx.addIssue({code:'custom',message:'評語記錄需要老師回饋'});
 }),
 report:z.object({studentId:short,termId:short,title:short,referenceId:short,sourceIds:z.array(short).max(100),data:z.record(z.unknown())}).strict()
};
export type Student=z.infer<typeof schemas.student>;export type Term=z.infer<typeof schemas.term>;export type Course=z.infer<typeof schemas.course>;export type Result=z.infer<typeof schemas.result>;export type Policy=z.infer<typeof policySchema>;
export type Report=z.infer<typeof schemas.report>;
export type Body=Student|Term|Course|Result|Report|ApplicationPlan|Lesson;
export interface Entry<T=Body>{id:string;kind:Kind;body:T;revision:number;archived:boolean;createdAt:string;updatedAt:string}
export interface FileInfo{id:string;recordId:string;name:string;size:number;contentType:string;createdAt:string}
export interface Snapshot{records:Entry[];attachments:FileInfo[]}
export function validate(kind:Kind,body:unknown):Body{return schemas[kind].parse(body)}
export function validateRelations(kind:Kind,body:Body,records:Entry[],existing?:Entry){
 if(kind==='applicationPlan'){
 const p=body as ApplicationPlan;
 if(!records.some(r=>r.kind==='student'&&!r.archived&&r.id===p.studentId))throw Error('學生不存在，或已封存');
 if(existing&&(existing.body as ApplicationPlan).studentId!==p.studentId)throw Error('不可更換計劃所屬學生');
 if(p.academicIds.some(id=>!records.some(r=>r.id===id&&!r.archived&&r.kind==='result'&&(r.body as Result).studentId===p.studentId)))throw Error('連結學業記錄不屬於此學生或已封存');
 }
 if(kind==='course'||kind==='result'||kind==='report'||kind==='lesson'){
 const b=body as Course|Result|Report|Lesson;const student=records.find(r=>r.id===b.studentId&&r.kind==='student'&&!r.archived);const term=records.find(r=>r.id===b.termId&&r.kind==='term'&&!r.archived);
 if(!student||!term)throw Error('學生或學期不存在，或已封存');
 if(existing){const prev=existing.body as Course|Result|Report|Lesson;if(prev.studentId!==b.studentId||prev.termId!==b.termId)throw Error('已建立記錄不可更換學生或學期')}
 if(kind==='result'){const result=b as Result;const course=records.find(r=>r.id===result.courseId&&r.kind==='course'&&!r.archived);if(!course)throw Error('課程不存在，或已封存');const c=course.body as Course;if(c.studentId!==b.studentId||c.termId!==b.termId)throw Error('課程與學生、學期不一致');if(!c.policy.categories.some(x=>x.id===result.categoryId))throw Error('此課程沒有選定的評分類別');if(existing&&(existing.body as Result).courseId!==result.courseId)throw Error('已建立成績不可更換課程');}
 if(kind==='lesson'){const lesson=b as Lesson;if(lesson.courseId){const linked=records.find(r=>r.kind==='course'&&!r.archived&&r.id===lesson.courseId)?.body as Course|undefined;if(!linked||linked.studentId!==lesson.studentId||linked.termId!==lesson.termId)throw Error('關聯課程不屬於此學生及學期')}}
 if(kind==='course'&&existing){const cats=(b as Course).policy.categories;const used=records.filter(r=>r.kind==='result'&&(r.body as Result).courseId===existing.id);if(used.some(r=>!cats.some(c=>c.id===(r.body as Result).categoryId)))throw Error('已有成績使用的評分類別不可移除（包括封存記錄）');}
 }
 if(kind==='course'){const c=body as Course;if(records.some(r=>r.kind==='course'&&!r.archived&&r.id!==existing?.id&&(r.body as Course).studentId===c.studentId&&(r.body as Course).termId===c.termId&&(r.body as Course).name.toLowerCase()===c.name.toLowerCase()))throw Error('此學生在該學期已有同名課程');}
}
export function fingerprint(r:Result){return r.externalId?'external:'+r.courseId+':'+r.externalId:[r.courseId,r.date,r.title.trim().toLowerCase(),r.type,r.attempt].join('|')}
export function assertNoDuplicate(body:Result,records:Entry[],except?:string){if(records.some(r=>r.kind==='result'&&r.id!==except&&fingerprint(r.body as Result)===fingerprint(body)))throw Error('已有相同成績（包括封存記錄），請編輯原記錄或使用不同重考次數');}
export function gradeSummary(course:Course,rows:Entry<Result>[]){
 const active=rows.filter(e=>!e.archived);const categories=course.policy.categories.map(cat=>{
 const all=active.filter(e=>e.body.categoryId===cat.id&&e.body.include);
 const scored=all.filter(e=>e.body.status==='graded'&&e.body.scoreType==='numeric'&&e.body.reviewed&&e.body.score!==null&&e.body.maximum!==null);
 const total=scored.reduce((s,e)=>s+(e.body.maximum||0),0);
 const value=!scored.length?null:cat.method==='points'?scored.reduce((s,e)=>s+(e.body.score||0),0)/total*100:scored.reduce((s,e)=>s+e.body.score!/e.body.maximum!*100,0)/scored.length;
 return {...cat,value,count:scored.length,excluded:all.length-scored.length};
 });
 const used=categories.filter(c=>c.value!==null&&(c.weight??0)>0);const coverage=used.reduce((s,c)=>s+(c.weight??0),0);
 const score=course.policy.confirmed&&coverage>0&&(Math.abs(coverage-100)<0.001||course.policy.emptyCategories==='available')?used.reduce((s,c)=>s+c.value!*(c.weight??0),0)/coverage:null;
 const outstanding=active.filter(r=>r.body.include&&r.body.status!=='exempt'&&(!r.body.reviewed||r.body.status!=='graded'||r.body.scoreType!=='numeric')).length;
 const letter=score===null?'':([...course.policy.bands].sort((a,b)=>b.min-a.min).find(b=>score>=b.min)?.label||'');
 return {score,letter,coverage,categories,outstanding,provisional:coverage<99.999||outstanding>0,confirmed:course.policy.confirmed};
}
export function displayScore(r:Result){if(r.status!=='graded')return statuses[r.status];if(r.scoreType==='numeric')return `${r.score} / ${r.maximum}`;if(r.scoreType==='letter')return r.grade;return '老師評語'}
export const statuses={graded:'已評分',pending:'待評分',missing:'未交',absent:'缺席',exempt:'豁免',unknown:'原件未顯示分數'};
export const types={homework:'功課',quiz:'小測',test:'測驗',exam:'考試',project:'項目',participation:'課堂參與'};
export const defaultPolicy=():Policy=>({confirmed:false,emptyCategories:'require_all',categories:[{id:'homework',name:'Homework',weight:20,method:'points'},{id:'quizzes',name:'Quizzes',weight:20,method:'points'},{id:'tests',name:'Tests',weight:40,method:'points'},{id:'exam',name:'Final exam',weight:20,method:'points'}],bands:[]});
export function parseCSV(text:string):string[][]{
 text=text.replace(/^\uFEFF/,'');let rows:string[][]=[],row:string[]=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else if(!quoted&&cell.length)throw Error('CSV 引號格式不正確');else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(s=>s.trim()))rows.push(row);row=[];cell=''}else cell+=c;}
 if(quoted)throw Error('CSV 引號尚未關閉');row.push(cell);if(row.some(s=>s.trim()))rows.push(row);return rows;
}
export const csvHeaders=['title','date','type','category','status','score_type','score','maximum','grade','include','feedback','next_step','topics','source','external_id','attempt','series'];
export function csvCell(x:unknown){let s=String(x??'');if(/^\s*[=+@\t\r]/.test(s)||/^\s*-[^0-9]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}
export function toCSV(rows:unknown[][]){return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')}
export function importPreview(text:string,courseEntry:Entry<Course>,records:Entry[]){
 const table=parseCSV(text);if(table.length<2)throw Error('CSV 需要標題行及至少一行成績');if(table.length>201)throw Error('每次最多匯入 200 行');
 const headers=table[0].map(s=>s.trim().toLowerCase());if(new Set(headers).size!==headers.length)throw Error('CSV 欄位不可重複');for(const key of ['title','date','type','category','status','score_type'])if(!headers.includes(key))throw Error('CSV 缺少欄位：'+key);
 const seen=new Set(records.filter(r=>r.kind==='result').map(r=>fingerprint(r.body as Result)));const course=courseEntry.body;
 return table.slice(1).map((cells,i)=>{try{
 if(cells.length!==headers.length)throw Error('欄位數量與標題不一致');const row=Object.fromEntries(headers.map((h,j)=>[h,cells[j]?.trim()||'']));const cat=course.policy.categories.find(c=>c.name.toLowerCase()===row.category.toLowerCase()||c.id===row.category);if(!cat)throw Error('未知評分類別：'+row.category);
 const boolean=(v:string)=>{if(v===''||v==='true'||v==='1')return true;if(v==='false'||v==='0')return false;throw Error('include 只接受 true 或 false')};const numeric=(v:string)=>v===''?null:Number(v);
 const body=schemas.result.parse({studentId:course.studentId,termId:course.termId,courseId:courseEntry.id,title:row.title,date:row.date,type:row.type,categoryId:cat.id,status:row.status,scoreType:row.score_type,score:numeric(row.score||''),maximum:numeric(row.maximum||''),grade:row.grade||'',include:boolean(row.include||''),feedback:row.feedback||'',nextStep:row.next_step||'',topics:row.topics||'',source:row.source||'CSV 匯入',externalId:row.external_id||'',attempt:row.attempt?Number(row.attempt):1,series:row.series||'',reviewed:true});
 const key=fingerprint(body);if(seen.has(key))return{line:i+2,body,state:'duplicate' as const,error:'重複記錄，將略過'};seen.add(key);return{line:i+2,body,state:'ready' as const,error:''};
 }catch(e){return {line:i+2,body:null,state:'invalid' as const,error:message(e)}}});
}
export function message(e:unknown){return e instanceof z.ZodError?e.issues.map(i=>i.message).join('；'):e instanceof Error?e.message:'操作未完成'}
