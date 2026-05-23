/**
 * Shared JavaScript Utilities for Tool Pages
 * Provides common functionality across all tools
 */

// ============================================================================
// CLIPBOARD UTILITIES
// ============================================================================

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Optional button element for visual feedback
 * @returns {Promise<boolean>} - Success status
 */
async function copyToClipboard(text, button = null) {
  try {
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      // Fallback for older browsers
      return fallbackCopyToClipboard(text, button);
    }

    await navigator.clipboard.writeText(text);
    
    // Show success notification
    showNotification('Copied to clipboard!', 'success');
    
    // Update button if provided
    if (button) {
      updateButtonState(button, 'success', '✓ Copied!', 2000);
    }
    
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    showNotification('Failed to copy to clipboard', 'error');
    return false;
  }
}

/**
 * Fallback copy method for browsers without clipboard API
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Optional button element
 * @returns {boolean} - Success status
 */
function fallbackCopyToClipboard(text, button = null) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      showNotification('Copied to clipboard!', 'success');
      if (button) {
        updateButtonState(button, 'success', '✓ Copied!', 2000);
      }
      return true;
    }
    return false;
  } catch (err) {
    document.body.removeChild(textArea);
    console.error('Fallback copy failed:', err);
    showNotification('Failed to copy to clipboard', 'error');
    return false;
  }
}

/**
 * Paste text from clipboard
 * @returns {Promise<string>} - Pasted text
 */
