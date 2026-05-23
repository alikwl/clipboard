/**
 * Global Search Functionality
 * Instant search across all tools and pages
 */

(function () {
    'use strict';

    // Search data - all tools and pages
    const searchData = [
        // Clipboard Tools
        { title: 'Free Clipboard Manager', description: 'Advanced clipboard manager with history and sync', category: 'Clipboard', icon: '📋', url: '/tools/free-clipboard/' },

        // Text Utilities
        { title: 'Word Counter', description: 'Count words, characters, and paragraphs', category: 'Text', icon: '📝', url: '/tools/word-counter/' },
        { title: 'Character Counter', description: 'Count characters with or without spaces', category: 'Text', icon: '🔤', url: '/tools/character-counter/' },
        { title: 'Text Formatter', description: 'Format and transform text easily', category: 'Text', icon: '✍️', url: '/tools/text-formatter/' },
        { title: 'JSON Formatter', description: 'Format and validate JSON data', category: 'Text', icon: '{ }', url: '/tools/json-formatter/' },
        { title: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings', category: 'Text', icon: '🔐', url: '/tools/base64-encoder/' },
        { title: 'URL Encoder/Decoder', description: 'Encode and decode URLs', category: 'Text', icon: '🔗', url: '/tools/url-encoder/' },
        { title: 'HTML Encoder/Decoder', description: 'Encode and decode HTML entities', category: 'Text', icon: '🌐', url: '/tools/html-encoder/' },
        { title: 'Text to Handwriting', description: 'Convert text to handwriting style', category: 'Text', icon: '✒️', url: '/tools/text-to-handwriting/' },
        { title: 'Regex Tester', description: 'Test regular expressions', category: 'Text', icon: '🔍', url: '/tools/regex-tester/' },
        { title: 'Discord Spoiler Text', description: 'Generate Discord spoiler text', category: 'Text', icon: '||', url: '/tools/discord-spoiler-text-generator/' },
        { title: 'Glitch Text Generator', description: 'Create glitchy text effects', category: 'Text', icon: '⚡', url: '/tools/glitch-text-generator/' },
        { title: 'Cursed Text Generator', description: 'Generate cursed Zalgo text', category: 'Text', icon: '👹', url: '/tools/cursed-text-generator/' },
        { title: 'Invisible Character', description: 'Copy invisible Unicode characters', category: 'Text', icon: '⠀', url: '/tools/invisible-character/' },
        { title: 'Small Caps Generator', description: 'Convert text to small caps', category: 'Text', icon: 'ᴀʙᴄ', url: '/tools/small-caps-generator/' },
        { title: 'Markdown Preview', description: 'Preview Markdown in real-time', category: 'Text', icon: '#', url: '/tools/markdown-preview/' },
        { title: 'JSON to CSV Converter', description: 'Convert JSON to CSV format', category: 'Text', icon: '📊', url: '/tools/json-to-csv-converter/' },

        // Design Tools
        { title: 'Glassmorphism Generator', description: 'Generate glassmorphism CSS', category: 'Design', icon: '🎨', url: '/tools/glassmorphism-generator/' },
        { title: 'Neumorphism Generator', description: 'Create neumorphic designs', category: 'Design', icon: '🎨', url: '/tools/neumorphism-generator/' },
        { title: 'SVG Blob Generator', description: 'Generate random SVG blobs', category: 'Design', icon: '🫧', url: '/tools/svg-blob-generator/' },
        { title: 'Color Picker', description: 'Pick and convert colors', category: 'Design', icon: '🎨', url: '/tools/color-picker/' },
        { title: 'Code Snippet Generator', description: 'Generate code snippets', category: 'Design', icon: '💻', url: '/tools/code-snippet-generator/' },

        // Image Tools
        { title: 'Image Converter', description: 'Convert images to different formats', category: 'Image', icon: '🖼️', url: '/tools/image-converter/' },
        { title: 'QR Code Generator', description: 'Generate QR codes instantly', category: 'Image', icon: '📱', url: '/tools/qr-code-generator/' },
        { title: 'Social Media Image Resizer', description: 'Resize images for social media', category: 'Image', icon: '📐', url: '/tools/social-media-image-resizer/' },

        // Generators & Security
        { title: 'Password Generator', description: 'Generate strong secure passwords', category: 'Security', icon: '🔐', url: '/tools/password-generator/' },
        { title: 'Hash Generator', description: 'Generate MD5, SHA hashes', category: 'Security', icon: '#️⃣', url: '/tools/hash-generator/' },
        { title: 'UUID Generator', description: 'Generate unique identifiers', category: 'Security', icon: '🆔', url: '/tools/uuid-generator/' },

        // Calculators
        { title: 'Cat Age Calculator', description: 'Calculate your cat\'s age in human years', category: 'Calculator', icon: '🐱', url: '/tools/cat-age-calculator/' },
        { title: 'Pizza Party Calculator', description: 'Calculate pizza needed for party', category: 'Calculator', icon: '🍕', url: '/tools/pizza-party-calculator/' },
        { title: 'Water Intake Calculator', description: 'Calculate daily water needs', category: 'Calculator', icon: '💧', url: '/tools/water-intake-calculator/' },
        { title: 'Holiday Countdown', description: 'Countdown to holidays', category: 'Calculator', icon: '🎄', url: '/tools/holiday-countdown/' },
        { title: 'Unit Converter', description: 'Convert between units', category: 'Calculator', icon: '🔄', url: '/tools/unit-converter/' },
        { title: 'Home Energy Analyzer', description: 'Analyze home energy usage', category: 'Calculator', icon: '⚡', url: '/tools/energy-analyzer/' },
        { title: 'Waste Reduction Tracker', description: 'Track your zero-waste journey', category: 'Calculator', icon: '♻️', url: '/tools/waste-tracker/' },

        // Education Tools
        { title: 'Flashcards', description: 'Study with spaced repetition', category: 'Education', icon: '🎴', url: '/tools/flashcards/' },
        { title: 'Blog Headline Analyzer', description: 'Analyze headline SEO effectiveness', category: 'Education', icon: '📝', url: '/tools/headline-analyzer/' },

        // Business Tools
        { title: 'Invoice Generator', description: 'Create professional invoices', category: 'Business', icon: '📄', url: '/tools/invoice-generator/' },
        { title: 'Micro CRM', description: 'Simple CRM for freelancers', category: 'Business', icon: '👥', url: '/tools/micro-crm/' },

        // Utilities
        { title: 'Robots.txt Generator', description: 'Generate robots.txt file', category: 'Utility', icon: '🤖', url: '/tools/robots-txt-generator/' },
        { title: 'Meta Tag Generator', description: 'Generate SEO meta tags', category: 'Utility', icon: '🏷️', url: '/tools/meta-tag-generator/' },

        // Pages
        { title: 'All Tools', description: 'Browse the full FreeClipboard tool directory', category: 'Page', icon: '🔧', url: '/all-tools/' },
        { title: 'Blog', description: 'Read our latest articles', category: 'Page', icon: '📰', url: '/blog/' },
        { title: 'About', description: 'Learn about FreeClipboard', category: 'Page', icon: 'ℹ️', url: '/about/' },
        { title: 'Contact', description: 'Get in touch with us', category: 'Page', icon: '✉️', url: '/contact/' },
        { title: 'Free Resources', description: 'Free tools and resources', category: 'Page', icon: '🎁', url: '/free-resources/' }
    ];

    // DOM elements - Desktop
    const searchInput = document.getElementById('globalSearch');
    const searchResults = document.getElementById('searchResults');
    const searchResultsInner = searchResults?.querySelector('.search-results-inner');

    // DOM elements - Mobile
    const mobileSearchInput = document.getElementById('mobileSearch');
    const mobileSearchResults = document.getElementById('mobileSearchResults');
    const mobileSearchResultsInner = mobileSearchResults?.querySelector('.search-results-inner');

    // Initialize desktop search if elements exist
    if (searchInput && searchResults && searchResultsInner) {
        initializeSearch(searchInput, searchResults, searchResultsInner);
    }

    // Initialize mobile search if elements exist
    if (mobileSearchInput && mobileSearchResults && mobileSearchResultsInner) {
        initializeSearch(mobileSearchInput, mobileSearchResults, mobileSearchResultsInner);
    }

    // Main search initialization function
    function initializeSearch(input, results, resultsInner) {

    // Debounce function
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

    // Highlight matched text
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }



    // Display search results
    function displayResults(results, query, resultsInner, resultsContainer) {
        if (results.length === 0) {
            resultsInner.innerHTML = `
        <div class="search-no-results">
          <div class="search-no-results-icon">🔍</div>
          <div class="search-no-results-text">No results found for "${query}"</div>
        </div>
      `;
            resultsContainer.hidden = false;
            return;
        }

        const html = results.map(item => `
      <a href="${item.url}" class="search-result-item">
        <div class="search-result-icon">${item.icon}</div>
        <div class="search-result-content">
          <div class="search-result-title">${highlightText(item.title, query)}</div>
          <div class="search-result-description">${highlightText(item.description, query)}</div>
        </div>
        <div class="search-result-category">${item.category}</div>
      </a>
    `).join('');

        resultsInner.innerHTML = html;
        resultsContainer.hidden = false;
    }

    // Perform search with specific elements
    function performSearchWithElements(query, resultsInner, resultsContainer) {
        if (!query || query.length < 2) {
            resultsContainer.hidden = true;
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = searchData.filter(item => {
            return item.title.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery) ||
                item.category.toLowerCase().includes(lowerQuery);
        }).slice(0, 8); // Limit to 8 results

        displayResults(results, query, resultsInner, resultsContainer);
    }

    // Event listeners
    input.addEventListener('input', debounce((e) => {
        performSearchWithElements(e.target.value.trim(), resultsInner, results);
    }, 300));

    input.addEventListener('focus', () => {
        if (input.value.trim().length >= 2) {
            performSearchWithElements(input.value.trim(), resultsInner, results);
        }
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.hidden = true;
        }
    });

    // Keyboard shortcuts (only for desktop search)
    if (input.id === 'globalSearch') {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                input.focus();
                input.select();
            }

            // Escape to close results
            if (e.key === 'Escape') {
                results.hidden = true;
                input.blur();
            }
        });
    }

    // Arrow key navigation
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const items = results.querySelectorAll('.search-result-item');
            if (items.length === 0) return;

            const activeIndex = Array.from(items).findIndex(item => item === document.activeElement);

            if (e.key === 'ArrowDown') {
                const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
                items[nextIndex].focus();
            } else {
                const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
                items[prevIndex].focus();
            }
        }

        if (e.key === 'Enter' && !results.hidden) {
            const firstResult = results.querySelector('.search-result-item');
            if (firstResult) {
                window.location.href = firstResult.href;
            }
        }
    });
    } // End of initializeSearch function

})();
