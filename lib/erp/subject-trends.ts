import type {Reference} from './reference';
export const subjectLinks=[
{id:'english-language',family:'english',label:'English → Language',courses:['English 7','English 8','Honors English Language & Composition'],note:'G7–8 English 為共同歷史；G9 延伸至 Language。不是將舊成績重新評為 Language。'},
{id:'english-literature',family:'english',label:'English → Literature',courses:['English 7','English 8','Honors English Literature & Composition'],note:'G7–8 English 為共同歷史；G9 延伸至 Literature。兩條分支不合併平均。'},
{id:'math',family:'math',label:'數學',courses:['Algebra & Geometry I','Algebra & Geometry II','Pre-Calculus A','Precalculus'],note:'按課程序列銜接：Algebra & Geometry I → II → Pre-Calculus A；難度與考核範圍不同。'},
{id:'chinese',family:'chinese',label:'中文',courses:['Chinese 7','Chinese 8','Chinese 9'],note:'Chinese 7 → 8 → 9。'},
{id:'history',family:'history',label:'歷史',courses:['History 7','History 8','History 9'],note:'History 7 → 8 → 9。'},
{id:'biology',family:'biology',label:'生物',courses:['Biology 7','Biology 8','Honors Biology'],note:'Biology 7 → 8 → Honors Biology；Honors 課程難度可能不同。'},
{id:'chemistry',family:'chemistry',label:'化學',courses:['Chemistry 7','Chemistry 8'],note:'未有後續學校公布值時留空，不代表零分或退步。'},
{id:'physics',family:'physics',label:'物理',courses:['Physics 7','Physics 8'],note:'Physics 7 → 8；後續未有資料時留空。'},
{id:'economics',family:'economics',label:'經濟',courses:['Economics','AP Microeconomics / AP Macroeconomics'],note:'Economics → AP Microeconomics / AP Macroeconomics。AP 合併校內課程只計一筆，不拆成兩個 AP 考試分數。'},
{id:'geography',family:'geography',label:'地理',courses:['Geography 7','Geography 8'],note:'按學校原始科目銜接。'},
{id:'art',family:'art',label:'美術',courses:['Introduction to Art Studio 2D','Intermediate Art Studio 8'],note:'Introduction to Art Studio 2D → Intermediate Art Studio 8。'},
{id:'choir',family:'choir',label:'合唱',courses:['Advanced Choir','Choir'],note:'合唱獨立列示，不與美術成績合併。'},
{id:'mental-health',family:'mental-health',label:'心理健康課',courses:['Mental Health 7','Mental Health 8','Mental Health 9'],note:'S／P 等原始等級保留，不換算數字或畫成零分。'},
{id:'pe',family:'pe',label:'體育',courses:['PE & Sports 7','PE & Sports 8'],note:'體育與游泳分開列示。'},
{id:'debate',family:'debate',label:'演講與辯論',courses:['Speech & Debate 7'],note:'沒有後續資料的學期留空。'},
{id:'swimming',family:'swimming',label:'游泳',courses:['Swimming 7'],note:'沒有後續資料的學期留空。'}
];
export type TrendPoint={year:string;grade:number;period:string;course:string;raw:string;score:number|null;sourceId:string;note:string;method?:'ytd'|'mean'|'text';quarterCount?:number};
export type TrendSeries={id:string;family:string;label:string;courses:string[];note:string;points:TrendPoint[]};
export type TrendMode='annual'|'quarters'|'q1'|'final';
const norm=(s:string)=>s.trim().replace(/\s+/g,' ').toLowerCase();
export function subjectTrends(d:Pick<Reference,'historical_course_results'|'published_course_results'>):TrendSeries[]{
 const points=new Map<string,TrendPoint>();
 for(const r of [...d.historical_course_results,...(d.published_course_results||[])]){
 if(r.grade<7)continue;
 for(const [rawPeriod,m] of Object.entries(r.results)){const period=/^(ytd|ytdaverage|ytdgrade|yeartodate|yeartodateaverage)$/i.test(rawPeriod.replace(/[^a-z]/gi,''))?'YTD':rawPeriod;if(!['Q1','Q2','Q3','Q4','Final Grade','YTD'].includes(period)||!m.raw?.trim())continue;const key=[r.school_year,norm(r.course),period].join('|');points.set(key,{year:r.school_year,grade:r.grade,period,course:r.course,raw:m.raw,score:typeof m.score==='number'&&Number.isFinite(m.score)?m.score:null,sourceId:r.source_id,note:r.grade<9&&/^English [78]$/.test(r.course)?'English 共同歷史，作兩條分支的前序參照':''});}
 }
 const all=[...points.values()],used=new Set(subjectLinks.flatMap(s=>s.courses.map(norm)));
 const links=[...subjectLinks,...[...new Set(all.filter(p=>!used.has(norm(p.course))).map(p=>p.course))].map((c,i)=>({id:'unmapped-'+i,family:'other',label:c,courses:[c],note:'尚未設定跨年銜接；獨立列示，不自動歸入其他科目。'}))];
 return links.map(s=>({...s,points:all.filter(p=>s.courses.map(norm).includes(norm(p.course)))})).filter(s=>s.points.length);
}
export function trendColumns(series:TrendSeries[],mode:TrendMode){const years=[...new Map(series.flatMap(s=>s.points).map(p=>[p.year,{year:p.year,grade:p.grade}])).values()].sort((a,b)=>a.year.localeCompare(b.year));return years.flatMap(y=>(mode==='annual'?['Annual']:mode==='final'?['Final Grade']:mode==='q1'?['Q1']:['Q1','Q2','Q3','Q4']).map(period=>({...y,period,id:y.year+':'+period,label:`G${y.grade} ${period==='Annual'?'全年匯總':period==='Final Grade'?'年終':period}`})));}
export function trendPoint(s:TrendSeries,year:string,period:string){if(period==='Annual')return annualSummary(s,year);return s.points.find(p=>p.year===year&&p.period===period);}

/** Per-subject YTD only; otherwise arithmetic mean of present Q1–Q4. Never use overall GPA or final-exam scores. */
export function annualSummary(s:TrendSeries,year:string):TrendPoint|undefined{
 const rows=s.points.filter(p=>p.year===year),quarters=rows.filter(p=>/^Q[1-4]$/.test(p.period)),ytd=rows.find(p=>p.period==='YTD');
 if(ytd)return {...ytd,period:'Annual',method:'ytd',quarterCount:quarters.length,note:'學校公布的該科 YTD；保留原始值。'};
 if(!quarters.length)return undefined;
 const base=quarters.at(-1)!;
 if(quarters.every(p=>p.score!==null)){const score=quarters.reduce((n,p)=>n+p.score!,0)/quarters.length;return {...base,period:'Annual',raw:Number(score.toFixed(2)).toString(),score,method:'mean',quarterCount:quarters.length,note:`計算值：已有 ${quarters.length}/4 季的簡單平均；不含期末考試或年終總評，非學校公布 YTD。`};}
 return {...base,period:'Annual',raw:[...new Set(quarters.map(p=>p.raw))].join(' / '),score:null,method:'text',quarterCount:quarters.length,note:`已有 ${quarters.length}/4 季文字等級；不換算或計算數值平均。`};
}
