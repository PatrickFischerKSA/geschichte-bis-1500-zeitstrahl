(() => {
  'use strict';
  const $=id=>document.getElementById(id),KEY='geschichte-bis-1500-zeitstrahl:v1';
  const T=window.Timeline;
  let level='basis',items=[],checked=false,state=T.restore(null);
  try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&['basis','vertieft','profi'].includes(saved.level))level=saved.level;state=T.restore(saved?.state);}catch{}
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function save(){try{localStorage.setItem(KEY,JSON.stringify({version:1,level,state}));$('save-status').textContent='Lernstand automatisch gespeichert.';}catch{$('save-status').textContent='Speicherung nicht verfügbar. Bitte lade ein Backup herunter.';}}
  function renderStats(){$('stats').textContent=`${state.perfect} von ${state.played} Runden vollständig richtig · Beste Serie: ${state.best}`;document.querySelectorAll('[data-level]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.level===level)));}
  function render(){
    $('timeline').replaceChildren();
    items.forEach((event,index)=>{
      const li=document.createElement('li');li.className='timeline-item';
      li.innerHTML=`<div class="event"><span class="position">${index+1}</span><span><strong>${escape(event.title)}</strong><small>${escape(event.module)}${checked?` · <b>${escape(event.date)}</b>`:''}</small></span></div><div class="move"></div>`;
      const controls=li.querySelector('.move');
      for(const [label,delta] of [['Nach oben',-1],['Nach unten',1]]){const button=document.createElement('button');button.textContent=label;button.disabled=checked||(delta<0?index===0:index===items.length-1);button.setAttribute('aria-label',`${event.title} ${label.toLocaleLowerCase('de-CH')} verschieben`);button.addEventListener('click',()=>{items=T.move(items,index,delta);render();const target=Math.max(0,Math.min(items.length-1,index+delta));$('timeline').children[target].querySelector('.move button:not(:disabled)')?.focus();});controls.append(button);}
      $('timeline').append(li);
    });
    $('check').disabled=checked;
  }
  function start(){items=T.createRound(level);checked=false;$('feedback').hidden=true;$('solution').hidden=true;$('check').hidden=false;render();renderStats();$('instruction').focus({preventScroll:true});}
  function check(){if(checked)return;checked=true;const result=T.evaluate(items);state.played++;if(result.correct){state.perfect++;state.streak++;state.best=Math.max(state.best,state.streak);}else state.streak=0;save();renderStats();render();$('check').hidden=true;$('feedback').hidden=false;$('feedback').className=`feedback ${result.correct?'correct':'try-again'}`;$('feedback').textContent=result.correct?`Vollständig richtig: Alle ${items.length} Ereignisse stehen chronologisch.`:`${result.positionsCorrect} von ${items.length} Ereignissen stehen bereits am richtigen Platz. Vergleiche deine Reihenfolge mit der Lösung.`;$('solution-list').innerHTML=result.correctOrder.map((event,index)=>`<li><span>${index+1}</span><div><strong>${escape(event.date)}</strong><br>${escape(event.title)}</div></li>`).join('');$('solution').hidden=false;$('feedback').focus({preventScroll:true});}
  document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>{level=button.dataset.level;save();start();}));
  $('check').addEventListener('click',check);$('new-round').addEventListener('click',start);$('continue').addEventListener('click',start);
  $('export').addEventListener('click',()=>{const data={format:'geschichte-bis-1500-zeitstrahl',version:1,savedAt:new Date().toISOString(),level,state};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=`zeitstrahl-lernstand-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('save-status').textContent='Backup heruntergeladen.';});
  $('import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>100000)throw Error();const data=JSON.parse(await file.text());if(data?.format!=='geschichte-bis-1500-zeitstrahl'||data.version!==1||!['basis','vertieft','profi'].includes(data.level))throw Error();level=data.level;state=T.restore(data.state);save();start();$('save-status').textContent='Backup erfolgreich geladen.';}catch{$('save-status').textContent='Dieses Backup ist ungültig.';}finally{event.target.value='';}});
  $('reset').addEventListener('click',()=>{if(!confirm('Alle Zeitstrahl-Statistiken in diesem Browser zurücksetzen?'))return;state=T.restore(null);save();start();$('save-status').textContent='Lernstand zurückgesetzt.';});
  renderStats();start();save();document.documentElement.dataset.ready='true';
})();
