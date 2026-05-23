(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const userAgentEl = $('#userAgent');
  const sitemapUrlEl = $('#sitemapUrl');
  const crawlDelayEl = $('#crawlDelay');
  const robotsOutputEl = $('#robotsOutput');
  const statusEl = $('#robotsStatus');

  const presetAllowAllBtn = $('#presetAllowAll');
  const presetDisallowAllBtn = $('#presetDisallowAll');
  const presetBlockDirsBtn = $('#presetBlockDirs');

  const addDisallowBtn = $('#addDisallow');
  const customDisallowEl = $('#customDisallow');
  const addAllowBtn = $('#addAllow');
  const customAllowEl = $('#customAllow');

  const generateBtn = $('#generateRobotsBtn');
  const copyBtn = $('#copyRobotsBtn');
  const downloadBtn = $('#downloadRobotsBtn');
  const clearBtn = $('#clearRobotsBtn');

  const getCheckedValues = (selector) => $$(`${selector}:checked`).map((el) => el.value.trim()).filter(Boolean);

  function buildRobots() {
    const lines = [];
    const ua = (userAgentEl.value || '*').trim();
    lines.push(`User-agent: ${ua}`);

    const disallow = [...new Set(getCheckedValues('.disallow').concat(parseCustomList(customDisallowEl.dataset.values)))];
    const allow = [...new Set(getCheckedValues('.allow').concat(parseCustomList(customAllowEl.dataset.values)))];

    for (const path of allow) {
      lines.push(`Allow: ${path}`);
    }
    for (const path of disallow) {
      lines.push(`Disallow: ${path}`);
    }

    const delay = (crawlDelayEl.value || '').trim();
    if (delay) lines.push(`Crawl-delay: ${delay}`);

    const sitemap = (sitemapUrlEl.value || '').trim();
    if (sitemap) lines.push(`Sitemap: ${sitemap}`);

    return lines.join('\n');
  }

  function parseCustomList(value) {
    if (!value) return [];
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function addToCustomList(el, path) {
    const trimmed = (path || '').trim();
    if (!trimmed) return;
    const current = parseCustomList(el.dataset.values);
    if (!current.includes(trimmed)) current.push(trimmed);
    el.dataset.values = JSON.stringify(current);
    toast(`Added: ${trimmed}`);
    updateOutput();
  }

  function clearCustomLists() {
    customDisallowEl.dataset.values = JSON.stringify([]);
    customAllowEl.dataset.values = JSON.stringify([]);
  }

  function updateOutput() {
    const content = buildRobots();
    robotsOutputEl.value = content;
    statusEl.textContent = `Lines: ${content ? content.split('\n').length : 0}`;
  }

  function applyPreset(type) {
    // Uncheck all
    $$('.disallow').forEach((c) => (c.checked = false));
    $$('.allow').forEach((c) => (c.checked = false));
    clearCustomLists();

    if (type === 'allow') {
      // Allow everything: Disallow nothing
    } else if (type === 'disallow') {
      addToCustomList(customDisallowEl, '/');
    } else if (type === 'blockdirs') {
      ['/_next/', '/admin/', '/login/', '/cart/', '/cgi-bin/'].forEach((p) => addToCustomList(customDisallowEl, p));
      ['/assets/', '/images/', '/css/', '/js/'].forEach((p) => addToCustomList(customAllowEl, p));
    }
    updateOutput();
  }

  function toast(msg) {
    statusEl.textContent = msg;
    setTimeout(() => updateOutput(), 800);
  }

  function copyOutput() {
    const text = robotsOutputEl.value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard')).catch(() => toast('Copy failed'));
  }

  function downloadRobots() {
    const content = robotsOutputEl.value || buildRobots();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }

  function clearAll() {
    userAgentEl.value = '*';
    sitemapUrlEl.value = '';
    crawlDelayEl.value = '';
    $$('.disallow').forEach((c) => (c.checked = false));
    $$('.allow').forEach((c) => (c.checked = false));
    clearCustomLists();
    robotsOutputEl.value = '';
    statusEl.textContent = '';
  }

  // Init dataset holders
  customDisallowEl.dataset.values = JSON.stringify([]);
  customAllowEl.dataset.values = JSON.stringify([]);

  // Event bindings
  [userAgentEl, sitemapUrlEl, crawlDelayEl].forEach((el) => el.addEventListener('input', updateOutput));
  $$('.disallow').forEach((el) => el.addEventListener('change', updateOutput));
  $$('.allow').forEach((el) => el.addEventListener('change', updateOutput));
  addDisallowBtn.addEventListener('click', () => addToCustomList(customDisallowEl, customDisallowEl.value));
  addAllowBtn.addEventListener('click', () => addToCustomList(customAllowEl, customAllowEl.value));

  presetAllowAllBtn.addEventListener('click', () => applyPreset('allow'));
  presetDisallowAllBtn.addEventListener('click', () => applyPreset('disallow'));
  presetBlockDirsBtn.addEventListener('click', () => applyPreset('blockdirs'));

  generateBtn.addEventListener('click', updateOutput);
  copyBtn.addEventListener('click', copyOutput);
  downloadBtn.addEventListener('click', downloadRobots);
  clearBtn.addEventListener('click', clearAll);

  // Example buttons in aside
  $$('.example-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      applyPreset(preset);
    });
  });

  // Initial render
  updateOutput();
})();