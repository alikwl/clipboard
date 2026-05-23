function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatUUID(uuid) {
  const format = document.querySelector('input[name="format"]:checked').value;
  
  switch(format) {
    case 'uppercase':
      return uuid.toUpperCase();
    case 'nohyphens':
      return uuid.replace(/-/g, '');
    case 'braces':
      return '{' + uuid + '}';
    default:
      return uuid;
  }
}

function generateSingleUUID() {
  const uuid = generateUUID();
  document.getElementById('uuidOutput').textContent = formatUUID(uuid);
}

function copyUUID() {
  const uuid = document.getElementById('uuidOutput').textContent;
  navigator.clipboard.writeText(uuid).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
}

function generateBulkUUIDs() {
  const count = parseInt(document.getElementById('bulkCount').value);
  const uuids = [];
  
  for (let i = 0; i < count; i++) {
    uuids.push(formatUUID(generateUUID()));
  }
  
  document.getElementById('bulkOutput').value = uuids.join('\n');
}

function copyBulk() {
  const text = document.getElementById('bulkOutput').value;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = originalText, 2000);
    });
  }
}

// Add event listeners for format changes
document.querySelectorAll('input[name="format"]').forEach(radio => {
  radio.addEventListener('change', generateSingleUUID);
});

// Generate initial UUID
generateSingleUUID();
