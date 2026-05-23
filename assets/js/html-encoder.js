// HTML Encoder/Decoder with Enhanced Features
// Supports batch processing, preview mode, and entity reference guide

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let currentMode = 'encode';
let historyManager;
let previewVisible = false;
let referenceVisible = false;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  initializeHistory();
  initializeEventListeners();
  loadPreferences();
  populateEntityReference();
});

function initializeElements() {
  // Get all DOM elements
  window.elements = {
    inputBox: document.getElementById('inputBox'),
    outputBox: document.getElementById('outputBox'),
    inputStats: document.getElementById('inputStats'),
    outputStats: document.getElementById('outputStats'),
    inputLabel: document.getElementById('inputLabel'),
    modeEncode: document.getElementById('modeEncode'),
    modeDecode: document.getElementById('modeDecode'),
    encodeAll: document.getElementById('encodeAll'),
    useHex: document.getElementById('useHex'),
    useNamed: document.getElementById('useNamed'),
    batchMode: document.getElementById('batchMode'),
    pasteBtn: document.getElementById('pasteBtn'),
    clearBtn: document.getElementById('clearBtn'),
    copyBtn: document.getElementById('copyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    previewBox: document.getElementById('previewBox'),
    togglePreview: document.getElementById('togglePreview'),
    toggleReference: document.getElementById('toggleReference'),
    referenceContent: document.getElementById('referenceContent'),
    historySection: document.getElementById('historySection'),
    historyList: document.getElementById('historyList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    encodingOptions: document.getElementById('encodingOptions')
  };
}

function initializeHistory() {
  historyManager = new HistoryManager('html-encoder-history', 10);
  updateHistoryDisplay();
}

function initializeEventListeners() {
  const el = window.elements;
  
  // Mode toggle
  el.modeEncode.addEventListener('click', () => setMode('encode'));
  el.modeDecode.addEventListener('click', () => setMode('decode'));
  
  // Input handling
  el.inputBox.addEventListener('input', debounce(handleInput, 300));
  
  // Options
  el.encodeAll.addEventListener('change', () => {
    processText();
    savePreferences();
  });
  el.useHex.addEventListener('change', () => {
    processText();
    savePreferences();
  });
  el.useNamed.addEventListener('change', () => {
    processText();
    savePreferences();
  });
  el.batchMode.addEventListener('change', processText);
  
  // Buttons
  el.pasteBtn.addEventListener('click', handlePaste);
  el.clearBtn.addEventListener('click', clearAll);
  el.copyBtn.addEventListener('click', handleCopy);
  el.downloadBtn.addEventListener('click', handleDownload);
  el.togglePreview.addEventListener('click', togglePreview);
  el.toggleReference.addEventListener('click', toggleReference);
  el.clearHistoryBtn.addEventListener('click', clearHistory);
  
  // Example buttons
  document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', () => loadExample(btn.dataset.example));
  });
  
  // Reference tabs
  document.querySelectorAll('.reference-tab').forEach(tab => {
    tab.addEventListener('click', () => switchReferenceTab(tab.dataset.tab));
  });
  
  // Keyboard shortcuts
  keyboardShortcuts.register('ctrl+enter', () => {
    processText();
    return true;
  });
  
  keyboardShortcuts.register('ctrl+k', () => {
    clearAll();
    return true;
  });
}

// ============================================================================
// MODE MANAGEMENT
// ============================================================================

function setMode(mode) {
  currentMode = mode;
  const el = window.elements;
  
  // Update button states
  el.modeEncode.classList.toggle('active', mode === 'encode');
  el.modeDecode.classList.toggle('active', mode === 'decode');
  
  // Update labels
  el.inputLabel.textContent = mode === 'encode' ? 'Text to Encode:' : 'Text to Decode:';
  
  // Show/hide encoding options
  el.encodingOptions.style.display = mode === 'encode' ? 'block' : 'none';
  
  // Update placeholder
  el.inputBox.placeholder = mode === 'encode' 
    ? 'Enter HTML to encode (e.g., <div>Hello & goodbye</div>)'
    : 'Enter encoded HTML to decode (e.g., &lt;div&gt;Hello &amp; goodbye&lt;/div&gt;)';
  
  processText();
}

