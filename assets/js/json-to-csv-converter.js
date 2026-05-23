// JSON to CSV Converter
(function() {
  const inputEl = document.getElementById('jsonInput');
  const outputEl = document.getElementById('csvOutput');
  const statusEl = document.getElementById('jsonCsvStatus');

  const delimiterEl = document.getElementById('csvDelimiter');
  const includeHeaderEl = document.getElementById('includeHeader');
  const flattenEl = document.getElementById('flattenObjects');
  const quoteAllEl = document.getElementById('quoteAll');
  const addBomEl = document.getElementById('addBom');

  const convertBtn = document.getElementById('convertJsonBtn');
  const copyBtn = document.getElementById('copyCsvBtn');
  const downloadBtn = document.getElementById('downloadCsvBtn');
  const clearBtn = document.getElementById('clearJsonBtn');
  const exampleBtns = document.querySelectorAll('.example-btn');

  function setStatus(msg, ok=true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? '' : '#ef4444';
  }

  function tryParseJsonArrayOrNdjson(text) {
    let trimmed = (text || '').trim();
    if (!trimmed) return [];
    // Try direct JSON.parse
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object') return [parsed];
    } catch (_) {}
    // NDJSON fallback
    const lines = trimmed.split(/\r?\n/).filter(l => l.trim().length > 0);
    const out = [];
    for (const line of lines) {
      try { out.push(JSON.parse(line)); } catch (_) { /* skip invalid */ }
    }
    return out;
  }

  function flattenObject(obj, prefix = '', out = {}) {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const [k, v] of Object.entries(obj)) {
        flattenObject(v, prefix ? `${prefix}.${k}` : k, out);
      }
    } else {
      out[prefix] = obj;
    }
    return out;
  }

  function collectHeaders(rows, flatten) {
    const keys = new Set();
    for (const r of rows) {
      const obj = flatten ? flattenObject(r) : r;
      Object.keys(obj || {}).forEach(k => keys.add(k));
    }
    return Array.from(keys);
  }

  function escapeCsv(value, delimiter, quoteAll) {
    let v = value;
    if (v === null || v === undefined) v = '';
    if (typeof v === 'object') {
      try { v = JSON.stringify(v); } catch (_) { v = String(v); }
    }
    v = String(v);
    const needsQuote = quoteAll || v.includes('"') || v.includes('\n') || v.includes('\r') || v.includes(delimiter);
    if (needsQuote) {
      v = '"' + v.replace(/"/g, '""') + '"';
    }
    return v;
  }

  function toCsv(rows, opts) {
    const delimiter = opts.delimiter || ',';
    const flatten = !!opts.flatten;
    const includeHeader = !!opts.includeHeader;
    const quoteAll = !!opts.quoteAll;

    const headers = collectHeaders(rows, flatten);
    const lines = [];
    if (includeHeader) {
      lines.push(headers.map(h => escapeCsv(h, delimiter, quoteAll)).join(delimiter));
    }
    for (const r of rows) {
      const obj = flatten ? flattenObject(r) : r;
      const line = headers.map(h => escapeCsv(obj?.[h], delimiter, quoteAll)).join(delimiter);
      lines.push(line);
    }
    return lines.join('\n');
  }

  function convert() {
    try {
      const rows = tryParseJsonArrayOrNdjson(inputEl?.value || '');
      if (!rows || rows.length === 0) {
        setStatus('No valid JSON found. Paste an array or NDJSON.', false);
        outputEl.value = '';
        return;
      }
      const csv = toCsv(rows, {
        delimiter: delimiterEl?.value || ',',
        flatten: !!flattenEl?.checked,
        includeHeader: !!includeHeaderEl?.checked,
        quoteAll: !!quoteAllEl?.checked
      });
      const withBom = addBomEl?.checked ? ('\uFEFF' + csv) : csv;
      outputEl.value = withBom;
      setStatus(`Converted ${rows.length} row(s) to CSV.`);
    } catch (e) {
      setStatus('Conversion failed. Check your JSON format.', false);
    }
  }

  async function copyCsv() {
    try {
      await navigator.clipboard.writeText(outputEl?.value || '');
      setStatus('Copied CSV to clipboard!');
    } catch (e) {
      setStatus('Copy failed. Select text and copy manually.', false);
    }
  }

  function downloadCsv() {
    const csv = outputEl?.value || '';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
    setStatus('Downloaded CSV file.');
  }

  function clearAll() {
    if (inputEl) inputEl.value = '';
    if (outputEl) outputEl.value = '';
    setStatus('Cleared. Paste new JSON to convert.');
  }

  // Events
  convertBtn?.addEventListener('click', convert);
  copyBtn?.addEventListener('click', copyCsv);
  downloadBtn?.addEventListener('click', downloadCsv);
  clearBtn?.addEventListener('click', clearAll);
  delimiterEl?.addEventListener('change', convert);
  includeHeaderEl?.addEventListener('change', convert);
  flattenEl?.addEventListener('change', convert);
  quoteAllEl?.addEventListener('change', convert);
  addBomEl?.addEventListener('change', convert);

  exampleBtns?.forEach(btn => btn.addEventListener('click', () => {
    const text = btn.getAttribute('data-text') || '';
    if (inputEl) inputEl.value = text;
    convert();
  }));

  // Initial
  convert();
})();