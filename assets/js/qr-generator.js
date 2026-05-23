/**
 * Enhanced QR Code Generator
 * Features: Multiple formats, color customization, batch generation, history
 */

let currentType = 'text';
let qrCode = null;
let qrHistory = new HistoryManager('qr-history', 10);

// Error correction level mapping
const ERROR_LEVELS = {
  'L': QRCode.CorrectLevel.L,
  'M': QRCode.CorrectLevel.M,
  'Q': QRCode.CorrectLevel.Q,
  'H': QRCode.CorrectLevel.H
};

/**
 * Initialize the QR generator
 */
function initQRGenerator() {
  // Load history
  loadQRHistory();
  
  // Sync color inputs
  document.getElementById('qrForeground').addEventListener('input', (e) => {
    document.getElementById('qrForegroundText').value = e.target.value;
  });
  
  document.getElementById('qrBackground').addEventListener('input', (e) => {
    document.getElementById('qrBackgroundText').value = e.target.value;
  });
  
  // Add keyboard shortcuts
  if (typeof keyboardShortcuts !== 'undefined') {
    keyboardShortcuts.register('ctrl+enter', () => {
      generateQR();
      return true;
    });
  }
}

/**
 * Set QR code type
 */
function setQRType(type) {
  currentType = type;
  
  // Update button states
  const buttons = {
    text: 'typeBtnText',
    url: 'typeBtnUrl',
    email: 'typeBtnEmail',
    phone: 'typeBtnPhone',
    wifi: 'typeBtnWifi'
  };
  
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  
  const activeBtn = document.getElementById(buttons[type]);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
  }
  
  // Show/hide input forms
  document.querySelectorAll('.qr-input-form').forEach(form => {
    form.style.display = 'none';
  });
  
  const activeForm = document.getElementById(type + 'Input');
  if (activeForm) {
    activeForm.style.display = 'block';
  }
}

/**
 * Get QR data based on current type
 */