// ============================================================================
// HTML ENCODING/DECODING
// ============================================================================

const namedEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  ' ': '&nbsp;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '¢': '&cent;',
  '§': '&sect;',
  '¶': '&para;',
  '°': '&deg;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
  '¼': '&frac14;',
  '½': '&frac12;',
  '¾': '&frac34;'
};

function encodeHTML(text) {
  const el = window.elements;
  const encodeAll = el.encodeAll.checked;
  const useHex = el.useHex.checked;
  const useNamed = el.useNamed.checked;
  
  if (encodeAll) {
    // Encode every character
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (useHex) {
        return `&#x${code.toString(16)};`;
      }
      return `&#${code};`;
    }).join('');
  }
  
  // Encode only special characters
  return text.split('').map(char => {
    // Check if character needs encoding
    if (useNamed && namedEntities[char]) {
      return namedEntities[char];
    }
    
    // Check if it's a special character
    const code = char.charCodeAt(0);
    if (char === '&' || char === '<' || char === '>' || char === '"' || char === "'" || code > 127) {
      if (useHex) {
        return `&#x${code.toString(16)};`;
      }
      return `&#${code};`;
    }
    
    return char;
  }).join('');
}

function decodeHTML(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// ============================================================================
// TEXT PROCESSING
// ============================================================================

function handleInput() {
  updateCharCount();
  processText();
}

function processText() {
  const el = window.elements;
  const input = el.inputBox.value;
  
  if (!input) {
    el.outputBox.value = '';
    updateCharCount();
    updatePreview();
    return;
  }
  
  try {
    let result;
    
    if (el.batchMode.checked) {
      // Batch processing
      const lines = input.split('\n');
      const processed = lines.map(line => {
        if (!line.trim()) return '';
        return currentMode === 'encode' ? encodeHTML(line) : decodeHTML(line);
      });
      result = processed.join('\n');
    } else {
      // Single processing
      result = currentMode === 'encode' ? encodeHTML(input) : decodeHTML(input);
    }
    
    el.outputBox.value = result;
    el.outputBox.classList.remove('error');
    
    updateCharCount();
    updatePreview();
    
  } catch (e) {
    el.outputBox.value = 'Error: ' + e.message;
    el.outputBox.classList.add('error');
    showNotification('Processing error: ' + e.message, 'error');
  }
}

function updateCharCount() {
  const el = window.elements;
  const inputLength = el.inputBox.value.length;
  const outputLength = el.outputBox.value.length;
  
  el.inputStats.textContent = `${inputLength.toLocaleString()} character${inputLength !== 1 ? 's' : ''}`;
  el.outputStats.textContent = `${outputLength.toLocaleString()} character${outputLength !== 1 ? 's' : ''}`;
}

// ============================================================================
// PREVIEW MODE
// ============================================================================

function togglePreview() {
  const el = window.elements;
  previewVisible = !previewVisible;
  
  el.previewBox.style.display = previewVisible ? 'block' : 'none';
  el.togglePreview.textContent = previewVisible ? 'Hide Preview' : 'Show Preview';
  
  if (previewVisible) {
    updatePreview();
  }
}

function updatePreview() {
  if (!previewVisible) return;
  
  const el = window.elements;
  const output = el.outputBox.value;
  
  if (!output) {
    el.previewBox.innerHTML = '<em>No content to preview</em>';
    return;
  }
  
  // For decode mode, show the decoded HTML rendered
  // For encode mode, show how the encoded text will display
  if (currentMode === 'decode') {
    el.previewBox.innerHTML = output;
  } else {
    // Show the encoded text as it would appear when decoded
    const decoded = decodeHTML(output);
    el.previewBox.textContent = decoded;
  }
}

// ============================================================================
// ENTITY REFERENCE GUIDE
// ============================================================================

const entityCategories = {
  common: [
    { char: '&', named: '&amp;', decimal: '&#38;', hex: '&#x26;', desc: 'Ampersand' },
    { char: '<', named: '&lt;', decimal: '&#60;', hex: '&#x3C;', desc: 'Less than' },
    { char: '>', named: '&gt;', decimal: '&#62;', hex: '&#x3E;', desc: 'Greater than' },
    { char: '"', named: '&quot;', decimal: '&#34;', hex: '&#x22;', desc: 'Double quote' },
    { char: "'", named: '&apos;', decimal: '&#39;', hex: '&#x27;', desc: 'Single quote' },
    { char: ' ', named: '&nbsp;', decimal: '&#160;', hex: '&#xA0;', desc: 'Non-breaking space' }
  ],
  symbols: [
    { char: '©', named: '&copy;', decimal: '&#169;', hex: '&#xA9;', desc: 'Copyright' },
    { char: '®', named: '&reg;', decimal: '&#174;', hex: '&#xAE;', desc: 'Registered' },
    { char: '™', named: '&trade;', decimal: '&#8482;', hex: '&#x2122;', desc: 'Trademark' },
    { char: '€', named: '&euro;', decimal: '&#8364;', hex: '&#x20AC;', desc: 'Euro' },
    { char: '£', named: '&pound;', decimal: '&#163;', hex: '&#xA3;', desc: 'Pound' },
    { char: '¥', named: '&yen;', decimal: '&#165;', hex: '&#xA5;', desc: 'Yen' },
    { char: '¢', named: '&cent;', decimal: '&#162;', hex: '&#xA2;', desc: 'Cent' },
    { char: '§', named: '&sect;', decimal: '&#167;', hex: '&#xA7;', desc: 'Section' },
    { char: '¶', named: '&para;', decimal: '&#182;', hex: '&#xB6;', desc: 'Paragraph' },
    { char: '•', named: '&bull;', decimal: '&#8226;', hex: '&#x2022;', desc: 'Bullet' },
    { char: '…', named: '&hellip;', decimal: '&#8230;', hex: '&#x2026;', desc: 'Ellipsis' },
    { char: '–', named: '&ndash;', decimal: '&#8211;', hex: '&#x2013;', desc: 'En dash' },
    { char: '—', named: '&mdash;', decimal: '&#8212;', hex: '&#x2014;', desc: 'Em dash' }
  ],
  math: [
    { char: '×', named: '&times;', decimal: '&#215;', hex: '&#xD7;', desc: 'Multiplication' },
    { char: '÷', named: '&divide;', decimal: '&#247;', hex: '&#xF7;', desc: 'Division' },
    { char: '±', named: '&plusmn;', decimal: '&#177;', hex: '&#xB1;', desc: 'Plus-minus' },
    { char: '≠', named: '&ne;', decimal: '&#8800;', hex: '&#x2260;', desc: 'Not equal' },
    { char: '≈', named: '&asymp;', decimal: '&#8776;', hex: '&#x2248;', desc: 'Approximately' },
    { char: '≤', named: '&le;', decimal: '&#8804;', hex: '&#x2264;', desc: 'Less or equal' },
    { char: '≥', named: '&ge;', decimal: '&#8805;', hex: '&#x2265;', desc: 'Greater or equal' },
    { char: '∞', named: '&infin;', decimal: '&#8734;', hex: '&#x221E;', desc: 'Infinity' },
    { char: '∑', named: '&sum;', decimal: '&#8721;', hex: '&#x2211;', desc: 'Summation' },
    { char: '∏', named: '&prod;', decimal: '&#8719;', hex: '&#x220F;', desc: 'Product' },
    { char: '√', named: '&radic;', decimal: '&#8730;', hex: '&#x221A;', desc: 'Square root' },
    { char: '∫', named: '&int;', decimal: '&#8747;', hex: '&#x222B;', desc: 'Integral' }
  ],
  arrows: [
    { char: '←', named: '&larr;', decimal: '&#8592;', hex: '&#x2190;', desc: 'Left arrow' },
    { char: '→', named: '&rarr;', decimal: '&#8594;', hex: '&#x2192;', desc: 'Right arrow' },
    { char: '↑', named: '&uarr;', decimal: '&#8593;', hex: '&#x2191;', desc: 'Up arrow' },
    { char: '↓', named: '&darr;', decimal: '&#8595;', hex: '&#x2193;', desc: 'Down arrow' },
    { char: '↔', named: '&harr;', decimal: '&#8596;', hex: '&#x2194;', desc: 'Left-right arrow' },
    { char: '⇐', named: '&lArr;', decimal: '&#8656;', hex: '&#x21D0;', desc: 'Left double arrow' },
    { char: '⇒', named: '&rArr;', decimal: '&#8658;', hex: '&#x21D2;', desc: 'Right double arrow' },
    { char: '⇑', named: '&uArr;', decimal: '&#8657;', hex: '&#x21D1;', desc: 'Up double arrow' },
    { char: '⇓', named: '&dArr;', decimal: '&#8659;', hex: '&#x21D3;', desc: 'Down double arrow' },
    { char: '⇔', named: '&hArr;', decimal: '&#8660;', hex: '&#x21D4;', desc: 'Left-right double arrow' }
  ],
  greek: [
    { char: 'Α', named: '&Alpha;', decimal: '&#913;', hex: '&#x391;', desc: 'Alpha (uppercase)' },
    { char: 'α', named: '&alpha;', decimal: '&#945;', hex: '&#x3B1;', desc: 'Alpha (lowercase)' },
    { char: 'Β', named: '&Beta;', decimal: '&#914;', hex: '&#x392;', desc: 'Beta (uppercase)' },
    { char: 'β', named: '&beta;', decimal: '&#946;', hex: '&#x3B2;', desc: 'Beta (lowercase)' },
    { char: 'Γ', named: '&Gamma;', decimal: '&#915;', hex: '&#x393;', desc: 'Gamma (uppercase)' },
    { char: 'γ', named: '&gamma;', decimal: '&#947;', hex: '&#x3B3;', desc: 'Gamma (lowercase)' },
    { char: 'Δ', named: '&Delta;', decimal: '&#916;', hex: '&#x394;', desc: 'Delta (uppercase)' },
    { char: 'δ', named: '&delta;', decimal: '&#948;', hex: '&#x3B4;', desc: 'Delta (lowercase)' },
    { char: 'Π', named: '&Pi;', decimal: '&#928;', hex: '&#x3A0;', desc: 'Pi (uppercase)' },
    { char: 'π', named: '&pi;', decimal: '&#960;', hex: '&#x3C0;', desc: 'Pi (lowercase)' },
    { char: 'Σ', named: '&Sigma;', decimal: '&#931;', hex: '&#x3A3;', desc: 'Sigma (uppercase)' },
    { char: 'σ', named: '&sigma;', decimal: '&#963;', hex: '&#x3C3;', desc: 'Sigma (lowercase)' },
    { char: 'Ω', named: '&Omega;', decimal: '&#937;', hex: '&#x3A9;', desc: 'Omega (uppercase)' },
    { char: 'ω', named: '&omega;', decimal: '&#969;', hex: '&#x3C9;', desc: 'Omega (lowercase)' }
  ]
};

function populateEntityReference() {
  // Initial load with common entities
  switchReferenceTab('common');
}

function toggleReference() {
  const el = window.elements;
  referenceVisible = !referenceVisible;
  
  el.referenceContent.style.display = referenceVisible ? 'block' : 'none';
  el.toggleReference.textContent = referenceVisible ? 'Hide Reference' : 'Show Reference';
}

function switchReferenceTab(category) {
  // Update active tab
  document.querySelectorAll('.reference-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === category);
  });
  
  // Generate table
  const entities = entityCategories[category] || [];
  const tableHTML = `
    <table class="entity-table">
      <thead>
        <tr>
          <th>Character</th>
          <th>Named Entity</th>
          <th>Decimal</th>
          <th>Hex</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${entities.map(entity => `
          <tr>
            <td class="entity-char">${entity.char}</td>
            <td class="entity-code"><code>${sanitizeHTML(entity.named)}</code></td>
            <td class="entity-code"><code>${sanitizeHTML(entity.decimal)}</code></td>
            <td class="entity-code"><code>${sanitizeHTML(entity.hex)}</code></td>
            <td>${entity.desc}</td>
            <td>
              <button class="btn-xs" onclick="copyEntity('${entity.named.replace(/'/g, "\\'")}')">Copy</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.getElementById('referenceTable').innerHTML = tableHTML;
}

