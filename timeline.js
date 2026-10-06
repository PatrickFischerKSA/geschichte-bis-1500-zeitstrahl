(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Timeline=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const EVENTS=[
    {id:'tools',year:-2500000,date:'ca. 2,5 Mio. Jahre vor heute',title:'Frühe Menschenarten nutzen Werkzeuge',module:'Modul 2'},
    {id:'sapiens',year:-100000,date:"ca. 100'000 Jahre vor heute",title:'Frühe Homo sapiens leben in Ostafrika',module:'Modul 2'},
    {id:'cognitive',year:-70000,date:"ca. 70'000 Jahre vor heute",title:'Die kognitive Revolution beginnt',module:'Modul 3'},
    {id:'migration',year:-45000,date:"ca. 45'000 Jahre vor heute",title:'Menschen breiten sich nach Australien und später nach Amerika aus',module:'Module 2, 4 und 12'},
    {id:'foragers',year:-12000,date:"vor 10'000 v. Chr.",title:'Mobile Jäger- und Sammlergesellschaften sind die Normalform',module:'Modul 4'},
    {id:'agriculture',year:-10000,date:"ab ca. 10'000 v. Chr.",title:'Landwirtschaft und Sesshaftigkeit breiten sich aus',module:'Modul 5'},
    {id:'gobekli',year:-9600,date:'ca. 9600 v. Chr.',title:'Göbekli Tepe wird als frühes Kultzentrum errichtet',module:'Module 5 und 6'},
    {id:'catalhoeyuek',year:-7400,date:'ca. 7400 v. Chr.',title:'Çatalhöyük entwickelt sich zu einer dichten Siedlung',module:'Module 5 und 6'},
    {id:'writing',year:-3500,date:'ab ca. 3500 v. Chr.',title:'Schrift, Listen und frühe Staaten entstehen',module:'Modul 6'},
    {id:'egypt',year:-3000,date:'ab ca. 3000 v. Chr.',title:'Ägypten wird als zentralisiertes Flussreich organisiert',module:'Modul 6'},
    {id:'empires',year:-2250,date:'ab ca. 2250 v. Chr.',title:'Grossreiche verbinden weite Räume durch Bürokratien',module:'Module 6 und 7'},
    {id:'celts',year:-800,date:'ab ca. 800 v. Chr.',title:'Die keltische Welt prägt Mitteleuropa',module:'Modul 7'},
    {id:'roman-republic',year:-509,date:'509 v. Chr.',title:'Die Römische Republik beginnt',module:'Modul 7'},
    {id:'athens',year:-480,date:'5. Jahrhundert v. Chr.',title:'Die attische Demokratie prägt Athen',module:'Modul 7'},
    {id:'helvetii',year:-58,date:'58 v. Chr.',title:'Caesar greift in die Wanderung der Helvetier ein',module:'Modul 7'},
    {id:'principate',year:-27,date:'27 v. Chr.',title:'Augustus begründet die römische Kaiserzeit',module:'Module 7 und 8'},
    {id:'islam',year:600,date:'7. Jahrhundert n. Chr.',title:'Der Islam entsteht und verbindet neue religiöse Räume',module:'Modul 9'},
    {id:'medieval-order',year:800,date:'ab ca. 800',title:'Kirche, Klöster, Burgen und Stände prägen Herrschaftsräume',module:'Modul 10'},
    {id:'cities',year:1000,date:'ab ca. 1000',title:'Städte, Märkte und Fernhandel verdichten sich',module:'Modul 11'},
    {id:'childrens-crusade',year:1212,date:'1212',title:'Chroniken berichten vom sogenannten Kinderkreuzzug',module:'Modul 11'},
    {id:'america-1491',year:1491,date:'1491',title:'Vielfältige indigene Gesellschaften prägen Amerika',module:'Modul 12'},
    {id:'columbus',year:1492,date:'1492',title:'Kolumbus erreicht Amerika – ein historischer Einschnitt',module:'Modul 12'},
    {id:'threshold',year:1500,date:'um 1500',title:'Der Kurs zieht seine Langzeitbilanz',module:'Module 1, 12 und 13'}
  ];
  const COUNTS={basis:4,vertieft:5,profi:6};
  const MODULE_EVENT_IDS={1:'threshold',2:'tools',3:'cognitive',4:'foragers',5:'agriculture',6:'writing',7:'celts',8:'roman-republic',9:'cities',10:'islam',11:'medieval-order',12:'childrens-crusade',13:'columbus'};
  function shuffle(items,random=Math.random){const copy=items.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
  function createRound(level='basis',random=Math.random){const count=COUNTS[level]||COUNTS.basis;const picked=shuffle(EVENTS,random).slice(0,count);let order=shuffle(picked,random);const sorted=picked.slice().sort((a,b)=>a.year-b.year);if(order.every((event,index)=>event.id===sorted[index].id)){order=order.slice();[order[0],order[1]]=[order[1],order[0]];}return order;}
  function createModuleRound(count=3,random=Math.random){const size=[3,6,13].includes(Number(count))?Number(count):3;const eventById=new Map(EVENTS.map(event=>[event.id,event]));const modules=shuffle(Object.keys(MODULE_EVENT_IDS).map(Number),random).slice(0,size);let order=shuffle(modules.map(module=>({...eventById.get(MODULE_EVENT_IDS[module]),module:`Modul ${module}`,selectedModule:module})),random);const sorted=order.slice().sort((a,b)=>a.year-b.year);if(order.every((event,index)=>event.id===sorted[index].id)){order=order.slice();[order[0],order[1]]=[order[1],order[0]];}return order;}
  function move(items,index,delta){const next=index+delta;if(index<0||index>=items.length||next<0||next>=items.length)return items.slice();const copy=items.slice();[copy[index],copy[next]]=[copy[next],copy[index]];return copy;}
  function evaluate(items){const correctOrder=items.slice().sort((a,b)=>a.year-b.year);const positionsCorrect=items.reduce((sum,event,index)=>sum+Number(event.id===correctOrder[index].id),0);return{correct:positionsCorrect===items.length,positionsCorrect,correctOrder};}
  function restore(raw){const value=raw&&typeof raw==='object'?raw:{};const played=Number.isInteger(value.played)&&value.played>=0?value.played:0;return{played,perfect:Number.isInteger(value.perfect)&&value.perfect>=0?Math.min(value.perfect,played):0,streak:Number.isInteger(value.streak)&&value.streak>=0?value.streak:0,best:Number.isInteger(value.best)&&value.best>=0?value.best:0};}
  return{EVENTS,COUNTS,MODULE_EVENT_IDS,createRound,createModuleRound,move,evaluate,restore};
});
