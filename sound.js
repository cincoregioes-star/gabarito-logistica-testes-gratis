"use strict";
window.GLOG_SOUND=(()=>{
  const VOL='glog_audio_volume_v3';
  let uiVolume=.32, bgPlaying=false;
  try{const v=parseFloat(localStorage.getItem(VOL)||'');if(!Number.isNaN(v))uiVolume=Math.max(0,Math.min(1,v));}catch(e){}
  const bg=new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tension-103701.mp3');
  const ok=new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3');
  const no=new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=error-126627.mp3');
  bg.loop=true; bg.preload='metadata'; ok.preload='auto'; no.preload='auto';
  const bgVolume=()=>Math.min(.065,uiVolume*.18);
  const fxVolume=()=>Math.min(.42,.18+uiVolume*.28);
  function sync(){
    bg.volume=bgVolume(); ok.volume=fxVolume(); no.volume=Math.min(.38,fxVolume());
    document.querySelectorAll('[data-sound-toggle]').forEach(b=>{b.setAttribute('aria-pressed',String(bgPlaying));const l=b.querySelector('.sound-label');const txt=bgPlaying?'⏸ Música':'▶ Música';if(l)l.textContent=txt;else b.textContent=txt;});
    document.querySelectorAll('#volume').forEach(i=>i.value=String(uiVolume));
  }
  async function startBg(){try{bg.volume=bgVolume();await bg.play();bgPlaying=true;sync();}catch(e){bgPlaying=false;sync();}}
  function stopBg(){try{bg.pause();bg.currentTime=0;}catch(e){}bgPlaying=false;sync();}
  function toggle(){bgPlaying?stopBg():startBg();}
  function setVolume(v){uiVolume=Math.max(0,Math.min(1,Number(v)||0));try{localStorage.setItem(VOL,String(uiVolume))}catch(e){}sync();}
  function clonePlay(a){try{const x=a.cloneNode();x.volume=a===ok?fxVolume():Math.min(.38,fxVolume());x.play().catch(()=>{});}catch(e){}}
  function success(){clonePlay(ok)}
  function error(){clonePlay(no)}
  function bind(){sync();document.querySelectorAll('[data-sound-toggle]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();toggle();}));document.querySelectorAll('#volume').forEach(i=>i.addEventListener('input',()=>setVolume(i.value)));window.addEventListener('pagehide',stopBg);document.addEventListener('visibilitychange',()=>{if(document.hidden&&bgPlaying)stopBg();});}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',bind):bind();
  return {success,error,toggle,setVolume,startBg,stopBg,isPlaying:()=>bgPlaying};
})();