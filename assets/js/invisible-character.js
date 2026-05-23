// Invisible Character Tool
(function() {
  const statusEl = document.getElementById('copyStatus');
  const variantEl = document.getElementById('charVariant');
  const copyBtn = document.getElementById('copyCharBtn');
  const copyMultiBtn = document.getElementById('copyMultiBtn');
  const sampleArea = document.getElementById('sampleArea');
  const insertOnceBtn = document.getElementById('insertOnceBtn');
  const insertLineBreakBtn = document.getElementById('insertLineBreakBtn');
  const clearSampleBtn = document.getElementById('clearSampleBtn');
  const copyBlankLineBtn = document.getElementById('copyBlankLineBtn');
  const copyCaptionBtn = document.getElementById('copyCaptionBtn');

  const CHAR_MAP = {
    zwsp: '\u200B',         // Zero Width Space
    invisSep: '\u2063',     // Invisible Separator
    hangulFiller: '\u3164', // Hangul Filler
    brailleBlank: '\u2800', // Braille blank
    zwnj: '\u200C'          // Zero Width Non-Joiner
  };

  function getChar() {
    const key = (variantEl && variantEl.value) || 'zwsp';
    return CHAR_MAP[key] || CHAR_MAP.zwsp;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      if (statusEl) {
        statusEl.textContent = 'Copied! Paste into Instagram to create a blank.';
      }
    } catch (e) {
      if (statusEl) {
        statusEl.textContent = 'Copy failed. Try manually: select and copy.';
      }
    }
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => copyText(getChar()));
  }

  if (copyMultiBtn) {
    copyMultiBtn.addEventListener('click', () => copyText(getChar().repeat(5)));
  }

  if (insertOnceBtn) {
    insertOnceBtn.addEventListener('click', () => {
      if (!sampleArea) return;
      const ch = getChar();
      insertIntoTextarea(sampleArea, ch);
    });
  }

  if (insertLineBreakBtn) {
    insertLineBreakBtn.addEventListener('click', () => {
      if (!sampleArea) return;
      const ch = getChar();
      insertIntoTextarea(sampleArea, `\n${ch}\n`);
    });
  }

  if (clearSampleBtn) {
    clearSampleBtn.addEventListener('click', () => {
      if (sampleArea) sampleArea.value = '';
    });
  }

  if (copyBlankLineBtn) {
    copyBlankLineBtn.addEventListener('click', () => {
      const ch = getChar();
      copyText(`\n${ch}\n`);
    });
  }

  if (copyCaptionBtn) {
    copyCaptionBtn.addEventListener('click', () => {
      const ch = getChar();
      const caption = `New drop is live! 🔥` + `\n${ch}\n` + `Tap link in bio for details.`;
      copyText(caption);
    });
  }

  function insertIntoTextarea(textarea, insertText) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    textarea.value = before + insertText + after;
    const newPos = start + insertText.length;
    textarea.setSelectionRange(newPos, newPos);
    textarea.focus();
  }
})();