// Color Picker Enhanced - with Palette Generator and Gradient Creator

const colorInput = document.getElementById('colorInput');
const hexInput = document.getElementById('hexInput');
const colorPreview = document.getElementById('colorPreview');

// Color Conversion Functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  let h;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Main Color Picker Functions
function updateColor() {
  const hex = colorInput.value;
  const rgb = hexToRgb(hex);
  
  if (!rgb) return;
  
  hexInput.value = hex.toUpperCase();
  colorPreview.style.backgroundColor = hex;
  
  document.getElementById('rgbInput').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  document.getElementById('hslInput').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  document.getElementById('hsvInput').value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  
  generateShades(hsl);
  generateHarmonies(hsl);
}

function generateShades(hsl) {
  const shadesGrid = document.getElementById('shadesGrid');
  if (!shadesGrid) return;
  
  shadesGrid.innerHTML = '';
  
  const lightnesses = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  lightnesses.forEach(l => {
    const hex = hslToHex(hsl.h, hsl.s, l);
    const shade = document.createElement('div');
    shade.className = 'shade-box';
    shade.style.backgroundColor = hex;
    shade.title = hex;
    shade.setAttribute('role', 'button');
    shade.setAttribute('tabindex', '0');
    shade.onclick = () => {
      colorInput.value = hex;
      updateColor();
    };
    shade.onkeypress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        colorInput.value = hex;
        updateColor();
      }
    };
    shadesGrid.appendChild(shade);
  });
}

function generateHarmonies(hsl) {
  const baseColor = colorInput.value;
  
  // Complementary
  const comp = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  setHarmonyColors('complementary', [baseColor, comp]);
  
  // Analogous
  const ana1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const ana2 = hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
  setHarmonyColors('analogous', [ana2, baseColor, ana1]);
  
  // Triadic
  const tri1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const tri2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
  setHarmonyColors('triadic', [baseColor, tri1, tri2]);
  
  // Split Complementary
  const split1 = hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l);
  const split2 = hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l);
  setHarmonyColors('splitComplementary', [baseColor, split1, split2]);
  
  // Tetradic
  const tet1 = hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l);
  const tet2 = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  const tet3 = hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l);
  setHarmonyColors('tetradic', [baseColor, tet1, tet2, tet3]);
  
  // Monochromatic
  const mono1 = hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20));
  const mono2 = hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 10));
  const mono3 = hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 10));
  const mono4 = hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 20));
  setHarmonyColors('monochromatic', [mono1, mono2, baseColor, mono3, mono4]);
}

function setHarmonyColors(harmonyId, colors) {
  const container = document.getElementById(harmonyId);
  if (!container) return;
  
  container.innerHTML = colors.map(color => 
    `<div class="harmony-box" 
          style="background: ${color}" 
          onclick="colorInput.value='${color}'; updateColor();"
          onkeypress="if(event.key==='Enter'||event.key===' '){colorInput.value='${color}'; updateColor();}"
          role="button"
          tabindex="0"
          title="${color}">
       <span class="harmony-hex">${color}</span>
     </div>`
  ).join('');
}

function copyFormat(format) {
  const input = document.getElementById(format + 'Input');
  if (typeof copyToClipboard === 'function') {
    copyToClipboard(input.value);
  } else {
    navigator.clipboard.writeText(input.value).then(() => {
      const btn = event.target.closest('button');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
      setTimeout(() => btn.innerHTML = originalHTML, 2000);
    });
  }
}

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
  });
});

// Palette Generator Functions
function generatePalette() {
  const type = document.getElementById('paletteType').value;
  const count = parseInt(document.getElementById('paletteCount').value);
  const display = document.getElementById('paletteDisplay');
  
  let colors = [];
  
  switch(type) {
    case 'random':
      colors = generateRandomColors(count);
      break;
    case 'monochromatic':
      colors = generateMonochromaticPalette(count);
      break;
    case 'analogous':
      colors = generateAnalogousPalette(count);
      break;
    case 'complementary':
      colors = generateComplementaryPalette(count);
      break;
    case 'triadic':
      colors = generateTriadicPalette(count);
      break;
    case 'pastel':
      colors = generatePastelColors(count);
      break;
    case 'vibrant':
      colors = generateVibrantColors(count);
      break;
    case 'earth':
      colors = generateEarthTones(count);
      break;
  }
  
  displayPalette(colors);
}

function generateRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40) + 60; // 60-100%
    const l = Math.floor(Math.random() * 30) + 40; // 40-70%
    colors.push(hslToHex(h, s, l));
  }
  return colors;
}

function generateMonochromaticPalette(count) {
  const baseHue = Math.floor(Math.random() * 360);
  const colors = [];
  for (let i = 0; i < count; i++) {
    const l = 20 + (i * (60 / (count - 1)));
    colors.push(hslToHex(baseHue, 70, l));
  }
  return colors;
}

function generateAnalogousPalette(count) {
  const baseHue = Math.floor(Math.random() * 360);
  const colors = [];
  const step = 30 / (count - 1);
  for (let i = 0; i < count; i++) {
    const h = (baseHue - 15 + (i * step) + 360) % 360;
    colors.push(hslToHex(h, 70, 50));
  }
  return colors;
}

