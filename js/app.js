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
  
  let text = msg
    ? `Hi! My name is ${name}. I'd like to sell my diabetic supplies:\n\n${msg}\n\nI'd like to get an offer.`
    : `Hi! My name is ${name}. I'm interested in selling my unused diabetic supplies. I'd like to get a free offer.`;
  
  // Open WhatsApp with correct phone number
  window.open(`https://wa.me/14079005510?text=${encodeURIComponent(text)}`, '_blank');
  e.target.reset();
};
