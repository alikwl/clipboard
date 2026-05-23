// Enhanced Word Counter Tool with Advanced Features
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        wordsPerMinute: 200,
        wordsPerMinuteSpeaking: 150,
        debounceDelay: 300,
        topWordsCount: 20,
        stopWords: new Set([
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
            'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what'
        ])
    };
    
    // DOM Elements
    let elements = {};
    
    // Debounce function to prevent excessive updates
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize
    function init() {
        // Get DOM elements
        elements = {
            textInput: document.getElementById('textInput'),
            wordCount: document.getElementById('wordCount'),
            charCount: document.getElementById('charCount'),
            charNoSpaceCount: document.getElementById('charNoSpaceCount'),
            sentenceCount: document.getElementById('sentenceCount'),
            paragraphCount: document.getElementById('paragraphCount') || document.getElementById('paraCount'),
            readingTime: document.getElementById('readingTime') || document.getElementById('readTime'),
            speakingTime: document.getElementById('speakingTime') || document.getElementById('speakTime'),
            avgWordLength: document.getElementById('avgWordLength'),
            avgSentenceLength: document.getElementById('avgSentenceLength'),
            copyTextBtn: document.getElementById('copyTextBtn') || document.getElementById('copyBtn'),
            clearBtn: document.getElementById('clearBtn'),
            pasteBtn: document.getElementById('pasteBtn'),
            downloadTextBtn: document.getElementById('downloadTextBtn') || document.getElementById('downloadBtn'),
            downloadStatsBtn: document.getElementById('downloadStatsBtn'),
            copyStatsBtn: document.getElementById('copyStatsBtn'),
            frequencyList: document.getElementById('frequencyList'),
            frequencySection: document.getElementById('frequencySection')
        };
        
        // Check if required elements exist
        if (!elements.textInput) {
            console.error('Word Counter: Required elements not found');
            return;
        }
        
        // Add event listeners
        setupEventListeners();
        
        // Initial update
        updateAllCounts();
    }
    
    // Setup Event Listeners
    function setupEventListeners() {
        // Input event with debouncing for performance
        const debouncedUpdate = debounce(updateAllCounts, CONFIG.debounceDelay);
        elements.textInput.addEventListener('input', debouncedUpdate);
        
        // Button events
        if (elements.copyTextBtn) {
            elements.copyTextBtn.addEventListener('click', copyText);
        }
        
        if (elements.clearBtn) {
            elements.clearBtn.addEventListener('click', clearAll);
        }
        
        if (elements.pasteBtn) {
            elements.pasteBtn.addEventListener('click', pasteFromClipboard);
        }
        
        if (elements.downloadTextBtn) {
            elements.downloadTextBtn.addEventListener('click', downloadText);
        }
        
        if (elements.downloadStatsBtn) {
            elements.downloadStatsBtn.addEventListener('click', downloadStats);
        }
        
        if (elements.copyStatsBtn) {
            elements.copyStatsBtn.addEventListener('click', copyStats);
        }
    }
    
    // Core Counting Functions
    function countWords(text) {
        if (!text.trim()) return 0;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        return words.length;
    }
    
    function countCharacters(text, includeSpaces = true) {
        return includeSpaces ? text.length : text.replace(/\s/g, '').length;
    }
    
    function countSentences(text) {
        if (!text.trim()) return 0;
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        return sentences.length;
    }
    
    function countParagraphs(text) {
        if (!text.trim()) return 0;
        const paragraphs = text.split(/\n\n+/).filter(para => para.trim().length > 0);
        return paragraphs.length || text.split(/\n+/).filter(para => para.trim().length > 0).length;
    }
    
    // Advanced Metrics
    function calculateReadingTime(wordCount) {
        const minutes = Math.ceil(wordCount / CONFIG.wordsPerMinute);
        return minutes || 0;
    }
    
    function calculateSpeakingTime(wordCount) {
        const minutes = Math.ceil(wordCount / CONFIG.wordsPerMinuteSpeaking);
        return minutes || 0;
    }
    
    function calculateAverageWordLength(text) {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        if (words.length === 0) return 0;
        const totalLength = words.reduce((sum, word) => sum + word.length, 0);
        return (totalLength / words.length).toFixed(1);
    }
    
    function calculateAverageSentenceLength(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length === 0) return 0;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        return (words.length / sentences.length).toFixed(1);
    }
    
    // Word Frequency Analysis
    function analyzeWordFrequency(text) {
        if (!text.trim()) return [];
        
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2 && !CONFIG.stopWords.has(word));
        
        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, CONFIG.topWordsCount);
    }
    
    // Update Display
    function updateAllCounts() {
        try {
            const text = elements.textInput.value;
            
            // Basic counts
            const words = countWords(text);
            const chars = countCharacters(text, true);
            const charsNoSpace = countCharacters(text, false);
            const sentences = countSentences(text);
            const paragraphs = countParagraphs(text);
            
            // Update basic stats with animation
            updateStatWithAnimation(elements.wordCount, words);
            updateStatWithAnimation(elements.charCount, chars);
            if (elements.charNoSpaceCount) {
                updateStatWithAnimation(elements.charNoSpaceCount, charsNoSpace);
            }
            updateStatWithAnimation(elements.sentenceCount, sentences);
            updateStatWithAnimation(elements.paragraphCount, paragraphs);
            
            // Advanced metrics
            if (elements.readingTime) {
                const readingTime = calculateReadingTime(words);
                const readTimeText = readingTime === 1 ? '1 min' : `${readingTime} min`;
                elements.readingTime.textContent = readTimeText;
            }
            
            if (elements.speakingTime) {
                const speakingTime = calculateSpeakingTime(words);
                const speakTimeText = speakingTime === 1 ? '1 min' : `${speakingTime} min`;
                elements.speakingTime.textContent = speakTimeText;
            }
            
            if (elements.avgWordLength) {
                const avgWordLen = calculateAverageWordLength(text);
                updateStatWithAnimation(elements.avgWordLength, avgWordLen);
            }
            
            if (elements.avgSentenceLength) {
                const avgSentLen = calculateAverageSentenceLength(text);
                updateStatWithAnimation(elements.avgSentenceLength, avgSentLen);
            }
            
            // Word frequency
            if (elements.frequencyList && elements.frequencySection) {
                updateWordFrequency(text);
                // Show frequency section only if there's text
                elements.frequencySection.style.display = text.trim() ? 'block' : 'none';
            }
            
        } catch (error) {
            console.error('Error updating counts:', error);
        }
    }
    
    // Update stat with animation
    function updateStatWithAnimation(element, value) {
        if (!element) return;
        
        element.classList.add('updating');
        element.textContent = formatNumber(value);
        
        setTimeout(() => {
            element.classList.remove('updating');
        }, 300);
    }
    
    // Format large numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Update word frequency display
    function updateWordFrequency(text) {
        const frequency = analyzeWordFrequency(text);
        
        if (frequency.length === 0) {
            elements.frequencyList.innerHTML = '<p style="text-align: center; color: var(--gray);">No words to analyze yet. Start typing!</p>';
            return;
        }
        
        elements.frequencyList.innerHTML = frequency.map(([word, count]) => `
            <div class="frequency-item">
                <span class="frequency-word">${escapeHtml(word)}</span>
                <span class="frequency-count">${count}</span>
            </div>
        `).join('');
    }
    
    // Button Functions
    async function copyText() {
        const text = elements.textInput.value;
        if (!text.trim()) {
            showNotification('No text to copy!', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Text copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            elements.textInput.select();
            document.execCommand('copy');
            showNotification('Text copied to clipboard!', 'success');
        }
    }
    
    async function pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            elements.textInput.value = text;
            updateAllCounts();
            showNotification('Text pasted from clipboard!', 'success');
        } catch (err) {
            showNotification('Unable to paste. Please use Ctrl+V or Cmd+V', 'error');
        }
    }
    
    function clearAll() {
        if (elements.textInput.value && !confirm('Are you sure you want to clear all text?')) {
            return;
        }
        elements.textInput.value = '';
        updateAllCounts();
        elements.textInput.focus();
        showNotification('Text cleared!', 'success');
    }
    
    function downloadText() {
        const text = elements.textInput.value;
        if (!text.trim()) {
            showNotification('No text to download!', 'error');
            return;
        }
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 10);
        a.download = `word-counter-text-${timestamp}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Text downloaded successfully!', 'success');
    }
    
    function downloadStats() {
        const text = elements.textInput.value;
        if (!text.trim()) {
            showNotification('No text to analyze!', 'error');
            return;
        }
        
        const words = countWords(text);
        const stats = `TEXT STATISTICS REPORT
