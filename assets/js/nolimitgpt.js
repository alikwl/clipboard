/**
 * NoLimitGPT client controller
 * FreeClipboard.com
 *
 * Handles query input, character counting, loading states,
 * fetch request to n8n webhook, markdown formatting, and copy action.
 */

document.addEventListener('DOMContentLoaded', function () {
  const promptInput = document.getElementById('promptInput');
  const charCount   = document.getElementById('charCount');
  const clearBtn    = document.getElementById('clearBtn');
  const generateBtn = document.getElementById('generateBtn');
  const outputContainer = document.getElementById('output-container');
  const responseOutput  = document.getElementById('responseOutput');
  const copyBtn     = document.getElementById('copyBtn');

  if (!promptInput || !generateBtn) return;

  // Track raw response text to facilitate clean markdown/text copies
  let lastResponseText = '';

  // 1. Textarea Character Count
  promptInput.addEventListener('input', function () {
    const len = promptInput.value.length;
    charCount.textContent = `${len.toLocaleString()} character${len === 1 ? '' : 's'}`;
  });

  // 2. Clear Button Action
  clearBtn.addEventListener('click', function () {
    promptInput.value = '';
    charCount.textContent = '0 characters';
    promptInput.focus();
  });

  // 3. Render Helper (Supports marked.js or falls back to escaped HTML with line breaks)
  function formatOutput(text) {
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
      try {
        return marked.parse(text);
      } catch (err) {
        console.error('Marked markdown compiler error:', err);
      }
    }
    // Safe text fallback
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }

  // 4. Submit Query to n8n Webhook
  generateBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const queryText = promptInput.value.trim();

    if (!queryText) {
      alert('Please enter a query or prompt first!');
      promptInput.focus();
      return;
    }

    // A. Visual Shimmer Loading State
    generateBtn.disabled = true;
    const btnSpan = generateBtn.querySelector('span') || generateBtn;
    const originalBtnHTML = btnSpan.innerHTML;
    btnSpan.innerHTML = 'Thinking without boundaries... 🧠';

    responseOutput.innerHTML = `
      <div class="loading-shimmer-box">
        <div class="shimmer-line header"></div>
        <div class="shimmer-line paragraph-1"></div>
        <div class="shimmer-line paragraph-2"></div>
        <div class="shimmer-line paragraph-3"></div>
        <div class="shimmer-line paragraph-4"></div>
      </div>
    `;
    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Webhook Target Endpoint
    const WEBHOOK_URL = 'https://n8ninstance.btech.cfd/webhook/nolimitgpt-without-boundaries';

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: queryText })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        try {
          responseData = JSON.parse(text);
        } catch (jsonErr) {
          responseData = text; // Fallback to raw string
        }
      }

      // Extract text content from n8n response object structure
      let outputText = '';
      const dataObj = Array.isArray(responseData) ? responseData[0] : responseData;

      if (dataObj) {
        if (typeof dataObj === 'string') {
          outputText = dataObj;
        } else {
          // Check common AI payload wrapping structures
          if (dataObj.response && typeof dataObj.response === 'object') {
            outputText = dataObj.response.text || dataObj.response.output || JSON.stringify(dataObj.response);
          } else {
            outputText = dataObj.output || dataObj.text || dataObj.content || dataObj.response || dataObj.message || JSON.stringify(dataObj);
          }
        }
      }

      // Clean double wrap if returned as stringified json within string
      if (outputText && typeof outputText === 'string' && (outputText.trim().startsWith('{') || outputText.trim().startsWith('['))) {
        try {
          const parsed = JSON.parse(outputText.trim());
          if (parsed && typeof parsed === 'object') {
            outputText = parsed.output || parsed.text || parsed.content || parsed.response || parsed.message || outputText;
          }
        } catch (e) {
          // Keep original
        }
      }

      if (!outputText) {
        outputText = 'Error: The server returned an empty or unparseable response.';
      }

      // Cache clean text for clipboard copy
      lastResponseText = outputText;

      // Render Markdown output
      responseOutput.innerHTML = formatOutput(outputText);

    } catch (error) {
      console.error('Webhook error details:', error);
      
      responseOutput.innerHTML = `
        <div class="error-msg-box" style="padding: 1.25rem; color: #b91c1c; border: 1px solid #fee2e2; background: #fef2f2; border-radius: 0.75rem; text-align: left; margin: 0.5rem 0;">
          <p style="font-weight: 700; margin-top: 0; margin-bottom: 0.35rem;">⚠️ AI Generation Failed</p>
          <p style="font-size: 0.925rem; color: #7f1d1d; line-height: 1.5; margin: 0 0 0.5rem 0;">Could not establish a connection to the NoLimitGPT backend. This might occur due to server maintenance or local CORS blocking.</p>
          <p style="font-size: 0.8rem; color: #b91c1c; font-family: monospace; margin: 0; background: rgba(0,0,0,0.03); padding: 0.4rem 0.6rem; border-radius: 0.35rem;">Error: ${error.message}</p>
        </div>
      `;
      lastResponseText = '';
    } finally {
      // B. Restore CTA Button State
      generateBtn.disabled = false;
      btnSpan.innerHTML = originalBtnHTML;
    }
  });

  // 5. Copy Response Output to Clipboard
  copyBtn.addEventListener('click', function () {
    const textToCopy = lastResponseText || responseOutput.innerText || responseOutput.textContent;
    
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(function () {
      const originalBtnText = copyBtn.innerHTML;
      copyBtn.innerHTML = 'Copied! ✅';
      copyBtn.style.background = '#8b5cf6';
      copyBtn.style.color = '#ffffff';

      setTimeout(function () {
        copyBtn.innerHTML = originalBtnText;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2000);
    }).catch(function (err) {
      console.error('Fallback clipboard copy active. Error:', err);
      // Older browsers fallback
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        const originalBtnText = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Copied! ✅';
        setTimeout(() => { copyBtn.innerHTML = originalBtnText; }, 2000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(ta);
    });
  });
});
