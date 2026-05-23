// FreeClipboard - Main JavaScript
console.log('FreeClipboard loaded successfully');

// Theme handling
(function () {
  const THEME_KEY = 'theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to light mode
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      const icon = toggle.querySelector('#themeIcon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      } else {
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('title', theme === 'dark' ? 'Light mode' : 'Dark mode');
    }
  }

  function initTheme() {
    applyTheme(getPreferredTheme());

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();

// Mobile Menu Toggle
function toggleMobileMenu() {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('mobileMenuToggle');

  if (nav && toggle) {
    const isActive = nav.classList.toggle('active');
    toggle.classList.toggle('active');

    // Update aria-expanded for accessibility
    toggle.setAttribute('aria-expanded', isActive);

    // Prevent body scroll when menu is open
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeMobileMenu() {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('mobileMenuToggle');

  if (nav && toggle) {
    nav.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

// =========================================
// EVENT LISTENERS
// =========================================
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.site-nav .page-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (event) {
    const nav = document.getElementById('siteNav');
    const toggle = document.getElementById('mobileMenuToggle');
    const themeToggle = document.getElementById('themeToggle');

    if (nav && toggle &&
      !nav.contains(event.target) &&
      !toggle.contains(event.target) &&
      !themeToggle.contains(event.target)) {
      closeMobileMenu();
    }
  });

  // Close mobile menu when window is resized to desktop
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    }, 250);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading animation
  document.body.classList.add('loaded');
});