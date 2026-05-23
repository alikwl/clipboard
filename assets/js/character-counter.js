const textInput = document.getElementById('textInput');

function updateStats() {
  const text = textInput.value;
  
  // Character count
  const charCount = text.length;
  document.getElementById('charCount').textContent = charCount.toLocaleString();
  
  // Characters without spaces
  const charNoSpaces = text.replace(/\s/g, '').length;
  document.getElementById('charNoSpaces').textContent = charNoSpaces.toLocaleString();
  
  // Word count
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = text.trim() === '' ? 0 : words.length;
  document.getElementById('wordCount').textContent = wordCount.toLocaleString();
  
  // Sentence count
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  document.getElementById('sentenceCount').textContent = sentences.length.toLocaleString();
  
  // Paragraph count
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  document.getElementById('paragraphCount').textContent = paragraphs.length.toLocaleString();
  
  // Reading time (average 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);
  document.getElementById('readingTime').textContent = readingTime;
}

function clearText() {
  textInput.value = '';
  updateStats();
}

function copyStats() {
  const stats = `Characters: ${document.getElementById('charCount').textContent}
Characters (no spaces): ${document.getElementById('charNoSpaces').textContent}
Words: ${document.getElementById('wordCount').textContent}
Sentences: ${document.getElementById('sentenceCount').textContent}
Paragraphs: ${document.getElementById('paragraphCount').textContent}
Reading Time: ${document.getElementById('readingTime').textContent} min`;
  
  navigator.clipboard.writeText(stats).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
}

textInput.addEventListener('input', updateStats);
updateStats();