function getQRData() {
  switch(currentType) {
    case 'text':
      return document.getElementById('qrText').value.trim();
      
    case 'url':
      const url = document.getElementById('qrUrl').value.trim();
      // Validate URL
      if (url && !url.match(/^https?:\/\//i)) {
        showNotification('URL must start with http:// or https://', 'warning');
        return '';
      }
      return url;
      
    case 'email':
      const email = document.getElementById('qrEmail').value.trim();
      const subject = document.getElementById('qrSubject').value.trim();
      const body = document.getElementById('qrBody').value.trim();
      
      if (!email) return '';
      
      let mailto = `mailto:${email}`;
      const params = [];
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      if (params.length > 0) mailto += '?' + params.join('&');
      
      return mailto;
      
    case 'phone':
      const phone = document.getElementById('qrPhone').value.trim();
      return phone ? `tel:${phone}` : '';
      
    case 'wifi':
      const ssid = document.getElementById('wifiSSID').value.trim();
      const password = document.getElementById('wifiPassword').value.trim();
      const security = document.getElementById('wifiSecurity').value;
      const hidden = document.getElementById('wifiHidden').checked;
      
      if (!ssid) return '';
      
      return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
      
    default:
      return '';
  }
}

/**
 * Generate QR code
 */
function generateQR() {
  const data = getQRData();
  
  if (!data) {
    showNotification('Please enter data to generate QR code', 'warning');
    return;
  }
  
  // Get options
  const size = parseInt(document.getElementById('qrSize').value);
  const errorLevel = document.getElementById('qrErrorLevel').value;
  const foreground = document.getElementById('qrForeground').value;
  const background = document.getElementById('qrBackground').value;
  
  // Validate color contrast
  if (!hasGoodContrast(foreground, background)) {
    showNotification('Warning: Low contrast between colors may affect scannability', 'warning');
  }
  
  // Clear previous QR code
  const display = document.getElementById('qrCodeDisplay');
  display.innerHTML = '';
  
  try {
    // Generate QR code
    qrCode = new QRCode(display, {
      text: data,
      width: size,
      height: size,
      colorDark: foreground,
      colorLight: background,
      correctLevel: ERROR_LEVELS[errorLevel]
    });
    
    // Show actions
    document.getElementById('qrActions').style.display = 'flex';
    
    // Add to history
    qrHistory.add({
      type: currentType,
      data: data.substring(0, 100), // Truncate for display
      size: size,
      timestamp: new Date().toISOString()
    });
    
    loadQRHistory();
    
    showNotification('QR code generated successfully!', 'success');
  } catch (error) {
    console.error('QR generation error:', error);
    showNotification('Failed to generate QR code', 'error');
  }
}

/**
 * Regenerate QR if one exists
 */
function regenerateIfExists() {
  if (qrCode) {
    generateQR();
  }
}

/**
 * Update color from text input
 */
function updateColorFromText(type) {
  const textInput = document.getElementById(`qr${type.charAt(0).toUpperCase() + type.slice(1)}Text`);
  const colorInput = document.getElementById(`qr${type.charAt(0).toUpperCase() + type.slice(1)}`);
  
  const value = textInput.value.trim();
  
  // Validate hex color
  if (/^#[0-9A-F]{6}$/i.test(value)) {
    colorInput.value = value;
    regenerateIfExists();
  } else {
    showNotification('Invalid hex color format. Use #RRGGBB', 'warning');
  }
}

/**
 * Check color contrast
 */
function hasGoodContrast(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return true; // Can't validate, assume OK
  
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return ratio >= 3; // WCAG AA for large text
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get relative luminance
 */
function getLuminance(rgb) {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Download QR code in specified format
 */
function downloadQR(format = 'png') {
  if (!qrCode) {
    showNotification('Please generate a QR code first', 'warning');
    return;
  }
  
  const canvas = document.querySelector('#qrCodeDisplay canvas');
  if (!canvas) {
    showNotification('QR code canvas not found', 'error');
    return;
  }
  
  try {
    if (format === 'svg') {
      downloadQRAsSVG();
    } else if (format === 'jpg') {
      downloadQRAsJPG(canvas);
    } else {
      downloadQRAsPNG(canvas);
    }
  } catch (error) {
    console.error('Download error:', error);
    showNotification(`Failed to download ${format.toUpperCase()}`, 'error');
  }
}

/**
 * Download as PNG
 */
function downloadQRAsPNG(canvas) {
  const url = canvas.toDataURL('image/png');
  downloadDataUrl(url, `qrcode-${Date.now()}.png`);
}

/**
 * Download as JPG
 */
function downloadQRAsJPG(canvas) {
  // Create a new canvas with white background
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const ctx = tempCanvas.getContext('2d');
  
  // Fill with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
  // Draw QR code on top
  ctx.drawImage(canvas, 0, 0);
  
  const url = tempCanvas.toDataURL('image/jpeg', 0.95);
  downloadDataUrl(url, `qrcode-${Date.now()}.jpg`);
}

/**
 * Download as SVG
 */
function downloadQRAsSVG() {
  const canvas = document.querySelector('#qrCodeDisplay canvas');
  const size = canvas.width;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, size, size);
  
  const foreground = document.getElementById('qrForeground').value;
  const background = document.getElementById('qrBackground').value;
  
  // Create SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${background}"/>
  <g fill="${foreground}">`;
  
  // Convert pixels to rectangles
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      const r = imageData.data[index];
      
      // If pixel is dark (part of QR code)
      if (r < 128) {
        svg += `\n    <rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
  }
  
  svg += '\n  </g>\n</svg>';
  
  downloadFile(svg, `qrcode-${Date.now()}.svg`, 'image/svg+xml');
}

/**
 * Copy QR to clipboard
 */
async function copyQRToClipboard() {
  if (!qrCode) {
    showNotification('Please generate a QR code first', 'warning');
    return;
  }
  
  const canvas = document.querySelector('#qrCodeDisplay canvas');
  if (!canvas) {
    showNotification('QR code canvas not found', 'error');
    return;
  }
  
  try {
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showNotification('QR code copied to clipboard!', 'success');
      } catch (err) {
        // Fallback: copy as data URL
        const url = canvas.toDataURL('image/png');
        await copyToClipboard(url);
      }
    });
  } catch (error) {
    console.error('Copy error:', error);
    showNotification('Failed to copy QR code', 'error');
  }
}