function copyEntity(entity) {
  copyToClipboard(entity);
  showNotification('Entity copied!', 'success');
}

// ============================================================================
// EXAMPLES
// ============================================================================

const examples = {
  basic: '<div class="container">\n  <h1>Hello World</h1>\n  <p>This is a paragraph.</p>\n</div>',
  special: 'Price: $19.99 & up\nCopyright © 2024\nTrademark ™ symbol',
  symbols: '← → ↑ ↓\n× ÷ ± ≠\n© ® ™ €',
  quotes: 'He said, "It\'s a beautiful day!"\n<a href="page.html" title="Link\'s title">Click here</a>'
};

function loadExample(type) {
  const el = window.elements;
  const example = examples[type];
  
  if (example) {
    el.inputBox.value = example;
    handleInput();
    showNotification('Example loaded', 'info');
  }
}

// ============================================================================
// CLIPBOARD OPERATIONS
// ============================================================================

async function handlePaste() {
  const el = window.elements;
  const text = await pasteFromClipboard();
  if (text) {
    el.inputBox.value = text;
    handleInput();
  }
}

function handleCopy() {
  const el = window.elements;
  const text = el.outputBox.value;
  
  if (!text) {
    showNotification('Nothing to copy', 'warning');
    return;
  }
  
  copyToClipboard(text, el.copyBtn);
  
  // Add to history
  addToHistory();
}

