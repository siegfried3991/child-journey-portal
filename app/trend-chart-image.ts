/** Produce a self-contained image locally; no student data leaves the browser. */
export async function trendChartImage(chart:SVGSVGElement,title:string,subtitle:string,legend:{label:string;color:string}[]){
 const ns='http://www.w3.org/2000/svg',copy=chart.cloneNode(true) as SVGSVGElement;
 copy.querySelectorAll('foreignObject,.trend-hit-area').forEach(node=>node.remove());
 copy.querySelectorAll('[tabindex]').forEach(node=>node.removeAttribute('tabindex'));
 const originalWidth=chart.viewBox.baseVal.width,width=Math.max(960,originalWidth),height=Math.round(chart.viewBox.baseVal.height*width/originalWidth);
 const root=document.createElementNS(ns,'svg');root.setAttribute('xmlns',ns);root.setAttribute('width',String(width));root.setAttribute('height',String(height+180));root.setAttribute('viewBox',`0 0 ${width} ${height+180}`);
 const bg=document.createElementNS(ns,'rect');bg.setAttribute('width','100%');bg.setAttribute('height','100%');bg.setAttribute('fill','#ffffff');root.appendChild(bg);
 function text(value:string,x:number,y:number,size=14,color='#344b3e'){const el=document.createElementNS(ns,'text');el.setAttribute('x',String(x));el.setAttribute('y',String(y));el.setAttribute('font-size',String(size));el.setAttribute('fill',color);el.setAttribute('font-family','system-ui, -apple-system, sans-serif');el.textContent=value;root.appendChild(el)}
 text(title,36,36,23);text(subtitle,36,63,13);
 copy.setAttribute('y','80');copy.setAttribute('width',String(width));copy.setAttribute('height',String(height));copy.removeAttribute('class');copy.setAttribute('font-family','system-ui, -apple-system, sans-serif');root.appendChild(copy);
 legend.forEach((item,i)=>text('● '+item.label,36, height+102+i*22,14,item.color));
 text('全年匯總：科目 YTD 優先，否則已有季度簡單平均。缺少成績不算零分。',36,height+160,12,'#65715f');
 const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(root)],{type:'image/svg+xml;charset=utf-8'}));
 try{const image=new Image();image.src=url;await image.decode();const canvas=document.createElement('canvas');canvas.width=width*2;canvas.height=(height+180)*2;const ctx=canvas.getContext('2d');if(!ctx)throw Error('此瀏覽器暫未能產生圖片。');ctx.scale(2,2);ctx.drawImage(image,0,0);return canvas.toDataURL('image/png')}finally{URL.revokeObjectURL(url)}
}
