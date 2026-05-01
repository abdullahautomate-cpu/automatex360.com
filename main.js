/* ============================================================
   AUTOMATEX360 — main.js  (Tech-Noir dark build)
   Dark palettes · Magnetic cursor · 3D tilt · Fluid motion
   ============================================================ */

'use strict';

/* ======================================================
   PRELOADER — fast exit
====================================================== */
const preloader = document.getElementById('preloader');
const fill      = document.querySelector('.preloader-bar-fill');
let pct = 0;
document.body.style.overflow = 'hidden';

const tick = setInterval(() => {
  pct += 28 + Math.random() * 30;
  if (pct >= 100) {
    pct = 100; clearInterval(tick);
    fill.style.width = '100%';
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      document.body.classList.add('cursor-ready');
      boot();
    }, 220);
  }
  fill.style.width = pct + '%';
}, 55);


/* ======================================================
   SECTION COLOR PALETTES — dark Tech-Noir
====================================================== */
const SECTION_PALETTE = {
  hero:           { a: 0x6366f1, b: 0xa78bfa },
  stats:          { a: 0x6366f1, b: 0x22d3ee },
  testimonials:   { a: 0xa78bfa, b: 0x6366f1 },
  certifications: { a: 0x6366f1, b: 0x22d3ee },
  services:       { a: 0x10b981, b: 0x6366f1 },
  portfolio:      { a: 0xf97316, b: 0xa78bfa },
  demo:           { a: 0x22d3ee, b: 0x6366f1 },
  results:        { a: 0x6366f1, b: 0x10b981 },
  founder:        { a: 0x22d3ee, b: 0x6366f1 },
  process:        { a: 0x10b981, b: 0xf97316 },
  blog:           { a: 0xa78bfa, b: 0x6366f1 },
};

function hexRGB(hex) {
  return { r: ((hex>>16)&255)/255, g: ((hex>>8)&255)/255, b: (hex&255)/255 };
}


/* ======================================================
   CURSOR — CSS transition driven, zero RAF overhead
====================================================== */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left   = e.clientX + 'px';
    cursor.style.top    = e.clientY + 'px';
    follower.style.left = e.clientX + 'px';
    follower.style.top  = e.clientY + 'px';
  }, { passive: true });

  const HOVER_SEL = 'a,button,.btn,.filter-btn,.portfolio-card-link,.service-card-link,.founder-link,.play-btn,.faq-question,.nav-link,.footer-socials a';
  document.querySelectorAll(HOVER_SEL).forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('cursor-hover'); follower.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('cursor-hover'); follower.classList.remove('cursor-hover'); });
  });
}


