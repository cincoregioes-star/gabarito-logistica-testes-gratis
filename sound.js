"use strict";
window.GLOG_SOUND=(()=>{
 const KEY='glog_audio_enabled_v2', VOL='glog_audio_volume_v2';
 let enabled=true, uiVolume=.32, started=false;
 try{
   const e=localStorage.getItem(KEY); if(e!==null) enabled=e==='1';
   const v=parseFloat(localStorage.getItem(VOL)||''); if(!Number.isNaN(v)) uiVolume=Math.max(0,Math.min(1,v));
 }catch(e){}

 const bg=new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tension-103701.mp3');
 const ok=new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3');
 const no=new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=error-126627.mp3');
 bg.loop=true; bg.preload='metadata'; ok.preload='auto'; no.preload='auto';

 function bgVolume(){ return Math.min(0.09, uiVolume*0.26); }
 function fxVolume(){ return Math.min(0.42, 0.18 + uiVolume*0.28); }

 function sync(){
   bg.volume=enabled?bgVolume():0;
   ok.volume=fxVolume();
   no.volume=Math.min(0.38,fxVolume());
   document.querySelectorAll('[data-sound-toggle]').forEach(b=>{
     b.setAttribute('aria-pressed',String(enabled));
     const label=b.querySelector('.sound-label');
     if(label) label.textContent=enabled?'Som ligado':'Som desligado';
     else b.textContent=enabled?'Som ligado':'Som desligado';
   });
   document.querySelectorAll('#volume').forEach(i=>{i.value=String(uiVolume)});
 }

 async function startBg(){
   if(started||!enabled) return;
   started=true;
   sync();
   try{ await bg.play(); }catch(e){ started=false; }
 }
 function stopBg(){ try{ bg.pause(); }catch(e){} started=false; }
 function setEnabled(v){
   enabled=!!v;
   try{localStorage.setItem(KEY,enabled?'1':'0')}catch(e){}
   sync();
   if(enabled) startBg(); else stopBg();
 }
 function setVolume(v){
   uiVolume=Math.max(0,Math.min(1,Number(v)||0));
   try{localStorage.setItem(VOL,String(uiVolume))}catch(e){}
   sync();
 }
 function toggle(){ setEnabled(!enabled); }
 function clonePlay(a){
   if(!enabled) return;
   try{ const x=a.cloneNode(); x.volume=a===ok?fxVolume():Math.min(0.38,fxVolume()); x.play().catch(()=>{}); }catch(e){}
 }
 function success(){ clonePlay(ok); }
 function error(){ clonePlay(no); }
 function bind(){
   sync();
   document.querySelectorAll('[data-sound-toggle]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();toggle();}));
   document.querySelectorAll('#volume').forEach(i=>i.addEventListener('input',()=>setVolume(i.value)));
   const unlock=()=>{ if(enabled) startBg(); };
   document.addEventListener('pointerdown',unlock,{once:true});
   document.addEventListener('keydown',unlock,{once:true});
 }
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',bind):bind();
 return {success,error,toggle,setEnabled,setVolume,startBg,stopBg,isEnabled:()=>enabled};
})();