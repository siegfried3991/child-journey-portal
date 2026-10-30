import {z} from 'zod';
import {validate,validateRelations,type Entry,type Kind,type Course,type Result} from './academic.ts';

const text=z.string().max(2000),short=z.string().min(1).max(300);
const number=z.number().finite().nonnegative();
const source=z.object({id:short,name:short,sha256:z.string().regex(/^[a-f0-9]{64}$/),bytes:z.number().int().positive(),included_as_student_record:z.boolean(),pack_path:text.optional(),title:text.optional()}).passthrough();
const mark=z.object({raw:text,letter:text.nullable(),score:number.nullable(),status:text}).passthrough();
export const referenceSchema=z.object({
 schema_version:z.literal('academic-reference-1.0'),prepared_on:short,student:z.object({name:short,school_student_id:short}).passthrough(),
 source_documents:z.array(source).min(1).max(100),
 historical_course_results:z.array(z.object({school_year:short,grade:z.number().int(),course:short,source_id:short,results:z.record(mark)}).passthrough()).max(300),
 primary_school_results:z.array(z.object({school_year:short,grade:z.number().int(),semester:z.number().int(),subject_raw:short,final_exam_raw:text,comprehensive_evaluation_raw:text,source_id:short}).passthrough()).max(300),
 published_course_results:z.array(z.object({report_id:short,source_id:short,school_year:short,grade:z.number().int(),course:short,teacher:text,comment:text,results:z.record(mark)}).passthrough()).max(500).optional(),
 current_school_snapshots:z.array(z.object({id:short,school_year:short,course:short,class_code_raw:text,teacher_raw:text,reported_percent:number.max(100),reported_letter:text,printed_date:text.nullable(),source_ids:z.array(short)}).passthrough()).max(30),
 category_summaries:z.array(z.object({report_id:short,source_id:short,category_raw:short,points_earned:number,points_possible:number.positive(),reported_percent:number,reported_letter:text}).passthrough()).max(300),
 assignments:z.array(z.object({id:short,report_id:short,source_id:short,date:short,category_raw:short,title:short,score:number.nullable(),points_possible:number.positive(),reported_percent:number.nullable(),reported_letter:text.nullable(),score_status:text,note:text.nullable()}).passthrough()).max(500),
 handwritten_tracker:z.object({source_id:short,school_year:short,columns:z.array(z.object({label:short,date:text.nullable(),date_status:short}).passthrough()).length(3),rows:z.array(z.object({course_raw:short,display_course:short,marks:z.array(number.max(100)).length(3),mark3_confirmation:text.nullable()}).passthrough()).max(30)}).passthrough(),
 standardized_assessments:z.array(z.object({subject:short,term:short,grade:z.number().int(),rit_score:number,achievement_percentile:number.max(100),growth_percentile:number.max(100).optional(),source_id:short}).passthrough()).max(100),
 summer_report:z.object({source_id:short,date:short,course:short,competencies:z.array(z.object({name:short,rating:short}).passthrough()).max(30)}).passthrough(),
 issues:z.array(z.object({id:short,status:short,item:short,detail:text}).passthrough()).max(100)
}).passthrough().superRefine((d,ctx)=>{
 const ids=new Set(d.source_documents.map(s=>s.id));
 if(ids.size!==d.source_documents.length)ctx.addIssue({code:'custom',message:'來源編號不可重複'});
 const reports=new Set(d.current_school_snapshots.map(s=>s.id));
 for(const r of [...(d.published_course_results||[]),...d.historical_course_results,...d.primary_school_results,...d.standardized_assessments,...d.assignments,...d.category_summaries,d.handwritten_tracker,d.summer_report])if(!ids.has(r.source_id))ctx.addIssue({code:'custom',message:'記錄引用了不存在的來源'});
 for(const r of d.current_school_snapshots)for(const id of r.source_ids)if(!ids.has(id))ctx.addIssue({code:'custom',message:'成績單來源不存在'});
 for(const r of [...d.assignments,...d.category_summaries])if(!reports.has(r.report_id))ctx.addIssue({code:'custom',message:'評估引用了不存在的成績單'});
 for(const r of d.assignments)if((r.score===null)!==(r.score_status==='blank_in_source'))ctx.addIssue({code:'custom',message:'空白分數狀態與原件不符'});
});
export type Reference=z.infer<typeof referenceSchema>;
export const REFERENCE_ID='import-academic-reference-v1';
export const STUDENT_ID='import-student-v1';
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const termId=(year:string)=>'import-year-'+year;
const courseId=(year:string,name:string)=>('import-course-'+year+'-'+slug(name)).slice(0,80);

