// Pizza Party Calculator
(function() {
  const guestsInput = document.getElementById('numGuests');
  const appetiteSelect = document.getElementById('appetiteLevel');
  const sizeSelect = document.getElementById('pizzaSize');
  const pizzaCountDisplay = document.getElementById('pizzaCount');
  const pizzaVisualDisplay = document.getElementById('pizzaVisual');
  const totalSlicesDisplay = document.getElementById('totalSlices');
  const slicesPerPersonDisplay = document.getElementById('slicesPerPerson');
  const estimatedCostDisplay = document.getElementById('estimatedCost');
  const shareBtn = document.getElementById('shareBtn');
  
  function calculatePizzas() {
    const guests = parseInt(guestsInput.value) || 1;
    const slicesPerPerson = parseInt(appetiteSelect.value) || 3;
    const slicesPerPizza = parseInt(sizeSelect.value) || 8;
    
    // Calculate total slices needed
    const totalSlicesNeeded = guests * slicesPerPerson;
    
    // Calculate number of pizzas (round up)
    const pizzasNeeded = Math.ceil(totalSlicesNeeded / slicesPerPizza);
    
    // Calculate actual total slices (after rounding up pizzas)
    const actualTotalSlices = pizzasNeeded * slicesPerPizza;
    
    // Estimate cost (average $15 per pizza)
    const estimatedCost = pizzasNeeded * 15;
    
    // Update displays
    if (pizzaCountDisplay) {
      pizzaCountDisplay.textContent = pizzasNeeded;
      pizzaCountDisplay.style.fontSize = '72px';
      pizzaCountDisplay.style.fontWeight = 'bold';
      pizzaCountDisplay.style.color = '#ff6b6b';
    }
    
    if (pizzaVisualDisplay) {
      const pizzaEmojis = '🍕'.repeat(Math.min(pizzasNeeded, 20));
      const moreText = pizzasNeeded > 20 ? ` +${pizzasNeeded - 20} more` : '';
      pizzaVisualDisplay.textContent = pizzaEmojis + moreText;
      pizzaVisualDisplay.style.fontSize = '32px';
    }
    
    if (totalSlicesDisplay) {
      totalSlicesDisplay.textContent = actualTotalSlices;
    }
    
    if (slicesPerPersonDisplay) {
      slicesPerPersonDisplay.textContent = slicesPerPerson;
    }
    
    if (estimatedCostDisplay) {
      estimatedCostDisplay.textContent = estimatedCost;
    }
    
    // Store for sharing
    window.pizzaResult = {
      guests: guests,
      pizzas: pizzasNeeded,
      slicesPerPerson: slicesPerPerson
    };
  }
  
  // Event listeners
  if (guestsInput) guestsInput.addEventListener('input', calculatePizzas);
  if (appetiteSelect) appetiteSelect.addEventListener('change', calculatePizzas);
  if (sizeSelect) sizeSelect.addEventListener('change', calculatePizzas);
  
  // Share button
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const result = window.pizzaResult;
      if (!result) return;
      
      const text = `We need ${result.pizzas} pizza${result.pizzas !== 1 ? 's' : ''} for our party of ${result.guests}! 🍕`;
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({
          title: 'Pizza Party Calculator',
          text: text,
          url: url
        }).catch(() => {
          copyToClipboard(text + ' ' + url);
        });
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
      setTimeout(() => {
        shareBtn.textContent = originalText;
      }, 2000);
    }
  }
  
  // Initial calculation
  calculatePizzas();
})();