/**
 * Generate batch QR codes
 */
function generateBatch() {
  const input = document.getElementById('batchInput').value.trim();
  
  if (!input) {
    showNotification('Please enter items to generate (one per line)', 'warning');
    return;
  }
  
  const items = input.split('\n').filter(line => line.trim());
  
  if (items.length === 0) {
    showNotification('No valid items found', 'warning');
    return;
  }
  
  if (items.length > 50) {
    showNotification('Maximum 50 items allowed per batch', 'warning');
    return;
  }
  
  const size = parseInt(document.getElementById('qrSize').value);
  const errorLevel = document.getElementById('qrErrorLevel').value;
  const foreground = document.getElementById('qrForeground').value;
  const background = document.getElementById('qrBackground').value;
  
  const grid = document.getElementById('batchGrid');
  grid.innerHTML = '';
  
  items.forEach((item, index) => {
    const container = document.createElement('div');
    container.className = 'batch-item';
    container.innerHTML = `
      <div class="batch-qr" id="batch-qr-${index}"></div>
      <div class="batch-label">${item.substring(0, 30)}${item.length > 30 ? '...' : ''}</div>
      <button class="btn-sm btn-outline" onclick="downloadBatchItem(${index}, '${item.replace(/'/g, "\\'")}')">
        Download
      </button>
    `;
    grid.appendChild(container);
    
    // Generate QR code
    new QRCode(document.getElementById(`batch-qr-${index}`), {
      text: item,
      width: 200,
      height: 200,
      colorDark: foreground,
      colorLight: background,
      correctLevel: ERROR_LEVELS[errorLevel]
    });
  });
  
  document.getElementById('batchOutput').style.display = 'block';
  document.getElementById('batchCount').textContent = items.length;
  
  showNotification(`Generated ${items.length} QR codes successfully!`, 'success');
}

/**
 * Download single batch item
 */
function downloadBatchItem(index, data) {
  const canvas = document.querySelector(`#batch-qr-${index} canvas`);
  if (canvas) {
    const url = canvas.toDataURL('image/png');
    const filename = `qrcode-${index + 1}-${Date.now()}.png`;
    downloadDataUrl(url, filename);
  }
}

/**
 * Download all batch QR codes as ZIP
 */
async function downloadAllQR() {
  showNotification('Batch download feature coming soon!', 'info');
  // TODO: Implement ZIP download using JSZip library
}

/**
 * Load QR history
 */
function loadQRHistory() {
  const historyContainer = document.getElementById('qrHistory');
  const history = qrHistory.getAll();
  
  if (history.length === 0) {
    historyContainer.innerHTML = '<p class="history-empty">No recent QR codes yet</p>';
    return;
  }
  
  historyContainer.innerHTML = history.map((item, index) => `
    <div class="history-item">
      <div>
        <strong>${item.type.toUpperCase()}</strong>: ${item.data}
        <br>
        <small class="text-gray">${new Date(item.timestamp).toLocaleString()}</small>
      </div>
      <button class="btn-sm btn-outline" onclick="restoreFromHistory(${index})">
        Restore
      </button>
    </div>
  `).join('');
}

/**
 * Restore QR from history
 */
function restoreFromHistory(index) {
  const item = qrHistory.get(index);
  if (!item) return;
  
  // Set type
  setQRType(item.type);
  
  // Set data based on type
  switch(item.type) {
    case 'text':
      document.getElementById('qrText').value = item.data;
      break;
    case 'url':
      document.getElementById('qrUrl').value = item.data;
      break;
    // Add other types as needed
  }
  
  // Set size
  document.getElementById('qrSize').value = item.size || 300;
  
  // Generate
  generateQR();
  
  showNotification('QR code restored from history', 'success');
}

/**
 * Clear QR history
 */
function clearQRHistory() {
  if (confirm('Are you sure you want to clear all QR code history?')) {
    qrHistory.clear();
    loadQRHistory();
    showNotification('History cleared', 'success');
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQRGenerator);
} else {
  initQRGenerator();
}
