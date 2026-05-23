document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const treeView = document.getElementById('treeView');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const treeBtn = document.getElementById('treeBtn');
    const statusMsg = document.getElementById('statusMsg');
    const errorDetails = document.getElementById('errorDetails');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    
    // Options
    const indentSize = document.getElementById('indentSize');
    const sortKeys = document.getElementById('sortKeys');
    const escapeUnicode = document.getElementById('escapeUnicode');
    
    // State
    let currentMode = 'format'; // 'format', 'minify', or 'tree'
    let parsedData = null;
    let isValid = false;
    
    // Sample JSON for demo
    const sampleJSON = {
        "name": "JSON Formatter",
        "version": "2.0",
        "features": ["Beautify", "Minify", "Tree View", "Validation"],
        "settings": {
            "theme": "light",
            "autoFormat": true,
            "indentation": 2
        },
        "users": [
            {"id": 1, "name": "Alice", "active": true},
            {"id": 2, "name": "Bob", "active": false}
        ],
        "metadata": {
            "created": "2025-01-30",
            "updated": "2025-01-30"
        }
    };
    
    // ============================================================================
    // CORE PROCESSING FUNCTIONS
    // ============================================================================
    
    /**
     * Process JSON input and display result based on current mode
     */
    function processJSON() {
        const raw = jsonInput.value.trim();
        
        // Clear previous state
        clearErrors();
        
        if (!raw) {
            clearOutput();
            return;
        }
        
        try {
            // Parse JSON
            parsedData = JSON.parse(raw);
            isValid = true;
            
            // Show success status
            showStatus('✓ Valid JSON', 'success');
            
            // Display based on current mode
            displayOutput();
            
        } catch (e) {
            // Handle parsing errors
            isValid = false;
            parsedData = null;
            handleJSONError(e, raw);
        }
    }
    
    /**
     * Display output based on current mode
     */
    function displayOutput() {
        if (!isValid || !parsedData) return;
        
        switch (currentMode) {
            case 'format':
                displayFormatted();
                break;
            case 'minify':
                displayMinified();
                break;
            case 'tree':
                displayTree();
                break;
        }
    }
    
    /**
     * Display formatted (beautified) JSON
     */
    function displayFormatted() {
        jsonOutput.style.display = 'block';
        treeView.style.display = 'none';
        
        const indent = getIndentString();
        const replacer = sortKeys.checked ? getSortedReplacer() : null;
        
        let formatted = JSON.stringify(parsedData, replacer, indent);
        
        if (escapeUnicode.checked) {
            formatted = escapeUnicodeChars(formatted);
        }
        
        jsonOutput.value = formatted;
        updateStatus('Beautified');
    }
    
    /**
     * Display minified JSON
     */
    function displayMinified() {
        jsonOutput.style.display = 'block';
        treeView.style.display = 'none';
        
        const replacer = sortKeys.checked ? getSortedReplacer() : null;
        let minified = JSON.stringify(parsedData, replacer);
        
        if (escapeUnicode.checked) {
            minified = escapeUnicodeChars(minified);
        }
        
        jsonOutput.value = minified;
        
        // Show size comparison
        const originalSize = jsonInput.value.length;
        const minifiedSize = minified.length;
        const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
        
        updateStatus(`Minified (${savings}% smaller)`);
    }
    
    /**
     * Display tree view
     */
    function displayTree() {
        jsonOutput.style.display = 'none';
        treeView.style.display = 'block';
        
        treeView.innerHTML = '';
        const tree = createTreeView(parsedData, 'root');
        treeView.appendChild(tree);
        
        updateStatus('Tree View');
    }
    
    /**
     * Create tree view HTML structure
     */
    function createTreeView(data, key, level = 0) {
        const container = document.createElement('div');
        container.className = 'tree-node';
        container.style.marginLeft = (level * 20) + 'px';
        
        const type = Array.isArray(data) ? 'array' : typeof data;
        
        if (data === null) {
            container.innerHTML = `<span class="tree-key">${escapeHTML(key)}:</span> <span class="tree-null">null</span>`;
        } else if (type === 'object' || type === 'array') {
            const isArray = Array.isArray(data);
            const icon = isArray ? '📋' : '📦';
            const count = isArray ? data.length : Object.keys(data).length;
            const label = isArray ? `Array[${count}]` : `Object{${count}}`;
            
            const toggle = document.createElement('details');
            toggle.open = level < 2; // Auto-expand first 2 levels
            
            const summary = document.createElement('summary');
            summary.innerHTML = `${icon} <span class="tree-key">${escapeHTML(key)}:</span> <span class="tree-type">${label}</span>`;
            toggle.appendChild(summary);
            
            const children = document.createElement('div');
            children.className = 'tree-children';
            
            const entries = isArray ? data.map((v, i) => [i, v]) : Object.entries(data);
            
            entries.forEach(([k, v]) => {
                children.appendChild(createTreeView(v, k, level + 1));
            });
            
            toggle.appendChild(children);
            container.appendChild(toggle);
        } else if (type === 'string') {
            container.innerHTML = `<span class="tree-key">${escapeHTML(key)}:</span> <span class="tree-string">"${escapeHTML(data)}"</span>`;
        } else if (type === 'number') {
            container.innerHTML = `<span class="tree-key">${escapeHTML(key)}:</span> <span class="tree-number">${data}</span>`;
        } else if (type === 'boolean') {
            container.innerHTML = `<span class="tree-key">${escapeHTML(key)}:</span> <span class="tree-boolean">${data}</span>`;
        }
        
        return container;
    }
    
    /**
     * Handle JSON parsing errors with detailed messages
     */
    function handleJSONError(error, raw) {
        clearOutput();
        
        // Show error status
        showStatus('✗ Invalid JSON', 'error');
        
        // Parse error details
        const errorMsg = error.message;
        let lineNumber = null;
        let columnNumber = null;
        let errorType = 'Syntax Error';
        
        // Try to extract line/column from error message
        const posMatch = errorMsg.match(/position (\d+)/i);
        if (posMatch) {
            const position = parseInt(posMatch[1]);
            const lines = raw.substring(0, position).split('\n');
            lineNumber = lines.length;
            columnNumber = lines[lines.length - 1].length + 1;
        }
        
        // Determine error type and provide helpful message
        let helpText = '';
        
        if (errorMsg.includes('Unexpected token')) {
            errorType = 'Unexpected Token';
            helpText = 'Check for missing commas, quotes, or brackets.';
        } else if (errorMsg.includes('Unexpected end')) {
            errorType = 'Incomplete JSON';
            helpText = 'JSON is incomplete. Check for unclosed brackets or braces.';
        } else if (errorMsg.includes('Unexpected string')) {
            errorType = 'Invalid String';
            helpText = 'Check for missing commas between properties or unquoted keys.';
        } else if (errorMsg.includes('Unexpected number')) {
            errorType = 'Invalid Number';
            helpText = 'Check for trailing commas or invalid number format.';
        }
        
        // Build detailed error message
        let detailsHTML = `
            <div class="error-header">
                <strong>${errorType}</strong>
            </div>
            <div class="error-message">${escapeHTML(errorMsg)}</div>
        `;
        
        if (lineNumber) {
            detailsHTML += `
                <div class="error-location">
                    📍 Line ${lineNumber}, Column ${columnNumber}
                </div>
            `;
        }
        
        if (helpText) {
            detailsHTML += `
                <div class="error-help">
                    💡 ${helpText}
                </div>
            `;
        }
        
        // Common fixes
        detailsHTML += `
            <div class="error-fixes">
                <strong>Common fixes:</strong>
                <ul>
                    <li>Ensure all strings use double quotes (not single quotes)</li>
                    <li>Remove trailing commas after the last item</li>
                    <li>Check that all brackets and braces are properly closed</li>
                    <li>Verify all object keys are quoted</li>
                </ul>
            </div>
        `;
        
        errorDetails.innerHTML = detailsHTML;
        errorDetails.style.display = 'block';
        
        // Highlight error in input
        jsonInput.classList.add('error');
    }
    
    // ============================================================================
    // UI HELPER FUNCTIONS
    // ============================================================================
    
    /**
     * Show status message
     */
    function showStatus(message, type = 'info') {
        statusMsg.textContent = message;
        statusMsg.className = `status-message status-${type}`;
        statusMsg.style.display = 'block';
    }
    
    /**
     * Update status message (keep current type)
     */
    function updateStatus(message) {
        if (statusMsg.textContent.includes('✓')) {
            statusMsg.textContent = '✓ Valid JSON - ' + message;
        }
    }
    
    /**
     * Clear errors
     */
    function clearErrors() {
        errorDetails.style.display = 'none';
        errorDetails.innerHTML = '';
        jsonInput.classList.remove('error');
        jsonOutput.classList.remove('error');
    }
    
    /**
     * Clear output
     */
    function clearOutput() {
        jsonOutput.value = '';
        treeView.innerHTML = '';
        statusMsg.textContent = '';
        statusMsg.style.display = 'none';
    }
    
    /**
     * Switch view mode
     */
    function switchMode(mode) {
        currentMode = mode;
        
        // Update button states
        formatBtn.classList.toggle('active', mode === 'format');
        minifyBtn.classList.toggle('active', mode === 'minify');
        treeBtn.classList.toggle('active', mode === 'tree');
        
        // Update ARIA attributes
        formatBtn.setAttribute('aria-selected', mode === 'format');
        minifyBtn.setAttribute('aria-selected', mode === 'minify');
        treeBtn.setAttribute('aria-selected', mode === 'tree');
        
        // Re-display if valid
        if (isValid) {
            displayOutput();
        }
    }
    
    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    
    /**
     * Get indent string based on settings
     */
    function getIndentString() {
        const value = indentSize.value;
        if (value === 'tab') return '\t';
        return parseInt(value);
    }
    
    /**
     * Get replacer function for sorted keys
     */
    function getSortedReplacer() {
        return function(key, value) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                return Object.keys(value).sort().reduce((sorted, key) => {
                    sorted[key] = value[key];
                    return sorted;
                }, {});
            }
            return value;
        };
    }
    
    /**
     * Escape unicode characters
     */
    function escapeUnicodeChars(str) {
        return str.replace(/[\u007F-\uFFFF]/g, function(chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
        });
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }
    
    /**
     * Get current output content
     */
    function getCurrentOutput() {
        if (currentMode === 'tree') {
            // For tree view, return formatted JSON
            const indent = getIndentString();
            const replacer = sortKeys.checked ? getSortedReplacer() : null;
            return JSON.stringify(parsedData, replacer, indent);
        }
        return jsonOutput.value;
    }
    
    // ============================================================================
    // EVENT LISTENERS
    // ============================================================================
    
    // Mode toggle buttons
    formatBtn.addEventListener('click', () => switchMode('format'));
    minifyBtn.addEventListener('click', () => switchMode('minify'));
    treeBtn.addEventListener('click', () => switchMode('tree'));
    
    // Auto-process when typing (debounced)
    let timeout;
    jsonInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(processJSON, 300);
    });
    
    // Options change
    indentSize.addEventListener('change', () => {
        if (isValid && currentMode === 'format') {
            displayFormatted();
        }
    });
    
    sortKeys.addEventListener('change', () => {
        if (isValid) {
            displayOutput();
        }
    });
    
    escapeUnicode.addEventListener('change', () => {
        if (isValid && currentMode !== 'tree') {
            displayOutput();
        }
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        clearOutput();
        clearErrors();
        parsedData = null;
        isValid = false;
        jsonInput.focus();
    });
    
    // Paste button
    pasteBtn.addEventListener('click', async () => {
        const text = await pasteFromClipboard();
        if (text) {
            jsonInput.value = text;
            processJSON();
        }
    });
    
    // Copy button
    copyBtn.addEventListener('click', async () => {
        if (!isValid) {
            showNotification('No valid JSON to copy', 'warning');
            return;
        }
        
        const content = getCurrentOutput();
        await copyToClipboard(content, copyBtn);
    });
    
    // Download button
    downloadBtn.addEventListener('click', () => {
        if (!isValid) {
            showNotification('No valid JSON to download', 'warning');
            return;
        }
        
        const content = getCurrentOutput();
        const filename = `formatted-${Date.now()}.json`;
        downloadFile(content, filename, 'application/json');
    });
    
    // Load sample button
    loadSampleBtn.addEventListener('click', () => {
        jsonInput.value = JSON.stringify(sampleJSON, null, 2);
        processJSON();
        showNotification('Sample JSON loaded', 'info');
    });
    
    // Keyboard shortcuts
    if (typeof keyboardShortcuts !== 'undefined') {
        keyboardShortcuts.register('ctrl+enter', () => {
            processJSON();
            return true;
        });
        
        keyboardShortcuts.register('ctrl+b', () => {
            switchMode('format');
            return true;
        });
        
        keyboardShortcuts.register('ctrl+m', () => {
            switchMode('minify');
            return true;
        });
        
        keyboardShortcuts.register('ctrl+t', () => {
            switchMode('tree');
            return true;
        });
    }
    
    // Initial focus
    jsonInput.focus();
});