/* ======================================================
   HERO 3D — disabled (global canvas covers hero already)
====================================================== */
function initHero3D() {
  /* Hero canvas is hidden via CSS; global orb canvas handles bg */
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;
  /* Skip rendering to save GPU — global canvas is sufficient */
  return;

  const W = canvas.offsetWidth, H = canvas.offsetHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 80);
  camera.position.z = 7;

  scene.add(new THREE.AmbientLight(0xffffff, 0.15));
  const pl = new THREE.PointLight(0x6366f1, 2.8, 18);
  pl.position.set(4, 3, 5); scene.add(pl);
  const pl2 = new THREE.PointLight(0x22d3ee, 1.5, 14);
  pl2.position.set(-3, -2, 4); scene.add(pl2);

  const NODES = 16;
  const nodeMeshes = [];
  const nodePos    = [];
  for (let i = 0; i < NODES; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.06 + Math.random()*0.07, 7, 7),
      new THREE.MeshPhongMaterial({
        color: i%2 ? 0x6366f1 : 0x22d3ee,
        emissive: i%2 ? 0x312e81 : 0x0e7490,
        emissiveIntensity: 0.7, transparent: true, opacity: 0.65, shininess: 120,
      })
    );
    const p = new THREE.Vector3((Math.random()-.5)*12, (Math.random()-.5)*8, (Math.random()-.5)*4-1);
    m.position.copy(p); m.userData = { ox:p.x, oy:p.y, ph:Math.random()*Math.PI*2, sp:0.4+Math.random()*0.5, pp:Math.random()*Math.PI*2 };
    nodePos.push(p); nodeMeshes.push(m); scene.add(m);
  }

  const CONN_D = 4.0;
  const lineMats = [];
  for (let i=0;i<NODES;i++) for (let j=i+1;j<NODES;j++) {
    const d = nodePos[i].distanceTo(nodePos[j]);
    if (d > CONN_D) continue;
    const str = (1-d/CONN_D)*0.18;
    const mat = new THREE.LineBasicMaterial({ color:0x6366f1, transparent:true, opacity:str });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([nodePos[i].clone(),nodePos[j].clone()]), mat));
    lineMats.push({ mat, base:str, ph:Math.random()*Math.PI*2 });
  }

  const CC = [0x6366f1, 0x22d3ee, 0xa78bfa, 0xf97316];
  const codeBars = [];
  for (let i=0;i<10;i++) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.4+Math.random()*1.6, 0.03, 0.02),
      new THREE.MeshBasicMaterial({ color:CC[i%CC.length], transparent:true, opacity:0.06+Math.random()*0.08 })
    );
    m.position.set((Math.random()-.5)*14,(Math.random()-.5)*9,(Math.random()-.5)*3-2);
    m.userData.sp = (0.3+Math.random()*0.6)*(Math.random()>.5?1:-1);
    codeBars.push(m); scene.add(m);
  }

  const PN=120, pp=new Float32Array(PN*3), pc=new Float32Array(PN*3);
  const PAL=[new THREE.Color(0x6366f1),new THREE.Color(0x22d3ee),new THREE.Color(0xa78bfa),new THREE.Color(0xf97316)];
  for(let i=0;i<PN;i++){
    pp[i*3]=(Math.random()-.5)*14; pp[i*3+1]=(Math.random()-.5)*9; pp[i*3+2]=(Math.random()-.5)*7;
    const c=PAL[i%PAL.length]; pc[i*3]=c.r; pc[i*3+1]=c.g; pc[i*3+2]=c.b;
  }
  const pGeo=new THREE.BufferGeometry();
  pGeo.setAttribute('position',new THREE.BufferAttribute(pp,3));
  pGeo.setAttribute('color',new THREE.BufferAttribute(pc,3));
  const cloud=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.035,vertexColors:true,transparent:true,opacity:0.35}));
  scene.add(cloud);

  let mx=0,my=0;
  document.addEventListener('mousemove', e=>{
    mx=(e.clientX/window.innerWidth-.5)*0.4;
    my=(e.clientY/window.innerHeight-.5)*0.4;
  });
  new ResizeObserver(()=>{ const w=canvas.offsetWidth,h=canvas.offsetHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); }).observe(canvas);

  let f=0, running=true;
  document.addEventListener('visibilitychange', ()=>{ running = !document.hidden; });

  function heroLoop() {
    requestAnimationFrame(heroLoop);
    if (!running) return;
    f++;
    nodeMeshes.forEach(n=>{
      const {ox,oy,ph,sp,pp} = n.userData;
      n.position.x = ox + Math.sin(f*.006*sp+ph)*.16;
      n.position.y = oy + Math.cos(f*.008*sp+ph)*.12;
      const pulse = .5+Math.sin(f*.04+pp)*.5;
      n.material.emissiveIntensity = .35+pulse*.5;
      n.material.opacity = .45+pulse*.22;
    });
    lineMats.forEach(({mat,base,ph})=>{ mat.opacity = base*(.4+Math.sin(f*.025+ph)*.6); });
    codeBars.forEach(b=>{ b.position.x+=b.userData.sp*.005; if(b.position.x>8) b.position.x=-8; if(b.position.x<-8) b.position.x=8; });
    cloud.rotation.y += .0005;
    camera.position.x += (mx*.7-camera.position.x)*.04;
    camera.position.y += (-my*.5-camera.position.y)*.04;
    camera.lookAt(0,0,0);
    renderer.render(scene,camera);
  }
  heroLoop();
}


