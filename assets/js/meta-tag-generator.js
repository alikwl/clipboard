(() => {
  const $ = (sel) => document.querySelector(sel);

  const titleEl = $('#siteTitle');
  const descEl = $('#siteDescription');
  const siteUrlEl = $('#siteUrl');
  const canonicalEl = $('#canonicalUrl');
  const ogImageEl = $('#ogImage');
  const twitterHandleEl = $('#twitterHandle');
  const faviconEl = $('#faviconIco');
  const themeColorEl = $('#themeColor');
  const authorEl = $('#authorName');
  const robotsEl = $('#robots');

  const outputEl = $('#metaOutput');
  const statusEl = $('#metaStatus');

  const genBtn = $('#generateMetaBtn');
  const copyBtn = $('#copyMetaBtn');
  const dlBtn = $('#downloadMetaBtn');
  const clearBtn = $('#clearMetaBtn');

  function escapeHtml(str) {
    return (str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function buildMeta() {
    const title = titleEl.value.trim();
    const desc = descEl.value.trim();
    const siteUrl = siteUrlEl.value.trim();
    const canonical = canonicalEl.value.trim();
    const ogImage = ogImageEl.value.trim();
    const twitterHandle = twitterHandleEl.value.trim();
    const favicon = faviconEl.value.trim();
    const themeColor = themeColorEl.value;
    const author = authorEl.value.trim();
    const robots = robotsEl.value;

    const lines = [];
    if (title) lines.push(`<title>${escapeHtml(title)}</title>`);
    if (desc) lines.push(`<meta name="description" content="${escapeHtml(desc)}">`);
    if (author) lines.push(`<meta name="author" content="${escapeHtml(author)}">`);
    lines.push(`<meta name="robots" content="${robots}">`);
    if (themeColor) lines.push(`<meta name="theme-color" content="${themeColor}">`);
    if (favicon) lines.push(`<link rel="icon" href="${favicon}" type="image/x-icon">`);
    if (canonical) lines.push(`<link rel="canonical" href="${canonical}">`);

    // Open Graph
    if (title) lines.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
    if (desc) lines.push(`<meta property="og:description" content="${escapeHtml(desc)}">`);
    if (siteUrl) lines.push(`<meta property="og:url" content="${siteUrl}">`);
    if (ogImage) lines.push(`<meta property="og:image" content="${ogImage}">`);
    lines.push(`<meta property="og:type" content="website">`);

    // Twitter
    lines.push(`<meta name="twitter:card" content="summary_large_image">`);
    if (twitterHandle) lines.push(`<meta name="twitter:site" content="${escapeHtml(twitterHandle)}">`);
    if (title) lines.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
    if (desc) lines.push(`<meta name="twitter:description" content="${escapeHtml(desc)}">`);
    if (ogImage) lines.push(`<meta name="twitter:image" content="${ogImage}">`);

    return lines.join('\n');
  }

  function updateOutput() {
    const html = buildMeta();
    outputEl.value = html;
    statusEl.textContent = `Lines: ${html ? html.split('\n').length : 0}`;
  }

  function copyOutput() {
    const text = outputEl.value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => statusEl.textContent = 'Copied to clipboard').catch(() => statusEl.textContent = 'Copy failed');
  }

  function downloadHtml() {
    const content = outputEl.value || buildMeta();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }

  function clearAll() {
    titleEl.value = '';
    descEl.value = '';
    siteUrlEl.value = '';
    canonicalEl.value = '';
    ogImageEl.value = '';
    twitterHandleEl.value = '';
    faviconEl.value = '';
    themeColorEl.value = '#0ea5e9';
    authorEl.value = '';
    robotsEl.value = 'index,follow';
    outputEl.value = '';
    statusEl.textContent = '';
  }

  // Bind
  [titleEl, descEl, siteUrlEl, canonicalEl, ogImageEl, twitterHandleEl, faviconEl, themeColorEl, authorEl, robotsEl]
    .forEach((el) => el.addEventListener('input', updateOutput));
  genBtn.addEventListener('click', updateOutput);
  copyBtn.addEventListener('click', copyOutput);
  dlBtn.addEventListener('click', downloadHtml);
  clearBtn.addEventListener('click', clearAll);

  // Initial render
  updateOutput();
})();