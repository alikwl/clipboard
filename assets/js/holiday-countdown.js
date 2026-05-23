// Holiday Countdown Timer
(function() {
  const holidaySelect = document.getElementById('holidaySelect');
  const daysDisplay = document.getElementById('days');
  const hoursDisplay = document.getElementById('hours');
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  const holidayDateDisplay = document.getElementById('holidayDate');
  const holidayIconDisplay = document.getElementById('holidayIcon');
  const shareBtn = document.getElementById('shareBtn');
  
  let countdownInterval;
  
  const holidays = {
    christmas: { date: '12/25', name: 'Christmas', icon: '🎄' },
    newyear: { date: '01/01', name: "New Year's Day", icon: '🎆' },
    halloween: { date: '10/31', name: 'Halloween', icon: '🎃' },
    thanksgiving: { date: '11/27', name: 'Thanksgiving', icon: '🦃' },
    easter: { date: '04/20', name: 'Easter', icon: '🐰' },
    valentines: { date: '02/14', name: "Valentine's Day", icon: '💝' },
    july4: { date: '07/04', name: 'Independence Day', icon: '🎆' },
    memorial: { date: '05/26', name: 'Memorial Day', icon: '🇺🇸' },
    labor: { date: '09/01', name: 'Labor Day', icon: '⚒️' }
  };
  
  function getHolidayDate(holidayKey) {
    const holiday = holidays[holidayKey];
    const now = new Date();
    const currentYear = now.getFullYear();
    const [month, day] = holiday.date.split('/');
    
    let holidayDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    
    // If holiday has passed this year, use next year
    if (holidayDate < now) {
      holidayDate = new Date(currentYear + 1, parseInt(month) - 1, parseInt(day));
    }
    
    return holidayDate;
  }
  
  function updateCountdown() {
    const selectedHoliday = holidaySelect.value;
    const holiday = holidays[selectedHoliday];
    const targetDate = getHolidayDate(selectedHoliday);
    const now = new Date();
    
    const difference = targetDate - now;
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      if (daysDisplay) daysDisplay.textContent = days;
      if (hoursDisplay) hoursDisplay.textContent = hours;
      if (minutesDisplay) minutesDisplay.textContent = minutes;
      if (secondsDisplay) secondsDisplay.textContent = seconds;
      
      // Style the numbers
      [daysDisplay, hoursDisplay, minutesDisplay, secondsDisplay].forEach(el => {
        if (el) {
          el.style.fontSize = '48px';
          el.style.fontWeight = 'bold';
          el.style.color = '#667eea';
        }
      });
    } else {
      if (daysDisplay) daysDisplay.textContent = '0';
      if (hoursDisplay) hoursDisplay.textContent = '0';
      if (minutesDisplay) minutesDisplay.textContent = '0';
      if (secondsDisplay) secondsDisplay.textContent = '0';
    }
    
    // Update holiday info
    if (holidayDateDisplay) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      holidayDateDisplay.textContent = targetDate.toLocaleDateString('en-US', options);
    }
    
    if (holidayIconDisplay) {
      holidayIconDisplay.textContent = holiday.icon;
      holidayIconDisplay.style.fontSize = '80px';
    }
    
    // Store for sharing
    window.holidayResult = {
      name: holiday.name,
      days: Math.floor(difference / (1000 * 60 * 60 * 24))
    };
  }
  
  function startCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }
  
  // Event listeners
  if (holidaySelect) {
    holidaySelect.addEventListener('change', startCountdown);
  }
  
  // Share button
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const result = window.holidayResult;
      if (!result) return;
      
      const text = `Only ${result.days} days until ${result.name}! 🎉`;
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({ title: 'Holiday Countdown', text: text, url: url })
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
  
  // Start countdown on load
  startCountdown();
})();
