// Tool Preview Animations
(function() {
    'use strict';
    
    // Preview data for each tool
    const toolPreviews = {
        'word-counter': {
            input: 'The quick brown fox jumps over the lazy dog.',
            stats: { words: 9, chars: 44, sentences: 1, time: '< 1 min' }
        },
        'clipboard-manager': {
            items: [
                { text: 'Meeting notes from...', category: 'Work' },
                { text: 'Shopping list: milk...', category: 'Personal' },
                { text: 'Code snippet: func...', category: 'Code' }
            ]
        },
        'password-generator': {
            passwords: [
                'K9$mP2#xL5@qR8',
                'Zx7!nB4&wQ1@tY',
                'Hj3#vM9$pL6@cK'
            ]
        },
        'json-formatter': {
            before: '{"name":"John","age":30}',
            after: '{\n  "name": "John",\n  "age": 30\n}'
        },
        'base64-encoder': {
            text: 'Hello World!',
            encoded: 'SGVsbG8gV29ybGQh'
        },
        'url-encoder': {
            text: 'Hello World & More!',
            encoded: 'Hello%20World%20%26%20More%21'
        },
        'qr-code': {
            text: 'https://freeclipboard.com',
            size: '200x200'
        },
        'color-picker': {
            colors: ['#3B82F6', '#8B5CF6', '#10B981']
        },
        'image-converter': {
            from: 'PNG',
            to: 'JPG',
            size: '1920x1080'
        },
        'glitch-text': {
            text: 'Join the chaos',
            levels: [2, 5, 8]
        }
    };
    
    // Initialize preview animations
    function initPreviews() {
        const previewCards = document.querySelectorAll('.tool-preview-card');
        
        previewCards.forEach(card => {
            const toolType = card.dataset.tool;
            if (toolType && toolPreviews[toolType]) {
                animatePreview(card, toolType);
            }
        });
    }
    
    // Animate specific tool preview
    function animatePreview(card, toolType) {
        const preview = toolPreviews[toolType];
        const previewContent = card.querySelector('.preview-content');
        
        if (!previewContent) return;
        
        switch(toolType) {
            case 'word-counter':
                animateWordCounter(previewContent, preview);
                break;
            case 'clipboard-manager':
                animateClipboard(previewContent, preview);
                break;
            case 'password-generator':
                animatePasswordGen(previewContent, preview);
                break;
            case 'json-formatter':
                animateJsonFormatter(previewContent, preview);
                break;
            case 'base64-encoder':
                animateEncoder(previewContent, preview, 'Base64');
                break;
            case 'url-encoder':
                animateEncoder(previewContent, preview, 'URL');
                break;
            case 'qr-code':
                animateQRCode(previewContent, preview);
                break;
            case 'color-picker':
                animateColorPicker(previewContent, preview);
                break;
            case 'image-converter':
                animateImageConverter(previewContent, preview);
                break;
            case 'glitch-text':
                animateGlitchText(previewContent, preview);
                break;
        }
    }
    
    // Word Counter Animation
    function animateWordCounter(container, data) {
        container.innerHTML = `
            <div class="preview-input typing">${data.input}</div>
            <div class="preview-stats">
                <div class="stat-mini"><span class="stat-value">${data.stats.words}</span> words</div>
                <div class="stat-mini"><span class="stat-value">${data.stats.chars}</span> chars</div>
                <div class="stat-mini"><span class="stat-value">${data.stats.sentences}</span> sentences</div>
            </div>
        `;
        
        // Typing animation
        const input = container.querySelector('.preview-input');
        const text = data.input;
        input.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                input.textContent += text[i];
                i++;
            } else {
                clearInterval(typeInterval);
                container.querySelector('.preview-stats').classList.add('show');
            }
        }, 50);
    }
    
    // Clipboard Manager Animation
    function animateClipboard(container, data) {
        container.innerHTML = `
            <div class="preview-clipboard">
                ${data.items.map((item, i) => `
                    <div class="clipboard-item-mini" style="animation-delay: ${i * 0.2}s">
                        <span class="item-text">${item.text}</span>
                        <span class="item-category">${item.category}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Password Generator Animation
    function animatePasswordGen(container, data) {
        container.innerHTML = `
            <div class="preview-password">
                <div class="password-display"></div>
                <div class="password-strength">
                    <div class="strength-bar"></div>
                </div>
            </div>
        `;
        
        const display = container.querySelector('.password-display');
        const strengthBar = container.querySelector('.strength-bar');
        let currentIndex = 0;
        
        function showNextPassword() {
            display.classList.add('generating');
            setTimeout(() => {
                display.textContent = data.passwords[currentIndex];
                display.classList.remove('generating');
                strengthBar.style.width = '100%';
                currentIndex = (currentIndex + 1) % data.passwords.length;
            }, 300);
        }
        
        showNextPassword();
        setInterval(showNextPassword, 3000);
    }
    
    // JSON Formatter Animation
    function animateJsonFormatter(container, data) {
        container.innerHTML = `
            <div class="preview-json">
                <div class="json-before">${escapeHtml(data.before)}</div>
                <div class="json-arrow">→</div>
                <div class="json-after">${escapeHtml(data.after)}</div>
            </div>
        `;
    }
    
    // Encoder Animation
    function animateEncoder(container, data, type) {
        container.innerHTML = `
            <div class="preview-encoder">
                <div class="encode-input">${escapeHtml(data.text)}</div>
                <div class="encode-arrow">↓</div>
                <div class="encode-output">${escapeHtml(data.encoded)}</div>
            </div>
        `;
    }
    
    // QR Code Animation
    function animateQRCode(container, data) {
        container.innerHTML = `
            <div class="preview-qr">
                <div class="qr-input">${data.text}</div>
                <div class="qr-code">
                    <div class="qr-grid">
                        ${Array(25).fill(0).map(() => 
                            `<div class="qr-pixel ${Math.random() > 0.5 ? 'filled' : ''}"></div>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Color Picker Animation
    function animateColorPicker(container, data) {
        container.innerHTML = `
            <div class="preview-colors">
                ${data.colors.map((color, i) => `
                    <div class="color-swatch" style="background: ${color}; animation-delay: ${i * 0.2}s">
                        <span class="color-code">${color}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Image Converter Animation
    function animateImageConverter(container, data) {
        container.innerHTML = `
            <div class="preview-image-convert">
                <div class="image-format">${data.from}</div>
                <div class="convert-arrow">→</div>
                <div class="image-format">${data.to}</div>
            </div>
        `;
    }

    // Glitch Text Animation
    function animateGlitchText(container, data) {
        container.innerHTML = `
            <div class="preview-glitch">
                <div class="glitch-before">${escapeHtml(data.text)}</div>
                <div class="glitch-arrow">→</div>
                <div class="glitch-after"></div>
            </div>
        `;

        const after = container.querySelector('.glitch-after');
        const levels = data.levels || [2,5,8];
        let idx = 0;

        function zalgo(text, level) {
            const UP = ['\u0300','\u0301','\u0302','\u0303','\u0304','\u0305','\u0306','\u0307','\u0308','\u0309','\u030A','\u030B','\u030C'];
            const MID = ['\u0334','\u0335','\u0336','\u0337'];
            const DOWN = ['\u0323','\u0324','\u0325','\u0326','\u0327','\u0328','\u0329'];
            function r(arr){return arr[Math.floor(Math.random()*arr.length)];}
            let out = '';
            for (const ch of text) {
                let c = ch;
                const count = level;
                for (let i=0;i<count;i++) c += r(UP);
                for (let i=0;i<Math.floor(count/2);i++) c += r(MID);
                for (let i=0;i<Math.ceil(count/2);i++) c += r(DOWN);
                out += c;
            }
            return out;
        }

        function cycle() {
            const level = levels[idx % levels.length];
            after.textContent = zalgo(data.text, level);
            idx++;
        }

        cycle();
        setInterval(cycle, 2000);
    }
    
    // Utility function
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPreviews);
    } else {
        initPreviews();
    }
    
    // Re-initialize on theme change
    window.addEventListener('themeChanged', initPreviews);
    
})();
