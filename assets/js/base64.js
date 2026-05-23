document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById('inputBox');
    const outputBox = document.getElementById('outputBox');
    const modeEncode = document.getElementById('modeEncode');
    const modeDecode = document.getElementById('modeDecode');
    const inputLabel = document.getElementById('inputLabel');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const fileUploadBtn = document.getElementById('fileUploadBtn');
    const fileInput = document.getElementById('fileInput');
    const batchTextarea = document.getElementById('batchTextarea');
    const batchEncodeBtn = document.getElementById('batchEncodeBtn');
    const batchDecodeBtn = document.getElementById('batchDecodeBtn');
    const batchOutputBox = document.getElementById('batchOutputBox');
    const batchCopyBtn = document.getElementById('batchCopyBtn');
    const batchDownloadBtn = document.getElementById('batchDownloadBtn');
    const formatSelect = document.getElementById('formatSelect');
    const urlSafeCheckbox = document.getElementById('urlSafeCheckbox');

    let isEncoding = true;
    
    // Initialize history manager
    const history = new HistoryManager('base64-history', 10);

    // Toggle Modes
    function setMode(encoding) {
        isEncoding = encoding;
        inputBox.value = '';
        outputBox.value = '';
        
        if (isEncoding) {
            modeEncode.classList.add('active');
            modeEncode.setAttribute('aria-selected', 'true');
            modeDecode.classList.remove('active');
            modeDecode.setAttribute('aria-selected', 'false');
            inputLabel.innerText = "Text to Encode:";
            inputBox.placeholder = "Type text here to convert to Base64...";
            fileUploadBtn.style.display = 'inline-block';
        } else {
            modeDecode.classList.add('active');
            modeDecode.setAttribute('aria-selected', 'true');
            modeEncode.classList.remove('active');
            modeEncode.setAttribute('aria-selected', 'false');
            inputLabel.innerText = "Base64 to Decode:";
            inputBox.placeholder = "Paste Base64 string here...";
            fileUploadBtn.style.display = 'none';
        }
    }

    modeEncode.addEventListener('click', () => setMode(true));
    modeDecode.addEventListener('click', () => setMode(false));

    // Format Detection
    function detectFormat(input) {
        if (!input) return 'text';
        
        // Check if it's a data URI
        if (input.startsWith('data:')) {
            const match = input.match(/^data:([^;]+);base64,/);
            if (match) {
                return match[1]; // Returns MIME type like 'image/png'
            }
        }
        
        // Check if it looks like Base64
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (base64Regex.test(input.trim())) {
            return 'base64';
        }
        
        return 'text';
    }

    // Conversion Logic
    function process() {
        const input = inputBox.value;
        if (!input) {
            outputBox.value = '';
            return;
        }

        try {
            if (isEncoding) {
                // Encode handles UTF-8 characters correctly
                let encoded = btoa(unescape(encodeURIComponent(input)));
                
                // Apply URL-safe encoding if checkbox is checked
                if (urlSafeCheckbox && urlSafeCheckbox.checked) {
                    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
                }
                
                outputBox.value = encoded;
                
                // Add to history
                history.add({
                    input: input.substring(0, 100),
                    output: encoded.substring(0, 100),
                    mode: 'encode',
                    timestamp: new Date().toISOString()
                });
            } else {
                // Decode - handle URL-safe Base64
                let toDecode = input.trim();
                
                // Convert URL-safe Base64 back to standard
                toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
                
                // Add padding if needed
                while (toDecode.length % 4) {
                    toDecode += '=';
                }
                
                outputBox.value = decodeURIComponent(escape(window.atob(toDecode)));
                
                // Add to history
                history.add({
                    input: input.substring(0, 100),
                    output: outputBox.value.substring(0, 100),
                    mode: 'decode',
                    timestamp: new Date().toISOString()
                });
            }
            outputBox.classList.remove('error');
            
            // Update format indicator
            if (formatSelect) {
                const format = detectFormat(input);
                formatSelect.value = format;
            }
        } catch (e) {
            if (!isEncoding) {
                outputBox.value = "Error: Invalid Base64 string";
                outputBox.classList.add('error');
                showNotification('Invalid Base64 string', 'error');
            }
        }
    }

    // File Upload Support
    if (fileUploadBtn && fileInput) {
        fileUploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    const base64 = event.target.result.split(',')[1]; // Remove data URI prefix
                    inputBox.value = base64;
                    
                    // If in decode mode, process immediately
                    if (!isEncoding) {
                        process();
                    } else {
                        // Show file info
                        showNotification(`Loaded ${file.name} (${formatFileSize(file.size)})`, 'success');
                    }
                };
                
                reader.readAsDataURL(file);
            } catch (err) {
                showNotification('Failed to read file', 'error');
            }
        });
    }

    // Batch Processing
    if (batchEncodeBtn) {
        batchEncodeBtn.addEventListener('click', () => {
            const lines = batchTextarea.value.split('\n').filter(line => line.trim());
            if (lines.length === 0) {
                showNotification('Please enter text to encode (one per line)', 'warning');
                return;
            }

            const results = lines.map(line => {
                try {
                    let encoded = btoa(unescape(encodeURIComponent(line)));
                    if (urlSafeCheckbox && urlSafeCheckbox.checked) {
                        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
                    }
                    return encoded;
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            });

            batchOutputBox.value = results.join('\n');
            showNotification(`Encoded ${lines.length} items`, 'success');
        });
    }

    if (batchDecodeBtn) {
        batchDecodeBtn.addEventListener('click', () => {
            const lines = batchTextarea.value.split('\n').filter(line => line.trim());
            if (lines.length === 0) {
                showNotification('Please enter Base64 strings to decode (one per line)', 'warning');
                return;
            }

            const results = lines.map(line => {
                try {
                    let toDecode = line.trim();
                    // Convert URL-safe Base64 back to standard
                    toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
                    // Add padding if needed
                    while (toDecode.length % 4) {
                        toDecode += '=';
                    }
                    return decodeURIComponent(escape(window.atob(toDecode)));
                } catch (e) {
                    return `Error: Invalid Base64`;
                }
            });

            batchOutputBox.value = results.join('\n');
            showNotification(`Decoded ${lines.length} items`, 'success');
        });
    }

    // Batch Copy
    if (batchCopyBtn) {
        batchCopyBtn.addEventListener('click', () => {
            if (!batchOutputBox.value) {
                showNotification('Nothing to copy', 'warning');
                return;
            }
            copyToClipboard(batchOutputBox.value, batchCopyBtn);
        });
    }

    // Batch Download
    if (batchDownloadBtn) {
        batchDownloadBtn.addEventListener('click', () => {
            if (!batchOutputBox.value) {
                showNotification('Nothing to download', 'warning');
                return;
            }
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            downloadFile(batchOutputBox.value, `base64-batch-${timestamp}.txt`, 'text/plain');
        });
    }

    // Event Listeners
    inputBox.addEventListener('input', process);

    clearBtn.addEventListener('click', () => {
        inputBox.value = '';
        outputBox.value = '';
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
        if (!outputBox.value) {
            showNotification('Nothing to copy', 'warning');
            return;
        }
        copyToClipboard(outputBox.value, copyBtn);
    });

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!outputBox.value) {
                showNotification('Nothing to download', 'warning');
                return;
            }
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = isEncoding ? `encoded-${timestamp}.txt` : `decoded-${timestamp}.txt`;
            downloadFile(outputBox.value, filename, 'text/plain');
        });
    }

    // Keyboard shortcuts
    keyboardShortcuts.register('ctrl+enter', () => {
        process();
        return true;
    });

    keyboardShortcuts.register('ctrl+k', () => {
        clearBtn.click();
        return true;
    });
});