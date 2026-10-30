import {z} from 'zod';
import type {ApplicationPlan,Task} from './admissions';
export const routeSchema=z.object({regions:z.array(z.enum(['US','UK','HK'])).min(1).max(3).default(['US','UK','HK']),subject:z.enum(['explore','stem','business','humanities','creative','health']).default('explore'),qualification:z.enum(['AP','IB','Alevel','other']).default('AP'),us:z.enum(['research','liberal','public','arts']).default('research'),uk:z.enum(['standard','early','arts']).default('standard'),hk:z.enum(['broad','professional']).default('broad'),residency:z.enum(['unknown','local','nonlocal']).default('unknown'),hours:z.number().int().min(1).max(20).default(4),budget:z.string().max(300).default(''),reviewNote:z.string().max(1000).default(''),reviews:z.array(z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),note:z.string().min(1).max(1000)}).strict()).max(50).default([])}).strict();
export type Route=z.infer<typeof routeSchema>;
export const routeDefaults=()=>routeSchema.parse({});
export const routeChecked='2026-10-30';
export const routeSources=[
{id:'jupas',name:'JUPAS · 資格渠道',url:'https://www.jupas.edu.hk/en/eligibility/eligibility-requirements/',detail:'JUPAS 須滿足相關身份及 HKDSE 資格；持 AP/IB/A-level 不因香港身份自動改走 JUPAS。'},
{id:'aamc',name:'AAMC · 美國醫學資格',url:'https://students-residents.aamc.org/medical-school-admission-requirements/admission-requirements',detail:'常規美國醫學院要求先完成四年本科，先修科因校而異；與英港本科醫學不同。'},
{id:'ed',name:'College Board · ED/EA',url:'https://counselors.collegeboard.org/college-application/early-decision-action',detail:'Early Decision 具約束力；與學生、家長及升學老師核對費用與承諾。EA 與 REA 的同申限制須逐校確認。'},
{id:'offers',name:'UCAS · Firm / Insurance',url:'https://www.ucas.com/undergraduate/after-you-apply/types-undergraduate-offers/replying-your-ucas-undergraduate-offers',detail:'Firm 為第一選擇；insurance 是 conditional firm 的備選。回覆日期與條件須依 UCAS 帳戶及 offer 確認。'},
{id:'ucas',name:'UCAS · 2027 日期',url:'https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications',detail:'2027：2026-05-12 建立申請；09-01 起可提交。Oxford/Cambridge 及多數醫牙獸醫 10-15 18:00 UK；多數其他課程 2027-01-13 18:00 UK。校內截止更早。'},
{id:'statement',name:'UCAS · 個人陳述',url:'https://www.ucas.com/applying/applying-to-university/writing-your-personal-statement/the-new-personal-statement-for-2026-entry',detail:'2026 起三題：學科動機、學習準備、課外準備。合計 4,000 字元，每題至少 350；未來週期重查。'},
{id:'harvard',name:'Harvard · 美國輪次例子',url:'https://college.harvard.edu/admissions/apply/first-year-applicants',detail:'現行例子：Common App 08-01 開放；REA 11-01；RD 01-01；通常 05-01 回覆。REA 有同申限制；不能當作所有美國大學的日期。'},
{id:'uc',name:'University of California · 獨立申請',url:'https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-first-year/dates-and-deadlines.html',detail:'2027 秋季：2026-08-01 開放，10-01 至 11-30 提交。2027-05-01 SIR；07-01 最終成績單，07-15 AP/IB。另核對專業及資助。'},
{id:'hku',name:'HKU · International Qualifications',url:'https://admissions.hku.hk/apply/international-qualifications',detail:'2027：2026-09-23 開放；11-25 中午 HKT 首輪；12-01 首輪支持文件／預測成績；之後滾動，2027-08-25 中午關閉。課程可另設期限。'},
{id:'hkust',name:'HKUST · International Qualifications',url:'https://join.hkust.edu.hk/admissions/international-qualifications',detail:'2027：2026-10-02 開放；11-25 Priority Round；11-26 起滾動；12 月下旬起發 offer；2027-06-30 關閉。'},
{id:'cuhk',name:'CUHK · 本地 Non-JUPAS 年一',url:'https://admission.cuhk.edu.hk/application/non-jupas/application-guide/',detail:'2027：2026-11-12 Advance Offer；2027-01-07 Regular。不能混用 Senior Year（高年級入學）期限。'},
{id:'cuhk-int',name:'CUHK · International 年一',url:'https://admission.cuhk.edu.hk/application/overseas-other-qualifications-non-local-international-team/application-guides/',detail:'2027 同為 2026-11-12 Advance Offer、2027-01-07 Regular。官方搜尋內容已核對；完整頁面擷取暫時失敗，申請前再確認身份／資格渠道。'},
{id:'oxford',name:'Oxford · US/AP 資格及科目',url:'https://www.ox.ac.uk/admissions/undergraduate/courses/admissions-requirements/international-qualifications',detail:'依課程查 AP 科目與成績組合。AP Precalculus 不能滿足指定數學要求；校內成績與 AP 考試分數須分開。'},
{id:'cambridge',name:'Cambridge · 專業測試',url:'https://www.undergraduate.study.cam.ac.uk/apply/how/admission-tests',detail:'依課程可能須 ESAT、TMUA、UCAT 或 College assessment；部分須提前註冊。註冊期限可早於 UCAS。'},
{id:'oxbridge',name:'Oxford · UCAS 選擇限制',url:'https://www.ox.ac.uk/admissions/undergraduate/applying/guide-for-applicants/ucas-application',detail:'UCAS 通常最多五個選擇；Oxford 通常只選一課程，同年不可同申 Oxford/Cambridge。'}
];
export function routeTasks(p:ApplicationPlan):Task[]{
 const r=p.route,y=p.entryYear,out:Task[]=[];
 const add=(id:string,title:string,due:string,phase:string,deliverable:string,source?:string)=>out.push({id:'route:'+id,title,due,phase,deliverable,owner:'學生 + 家長 + 升學老師',official:false,source:routeSources.find(s=>s.id===source)?.url});
 add('g9-baseline','G9 · 建立學習與探索基線',`${y-4}-10-31`,'共同基礎','保存原始成績、評語與作品；試兩個興趣問題。優先學科理解、閱讀寫作、訂正、合作與休息。');
 add('g9-prerequisites','G9 · 檢查可能專業的先修科',`${y-3}-02-28`,'共同基礎','為兩至三個可能專業查數學、科學、語言、作品集要求；在 G10 選課前與老師核對，避免太晚失去選擇。','oxford');
 add('g9-trial','G9 · 完成一次真實體驗',`${y-3}-06-15`,'共同基礎','小研究、服務、創作或程式皆可；留下作品、自己的貢獻、困難與反思。付費夏校不是必要條件。');
 add('g10-depth','G10 · 深入主題並保留第二興趣',`${y-3}-10-31`,'共同基礎','持續一項活動／問題，保存作品版本與回饋；不設定獎項或活動數量配額。');
 add('g10-subjects','G10 · 確認 G11–12 選科與資格',`${y-2}-02-28`,'共同基礎',`以 ${r.qualification} 路徑核對各專業必修科、考試、畢業要求與負荷；不為三地同申而同時修三種學制。`,'oxford');
 add('g10-gate','G10 結束 · 決定主線及備選',`${y-2}-06-15`,'共同基礎','比較興趣證據、成績、先修科、費用與家庭偏好；可保留兩至三地。記錄選擇理由、風險及重新檢討條件。');
 if(r.regions.includes('US')){
 add('us-fit','G11 · 美國學校類型與測試策略',`${y-2}-09-30`,'美國分支',`${{research:'研究型：學科深度、研究／實作與貢獻。',liberal:'文理學院：廣泛學習、小班討論與社群適合。',public:'公立／UC：課程要求、獨立平台與費用。',arts:'藝術／表演：作品集、試鏡及專業評審。'}[r.us]}逐校核對 SAT/ACT、英文與資助；不假定統一政策。`,'harvard');
 add('us-evidence','G11 下 · 推薦人與真實成果',`${y-1}-04-30`,'美國分支','保存完整高中成績與課程背景；與了解學習過程的老師溝通推薦。整理角色、成果、反思，學校要求的材料優先。');
 add('us-summer','G11 暑期 · 選校、文書與輪次',`${y-1}-08-01`,'美國分支','建立課程與費用均合適的選校組合；準備 Common App、校別短文。ED 具約束力；EA/REA 各校同申限制與資助另查。','harvard');
 add('us-submit','G12 秋冬 · 美國逐校申請',`${y-1}-10-01`,'美國分支','規劃窗口：早申常在 10–11 月、常規多在 12–1 月，須逐校確認。UC 獨立平台；推薦、測試、作品集及資助期限分開。','uc');
 }
 if(r.regions.includes('UK')){
 add('uk-fit','G11 · 英國課程匹配與學科投入',`${y-2}-09-30`,'英國分支','聚焦相關課程群；列出資格、先修 AP/IB/A-level 科目、英文與測試。用有反思的閱讀、解題或作品證明學科動機。','oxford');
 if(r.uk==='early')add('uk-early','G11 下 · Oxbridge／醫牙獸醫提早準備',`${y-1}-03-31`,'英國分支','核對課程、資格、體驗及國際生限制；先查測試註冊／考期。Oxford/Cambridge 原則擇一；不是所有名校都走十月路線。','cambridge');
 if(r.uk==='arts')add('uk-arts','G11 下 · 作品集／試鏡路徑',`${y-1}-03-31`,'英國分支','確認 UCAS Undergraduate、Conservatoires 或直接申請；保存作品過程與試鏡素材。音樂院不能套用一般 UCAS 日期。','ucas');
 add('uk-draft','G11 暑期 · UCAS、推薦與預測成績',`${y-1}-07-31`,'英國分支','與學校確認內部截止、推薦與預測成績；以真實學習經歷回答三題個人陳述，當年格式重查。','statement');
 add('uk-submit','G12 · 英國提交與面試',`${y-1}-${r.uk==='early'?'09-01':'11-01'}`,'英國分支',r.uk==='early'?'為十月路線提前完成推薦、測試、成績及補充表格；按精確課程檢查面試。':'一般課程以一月 equal consideration 為規劃窗口；藝術、音樂與個別課程另查，不能用最晚關閉日取代主要截止。','ucas');
 }
 if(r.regions.includes('HK')){
 add('hk-fit','G11 · 香港身份、資格與專業',`${y-2}-09-30`,'香港分支',`身份：${{unknown:'待確認',local:'家庭標示本地，須大學確認',nonlocal:'家庭標示非本地，須大學確認'}[r.residency]}。US/AP、IB、A-level 須走相應資格渠道；不是有香港身份就走 JUPAS。逐科查語言與先修科。`,'hku');
 add('hk-evidence','G11 下 · 香港課程及面試準備',`${y-1}-04-30`,'香港分支',r.hk==='professional'?'醫療、法律、建築等逐課程查科目、語言、專業認可、國際生限制及面試／作品集；通用校級要求不等於專業要求。':'比較 broad-based、學院及直接入專業安排；查延後分流／轉專業規則，準備學科動機與合作經驗。','hkust');
 add('hk-submit','G12 秋季 · 香港獨立申請',`${y-1}-09-15`,'香港分支','以秋季開放、十一月早輪作規劃窗口；逐校建立申請。預測成績、推薦、文件、面試、獎學金與接受 offer 可有不同期限。','hku');
 }
 if(r.subject!=='explore')add('subject','G11 前 · 專業特殊條件核對',`${y-2}-07-15`,'學科條件',({stem:'STEM：檢查 calculus、物理／化學與 AP 組合，以解題或設計作品驗證興趣。',business:'經濟／商科：區分數理 Economics 與 Business，核對數學要求；做有資料依據的分析。',humanities:'人文／社科：練習閱讀、論證與資料評估；法律課程另查專業測試與語言。',creative:'創意／表演：保存創作過程、權屬與回饋，檢查作品集／試鏡格式及截止。',health:'醫療：核對科學先修科、體驗、測試、國際生限制與認可。美國常規醫學學位通常在本科之後，不能套用英港本科醫學。'} as Record<string,string>)[r.subject]);
 add('review','每學期 · 依成績與負荷檢討',`${y-2}-12-15`,'路線檢討',`每週 ${r.hours} 小時是家庭課外準備預算，不是錄取要求。學期末比較興趣、同科趨勢、先修缺口與負荷；不因一次考試自動刪除路線。另可新增各學期檢討日期。`);
 add('offers','G12 春季 · 比較 offer 與條件',`${y}-03-15`,'錄取與入學','比較課程、總費用、資助、條件、接受期限及按金。香港 offer 可能較早到期，不假定可等美國結果；UK firm/insurance 規則另查。');
 add('enrol','畢業暑期 · 條件與入學交接',`${y}-06-15`,'錄取與入學','核對最終成績、AP/IB/A-level 結果、語言條件、註冊、住宿與簽證。依每校實際期限調整。');
 return out;
}
