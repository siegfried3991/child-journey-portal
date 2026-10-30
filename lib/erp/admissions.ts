import {z} from 'zod';
import {routeSchema,routeDefaults,routeTasks} from './routes.ts';
import catalog from './admissions-catalog.json' with {type:'json'};
export const universities=catalog;
export type University=typeof catalog[number];
export const researchCycle=2027;
export const checkedAt='2026-10-29';
const day=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>{const d=new Date(s+'T12:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s},'日期不存在');
const optionalDay=z.union([z.literal(''),day]);
export const evidenceSchema=z.object({id:z.string().min(8).max(80),kind:z.enum(['project','activity','award','academic','service','work']),title:z.string().trim().min(1).max(160),start:optionalDay,end:optionalDay,role:z.string().max(160),hours:z.number().min(0).max(10000).nullable(),outcome:z.string().max(2000),source:z.string().max(2000),status:z.enum(['planned','in_progress','completed']),reviewed:z.boolean()}).strict().superRefine((v,c)=>{if(v.start&&v.end&&v.end<v.start)c.addIssue({code:'custom',message:'結束日不可早於開始日'});if(v.reviewed&&(v.status!=='completed'||!v.source.trim()||!v.outcome.trim()))c.addIssue({code:'custom',message:'核對成就前，請完成項目並填寫成果及來源'});});
export const milestoneSchema=z.object({id:z.string().min(8).max(80),title:z.string().trim().min(1).max(160),due:day,owner:z.string().trim().min(1).max(160),deliverable:z.string().max(2000),source:z.union([z.literal(''),z.string().url().max(2000)]).default('')}).strict();
export type Milestone=z.infer<typeof milestoneSchema>;
export const applicationPlanSchema=z.object({route:routeSchema.default({}),studentId:z.string().min(1).max(160),title:z.string().trim().min(1).max(160),entryYear:z.number().int().min(2027).max(2040),subject:z.string().max(160),targets:z.array(z.object({universityId:z.string().max(160),roundId:z.string().max(80)}).strict()).max(62),tasks:z.array(z.object({id:z.string().max(200),done:z.boolean(),note:z.string().max(2000),due:optionalDay}).strict()).max(1000),evidence:z.array(evidenceSchema).max(200),academicIds:z.array(z.string().max(160)).max(300),customTasks:z.array(milestoneSchema).max(100).default([])}).strict().superRefine((p,c)=>{if(new Set(p.targets.map(t=>t.universityId)).size!==p.targets.length)c.addIssue({code:'custom',message:'每所大學請選一個申請輪次'});for(const t of p.targets){const u=universities.find(u=>u.id===t.universityId);if(!u?.rounds.some(r=>r.id===t.roundId))c.addIssue({code:'custom',message:'大學或輪次不存在，請重新選擇'});}for(const k of ['tasks','evidence','customTasks'] as const)if(new Set(p[k].map(t=>t.id)).size!==p[k].length)c.addIssue({code:'custom',message:'記錄編號不可重複'});if(new Set(p.academicIds).size!==p.academicIds.length)c.addIssue({code:'custom',message:'學業記錄不可重複'});});
export type ApplicationPlan=z.infer<typeof applicationPlanSchema>;
export type Evidence=z.infer<typeof evidenceSchema>;
export type Task={id:string,title:string,due:string,owner:string,phase:string,deliverable:string,university?:string,official:boolean,source?:string,deadline?:boolean};
export function blankPlan(studentId:string):ApplicationPlan{return{route:routeDefaults(),studentId,title:'University application plan',entryYear:2027,subject:'',targets:[],tasks:[],evidence:[],academicIds:[],customTasks:[]};}
export function todayHK(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function shiftDay(date:string,days:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function projectedDate(date:string,year:number){return String(Number(date.slice(0,4))+year-researchCycle)+date.slice(4);}
export function selectedDeadline(p:ApplicationPlan,t:ApplicationPlan['targets'][number]){const u=universities.find(u=>u.id===t.universityId)!;const r=u.rounds.find(r=>r.id===t.roundId)!;return{university:u,round:r,date:projectedDate(r.date,p.entryYear),official:p.entryYear===researchCycle&&!u.conflict};}
export function makeTimeline(p:ApplicationPlan):Task[]{
 const y=p.entryYear,targets=p.targets.map(t=>selectedDeadline(p,t));
 const first=targets.map(t=>t.date).sort()[0]||`${y-1}-11-01`;
 const task=(id:string,title:string,due:string,owner:string,phase:string,deliverable:string):Task=>({id,title,due,owner,phase,deliverable,official:false});
 const tasks=[
 task('explore','探索真正想深入的學科',`${y-4}-09-15`,'學生 + 家長','探索','選兩個興趣問題，試讀、參觀或做小作品；記下喜歡與不喜歡的原因。'),
 task('subjects','與學校核對四年選科及畢業要求',`${y-3}-03-01`,'學生 + 升學老師','學術準備','核對目標專業先修科、AP 選科、課程負荷和畢業資格；不要只追 AP 門數。'),
 task('project-start','開始一項可持續的項目或貢獻',`${y-3}-09-15`,'學生','持續投入','定義要解決的問題、自己的責任、每週可投入時間與第一個可展示成果。'),
 task('evidence-review','整理作品、服務與學習證據',`${y-2}-03-01`,'學生 + 家長','持續投入','每學期記錄實際角色、投入、作品、改進與反思；獎項是可能成果，不是必備配額。'),
 task('testing-map','建立測試及重考安排',`${y-2}-09-15`,'學生 + 升學老師','學術準備','按學校決定 SAT/ACT/AP、英文或專業測試；核對考位、註冊截止與送分時間。'),
 task('shortlist','平衡選校與學費資助方案',`${y-1}-03-01`,'學生 + 家長 + 升學老師','選校','按課程、適合程度、費用及錄取不確定性配置選項；排名不代表保底。'),
 task('summer-output','完成一份能說明成長的作品',`${y-1}-07-15`,'學生','作品與申請','可為研究報告、程式、創作、社區項目或工作成果；保存自己的貢獻與限制。'),
 task('cycle-refresh','重新核對當年官方規則',`${y-1}-08-01`,'學生 + 升學老師','申請程序','逐校確認當年截止、推薦人、科目、測試與資助條件；未公布的年份只用作規劃。'),
 ];
 tasks.splice(0,tasks.length,...routeTasks(p),...tasks.filter(t=>t.id==='cycle-refresh'));
 for(const t of targets){const prefix=t.university.id+':'+t.round.id;const common={university:t.university.name,source:t.university.sources[0]};
  const add=(id:string,title:string,days:number,owner:string,deliverable:string)=>tasks.push({...task(prefix+':'+id,title,shiftDay(t.date,days),owner,'申請程序',deliverable),...common});
  add('requirements','核對專業、資格與測試註冊',-120,'學生 + 升學老師','填寫精確專業名稱；核對先修科、作品集、面試、英文及專業測試。測試註冊可能比申請早數月。');
  add('references','與推薦人確認安排',-56,'學生 + 推薦老師',t.university.references+'。如不接受推薦信，改為核對成績單或學校資料流程。');
  add('draft','完成活動記錄、個人陳述與短文初稿',-42,'學生','用實際例子寫明動機、學術投入及貢獻。UK 側重所選學科，US 按各校題目；不假定獨立 CV 必須上傳。');
  add('materials','核對成績單、預測成績與送分',-28,'學生 + 學校','確認原件、翻譯、推薦及測試結果能按官方支持文件期限到達。');
  add('review','完成申請及資助資料複核',-14,'學生 + 家長','逐項核對活動日期、角色、獎項範圍、文書、費用及資助另行截止；保留提交前副本。');
  add('submit','提前提交並保存確認',-3,'學生','完成付款或費用豁免，保存申請編號、收件及提交確認；不要將草稿當作已提交。');
  tasks.push({...task(prefix+':deadline','申請截止',t.date,'學生','截止日期',t.round.label+'；核對官方時區、專業及支持文件的獨立期限。'),...common,deadline:true,official:t.official});
  add('portal','檢查申請平台及缺件',2,'學生','確認平台顯示已提交與文件完整；按官方要求補件、準備面試。');
 }
 for(const t of p.customTasks||[])tasks.push({...t,id:'custom:'+t.id,phase:'個人安排',official:false});
 const overrides=new Map(p.tasks.map(t=>[t.id,t]));
 return tasks.map(t=>({...t,due:t.deadline?t.due:overrides.get(t.id)?.due||t.due})).sort((a,b)=>a.due.localeCompare(b.due)||a.id.localeCompare(b.id));
}
export function taskState(t:Task,p:ApplicationPlan,today=todayHK()){const done=p.tasks.find(x=>x.id===t.id)?.done;if(done)return'completed';return t.due<today?(t.university?'overdue':'review'):t.due<=shiftDay(today,30)?'soon':'planned';}
const icalText=(s:string)=>s.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(';','\\;').replaceAll(',','\\,');
export function calendar(p:ApplicationPlan){const now=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Child Journey//Application Plan//EN','CALSCALE:GREGORIAN'];for(const t of makeTimeline(p).filter(t=>!p.tasks.find(x=>x.id===t.id)?.done)){lines.push('BEGIN:VEVENT','UID:'+t.id+'-'+p.entryYear+'@child-journey','DTSTAMP:'+now,'DTSTART;VALUE=DATE:'+t.due.replaceAll('-',''),'DTEND;VALUE=DATE:'+shiftDay(t.due,1).replaceAll('-',''),'SUMMARY:'+icalText((t.official?'':'[Planning] ')+(t.university?t.university+' · ':'')+t.title),'DESCRIPTION:'+icalText(t.deliverable+'\nAll-day reminder only; verify official local closing time.\n'+(t.source||'Family planning suggestion')),'END:VEVENT');}lines.push('END:VCALENDAR');return lines.flatMap(line=>{let parts=[],current='';for(const ch of line){if(new TextEncoder().encode(current+ch).length>70){parts.push(current);current=' '+ch}else current+=ch}parts.push(current);return parts}).join('\r\n')+'\r\n';}
export function cvText(p:ApplicationPlan,name:string,academic:string[]=[]){const lines=[name+' — Evidence CV','Intended entry: '+p.entryYear,'Subject interests: '+(p.subject||'Not yet selected'),'Self-reported record; a preparation document, not an admission prediction.',''];for(const e of p.evidence.filter(e=>e.status==='completed')){lines.push(e.title+' ['+e.kind+']',[(e.start||'Date not recorded')+(e.end?' to '+e.end:''),e.role,e.hours===null?'':e.hours+' total hours'].filter(Boolean).join(' | '),e.outcome||'Outcome not recorded','Evidence: '+(e.source||'Not supplied'),e.reviewed?'Parent/student marked source checked (not independently verified)':'Source not checked','');}if(academic.length)lines.push('Linked academic records (original scales retained)',...academic);if(!p.evidence.some(e=>e.status==='completed')&&!academic.length)lines.push('No completed evidence selected. Planned work is excluded.');return lines.join('\n');}
