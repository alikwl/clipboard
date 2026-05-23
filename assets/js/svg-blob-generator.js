// SVG Blob Generator
let currentBlob = null;
let isDarkBg = false;
let currentExample = 'html';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    generateBlob();
    updateBlob();
    showExample('html');
});

// Generate new blob
function generateBlob() {
    const complexity = parseInt(document.getElementById('complexitySlider').value);
    const randomness = parseInt(document.getElementById('randomnessSlider').value) / 100;
    
    currentBlob = createBlobPath(complexity, randomness);
    return currentBlob;
}

// Create blob path using Bézier curves
function createBlobPath(numPoints, randomness) {
    const points = [];
    const angleStep = (Math.PI * 2) / numPoints;
    const radius = 200; // Base radius
    
    // Generate points around a circle with randomness
    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep;
        const randomFactor = 1 + (Math.random() - 0.5) * randomness;
        const r = radius * randomFactor;
        
        const x = 250 + r * Math.cos(angle);
        const y = 250 + r * Math.sin(angle);
        
        points.push({ x, y });
    }
    
    // Create smooth path using Bézier curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < numPoints; i++) {
        const current = points[i];
        const next = points[(i + 1) % numPoints];
        const nextNext = points[(i + 2) % numPoints];
        
        // Calculate control points for smooth curves
        const cp1x = current.x + (next.x - current.x) * 0.5;
        const cp1y = current.y + (next.y - current.y) * 0.5;
        const cp2x = next.x - (nextNext.x - current.x) * 0.15;
        const cp2y = next.y - (nextNext.y - current.y) * 0.15;
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    
    path += ' Z';
    return path;
}

// Update blob display
function updateBlob() {
    const size = document.getElementById('sizeSlider').value;
    const fillType = document.getElementById('fillType').value;
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    const angle = document.getElementById('angleSlider').value;
    
    // Update value displays
    document.getElementById('complexityValue').textContent = document.getElementById('complexitySlider').value;
    document.getElementById('randomnessValue').textContent = document.getElementById('randomnessSlider').value + '%';
    document.getElementById('sizeValue').textContent = size + 'px';
    document.getElementById('angleValue').textContent = angle + '°';
    
    // Show/hide gradient controls
    const color2Group = document.getElementById('color2Group');
    const angleGroup = document.getElementById('angleGroup');
    const color1Label = document.getElementById('color1Label');
    
    if (fillType === 'solid') {
        color2Group.style.display = 'none';
        angleGroup.style.display = 'none';
        color1Label.textContent = 'Fill Color';
    } else {
        color2Group.style.display = 'block';
        color1Label.textContent = 'Gradient Color 1';
        angleGroup.style.display = fillType === 'gradient' ? 'block' : 'none';
    }
    
    // Update SVG
    const svg = document.getElementById('blobSVG');
    const path = document.getElementById('blobPath');
    const defs = document.getElementById('svgDefs');
    
    svg.style.width = size + 'px';
    svg.style.height = size + 'px';
    
    if (!currentBlob) {
        generateBlob();
    }
    
    path.setAttribute('d', currentBlob);
    
    // Set fill based on type
    if (fillType === 'solid') {
        path.setAttribute('fill', color1);
        defs.innerHTML = '';
    } else if (fillType === 'gradient') {
        const gradientId = 'linearGrad';
        const angleRad = (angle - 90) * (Math.PI / 180);
        const x2 = 50 + 50 * Math.cos(angleRad);
        const y2 = 50 + 50 * Math.sin(angleRad);
        
        defs.innerHTML = `
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="${x2}%" y2="${y2}%">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
            </linearGradient>
        `;
        path.setAttribute('fill', `url(#${gradientId})`);
    } else if (fillType === 'radial') {
        const gradientId = 'radialGrad';
        defs.innerHTML = `
            <radialGradient id="${gradientId}">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
            </radialGradient>
        `;
        path.setAttribute('fill', `url(#${gradientId})`);
    }
    
    // Update code display
    updateSVGCode();
    updateExampleCode();
}

