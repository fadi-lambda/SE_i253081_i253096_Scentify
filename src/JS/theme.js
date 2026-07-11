// theme.js — Dark/Light Mode Toggle
// Works across all pages. Preference is saved in localStorage and
// applied instantly on page load (before content flashes wrong theme).

(function () {
  const STORAGE_KEY = 'scentifyTheme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    // Fall back to system preference if user hasn't chosen yet
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Apply theme immediately (before DOMContentLoaded) to avoid flash of wrong theme
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    updateToggleIcon(document.documentElement.getAttribute('data-theme'));

    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });
})();