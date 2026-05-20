/**
 * i18n.js - Internationalization Engine for Free-Clipboard
 * Provides automatic language detection and translation management
 */

const i18n = {
    // Supported languages
    supportedLanguages: ['en', 'es', 'fr', 'de', 'ar'],

    // Current active language
    currentLang: 'en',

    // Translation dictionaries
    translations: {
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.tools': 'Tools',
            'nav.blog': 'Blog',
            'nav.about': 'About',
            'nav.contact': 'Contact',
            'nav.all_tools': 'All Tools',

            // Common
            'common.loading': 'Loading...',
            'common.error': 'Error',
            'common.success': 'Success',
            'common.save': 'Save',
            'common.cancel': 'Cancel',
            'common.delete': 'Delete',
            'common.edit': 'Edit',
            'common.copy': 'Copy',
            'common.download': 'Download',
            'common.clear': 'Clear',
            'common.reset': 'Reset',
            'common.calculate': 'Calculate',
            'common.generate': 'Generate',

            // Footer
            'footer.copyright': '© 2024 Free-Clipboard. All rights reserved.',
            'footer.privacy': 'Privacy Policy',
            'footer.terms': 'Terms of Service',

            // Language selector
            'lang.select': 'Select Language',
            'lang.english': 'English',
            'lang.spanish': 'Spanish',
            'lang.french': 'French',
            'lang.german': 'German',
            'lang.arabic': 'Arabic',
        },

        es: {
            // Navigation
            'nav.home': 'Inicio',
            'nav.tools': 'Herramientas',
            'nav.blog': 'Blog',
            'nav.about': 'Acerca de',
            'nav.contact': 'Contacto',
            'nav.all_tools': 'Todas las Herramientas',

            // Common
            'common.loading': 'Cargando...',
            'common.error': 'Error',
            'common.success': 'Éxito',
            'common.save': 'Guardar',
            'common.cancel': 'Cancelar',
            'common.delete': 'Eliminar',
            'common.edit': 'Editar',
            'common.copy': 'Copiar',
            'common.download': 'Descargar',
            'common.clear': 'Limpiar',
            'common.reset': 'Restablecer',
            'common.calculate': 'Calcular',
            'common.generate': 'Generar',

            // Footer
            'footer.copyright': '© 2024 Free-Clipboard. Todos los derechos reservados.',
            'footer.privacy': 'Política de Privacidad',
            'footer.terms': 'Términos de Servicio',

            // Language selector
            'lang.select': 'Seleccionar Idioma',
            'lang.english': 'Inglés',
            'lang.spanish': 'Español',
            'lang.french': 'Francés',
            'lang.german': 'Alemán',
            'lang.arabic': 'Árabe',
        },

        fr: {
            // Navigation
            'nav.home': 'Accueil',
            'nav.tools': 'Outils',
            'nav.blog': 'Blog',
            'nav.about': 'À propos',
            'nav.contact': 'Contact',
            'nav.all_tools': 'Tous les Outils',

            // Common
            'common.loading': 'Chargement...',
            'common.error': 'Erreur',
            'common.success': 'Succès',
            'common.save': 'Enregistrer',
            'common.cancel': 'Annuler',
            'common.delete': 'Supprimer',
            'common.edit': 'Modifier',
            'common.copy': 'Copier',
            'common.download': 'Télécharger',
            'common.clear': 'Effacer',
            'common.reset': 'Réinitialiser',
            'common.calculate': 'Calculer',
            'common.generate': 'Générer',

            // Footer
            'footer.copyright': '© 2024 Free-Clipboard. Tous droits réservés.',
            'footer.privacy': 'Politique de Confidentialité',
            'footer.terms': 'Conditions d\'Utilisation',

            // Language selector
            'lang.select': 'Sélectionner la Langue',
            'lang.english': 'Anglais',
            'lang.spanish': 'Espagnol',
            'lang.french': 'Français',
            'lang.german': 'Allemand',
            'lang.arabic': 'Arabe',
        },

        de: {
            // Navigation
            'nav.home': 'Startseite',
            'nav.tools': 'Werkzeuge',
            'nav.blog': 'Blog',
            'nav.about': 'Über uns',
            'nav.contact': 'Kontakt',
            'nav.all_tools': 'Alle Werkzeuge',

            // Common
            'common.loading': 'Laden...',
            'common.error': 'Fehler',
            'common.success': 'Erfolg',
            'common.save': 'Speichern',
            'common.cancel': 'Abbrechen',
            'common.delete': 'Löschen',
            'common.edit': 'Bearbeiten',
            'common.copy': 'Kopieren',
            'common.download': 'Herunterladen',
            'common.clear': 'Löschen',
            'common.reset': 'Zurücksetzen',
            'common.calculate': 'Berechnen',
            'common.generate': 'Generieren',

            // Footer
            'footer.copyright': '© 2024 Free-Clipboard. Alle Rechte vorbehalten.',
            'footer.privacy': 'Datenschutz',
            'footer.terms': 'Nutzungsbedingungen',

            // Language selector
            'lang.select': 'Sprache Auswählen',
            'lang.english': 'Englisch',
            'lang.spanish': 'Spanisch',
            'lang.french': 'Französisch',
            'lang.german': 'Deutsch',
            'lang.arabic': 'Arabisch',
        },

        ar: {
            // Navigation
            'nav.home': 'الرئيسية',
            'nav.tools': 'الأدوات',
            'nav.blog': 'المدونة',
            'nav.about': 'حول',
            'nav.contact': 'اتصل',
            'nav.all_tools': 'جميع الأدوات',

            // Common
            'common.loading': 'جاري التحميل...',
            'common.error': 'خطأ',
            'common.success': 'نجاح',
            'common.save': 'حفظ',
            'common.cancel': 'إلغاء',
            'common.delete': 'حذف',
            'common.edit': 'تعديل',
            'common.copy': 'نسخ',
            'common.download': 'تحميل',
            'common.clear': 'مسح',
            'common.reset': 'إعادة تعيين',
            'common.calculate': 'احسب',
            'common.generate': 'توليد',

            // Footer
            'footer.copyright': '© 2024 Free-Clipboard. جميع الحقوق محفوظة.',
            'footer.privacy': 'سياسة الخصوصية',
            'footer.terms': 'شروط الخدمة',

            // Language selector
            'lang.select': 'اختر اللغة',
            'lang.english': 'الإنجليزية',
            'lang.spanish': 'الإسبانية',
            'lang.french': 'الفرنسية',
            'lang.german': 'الألمانية',
            'lang.arabic': 'العربية',
        }
    },

    /**
     * Detect user's preferred language
     * Priority: localStorage > navigator.language > default (en)
     */
    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('user_lang');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            return savedLang;
        }

        // Check browser settings
        const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];

        for (let lang of browserLangs) {
            // Extract language code (e.g., 'en-US' -> 'en')
            const langCode = lang.split('-')[0].toLowerCase();

            if (this.supportedLanguages.includes(langCode)) {
                return langCode;
            }
        }

        // Default fallback
        return 'en';
    },

    /**
     * Set the active language
     */
    setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language '${lang}' not supported. Falling back to 'en'.`);
            lang = 'en';
        }

        this.currentLang = lang;
        localStorage.setItem('user_lang', lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update direction for RTL languages
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }

        this.updateContent();
    },

    /**
     * Get translation for a key
     */
    t(key, lang = null) {
        const targetLang = lang || this.currentLang;

        if (!this.translations[targetLang]) {
            console.warn(`Translations for '${targetLang}' not found.`);
            return key;
        }

        return this.translations[targetLang][key] || key;
    },

    /**
     * Update all content with data-i18n attributes
     */
    updateContent() {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Update based on element type
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'submit' || element.type === 'button') {
                    element.value = translation;
                } else {
                    element.placeholder = translation;
                }
            } else if (element.tagName === 'IMG') {
                element.alt = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Trigger custom event for tools that need to update
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    },

    /**
     * Format number based on locale
     */
    formatNumber(number, options = {}) {
        const locale = this.getLocale();
        return new Intl.NumberFormat(locale, options).format(number);
    },

    /**
     * Format currency based on locale
     */
    formatCurrency(amount, currency = 'USD') {
        const locale = this.getLocale();
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Format date based on locale
     */
    formatDate(date, options = {}) {
        const locale = this.getLocale();
        return new Intl.DateTimeFormat(locale, options).format(date);
    },

    /**
     * Get full locale code for Intl API
     */
    getLocale() {
        const localeMap = {
            'en': 'en-US',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'ar': 'ar-SA'
        };

        return localeMap[this.currentLang] || 'en-US';
    },

    /**
     * Initialize i18n system
     */
    init() {
        // Detect and set language
        const detectedLang = this.detectLanguage();
        this.setLanguage(detectedLang);

        // Set up language switcher if it exists
        const langSwitcher = document.getElementById('language-switcher');
        if (langSwitcher) {
            langSwitcher.value = this.currentLang;
            langSwitcher.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Export for use in other scripts
window.i18n = i18n;
