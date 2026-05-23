/* =========================================
   FREE RESOURCES - JAVASCRIPT
   Handles interactions for resource pages
   ========================================= */

// Sticky CTA for mobile
function initStickyCTA() {
  const stickyCTA = document.getElementById('stickyCTA');
  if (!stickyCTA) return;
  
  const heroSection = document.querySelector('.hero-landing');
  const dismissBtn = stickyCTA.querySelector('.dismiss-cta');
  
  if (!heroSection) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > heroSection.offsetHeight) {
      stickyCTA.classList.add('visible');
    } else {
      stickyCTA.classList.remove('visible');
    }
  });
  
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      stickyCTA.style.display = 'none';
    });
  }
}

// Download tracking
function trackDownload(extensionName) {
  // Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'download', {
      'event_category': 'Extension',
      'event_label': extensionName
    });
  }
  
  // Console log for debugging
  console.log('Download tracked:', extensionName);
}

// Handle download button clicks
function initDownloadButtons() {
  const downloadBtns = document.querySelectorAll('[data-download]');
  
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Don't prevent default - let the browser handle the download
      // The href and download attributes will trigger the download
      
      const extensionName = btn.dataset.download;
      
      // Track the download
      trackDownload(extensionName);
      
      // Log for debugging
      console.log('Download initiated for:', extensionName);
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initStickyCTA();
  initDownloadButtons();
});
