export function routeReview({score,interest,capacity}) {
  if (!Number.isFinite(score)||score<0||score>100) throw new Error('Score must be 0–100');
  const reasons=[];
  if(score<75)reasons.push('最近的示例測驗低於自訂複習線 75：先檢視錯題與支持需要。');
  if(interest==='unsure')reasons.push('興趣仍在探索：先安排一次短體驗，再討論長期路線。');
  if(capacity==='low')reasons.push('本月時間較少：把大型項目縮成一個 45 分鐘的小試驗。');
  return {status:reasons.length?'建議共同檢視':'維持探索計劃',reasons:reasons.length?reasons:['示例條件沒有觸發檢視；仍需查核課程要求與學生意願。'],action:capacity==='low'?'完成一張使用者訪談卡':interest==='unsure'?'訪談一位從業者並試做小作品':score<75?'整理錯題，安排一次老師答疑':'完成校園用品改良原型'};
}
export function filterRecords(rows,{type='all',subject='all',query=''}={}){return rows.filter(r=>(type==='all'||r.type===type)&&(subject==='all'||r.subject===subject)&&`${r.title} ${r.subject}`.toLowerCase().includes(query.toLowerCase()));}
export function evidenceCoverage(skills,observations){return new Set(observations.map(o=>o.skill).filter(id=>skills.some(s=>s.id===id))).size;}
