'use strict';
const money = new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP',maximumFractionDigits:0});
const number = new Intl.NumberFormat('en-GB');
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November'];
function chartModel(rows, metric) {
  const values = rows.map(row => row[metric]);
  const total = values.reduce((a,b) => a+b,0);
  const peak = values.indexOf(Math.max(...values));
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(...values,1)));
  const ceiling = Math.ceil(Math.max(...values,1)/magnitude)*magnitude;
  return {values,total,peak,ceiling};
}
// Interface
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const motion = $('#motion-toggle');
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = preference.matches;
function updateMotion(){
  document.documentElement.classList.toggle('motion-paused',paused);
  motion.setAttribute('aria-pressed',String(paused));
  motion.setAttribute('aria-label',paused?'Resume motion':'Pause motion');
  motion.title=paused?'Resume motion':'Pause motion';
  motion.firstElementChild.textContent=paused?'▷':'Ⅱ';
}
motion.hidden=false; updateMotion();
motion.addEventListener('click',()=>{paused=!paused;updateMotion();});
preference.addEventListener('change',event=>{paused=event.matches;updateMotion();});
$('#year').textContent=new Date().getFullYear();
let framePending=false;
function updateProgress(){
  const length=document.documentElement.scrollHeight-innerHeight;
  $('#reading-progress-fill').style.transform=`scaleX(${length>0?Math.min(1,scrollY/length):0})`;
  $('#back-top').hidden=scrollY<600; framePending=false;
}
function queueProgress(){if(!framePending){framePending=true;requestAnimationFrame(updateProgress);}}
window.addEventListener('scroll',queueProgress,{passive:true});
window.addEventListener('resize',queueProgress);
if('ResizeObserver' in window) new ResizeObserver(queueProgress).observe(document.body);
updateProgress();
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){if(!paused)entry.target.classList.add('enter');observer.unobserve(entry.target);}}),{threshold:0.08});
 $$('.hero,.section-heading,.project,.role,.about-top,.contact-section').forEach(el=>observer.observe(el));
}
$$('.project details').forEach(detail=>detail.addEventListener('toggle',()=>{const body=detail.querySelector('.case-detail');body.classList.toggle('detail-enter',detail.open&&!paused);}));
const projects=$$('.project');
function filterProjects(tool){
 let count=0;
 projects.forEach(card=>{card.hidden=tool!=='all'&&!card.dataset.tools.split(' ').includes(tool);if(!card.hidden)count++;});
 $$('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===tool)));
 $('#project-count').textContent=`${count} ${count===1?'project':'projects'}`;
 queueProgress();
}
$('#project-controls').hidden=false;
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>filterProjects(button.dataset.filter)));
window.addEventListener('hashchange',()=>{const target=projects.find(project=>'#'+project.id===location.hash);if(target?.hidden){filterProjects('all');target.scrollIntoView();}});
$('.contact-button').addEventListener('click',()=>{$('#contact-options').open=true;$('#contact-options summary').focus({preventScroll:true});});
$('#copy-email').addEventListener('click',async()=>{
 const status=$('#copy-status');const manual=$('#manual-copy');const input=$('#email-address');
 let copied=false;
 try{await navigator.clipboard.writeText(input.value);copied=true;}catch(error){
  manual.hidden=false;input.focus({preventScroll:true});input.select();input.setSelectionRange(0,input.value.length);
  try{copied=document.execCommand('copy');}catch(fallbackError){copied=false;}
 }
 if(copied){manual.hidden=true;status.textContent='Email copied.';$('#copy-email').focus({preventScroll:true});}
 else{manual.hidden=false;input.focus();input.select();status.textContent='Select the address below and copy it.';}
});
$$('[data-resume-download]').forEach(link=>link.addEventListener('click',()=>{$('#resume-help').hidden=false;}));
$('#dismiss-resume-help').addEventListener('click',()=>{$('#resume-help').hidden=true;});
let dataset=null,metric='revenue',market='All markets',selected=null;
const svg=$('#retail-chart'),slider=$('#month-slider'),chartStatus=$('#chart-status');
function formatValue(value){return metric==='revenue'?money.format(value):number.format(value);}
function svgNode(tag,attributes={},content){const el=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attributes).forEach(([key,value])=>el.setAttribute(key,value));if(content!==undefined)el.textContent=content;return el;}
function renderChart(){
 if(!dataset)return;
 const rows=dataset.markets[market];const model=chartModel(rows,metric);
 const label=metric==='revenue'?'sales value':'orders';
 svg.replaceChildren(svgNode('title',{id:'chart-title'},`${market}: monthly ${label}, January–November 2011`),svgNode('desc',{id:'chart-description'},rows.map((row,i)=>`${monthNames[i]}: ${formatValue(row[metric])}`).join('; ')));
 const left=58,right=738,top=24,bottom=240;
 for(let i=0;i<=4;i++){
  const value=model.ceiling*i/4,y=bottom-(bottom-top)*i/4;
  svg.append(svgNode('line',{x1:left,x2:right,y1:y,y2:y,class:'chart-grid'}));
  const tick=new Intl.NumberFormat('en-GB',{notation:'compact',maximumFractionDigits:1}).format(value);
  svg.append(svgNode('text',{x:left-10,y:y+4,'text-anchor':'end',class:'chart-axis'},(metric==='revenue'?'£':'')+tick));
 }
 const points=model.values.map((value,i)=>[left+(right-left)*i/10,bottom-(bottom-top)*value/model.ceiling]);
 const path=points.map(([x,y],i)=>`${i?'L':'M'}${x},${y}`).join(' ');
 const defs=svgNode('defs'),gradient=svgNode('linearGradient',{id:'chart-fill',x1:0,y1:0,x2:0,y2:1});
 gradient.append(svgNode('stop',{offset:'0%','stop-color':'#b7cf93','stop-opacity':'.28'}),svgNode('stop',{offset:'100%','stop-color':'#b7cf93','stop-opacity':'0'}));defs.append(gradient);svg.append(defs);
 svg.append(svgNode('path',{d:`${path} L${right},${bottom} L${left},${bottom} Z`,fill:'url(#chart-fill)'}));
 svg.append(svgNode('path',{d:path,fill:'none',stroke:'#c6dda8','stroke-width':3,class:selected===null?'chart-line':''}));
 points.forEach(([x,y],i)=>{
  svg.append(svgNode('text',{x,y:270,'text-anchor':'middle',class:'chart-axis'},monthNames[i].slice(0,3)));
  if(i===selected)svg.append(svgNode('line',{x1:x,x2:x,y1:top,y2:bottom,stroke:'#c6dda8','stroke-dasharray':'3 5',opacity:'.5'}));
  const dot=svgNode('circle',{cx:x,cy:y,r:i===selected?6:3,fill:i===selected?'#fff':'#c6dda8',class:'chart-dot'});
  dot.append(svgNode('title',{},`${monthNames[i]}: ${formatValue(model.values[i])}`));svg.append(dot);
 });
 $('#readout-label').textContent=(selected===null?'PERIOD':monthNames[selected].toUpperCase())+' '+label.toUpperCase();
 $('#readout-value').textContent=formatValue(selected===null?model.total:model.values[selected]);
 $('#readout-detail').textContent=`${market==='EIRE'?'Ireland (EIRE)':market} · ${selected===null?'Jan–Nov':monthNames[selected]} 2011`;
 let observation=`${monthNames[model.peak]} recorded the highest ${label} in this period.`;
 if(selected!==null&&selected>0&&model.values[selected-1]>0){const change=(model.values[selected]/model.values[selected-1]-1)*100;observation=`${Math.abs(change).toFixed(1)}% ${change>=0?'higher':'lower'} than ${monthNames[selected-1]}.`;}
 if(selected===0)observation='The first month in this exploration.';
 $('#data-observation').textContent=observation;
 $('#reset-month').hidden=selected===null;
 if(selected!==null)slider.value=selected;
 $('#month-label').textContent=selected===null?'Full period':monthNames[selected];
 slider.setAttribute('aria-valuetext',`${monthNames[Number(slider.value)]} 2011${selected===null?' — move to inspect':''}`);
}
$$('[data-metric]').forEach(button=>button.addEventListener('click',()=>{metric=button.dataset.metric;$$('[data-metric]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));renderChart();}));
$('#market-select').addEventListener('change',event=>{market=event.target.value;renderChart();});
slider.addEventListener('input',()=>{selected=Number(slider.value);renderChart();});
slider.addEventListener('click',()=>{if(selected===null){selected=Number(slider.value);renderChart();}});
$('#reset-month').addEventListener('click',()=>{selected=null;renderChart();slider.focus({preventScroll:true});});
async function loadData(){
 chartStatus.hidden=false;chartStatus.textContent='Loading the data exploration…';
 try{
  const response=await fetch('retail-data.json');if(!response.ok)throw new Error('Dataset unavailable');
  const data=await response.json();
  if(!data.markets||!Object.values(data.markets).every(rows=>rows.length===11&&rows.every(row=>Number.isFinite(row.revenue)&&Number.isFinite(row.orders))))throw new Error('Invalid dataset');
  dataset=data;slider.disabled=false;chartStatus.hidden=true;renderChart();
 }catch(error){chartStatus.textContent='The dataset could not load. ';const retry=document.createElement('button');retry.type='button';retry.textContent='Try again';retry.addEventListener('click',loadData);chartStatus.append(retry);$('#readout-detail').textContent='Please retry to explore the data.';}
}
loadData();
