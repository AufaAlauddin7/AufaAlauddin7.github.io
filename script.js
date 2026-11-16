// ===== Tema terang / gelap =====
const root = document.documentElement;
const metaTheme = document.querySelector('meta[name="theme-color"]');
function applyTheme(t) {
  root.dataset.theme = t;
  if (metaTheme) metaTheme.content = t === 'dark' ? '#0b1322' : '#f5f8fc';
}
applyTheme(root.dataset.theme || 'light');
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(t);
  try { localStorage.setItem('theme', t); } catch (e) {}
});

// ===== Menu mobile =====
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle.setAttribute('aria-expanded', false);
}));

document.getElementById('yr').textContent = new Date().getFullYear();

// ===== Progress bar, bayangan nav, menu aktif =====
const bar = document.querySelector('.progress');
const nav = document.querySelector('.nav');
const sections = [...document.querySelectorAll('main section[id]')];
const navMap = new Map([...links.querySelectorAll('a[href^="#"]')].map(a => [a.getAttribute('href').slice(1), a]));
function onScroll() {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  nav.classList.toggle('scrolled', h.scrollTop > 10);
  let current = '';
  sections.forEach(s => { if (s.getBoundingClientRect().top < 150) current = s.id; });
  if (current === 'sertifikat') current = 'keahlian';
  navMap.forEach((a, id) => a.classList.toggle('active', id === current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Efek mengetik =====
const roles = [
  'Electrical Engineer — Bayucaraka ITS',
  'Flight Controller & PCB Designer',
  'Asisten Lab Embedded Systems',
  'Programmer PLC Omron (BNSP)'
];
const typed = document.getElementById('typed');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  let r = 0, i = roles[0].length, del = true;
  (function tick() {
    typed.textContent = roles[r].slice(0, i);
    if (del) { i--; if (i < 0) { del = false; r = (r + 1) % roles.length; i = 0; } }
    else { i++; if (i > roles[r].length) { del = true; i = roles[r].length; return setTimeout(tick, 2200); } }
    setTimeout(tick, del ? 26 : 55);
  })();
}

// ===== Animasi muncul + counter =====
const targets = document.querySelectorAll('.sec-head, .about-media, .about h2, .pillars div, .award-hero, .award, .mini-awards li, .featured, .card, .more-projects div, .tl, .skill-group, .tool, .doc, .cert, .gallery figure, .cta-box');

// ===== Gambar software opsional: taruh file di assets/tools/<nama>.png =====
document.querySelectorAll('.logo[data-img]').forEach(el => {
  const img = new Image();
  img.onload = () => { el.textContent = ''; img.alt = ''; el.appendChild(img); el.classList.add('has-img'); };
  img.src = el.dataset.img;
});
targets.forEach(el => el.classList.add('reveal'));
const counters = document.querySelectorAll('[data-count]');
function runCounter(el) {
  const end = +el.dataset.count, suf = el.dataset.suffix || '';
  const t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suf : '');
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.dataset.count) runCounter(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => io.observe(el));
  counters.forEach(el => io.observe(el));
} else {
  targets.forEach(el => el.classList.add('in'));
}

// ===== Filter galeri =====
const figs = [...document.querySelectorAll('.gallery figure')];
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    figs.forEach(fig => {
      const hide = f !== 'all' && fig.dataset.cat !== f;
      fig.classList.toggle('hide', hide);
      if (!hide) fig.classList.add('in');
    });
  });
});

