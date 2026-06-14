// ── Scroll reveal observer
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── FAQ accordion toggle
window.toggleFaq = function(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
};

// ── WhatsApp form handler
window.sendWhatsApp = function(e, nameId, msgId) {
  e.preventDefault();
  const name = document.getElementById(nameId).value.trim();
  const msg  = document.getElementById(msgId).value.trim();
  const lang = document.documentElement.lang || 'en';
  let text;
  
  if (lang === 'es') {
    text = msg
      ? `¡Hola! Mi nombre es ${name}. Me gustaría vender mis suministros diabéticos:\n\n${msg}\n\nMe gustaría recibir una oferta.`
      : `¡Hola! Mi nombre es ${name}. Estoy interesado/a en vender mis suministros diabéticos sin usar. Me gustaría recibir una oferta gratis.`;
  } else {
    text = msg
      ? `Hi! My name is ${name}. I'd like to sell my diabetic supplies:\n\n${msg}\n\nI'd like to get an offer.`
      : `Hi! My name is ${name}. I'm interested in selling my unused diabetic supplies. I'd like to get a free offer.`;
  }
  
  // Open WhatsApp with correct phone number
  window.open(`https://wa.me/14079005510?text=${encodeURIComponent(text)}`, '_blank');
  e.target.reset();
};

// ── Language Setup
let currentLang = localStorage.getItem('fsb_lang');
if (!currentLang) {
  currentLang = navigator.language && navigator.language.startsWith('es') ? 'es' : 'en';
}
applyLang(currentLang);

// Language toggle click handlers
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    localStorage.setItem('fsb_lang', lang);
    applyLang(lang);
  });
});

function applyLang(lang) {
  currentLang = lang;
  const t = translations[lang];
  if (!t) return;

  document.documentElement.lang = lang;
  document.title = t.page_title;

  // Update toggle buttons
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  // data-i18n: textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // data-i18n-html: innerHTML
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // data-i18n-placeholder: placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
}
