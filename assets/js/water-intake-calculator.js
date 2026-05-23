// Water Intake Calculator
(function() {
  const weightInput = document.getElementById('weight');
  const weightUnitSelect = document.getElementById('weightUnit');
  const activitySelect = document.getElementById('activity');
  const climateSelect = document.getElementById('climate');
  const waterAmountDisplay = document.getElementById('waterAmount');
  const waterLitersDisplay = document.getElementById('waterLiters');
  const cupsVisualDisplay = document.getElementById('cupsVisual');
  const cupsCountDisplay = document.getElementById('cupsCount');
  const shareBtn = document.getElementById('shareBtn');
  
  function calculateWater() {
    let weight = parseFloat(weightInput.value) || 150;
    const unit = weightUnitSelect.value;
    const activity = parseInt(activitySelect.value) || 0;
    const climate = parseInt(climateSelect.value) || 0;
    
    // Convert kg to lbs if needed
    if (unit === 'kg') {
      weight = weight * 2.20462;
    }
    
    // Base formula: weight (lbs) × 0.5 = oz per day
    let waterOz = weight * 0.5;
    
    // Add for activity
    waterOz += activity;
    
    // Add for climate
    waterOz += climate;
    
    // Round to nearest whole number
    waterOz = Math.round(waterOz);
    
    // Convert to liters
    const waterLiters = (waterOz / 33.814).toFixed(1);
    
    // Calculate cups (8oz each)
    const cups = Math.round(waterOz / 8);
    
    // Update displays
    if (waterAmountDisplay) {
      waterAmountDisplay.textContent = waterOz;
      waterAmountDisplay.style.fontSize = '72px';
      waterAmountDisplay.style.fontWeight = 'bold';
      waterAmountDisplay.style.color = '#4facfe';
    }
    
    if (waterLitersDisplay) {
      waterLitersDisplay.textContent = waterLiters;
    }
    
    if (cupsVisualDisplay) {
      const cupEmojis = '💧'.repeat(Math.min(cups, 12));
      cupsVisualDisplay.textContent = cupEmojis;
      cupsVisualDisplay.style.fontSize = '32px';
    }
    
    if (cupsCountDisplay) {
      cupsCountDisplay.textContent = cups;
    }
    
    // Store for sharing
    window.waterResult = {
      oz: waterOz,
      liters: waterLiters,
      cups: cups
    };
  }
  
  // Event listeners
  if (weightInput) weightInput.addEventListener('input', calculateWater);
  if (weightUnitSelect) weightUnitSelect.addEventListener('change', calculateWater);
  if (activitySelect) activitySelect.addEventListener('change', calculateWater);
  if (climateSelect) climateSelect.addEventListener('change', calculateWater);
  
  // Share button
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const result = window.waterResult;
      if (!result) return;
      
      const text = `I should drink ${result.oz} oz (${result.liters}L) of water daily! 💧`;
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({ title: 'Water Intake', text: text, url: url })
          .catch(() => copyToClipboard(text + ' ' + url));
      } else {
        copyToClipboard(text + ' ' + url);
      }
    });
  }
  
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (shareBtn) {
      const originalText = shareBtn.textContent;
      shareBtn.textContent = '✓ Copied!';
      setTimeout(() => shareBtn.textContent = originalText, 2000);
    }
  }
  
  // Initial calculation
  calculateWater();
})();