/* ======================================================
   GLOBAL AI BACKGROUND — dark Tech-Noir palette
====================================================== */
function initGlobalBackground() {
  const canvas = document.getElementById('globalOrbCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:false, powerPreference:'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 120);
  camera.position.z = 10;

  scene.add(new THREE.AmbientLight(0xffffff,0.08));
  const pl1 = new THREE.PointLight(0x6366f1,1.8,28); pl1.position.set(6,4,6); scene.add(pl1);
  const pl2 = new THREE.PointLight(0x22d3ee,1.2,20); pl2.position.set(-5,-3,5); scene.add(pl2);

  const BN=20, bgNodes=[], bgNodePos=[];
  for(let i=0;i<BN;i++){
    const big=i<5;
    const m=new THREE.Mesh(
      new THREE.SphereGeometry(big?.12:.07,8,8),
      new THREE.MeshPhongMaterial({ color:0x6366f1, emissive:0x312e81, emissiveIntensity:.6, transparent:true, opacity:big?.5:.32, shininess:100 })
    );
    const p=new THREE.Vector3((Math.random()-.5)*24,(Math.random()-.5)*16,(Math.random()-.5)*7-2);
    m.position.copy(p); m.userData={ox:p.x,oy:p.y,sp:.2+Math.random()*.4,ph:Math.random()*Math.PI*2,pp:Math.random()*Math.PI*2,big};
    bgNodePos.push(p); bgNodes.push(m); scene.add(m);
  }

  const bgLineMats=[];
  let lineCount=0;
  const CD=7.0;
  for(let i=0;i<BN&&lineCount<40;i++) for(let j=i+1;j<BN&&lineCount<40;j++){
    const d=bgNodePos[i].distanceTo(bgNodePos[j]);
    if(d>CD) continue;
    const str=(1-d/CD)*.10;
    const mat=new THREE.LineBasicMaterial({color:0x6366f1,transparent:true,opacity:str});
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([bgNodePos[i].clone(),bgNodePos[j].clone()]),mat));
    bgLineMats.push({mat,base:str,ph:Math.random()*Math.PI*2}); lineCount++;
  }

  const bgCode=[];  /* code bars disabled for performance */

  /* circuit grid removed for performance */

  /* DNA helix — right side */
  const helixG=new THREE.Group(); helixG.position.set(10,0,-3);
  const HT=4,HPP=20;
  for(let s=0;s<2;s++){
    const pts=[]; const off=s*Math.PI;
    for(let i=0;i<=HT*HPP;i++){
      const t=i/HPP, a=t*Math.PI*2+off;
      pts.push(new THREE.Vector3(Math.cos(a)*.5, t*.65-HT*.32, Math.sin(a)*.5));
    }
    pts.forEach((p,idx)=>{
      if(idx%4!==0) return;
      const d=new THREE.Mesh(new THREE.SphereGeometry(.05,5,5),new THREE.MeshPhongMaterial({color:s?0xa78bfa:0x6366f1,emissive:s?0x4c1d95:0x312e81,emissiveIntensity:.7,transparent:true,opacity:.45}));
      d.position.copy(p); helixG.add(d);
    });
    helixG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:s?0xa78bfa:0x6366f1,transparent:true,opacity:.22})));
  }
  for(let i=0;i<=HT*HPP;i+=5){
    const t=i/HPP, a=t*Math.PI*2, y=t*.65-HT*.32;
    const p1=new THREE.Vector3(Math.cos(a)*.5,y,Math.sin(a)*.5), p2=new THREE.Vector3(Math.cos(a+Math.PI)*.5,y,Math.sin(a+Math.PI)*.5);
    helixG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1,p2]),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.06})));
  }
  scene.add(helixG);

  /* Data particles */
  const DP=60, dpp=new Float32Array(DP*3), dpc=new Float32Array(DP*3);
  const DPAL=[new THREE.Color(0x6366f1),new THREE.Color(0xa78bfa),new THREE.Color(0x22d3ee),new THREE.Color(0xf97316)];
  for(let i=0;i<DP;i++){
    dpp[i*3]=(Math.random()-.5)*28; dpp[i*3+1]=(Math.random()-.5)*18; dpp[i*3+2]=(Math.random()-.5)*9;
    const c=DPAL[i%DPAL.length]; dpc[i*3]=c.r; dpc[i*3+1]=c.g; dpc[i*3+2]=c.b;
  }
  const dpGeo=new THREE.BufferGeometry();
  dpGeo.setAttribute('position',new THREE.BufferAttribute(dpp,3));
  dpGeo.setAttribute('color',new THREE.BufferAttribute(dpc,3));
  const dataCloud=new THREE.Points(dpGeo,new THREE.PointsMaterial({size:.035,vertexColors:true,transparent:true,opacity:.18}));
  scene.add(dataCloud);

  /* Scroll-driven color shift */
  function applyPalette(id) {
    if(typeof gsap==='undefined') return;
    const p=SECTION_PALETTE[id]||SECTION_PALETTE.hero;
    const ra=hexRGB(p.a), rb=hexRGB(p.b);
    bgNodes.forEach(n=>{ gsap.to(n.material.color,{...ra,duration:.9,ease:'power2.out'}); });
    bgLineMats.forEach(({mat})=>{ gsap.to(mat.color,{...ra,duration:.9,ease:'power2.out'}); });
    gsap.to(pl1.color,{...ra,duration:.8});
    gsap.to(pl2.color,{...rb,duration:.8});
  }

  Object.keys(SECTION_PALETTE).forEach(id=>{
    const sec=document.getElementById(id);
    if(!sec||typeof ScrollTrigger==='undefined') return;
    ScrollTrigger.create({ trigger:sec, start:'top 58%', onEnter:()=>applyPalette(id), onEnterBack:()=>applyPalette(id) });
  });

  if(typeof ScrollTrigger!=='undefined'){
    ScrollTrigger.create({
      trigger:'body', start:'top top', end:'bottom bottom', scrub:true,
      onUpdate:self=>{ helixG.rotation.y=self.progress*Math.PI*4; }
    });
  }

  let mx=0,my=0;
  document.addEventListener('mousemove',e=>{ mx=(e.clientX/window.innerWidth-.5)*.5; my=(e.clientY/window.innerHeight-.5)*.5; });
  window.addEventListener('resize',()=>{ renderer.setSize(window.innerWidth,window.innerHeight); camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); },{passive:true});

  let f=0, running=true;
  document.addEventListener('visibilitychange',()=>{ running=!document.hidden; });

  let lastT=0;
  function bgLoop(t) {
    requestAnimationFrame(bgLoop);
    if(!running || t-lastT < 50) return;   /* ~20 fps */
    lastT=t; f++;

    bgNodes.forEach(n=>{
      const{ox,oy,sp,ph,pp,big}=n.userData;
      n.position.x=ox+Math.sin(f*.004*sp+ph)*.2;
      n.position.y=oy+Math.cos(f*.006*sp+ph)*.15;
      const pulse=.5+Math.sin(f*.03+pp)*.5;
      n.material.emissiveIntensity=.3+pulse*(big?.65:.4);
      n.material.opacity=(big?.38:.22)+pulse*.16;
    });
    bgLineMats.forEach(({mat,base,ph})=>{ mat.opacity=base*(.3+Math.sin(f*.022+ph)*.7); });
    /* bgCode removed */
    dataCloud.rotation.y+=.0003;
    helixG.position.y=Math.sin(f*.007)*.7;
    camera.position.x+=(mx*.35-camera.position.x)*.015;
    camera.position.y+=(-my*.25-camera.position.y)*.015;
    camera.lookAt(0,0,0);
    renderer.render(scene,camera);
  }
  bgLoop(0);
}


