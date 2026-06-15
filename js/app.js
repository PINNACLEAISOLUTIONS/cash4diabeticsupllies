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
// ── Email form AJAX submissions via FormSubmit.co
document.querySelectorAll('.email-form').forEach(form => {
  form.addEventListener('submit', function(e) {
    // If running locally via file://, let the browser submit normally (no AJAX)
    // to bypass FormSubmit's CORS block on file:// origins.
    if (window.location.protocol === 'file:') {
      return; 
    }
    
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state with spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 1s linear infinite; margin-right: 0.5rem; display: inline-block; vertical-align: middle;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
      </svg>
      <span>Sending...</span>
    `;
    
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    // Add subject line if data-subject is present
    if (form.getAttribute('data-subject')) {
      data['_subject'] = form.getAttribute('data-subject');
    }
    // Disable FormSubmit captcha verification screen
    data['_captcha'] = 'false';
    
    // FormSubmit AJAX Endpoint
    fetch('https://formsubmit.co/ajax/b.michel23@yahoo.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(res => {
      if (res.success === 'true' || res.success === true) {
        // Show success state inside the form card
        form.innerHTML = `
          <div class="form-success-message" style="text-align: center; padding: 2rem 1rem;">
            <div class="success-icon" style="width: 60px; height: 60px; background: rgba(26,232,180,.15); color: var(--teal); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--white); margin-bottom: .5rem; letter-spacing: .05em;">Message Sent!</h3>
            <p style="font-size: .95rem; color: var(--muted); line-height: 1.6;">Thank you! Your quote request has been sent to our email. We will contact you with a cash offer shortly.</p>
          </div>
        `;
      } else {
        throw new Error('Submission failed');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      // Reset button state and display error alert
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      alert('Oops! There was a problem submitting your request. Please try calling or texting us directly at (407) 900-5510.');
    });
  });
});