// ===== Lightbox (galeri, sertifikat, foto magang) =====
const lb = document.querySelector('.lightbox');
const lbImg = lb.querySelector('img');
const lbCap = lb.querySelector('figcaption');
let list = [], idx = 0;
function itemsOf(group) {
  if (group === 'gallery') return figs.filter(f => !f.classList.contains('hide')).map(f => ({ src: f.querySelector('img').src, alt: f.querySelector('img').alt, cap: f.querySelector('figcaption').textContent }));
  if (group === 'docs') return [...document.querySelectorAll('.doc')].map(d => ({ src: d.dataset.full, alt: d.querySelector('img').alt, cap: d.querySelector('b').textContent }));
  return [...document.querySelectorAll('.tl-photos img')].map(i => ({ src: i.src, alt: i.alt, cap: i.dataset.cap }));
}
function openLb(group, i) { list = itemsOf(group); show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; }
function show(i) {
  idx = (i + list.length) % list.length;
  lbImg.src = list[idx].src; lbImg.alt = list[idx].alt; lbCap.textContent = list[idx].cap;
}
function closeLb() { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; }
figs.forEach(f => f.addEventListener('click', () => openLb('gallery', itemsOf('gallery').findIndex(x => x.src === f.querySelector('img').src))));
document.querySelectorAll('.doc').forEach((d, i) => d.addEventListener('click', () => openLb('docs', i)));
document.querySelectorAll('.tl-photos img').forEach((im, i) => im.addEventListener('click', () => openLb('photos', i)));
lb.querySelector('.lb-close').addEventListener('click', closeLb);
lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') show(idx + 1);
  if (e.key === 'ArrowLeft') show(idx - 1);
});

// ===== Filter proyek =====
const pcards=[...document.querySelectorAll('.cards .card')];
document.querySelectorAll('.pfilters button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.pfilters button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const f=btn.dataset.pf;
  pcards.forEach(c=>{const h=f!=='all'&&c.dataset.cat!==f;c.classList.toggle('hide',h);if(!h)c.classList.add('in');});
}));

// ===== Modal studi kasus proyek =====
const pm=document.querySelector('.pmodal');
const pmContent=pm.querySelector('.pm-content');
let lastFocus=null;
function openProject(id){
  const t=document.getElementById('tp-'+id); if(!t) return;
  pmContent.innerHTML=''; pmContent.appendChild(t.content.cloneNode(true));
  lastFocus=document.activeElement; pm.hidden=false; document.body.style.overflow='hidden';
  pm.querySelector('.pm-close').focus();
}
function closeProject(){pm.hidden=true;document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
document.querySelectorAll('[data-p]').forEach(el=>{
  el.addEventListener('click',()=>openProject(el.dataset.p));
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProject(el.dataset.p);}});
});
pm.querySelector('.pm-close').addEventListener('click',closeProject);
pm.addEventListener('click',e=>{if(e.target===pm)closeProject();});
document.addEventListener('keydown',e=>{if(!pm.hidden&&e.key==='Escape')closeProject();});

// ===== Animasi elektro: stagger, sorotan kartu, timeline beraliran =====
(() => {
  // Muncul berurutan: elemen saudara dalam satu grid diberi jeda bertahap
  document.querySelectorAll('.reveal').forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i, 6) * 0.07 + 's');
  });

  // Sorotan kursor + bingkai bercahaya (hanya perangkat dengan mouse)
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    document.querySelectorAll('.card, .featured, .award, .tool, .doc, .skill-group').forEach(el => {
      el.classList.add('glow');
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Garis timeline terisi mengikuti scroll, titik menyala saat dilewati
  const tl = document.querySelector('.timeline');
  if (tl) {
    const items = [...tl.querySelectorAll('.tl')];
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = tl.getBoundingClientRect(), mid = window.innerHeight * 0.6;
      const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      tl.style.setProperty('--tl', p.toFixed(3));
      items.forEach(it => it.classList.toggle('lit', it.getBoundingClientRect().top + 30 < mid));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Hentikan animasi latar saat tidak terlihat (hemat baterai)
  if ('IntersectionObserver' in window) {
    const pause = new IntersectionObserver(es => es.forEach(e => {
      e.target.style.animationPlayState = '';
      e.target.querySelectorAll('.pcb-sig path, .scope-mv').forEach(n => n.style.animationPlayState = e.isIntersecting ? 'running' : 'paused');
    }));
    document.querySelectorAll('.hero, .cta-box').forEach(n => pause.observe(n));
  }
})();