function handleDownload() {
  const el = window.elements;
  const text = el.outputBox.value;
  
  if (!text) {
    showNotification('Nothing to download', 'warning');
    return;
  }
  
  const filename = `html-${currentMode}d-${Date.now()}.txt`;
  downloadFile(text, filename, 'text/plain');
  
  // Add to history
  addToHistory();
}

// ============================================================================
// HISTORY MANAGEMENT
// ============================================================================

function addToHistory() {
  const el = window.elements;
  const input = el.inputBox.value;
  const output = el.outputBox.value;
  
  if (!input || !output) return;
  
  const item = {
    mode: currentMode,
    input: input.substring(0, 100),
    output: output.substring(0, 100),
    timestamp: new Date().toISOString()
  };
  
  historyManager.add(item);
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  const el = window.elements;
  const history = historyManager.getAll();
  
  if (history.length === 0) {
    el.historySection.style.display = 'none';
    return;
  }
  
  el.historySection.style.display = 'block';
  
  el.historyList.innerHTML = history.map((item, index) => `
    <div class="history-item">
      <div class="history-meta">
        <span class="history-mode">${item.mode}</span>
        <span class="history-time">${formatDate(item.timestamp, 'short')}</span>
      </div>
      <div class="history-preview">
        <div><strong>Input:</strong> ${sanitizeHTML(item.input)}${item.input.length > 100 ? '...' : ''}</div>
        <div><strong>Output:</strong> ${sanitizeHTML(item.output)}${item.output.length > 100 ? '...' : ''}</div>
      </div>
      <button class="btn-xs" onclick="loadFromHistory(${index})">Load</button>
    </div>
  `).join('');
}

