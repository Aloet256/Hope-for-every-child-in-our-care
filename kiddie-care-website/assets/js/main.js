
(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const header=$('#siteHeader');
  const menu=$('.menu-toggle'), nav=$('#siteNav');
  const page=document.body.dataset.page;
  $$('[data-nav]').forEach(a=>{if(a.dataset.nav===page){a.classList.add('active');a.setAttribute('aria-current','page')}});
  const setHeader=()=>header?.classList.toggle('scrolled',scrollY>18); setHeader(); addEventListener('scroll',setHeader,{passive:true});
  menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.classList.toggle('open',open)});
  $$('#siteNav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
  $$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  const reveal=$$('.reveal');
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});reveal.forEach(el=>io.observe(el));}else reveal.forEach(el=>el.classList.add('in-view'));
  const toast=$('.toast'); let toastTimer;
  function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4200)}
  $$('[data-local-form]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault(); if(!form.reportValidity())return;
    const type=form.dataset.localForm, data=Object.fromEntries(new FormData(form).entries());
    const ref='KC-'+Date.now().toString(36).toUpperCase().slice(-7);
    const records=JSON.parse(localStorage.getItem('kiddieCareForms')||'[]');records.push({type,ref,data,createdAt:new Date().toISOString()});localStorage.setItem('kiddieCareForms',JSON.stringify(records));
    if(type==='donation') showToast(`Thank you. Your pledge reference is ${ref}. Please contact the official team for verified payment details.`);
    else if(type==='newsletter') showToast('Thank you for joining the Kiddie Care community.');
    else showToast(`Thank you. Your reference is ${ref}.`);
    form.reset();
  }));
  const qs=new URLSearchParams(location.search), subject=qs.get('subject'), subjectSelect=$('#contactSubject');
  if(subject&&subjectSelect){const options=[...subjectSelect.options];const found=options.find(o=>o.text.toLowerCase()===subject.toLowerCase());if(found)subjectSelect.value=found.value;else{const opt=new Option(subject,subject);subjectSelect.add(opt);subjectSelect.value=subject}}
  const filters=$$('[data-filter]'), galleryItems=$$('.gallery-item');
  filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;galleryItems.forEach(i=>i.classList.toggle('hidden',f!=='all'&&i.dataset.category!==f))}));
  const lightbox=$('.lightbox'); let current=0; function visibleItems(){return galleryItems.filter(i=>!i.classList.contains('hidden'))}
  function openLightbox(item){if(!lightbox)return;const list=visibleItems();current=list.indexOf(item);const img=$('img',lightbox);img.src=item.dataset.src;img.alt=item.dataset.alt;$('p',lightbox).textContent=item.dataset.alt;lightbox.hidden=false;document.body.style.overflow='hidden';$('.lightbox-close',lightbox).focus()}
  function moveLightbox(dir){const list=visibleItems();if(!list.length)return;current=(current+dir+list.length)%list.length;const item=list[current], img=$('img',lightbox);img.src=item.dataset.src;img.alt=item.dataset.alt;$('p',lightbox).textContent=item.dataset.alt}
  galleryItems.forEach(i=>i.addEventListener('click',()=>openLightbox(i)));
  $('.lightbox-close')?.addEventListener('click',()=>{lightbox.hidden=true;document.body.style.overflow=''});$('.lightbox-prev')?.addEventListener('click',()=>moveLightbox(-1));$('.lightbox-next')?.addEventListener('click',()=>moveLightbox(1));
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox){lightbox.hidden=true;document.body.style.overflow=''}});
  addEventListener('keydown',e=>{if(!lightbox||lightbox.hidden)return;if(e.key==='Escape'){$('.lightbox-close').click()}if(e.key==='ArrowLeft')moveLightbox(-1);if(e.key==='ArrowRight')moveLightbox(1)});
  const curBtns=$$('[data-currency]'), amountBtns=$$('[data-amounts] button'), customAmount=$('.donation-card input[name="amount"]');let currency='UGX';
  function updateAmounts(){amountBtns.forEach(b=>{const value=b.dataset[currency.toLowerCase()];b.textContent=currency==='UGX'?`UGX ${Number(value).toLocaleString()}`:`USD ${value}`});if(customAmount)customAmount.placeholder=`Enter amount in ${currency}`}
  curBtns.forEach(b=>b.addEventListener('click',()=>{curBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');currency=b.dataset.currency;updateAmounts()}));
  amountBtns.forEach(b=>b.addEventListener('click',()=>{amountBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');if(customAmount)customAmount.value=b.dataset[currency.toLowerCase()]}));
  updateAmounts();
  if(matchMedia('(pointer:fine)').matches){const heroImg=$('.hero-media img');addEventListener('mousemove',e=>{if(!heroImg)return;const x=(e.clientX/innerWidth-.5)*8,y=(e.clientY/innerHeight-.5)*8;heroImg.style.transform=`scale(1.05) translate(${x}px,${y}px)`},{passive:true})}
})();
