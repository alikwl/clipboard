// Neumorphism Shadow Generator
let isLightMode = true;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateNeumorphism();
    updateAngleVisual();
});

// Update neumorphism effect
function updateNeumorphism() {
    const distance = document.getElementById('distanceSlider').value;
    const blur = document.getElementById('blurSlider').value;
    const angle = document.getElementById('angleSlider').value;
    const intensity = document.getElementById('intensitySlider').value;
    const radius = document.getElementById('radiusSlider').value;
    const size = document.getElementById('sizeSlider').value;
    const bgColor = document.getElementById('bgColor').value;
    const shapeType = document.getElementById('shapeType').value;
    
    // Update value displays
    document.getElementById('distanceValue').textContent = distance + 'px';
    document.getElementById('blurValue').textContent = blur + 'px';
    document.getElementById('angleValue').textContent = angle + '°';
    document.getElementById('intensityValue').textContent = intensity + '%';
    document.getElementById('radiusValue').textContent = radius + 'px';
    document.getElementById('sizeValue').textContent = size + 'px';
    
    // Calculate shadow positions based on angle
    const angleRad = (angle * Math.PI) / 180;
    const lightX = Math.cos(angleRad) * distance;
    const lightY = Math.sin(angleRad) * distance;
    const darkX = -lightX;
    const darkY = -lightY;
    
    // Calculate shadow colors based on background
    const { light, dark } = calculateShadowColors(bgColor, intensity);
    
    // Generate shadows based on shape type
    let boxShadow;
    switch(shapeType) {
        case 'concave':
            // Inverted shadows for pressed effect
            boxShadow = `inset ${lightX}px ${lightY}px ${blur}px ${dark}, 
                        inset ${darkX}px ${darkY}px ${blur}px ${light}`;
            break;
        case 'convex':
            // Stronger raised effect
            boxShadow = `${lightX}px ${lightY}px ${blur}px ${light}, 
                        ${darkX}px ${darkY}px ${blur}px ${dark},
                        ${lightX * 0.5}px ${lightY * 0.5}px ${blur * 0.5}px ${light}`;
            break;
        default: // flat
            boxShadow = `${lightX}px ${lightY}px ${blur}px ${light}, 
                        ${darkX}px ${darkY}px ${blur}px ${dark}`;
    }
    
    // Apply to preview
    const element = document.getElementById('neumorphicElement');
    const container = document.getElementById('previewContainer');
    
    element.style.width = size + 'px';
    element.style.height = size + 'px';
    element.style.background = bgColor;
    element.style.boxShadow = boxShadow;
    element.style.borderRadius = radius + 'px';
    
    container.style.background = bgColor;
    
    // Update angle visual
    updateAngleVisual();
    
    // Generate CSS code
    generateCSSCode();
}

// Calculate shadow colors
function calculateShadowColors(bgColor, intensity) {
    const rgb = hexToRgb(bgColor);
    const factor = intensity / 100;
    
    // Light shadow (lighter than background)
    const lightR = Math.min(255, rgb.r + (255 - rgb.r) * factor * 2);
    const lightG = Math.min(255, rgb.g + (255 - rgb.g) * factor * 2);
    const lightB = Math.min(255, rgb.b + (255 - rgb.b) * factor * 2);
    
    // Dark shadow (darker than background)
    const darkR = Math.max(0, rgb.r - rgb.r * factor * 2);
    const darkG = Math.max(0, rgb.g - rgb.g * factor * 2);
    const darkB = Math.max(0, rgb.b - rgb.b * factor * 2);
    
    return {
        light: `rgba(${Math.round(lightR)}, ${Math.round(lightG)}, ${Math.round(lightB)}, 0.6)`,
        dark: `rgba(${Math.round(darkR)}, ${Math.round(darkG)}, ${Math.round(darkB)}, 0.5)`
    };
}

