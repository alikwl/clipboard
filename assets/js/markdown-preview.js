const markdownInput = document.getElementById('markdownInput');
const previewOutput = document.getElementById('previewOutput');

marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

function updatePreview() {
  const markdown = markdownInput.value;
  try {
    const html = marked.parse(markdown);
    previewOutput.innerHTML = html;
  } catch (e) {
    previewOutput.innerHTML = `<p class="error">Error rendering markdown: ${e.message}</p>`;
  }
}

function clearMarkdown() {
  markdownInput.value = '';
  updatePreview();
}

function insertTemplate() {
  const template = `# Project Title

## Description
A brief description of your project.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`javascript
const example = require('example');
example.run();
\`\`\`

## Contributing
Pull requests are welcome!

## License
MIT`;
  
  markdownInput.value = template;
  updatePreview();
}

function copyHTML() {
  const html = previewOutput.innerHTML;
  navigator.clipboard.writeText(html).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
}

function downloadMarkdown() {
  const markdown = markdownInput.value;
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
  a.click();
  URL.revokeObjectURL(url);
}

markdownInput.addEventListener('input', updatePreview);
updatePreview();
