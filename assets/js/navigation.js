/**
 * Navigation & Header Functionality
 * Handles mobile menu, dropdown menus, theme toggle, and scroll behavior
 */

(function () {
  'use strict';

  // ============================================
  // MOBILE MENU FUNCTIONALITY
  // ============================================

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Toggle states
      this.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.setAttribute('aria-hidden', isExpanded);
      this.classList.toggle('active');

      // Toggle inert for accessibility (prevents focus on hidden elements)
      if (!isExpanded) {
        mobileMenu.removeAttribute('inert');
      } else {
        mobileMenu.setAttribute('inert', '');
      }

      // Prevent body scroll when menu is open
      if (!isExpanded) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    // Close mobile menu when clicking on the overlay
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) {
        mobileMenuToggle.click();
      }
    });

    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-item');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
          mobileMenuToggle.click();
        }
      });
    });

    // Close mobile menu on window resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
        mobileMenuToggle.click();
      }
    });
  }

  // ============================================
  // DESKTOP DROPDOWN MENU FUNCTIONALITY
  // ============================================

  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    const navItem = toggle.closest('.nav-item');
    const dropdownMenu = navItem.querySelector('.dropdown-menu');

    if (!dropdownMenu) return;

    // Click handler for toggle
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all other dropdowns
      closeAllDropdowns();

      // Toggle current dropdown
      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
        navItem.classList.add('active');
      }
    });

    // Hover handlers for desktop
    if (window.innerWidth > 768) {
      navItem.addEventListener('mouseenter', function () {
        closeAllDropdowns();
        toggle.setAttribute('aria-expanded', 'true');
        this.classList.add('active');
      });

      navItem.addEventListener('mouseleave', function () {
        toggle.setAttribute('aria-expanded', 'false');
        this.classList.remove('active');
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      closeAllDropdowns();
    }
  });

  // Close all dropdowns helper
  function closeAllDropdowns() {
    dropdownToggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.closest('.nav-item').classList.remove('active');
    });
  }

  // ============================================
  // THEME TOGGLE FUNCTIONALITY
  // ============================================

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);

      // Add transition class for smooth theme change
      html.classList.add('theme-transitioning');
      setTimeout(() => {
        html.classList.remove('theme-transitioning');
      }, 300);
    });
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label',
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
  }

  // ============================================
  // HEADER SCROLL BEHAVIOR
  // ============================================

  const header = document.querySelector('.site-header');
  let lastScrollTop = 0;
  let scrollTimeout;

  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Add shadow on scroll
      if (scrollTop > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide header on scroll down, show on scroll up (optional)
      // Uncomment if you want this behavior:
      /*
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      */

      lastScrollTop = scrollTop;
    }, 10);
  });

  // ============================================
  // ACTIVE PAGE HIGHLIGHTING
  // ============================================

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== '/') {
      link.classList.add('active');
    }
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  // ESC key closes mobile menu and dropdowns
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // Close mobile menu
      if (mobileMenuToggle && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
        mobileMenuToggle.click();
      }

      // Close dropdowns
      closeAllDropdowns();
    }
  });

  // Tab trap for mobile menu accessibility
  if (mobileMenu) {
    const focusableElements = mobileMenu.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    mobileMenu.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // Close mobile menu if open
        if (mobileMenuToggle && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
          mobileMenuToggle.click();
        }

        // Smooth scroll to target
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // PERFORMANCE OPTIMIZATION
  // ============================================

  // Debounce function for resize events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimized resize handler
  const handleResize = debounce(function () {
    // Re-initialize hover behavior for dropdowns on resize
    if (window.innerWidth > 768) {
      closeAllDropdowns();
      body.style.overflow = '';
    }
  }, 250);

  window.addEventListener('resize', handleResize);

  // ============================================
  // INITIALIZATION COMPLETE
  // ============================================

  console.log('✅ Navigation initialized successfully');

})();
