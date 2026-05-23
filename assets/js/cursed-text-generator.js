/**
 * Cursed Text Generator (Zalgo Text)
 * Professional cursed text generator with multiple modes and customization
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cursedInput = document.getElementById('cursedInput');
    const cursedOutput = document.getElementById('cursedOutput');
    const curseIntensity = document.getElementById('curseIntensity');
    const intensityValue = document.getElementById('intensityValue');
    const inputStats = document.getElementById('inputStats');
    const outputStats = document.getElementById('outputStats');
    const curseStatus = document.getElementById('curseStatus');
    
    // Buttons
    const pasteBtn = document.getElementById('pasteBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    
    // Mode buttons
    const modeButtons = document.querySelectorAll('.curse-mode-btn');
    const advancedOptions = document.getElementById('advancedOptions');
    
    // Advanced options
    const optionUp = document.getElementById('optionUp');
    const optionMiddle = document.getElementById('optionMiddle');
    const optionDown = document.getElementById('optionDown');
    const optionPreserveSpaces = document.getElementById('optionPreserveSpaces');
    const optionRandomize = document.getElementById('optionRandomize');
    const optionExtraSymbols = document.getElementById('optionExtraSymbols');
    
    // Examples and presets
    const exampleButtons = document.querySelectorAll('.example-btn');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // History
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const historyManager = new HistoryManager('cursed-text-history', 10);

    // State
    let currentMode = 'zalgo';
    let currentIntensity = 5;

    // Unicode combining characters
    const MARKS_ABOVE = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
        '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F',
        '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u031A', '\u031B', '\u033D',
        '\u033E', '\u033F', '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0346',
        '\u034A', '\u034B', '\u034C', '\u0350', '\u0351', '\u0352', '\u0357', '\u035B'
    ];

    const MARKS_MIDDLE = [
        '\u0334', '\u0335', '\u0336', '\u0337', '\u0338', '\u0339', '\u033A', '\u033B',
        '\u033C', '\u0347', '\u0348', '\u0349', '\u034D', '\u034E', '\u0353', '\u0354',
        '\u0355', '\u0356', '\u0359', '\u035A', '\u0360', '\u0361', '\u0362'
    ];

    const MARKS_BELOW = [
        '\u0316', '\u0317', '\u0318', '\u0319', '\u031C', '\u031D', '\u031E', '\u031F',
        '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327',
        '\u0328', '\u0329', '\u032A', '\u032B', '\u032C', '\u032D', '\u032E', '\u032F',
        '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033A', '\u033B', '\u033C',
        '\u0345', '\u0347', '\u0348', '\u0349', '\u034D', '\u034E', '\u0353', '\u0354',
        '\u0355', '\u0356', '\u0359', '\u035A', '\u0323'
    ];

    const EXTRA_SYMBOLS = ['̸', '̷', '̶', '̵', '̴', '̳', '̲', '̱', '̰', '̯', '̮', '̭', '̬', '̫', '̪', '̩', '̨', '̧', '̦', '̥', '̤', '̣'];

    // ============================================================================
    // CURSE GENERATION
    // ============================================================================

    function getRandomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function getModeSettings(mode) {
        switch(mode) {
            case 'zalgo':
                return { up: true, middle: true, down: true, balanced: true };
            case 'creepy':
                return { up: true, middle: false, down: true, balanced: false };
            case 'demonic':
                return { up: false, middle: false, down: true, balanced: false };
            case 'glitch':
                return { up: true, middle: true, down: true, balanced: false, random: true };
            case 'custom':
                return {
                    up: optionUp.checked,
                    middle: optionMiddle.checked,
                    down: optionDown.checked,
                    balanced: false,
                    random: optionRandomize.checked,
                    extraSymbols: optionExtraSymbols.checked
                };
            default:
                return { up: true, middle: true, down: true, balanced: true };
        }
    }

    function calculateMarkCount(intensity, mode) {
        const base = intensity;
        const settings = getModeSettings(mode);
        
        if (settings.random) {
            return Math.floor(Math.random() * (base + 1)) + 1;
        }
        
        return base;
    }

    function curseCharacter(char, intensity, mode) {
        const settings = getModeSettings(mode);
        const preserveSpaces = currentMode === 'custom' ? optionPreserveSpaces.checked : true;
        
        // Preserve spaces and newlines if enabled
        if (preserveSpaces && (char === ' ' || char === '\n' || char === '\t' || char === '\r')) {
            return char;
        }
        
        // Skip if already a combining character
        const charCode = char.charCodeAt(0);
        if (charCode >= 0x0300 && charCode <= 0x036F) {
            return char;
        }
        
        let cursed = char;
        const markCount = calculateMarkCount(intensity, mode);
        
        // Add marks above
        if (settings.up) {
            const count = settings.balanced ? Math.floor(markCount / 3) : markCount;
            for (let i = 0; i < count; i++) {
                cursed += getRandomFrom(MARKS_ABOVE);
            }
        }
        
        // Add marks through middle
        if (settings.middle) {
            const count = settings.balanced ? Math.floor(markCount / 4) : Math.floor(markCount / 2);
            for (let i = 0; i < count; i++) {
                cursed += getRandomFrom(MARKS_MIDDLE);
            }
        }
        
        // Add marks below
        if (settings.down) {
            const count = settings.balanced ? Math.floor(markCount / 3) : markCount;
            for (let i = 0; i < count; i++) {
                cursed += getRandomFrom(MARKS_BELOW);
            }
        }
        
        // Add extra symbols if enabled
        if (settings.extraSymbols && Math.random() > 0.7) {
            cursed += getRandomFrom(EXTRA_SYMBOLS);
        }
        
        return cursed;
    }

    function generateCursedText(text, intensity, mode) {
        if (!text) return '';
        
        let result = '';
        for (const char of text) {
            result += curseCharacter(char, intensity, mode);
        }
        
        return result;
    }

    // ============================================================================
    // UI UPDATES
    // ============================================================================

    function updateIntensityLabel(value) {
        const labels = {
            1: 'Very Mild', 2: 'Mild', 3: 'Light', 4: 'Light-Medium',
            5: 'Medium', 6: 'Medium-Heavy', 7: 'Heavy', 8: 'Very Heavy',
            9: 'Extreme', 10: 'Maximum'
        };
        intensityValue.textContent = labels[value] || 'Medium';
    }

    function updateStats() {
        const inputLength = cursedInput.value.length;
        const outputLength = cursedOutput.value.length;
        
        inputStats.textContent = `${inputLength} character${inputLength !== 1 ? 's' : ''}`;
        outputStats.textContent = `${outputLength} character${outputLength !== 1 ? 's' : ''}`;
    }

    function updateCurseStatus(message, type = 'info') {
        curseStatus.textContent = message;
        curseStatus.className = `curse-status curse-status-${type}`;
        
        setTimeout(() => {
            curseStatus.textContent = '';
            curseStatus.className = 'curse-status';
        }, 3000);
    }

    function processText() {
        const input = cursedInput.value;
        const intensity = parseInt(curseIntensity.value);
        const cursed = generateCursedText(input, intensity, currentMode);
        
        cursedOutput.value = cursed;
        updateStats();
        
        // Add to history if not empty and not too long
        if (input && input.length < 100) {
            addToHistory(input, cursed, currentMode, intensity);
        }
    }

    // ============================================================================
    // MODE MANAGEMENT
    // ============================================================================

    function setMode(mode) {
        currentMode = mode;
        
        // Update button states
        modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show/hide advanced options
        if (mode === 'custom') {
            advancedOptions.style.display = 'block';
        } else {
            advancedOptions.style.display = 'none';
        }
        
        processText();
    }

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setMode(btn.dataset.mode);
        });
    });

    // ============================================================================
    // INTENSITY CONTROL
    // ============================================================================

    curseIntensity.addEventListener('input', (e) => {
        currentIntensity = parseInt(e.target.value);
        updateIntensityLabel(currentIntensity);
        processText();
    });

    // ============================================================================
    // ADVANCED OPTIONS
    // ============================================================================

    [optionUp, optionMiddle, optionDown, optionPreserveSpaces, optionRandomize, optionExtraSymbols].forEach(option => {
        if (option) {
            option.addEventListener('change', () => {
                if (currentMode === 'custom') {
                    processText();
                }
            });
        }
    });

    // ============================================================================
    // BUTTON ACTIONS
    // ============================================================================

    cursedInput.addEventListener('input', debounce(processText, 150));

    clearBtn.addEventListener('click', () => {
        cursedInput.value = '';
        cursedOutput.value = '';
        updateStats();
        cursedInput.focus();
    });

    pasteBtn.addEventListener('click', async () => {
        const text = await pasteFromClipboard();
        if (text) {
            cursedInput.value = text;
            processText();
        }
    });

    copyBtn.addEventListener('click', () => {
        const text = cursedOutput.value;
        if (!text) {
            showNotification('Nothing to copy', 'warning');
            return;
        }
        copyToClipboard(text, copyBtn);
        updateCurseStatus('Cursed text copied!', 'success');
    });

    downloadBtn.addEventListener('click', () => {
        const text = cursedOutput.value;
        if (!text) {
            showNotification('Nothing to download', 'warning');
            return;
        }
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `cursed-text-${timestamp}.txt`;
        downloadFile(text, filename, 'text/plain');
    });

    regenerateBtn.addEventListener('click', () => {
        processText();
        updateCurseStatus('Regenerated!', 'success');
    });

    // ============================================================================
    // EXAMPLES
    // ============================================================================

    exampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            cursedInput.value = text;
            processText();
            cursedInput.focus();
        });
    });

    // ============================================================================
    // PRESETS
    // ============================================================================

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            
            switch(preset) {
                case 'light':
                    curseIntensity.value = 2;
                    setMode('zalgo');
                    break;
                case 'medium':
                    curseIntensity.value = 5;
                    setMode('zalgo');
                    break;
                case 'heavy':
                    curseIntensity.value = 7;
                    setMode('creepy');
                    break;
                case 'extreme':
                    curseIntensity.value = 10;
                    setMode('demonic');
                    break;
                case 'minimal':
                    curseIntensity.value = 1;
                    setMode('zalgo');
                    break;
                case 'wild':
                    curseIntensity.value = 8;
                    setMode('glitch');
                    break;
            }
            
            currentIntensity = parseInt(curseIntensity.value);
            updateIntensityLabel(currentIntensity);
            processText();
            updateCurseStatus(`Applied ${preset} preset`, 'success');
        });
    });

    // ============================================================================
    // HISTORY MANAGEMENT
    // ============================================================================

    function addToHistory(input, output, mode, intensity) {
        const item = {
            input: input.substring(0, 50),
            output: output.substring(0, 50),
            mode: mode,
            intensity: intensity,
            timestamp: new Date().toISOString()
        };
        
        historyManager.add(item);
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        const history = historyManager.getAll();
        
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }

        historySection.style.display = 'block';
        historyList.innerHTML = history.map((item, index) => `
            <div class="history-item">
                <div class="history-meta">
                    <span class="history-mode">${getModeIcon(item.mode)} ${item.mode}</span>
                    <span class="history-intensity">Level ${item.intensity}</span>
                    <span class="history-time">${formatDate(item.timestamp, 'time')}</span>
                </div>
                <div class="history-content">
                    <div class="history-input">${sanitizeHTML(item.input)}</div>
                    <div class="history-arrow">→</div>
                    <div class="history-output">${sanitizeHTML(item.output)}</div>
                </div>
                <button class="history-use-btn" data-index="${index}">Use</button>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.history-use-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const item = historyManager.get(index);
                if (item) {
                    cursedInput.value = item.input;
                    setMode(item.mode);
                    curseIntensity.value = item.intensity;
                    currentIntensity = item.intensity;
                    updateIntensityLabel(currentIntensity);
                    processText();
                    cursedInput.focus();
                }
            });
        });
    }

    function getModeIcon(mode) {
        const icons = {
            zalgo: '👹',
            creepy: '😱',
            demonic: '😈',
            glitch: '⚡',
            custom: '⚙️'
        };
        return icons[mode] || '👹';
    }

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Clear all history?')) {
            historyManager.clear();
            updateHistoryDisplay();
            showNotification('History cleared', 'success');
        }
    });

    // ============================================================================
    // KEYBOARD SHORTCUTS
    // ============================================================================

    keyboardShortcuts.register('ctrl+enter', () => {
        processText();
        return true;
    });

    keyboardShortcuts.register('ctrl+k', () => {
        clearBtn.click();
        return true;
    });

    keyboardShortcuts.register('ctrl+d', () => {
        downloadBtn.click();
        return true;
    });

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    updateIntensityLabel(currentIntensity);
    updateHistoryDisplay();
    
    // Load saved preferences
    const savedMode = loadPreference('cursed-text-mode', 'zalgo');
    const savedIntensity = loadPreference('cursed-text-intensity', 5);
    
    setMode(savedMode);
    curseIntensity.value = savedIntensity;
    currentIntensity = savedIntensity;
    updateIntensityLabel(currentIntensity);

    // Save preferences on change
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            savePreference('cursed-text-mode', btn.dataset.mode);
        });
    });

    curseIntensity.addEventListener('change', () => {
        savePreference('cursed-text-intensity', curseIntensity.value);
    });
});
