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

            // Headline Analyzer
            'tool.headline.title': 'Free SEO Headline Analyzer & Title Checker',
            'tool.headline.description': 'Analyze your headlines for SEO effectiveness, emotional impact, and readability. Get actionable feedback to improve click-through rates.',
            'tool.headline.input_label': 'Enter Your Headline',
            'tool.headline.input_placeholder': 'Example: 10 Proven Strategies to Boost Your Productivity in 2026',
            'tool.headline.analyze_btn': 'Analyze Headline',
            'tool.headline.your_score': 'Your Score',
            'tool.headline.feedback_title': 'Feedback & Suggestions',
            'tool.headline.length_title': 'Length Analysis',
            'tool.headline.characters': 'Characters',
            'tool.headline.words': 'Words',
            'tool.headline.optimal_range': 'Optimal: 40-60 characters',
            'tool.headline.power_words_title': 'Power Words',
            'tool.headline.no_power_words': 'None detected',
            'tool.headline.sentiment_title': 'Sentiment',
            'tool.headline.type_title': 'Headline Type',
            'tool.headline.no_type': 'Standard',
            'tool.headline.examples_title': 'Example Headlines to Try',
            'tool.headline.tips_title': 'Tips for Better Headlines',
            'tool.headline.tip1': 'Keep it between 40-60 characters for optimal SEO',
            'tool.headline.tip2': 'Use power words like "ultimate", "essential", "proven"',
            'tool.headline.tip3': 'Include numbers for listicles (e.g., "7 Ways...")',
            'tool.headline.tip4': 'Add emotional words to create engagement',
            'tool.headline.tip5': 'Use "How to" format for tutorials',
            'tool.headline.tip6': 'Ask questions to spark curiosity'
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

            // Headline Analyzer
            'tool.headline.title': 'Analizador de Titulares SEO Gratis y Probador de Títulos',
            'tool.headline.description': 'Analice sus titulares para evaluar su efectividad SEO, impacto emocional y legibilidad. Obtenga sugerencias para mejorar el porcentaje de clics (CTR).',
            'tool.headline.input_label': 'Ingrese su titular',
            'tool.headline.input_placeholder': 'Ejemplo: 10 estrategias probadas para aumentar su productividad en 2026',
            'tool.headline.analyze_btn': 'Analizar titular',
            'tool.headline.your_score': 'Su puntuación',
            'tool.headline.feedback_title': 'Comentarios y sugerencias',
            'tool.headline.length_title': 'Análisis de longitud',
            'tool.headline.characters': 'Caracteres',
            'tool.headline.words': 'Palabras',
            'tool.headline.optimal_range': 'Óptimo: 40-60 caracteres',
            'tool.headline.power_words_title': 'Palabras de poder',
            'tool.headline.no_power_words': 'Ninguna detectada',
            'tool.headline.sentiment_title': 'Sentimiento',
            'tool.headline.type_title': 'Tipo de titular',
            'tool.headline.no_type': 'Estándar',
            'tool.headline.examples_title': 'Ejemplos de titulares para probar',
            'tool.headline.tips_title': 'Consejos para mejores titulares',
            'tool.headline.tip1': 'Manténgalo entre 40 y 60 caracteres para un SEO óptimo',
            'tool.headline.tip2': 'Use palabras de poder como "definitivo", "esencial", "probado"',
            'tool.headline.tip3': 'Incluya números para listas (por ejemplo, "7 formas...")',
            'tool.headline.tip4': 'Agregue palabras emocionales para fomentar la interacción',
            'tool.headline.tip5': 'Use el formato "Cómo hacer..." para tutoriales',
            'tool.headline.tip6': 'Haga preguntas para despertar la curiosidad'
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

            // Headline Analyzer
            'tool.headline.title': 'Analyseur de Titres SEO Gratuit & Testeur de Titres',
            'tool.headline.description': 'Analysez vos titres pour évaluer leur efficacité SEO, leur impact émotionnel et leur lisibilité. Obtenez des conseils pour améliorer votre taux de clic (CTR).',
            'tool.headline.input_label': 'Entrez votre titre',
            'tool.headline.input_placeholder': 'Exemple : 10 stratégies éprouvées pour booster votre productivité en 2026',
            'tool.headline.analyze_btn': 'Analyser le titre',
            'tool.headline.your_score': 'Votre score',
            'tool.headline.feedback_title': 'Commentaires et suggestions',
            'tool.headline.length_title': 'Analyse de la longueur',
            'tool.headline.characters': 'Caractères',
            'tool.headline.words': 'Mots',
            'tool.headline.optimal_range': 'Optimal : 40-60 caractères',
            'tool.headline.power_words_title': 'Mots de pouvoir',
            'tool.headline.no_power_words': 'Aucun détecté',
            'tool.headline.sentiment_title': 'Sentiment',
            'tool.headline.type_title': 'Type de titre',
            'tool.headline.no_type': 'Standard',
            'tool.headline.examples_title': 'Exemples de titres à tester',
            'tool.headline.tips_title': 'Conseils pour de meilleurs titres',
            'tool.headline.tip1': 'Visez entre 40 et 60 caractères pour un SEO optimal',
            'tool.headline.tip2': 'Utilisez des mots puissants comme "ultime", "essentiel", "prouvé"',
            'tool.headline.tip3': 'Intégrez des chiffres pour les listes (ex: "7 façons...")',
            'tool.headline.tip4': 'Ajoutez des mots émotionnels pour susciter l\'engagement',
            'tool.headline.tip5': 'Utilisez le format "Comment..." pour les guides pratiques',
            'tool.headline.tip6': 'Posez des questions pour éveiller la curiosité'
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

            // Headline Analyzer
            'tool.headline.title': 'Kostenloser SEO Überschriften-Analyser & Titel-Checker',
            'tool.headline.description': 'Analysieren Sie Ihre Überschriften auf SEO-Wirksamkeit, emotionale Wirkung und Lesbarkeit. Erhalten Sie direktes Feedback zur Steigerung der Klickrate (CTR).',
            'tool.headline.input_label': 'Geben Sie Ihre Überschrift ein',
            'tool.headline.input_placeholder': 'Beispiel: 10 bewährte Strategien zur Steigerung der Produktivität im Jahr 2026',
            'tool.headline.analyze_btn': 'Überschrift analysieren',
            'tool.headline.your_score': 'Ihr Ergebnis',
            'tool.headline.feedback_title': 'Feedback & Vorschläge',
            'tool.headline.length_title': 'Längenanalyse',
            'tool.headline.characters': 'Zeichen',
            'tool.headline.words': 'Wörter',
            'tool.headline.optimal_range': 'Optimal: 40-60 Zeichen',
            'tool.headline.power_words_title': 'Power-Wörter',
            'tool.headline.no_power_words': 'Keine erkannt',
            'tool.headline.sentiment_title': 'Sentiment (Tonalität)',
            'tool.headline.type_title': 'Überschriftstyp',
            'tool.headline.no_type': 'Standard',
            'tool.headline.examples_title': 'Beispielhafte Überschriften zum Testen',
            'tool.headline.tips_title': 'Tipps für bessere Überschriften',
            'tool.headline.tip1': 'Halten Sie die Länge für optimales SEO zwischen 40 und 60 Zeichen',
            'tool.headline.tip2': 'Verwenden Sie Power-Wörter wie "ultimativ", "essenziell", "bewährt"',
            'tool.headline.tip3': 'Nutzen Sie Zahlen für Listenüberschriften (z. B. "7 Wege...")',
            'tool.headline.tip4': 'Fügen Sie emotionale Begriffe hinzu, um Interaktion zu wecken',
            'tool.headline.tip5': 'Nutzen Sie das "Wie Sie..."-Format für Anleitungen',
            'tool.headline.tip6': 'Stellen Sie Fragen, um die Neugier der Leser zu wecken'
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

            // Headline Analyzer
            'tool.headline.title': 'محلل العناوين المجاني وتدقيق عناوين السيو (SEO)',
            'tool.headline.description': 'حلل عناوينك لتقييم مدى فعاليتها في محركات البحث (SEO)، وتأثيرها العاطفي، وسهولة قراءتها. احصل على نصائح عملية لزيادة نسبة النقر إلى الظهور (CTR).',
            'tool.headline.input_label': 'أدخل عنوانك هنا',
            'tool.headline.input_placeholder': 'مثال: 10 استراتيجيات مجربة لزيادة إنتاجيتك في عام 2026',
            'tool.headline.analyze_btn': 'حلل العنوان الآن',
            'tool.headline.your_score': 'تقييمك',
            'tool.headline.feedback_title': 'التقييم والمقترحات',
            'tool.headline.length_title': 'تحليل الطول',
            'tool.headline.characters': 'الحروف',
            'tool.headline.words': 'الكلمات',
            'tool.headline.optimal_range': 'الطول المثالي: 40-60 حرفاً',
            'tool.headline.power_words_title': 'الكلمات القوية المؤثرة',
            'tool.headline.no_power_words': 'لم يتم العثور على أي منها',
            'tool.headline.sentiment_title': 'الجانب العاطفي',
            'tool.headline.type_title': 'نوع العنوان',
            'tool.headline.no_type': 'اعتيادي',
            'tool.headline.examples_title': 'عناوين تجريبية مقترحة',
            'tool.headline.tips_title': 'نصائح لكتابة عناوين أفضل',
            'tool.headline.tip1': 'احرص على أن يكون طول العنوان بين 40 و60 حرفاً لتحسين السيو (SEO)',
            'tool.headline.tip2': 'استخدم الكلمات المؤثرة مثل "مثالي"، "أساسي"، "مجرب"',
            'tool.headline.tip3': 'أضف أرقاماً في العناوين القائمة على القوائم (مثال: "7 طرق لـ...")',
            'tool.headline.tip4': 'استخدم كلمات عاطفية لجذب انتباه القراء وزيادة التفاعل',
            'tool.headline.tip5': 'ابدأ بـ "كيفية..." لشرح طريقة عمل شيء ما وتوضيح الفائدة',
            'tool.headline.tip6': 'اطرح أسئلة لإثارة فضول القارئ ودفعه للنقر'
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