/* ======================================================
   GSAP SCROLL ANIMATIONS
====================================================== */
function initScrollAnimations() {
  if(typeof gsap==='undefined'){
    document.querySelectorAll('[data-animate]').forEach(el=>el.classList.add('animated'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  ScrollTrigger.batch('[data-animate]', {
    start: 'top 90%',
    onEnter: batch => gsap.fromTo(batch,
      { opacity:0, y:28 },
      { opacity:1, y:0, duration:.5, ease:'power2.out', stagger:.07, overwrite:true }
    ),
    onEnterBack: batch => gsap.fromTo(batch,
      { opacity:0, y:28 },
      { opacity:1, y:0, duration:.35, ease:'power2.out', stagger:.04, overwrite:true }
    ),
  });

  /* smooth scroll nav */
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const t=document.querySelector(link.getAttribute('href'));
      if(!t) return; e.preventDefault();
      gsap.to(window,{duration:.9,scrollTo:{y:t,offsetY:72},ease:'power3.inOut'});
      navMenu.classList.remove('open'); navToggle.classList.remove('active');
    });
  });

  /* Hero entrance */
  gsap.timeline({ delay:.1 })
    .fromTo('.hero-badge',    {opacity:0,y:20},{opacity:1,y:0,duration:.5,ease:'power2.out'})
    .fromTo('.hero-title',    {opacity:0,y:40},{opacity:1,y:0,duration:.6,ease:'power2.out'},'-=.2')
    .fromTo('.hero-subtitle', {opacity:0,y:24},{opacity:1,y:0,duration:.5,ease:'power2.out'},'-=.3')
    .fromTo('.hero-ctas',     {opacity:0,y:18},{opacity:1,y:0,duration:.4,ease:'power2.out'},'-=.25')
    .fromTo('.hero-trust',    {opacity:0,y:12},{opacity:1,y:0,duration:.35,ease:'power2.out'},'-=.2')
    .fromTo('.hero-3d-element',{opacity:0,scale:.9,x:30},{opacity:1,scale:1,x:0,duration:.8,ease:'power2.out'},'-=.6');

  const staggerReveal = (sel, trigger, opts={}) =>
    gsap.fromTo(sel, {opacity:0,y:32,scale:.97}, {opacity:1,y:0,scale:1,duration:.45,ease:'power2.out',stagger:.08,
      scrollTrigger:{trigger,start:'top 88%',...opts}});

  staggerReveal('.service-card',    '.services-grid');
  staggerReveal('.portfolio-card',  '.portfolio-grid');
  staggerReveal('.blog-card',       '.blog-grid');
  staggerReveal('.testimonial-card','.testimonials-grid');

  gsap.fromTo('.demo-card',
    {opacity:0,scale:.94},{opacity:1,scale:1,duration:.4,ease:'back.out(1.4)',stagger:.12,
    scrollTrigger:{trigger:'.demo-grid',start:'top 88%'}});

  gsap.fromTo('.process-step',
    {opacity:0,x:-32},{opacity:1,x:0,duration:.45,ease:'power2.out',stagger:.12,
    scrollTrigger:{trigger:'.process-timeline',start:'top 86%'}});

  gsap.fromTo('.cert-badge',
    {opacity:0,scale:.82},{opacity:1,scale:1,duration:.3,ease:'back.out(2)',stagger:.04,
    scrollTrigger:{trigger:'.certs-grid',start:'top 90%'}});

  gsap.fromTo('.founder-grid',
    {opacity:0,y:30},{opacity:1,y:0,duration:.55,ease:'power2.out',
    scrollTrigger:{trigger:'.founder-grid',start:'top 86%'}});

  /* Parallax hero 3D element on scroll */
  gsap.to('.hero-3d-element',{
    y:120,ease:'none',
    scrollTrigger:{trigger:'.hero-section',start:'top top',end:'bottom top',scrub:1.5}
  });

  gsap.to('.shape-1',{y:-70,scrollTrigger:{trigger:'.cta-section',start:'top bottom',end:'bottom top',scrub:1.2}});
  gsap.to('.shape-2',{y: 50,scrollTrigger:{trigger:'.cta-section',start:'top bottom',end:'bottom top',scrub:1.2}});

  /* Counters */
  ScrollTrigger.create({ trigger:'.stats-section',start:'top 82%',once:true,
    onEnter:()=>document.querySelectorAll('.stat-number[data-count]').forEach(el=>countUp(el,+el.dataset.count,'')) });
  ScrollTrigger.create({ trigger:'.dashboard-frame',start:'top 82%',once:true,
    onEnter:()=>{
      document.querySelectorAll('.metric-bar-fill').forEach(b=>b.style.width=(b.dataset.width||0)+'%');
      document.querySelectorAll('.metric-value[data-count]').forEach(el=>countUp(el,+el.dataset.count,'%'));
    }});
  ScrollTrigger.create({ trigger:'#showcase-calling-bots',start:'top 82%',once:true,
    onEnter:()=>document.querySelectorAll('[data-showcase-count]').forEach(el=>countUp(el,+el.dataset.showcaseCount,'')) });
}


