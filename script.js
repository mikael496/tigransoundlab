'use strict';
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
function closeMenu() { header.classList.remove('menu-open'); menuToggle.setAttribute('aria-expanded', 'false'); }
menuToggle.addEventListener('click', () => { const open = header.classList.toggle('menu-open'); menuToggle.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('#navigation a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && header.classList.contains('menu-open')) { closeMenu(); menuToggle.focus(); } });
const dialog = document.querySelector('#support-dialog');
let supportTrigger;
document.querySelectorAll('[data-support]').forEach(button => button.addEventListener('click', () => { supportTrigger=button; closeMenu(); dialog.showModal(); document.body.classList.add('modal-open'); }));
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); supportTrigger?.focus(); });
dialog.addEventListener('click', event => { const r=dialog.getBoundingClientRect(); if(event.target===dialog && (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)) dialog.close(); });
let languageRequest = 0;
const translations = fetch('translations.json').then(response => { if(!response.ok) throw new Error('Translations unavailable'); return response.json(); });
// Keep the Spanish HTML usable even if the translations cannot be loaded.
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
  } catch { /* Leave the fully rendered Spanish page intact. */ }
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click',()=>setLang(button.dataset.lang)));
try { const saved=localStorage.getItem('tigran-language'); if(saved) setLang(saved); } catch {}