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


// Keep animations optional and respect a visitor's system preference.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.getElementById('motion-toggle');
let motionPaused = reducedMotion.matches;
let motionChoiceMade = false;
function updateMotion() {
  document.documentElement.classList.toggle('motion-paused', motionPaused);
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  document.getElementById('motion-label').textContent = motionPaused ? 'Enable motion' : 'Pause motion';
  motionToggle.querySelector('[aria-hidden]').textContent = motionPaused ? '▷' : 'Ⅱ';
}
motionToggle.hidden = false;
updateMotion();
motionToggle.addEventListener('click', () => {
  motionChoiceMade = true;
  motionPaused = !motionPaused;
  updateMotion();
});
reducedMotion.addEventListener('change', () => {
  if (!motionChoiceMade) { motionPaused = reducedMotion.matches; updateMotion(); }
});
const processCopy = {
  raw: 'Clean transactions, investigate missing values, remove duplicates, and validate records.',
  analysis: 'Engineer revenue and time-based features. Explore products, customers, countries, and monthly sales.',
  insight: 'Translate patterns into business-focused visualizations and insights about sales performance.'
};
document.querySelectorAll('[data-process]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-process]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('process-explanation').textContent = processCopy[button.dataset.process];
  });
});
const projectCards = Array.from(document.querySelectorAll('.project[data-tools]'));
const projectPair = document.querySelector('.project-pair');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
function filterProjects(filter) {
  let visible = 0;
  projectCards.forEach(card => {
    const show = filter === 'all' || card.dataset.tools.split(' ').includes(filter);
    card.hidden = !show;
    if (show) visible++;
  });
  const pairVisible = Array.from(projectPair.querySelectorAll('.project')).filter(card => !card.hidden).length;
  projectPair.hidden = pairVisible === 0;
  projectPair.classList.toggle('single-result', pairVisible === 1);
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  document.getElementById('project-count').textContent = filter === 'all' ? 'Showing all 3 projects' : `Showing ${visible} ${visible === 1 ? 'project' : 'projects'}`;
}
filterButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
document.getElementById('project-controls').hidden = false;
// A direct project link must remain usable after filtering.
function revealLinkedProject() {
  const id = location.hash.slice(1);
  const target = projectCards.find(card => card.id === id);
  if (target && target.hidden) {
    filterProjects('all');
    target.scrollIntoView({behavior: motionPaused ? 'instant' : 'smooth', block: 'start'});
  }
}
window.addEventListener('hashchange', revealLinkedProject);
document.querySelectorAll('a[href="#ecommerce"]').forEach(link => link.addEventListener('click', () => filterProjects('all')));
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motionPaused) entry.target.classList.add('motion-enter');
      reveals.unobserve(entry.target);
    });
  }, {threshold: 0.08});
  document.querySelectorAll('.section-heading, .project, .role, .about-intro, .about-details').forEach(element => reveals.observe(element));
}
if (!motionPaused) document.querySelector('.hero-copy').classList.add('hero-enter');
document.querySelectorAll('.project details').forEach(details => {
  details.addEventListener('toggle', () => {
    const content = details.querySelector('.case-detail');
    content.classList.toggle('detail-enter', details.open && !motionPaused);
  });
});
// Lightweight pointer highlight without moving targets or trapping scrolling.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.project-content').forEach(panel => {
    panel.addEventListener('pointermove', event => {
      if (motionPaused) return;
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      panel.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    });
    panel.addEventListener('pointerleave', () => {
      panel.style.removeProperty('--pointer-x'); panel.style.removeProperty('--pointer-y');
    });
  });
}
let scrollFramePending = false;
function refreshReadingPosition() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
  document.getElementById('reading-progress-fill').style.transform = `scaleX(${progress})`;
  document.getElementById('back-top').hidden = window.scrollY < 650;
  scrollFramePending = false;
}
function scheduleReadingUpdate() {
  if (!scrollFramePending) { scrollFramePending = true; requestAnimationFrame(refreshReadingPosition); }
}
window.addEventListener('scroll', scheduleReadingUpdate, {passive: true});
window.addEventListener('resize', scheduleReadingUpdate);
window.addEventListener('load', scheduleReadingUpdate);
if ('ResizeObserver' in window) new ResizeObserver(scheduleReadingUpdate).observe(document.body);
refreshReadingPosition();
