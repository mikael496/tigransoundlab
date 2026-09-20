'use strict';
const dialog = document.querySelector('#support-dialog');
let supportTrigger;
document.querySelectorAll('[data-support]').forEach(button => button.addEventListener('click', () => { supportTrigger=button; dialog.showModal(); document.body.classList.add('modal-open'); }));
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); supportTrigger?.focus(); });
dialog.addEventListener('click', event => { const r=dialog.getBoundingClientRect(); if(event.target===dialog && (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)) dialog.close(); });
let languageRequest = 0;
const translations = fetch('translations.json').then(response => { if(!response.ok) throw new Error('Translations unavailable'); return response.json(); });
// Keep the English HTML usable even if the translations cannot be loaded.
translations.catch(() => {});
async function setLang(lang) {
  if(!['es','en','ru','hy'].includes(lang)) return;
  const request = ++languageRequest;
  try {
    const all = await translations;
    if(request !== languageRequest) return;
    const dictionary=all[lang];
    document.querySelectorAll('[data-i18n]').forEach(node => { if(dictionary[node.dataset.i18n]) node.textContent=dictionary[node.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-alt]').forEach(node => { node.alt=dictionary[node.dataset.i18nAlt]; });
    document.querySelectorAll('[data-i18n-label]').forEach(node => { node.setAttribute('aria-label',dictionary[node.dataset.i18nLabel]); });
    document.documentElement.lang=lang;
    document.title='TigranSoundLab — '+dictionary.footer;
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));
    try { localStorage.setItem('tigran-language',lang); } catch {}
  } catch { /* Leave the fully rendered English page intact. */ }
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click',()=>setLang(button.dataset.lang)));
try { const saved=localStorage.getItem('tigran-language'); if(saved) setLang(saved); } catch {}

const themeToggle = document.querySelector('.theme-toggle');
function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#151b18' : '#f7f3eb';
}
applyTheme(document.documentElement.dataset.theme === 'dark');
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  applyTheme(dark);
  try { localStorage.setItem('tigran-theme', dark ? 'dark' : 'light'); } catch {}
});

const posterDialog = document.querySelector('#poster-dialog');
let posterTrigger;
document.querySelectorAll('[data-event-poster]').forEach(link => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof posterDialog.showModal !== 'function') return;
  event.preventDefault();
  posterTrigger=link;
  const source=link.querySelector('img');
  const full=posterDialog.querySelector('img');
  full.src=link.href; full.alt=source.alt;
  document.querySelector('#poster-title').textContent=source.alt;
  posterDialog.showModal();
  document.body.classList.add('modal-open');
}));
posterDialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  posterTrigger?.focus();
  posterDialog.querySelector('img').removeAttribute('src');
});
posterDialog.addEventListener('click', event => {
  const r=posterDialog.getBoundingClientRect();
  if(event.target===posterDialog && (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)) posterDialog.close();
});