/* ======================================================
   COUNTER
====================================================== */
function countUp(el, target, suffix) {
  const start=performance.now(), dur=1400;
  function step(now){
    const p=Math.min((now-start)/dur,1);
    el.textContent=Math.round((1-Math.pow(1-p,3))*target)+suffix;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


/* ======================================================
   NAVBAR
====================================================== */
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>32),{passive:true});


/* ======================================================
   MOBILE NAV
====================================================== */
const navToggle=document.getElementById('navToggle');
const navMenu=document.getElementById('navMenu');
navToggle.addEventListener('click',()=>{
  navToggle.classList.toggle('active'); navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded',navMenu.classList.contains('open'));
});
document.addEventListener('click',e=>{
  if(navMenu.classList.contains('open')&&!navMenu.contains(e.target)&&!navToggle.contains(e.target)){
    navMenu.classList.remove('open'); navToggle.classList.remove('active');
  }
});


/* ======================================================
   PORTFOLIO FILTER
====================================================== */
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const portfolioGrid  = document.getElementById('portfolioGrid');

const SHOWCASE_MAP={
  'calling-bots':'showcase-calling-bots',
  chatbots:'showcase-chatbots',
  automation:'showcase-automation',
  seo:'showcase-seo',
  creative:'showcase-creative',
};

