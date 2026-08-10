"use strict";
(()=>{
  const p=new URLSearchParams(location.search), id=p.get('trilha')||'ops';
  const cfg=window.GLOG_CONFIG||{}, tracks=window.GLOG_TRACKS||[];
  const track=tracks.find(t=>t.id===id)||tracks[0];
  const $=id=>document.getElementById(id);
  if(!track){location.href='index.html#trilhas';return;}
  $('premiumCode').textContent=track.code+' • PREMIUM';
  $('premiumTitle').textContent=track.title;
  $('premiumShort').textContent=track.short;
  document.title=track.title+' | Premium Gabarito Logística';
  const list=$('premiumModules');
  (track.modules||[]).forEach((m,i)=>{const d=document.createElement('div');d.className='premium-module-row';d.innerHTML=`<b>${i+1}</b><div><strong>Módulo ${i+1}</strong><span></span></div>`;d.querySelector('span').textContent=m;list.appendChild(d)});
  if(window.GLOG_META)GLOG_META.standard('ViewContent',{content_ids:[track.id+'_premium'],content_name:track.title+' Premium',content_type:'product',value:cfg.premiumValue||19.90,currency:'BRL'});
  const checkout=cfg.checkouts&&cfg.checkouts[track.id], btn=$('buyPremium'), status=$('checkoutStatus');
  if(checkout){
    status.textContent='Checkout Kiwify conectado.'; status.className='checkout-status ok';
    btn.addEventListener('click',()=>{
      if(window.GLOG_META)GLOG_META.custom('PremiumIntent',{content_id:track.id,content_name:track.title,value:cfg.premiumValue||19.90,currency:'BRL'});
      const url=window.GLOG_META?GLOG_META.withCampaign(checkout,{src:'glog_'+track.id}):checkout;
      window.open(url,'_blank','noopener');
    });
  }else{
    btn.disabled=true; btn.textContent='Checkout Kiwify em configuração';
    status.innerHTML='<strong>Pré-lançamento:</strong> esta apresentação Premium está funcionando, mas a compra só será liberada quando o checkout real desta trilha for inserido em <code>config.js</code>.';
    status.className='checkout-status pending';
  }
})();