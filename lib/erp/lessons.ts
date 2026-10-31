import {z} from 'zod';
const short=z.string().trim().min(1).max(160),note=z.string().trim().max(3000).default('');
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'請填寫有效日期').refine(value=>{const d=new Date(value+'T12:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value},'日期不存在');
export const completionLabels={unknown:'完成情況未確認',not_started:'未開始',in_progress:'進行中',reported_done:'回報已完成',confirmed_done:'已核對完成'};
export const reviewLabels={unreviewed:'待核對',needs_correction:'需訂正',reviewed:'已核對'};
export const lessonTaskSchema=z.object({id:short,title:short,type:z.enum(['diagram','mcq','frq','revision','other']),target:z.number().int().min(1).max(10000).nullable(),completed:z.number().int().min(0).max(10000).nullable(),unit:z.string().trim().max(20),dueDate:date.nullable(),completion:z.enum(['unknown','not_started','in_progress','reported_done','confirmed_done']),review:z.enum(['unreviewed','needs_correction','reviewed']),notes:note}).strict().superRefine((task,ctx)=>{
 if(task.completed!==null&&task.target!==null&&task.completed>task.target)ctx.addIssue({code:'custom',message:'完成數量不可高於目標數量'});
 if(task.completion==='confirmed_done'&&task.target!==null&&task.completed!==task.target)ctx.addIssue({code:'custom',message:'核對完成前，請填寫與目標一致的完成數量'});
 if(task.completion==='confirmed_done'&&task.review==='unreviewed')ctx.addIssue({code:'custom',message:'核對完成的作業需要核對狀態'});
 if(task.completion==='not_started'&&task.completed!==null&&task.completed!==0)ctx.addIssue({code:'custom',message:'未開始的作業不可填入已完成數量'});
});
export const lessonSchema=z.object({studentId:short,termId:short,courseId:short.nullable(),date,subject:short,title:short,tutor:z.string().trim().max(160),durationMinutes:z.number().int().min(1).max(1440).nullable(),status:z.enum(['planned','recorded','cancelled']),topics:z.array(short).max(30),notes:note,source:note,externalId:z.string().trim().max(160),tasks:z.array(lessonTaskSchema).max(40)}).strict().superRefine((lesson,ctx)=>{if(new Set(lesson.tasks.map(t=>t.id)).size!==lesson.tasks.length)ctx.addIssue({code:'custom',message:'作業編號不可重複'})});
export type Lesson=z.infer<typeof lessonSchema>;
export type LessonTask=z.infer<typeof lessonTaskSchema>;
export function lessonProgress(lesson:Lesson){return{total:lesson.tasks.length,reported:lesson.tasks.filter(t=>t.completion==='reported_done').length,confirmed:lesson.tasks.filter(t=>t.completion==='confirmed_done').length,corrections:lesson.tasks.filter(t=>t.review==='needs_correction').length,unreviewed:lesson.tasks.filter(t=>t.review==='unreviewed').length}}
export function lessonExternalKey(lesson:Lesson){return lesson.externalId?'lesson:'+lesson.studentId+':'+lesson.externalId:null}