function hideAllShowcases(){ document.querySelectorAll('.portfolio-showcase').forEach(p=>p.classList.remove('active')); }

/* Default: show calling-bots showcase on load */
portfolioGrid.style.display='none';
const defaultShowcase=document.getElementById('showcase-calling-bots');
if(defaultShowcase) defaultShowcase.classList.add('active');

filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const filter=btn.dataset.filter;
    hideAllShowcases();
    if(filter==='websites'){
      portfolioGrid.style.display='grid';
      portfolioCards.forEach(card=>{
        const show=card.dataset.category==='websites';
        card.classList.toggle('hidden',!show);
        if(show&&typeof gsap!=='undefined') gsap.fromTo(card,{opacity:0,scale:.95},{opacity:1,scale:1,duration:.3,ease:'power2.out'});
      });
    } else {
      portfolioGrid.style.display='none';
      const panel=document.getElementById(SHOWCASE_MAP[filter]);
      if(panel){ panel.classList.add('active'); if(typeof gsap!=='undefined') gsap.fromTo(panel,{opacity:0,y:16},{opacity:1,y:0,duration:.35,ease:'power2.out'}); }
    }
  });
});


/* ======================================================
   FAQ ACCORDION — CSS grid-template-rows approach
====================================================== */
document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    const ans=item.querySelector('.faq-answer');
    const open=btn.getAttribute('aria-expanded')==='true';

    /* Close all */
    document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(b=>{
      b.setAttribute('aria-expanded','false');
      b.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
    });

    if(!open){
      btn.setAttribute('aria-expanded','true');
      ans.classList.add('open');
    }
  });
});


/* ======================================================
   3D CARD TILT
====================================================== */
document.querySelectorAll('.service-card,.portfolio-card,.blog-card,.testimonial-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transition='transform .08s ease';
    card.style.transform=`translateY(-6px) rotateX(${-dy*5}deg) rotateY(${dx*5}deg)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transition='transform .45s cubic-bezier(.4,0,.2,1)';
    card.style.transform='';
  });
});


/* ======================================================
   ACTIVE NAV
====================================================== */
document.querySelectorAll('section[id]').forEach(s=>
  new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting) document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('active-nav',l.getAttribute('href')==='#'+e.target.id));
  }),{threshold:.3}).observe(s)
);


/* ======================================================
   VIDEO PLACEHOLDER
====================================================== */
document.querySelectorAll('.video-placeholder').forEach(p=>
  p.addEventListener('click',()=>{ if(typeof gsap!=='undefined') gsap.to(window,{duration:.8,scrollTo:{y:'#contact',offsetY:68},ease:'power3.inOut'}); })
);


/* ======================================================
   BOOT
====================================================== */
function boot() {
  initCursor();
  initHero3D();
  initGlobalBackground();
  initScrollAnimations();
}
