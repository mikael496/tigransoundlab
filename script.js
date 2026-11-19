'use strict';
const WHATSAPP = '593999688850';
const LANGS = ['es', 'en', 'ru', 'hy'];
let dictionary = null;

/* ---------- Mobile menu ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('#site-nav');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  navPanel.classList.toggle('open', open);
}
/* Switch to the compact (hamburger) header when the full menu would not fit in the bar */
const header = document.querySelector('.site-header');
const bar = header.querySelector('.bar');
function fitHeader() {
  header.classList.remove('compact');
  const needed = bar.querySelector('.brand').scrollWidth + 24 + navPanel.scrollWidth;
  const fits = window.innerWidth > 1040 && needed <= bar.clientWidth;
  header.classList.toggle('compact', !fits);
  if (fits) setMenu(false);
}
window.addEventListener('resize', fitHeader);
if (document.fonts) document.fonts.ready.then(fitHeader);
fitHeader();
menuToggle.addEventListener('click',() => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navPanel.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navPanel.classList.contains('open')) { setMenu(false); menuToggle.focus(); } });

/* ---------- WhatsApp links with a pre-filled message per offer ---------- */
function updateWhatsAppLinks() {
  document.querySelectorAll('[data-wa]').forEach(link => {
    const item = document.querySelector(`[data-i18n="${link.dataset.wa}"]`);
    const greeting = dictionary?.waGreeting || 'Hola Tigran, me interesa:';
    const text = `${greeting} ${item ? item.textContent.trim() : ''}`;
    link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  });
}

/* ---------- Translations (Spanish is the HTML default) ---------- */
let languageRequest = 0;
const translations = fetch('translations.json?v=3').then(r => { if (!r.ok) throw new Error('Translations unavailable'); return r.json(); });
translations.catch(() => {});
async function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  const request = ++languageRequest;
  try {
    const all = await translations;
    if (request !== languageRequest) return;
    dictionary = all[lang];
    document.querySelectorAll('[data-i18n]').forEach(node => { const t = dictionary[node.dataset.i18n]; if (t) node.textContent = t; });
    document.querySelectorAll('[data-i18n-alt]').forEach(node => { const t = dictionary[node.dataset.i18nAlt]; if (t) node.alt = t; });
    document.querySelectorAll('[data-i18n-label]').forEach(node => { const t = dictionary[node.dataset.i18nLabel]; if (t) node.setAttribute('aria-label', t); });
    document.documentElement.lang = lang;
    document.title = `Tigran Ter-Minasyan — ${dictionary.heroRole}`;
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    renderVideoLabels();
    updateWhatsAppLinks();
    fitHeader();
    try { localStorage.setItem('tigran-language', lang); } catch {}
  } catch { /* keep the Spanish page as rendered */ }
}
document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
(function initLanguage() {
  let lang = null;
  try { lang = localStorage.getItem('tigran-language'); } catch {}
  if (!lang) lang = (navigator.languages || [navigator.language]).map(l => (l || '').slice(0, 2).toLowerCase()).find(l => LANGS.includes(l));
  if (lang && lang !== 'es') setLang(lang); else updateWhatsAppLinks();
})();

/* ---------- YouTube: privacy-friendly embeds that load only on click ---------- */
function renderVideoLabels() {
  document.querySelectorAll('.video-soon').forEach(n => { n.textContent = dictionary?.videoSoon || 'Video próximamente'; });
  document.querySelectorAll('.video button').forEach(b => {
    const title = b.closest('.video').querySelector('.video-title').textContent;
    b.setAttribute('aria-label', `${dictionary?.play || 'Reproducir'}: ${title}`);
  });
}
document.querySelectorAll('.video').forEach(video => {
  const id = (video.dataset.youtube || '').trim();
  const title = video.querySelector('.video-title').textContent;
  if (!/^[\w-]{11}$/.test(id)) {
    video.style.backgroundImage = `url("${video.dataset.thumb}")`;
    const soon = document.createElement('span');
    soon.className = 'video-soon';
    video.append(soon);
    return;
  }
  video.style.backgroundImage = `url("https://i.ytimg.com/vi/${id}/hqdefault.jpg")`;
  const button = document.createElement('button');
  button.type = 'button';
  button.innerHTML = '<span aria-hidden="true"></span>';
  button.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    video.append(iframe);
    button.remove();
  });
  video.append(button);
});
renderVideoLabels();

/* ---------- Poster viewer ---------- */
const posterDialog = document.querySelector('#poster-dialog');
let posterTrigger;
document.querySelectorAll('[data-poster]').forEach(link => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || typeof posterDialog.showModal !== 'function') return;
  event.preventDefault();
  posterTrigger = link;
  const thumb = link.querySelector('img');
  const full = posterDialog.querySelector('img');
  full.src = link.href;
  full.alt = thumb.alt;
  posterDialog.querySelector('#poster-title').textContent = thumb.alt;
  posterDialog.showModal();
  document.body.classList.add('modal-open');
}));
posterDialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  posterDialog.querySelector('img').removeAttribute('src');
  posterTrigger?.focus();
});
posterDialog.addEventListener('click', event => { if (event.target === posterDialog) posterDialog.close(); });
