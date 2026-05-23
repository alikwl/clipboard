/**
 * Text Formatter - Enhanced Version
 * Comprehensive text transformation tool with 25+ operations
 */

// DOM Elements
const textInput = document.getElementById('textInput');
const outputText = document.getElementById('outputText');
const findTextInput = document.getElementById('findText');
const replaceTextInput = document.getElementById('replaceText');
const caseSensitiveCheckbox = document.getElementById('caseSensitive');
const useRegexCheckbox = document.getElementById('useRegex');
const wholeWordCheckbox = document.getElementById('wholeWord');

// History Manager
const historyManager = new HistoryManager('text-formatter-history', 10);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  loadHistory();
  setupKeyboardShortcuts();
});

/**
 * Apply text formatting operation
 */
function applyFormat(type) {
  const text = textInput.value;
  
  if (!text) {
    showNotification('Please enter some text first', 'warning');
    return;
  }
  
  let result = '';
  
  try {
    switch(type) {
      // Case Transformations
      case 'uppercase':
        result = text.toUpperCase();
        break;
      case 'lowercase':
        result = text.toLowerCase();
        break;
      case 'titlecase':
        result = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'sentencecase':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camelcase':
        result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case 'pascalcase':
        result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()).replace(/\s+/g, '');
        break;
      case 'snakecase':
        result = text.trim().replace(/\s+/g, '_').toLowerCase();
        break;
      case 'kebabcase':
        result = text.trim().replace(/\s+/g, '-').toLowerCase();
        break;
        
      // Text Operations
      case 'trim':
        result = text.split('\n').map(line => line.trim()).join('\n');
        break;
      case 'removespaces':
        result = text.replace(/\s/g, '');
        break;
      case 'removelinebreaks':
        result = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
        break;
      case 'removeduplicate':
        const lines = text.split('\n');
        result = [...new Set(lines)].join('\n');
        break;
      case 'removeempty':
        result = text.split('\n').filter(line => line.trim() !== '').join('\n');
        break;
      case 'reverse':
        result = text.split('').reverse().join('');
        break;
      case 'reverselines':
        result = text.split('\n').reverse().join('\n');
        break;
      case 'sortasc':
        result = text.split('\n').sort().join('\n');
        break;
      case 'sortdesc':
        result = text.split('\n').sort().reverse().join('\n');
        break;
      case 'shuffle':
        const shuffled = text.split('\n');
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        result = shuffled.join('\n');
        break;
      case 'numberedlist':
        result = text.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        break;
      case 'bulletlist':
        result = text.split('\n').map(line => `• ${line}`).join('\n');
        break;
        
      // Advanced Operations
      case 'extractemails':
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = text.match(emailRegex);
        result = emails ? emails.join('\n') : 'No email addresses found';
        break;
      case 'extracturls':
        const urlRegex = /https?:\/\/[^\s]+/g;
        const urls = text.match(urlRegex);
        result = urls ? urls.join('\n') : 'No URLs found';
        break;
      case 'extractnumbers':
        const numberRegex = /\d+\.?\d*/g;
        const numbers = text.match(numberRegex);
        result = numbers ? numbers.join('\n') : 'No numbers found';
        break;
      case 'removehtml':
        result = text.replace(/<[^>]*>/g, '');
        break;
      case 'addprefix':
        const prefix = prompt('Enter prefix to add:');
        if (prefix !== null) {
          result = text.split('\n').map(line => prefix + line).join('\n');
        } else {
          return;
        }
        break;
      case 'addsuffix':
        const suffix = prompt('Enter suffix to add:');
        if (suffix !== null) {
          result = text.split('\n').map(line => line + suffix).join('\n');
        } else {
          return;
        }
        break;
      case 'wraplines':
        const width = prompt('Enter line width (characters):', '80');
        if (width !== null) {
          result = wrapText(text, parseInt(width) || 80);
        } else {
          return;
        }
        break;
      case 'base64encode':
        result = btoa(text);
        break;
      case 'base64decode':
        try {
          result = atob(text);
        } catch (e) {
          showNotification('Invalid Base64 string', 'error');
          return;
        }
        break;
        
      default:
        result = text;
    }
    
    outputText.value = result;
    
    // Add to history
    addToHistory(type, text, result);
    
    showNotification('Transformation applied successfully', 'success');
    
  } catch (error) {
    console.error('Error applying format:', error);
    showNotification('Error applying transformation', 'error');
  }
}

