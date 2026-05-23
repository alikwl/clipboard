// Hash Generator - Enhanced with multiple algorithms and features
const textInput = document.getElementById('textInput');
let currentMode = 'text';
let currentFile = null;

// Algorithm configuration
const algorithms = {
  md5: { enabled: true, func: CryptoJS.MD5 },
  sha1: { enabled: true, func: CryptoJS.SHA1 },
  sha256: { enabled: true, func: CryptoJS.SHA256 },
  sha512: { enabled: true, func: CryptoJS.SHA512 },
  sha3: { enabled: false, func: CryptoJS.SHA3 },
  ripemd160: { enabled: false, func: CryptoJS.RIPEMD160 }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  setupDragAndDrop();
  updateAlgorithmStates();
});

// Mode switching
function switchMode(mode) {
  currentMode = mode;
  
  // Update button states
  const buttons = ['textModeBtn', 'fileModeBtn', 'compareModeBtn'];
  buttons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.classList.toggle('active', btnId === mode + 'ModeBtn');
    }
  });
  
  // Show/hide sections
  document.getElementById('textMode').style.display = mode === 'text' ? 'block' : 'none';
  document.getElementById('fileMode').style.display = mode === 'file' ? 'block' : 'none';
  document.getElementById('compareMode').style.display = mode === 'compare' ? 'block' : 'none';
  
  // Update hashes based on mode
  if (mode === 'text') {
    generateHashes();
  } else if (mode === 'file' && currentFile) {
    // Keep current file hashes
  } else if (mode === 'compare') {
    clearHashes();
  } else {
    clearHashes();
  }
}

// Generate hashes from text
function generateHashes() {
  const text = textInput.value;
  
  if (!text) {
    clearHashes();
    return;
  }
  
  // Generate hashes for enabled algorithms
  Object.keys(algorithms).forEach(alg => {
    if (algorithms[alg].enabled) {
      try {
        const hash = algorithms[alg].func(text).toString();
        document.getElementById(alg + 'Output').textContent = hash;
      } catch (err) {
        console.error(`Error generating ${alg}:`, err);
        document.getElementById(alg + 'Output').textContent = 'Error';
      }
    }
  });
}

// Handle file upload
function handleFile(file) {
  if (!file) {
    file = document.getElementById('fileInput').files[0];
  }
  
  if (!file) return;
  
  currentFile = file;
  
  // Update file info
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('fileSize').textContent = formatFileSize(file.size);
  document.getElementById('fileInfo').style.display = 'block';
  
  // Show loading state
  showNotification('Hashing file...', 'info', 2000);
  
  // Read and hash file
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
      
      // Generate hashes for enabled algorithms
      Object.keys(algorithms).forEach(alg => {
        if (algorithms[alg].enabled) {
          try {
            const hash = algorithms[alg].func(wordArray).toString();
            document.getElementById(alg + 'Output').textContent = hash;
          } catch (err) {
            console.error(`Error generating ${alg}:`, err);
            document.getElementById(alg + 'Output').textContent = 'Error';
          }
        }
      });
      
      showNotification('File hashed successfully!', 'success');
    } catch (err) {
      console.error('Error hashing file:', err);
      showNotification('Error hashing file', 'error');
    }
  };
  
  reader.onerror = function() {
    showNotification('Error reading file', 'error');
  };
  
  reader.readAsArrayBuffer(file);
}

// Drag and drop setup
function setupDragAndDrop() {
  const dropZone = document.getElementById('dropZone');
  if (!dropZone) return;
  
  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
  });
  
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });
  
  dropZone.addEventListener('click', function(e) {
    if (e.target === dropZone || e.target.classList.contains('upload-text') || e.target.classList.contains('upload-icon')) {
      document.getElementById('fileInput').click();
    }
  });
}

// Paste text from clipboard
async function pasteText() {
  try {
    const text = await pasteFromClipboard();
    if (text) {
      textInput.value = text;
      generateHashes();
    }
  } catch (err) {
    console.error('Paste failed:', err);
  }
}

// Clear input
function clearInput() {
  textInput.value = '';
  generateHashes();
}

// Clear all hashes
function clearHashes() {
  Object.keys(algorithms).forEach(alg => {
    document.getElementById(alg + 'Output').textContent = '-';
  });
}

// Update algorithm states based on checkboxes
function updateAlgorithmStates() {
  Object.keys(algorithms).forEach(alg => {
    const checkbox = document.getElementById('alg-' + alg);
    if (checkbox) {
      algorithms[alg].enabled = checkbox.checked;
      const resultDiv = document.getElementById('result-' + alg);
      if (resultDiv) {
        resultDiv.style.display = checkbox.checked ? 'block' : 'none';
      }
    }
  });
}

