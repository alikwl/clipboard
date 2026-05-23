// Discord Spoiler Text Generator
(function() {
  const inputEl = document.getElementById('discordInput');
  const outputEl = document.getElementById('discordOutput');
  const autoEl = document.getElementById('autoUpdate');
  const convertBtn = document.getElementById('convertBtn');
  const unspoilerBtn = document.getElementById('unspoilerBtn');
  const copyBtn = document.getElementById('copyOutputBtn');
  const clearBtn = document.getElementByById ? document.getElementById('clearBtn') : null;
  const statusEl = document.getElementById('discordStatus');
  const exampleBtns = document.querySelectorAll('.example-btn');
  const spoilNumbersEl = document.getElementById('spoilNumbers');

  // Mode radios
  const modeRadios = document.querySelectorAll('input[name="spoilerMode"]');

  // Formatting toggles
  const fmtBold = document.getElementById('fmtBold');
  const fmtItalic = document.getElementById('fmtItalic');
  const fmtUnderline = document.getElementById('fmtUnderline');
  const fmtStrike = document.getElementById('fmtStrike');
  const fmtCode = document.getElementById('fmtCode');

  function getMode() {
    let mode = 'entire';
    modeRadios.forEach(r => { if (r.checked) mode = r.value; });
    return mode;
  }

  function spoilerWrap(text) { return `||${text}||`; }

  function applyFormatting(text) {
    let out = text;
    if (fmtCode?.checked) out = '`' + out + '`';
    if (fmtBold?.checked) out = '**' + out + '**';
    if (fmtItalic?.checked) out = '*' + out + '*';
    if (fmtUnderline?.checked) out = '__' + out + '__';
    if (fmtStrike?.checked) out = '~~' + out + '~~';
    return out;
  }

  const reUrl = /https?:\/\/\S+/gi;
  const reMention = /(^|\s)@([\w_]+)/g;
  const reNumber = /\b\d+(?:[.,]\d+)?\b/g;

  function convert(text, mode) {
    if (!text) return '';
    let out = text;
    switch (mode) {
      case 'entire':
        out = spoilerWrap(out);
        break;
      case 'per_word':
        out = out.replace(/(\S+)/g, (m) => spoilerWrap(m));
        break;
      case 'smart':
        out = out
          .replace(reUrl, (m) => spoilerWrap(m))
          .replace(reMention, (full, pre, user) => `${pre}${spoilerWrap('@' + user)}`);
        if (spoilNumbersEl?.checked) {
          out = out.replace(reNumber, (m) => spoilerWrap(m));
        }
        break;
    }
    out = applyFormatting(out);
    return out;
  }

  function removeSpoilers(text) {
    return (text || '').replace(/\|\|(.+?)\|\|/g, '$1');
  }

  function updateOutput() {
    const input = inputEl?.value || '';
    const mode = getMode();
    const converted = convert(input, mode);
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
      setStatus('Copied spoiler text!');
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
  modeRadios.forEach(r => r.addEventListener('change', updateOutput));
  spoilNumbersEl?.addEventListener('change', updateOutput);
  [fmtBold, fmtItalic, fmtUnderline, fmtStrike, fmtCode].forEach(el => el?.addEventListener('change', updateOutput));

  if (convertBtn) convertBtn.addEventListener('click', updateOutput);
  if (unspoilerBtn) unspoilerBtn.addEventListener('click', () => {
    if (outputEl) outputEl.value = removeSpoilers(outputEl.value);
    setStatus('Removed spoilers from output.');
  });
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