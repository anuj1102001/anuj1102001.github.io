/* Apply the saved appearance before the stylesheet paints the page. */
(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem('anuj-portfolio-theme'); } catch (_) {}
  if (saved !== 'light' && saved !== 'dark') saved = null;
  let theme = saved || (system.matches ? 'dark' : 'light');
  function apply() {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#151719' : '#fcfcfa';
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('theme-toggle').addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      saved = theme;
      try { localStorage.setItem('anuj-portfolio-theme', theme); } catch (_) {}
      apply();
    });
  });
  system.addEventListener('change', event => {
    if (!saved) { theme = event.matches ? 'dark' : 'light'; apply(); }
  });
})();
