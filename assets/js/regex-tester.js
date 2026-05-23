const regexInput = document.getElementById('regexInput');
const flagsInput = document.getElementById('flagsInput');
const testString = document.getElementById('testString');

function updateFlags() {
  const checkboxes = document.querySelectorAll('.flags-helper input[type="checkbox"]');
  const flags = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value)
    .join('');
  flagsInput.value = flags;
  testRegex();
}

function testRegex() {
  const pattern = regexInput.value;
  const flags = flagsInput.value;
  const text = testString.value;
  
  if (!pattern) {
    clearResults();
    return;
  }
  
  try {
    const regex = new RegExp(pattern, flags);
    document.getElementById('isValid').textContent = '✓';
    document.getElementById('isValid').style.color = '#10b981';
    
    const matches = [...text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
    document.getElementById('matchCount').textContent = matches.length;
    
    // Highlight matches
    if (matches.length > 0) {
      let highlighted = text;
      let offset = 0;
      
      matches.forEach((match, index) => {
        const start = match.index + offset;
        const end = start + match[0].length;
        const before = highlighted.slice(0, start);
        const matchText = highlighted.slice(start, end);
        const after = highlighted.slice(end);
        
        highlighted = before + `<mark class="match-highlight">${escapeHtml(matchText)}</mark>` + after;
        offset += '<mark class="match-highlight"></mark>'.length;
      });
      
      document.getElementById('highlightedText').innerHTML = highlighted || '<em>No text to display</em>';
    } else {
      document.getElementById('highlightedText').innerHTML = escapeHtml(text) || '<em>No matches found</em>';
    }
    
    // Show match details
    if (matches.length > 0) {
      let detailsHtml = '';
      matches.forEach((match, index) => {
        detailsHtml += `<div class="match-item">
          <strong>Match ${index + 1}:</strong> "${escapeHtml(match[0])}" at position ${match.index}`;
        
        if (match.length > 1) {
          detailsHtml += '<br><strong>Groups:</strong> ';
          for (let i = 1; i < match.length; i++) {
            detailsHtml += `Group ${i}: "${escapeHtml(match[i] || '')}" `;
          }
        }
        detailsHtml += '</div>';
      });
      document.getElementById('matchesList').innerHTML = detailsHtml;
    } else {
      document.getElementById('matchesList').innerHTML = '<em>No matches found</em>';
    }
    
  } catch (e) {
    document.getElementById('isValid').textContent = '✗';
    document.getElementById('isValid').style.color = '#ef4444';
    document.getElementById('matchCount').textContent = '0';
    document.getElementById('highlightedText').innerHTML = `<em class="error">Invalid regex: ${escapeHtml(e.message)}</em>`;
    document.getElementById('matchesList').innerHTML = '';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function clearResults() {
  document.getElementById('matchCount').textContent = '0';
  document.getElementById('isValid').textContent = '✓';
  document.getElementById('isValid').style.color = '#64748b';
  document.getElementById('highlightedText').innerHTML = '<em>Enter a regex pattern to start</em>';
  document.getElementById('matchesList').innerHTML = '';
}

function clearRegex() {
  regexInput.value = '';
  flagsInput.value = '';
  document.querySelectorAll('.flags-helper input[type="checkbox"]').forEach(cb => cb.checked = false);
  testRegex();
}

function clearTest() {
  testString.value = '';
  testRegex();
}

regexInput.addEventListener('input', testRegex);
flagsInput.addEventListener('input', testRegex);
testString.addEventListener('input', testRegex);

// Sync checkboxes with manual flag input
flagsInput.addEventListener('input', () => {
  const flags = flagsInput.value;
  document.querySelectorAll('.flags-helper input[type="checkbox"]').forEach(cb => {
    cb.checked = flags.includes(cb.value);
  });
});
