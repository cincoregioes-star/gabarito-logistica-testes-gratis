"use strict";
window.GLOG_META=(()=>{
  const cfg=window.GLOG_CONFIG||{};
  const CONSENT='glog_meta_consent_v2';
  let ready=false, loading=false, callbacks=[];
  function consent(){try{return localStorage.getItem(CONSENT)}catch(e){return null}}
  function loadPixel(){
    if(ready || loading || !cfg.metaPixelId || consent()!=='granted') return;
    loading=true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init',cfg.metaPixelId);
    fbq('track','PageView');
    ready=true; loading=false;
    callbacks.splice(0).forEach(fn=>{try{fn()}catch(e){}});
  }
  function whenReady(fn){ if(ready) fn(); else callbacks.push(fn); }
  function standard(name,params={}){ if(consent()!=='granted') return; loadPixel(); whenReady(()=>window.fbq&&fbq('track',name,params)); }
  function custom(name,params={}){ if(consent()!=='granted') return; loadPixel(); whenReady(()=>window.fbq&&fbq('trackCustom',name,params)); }
  function setConsent(value){try{localStorage.setItem(CONSENT,value)}catch(e){} if(value==='granted')loadPixel(); syncBanner();}
  function syncBanner(){const box=document.getElementById('cookie');if(box)box.classList.toggle('show',!consent());}
  function reset(){try{localStorage.removeItem(CONSENT)}catch(e){} syncBanner();}
  function campaignParams(){
    const allowed=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck'];
    const p=new URLSearchParams(location.search), out={};
    allowed.forEach(k=>{if(p.get(k))out[k]=p.get(k)});
    try{const saved=JSON.parse(sessionStorage.getItem('glog_campaign')||'{}');Object.assign(out,saved,out);sessionStorage.setItem('glog_campaign',JSON.stringify(out));}catch(e){}
    return out;
  }
  function withCampaign(url,extra={}){
    if(!url)return '';
    try{const u=new URL(url);const params={...campaignParams(),...extra};Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=='')u.searchParams.set(k,String(v))});return u.toString()}catch(e){return url}
  }
  function init(){
    campaignParams(); syncBanner(); if(consent()==='granted')loadPixel();
    const a=document.getElementById('cookieAccept'),r=document.getElementById('cookieReject'),s=document.getElementById('privacySettings');
    if(a)a.addEventListener('click',()=>setConsent('granted'));
    if(r)r.addEventListener('click',()=>setConsent('denied'));
    if(s)s.addEventListener('click',reset);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
  return {standard,custom,whenReady,withCampaign,campaignParams,setConsent,reset,isReady:()=>ready};
})();