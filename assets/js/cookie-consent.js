/**
 * Cookie Consent Manager
 * Handles cookie consent banner, user preferences, and cookie management
 */

class CookieConsentManager {
    constructor() {
        this.cookieName = 'cookie_consent';
        this.cookieExpiry = 365; // days
        this.gtagId = window.FREECLIPBOARD_CONFIG?.gtagId || null;
        this.gtagScriptId = 'fc-gtag-script';
        this.preferences = {
            necessary: true, // Always true, cannot be disabled
            analytics: false,
            marketing: false,
            preferences: false
        };
        
        this.init();
    }

    init() {
        // Check if user has already made a choice
        const existingConsent = this.getCookie(this.cookieName);
        
        if (existingConsent) {
            this.preferences = JSON.parse(existingConsent);
            this.applyPreferences();
        } else {
            // Show banner after a short delay for better UX
            setTimeout(() => this.showBanner(), 1000);
        }

        this.attachEventListeners();
    }

    showBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    showSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.classList.add('show');
            this.loadCurrentPreferences();
        }
    }

    hideSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    loadCurrentPreferences() {
        // Load current preferences into the settings modal
        document.getElementById('analyticsToggle').checked = this.preferences.analytics;
        document.getElementById('marketingToggle').checked = this.preferences.marketing;
        document.getElementById('preferencesToggle').checked = this.preferences.preferences;
    }

    acceptAll() {
        this.preferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
        };
        this.savePreferences();
        this.hideBanner();
        this.applyPreferences();
    }

    declineAll() {
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        this.savePreferences();
        this.hideBanner();
        this.applyPreferences();
    }

    saveCustomPreferences() {
        this.preferences = {
            necessary: true, // Always true
            analytics: document.getElementById('analyticsToggle').checked,
            marketing: document.getElementById('marketingToggle').checked,
            preferences: document.getElementById('preferencesToggle').checked
        };
        this.savePreferences();
        this.hideSettings();
        this.hideBanner();
        this.applyPreferences();
    }

    savePreferences() {
        const consentData = JSON.stringify(this.preferences);
        this.setCookie(this.cookieName, consentData, this.cookieExpiry);
        
        // Dispatch custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: this.preferences
        }));
    }

    applyPreferences() {
        // Apply analytics cookies
        if (this.preferences.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Apply marketing cookies
        if (this.preferences.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        // Apply preference cookies
        if (this.preferences.preferences) {
            this.enablePreferences();
        } else {
            this.disablePreferences();
        }
    }

    enableAnalytics() {
        if (!this.gtagId) {
            return;
        }

        this.loadGoogleTag();
        window.gtag('consent', 'update', {
            analytics_storage: 'granted'
        });
    }

    disableAnalytics() {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                analytics_storage: 'denied'
            });
        }

        this.deleteCookie('_ga');
        this.deleteCookie('_gid');
        this.deleteCookie('_gat');
        this.deleteCookie(`_ga_${this.gtagId?.replace(/-/g, '_')}`);
    }

    enableMarketing() {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
            });
        }
    }

    disableMarketing() {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
            });
        }
    }

    enablePreferences() {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                functionality_storage: 'granted',
                personalization_storage: 'granted'
            });
        }
    }

    disablePreferences() {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                functionality_storage: 'denied',
                personalization_storage: 'denied'
            });
        }
    }

    loadGoogleTag() {
        if (!this.gtagId || document.getElementById(this.gtagScriptId)) {
            if (typeof window.gtag === 'function' && !window.__fcGtagConfigured) {
                window.gtag('js', new Date());
                window.gtag('config', this.gtagId, {
                    anonymize_ip: true
                });
                window.__fcGtagConfigured = true;
            }
            return;
        }

        const script = document.createElement('script');
        script.id = this.gtagScriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(this.gtagId)}`;
        script.onload = () => {
            window.gtag('js', new Date());
            window.gtag('config', this.gtagId, {
                anonymize_ip: true
            });
            window.__fcGtagConfigured = true;
        };
        document.head.appendChild(script);
    }

    attachEventListeners() {
        // Accept all button
        const acceptBtn = document.getElementById('acceptCookies');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }

        // Decline all button
        const declineBtn = document.getElementById('declineCookies');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineAll());
        }

        // Settings button
        const settingsBtn = document.getElementById('cookieSettings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }

        // Close settings modal
        const closeBtn = document.getElementById('closeSettings');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideSettings());
        }

        // Save custom preferences
        const saveBtn = document.getElementById('savePreferences');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCustomPreferences());
        }

        // Close modal when clicking outside
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideSettings();
                }
            });
        }
    }

    // Cookie utility methods
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }

    // Public method to check if a specific cookie type is allowed
    isAllowed(type) {
        return this.preferences[type] === true;
    }

    // Public method to get all preferences
    getPreferences() {
        return { ...this.preferences };
    }

    // Public method to reset consent (for testing)
    resetConsent() {
        this.deleteCookie(this.cookieName);
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        this.showBanner();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cookieConsent = new CookieConsentManager();
    });
} else {
    window.cookieConsent = new CookieConsentManager();
}
