/**
 * Cookie Consent Test Script
 * This script demonstrates how to check cookie consent before loading analytics
 */

// Wait for cookie consent to be initialized
document.addEventListener('DOMContentLoaded', function() {
    // Listen for cookie consent updates
    window.addEventListener('cookieConsentUpdated', function(event) {
        const preferences = event.detail;
        console.log('Cookie preferences updated:', preferences);
        
        // Example: Load analytics only if user consented
        if (preferences.analytics) {
            console.log('✅ Analytics cookies allowed - Loading analytics...');
            // loadGoogleAnalytics();
        } else {
            console.log('❌ Analytics cookies declined');
        }
        
        if (preferences.marketing) {
            console.log('✅ Marketing cookies allowed');
        } else {
            console.log('❌ Marketing cookies declined');
        }
    });
    
    // Check if consent already exists
    setTimeout(function() {
        if (window.cookieConsent) {
            const preferences = window.cookieConsent.getPreferences();
            console.log('Current cookie preferences:', preferences);
            
            // Check specific permission
            if (window.cookieConsent.isAllowed('analytics')) {
                console.log('Analytics is currently allowed');
            }
        }
    }, 1500);
});

// Example function to load Google Analytics conditionally
function loadGoogleAnalytics() {
    // Only load if not already loaded
    if (typeof gtag === 'undefined') {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID';
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'YOUR-GA-ID');
    }
}