/**
 * Wrap text at specified width
 */
function wrapText(text, width) {
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length > width) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  
  if (currentLine) lines.push(currentLine.trim());
  
  return lines.join('\n');
}

/**
 * Find and replace text
 */
function findAndReplace() {
  const text = textInput.value;
  const findText = findTextInput.value;
  const replaceText = replaceTextInput.value;
  
  if (!text) {
    showNotification('Please enter some text first', 'warning');
    return;
  }
  
  if (!findText) {
    showNotification('Please enter text to find', 'warning');
    return;
  }
  
  try {
    let result;
    
    if (useRegexCheckbox.checked) {
      // Use regex
      const flags = caseSensitiveCheckbox.checked ? 'g' : 'gi';
      const regex = new RegExp(findText, flags);
      result = text.replace(regex, replaceText);
    } else {
      // Simple text replacement
      if (wholeWordCheckbox.checked) {
        const regex = new RegExp(`\\b${escapeRegex(findText)}\\b`, caseSensitiveCheckbox.checked ? 'g' : 'gi');
        result = text.replace(regex, replaceText);
      } else {
        if (caseSensitiveCheckbox.checked) {
          result = text.split(findText).join(replaceText);
        } else {
          const regex = new RegExp(escapeRegex(findText), 'gi');
          result = text.replace(regex, replaceText);
        }
      }
    }
    
    outputText.value = result;
    
    // Count replacements
    const count = (text.match(new RegExp(escapeRegex(findText), 'gi')) || []).length;
    showNotification(`Replaced ${count} occurrence(s)`, 'success');
    
    // Add to history
    addToHistory('find-replace', text, result);
    
  } catch (error) {
    console.error('Error in find and replace:', error);
    showNotification('Invalid regex pattern', 'error');
  }
}

/**
 * Highlight matches in text
 */
function highlightMatches() {
  const text = textInput.value;
  const findText = findTextInput.value;
  
  if (!text || !findText) {
    showNotification('Please enter text and search term', 'warning');
    return;
  }
  
  try {
    const regex = new RegExp(escapeRegex(findText), 'gi');
    const matches = text.match(regex);
    
    if (matches) {
      showNotification(`Found ${matches.length} match(es)`, 'info');
    } else {
      showNotification('No matches found', 'info');
    }
  } catch (error) {
    showNotification('Invalid search pattern', 'error');
  }
}

/**
 * Escape regex special characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Update text statistics
 */
function updateStats() {
  const text = textInput.value;
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  
  document.getElementById('charCount').textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
  document.getElementById('wordCount').textContent = `${words} word${words !== 1 ? 's' : ''}`;
  document.getElementById('lineCount').textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
}

/**
 * Clear input text
 */
function clearText() {
  textInput.value = '';
  outputText.value = '';
  updateStats();
  showNotification('Text cleared', 'info');
}

/**
 * Paste text from clipboard
 */
async function pasteText() {
  try {
    const text = await pasteFromClipboard();
    if (text) {
      textInput.value = text;
      updateStats();
    }
  } catch (error) {
    showNotification('Failed to paste from clipboard', 'error');
  }
}

/**
 * Copy output to clipboard
 */
async function copyOutput() {
  const text = outputText.value;
  
  if (!text) {
    showNotification('No output to copy', 'warning');
    return;
  }
  
  await copyToClipboard(text);
}

/**
 * Download output as text file
 */
function downloadOutput() {
  const text = outputText.value;
  
  if (!text) {
    showNotification('No output to download', 'warning');
    return;
  }
  
  const filename = `formatted-text-${Date.now()}.txt`;
  downloadFile(text, filename, 'text/plain');
}

/**
 * Use output as input
 */
