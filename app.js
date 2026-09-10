'use strict';
const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
const emailField = document.getElementById('email-address');
function legacyCopyEmail() {
  emailField.focus();
  emailField.select();
  emailField.setSelectionRange(0, emailField.value.length);
  try { return document.execCommand('copy'); } catch { return false; }
}
copyButton.addEventListener('click', async () => {
  let copied = false;
  // Try the synchronous fallback during the user gesture if clipboard access is unavailable.
  if (!navigator.clipboard || !window.isSecureContext) {
    copied = legacyCopyEmail();
  } else {
    try { await navigator.clipboard.writeText(emailField.value); copied = true; }
    catch { copied = legacyCopyEmail(); }
  }
  if (copied) {
    copyStatus.textContent = 'Email copied.';
    copyButton.focus();
  } else {
    emailField.focus();
    emailField.select();
    copyStatus.textContent = 'Email selected. Press Ctrl+C (Windows) or Command+C (Mac), or touch and hold to copy.';
  }
});
emailField.addEventListener('click', () => emailField.select());
document.querySelector('.dark-button').addEventListener('click', () => {
  document.getElementById('contact-options').focus({preventScroll: true});
});
// The downloadable copy carries a single embedded PDF; use a Blob URL instead
// of navigating to a large data URL, which some browsers refuse to open.
const embeddedResume = document.getElementById('resume-pdf-base64');
if (embeddedResume) {
  try {
    const binary = atob(embeddedResume.textContent.trim());
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const resumeUrl = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
    document.querySelectorAll('[data-resume-download], #open-resume').forEach(link => {
      link.href = resumeUrl;
    });
    // Keep the URL alive for subsequent downloads and the PDF fallback tab.
  } catch {
    document.getElementById('resume-help').hidden = false;
    document.querySelector('#resume-help [role="status"]').textContent = 'Unable to prepare the embedded resume. Please request a copy by email.';
  }
}
document.querySelectorAll('[data-resume-download]').forEach(link => {
  link.addEventListener('click', () => { document.getElementById('resume-help').hidden = false; });
});
document.getElementById('dismiss-resume-help').addEventListener('click', () => {
  document.getElementById('resume-help').hidden = true;
});
document.getElementById('year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const links = Array.from(document.querySelectorAll('nav a'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, {rootMargin: '-15% 0px -60% 0px', threshold: 0});
  document.querySelectorAll('#work, #experience, #about, #contact').forEach(section => observer.observe(section));
}
