// Glassmorphism CSS Generator
let isDarkMode = true;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateGlass();
});

// Update glass effect
function updateGlass() {
    const blur = document.getElementById('blurSlider').value;
    const transparency = document.getElementById('transparencySlider').value;
    const saturation = document.getElementById('saturationSlider').value;
    const glassColor = document.getElementById('glassColor').value;
    const borderWidth = document.getElementById('borderSlider').value;
    const borderColor = document.getElementById('borderColor').value;
    const borderOpacity = document.getElementById('borderOpacitySlider').value;
    const radius = document.getElementById('radiusSlider').value;
    const shadow = document.getElementById('shadowSelect').value;
    
    // Update value displays
    document.getElementById('blurValue').textContent = blur + 'px';
    document.getElementById('transparencyValue').textContent = transparency + '%';
    document.getElementById('saturationValue').textContent = saturation + '%';
    document.getElementById('borderValue').textContent = borderWidth + 'px';
    document.getElementById('borderOpacityValue').textContent = borderOpacity + '%';
    document.getElementById('radiusValue').textContent = radius + 'px';
    document.getElementById('shadowValue').textContent = shadow.charAt(0).toUpperCase() + shadow.slice(1);
    
    // Convert hex to rgba
    const rgba = hexToRgba(glassColor, transparency / 100);
    const borderRgba = hexToRgba(borderColor, borderOpacity / 100);
    
    // Get shadow value
    const shadowValue = getShadowValue(shadow);
    
    // Apply to preview
    const glassCard = document.getElementById('glassCard');
    glassCard.style.background = rgba;
    glassCard.style.backdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
    glassCard.style.webkitBackdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
    glassCard.style.border = `${borderWidth}px solid ${borderRgba}`;
    glassCard.style.borderRadius = `${radius}px`;
    glassCard.style.boxShadow = shadowValue;
    
    // Generate CSS code
    generateCSSCode();
}

// Toggle background mode
function toggleBackgroundMode() {
    isDarkMode = !isDarkMode;
    const container = document.getElementById('previewContainer');
    const btn = document.getElementById('modeToggle');
    
    if (isDarkMode) {
        container.classList.remove('light-mode');
        container.classList.add('dark-mode');
        btn.textContent = '☀️ Light Mode';
    } else {
        container.classList.remove('dark-mode');
        container.classList.add('light-mode');
        btn.textContent = '🌙 Dark Mode';
    }
}

// Generate CSS code
function generateCSSCode() {
    const blur = document.getElementById('blurSlider').value;
    const transparency = document.getElementById('transparencySlider').value;
    const saturation = document.getElementById('saturationSlider').value;
    const glassColor = document.getElementById('glassColor').value;
    const borderWidth = document.getElementById('borderSlider').value;
    const borderColor = document.getElementById('borderColor').value;
    const borderOpacity = document.getElementById('borderOpacitySlider').value;
    const radius = document.getElementById('radiusSlider').value;
    const shadow = document.getElementById('shadowSelect').value;
    
    const rgba = hexToRgba(glassColor, transparency / 100);
    const borderRgba = hexToRgba(borderColor, borderOpacity / 100);
    const shadowValue = getShadowValue(shadow);
    
    const css = `.glass-effect {
  /* From https://css.glass */
  background: ${rgba};
  border-radius: ${radius}px;
  box-shadow: ${shadowValue};
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  border: ${borderWidth}px solid ${borderRgba};
}`;
    
    document.getElementById('cssCode').innerHTML = `<code>${escapeHtml(css)}</code>`;
}

// Copy CSS code
function copyCSSCode() {
    const code = document.getElementById('cssCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Copy HTML code
function copyHTMLCode() {
    const code = document.getElementById('htmlCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyHTMLBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Apply presets
function applyPreset(preset) {
    switch(preset) {
        case 'default':
            setValues(10, 25, 180, '#ffffff', 1, '#ffffff', 18, 16, 'medium');
            break;
        case 'frosted':
            setValues(20, 15, 200, '#ffffff', 1.5, '#ffffff', 25, 20, 'medium');
            break;
        case 'subtle':
            setValues(5, 40, 150, '#ffffff', 0.5, '#ffffff', 10, 12, 'light');
            break;
        case 'vibrant':
            setValues(15, 20, 250, '#ffffff', 2, '#ffffff', 30, 24, 'heavy');
            break;
    }
    updateGlass();
}

// Set values
function setValues(blur, trans, sat, glass, border, borderCol, borderOp, rad, shadow) {
    document.getElementById('blurSlider').value = blur;
    document.getElementById('transparencySlider').value = trans;
    document.getElementById('saturationSlider').value = sat;
    document.getElementById('glassColor').value = glass;
    document.getElementById('borderSlider').value = border;
    document.getElementById('borderColor').value = borderCol;
    document.getElementById('borderOpacitySlider').value = borderOp;
    document.getElementById('radiusSlider').value = rad;
    document.getElementById('shadowSelect').value = shadow;
}

// Reset to default
function resetToDefault() {
    applyPreset('default');
}

// Utility functions
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getShadowValue(shadow) {
    switch(shadow) {
        case 'none':
            return 'none';
        case 'light':
            return '0 4px 6px rgba(0, 0, 0, 0.1)';
        case 'medium':
            return '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
        case 'heavy':
            return '0 12px 48px 0 rgba(31, 38, 135, 0.5)';
        default:
            return '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
