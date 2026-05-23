// Text to Handwriting Converter - Advanced Implementation
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        defaultFont: 'style1',
        defaultColor: '#0000ff',
        defaultSize: 18,
        defaultSpacing: 1.5,
        defaultMargin: 40,
        maxChars: 10000,
        fonts: {
            style1: "'Caveat', cursive",
            style2: "'Dancing Script', cursive",
            style3: "'Patrick Hand', cursive",
            style4: "'Shadows Into Light', cursive",
            style5: "'Indie Flower', cursive"
        }
    };
    
    // State
    let state = {
        text: '',
        fontStyle: CONFIG.defaultFont,
        penColor: CONFIG.defaultColor,
        textSize: CONFIG.defaultSize,
        lineSpacing: CONFIG.defaultSpacing,
        paperType: 'plain',
        pageMargin: CONFIG.defaultMargin,
        letterSpacing: 0,
        wordSpacing: 0,
        textAlign: 'left',
        addShadow: false,
        randomVariation: false,
        pageWidth: 800,
        zoom: 1
    };
    
    // DOM Elements
    let elements = {};
    
    // Initialize
    function init() {
        // Get DOM elements
        elements = {
            textInput: document.getElementById('textInput'),
            charCount: document.getElementById('charCount'),
            clearBtn: document.getElementById('clearBtn'),
            sampleBtn: document.getElementById('sampleBtn'),
            fontStyle: document.getElementById('fontStyle'),
            penColor: document.getElementById('penColor'),
            textSize: document.getElementById('textSize'),
            textSizeValue: document.getElementById('textSizeValue'),
            lineSpacing: document.getElementById('lineSpacing'),
            lineSpacingValue: document.getElementById('lineSpacingValue'),
            paperType: document.getElementById('paperType'),
            pageMargin: document.getElementById('pageMargin'),
            pageMarginValue: document.getElementById('pageMarginValue'),
            advancedToggle: document.getElementById('advancedToggle'),
            advancedOptions: document.getElementById('advancedOptions'),
            letterSpacing: document.getElementById('letterSpacing'),
            letterSpacingValue: document.getElementById('letterSpacingValue'),
            wordSpacing: document.getElementById('wordSpacing'),
            wordSpacingValue: document.getElementById('wordSpacingValue'),
            textAlign: document.getElementById('textAlign'),
            addShadow: document.getElementById('addShadow'),
            randomVariation: document.getElementById('randomVariation'),
            pageWidth: document.getElementById('pageWidth'),
            pageWidthValue: document.getElementById('pageWidthValue'),
            handwritingCanvas: document.getElementById('handwritingCanvas'),
            previewContainer: document.getElementById('previewContainer'),
            zoomIn: document.getElementById('zoomIn'),
            zoomOut: document.getElementById('zoomOut'),
            zoomReset: document.getElementById('zoomReset'),
            downloadPNG: document.getElementById('downloadPNG'),
            downloadPDF: document.getElementById('downloadPDF'),
            copyImage: document.getElementById('copyImage'),
            printBtn: document.getElementById('printBtn')
        };
        
        // Load Google Fonts
        loadGoogleFonts();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initial render
        updatePreview();
    }
    
    // Load Google Fonts
    function loadGoogleFonts() {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Patrick+Hand&family=Shadows+Into+Light&family=Indie+Flower&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    
    // Setup Event Listeners
    function setupEventListeners() {
        // Text input
        elements.textInput.addEventListener('input', handleTextInput);
        
        // Clear and sample buttons
        elements.clearBtn.addEventListener('click', clearText);
        elements.sampleBtn.addEventListener('click', loadSample);
        
        // Style controls
        elements.fontStyle.addEventListener('change', (e) => {
            state.fontStyle = e.target.value;
            updatePreview();
        });
        
        elements.penColor.addEventListener('input', (e) => {
            state.penColor = e.target.value;
            updatePreview();
        });
        
        // Color presets
        document.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                state.penColor = color;
                elements.penColor.value = color;
                updatePreview();
            });
        });
        
        // Range sliders
        elements.textSize.addEventListener('input', (e) => {
            state.textSize = parseInt(e.target.value);
            elements.textSizeValue.textContent = state.textSize;
            updatePreview();
        });
        
        elements.lineSpacing.addEventListener('input', (e) => {
            state.lineSpacing = parseFloat(e.target.value);
            elements.lineSpacingValue.textContent = state.lineSpacing;
            updatePreview();
        });
        
        elements.pageMargin.addEventListener('input', (e) => {
            state.pageMargin = parseInt(e.target.value);
            elements.pageMarginValue.textContent = state.pageMargin;
            updatePreview();
        });
        
        elements.letterSpacing.addEventListener('input', (e) => {
            state.letterSpacing = parseFloat(e.target.value);
            elements.letterSpacingValue.textContent = state.letterSpacing;
            updatePreview();
        });
        
        elements.wordSpacing.addEventListener('input', (e) => {
            state.wordSpacing = parseInt(e.target.value);
            elements.wordSpacingValue.textContent = state.wordSpacing;
            updatePreview();
        });
        
        elements.pageWidth.addEventListener('input', (e) => {
            state.pageWidth = parseInt(e.target.value);
            elements.pageWidthValue.textContent = state.pageWidth;
            updatePreview();
        });
        
        // Paper type
        elements.paperType.addEventListener('change', (e) => {
            state.paperType = e.target.value;
            updatePreview();
        });
        
        // Text alignment
        elements.textAlign.addEventListener('change', (e) => {
            state.textAlign = e.target.value;
            updatePreview();
        });
        
        // Checkboxes
        elements.addShadow.addEventListener('change', (e) => {
            state.addShadow = e.target.checked;
            updatePreview();
        });
        
        elements.randomVariation.addEventListener('change', (e) => {
            state.randomVariation = e.target.checked;
            updatePreview();
        });
        
        // Advanced options toggle
        elements.advancedToggle.addEventListener('click', () => {
            const isHidden = elements.advancedOptions.style.display === 'none';
            elements.advancedOptions.style.display = isHidden ? 'block' : 'none';
            elements.advancedToggle.innerHTML = isHidden ? 
                '<span>⚙️</span> Hide Advanced Options' : 
                '<span>⚙️</span> Advanced Options';
        });
        
        // Zoom controls
        elements.zoomIn.addEventListener('click', () => zoomPreview(1.2));
        elements.zoomOut.addEventListener('click', () => zoomPreview(0.8));
        elements.zoomReset.addEventListener('click', () => {
            state.zoom = 1;
            updateZoom();
        });
        
        // Download buttons
        elements.downloadPNG.addEventListener('click', downloadAsPNG);
        elements.downloadPDF.addEventListener('click', downloadAsPDF);
        elements.copyImage.addEventListener('click', copyToClipboard);
        elements.printBtn.addEventListener('click', printHandwriting);
    }
    
    // Handle text input
    function handleTextInput(e) {
        let text = e.target.value;
        
        // Limit characters
        if (text.length > CONFIG.maxChars) {
            text = text.substring(0, CONFIG.maxChars);
            e.target.value = text;
            showNotification(`Maximum ${CONFIG.maxChars} characters allowed`, 'warning');
        }
        
        state.text = text;
        elements.charCount.textContent = text.length;
        updatePreview();
    }
    
    // Clear text
    function clearText() {
        if (state.text && !confirm('Clear all text?')) return;
        
        elements.textInput.value = '';
        state.text = '';
        elements.charCount.textContent = '0';
        updatePreview();
        showNotification('Text cleared', 'success');
    }
    
    // Load sample text
    function loadSample() {
        const sampleText = `Dear Friend,

I hope this letter finds you well. I wanted to share some thoughts with you today.

Life is full of beautiful moments, and I'm grateful for every one of them. The simple joy of a sunny day, the warmth of a good conversation, and the comfort of knowing there are people who care.

Remember to take time for yourself, pursue your passions, and never stop learning. Every day is a new opportunity to grow and make a positive impact.

With warm regards,
Your Friend`;
        
        elements.textInput.value = sampleText;
        state.text = sampleText;
        elements.charCount.textContent = sampleText.length;
        updatePreview();
        showNotification('Sample text loaded', 'success');
    }
    
    // Update preview
    function updatePreview() {
        const canvas = elements.handwritingCanvas;
        
        if (!state.text) {
            canvas.innerHTML = '<div class="placeholder-text">Your handwritten text will appear here...</div>';
            return;
        }
        
        // Apply paper background
        applyPaperBackground(canvas);
        
        // Create text content
        const textContent = document.createElement('div');
        textContent.className = 'handwriting-text';
        textContent.style.fontFamily = CONFIG.fonts[state.fontStyle];
        textContent.style.color = state.penColor;
        textContent.style.fontSize = state.textSize + 'px';
        textContent.style.lineHeight = state.lineSpacing;
        textContent.style.padding = state.pageMargin + 'px';
        textContent.style.letterSpacing = state.letterSpacing + 'px';
        textContent.style.wordSpacing = state.wordSpacing + 'px';
        textContent.style.textAlign = state.textAlign;
        textContent.style.width = state.pageWidth + 'px';
        textContent.style.minHeight = '600px';
        textContent.style.boxSizing = 'border-box';
        
        if (state.addShadow) {
            textContent.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
        }
        
        // Add text with optional variation
        if (state.randomVariation) {
            textContent.innerHTML = applyRandomVariation(state.text);
        } else {
            textContent.textContent = state.text;
        }
        
        canvas.innerHTML = '';
        canvas.appendChild(textContent);
    }
    
    // Apply paper background
    function applyPaperBackground(canvas) {
        canvas.className = 'handwriting-canvas';
        
        switch(state.paperType) {
            case 'lined':
                canvas.classList.add('paper-lined');
                break;
            case 'grid':
                canvas.classList.add('paper-grid');
                break;
            case 'dotted':
                canvas.classList.add('paper-dotted');
                break;
            case 'vintage':
                canvas.classList.add('paper-vintage');
                break;
            default:
                canvas.classList.add('paper-plain');
        }
    }
    
    // Apply random variation to text
    function applyRandomVariation(text) {
        return text.split('').map(char => {
            if (char === ' ' || char === '\n') return char;
            
            const variation = Math.random() * 2 - 1; // -1 to 1
            const rotate = variation * 2; // -2 to 2 degrees
            const translateY = variation * 0.5; // -0.5 to 0.5 px
            
            return `<span style="display:inline-block;transform:rotate(${rotate}deg) translateY(${translateY}px)">${char}</span>`;
        }).join('');
    }
    
    // Zoom preview
    function zoomPreview(factor) {
        state.zoom *= factor;
        state.zoom = Math.max(0.5, Math.min(2, state.zoom)); // Limit between 0.5x and 2x
        updateZoom();
    }
    
    function updateZoom() {
        elements.handwritingCanvas.style.transform = `scale(${state.zoom})`;
        elements.handwritingCanvas.style.transformOrigin = 'top left';
        elements.zoomReset.textContent = Math.round(state.zoom * 100) + '%';
    }
    
    // Download as PNG
    async function downloadAsPNG() {
        try {
            showNotification('Generating PNG...', 'info');
            
            // Use html2canvas library
            if (typeof html2canvas === 'undefined') {
                await loadHtml2Canvas();
            }
            
            const canvas = await html2canvas(elements.handwritingCanvas, {
                backgroundColor: getBackgroundColor(),
                scale: 2, // Higher quality
                logging: false
            });
            
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `handwriting-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showNotification('Downloaded as PNG!', 'success');
            });
        } catch (error) {
            console.error('PNG download error:', error);
            showNotification('Failed to download PNG', 'error');
        }
    }
    
    // Download as PDF
    async function downloadAsPDF() {
        try {
            showNotification('Generating PDF...', 'info');
            
            // Use jsPDF library
            if (typeof jspdf === 'undefined') {
                await loadJsPDF();
            }
            
            if (typeof html2canvas === 'undefined') {
                await loadHtml2Canvas();
            }
            
            const canvas = await html2canvas(elements.handwritingCanvas, {
                backgroundColor: getBackgroundColor(),
                scale: 2,
                logging: false
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`handwriting-${Date.now()}.pdf`);
            
            showNotification('Downloaded as PDF!', 'success');
        } catch (error) {
            console.error('PDF download error:', error);
            showNotification('Failed to download PDF', 'error');
        }
    }
    
    // Copy to clipboard
    async function copyToClipboard() {
        try {
            showNotification('Copying to clipboard...', 'info');
            
            if (typeof html2canvas === 'undefined') {
                await loadHtml2Canvas();
            }
            
            const canvas = await html2canvas(elements.handwritingCanvas, {
                backgroundColor: getBackgroundColor(),
                scale: 2,
                logging: false
            });
            
            canvas.toBlob(async blob => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    showNotification('Copied to clipboard!', 'success');
                } catch (err) {
                    showNotification('Clipboard copy not supported', 'error');
                }
            });
        } catch (error) {
            console.error('Clipboard error:', error);
            showNotification('Failed to copy to clipboard', 'error');
        }
    }
    
    // Print handwriting
    function printHandwriting() {
        const printWindow = window.open('', '_blank');
        const content = elements.handwritingCanvas.cloneNode(true);
        content.style.transform = 'none';
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Handwriting</title>
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Patrick+Hand&family=Shadows+Into+Light&family=Indie+Flower&display=swap" rel="stylesheet">
                <style>
                    body { margin: 0; padding: 20px; }
                    .handwriting-canvas { margin: 0 auto; }
                    @media print {
                        body { padding: 0; }
                        .handwriting-canvas { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                ${content.outerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    }
    
    // Get background color based on paper type
    function getBackgroundColor() {
        switch(state.paperType) {
            case 'vintage':
                return '#f4e8d0';
            default:
                return '#ffffff';
        }
    }
    
    // Load html2canvas library
    function loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (typeof html2canvas !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Load jsPDF library
    function loadJsPDF() {
        return new Promise((resolve, reject) => {
            if (typeof jspdf !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
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