export function buildReferenceEntries(input:unknown):{dataset:Reference;entries:Entry[]}{
 const dataset=referenceSchema.parse(input),d=dataset,entries:Entry[]=[];
 function add(id:string,kind:Kind,body:unknown){const clean=validate(kind,body);validateRelations(kind,clean,entries);entries.push({id,kind,body:clean,revision:1,archived:false,createdAt:'',updatedAt:''});return id;}
 add(STUDENT_ID,'student',{name:d.student.name,school:typeof d.student.school==='string'?d.student.school:'',grade:'Grade 9',curriculum:'US-style',isDemo:false});
 const years=[...new Set([...d.historical_course_results,...d.primary_school_results,...d.current_school_snapshots].map(r=>r.school_year))].sort();
 for(const year of years)add(termId(year),'term',{name:'全年學習記錄',year,start:null,end:null});
 function course(year:string,name:string,grade:string,source:string,categories:string[],extra:Partial<Course>={}){
  return add(courseId(year,name),'course',{studentId:STUDENT_ID,termId:termId(year),name,code:'',teacher:'',level:'Other',credits:null,reportedGrade:grade,reportedSource:source,policy:{confirmed:false,emptyCategories:'require_all',bands:[],categories:categories.map((name,i)=>({id:'category-'+i,name,weight:null,method:'points'}))},...extra});
 }
 for(const c of d.historical_course_results)course(c.school_year,c.course,c.results['Final Grade']?.raw||'',c.source_id+' · 年終成績單；各季與期末考試另見成績單資料庫',['Report']);
 const reportCourses=new Map<string,string>();
 const links:Record<string,string>={'Econ':'R-G9-ECON-MQ1','Lit':'R-G9-LIT-MQ1','Lang':'R-G9-LANG-MQ1'};
 for(const c of d.current_school_snapshots){
  const categories=[...new Set([...d.category_summaries,...d.assignments].filter(r=>r.report_id===c.id).map(r=>r.category_raw))];
  const id=course(c.school_year,c.course,`${c.reported_percent}% · ${c.reported_letter}`,`${c.source_ids.join(' / ')} · Q1 期中快照 · ${c.printed_date||'日期未提供'}`,categories,{code:c.class_code_raw,teacher:c.teacher_raw,level:c.course.startsWith('AP ')?'AP':c.course.startsWith('Honors ')?'Honors':'Other'});
  reportCourses.set(c.id,id);
 }
 for(const r of d.handwritten_tracker.rows)if(!links[r.course_raw])course(d.handwritten_tracker.school_year,r.display_course,'','手寫進度另見成績單資料庫；完整課程名稱及學分未提供',['Records']);
 for(const a of d.assignments){
  const c=entries.find(e=>e.id===reportCourses.get(a.report_id))!;
  const cb=c.body as Course;
  const type:Result['type']=a.category_raw==='Homework'?'homework':/exam/i.test(a.title)?'exam':/quiz/i.test(a.title)?'quiz':a.category_raw==='Classwork'?'participation':'test';
  add('import-assignment-'+a.id,'result',{studentId:STUDENT_ID,termId:cb.termId,courseId:c.id,title:a.title,date:a.date,type,categoryId:cb.policy.categories.find(x=>x.name===a.category_raw)!.id,status:a.score===null?'unknown':'graded',scoreType:'numeric',score:a.score,maximum:a.points_possible,grade:a.reported_letter||'',include:true,feedback:a.note||'',nextStep:'',topics:'',source:a.source_id+' · '+a.report_id,externalId:'academic-reference-v1:'+a.id,attempt:1,series:'',reviewed:true});
 }
 add(REFERENCE_ID,'report',{studentId:STUDENT_ID,termId:termId(d.handwritten_tracker.school_year),title:'歷年成績單與進度資料庫',referenceId:d.schema_version,sourceIds:d.source_documents.filter(s=>s.included_as_student_record).map(s=>s.id),data:d});
 if(new Set(entries.map(e=>e.id)).size!==entries.length)throw Error('匯入資料有重複識別碼');
 return{dataset:d,entries};
}