// Randomize blob
function randomizeBlob() {
    generateBlob();
    updateBlob();
}

// Toggle background
function toggleBackground() {
    isDarkBg = !isDarkBg;
    const container = document.getElementById('previewContainer');
    const btn = document.getElementById('bgToggle');
    
    if (isDarkBg) {
        container.style.background = '#1a202c';
        btn.textContent = '☀️ Light';
    } else {
        container.style.background = '#f7fafc';
        btn.textContent = '🌙 Dark';
    }
}

// Set color presets
function setColor1(color) {
    document.getElementById('color1').value = color;
    updateBlob();
}

function setColor2(color) {
    document.getElementById('color2').value = color;
    updateBlob();
}

// Apply presets
function applyPreset(preset) {
    switch(preset) {
        case 'simple':
            setValues(4, 30, 400, 'solid', '#667eea', '#764ba2', 45);
            break;
        case 'organic':
            setValues(6, 50, 400, 'gradient', '#667eea', '#764ba2', 45);
            break;
        case 'complex':
            setValues(10, 50, 400, 'radial', '#f093fb', '#f5576c', 45);
            break;
        case 'smooth':
            setValues(6, 20, 400, 'gradient', '#4facfe', '#00f2fe', 135);
            break;
        case 'wild':
            setValues(8, 80, 400, 'radial', '#43e97b', '#38f9d7', 45);
            break;
    }
    generateBlob();
    updateBlob();
}

// Set values
function setValues(complexity, randomness, size, fillType, color1, color2, angle) {
    document.getElementById('complexitySlider').value = complexity;
    document.getElementById('randomnessSlider').value = randomness;
    document.getElementById('sizeSlider').value = size;
    document.getElementById('fillType').value = fillType;
    document.getElementById('color1').value = color1;
    document.getElementById('color2').value = color2;
    document.getElementById('angleSlider').value = angle;
}

// Update SVG code display
function updateSVGCode() {
    const svg = document.getElementById('blobSVG');
    const svgString = new XMLSerializer().serializeToString(svg);
    const formatted = formatXML(svgString);
    document.getElementById('svgCode').innerHTML = `<code>${escapeHtml(formatted)}</code>`;
}

// Download SVG
function downloadSVG() {
    const svg = document.getElementById('blobSVG');
    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blob-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
}

// Copy SVG code
function copySVGCode() {
    const code = document.getElementById('svgCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Show example code
function showExample(type) {
    currentExample = type;
    const tabs = document.querySelectorAll('.example-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === type) {
            tab.classList.add('active');
        }
    });
    updateExampleCode();
}

// Update example code
function updateExampleCode() {
    const svg = document.getElementById('blobSVG');
    const svgString = new XMLSerializer().serializeToString(svg);
    let code = '';
    
    switch(currentExample) {
        case 'html':
            code = `<!-- Inline SVG -->\n${formatXML(svgString)}`;
            break;
        case 'css':
            const base64 = btoa(svgString);
            code = `.blob-background {\n  background-image: url('data:image/svg+xml;base64,${base64}');\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}`;
            break;
        case 'react':
            code = `import React from 'react';\n\nconst BlobShape = () => (\n  ${formatXML(svgString).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')}\n);\n\nexport default BlobShape;`;
            break;
    }
    
    document.getElementById('exampleCode').innerHTML = `<code>${escapeHtml(code)}</code>`;
}

// Copy example code
function copyExampleCode() {
    const code = document.getElementById('exampleCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Example code copied!');
    });
}

// Utility functions
function formatXML(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;
    
    xml = xml.replace(reg, '$1\n$2$3');
    
    return xml.split('\n').map((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/) && pad > 0) {
            pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }
        
        pad += indent;
        return PADDING.repeat(pad - indent) + node;
    }).join('\n');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
