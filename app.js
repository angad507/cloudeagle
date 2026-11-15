const departments = [
  {name:'Engineering', actual:3.5, budget:4, near:true},
  {name:'Marketing', actual:1.8, budget:2, near:true},
  {name:'Sales', actual:1.2, budget:2, near:false},
  {name:'Operations', actual:1.9, budget:4, near:false}
];

const applications = [
  {name:'ChatGPT', users:140, color:'#667dec'},
  {name:'Microsoft Copilot', users:95, color:'#53a69b'},
  {name:'Claude', users:65, color:'#9a7bdc'},
  {name:'Other AI tools', users:42, color:'#dfa84c'}
];

const organizations = ['Acme Technologies','Acme Europe','Acme Sandbox'];
const $ = selector => document.querySelector(selector);

function makeDepartmentChart(){
  const host = $('#barChart');
  const max = 4.5;
  host.innerHTML = departments.map(dept => {
    const actualHeight = Math.round(dept.actual / max * 126);
    const budgetHeight = Math.round(dept.budget / max * 126);
    const utilization = (dept.actual / dept.budget * 100).toFixed(1);
    return `<div class="bar-group" aria-label="${dept.name}, ${utilization}% of budget">
      <div class="bar-pair">
        <div class="bar actual-bar ${dept.near?'near-bar':''}" style="height:${actualHeight}px" tabindex="0" title="${dept.name} actual spend: ₹${dept.actual.toFixed(1)} lakh · ${utilization}% of budget"><span class="bar-value">₹${dept.actual.toFixed(1)}L</span></div>
        <div class="bar budget-bar" style="height:${budgetHeight}px" tabindex="0" title="${dept.name} allocated budget: ₹${dept.budget.toFixed(1)} lakh"><span class="bar-value">₹${dept.budget.toFixed(1)}L</span></div>
      </div><div class="bar-label">${dept.name}</div>
    </div>`;
  }).join('');
}

function makeUsageDonut(){
  const circumference = 100;
  let offset = 0;
  const segments = applications.map(app => {
    const pct = app.users / 342 * circumference;
    const start = offset;
    offset += pct;
    return `<circle cx="75" cy="75" r="57" fill="none" stroke="${app.color}" stroke-width="21" pathLength="100" stroke-dasharray="${pct} ${circumference-pct}" stroke-dashoffset="-${start}" tabindex="0"><title>${app.name}: ${app.users} active users (${(app.users/342*100).toFixed(1)}%)</title></circle>`;
  }).join('');
  $('#usageDonut').innerHTML = `<svg class="donut-svg" viewBox="0 0 150 150" role="img" aria-label="Application usage: ChatGPT 140 users, Microsoft Copilot 95, Claude 65, other AI tools 42"><g transform="rotate(-90 75 75)">${segments}</g></svg><div class="donut-center"><strong>342</strong><span>active users</span></div>`;
  $('#usageLegend').innerHTML = applications.map(app => `<div><i class="legend-swatch" style="background:${app.color}"></i><span>${app.name}</span><strong>${app.users}</strong></div>`).join('');
}

function toast(message){
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>el.classList.remove('show'),2300);
}

function openPopover(anchor,content){
  const popover=$('#popover');
  const rect=anchor.getBoundingClientRect();
  popover.innerHTML=content;
  popover.style.left=`${Math.max(8,Math.min(rect.left,innerWidth-190))}px`;
  popover.style.top=`${Math.min(rect.bottom+6,innerHeight-140)}px`;
  popover.hidden=false;
}

makeDepartmentChart();
makeUsageDonut();

document.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-nav]').forEach(item=>item.classList.toggle('selected',item===button));
  $('#activeNav').textContent=button.dataset.nav;
  if(button.dataset.nav!=='Overview') toast(`${button.dataset.nav} is a navigation preview; this prototype focuses on Overview.`);
}));

$('#orgSwitch').addEventListener('click',event=>{
  const menu=organizations.map((name,index)=>`<button data-org-option="${name}">${name=== $('#orgName').textContent?'✓ ':''}${name}${index===0?' · Current':''}</button>`).join('');
  openPopover(event.currentTarget,menu);
});

$('#popover').addEventListener('click',event=>{
  const option=event.target.closest('[data-org-option]');
  if(option){
    $('#orgName').textContent=option.dataset.orgOption;
    $('#popover').hidden=true;
    toast(`Organization changed. Metrics remain illustrative mock data.`);
  }
});

$('#dateSelect').addEventListener('change',event=>{
  toast(`${event.target.value} selected · values are illustrative November 2026 data.`);
});

$('#filtersButton').addEventListener('click',()=>toast('All departments and application categories are shown.'));
$('#helpButton').addEventListener('click',()=>toast('AI governance dashboard · illustrative prototype'));
document.querySelectorAll('[data-alert]').forEach(button=>button.addEventListener('click',()=>toast(`${button.dataset.alert}: review details in this dashboard.`)));

document.addEventListener('click',event=>{
  if(!event.target.closest('#orgSwitch')&&!event.target.closest('#popover')) $('#popover').hidden=true;
});
