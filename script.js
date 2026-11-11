"use strict";
const cfg=window.GLOG_CONFIG, tracks=window.GLOG_TRACKS;
const grid=document.getElementById('trackGrid');
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
const META={
  ops:{cat:'OPERAÇÕES',level:'TÉCNICO • ENTRADA E ATUALIZAÇÃO',accent:'#22d7ff'},
  rec:{cat:'OPERAÇÕES',level:'TÉCNICO • RECEBIMENTO',accent:'#59e5ff'},
  est:{cat:'ESTOQUE',level:'TÉCNICO • ALMOXARIFADO',accent:'#7fe66a'},
  pck:{cat:'SEPARAÇÃO',level:'OPERACIONAL • LOGÍSTICA',accent:'#76e75b'},
  pak:{cat:'EMBALAGEM',level:'OPERACIONAL • QUALIDADE',accent:'#9beb3b'},
  srt:{cat:'EXPEDIÇÃO',level:'OPERACIONAL • SAÍDA',accent:'#ffbf3a'},
  inv:{cat:'QUALIDADE',level:'TÉCNICO • INVENTÁRIO',accent:'#8a9fff'},
  seg:{cat:'SEGURANÇA',level:'EHS • 5S • PREVENÇÃO',accent:'#ffd23f'},
  trp:{cat:'TRANSPORTE',level:'LOGÍSTICA • LAST MILE',accent:'#4be2ff'},
  mov:{cat:'MOVIMENTAÇÃO',level:'TÉCNICO • EQUIPAMENTOS',accent:'#c98cff'},
  adm:{cat:'SUPORTE',level:'ADMINISTRATIVO • EXCEL',accent:'#78e7a5'},
  sel:{cat:'PROCESSO SELETIVO',level:'COMPORTAMENTAL • RACIOCÍNIO',accent:'#ff8ad0'}
};
tracks.forEach(t=>{
  const m=META[t.id]||{cat:'LOGÍSTICA',level:'PREPARAÇÃO PROFISSIONAL',accent:'#22d7ff'};
  const a=document.createElement('article');
  a.className='card';
  a.style.setProperty('--accent',m.accent);
  const completo=['est','rec','pck','ops','sel','adm','mov','trp','seg','inv'].includes(t.id);
  a.innerHTML=`<div class="card-top"><span class="code-pill">${escapeHtml(t.code)}</span><span class="card-cat">${escapeHtml(m.cat)}</span></div><span class="card-level">${escapeHtml(m.level)}</span><h3><strong>${escapeHtml(t.title)}</strong></h3><p>${escapeHtml(t.short)}</p><div class="free-box"><span class="free-tag">GRÁTIS</span><div class="free-meta">${completo?"5 módulos • 100 questões":"2 módulos • 10 questões"}</div><small>${completo?"Banco completo no Instituto EnsinoMeu":"Questões atuais em dois módulos"}</small></div><div class="card-actions"><a class="btn btn-yellow" href="${t.freeFile}">Iniciar teste gratuito <span aria-hidden="true">→</span></a></div>`;
  grid.appendChild(a)
});

// Cards de parceiros: o card inteiro abre o site; o áudio para antes de sair.
(function initPartnerCards(){
  const cards=[...document.querySelectorAll('.partner-card[data-link-key]')];
  if(!cards.length) return;
  const screenshotUrl=(url)=>'https://image.thum.io/get/width/1000/crop/650/noanimate/maxAge/24/?url='+encodeURIComponent(url);
  cards.forEach(card=>{
    const key=card.dataset.linkKey;
    const url=cfg[key];
    if(!url) return;
    card.dataset.href=url;
    const img=card.querySelector('.live-site-shot');
    if(img){
      const fallback=card.dataset.fallback || img.getAttribute('src');
      img.dataset.fallback=fallback;
      img.onerror=()=>{ if(img.src.endsWith(fallback)) return; img.onerror=null; img.src=fallback; };
      img.src=screenshotUrl(url);
    }
    const openPartner=()=>{
      if(window.GLOG_META) GLOG_META.custom('PartnerClick',{partner:key});
      if(window.GLOG_SOUND && typeof window.GLOG_SOUND.stopBg==='function') window.GLOG_SOUND.stopBg();
      const opened=window.open(url,'_blank','noopener');
      if(opened) opened.opener=null;
    };
    card.addEventListener('click',openPartner);
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openPartner(); }
    });
  });
})();

function openExternalSilently(url){
  if(!url) return;
  if(window.GLOG_SOUND && typeof window.GLOG_SOUND.stopBg==='function'){
    window.GLOG_SOUND.stopBg();
  }
  window.open(url,'_blank','noopener');
}


document.querySelectorAll('.partner-click').forEach(card=>{
  card.setAttribute('tabindex','0');
  card.setAttribute('role','link');
  const go=()=>{
    const key=card.dataset.link;
    const url=cfg[key];
    openExternalSilently(url);
  };
  card.addEventListener('click',e=>{
    if(e.target.closest('a,button')) return;
    go();
  });
  card.addEventListener('keydown',e=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); go(); }
  });
});