async function pasteFromClipboard() {
  try {
    if (!navigator.clipboard) {
      showNotification('Clipboard access not supported', 'warning');
      return '';
    }
    
    const text = await navigator.clipboard.readText();
    showNotification('Pasted from clipboard', 'info');
    return text;
  } catch (err) {
    console.error('Failed to paste from clipboard:', err);
    showNotification('Failed to paste from clipboard', 'error');
    return '';
  }
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

/**
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.tool-notification');
  existingNotifications.forEach(n => n.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `tool-notification tool-notification-${type}`;
  
  // Add icon based on type
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };
  
  notification.innerHTML = `
    <span class="notification-icon">${icons[type] || icons.info}</span>
    <span class="notification-message">${message}</span>
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto-dismiss
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

// ============================================================================
// HISTORY MANAGER
// ============================================================================

/**
 * History Manager class for managing local storage history
 */
class HistoryManager {
  /**
   * Create a new HistoryManager
   * @param {string} storageKey - Local storage key
   * @param {number} maxItems - Maximum number of items to store (default: 10)
   */
  constructor(storageKey, maxItems = 10) {
    this.storageKey = storageKey;
    this.maxItems = maxItems;
  }
  
  /**
   * Add item to history
   * @param {*} item - Item to add (will be JSON stringified)
   */
  add(item) {
    try {
      let history = this.getAll();
      
      // Add timestamp if not present
      if (typeof item === 'object' && !item.timestamp) {
        item.timestamp = new Date().toISOString();
      }
      
      // Add to beginning of array
      history.unshift(item);
      
      // Limit to max items
      if (history.length > this.maxItems) {
        history = history.slice(0, this.maxItems);
      }
      
      // Save to local storage
      localStorage.setItem(this.storageKey, JSON.stringify(history));
      
      return true;
    } catch (err) {
      console.error('Failed to add to history:', err);
      return false;
    }
  }
  
  /**
   * Get all history items
   * @returns {Array} - Array of history items
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Failed to get history:', err);
      return [];
    }
  }
  
  /**
   * Get specific history item by index
   * @param {number} index - Item index
   * @returns {*} - History item or null
   */
  get(index) {
    const history = this.getAll();
    return history[index] || null;
  }
  
  /**
   * Remove item from history by index
   * @param {number} index - Item index
   */
  remove(index) {
    try {
      const history = this.getAll();
      history.splice(index, 1);
      localStorage.setItem(this.storageKey, JSON.stringify(history));
      return true;
    } catch (err) {
      console.error('Failed to remove from history:', err);
      return false;
    }
  }
  
  /**
   * Clear all history
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (err) {
      console.error('Failed to clear history:', err);
      return false;
    }
  }
  
  /**
   * Get history count
   * @returns {number} - Number of items in history
   */
  count() {
    return this.getAll().length;
  }
  
  /**
   * Check if history is empty
   * @returns {boolean} - True if empty
   */
  isEmpty() {
    return this.count() === 0;
  }
}

// ============================================================================
// FILE DOWNLOAD UTILITIES
// ============================================================================

/**
 * Download content as a file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type (default: 'text/plain')
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
  try {
    // Create blob
    const blob = new Blob([content], { type: mimeType });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(`Downloaded ${filename}`, 'success');
    return true;
  } catch (err) {
    console.error('Failed to download file:', err);
    showNotification('Failed to download file', 'error');
    return false;
  }
}

/**
 * Download data URL as file (for images, etc.)
 * @param {string} dataUrl - Data URL
 * @param {string} filename - File name
 */
function downloadDataUrl(dataUrl, filename) {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Downloaded ${filename}`, 'success');
    return true;
  } catch (err) {
    console.error('Failed to download file:', err);
    showNotification('Failed to download file', 'error');
    return false;
  }
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

/**
 * Keyboard Shortcuts Handler
 */
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;
    this.init();
  }
  
  /**
   * Initialize keyboard event listener
   */
  init() {
    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      
      // Build key combination string
      const key = this.buildKeyString(e);
      
      // Check if shortcut exists
      if (this.shortcuts.has(key)) {
        const handler = this.shortcuts.get(key);
        
        // Prevent default if handler returns true
        if (handler(e) !== false) {
          e.preventDefault();
        }
      }
    });
  }
  
  /**
   * Build key combination string
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {string} - Key combination string
   */
  buildKeyString(e) {
    const parts = [];
    
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    
    // Add the actual key
    const key = e.key.toLowerCase();
    if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
      parts.push(key);
    }
    
    return parts.join('+');
  }
  
  /**
   * Register a keyboard shortcut
   * @param {string} combination - Key combination (e.g., 'ctrl+c', 'ctrl+shift+s')
   * @param {Function} handler - Handler function
   */
  register(combination, handler) {
    this.shortcuts.set(combination.toLowerCase(), handler);
  }
  
  /**
   * Unregister a keyboard shortcut
   * @param {string} combination - Key combination
   */
  unregister(combination) {
    this.shortcuts.delete(combination.toLowerCase());
  }
  
  /**
   * Enable keyboard shortcuts
   */
  enable() {
    this.enabled = true;
  }
  
  /**
   * Disable keyboard shortcuts
   */
  disable() {
    this.enabled = false;
  }
  
  /**
   * Clear all shortcuts
   */
  clear() {
    this.shortcuts.clear();
  }
}

// Create global keyboard shortcuts instance
const keyboardShortcuts = new KeyboardShortcuts();

// ============================================================================
// UI HELPER UTILITIES
// ============================================================================

/**
 * Update button state with temporary feedback
 * @param {HTMLElement} button - Button element
 * @param {string} state - State: 'success', 'error', 'loading'
 * @param {string} text - Button text
 * @param {number} duration - Duration in milliseconds
 */
function updateButtonState(button, state, text, duration = 2000) {
  if (!button) return;
  
  const originalHTML = button.innerHTML;
  const originalClass = button.className;
  
  // Update button
  button.innerHTML = text;
  button.classList.add(`btn-${state}`);
  
  // Restore after duration
  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.className = originalClass;
  }, duration);
}

/**
 * Show loading state on element
 * @param {HTMLElement} element - Element to show loading on
 * @param {string} message - Loading message
 */
function showLoading(element, message = 'Loading...') {
  if (!element) return;
  
  element.dataset.originalContent = element.innerHTML;
  element.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <span>${message}</span>
    </div>
  `;
  element.classList.add('loading');
}

/**
 * Hide loading state on element
 * @param {HTMLElement} element - Element to hide loading from
 */
function hideLoading(element) {
  if (!element) return;
  
  if (element.dataset.originalContent) {
    element.innerHTML = element.dataset.originalContent;
    delete element.dataset.originalContent;
  }
  element.classList.remove('loading');
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
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
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Valid status
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} - Valid status
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} - Sanitized HTML
 */
function sanitizeHTML(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

/**
 * Save preferences to local storage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function savePreference(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('Failed to save preference:', err);
    return false;
  }
}

/**
 * Load preferences from local storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} - Stored value or default
 */
function loadPreference(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (err) {
    console.error('Failed to load preference:', err);
    return defaultValue;
  }
}

/**
 * Clear preference from local storage
 * @param {string} key - Storage key
 */
function clearPreference(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error('Failed to clear preference:', err);
    return false;
  }
}

// ============================================================================
// FORMAT UTILITIES
// ============================================================================

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time'
 * @returns {string} - Formatted date
 */
function formatDate(date, format = 'short') {
  const d = date instanceof Date ? date : new Date(date);
  
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    time: { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  };
  
  return d.toLocaleString('en-US', options[format] || options.short);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============================================================================
// EXPORT FOR MODULE USAGE
// ============================================================================

// If using as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    copyToClipboard,
    pasteFromClipboard,
    showNotification,
    HistoryManager,
    downloadFile,
    downloadDataUrl,
    KeyboardShortcuts,
    keyboardShortcuts,
    updateButtonState,
    showLoading,
    hideLoading,
    debounce,
    throttle,
    isValidEmail,
    isValidUrl,
    sanitizeHTML,
    savePreference,
    loadPreference,
    clearPreference,
    formatFileSize,
    formatDate,
    formatNumber
  };
}
