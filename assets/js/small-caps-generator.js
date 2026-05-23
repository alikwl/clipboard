// Small Caps Generator
(function() {
  const inputEl = document.getElementById('smallCapsInput');
  const outputEl = document.getElementById('smallCapsOutput');
  const autoEl = document.getElementById('autoUpdate');
  const preserveEl = document.getElementById('preserveUnsupported');
  const convertBtn = document.getElementById('convertBtn');
  const copyBtn = document.getElementById('copyOutputBtn');
  const clearBtn = document.getElementById('clearBtn');
  const statusEl = document.getElementById('smallCapsStatus');
  const exampleBtns = document.querySelectorAll('.example-btn');
  const titleCaseEl = document.getElementById('titleCaseBefore');
  const lowerCaseEl = document.getElementById('lowerCaseBefore');

  // Unicode small capital mappings (best-available approximations)
  const MAP = {
    'a': '\u1D00', // ᴀ
    'b': '\u0299', // ʙ
    'c': '\u1D04', // ᴄ
    'd': '\u1D05', // ᴅ
    'e': '\u1D07', // ᴇ
    'f': '\uA730', // ꜰ
    'g': '\u0262', // ɢ
    'h': '\u029C', // ʜ
    'i': '\u026A', // ɪ
    'j': '\u1D0A', // ᴊ
    'k': '\u1D0B', // ᴋ
    'l': '\u029F', // ʟ
    'm': '\u1D0D', // ᴍ
    'n': '\u0274', // ɴ
    'o': '\u1D0F', // ᴏ
    'p': '\u1D18', // ᴘ
    'q': '\u01EB', // ǫ (approx)
    'r': '\u0280', // ʀ
    's': 's',       // no standard small capital
    't': '\u1D1B', // ᴛ
    'u': '\u1D1C', // ᴜ
    'v': '\u1D20', // ᴠ
    'w': '\u1D21', // ᴡ
    'x': 'x',       // no standard small capital
    'y': '\u028F', // ʏ
    'z': '\u1D22'  // ᴢ
  };

  function toSmallCaps(text, preserveUnsupported = true) {
    let out = '';
    for (const ch of text) {
      const lower = ch.toLowerCase();
      if (MAP.hasOwnProperty(lower)) {
        const mapped = MAP[lower];
        out += mapped || (preserveUnsupported ? ch : '');
      } else {
        out += ch; // preserve all non-letter characters
      }
    }
    return out;
  }

  function toTitleCase(text) {
    return text.replace(/\w[^\s-]*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }

  function updateOutput() {
    const preserve = !!preserveEl?.checked;
    let input = inputEl?.value || '';
    if (titleCaseEl?.checked) {
      input = toTitleCase(input);
    } else if (lowerCaseEl?.checked) {
      input = input.toLowerCase();
    }
    const converted = toSmallCaps(input, preserve);
    if (outputEl) outputEl.value = converted;
  }

  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.add('show');
    setTimeout(() => statusEl.classList.remove('show'), 2000);
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(outputEl?.value || '');
      setStatus('Copied small caps text!');
    } catch (e) {
      setStatus('Copy failed. Select the text and copy manually.');
    }
  }

  // Events
  if (autoEl) {
    autoEl.addEventListener('change', () => {
      if (autoEl.checked) {
        inputEl?.addEventListener('input', updateOutput);
      } else {
        inputEl?.removeEventListener('input', updateOutput);
      }
    });
  }

  if (inputEl && autoEl?.checked) inputEl.addEventListener('input', updateOutput);
  if (preserveEl) preserveEl.addEventListener('change', updateOutput);
  if (titleCaseEl) titleCaseEl.addEventListener('change', updateOutput);
  if (lowerCaseEl) lowerCaseEl.addEventListener('change', updateOutput);

  // Make Title Case and Lowercase mutually exclusive for clarity
  if (titleCaseEl) titleCaseEl.addEventListener('change', () => {
    if (titleCaseEl.checked && lowerCaseEl) lowerCaseEl.checked = false;
    updateOutput();
  });
  if (lowerCaseEl) lowerCaseEl.addEventListener('change', () => {
    if (lowerCaseEl.checked && titleCaseEl) titleCaseEl.checked = false;
    updateOutput();
  });
  if (convertBtn) convertBtn.addEventListener('click', updateOutput);
  if (copyBtn) copyBtn.addEventListener('click', copyOutput);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (inputEl) inputEl.value = '';
    updateOutput();
  });

  if (exampleBtns) {
    exampleBtns.forEach(btn => btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text') || '';
      if (inputEl) inputEl.value = text;
      updateOutput();
    }));
  }

  // Initial render
  updateOutput();
})();