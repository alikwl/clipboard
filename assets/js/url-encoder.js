/**
 * URL Encoder/Decoder Tool
 * Professional URL encoding with component encoding, batch processing, and validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputBox = document.getElementById('inputBox');
    const outputBox = document.getElementById('outputBox');
    const modeEncode = document.getElementById('modeEncode');
    const modeDecode = document.getElementById('modeDecode');
    const inputLabel = document.getElementById('inputLabel');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const batchModeCheckbox = document.getElementById('batchMode');
    const encodingOptions = document.getElementById('encodingOptions');
    const inputStats = document.getElementById('inputStats');
    const outputStats = document.getElementById('outputStats');
    const validationStatus = document.getElementById('validationStatus');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const exampleButtons = document.querySelectorAll('.example-btn');

    // State
    let isEncoding = true;
    let isBatchMode = false;
    let encodingType = 'full'; // full, component, path, query
    
    // History Manager
    const historyManager = new HistoryManager('url-encoder-history', 10);

    // Examples
    const examples = {
        url: 'https://example.com/search?q=hello world&lang=en',
        query: 'name=John Doe&email=john@example.com&city=New York',
        path: '/api/users/John Doe/profile',
        special: 'Hello! How are you? #awesome @user $100 50%'
    };

    // ============================================================================
    // MODE MANAGEMENT
    // ============================================================================

    function setMode(encoding) {
        isEncoding = encoding;
        
        if (isEncoding) {
            modeEncode.classList.add('active');
            modeDecode.classList.remove('active');
            inputLabel.textContent = "Text to Encode:";
            inputBox.placeholder = "Enter text to encode (e.g., 'Hello World?')";
            encodingOptions.style.display = 'block';
        } else {
            modeDecode.classList.add('active');
            modeEncode.classList.remove('active');
            inputLabel.textContent = "URL to Decode:";
            inputBox.placeholder = "Enter encoded URL to decode (e.g., 'Hello%20World%3F')";
            encodingOptions.style.display = 'none';
        }
        
        process();
    }

    modeEncode.addEventListener('click', () => setMode(true));
    modeDecode.addEventListener('click', () => setMode(false));

    // ============================================================================
    // ENCODING TYPE SELECTION
    // ============================================================================

    const encodingTypeRadios = document.querySelectorAll('input[name="encodingType"]');
    encodingTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            encodingType = e.target.value;
            process();
        });
    });

    // ============================================================================
    // BATCH MODE
    // ============================================================================

    batchModeCheckbox.addEventListener('change', (e) => {
        isBatchMode = e.target.checked;
        if (isBatchMode) {
            inputBox.placeholder = isEncoding 
                ? "Enter one URL or text per line for batch encoding"
                : "Enter one encoded URL per line for batch decoding";
        } else {
            inputBox.placeholder = isEncoding
                ? "Enter text to encode (e.g., 'Hello World?')"
                : "Enter encoded URL to decode (e.g., 'Hello%20World%3F')";
        }
        process();
    });

    // ============================================================================
    // ENCODING FUNCTIONS
    // ============================================================================

    function encodeURL(text, type) {
        switch(type) {
            case 'full':
                // Encode full URL - preserve protocol and domain structure
                try {
                    const url = new URL(text);
                    return text; // Already a valid URL, return as-is
                } catch {
                    // Not a valid URL, encode as component
                    return encodeURIComponent(text);
                }
            
            case 'component':
                // Standard component encoding (most common)
                return encodeURIComponent(text);
            
            case 'path':
                // Path segment encoding - allows forward slashes
                return text.split('/').map(segment => encodeURIComponent(segment)).join('/');
            
            case 'query':
                // Query string encoding - handle key=value pairs
                if (text.includes('=')) {
                    return text.split('&').map(pair => {
                        const [key, value] = pair.split('=');
                        return `${encodeURIComponent(key)}=${encodeURIComponent(value || '')}`;
                    }).join('&');
                }
                return encodeURIComponent(text);
            
            default:
                return encodeURIComponent(text);
        }
    }

    function decodeURL(text) {
        try {
            // Replace + with space (common in query strings)
            const withSpaces = text.replace(/\+/g, ' ');
            return decodeURIComponent(withSpaces);
        } catch (e) {
            throw new Error('Invalid URL encoding format');
        }
    }

    // ============================================================================
    // VALIDATION
    // ============================================================================

    function validateInput(text, encoding) {
        if (!text) {
            return { valid: true, message: '' };
        }

        if (!encoding) {
            // Decoding validation
            const invalidPattern = /%[^0-9A-Fa-f]/;
            const incompletePattern = /%[0-9A-Fa-f]?$/;
            
            if (invalidPattern.test(text)) {
                return { valid: false, message: '⚠️ Invalid encoding: % must be followed by two hex digits' };
            }
            if (incompletePattern.test(text)) {
                return { valid: false, message: '⚠️ Incomplete encoding sequence' };
            }
        }

        return { valid: true, message: '✓ Valid input' };
    }

    // ============================================================================
    // PROCESSING
    // ============================================================================

    function process() {
        const input = inputBox.value;
        
        // Update input stats
        const lines = input.split('\n').length;
        inputStats.textContent = isBatchMode 
            ? `${input.length} characters, ${lines} lines`
            : `${input.length} characters`;

        if (!input) {
            outputBox.value = '';
            outputStats.textContent = '0 characters';
            validationStatus.textContent = '';
            validationStatus.className = '';
            return;
        }

        // Validate input
        const validation = validateInput(input, isEncoding);
        validationStatus.textContent = validation.message;
        validationStatus.className = validation.valid ? 'validation-success' : 'validation-error';

        try {
            let result;
            
            if (isBatchMode) {
                // Process each line separately
                const lines = input.split('\n');
                const results = lines.map(line => {
                    if (!line.trim()) return '';
                    try {
                        return isEncoding ? encodeURL(line, encodingType) : decodeURL(line);
                    } catch (e) {
                        return `[Error: ${e.message}]`;
                    }
                });
                result = results.join('\n');
            } else {
                // Process single input
                result = isEncoding ? encodeURL(input, encodingType) : decodeURL(input);
            }

            outputBox.value = result;
            outputBox.classList.remove('error');
            
            // Update output stats
            const outputLines = result.split('\n').length;
            outputStats.textContent = isBatchMode
                ? `${result.length} characters, ${outputLines} lines`
                : `${result.length} characters`;

            // Add to history (only for non-batch single operations)
            if (!isBatchMode && input.length < 200) {
                addToHistory(input, result);
            }

        } catch (e) {
            outputBox.value = `Error: ${e.message}`;
            outputBox.classList.add('error');
            outputStats.textContent = 'Error';
        }
    }

    // Debounced processing for better performance
    const debouncedProcess = debounce(process, 150);
    inputBox.addEventListener('input', debouncedProcess);

    // ============================================================================
    // HISTORY MANAGEMENT
    // ============================================================================

    function addToHistory(input, output) {
        const item = {
            input: input.substring(0, 100),
            output: output.substring(0, 100),
            mode: isEncoding ? 'encode' : 'decode',
            type: encodingType,
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
                    <span class="history-mode">${item.mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}</span>
                    <span class="history-type">${item.type}</span>
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

        // Add click handlers for "Use" buttons
        document.querySelectorAll('.history-use-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const item = historyManager.get(index);
                if (item) {
                    inputBox.value = item.input;
                    setMode(item.mode === 'encode');
                    encodingType = item.type;
                    document.querySelector(`input[value="${item.type}"]`).checked = true;
                    process();
                    inputBox.focus();
                }
            });
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Clear all history?')) {
            historyManager.clear();
            updateHistoryDisplay();
            showNotification('History cleared', 'success');
        }
    });

    // ============================================================================
    // BUTTON ACTIONS
    // ============================================================================

    clearBtn.addEventListener('click', () => {
        inputBox.value = '';
        outputBox.value = '';
        inputStats.textContent = '0 characters';
        outputStats.textContent = '0 characters';
        validationStatus.textContent = '';
        inputBox.focus();
    });

    pasteBtn.addEventListener('click', async () => {
        const text = await pasteFromClipboard();
        if (text) {
            inputBox.value = text;
            process();
        }
    });

    copyBtn.addEventListener('click', () => {
        const text = outputBox.value;
        if (!text) {
            showNotification('Nothing to copy', 'warning');
            return;
        }
        copyToClipboard(text, copyBtn);
    });

    downloadBtn.addEventListener('click', () => {
        const text = outputBox.value;
        if (!text) {
            showNotification('Nothing to download', 'warning');
            return;
        }
        
        const mode = isEncoding ? 'encoded' : 'decoded';
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `url-${mode}-${timestamp}.txt`;
        
        downloadFile(text, filename, 'text/plain');
    });

    // ============================================================================
    // EXAMPLES
    // ============================================================================

    exampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const exampleType = btn.dataset.example;
            const exampleText = examples[exampleType];
            
            if (exampleText) {
                inputBox.value = exampleText;
                setMode(true); // Switch to encode mode
                
                // Set appropriate encoding type
                if (exampleType === 'url') {
                    encodingType = 'full';
                    document.querySelector('input[value="full"]').checked = true;
                } else if (exampleType === 'query') {
                    encodingType = 'query';
                    document.querySelector('input[value="query"]').checked = true;
                } else if (exampleType === 'path') {
                    encodingType = 'path';
                    document.querySelector('input[value="path"]').checked = true;
                } else {
                    encodingType = 'component';
                    document.querySelector('input[value="component"]').checked = true;
                }
                
                process();
                inputBox.focus();
            }
        });
    });

    // ============================================================================
    // KEYBOARD SHORTCUTS
    // ============================================================================

    keyboardShortcuts.register('ctrl+enter', () => {
        process();
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

    updateHistoryDisplay();
    
    // Load saved preferences
    const savedMode = loadPreference('url-encoder-mode', 'encode');
    const savedEncodingType = loadPreference('url-encoder-type', 'full');
    
    setMode(savedMode === 'encode');
    encodingType = savedEncodingType;
    document.querySelector(`input[value="${savedEncodingType}"]`).checked = true;

    // Save preferences on change
    modeEncode.addEventListener('click', () => savePreference('url-encoder-mode', 'encode'));
    modeDecode.addEventListener('click', () => savePreference('url-encoder-mode', 'decode'));
    encodingTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            savePreference('url-encoder-type', e.target.value);
        });
    });
});