// Update hashes when algorithm selection changes
function updateHashes() {
  updateAlgorithmStates();
  
  if (currentMode === 'text' && textInput.value) {
    generateHashes();
  } else if (currentMode === 'file' && currentFile) {
    handleFile(currentFile);
  }
}

// Copy single hash
function copyHash(type) {
  const hash = document.getElementById(type + 'Output').textContent;
  if (hash && hash !== '-' && hash !== 'Error') {
    copyToClipboard(hash);
  } else {
    showNotification('No hash to copy', 'warning');
  }
}

// Copy all hashes
function copyAllHashes() {
  const hashes = [];
  
  Object.keys(algorithms).forEach(alg => {
    if (algorithms[alg].enabled) {
      const hash = document.getElementById(alg + 'Output').textContent;
      if (hash && hash !== '-' && hash !== 'Error') {
        hashes.push(`${alg.toUpperCase()}: ${hash}`);
      }
    }
  });
  
  if (hashes.length > 0) {
    const allHashesText = hashes.join('\n');
    copyToClipboard(allHashesText);
  } else {
    showNotification('No hashes to copy', 'warning');
  }
}

// Download hashes as text file
function downloadHashes() {
  const hashes = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Add header
  if (currentMode === 'text') {
    hashes.push('Hash Generator Results - Text Input');
  } else if (currentMode === 'file' && currentFile) {
    hashes.push('Hash Generator Results - File Hash');
    hashes.push(`File: ${currentFile.name}`);
    hashes.push(`Size: ${formatFileSize(currentFile.size)}`);
  }
  
  hashes.push(`Generated: ${new Date().toLocaleString()}`);
  hashes.push('');
  
  // Add hash values
  Object.keys(algorithms).forEach(alg => {
    if (algorithms[alg].enabled) {
      const hash = document.getElementById(alg + 'Output').textContent;
      if (hash && hash !== '-' && hash !== 'Error') {
        hashes.push(`${alg.toUpperCase()}: ${hash}`);
      }
    }
  });
  
  if (hashes.length > 4) { // More than just headers
    const content = hashes.join('\n');
    const filename = `hashes-${timestamp}.txt`;
    downloadFile(content, filename, 'text/plain');
  } else {
    showNotification('No hashes to download', 'warning');
  }
}

// Compare two hashes
function compareHashes() {
  const hash1 = document.getElementById('hash1Input').value.trim().toLowerCase();
  const hash2 = document.getElementById('hash2Input').value.trim().toLowerCase();
  const resultDiv = document.getElementById('compareResult');
  
  if (!hash1 || !hash2) {
    showNotification('Please enter both hashes to compare', 'warning');
    return;
  }
  
  resultDiv.style.display = 'block';
  
  if (hash1 === hash2) {
    resultDiv.innerHTML = `
      <div class="compare-match">
        <div class="compare-icon">✓</div>
        <h3>Hashes Match!</h3>
        <p>The two hashes are identical. The data has not been modified.</p>
      </div>
    `;
    resultDiv.className = 'compare-result match';
    showNotification('Hashes match!', 'success');
  } else {
    // Find where they differ
    let diffIndex = -1;
    const minLength = Math.min(hash1.length, hash2.length);
    for (let i = 0; i < minLength; i++) {
      if (hash1[i] !== hash2[i]) {
        diffIndex = i;
        break;
      }
    }
    
    resultDiv.innerHTML = `
      <div class="compare-no-match">
        <div class="compare-icon">✗</div>
        <h3>Hashes Do Not Match</h3>
        <p>The two hashes are different. The data has been modified or is not identical.</p>
        ${diffIndex >= 0 ? `<p class="diff-info">First difference at position ${diffIndex + 1}</p>` : ''}
        ${hash1.length !== hash2.length ? `<p class="diff-info">Hash lengths differ: ${hash1.length} vs ${hash2.length} characters</p>` : ''}
      </div>
    `;
    resultDiv.className = 'compare-result no-match';
    showNotification('Hashes do not match', 'error');
  }
}

// Event listeners
if (textInput) {
  textInput.addEventListener('input', debounce(generateHashes, 300));
}

// Keyboard shortcuts
if (typeof keyboardShortcuts !== 'undefined') {
  keyboardShortcuts.register('ctrl+v', function() {
    if (currentMode === 'text' && document.activeElement === textInput) {
      return false; // Allow default paste
    }
  });
  
  keyboardShortcuts.register('ctrl+shift+c', function() {
    copyAllHashes();
    return true;
  });
}
