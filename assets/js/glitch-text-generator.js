// Glitch (Zalgo) Text Generator
(function() {
  const inputEl = document.getElementById('glitchInput');
  const outputEl = document.getElementById('glitchOutput');
  const intensityEl = document.getElementById('glitchIntensity');
  const dirUpEl = document.getElementById('dirUp');
  const dirMidEl = document.getElementById('dirMid');
  const dirDownEl = document.getElementById('dirDown');
  const aggressionEl = document.getElementById('glitchAggression');
  const preserveSpacesEl = document.getElementById('preserveSpaces');
  const glitchNowBtn = document.getElementById('glitchNowBtn');
  const copyGlitchBtn = document.getElementById('copyGlitchBtn');
  const clearGlitchBtn = document.getElementById('clearGlitchBtn');
  const statusEl = document.getElementById('glitchStatus');
  const exampleBtns = document.querySelectorAll('.example-btn');
  const randomizeToggle = document.getElementById('randomizeToggle');
  let randomizeTimer = null;

  const UP = ['\u0300','\u0301','\u0302','\u0303','\u0304','\u0305','\u0306','\u0307','\u0308','\u0309','\u030A','\u030B','\u030C','\u030D','\u030E','\u030F','\u0310','\u0311','\u0312','\u0313','\u0314','\u031A'];
  const MID = ['\u0334','\u0335','\u0336','\u0337','\u0338','\u0339','\u033F','\u0346','\u0347','\u0348'];
  const DOWN = ['\u0316','\u0317','\u0318','\u0319','\u031C','\u031D','\u031E','\u031F','\u0320','\u0323','\u0324','\u0325','\u0326','\u0327','\u0328','\u0329','\u032A','\u032B','\u032C','\u032D','\u032E','\u032F','\u0330','\u0331'];

  function randFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getOptions() {
    const level = parseInt(intensityEl?.value || '4', 10);
    const aggression = (aggressionEl?.value || 'balanced');
    const dirs = {
      up: !!dirUpEl?.checked,
      mid: !!dirMidEl?.checked,
      down: !!dirDownEl?.checked
    };
    const preserveSpaces = !!preserveSpacesEl?.checked;
    return { level, aggression, dirs, preserveSpaces };
  }

  function marksCount(level, aggression) {
    // Base counts per direction
    let base = Math.max(0, level);
    switch (aggression) {
      case 'minimal':
        return Math.floor(base * 0.6);
      case 'wild':
        return Math.floor(base * 1.4) + 1;
      default:
        return base; // balanced
    }
  }

  function zalgoChar(ch, opts) {
    if (opts.preserveSpaces && (ch === ' ' || ch === '\n' || ch === '\t')) return ch;
    // Skip combining marks themselves
    if (ch <= '\u036F' && ch >= '\u0300') return ch;

    let out = ch;
    const count = marksCount(opts.level, opts.aggression);

    function addMarks(arr, times) {
      for (let i = 0; i < times; i++) out += randFrom(arr);
    }

    const split = Math.max(1, Math.floor(count / 3));
    if (opts.dirs.up) addMarks(UP, split + Math.floor(Math.random() * (count - split + 1)));
    if (opts.dirs.mid) addMarks(MID, Math.floor(count / 3));
    if (opts.dirs.down) addMarks(DOWN, split);
    return out;
  }

  function zalgo(text, opts) {
    let out = '';
    for (const ch of text) {
      out += zalgoChar(ch, opts);
    }
    return out;
  }

  function updateOutput() {
    const opts = getOptions();
    const input = inputEl?.value || '';
    const glitched = zalgo(input, opts);
    if (outputEl) outputEl.value = glitched;
  }

  function startRandomize() {
    stopRandomize();
    randomizeTimer = setInterval(() => {
      // Randomize intensity and directions, keep aggression setting
      if (intensityEl) intensityEl.value = String(Math.floor(Math.random() * 11));
      if (dirUpEl) dirUpEl.checked = Math.random() > 0.3;
      if (dirMidEl) dirMidEl.checked = Math.random() > 0.4;
      if (dirDownEl) dirDownEl.checked = Math.random() > 0.3;
      updateOutput();
    }, 1500);
  }

  function stopRandomize() {
    if (randomizeTimer) {
      clearInterval(randomizeTimer);
      randomizeTimer = null;
    }
  }

  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.add('show');
    setTimeout(() => statusEl.classList.remove('show'), 2500);
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(outputEl?.value || '');
      setStatus('Copied glitched text!');
    } catch (e) {
      setStatus('Copy failed. You can select and copy manually.');
    }
  }

  // Event bindings
  if (inputEl) inputEl.addEventListener('input', updateOutput);
  if (intensityEl) intensityEl.addEventListener('input', updateOutput);
  if (dirUpEl) dirUpEl.addEventListener('change', updateOutput);
  if (dirMidEl) dirMidEl.addEventListener('change', updateOutput);
  if (dirDownEl) dirDownEl.addEventListener('change', updateOutput);
  if (aggressionEl) aggressionEl.addEventListener('change', updateOutput);
  if (preserveSpacesEl) preserveSpacesEl.addEventListener('change', updateOutput);
  if (glitchNowBtn) glitchNowBtn.addEventListener('click', updateOutput);
  if (copyGlitchBtn) copyGlitchBtn.addEventListener('click', copyOutput);
  if (clearGlitchBtn) clearGlitchBtn.addEventListener('click', () => {
    if (inputEl) inputEl.value = '';
    updateOutput();
  });

  if (randomizeToggle) {
    randomizeToggle.addEventListener('change', () => {
      if (randomizeToggle.checked) {
        startRandomize();
        setStatus('Randomize on');
      } else {
        stopRandomize();
        setStatus('Randomize off');
      }
    });
  }

  if (exampleBtns) {
    exampleBtns.forEach(btn => btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text') || '';
      if (inputEl) inputEl.value = text;
      updateOutput();
    }));
  }

  // Initial preview
  updateOutput();
})();