function loadFromHistory(index) {
  const item = historyManager.get(index);
  if (!item) return;
  
  const el = window.elements;
  setMode(item.mode);
  el.inputBox.value = item.input;
  handleInput();
  showNotification('Loaded from history', 'info');
}

function clearHistory() {
  if (confirm('Clear all history?')) {
    historyManager.clear();
    updateHistoryDisplay();
    showNotification('History cleared', 'success');
  }
}

// ============================================================================
// PREFERENCES
// ============================================================================

function savePreferences() {
  const el = window.elements;
  const prefs = {
    encodeAll: el.encodeAll.checked,
    useHex: el.useHex.checked,
    useNamed: el.useNamed.checked
  };
  savePreference('html-encoder-prefs', prefs);
}

function loadPreferences() {
  const prefs = loadPreference('html-encoder-prefs', {
    encodeAll: false,
    useHex: false,
    useNamed: true
  });
  
  const el = window.elements;
  el.encodeAll.checked = prefs.encodeAll;
  el.useHex.checked = prefs.useHex;
  el.useNamed.checked = prefs.useNamed;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function clearAll() {
  const el = window.elements;
  el.inputBox.value = '';
  el.outputBox.value = '';
  updateCharCount();
  updatePreview();
  showNotification('Cleared', 'info');
}

// Make functions globally accessible
window.copyEntity = copyEntity;
window.loadFromHistory = loadFromHistory;
