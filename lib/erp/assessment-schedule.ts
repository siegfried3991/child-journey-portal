import {z} from 'zod';
const text=z.string().trim().min(1).max(160);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v+'T12:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v},'日期不存在');
export const assessmentScheduleSchema=z.object({studentId:text,termId:text,date,subject:text,title:text,type:z.enum(['quiz','test','exam','leq','other']),status:z.enum(['scheduled','taken','cancelled']),preparation:z.enum(['not_started','preparing','ready']),scope:z.string().trim().max(2000),notes:z.string().trim().max(2000),source:z.string().trim().max(1000),externalId:z.string().trim().max(160)}).strict();
export type AssessmentSchedule=z.infer<typeof assessmentScheduleSchema>;
export const scheduleStatuses={scheduled:'已安排',taken:'已考',cancelled:'已取消'};
export const preparationLabels={not_started:'未標記復習進度',preparing:'復習中',ready:'準備完成'};
export const assessmentTypes={quiz:'Quiz',test:'Test',exam:'Exam',leq:'LEQ',other:'其他'};
export function shanghaiDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function upcomingAssessments<T extends {body:AssessmentSchedule;archived?:boolean}>(rows:T[],studentId:string,termId:string,today=shanghaiDate()){return rows.filter(r=>!r.archived&&r.body.studentId===studentId&&r.body.termId===termId&&r.body.status==='scheduled'&&r.body.date>=today).sort((a,b)=>a.body.date.localeCompare(b.body.date)||a.body.subject.localeCompare(b.body.subject))}
export function scheduleKey(body:AssessmentSchedule){return 'schedule:'+body.studentId+':'+body.termId+':'+(body.externalId||[body.date,body.subject,body.title].join(':')).toLowerCase()}
export function scheduleDate(date:string){return new Intl.DateTimeFormat('zh-Hant',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'}).format(new Date(date+'T12:00:00+08:00'))}