${'='.repeat(50)}

Generated: ${new Date().toLocaleString()}

BASIC COUNTS
${'-'.repeat(50)}
Words:                      ${formatNumber(words)}
Characters (with spaces):   ${formatNumber(countCharacters(text, true))}
Characters (no spaces):     ${formatNumber(countCharacters(text, false))}
Sentences:                  ${formatNumber(countSentences(text))}
Paragraphs:                 ${formatNumber(countParagraphs(text))}

TIME ESTIMATES
${'-'.repeat(50)}
Reading Time:               ${calculateReadingTime(words)} minutes
Speaking Time:              ${calculateSpeakingTime(words)} minutes

ADVANCED METRICS
${'-'.repeat(50)}
Average Word Length:        ${calculateAverageWordLength(text)} characters
Average Sentence Length:    ${calculateAverageSentenceLength(text)} words

WORD FREQUENCY (Top 10)
${'-'.repeat(50)}
${analyzeWordFrequency(text).slice(0, 10).map(([word, count], i) => 
    `${(i + 1).toString().padStart(2)}. ${word.padEnd(20)} ${count} times`
).join('\n')}

${'='.repeat(50)}
Generated by Word Counter Tool
`;
        
        const blob = new Blob([stats], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 10);
        a.download = `word-counter-stats-${timestamp}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Statistics downloaded successfully!', 'success');
    }
    
    async function copyStats() {
        const text = elements.textInput.value;
        if (!text.trim()) {
            showNotification('No text to analyze!', 'error');
            return;
        }
        
        const words = countWords(text);
        const stats = `TEXT STATISTICS
================
Words: ${formatNumber(words)}
Characters (with spaces): ${formatNumber(countCharacters(text, true))}
Characters (no spaces): ${formatNumber(countCharacters(text, false))}
Sentences: ${formatNumber(countSentences(text))}
Paragraphs: ${formatNumber(countParagraphs(text))}
Reading Time: ${calculateReadingTime(words)} min
Speaking Time: ${calculateSpeakingTime(words)} min
Avg Word Length: ${calculateAverageWordLength(text)} chars
Avg Sentence Length: ${calculateAverageSentenceLength(text)} words`;
        
        try {
            await navigator.clipboard.writeText(stats);
            showNotification('Statistics copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy statistics', 'error');
        }
    }
    
    // Utility Functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
