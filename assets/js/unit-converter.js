const units = {
  length: {
    units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
    toBase: {
      'Meters': 1,
      'Kilometers': 1000,
      'Centimeters': 0.01,
      'Millimeters': 0.001,
      'Miles': 1609.34,
      'Yards': 0.9144,
      'Feet': 0.3048,
      'Inches': 0.0254
    }
  },
  weight: {
    units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Tons'],
    toBase: {
      'Kilograms': 1,
      'Grams': 0.001,
      'Milligrams': 0.000001,
      'Pounds': 0.453592,
      'Ounces': 0.0283495,
      'Tons': 1000
    }
  },
  temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    convert: (value, from, to) => {
      let celsius;
      if (from === 'Celsius') celsius = value;
      else if (from === 'Fahrenheit') celsius = (value - 32) * 5/9;
      else celsius = value - 273.15;
      
      if (to === 'Celsius') return celsius;
      else if (to === 'Fahrenheit') return celsius * 9/5 + 32;
      else return celsius + 273.15;
    }
  },
  volume: {
    units: ['Liters', 'Milliliters', 'Gallons', 'Quarts', 'Pints', 'Cups', 'Fluid Ounces'],
    toBase: {
      'Liters': 1,
      'Milliliters': 0.001,
      'Gallons': 3.78541,
      'Quarts': 0.946353,
      'Pints': 0.473176,
      'Cups': 0.236588,
      'Fluid Ounces': 0.0295735
    }
  },
  area: {
    units: ['Square Meters', 'Square Kilometers', 'Square Feet', 'Square Miles', 'Acres', 'Hectares'],
    toBase: {
      'Square Meters': 1,
      'Square Kilometers': 1000000,
      'Square Feet': 0.092903,
      'Square Miles': 2589988,
      'Acres': 4046.86,
      'Hectares': 10000
    }
  },
  speed: {
    units: ['Meters/Second', 'Kilometers/Hour', 'Miles/Hour', 'Feet/Second', 'Knots'],
    toBase: {
      'Meters/Second': 1,
      'Kilometers/Hour': 0.277778,
      'Miles/Hour': 0.44704,
      'Feet/Second': 0.3048,
      'Knots': 0.514444
    }
  },
  time: {
    units: ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years'],
    toBase: {
      'Seconds': 1,
      'Minutes': 60,
      'Hours': 3600,
      'Days': 86400,
      'Weeks': 604800,
      'Months': 2592000,
      'Years': 31536000
    }
  },
  data: {
    units: ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes'],
    toBase: {
      'Bytes': 1,
      'Kilobytes': 1024,
      'Megabytes': 1048576,
      'Gigabytes': 1073741824,
      'Terabytes': 1099511627776
    }
  }
};

function updateUnits() {
  const category = document.getElementById('categorySelect').value;
  const unitList = units[category].units;
  
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');
  
  fromUnit.innerHTML = '';
  toUnit.innerHTML = '';
  
  unitList.forEach(unit => {
    fromUnit.add(new Option(unit, unit));
    toUnit.add(new Option(unit, unit));
  });
  
  toUnit.selectedIndex = Math.min(1, unitList.length - 1);
  convert();
  updateCommonConversions();
}

function convert() {
  const category = document.getElementById('categorySelect').value;
  const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
  const fromUnit = document.getElementById('fromUnit').value;
  const toUnit = document.getElementById('toUnit').value;
  
  let result;
  
  if (category === 'temperature') {
    result = units[category].convert(fromValue, fromUnit, toUnit);
  } else {
    const toBase = units[category].toBase;
    const baseValue = fromValue * toBase[fromUnit];
    result = baseValue / toBase[toUnit];
  }
  
  document.getElementById('toValue').value = result.toFixed(6).replace(/\.?0+$/, '');
}

function swapUnits() {
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');
  const fromValue = document.getElementById('fromValue');
  const toValue = document.getElementById('toValue');
  
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
  fromValue.value = toValue.value;
  convert();
}

function updateCommonConversions() {
  const category = document.getElementById('categorySelect').value;
  const commonList = document.getElementById('commonList');
  const unitList = units[category].units;
  
  commonList.innerHTML = '';
  
  for (let i = 0; i < Math.min(3, unitList.length - 1); i++) {
    const from = unitList[i];
    const to = unitList[i + 1];
    const div = document.createElement('div');
    div.className = 'common-item';
    div.textContent = `1 ${from} = `;
    
    if (category === 'temperature') {
      const result = units[category].convert(1, from, to);
      div.textContent += `${result.toFixed(2)} ${to}`;
    } else {
      const toBase = units[category].toBase;
      const result = toBase[from] / toBase[to];
      div.textContent += `${result.toFixed(4)} ${to}`;
    }
    
    commonList.appendChild(div);
  }
}

document.getElementById('fromValue').addEventListener('input', convert);
document.getElementById('fromUnit').addEventListener('change', convert);
document.getElementById('toUnit').addEventListener('change', convert);

updateUnits();
