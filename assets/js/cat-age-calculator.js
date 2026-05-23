// Cat Age Calculator - Production Grade
// Version 1.0.0

// ============================================================================
// CORE CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert cat age to human age equivalent
 * @param {number} catYears - Cat age in years (0-25)
 * @returns {number} Human age equivalent
 */
function toHumanAge(catYears) {
    if (catYears < 0) return 0;
    if (catYears > 25) catYears = 25;
    
    if (catYears <= 1) {
        // Linear interpolation from 0 to 7 in first year
        return catYears * 7;
    } else if (catYears <= 2) {
        // Linear interpolation from 7 to 13 in second year
        return 7 + (catYears - 1) * 6;
    } else {
        // After 2 years: add 4 human years per cat year
        return 13 + (catYears - 2) * 4;
    }
}

/**
 * Convert human age to cat age equivalent
 * @param {number} humanYears - Human age in years (0-100)
 * @returns {number} Cat age equivalent
 */
function toCatYears(humanYears) {
    if (humanYears < 0) return 0;
    if (humanYears > 100) humanYears = 100;
    
    if (humanYears <= 7) {
        // Map 0-7 human years to 0-1 cat year
        return humanYears / 7;
    } else if (humanYears <= 13) {
        // Map 7-13 human years to 1-2 cat years
        return 1 + (humanYears - 7) / 6;
    } else {
        // After 13 human years: add 1 cat year per 4 human years
        return 2 + (humanYears - 13) / 4;
    }
}

/**
 * Get life stage based on cat age
 * @param {number} catYears - Cat age in years
 * @returns {string} Life stage label
 */
function getStage(catYears) {
    if (catYears < 1) return 'Kitten';
    if (catYears < 2) return 'Junior';
    if (catYears < 6) return 'Adult';
    if (catYears < 10) return 'Mature';
    return 'Senior';
}

/**
 * Apply lifestyle and health adjustments
 * @param {number} value - Base calculated value
 * @param {Object} options - Adjustment options
 * @returns {Object} Adjusted value and note
 */
function applyAdjustments(value, options) {
    const { lifestyle = 'indoor', health = 'normal', apply = false } = options;
    
    if (!apply) {
        return { value, note: '' };
    }
    
    let adjustment = 0;
    let notes = [];
    
    // Lifestyle adjustments
    if (lifestyle === 'indoor') {
        adjustment += 0.02; // +2%
        notes.push('Indoor lifestyle: +2%');
    } else if (lifestyle === 'outdoor') {
        adjustment -= 0.04; // -4%
        notes.push('Outdoor lifestyle: -4%');
    } else if (lifestyle === 'mixed') {
        adjustment -= 0.01; // -1%
        notes.push('Mixed lifestyle: -1%');
    }
    
    // Health adjustments
    if (health === 'senior') {
        adjustment -= 0.02; // -2%
        notes.push('Senior care: -2%');
    }
    
    const adjustedValue = value * (1 + adjustment);
    const note = notes.length > 0 
        ? `Adjusted for: ${notes.join(', ')}. Individual cats vary significantly.`
        : '';
    
    return { value: adjustedValue, note };
}

// ============================================================================
// CHART DATA
// ============================================================================

const AGE_CHART_DATA = [
    { cat: 1, human: 7, stage: 'Junior' },
    { cat: 2, human: 13, stage: 'Junior' },
    { cat: 3, human: 20, stage: 'Adult' },
    { cat: 4, human: 26, stage: 'Adult' },
    { cat: 5, human: 33, stage: 'Adult' },
    { cat: 6, human: 40, stage: 'Mature' },
    { cat: 7, human: 44, stage: 'Mature' },
    { cat: 8, human: 48, stage: 'Mature' },
    { cat: 9, human: 52, stage: 'Mature' },
    { cat: 10, human: 56, stage: 'Senior' },
    { cat: 11, human: 60, stage: 'Senior' },
    { cat: 12, human: 64, stage: 'Senior' },
    { cat: 13, human: 68, stage: 'Senior' },
    { cat: 14, human: 72, stage: 'Senior' },
    { cat: 15, human: 76, stage: 'Senior' },
    { cat: 16, human: 80, stage: 'Senior' },
    { cat: 17, human: 84, stage: 'Senior' },
    { cat: 18, human: 88, stage: 'Senior' },
    { cat: 19, human: 92, stage: 'Senior' },
    { cat: 20, human: 96, stage: 'Senior' },
    { cat: 21, human: 100, stage: 'Senior' }
];