function generateComplementaryPalette(count) {
  const baseHue = Math.floor(Math.random() * 360);
  const colors = [];
  const half = Math.ceil(count / 2);
  
  for (let i = 0; i < half; i++) {
    colors.push(hslToHex(baseHue, 70, 40 + (i * 10)));
  }
  for (let i = 0; i < count - half; i++) {
    colors.push(hslToHex((baseHue + 180) % 360, 70, 40 + (i * 10)));
  }
  return colors;
}

function generateTriadicPalette(count) {
  const baseHue = Math.floor(Math.random() * 360);
  const colors = [];
  const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
  
  for (let i = 0; i < count; i++) {
    const hue = hues[i % 3];
    const l = 40 + ((i % 3) * 10);
    colors.push(hslToHex(hue, 70, l));
  }
  return colors;
}

function generatePastelColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 25; // 25-55%
    const l = Math.floor(Math.random() * 15) + 75; // 75-90%
    colors.push(hslToHex(h, s, l));
  }
  return colors;
}

function generateVibrantColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 20) + 80; // 80-100%
    const l = Math.floor(Math.random() * 20) + 45; // 45-65%
    colors.push(hslToHex(h, s, l));
  }
  return colors;
}

function generateEarthTones(count) {
  const earthHues = [20, 30, 40, 50, 60]; // Browns, oranges, greens
  const colors = [];
  for (let i = 0; i < count; i++) {
    const h = earthHues[Math.floor(Math.random() * earthHues.length)];
    const s = Math.floor(Math.random() * 30) + 30; // 30-60%
    const l = Math.floor(Math.random() * 30) + 35; // 35-65%
    colors.push(hslToHex(h, s, l));
  }
  return colors;
}

function displayPalette(colors) {
  const display = document.getElementById('paletteDisplay');
  display.innerHTML = colors.map(color => `
    <div class="palette-color">
      <div class="palette-swatch" style="background: ${color}"></div>
      <div class="palette-info">
        <span class="palette-hex">${color}</span>
        <button class="btn-sm" onclick="copyPaletteColor('${color}')">Copy</button>
      </div>
    </div>
  `).join('');
}

function copyPaletteColor(color) {
  if (typeof copyToClipboard === 'function') {
    copyToClipboard(color);
  } else {
    navigator.clipboard.writeText(color).then(() => {
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = originalText, 2000);
    });
  }
}

function exportPalette() {
  const display = document.getElementById('paletteDisplay');
  const colors = Array.from(display.querySelectorAll('.palette-hex')).map(el => el.textContent);
  
  if (colors.length === 0) {
    alert('Generate a palette first!');
    return;
  }
  
  const paletteData = {
    name: 'Color Palette',
    colors: colors,
    generated: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'color-palette.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Gradient Creator Functions
function updateGradient() {
  const color1 = document.getElementById('gradientColor1').value;
  const color2 = document.getElementById('gradientColor2').value;
  const type = document.getElementById('gradientType').value;
  const angle = document.getElementById('gradientAngle').value;
  
  document.getElementById('gradientColor1Text').value = color1;
  document.getElementById('gradientColor2Text').value = color2;
  document.getElementById('angleValue').textContent = angle + '°';
  
  const preview = document.getElementById('gradientPreview');
  const cssCode = document.getElementById('gradientCSS');
  
  let gradient;
  if (type === 'linear') {
    gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  } else {
    gradient = `radial-gradient(circle, ${color1}, ${color2})`;
  }
  
  preview.style.background = gradient;
  cssCode.value = `background: ${gradient};`;
}

function copyGradientCSS() {
  const cssCode = document.getElementById('gradientCSS').value;
  if (typeof copyToClipboard === 'function') {
    copyToClipboard(cssCode);
  } else {
    navigator.clipboard.writeText(cssCode).then(() => {
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = originalText, 2000);
    });
  }
}

// Event Listeners
hexInput.addEventListener('input', () => {
  let hex = hexInput.value;
  if (hex.match(/^#?[0-9A-Fa-f]{6}$/)) {
    if (!hex.startsWith('#')) hex = '#' + hex;
    colorInput.value = hex;
    updateColor();
  }
});

colorInput.addEventListener('input', updateColor);

// Gradient color inputs
document.getElementById('gradientColor1').addEventListener('input', (e) => {
  document.getElementById('gradientColor1Text').value = e.target.value;
  updateGradient();
});

document.getElementById('gradientColor2').addEventListener('input', (e) => {
  document.getElementById('gradientColor2Text').value = e.target.value;
  updateGradient();
});

document.getElementById('gradientColor1Text').addEventListener('input', (e) => {
  let hex = e.target.value;
  if (hex.match(/^#?[0-9A-Fa-f]{6}$/)) {
    if (!hex.startsWith('#')) hex = '#' + hex;
    document.getElementById('gradientColor1').value = hex;
    updateGradient();
  }
});

document.getElementById('gradientColor2Text').addEventListener('input', (e) => {
  let hex = e.target.value;
  if (hex.match(/^#?[0-9A-Fa-f]{6}$/)) {
    if (!hex.startsWith('#')) hex = '#' + hex;
    document.getElementById('gradientColor2').value = hex;
    updateGradient();
  }
});

// Initialize
updateColor();
updateGradient();