function useAsInput() {
  const text = outputText.value;
  
  if (!text) {
    showNotification('No output to use', 'warning');
    return;
  }
  
  textInput.value = text;
  outputText.value = '';
  updateStats();
  showNotification('Output moved to input', 'success');
}

/**
 * Toggle collapsible sections
 */
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  const header = section.previousElementSibling;
  const icon = header.querySelector('.toggle-icon');
  
  section.classList.toggle('collapsed');
  icon.textContent = section.classList.contains('collapsed') ? '▶' : '▼';
}

/**
 * Add operation to history
 */
function addToHistory(operation, input, output) {
  const historyItem = {
    operation: operation,
    input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
    output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
    fullOutput: output,
    timestamp: new Date().toISOString()
  };
  
  historyManager.add(historyItem);
  loadHistory();
}

/**
 * Load and display history
 */
function loadHistory() {
  const historyList = document.getElementById('historyList');
  const history = historyManager.getAll();
  
  if (history.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No history yet. Start formatting text!</p>';
    return;
  }
  
  historyList.innerHTML = history.map((item, index) => `
    <div class="history-item">
      <div class="history-item-header">
        <strong>${formatOperationName(item.operation)}</strong>
        <span class="history-item-time">${formatDate(item.timestamp, 'time')}</span>
      </div>
      <div class="history-item-preview">${item.output}</div>
      <div class="history-item-actions">
        <button class="btn-sm btn-outline" onclick="useHistoryItem(${index})">Use</button>
        <button class="btn-sm btn-outline" onclick="deleteHistoryItem(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

/**
 * Use history item
 */
function useHistoryItem(index) {
  const item = historyManager.get(index);
  if (item) {
    outputText.value = item.fullOutput;
    showNotification('History item loaded', 'success');
  }
}

/**
 * Delete history item
 */
function deleteHistoryItem(index) {
  historyManager.remove(index);
  loadHistory();
  showNotification('History item deleted', 'info');
}

/**
 * Clear all history
 */
function clearHistory() {
  if (confirm('Are you sure you want to clear all history?')) {
    historyManager.clear();
    loadHistory();
    showNotification('History cleared', 'info');
  }
}

/**
 * Format operation name for display
 */
function formatOperationName(operation) {
  const names = {
    'uppercase': 'UPPERCASE',
    'lowercase': 'lowercase',
    'titlecase': 'Title Case',
    'sentencecase': 'Sentence case',
    'camelcase': 'camelCase',
    'pascalcase': 'PascalCase',
    'snakecase': 'snake_case',
    'kebabcase': 'kebab-case',
    'trim': 'Trim Spaces',
    'removespaces': 'Remove Spaces',
    'removelinebreaks': 'Remove Line Breaks',
    'removeduplicate': 'Remove Duplicates',
    'removeempty': 'Remove Empty Lines',
    'reverse': 'Reverse Text',
    'reverselines': 'Reverse Lines',
    'sortasc': 'Sort A-Z',
    'sortdesc': 'Sort Z-A',
    'shuffle': 'Shuffle Lines',
    'numberedlist': 'Numbered List',
    'bulletlist': 'Bullet List',
    'extractemails': 'Extract Emails',
    'extracturls': 'Extract URLs',
    'extractnumbers': 'Extract Numbers',
    'removehtml': 'Remove HTML',
    'addprefix': 'Add Prefix',
    'addsuffix': 'Add Suffix',
    'wraplines': 'Wrap Lines',
    'base64encode': 'Base64 Encode',
    'base64decode': 'Base64 Decode',
    'find-replace': 'Find & Replace'
  };
  
  return names[operation] || operation;
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  // Ctrl+Enter to apply first transformation
  keyboardShortcuts.register('ctrl+enter', () => {
    applyFormat('uppercase');
    return true;
  });
  
  // Ctrl+Shift+C to copy output
  keyboardShortcuts.register('ctrl+shift+c', () => {
    copyOutput();
    return true;
  });
  
  // Ctrl+Shift+D to download
  keyboardShortcuts.register('ctrl+shift+d', () => {
    downloadOutput();
    return true;
  });
}