// Update angle visual indicator
function updateAngleVisual() {
    const angle = document.getElementById('angleSlider').value;
    const indicator = document.querySelector('.angle-indicator');
    if (indicator) {
        indicator.style.transform = `rotate(${angle}deg)`;
    }
}

// Toggle background mode
function toggleBackgroundMode() {
    isLightMode = !isLightMode;
    const btn = document.getElementById('modeToggle');
    
    if (isLightMode) {
        btn.textContent = '🌙 Dark Mode';
        document.getElementById('bgColor').value = '#e0e5ec';
    } else {
        btn.textContent = '☀️ Light Mode';
        document.getElementById('bgColor').value = '#2d3748';
    }
    
    updateNeumorphism();
}

// Set color preset
function setColor(color) {
    document.getElementById('bgColor').value = color;
    updateNeumorphism();
}

// Generate CSS code
function generateCSSCode() {
    const distance = document.getElementById('distanceSlider').value;
    const blur = document.getElementById('blurSlider').value;
    const angle = document.getElementById('angleSlider').value;
    const intensity = document.getElementById('intensitySlider').value;
    const radius = document.getElementById('radiusSlider').value;
    const bgColor = document.getElementById('bgColor').value;
    const shapeType = document.getElementById('shapeType').value;
    
    // Calculate shadow positions
    const angleRad = (angle * Math.PI) / 180;
    const lightX = Math.round(Math.cos(angleRad) * distance);
    const lightY = Math.round(Math.sin(angleRad) * distance);
    const darkX = -lightX;
    const darkY = -lightY;
    
    // Calculate shadow colors
    const { light, dark } = calculateShadowColors(bgColor, intensity);
    
    // Generate box-shadow based on shape type
    let boxShadow;
    let comment = '';
    
    switch(shapeType) {
        case 'concave':
            boxShadow = `inset ${lightX}px ${lightY}px ${blur}px ${dark},
         inset ${darkX}px ${darkY}px ${blur}px ${light}`;
            comment = '  /* Concave (Pressed) Effect */\n';
            break;
        case 'convex':
            boxShadow = `${lightX}px ${lightY}px ${blur}px ${light},
         ${darkX}px ${darkY}px ${blur}px ${dark},
         ${Math.round(lightX * 0.5)}px ${Math.round(lightY * 0.5)}px ${Math.round(blur * 0.5)}px ${light}`;
            comment = '  /* Convex (Raised) Effect */\n';
            break;
        default:
            boxShadow = `${lightX}px ${lightY}px ${blur}px ${light},
         ${darkX}px ${darkY}px ${blur}px ${dark}`;
            comment = '  /* Flat (Default) Effect */\n';
    }
    
    const css = `.neumorphic {
${comment}  background: ${bgColor};
  border-radius: ${radius}px;
  box-shadow: ${boxShadow};
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
        case 'soft':
            setValues(10, 20, 145, 10, 50, 200, '#e0e5ec', 'flat');
            break;
        case 'medium':
            setValues(15, 30, 145, 15, 50, 200, '#e0e5ec', 'flat');
            break;
        case 'deep':
            setValues(25, 50, 145, 20, 50, 200, '#e0e5ec', 'flat');
            break;
        case 'flat':
            setValues(8, 15, 145, 8, 50, 200, '#e0e5ec', 'flat');
            break;
    }
    updateNeumorphism();
}

// Set values
function setValues(distance, blur, angle, intensity, radius, size, bgColor, shapeType) {
    document.getElementById('distanceSlider').value = distance;
    document.getElementById('blurSlider').value = blur;
    document.getElementById('angleSlider').value = angle;
    document.getElementById('intensitySlider').value = intensity;
    document.getElementById('radiusSlider').value = radius;
    document.getElementById('sizeSlider').value = size;
    document.getElementById('bgColor').value = bgColor;
    document.getElementById('shapeType').value = shapeType;
}

// Reset to default
function resetToDefault() {
    applyPreset('medium');
}

// Utility functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 224, g: 229, b: 236 };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