// ============================================================================
// I18N TRANSLATIONS
// ============================================================================

const translations = {
    en: {
        title: "Cat Age Calculator: Convert Cat Years to Human Years",
        subtitle: "Cats don't age at a simple 7:1 ratio. Kittens mature quickly, and after the first two years, each cat year adds about four human years. Use this calculator to convert cat years to human years (and back), explore the age chart, and learn how to estimate a cat's age safely.",
        tab: {
            calculator: "Calculator",
            chart: "Chart",
            faqs: "FAQs",
            tips: "Tips"
        },
        mode: {
            catToHuman: "Cat → Human",
            humanToCat: "Human → Cat"
        },
        label: {
            catYears: "Cat Age (years)",
            catMonths: "Additional Months (optional)",
            humanYears: "Human Age (years)",
            lifestyle: "Lifestyle",
            health: "Health Status"
        },
        help: {
            catYears: "Enter 0-25 years",
            catMonths: "0-11 months",
            humanYears: "Enter 0-100 years"
        },
        lifestyle: {
            indoor: "Indoor",
            outdoor: "Outdoor",
            mixed: "Mixed"
        },
        health: {
            normal: "Normal",
            senior: "Senior Care"
        },
        modifiers: {
            title: "Advanced Options",
            apply: "Apply adjustments to result"
        },
        result: {
            label: "Result",
            years: "years",
            catYears: "cat years",
            humanYears: "human years"
        },
        chart: {
            current: "Current Age",
            title: "Cat to Human Age Conversion Chart",
            description: "The mapping below shows typical aging for healthy domestic cats. Individual cats vary based on genetics, lifestyle, and healthcare.",
            catAge: "Cat Age",
            humanAge: "Human Age",
            stage: "Life Stage"
        },
        stages: {
            title: "Life Stages",
            kitten: {
                title: "Kitten",
                range: "0-0.9 years",
                desc: "Rapid growth and development phase"
            },
            junior: {
                title: "Junior",
                range: "1-1.9 years",
                desc: "Adolescent, still playful and energetic"
            },
            adult: {
                title: "Adult",
                range: "2-5.9 years",
                desc: "Prime years, fully mature"
            },
            mature: {
                title: "Mature",
                range: "6-9.9 years",
                desc: "Middle-aged, may slow down slightly"
            },
            senior: {
                title: "Senior",
                range: "10+ years",
                desc: "Older cat, needs special care"
            }
        },
        disclaimer: "Results are estimates for typical domestic cats and not veterinary advice. Consult a professional for health decisions.",
        faqs: {
            title: "Frequently Asked Questions",
            q1: {
                question: "How do I convert cat years to human years?",
                answer: "After the first two cat years (approximately 13 human years), each additional cat year adds approximately 4 human years. The first year equals about 7 human years, and the second year adds another 6 human years. Use the calculator for exact values including decimal ages."
            },
            q2: {
                question: "How do I convert human age to cat years?",
                answer: "Map the first 7 human years to approximately 1 cat year, up to 13 human years to approximately 2 cat years, then add 1 cat year per 4 human years thereafter. The calculator handles this conversion automatically with precise formulas."
            },
            q3: {
                question: "Do indoor and outdoor cats age differently?",
                answer: "Lifestyle can influence aging and longevity. Indoor cats typically live longer due to reduced exposure to hazards and diseases. This tool offers conservative optional adjustments based on lifestyle, but individual variation exists."
            },
            q4: {
                question: "Can I estimate a stray cat's age?",
                answer: "Physical indicators like teeth condition, eye clarity, and coat texture offer clues. White teeth suggest approximately 1 year, yellowing indicates 1-2 years, and tartar buildup suggests older age. This tool includes a quick estimation checklist, but results are estimates and not veterinary diagnoses."
            },
            q5: {
                question: "Why isn't it a simple 7:1 ratio?",
                answer: "The old 7:1 rule oversimplifies cat aging. Cats mature rapidly in their first two years, reaching young adulthood by age 2. After that, aging slows to approximately 4 human years per cat year. This reflects their actual biological development more accurately."
            },
            q6: {
                question: "How accurate is this calculator?",
                answer: "The calculator uses formulas based on widely accepted veterinary guidelines and research. However, individual cats vary significantly based on breed, genetics, diet, healthcare, and lifestyle. Use results as general estimates, not medical diagnoses."
            }
        },
        tips: {
            title: "Age Estimation Tips",
            intro: "If you don't know your cat's exact age, these physical indicators can help estimate it. These are non-medical observations and should not replace veterinary assessment.",
            teeth: {
                title: "Teeth",
                white: "White, clean teeth: ≈1 year",
                yellow: "Slight yellowing: 1-2 years",
                tartar: "Tartar buildup: 3-5 years",
                missing: "Missing teeth or heavy wear: 10+ years"
            },
            eyes: {
                title: "Eyes",
                bright: "Bright, clear eyes: Young cat",
                cloudy: "Slight cloudiness: 6-10 years",
                discharge: "Tear staining or discharge: May indicate age or health issues",
                iris: "Iris irregularities: Often seen in seniors (10+ years)"
            },
            coat: {
                title: "Coat",
                soft: "Soft, fine coat: Kitten",
                thick: "Thick, glossy coat: Adult (2-6 years)",
                coarse: "Coarser texture: Mature (7-10 years)",
                gray: "White or gray patches: Senior (10+ years)"
            },
            body: {
                title: "Body Condition",
                lean: "Lean, muscular: Young adult",
                filled: "Well-filled frame: Prime adult",
                bony: "Bony or prominent spine: May indicate senior age",
                mobility: "Reduced mobility or stiffness: Often seen in seniors"
            },
            warning: {
                title: "Important:",
                text: "These are general guidelines only. Many factors affect appearance and health. Always consult a veterinarian for accurate age assessment and health evaluation."
            }
        },
        related: {
            title: "Related Tools",
            dog: "Dog Age Calculator",
            bmi: "BMI Calculator",
            age: "Age Calculator",
            all: "All Tools"
        },
        footer: {
            author: "Created by the FreeClipboard team",
            updated: "Last updated:",
            version: "Version 1.0.0",
            feedback: "Was this helpful? 👍"
        }
    },
    ur: {
        title: "بلی کی عمر کیلکولیٹر: بلی کے سال انسانی سالوں میں تبدیل کریں",
        subtitle: "بلیاں سادہ 7:1 تناسب سے عمر نہیں کرتیں۔ بلی کے بچے تیزی سے بالغ ہوتے ہیں، اور پہلے دو سالوں کے بعد، ہر بلی کا سال تقریباً چار انسانی سال شامل کرتا ہے۔",
        tab: {
            calculator: "کیلکولیٹر",
            chart: "چارٹ",
            faqs: "سوالات",
            tips: "تجاویز"
        },
        mode: {
            catToHuman: "بلی → انسان",
            humanToCat: "انسان → بلی"
        },
        label: {
            catYears: "بلی کی عمر (سال)",
            catMonths: "اضافی مہینے (اختیاری)",
            humanYears: "انسانی عمر (سال)",
            lifestyle: "طرز زندگی",
            health: "صحت کی حالت"
        },
        help: {
            catYears: "0-25 سال درج کریں",
            catMonths: "0-11 مہینے",
            humanYears: "0-100 سال درج کریں"
        },
        lifestyle: {
            indoor: "گھر کے اندر",
            outdoor: "باہر",
            mixed: "مخلوط"
        },
        health: {
            normal: "عام",
            senior: "بزرگ دیکھ بھال"
        },
        modifiers: {
            title: "اعلی درجے کے اختیارات",
            apply: "نتیجہ پر ایڈجسٹمنٹ لاگو کریں"
        },
        result: {
            label: "نتیجہ",
            years: "سال",
            catYears: "بلی کے سال",
            humanYears: "انسانی سال"
        },
        disclaimer: "نتائج عام گھریلو بلیوں کے لیے تخمینے ہیں اور ویٹرنری مشورہ نہیں ہیں۔ صحت کے فیصلوں کے لیے پیشہ ور سے مشورہ کریں۔",
        related: {
            title: "متعلقہ ٹولز",
            dog: "کتے کی عمر کیلکولیٹر",
            bmi: "BMI کیلکولیٹر",
            age: "عمر کیلکولیٹر",
            all: "تمام ٹولز"
        },
        footer: {
            author: "FreeClipboard ٹیم کی طرف سے بنایا گیا",
            updated: "آخری اپ ڈیٹ:",
            version: "ورژن 1.0.0",
            feedback: "کیا یہ مددگار تھا؟ 👍"
        }
    }
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
    mode: 'cat-to-human',
    language: 'en',
    theme: 'light',
    feedbackCount: 0
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const elements = {
    // Mode toggle
    modeCatToHuman: document.getElementById('modeCatToHuman'),
    modeHumanToCat: document.getElementById('modeHumanToCat'),
    
    // Inputs
    catInputs: document.getElementById('catInputs'),
    humanInputs: document.getElementById('humanInputs'),
    catYears: document.getElementById('catYears'),
    catMonths: document.getElementById('catMonths'),
    humanYears: document.getElementById('humanYears'),
    lifestyle: document.getElementById('lifestyle'),
    health: document.getElementById('health'),
    applyAdjustments: document.getElementById('applyAdjustments'),
    
    // Results
    resultValue: document.getElementById('resultValue'),
    resultStage: document.getElementById('resultStage'),
    resultNote: document.getElementById('resultNote'),
    chartMarker: document.getElementById('chartMarker'),
    
    // Tabs
    tabs: document.querySelectorAll('.tab'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    
    // Controls
    themeToggle: document.getElementById('calcThemeToggle'),
    langToggle: document.getElementById('calcLangToggle'),
    feedbackBtn: document.getElementById('feedbackBtn'),
    feedbackCount: document.getElementById('feedbackCount'),
    
    // Chart
    chartTableBody: document.getElementById('chartTableBody')
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function to limit calculation frequency
 */
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

/**
 * Update i18n text content
 */
function updateI18n() {
    const lang = state.language;
    const t = translations[lang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = t;
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        if (value) {
            if (el.tagName === 'INPUT' && el.type !== 'checkbox') {
                el.placeholder = value;
            } else {
                el.textContent = value;
            }
        }
    });
    
    // Update language toggle
    elements.langToggle.querySelector('.lang-text').textContent = 
        lang === 'en' ? 'EN' : 'اردو';
}

/**
 * Save state to localStorage
 */
function saveState() {
    // Don't save theme - let site handle it
    localStorage.setItem('catCalcLang', state.language);
    localStorage.setItem('catCalcFeedback', state.feedbackCount);
}

/**
 * Load state from localStorage
 */
function loadState() {
    // Don't override site theme - let the site handle it
    state.theme = document.documentElement.getAttribute('data-theme') || 'dark';
    state.language = localStorage.getItem('catCalcLang') || 'en';
    state.feedbackCount = parseInt(localStorage.getItem('catCalcFeedback') || '0', 10);
    
    // Don't set data-theme - site already handles this
    elements.feedbackCount.textContent = `${state.feedbackCount} people found this helpful`;
}

// ============================================================================
// CALCULATOR LOGIC
// ============================================================================

/**
 * Calculate and update result
 */
function calculate() {
    const mode = state.mode;
    const lifestyle = elements.lifestyle.value;
    const health = elements.health.value;
    const apply = elements.applyAdjustments.checked;
    
    let result, stage, catAge;
    
    if (mode === 'cat-to-human') {
        // Cat to Human conversion
        const years = parseFloat(elements.catYears.value) || 0;
        const months = parseFloat(elements.catMonths.value) || 0;
        catAge = years + (months / 12);
        
        const baseHumanAge = toHumanAge(catAge);
        const adjusted = applyAdjustments(baseHumanAge, { lifestyle, health, apply });
        
        result = Math.round(adjusted.value);
        stage = getStage(catAge);
        
        elements.resultValue.textContent = `${result} ${translations[state.language].result.humanYears || 'human years'}`;
        elements.resultStage.textContent = stage;
        elements.resultNote.textContent = adjusted.note;
        
        // Update chart marker (0-21 cat years)
        const markerPosition = Math.min((catAge / 21) * 100, 100);
        elements.chartMarker.style.left = `${markerPosition}%`;
        
    } else {
        // Human to Cat conversion
        const humanAge = parseFloat(elements.humanYears.value) || 0;
        
        const baseCatAge = toCatYears(humanAge);
        const adjusted = applyAdjustments(baseCatAge, { lifestyle, health, apply });
        
        catAge = adjusted.value;
        result = catAge.toFixed(1);
        stage = getStage(catAge);
        
        elements.resultValue.textContent = `${result} ${translations[state.language].result.catYears || 'cat years'}`;
        elements.resultStage.textContent = stage;
        elements.resultNote.textContent = adjusted.note;
        
        // Update chart marker
        const markerPosition = Math.min((catAge / 21) * 100, 100);
        elements.chartMarker.style.left = `${markerPosition}%`;
    }
}

const debouncedCalculate = debounce(calculate, 300);

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle mode toggle
 */
function handleModeToggle(mode) {
    state.mode = mode;
    
    // Update button states
    elements.modeCatToHuman.classList.toggle('active', mode === 'cat-to-human');
    elements.modeHumanToCat.classList.toggle('active', mode === 'human-to-cat');
    
    // Toggle input visibility
    elements.catInputs.classList.toggle('hidden', mode === 'human-to-cat');
    elements.humanInputs.classList.toggle('hidden', mode === 'cat-to-human');
    
    calculate();
}

/**
 * Handle tab navigation
 */
function handleTabClick(tabId) {
    const targetPanel = document.getElementById(tabId.replace('tab-', '') + '-panel');
    
    // Update tabs
    elements.tabs.forEach(tab => {
        const isActive = tab.id === tabId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });
    
    // Update panels
    elements.tabPanels.forEach(panel => {
        const isActive = panel.id === targetPanel.id;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
    });
}

/**
 * Handle theme toggle - use site's theme toggle instead
 */
function handleThemeToggle() {
    // Trigger the site's theme toggle if it exists
    const siteThemeToggle = document.querySelector('.nav-theme-toggle, .theme-toggle');
    if (siteThemeToggle) {
        siteThemeToggle.click();
    }
    // Update local state to match
    state.theme = document.documentElement.getAttribute('data-theme') || 'dark';
}

/**
 * Handle language toggle
 */
function handleLanguageToggle() {
    state.language = state.language === 'en' ? 'ur' : 'en';
    updateI18n();
    calculate(); // Recalculate to update result text
    saveState();
}

/**
 * Handle feedback button
 */
function handleFeedback() {
    state.feedbackCount++;
    elements.feedbackCount.textContent = `${state.feedbackCount} people found this helpful`;
    elements.feedbackBtn.textContent = '✓ Thank you!';
    elements.feedbackBtn.disabled = true;
    saveState();
}

/**
 * Generate chart table
 */
function generateChartTable() {
    const tbody = elements.chartTableBody;
    tbody.innerHTML = '';
    
    AGE_CHART_DATA.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.cat} ${row.cat === 1 ? 'year' : 'years'}</td>
            <td>${row.human} years</td>
            <td>${row.stage}</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Handle keyboard navigation for tabs
 */
function handleTabKeyboard(e) {
    const currentTab = document.activeElement;
    if (!currentTab.classList.contains('tab')) return;
    
    const tabsArray = Array.from(elements.tabs);
    const currentIndex = tabsArray.indexOf(currentTab);
    
    let nextIndex;
    
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabsArray.length - 1;
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = currentIndex < tabsArray.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTabClick(currentTab.id);
        return;
    } else {
        return;
    }
    
    tabsArray[nextIndex].focus();
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Load saved state
    loadState();
    
    // Update i18n
    updateI18n();
    
    // Generate chart table
    generateChartTable();
    
    // Mode toggle listeners
    elements.modeCatToHuman.addEventListener('click', () => handleModeToggle('cat-to-human'));
    elements.modeHumanToCat.addEventListener('click', () => handleModeToggle('human-to-cat'));
    
    // Input listeners
    elements.catYears.addEventListener('input', debouncedCalculate);
    elements.catMonths.addEventListener('input', debouncedCalculate);
    elements.humanYears.addEventListener('input', debouncedCalculate);
    elements.lifestyle.addEventListener('change', calculate);
    elements.health.addEventListener('change', calculate);
    elements.applyAdjustments.addEventListener('change', calculate);
    
    // Tab listeners
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => handleTabClick(tab.id));
    });
    
    // Keyboard navigation for tabs
    document.addEventListener('keydown', handleTabKeyboard);
    
    // Theme and language toggles
    elements.themeToggle.addEventListener('click', handleThemeToggle);
    elements.langToggle.addEventListener('click', handleLanguageToggle);
    
    // Feedback button
    elements.feedbackBtn.addEventListener('click', handleFeedback);
    
    // Initial calculation
    calculate();
    
    // Listen for system theme changes
    // Let the site handle theme changes - just update local state
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        state.theme = document.documentElement.getAttribute('data-theme') || 'dark';
    });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toHumanAge,
        toCatYears,
        getStage,
        applyAdjustments
    };
}
