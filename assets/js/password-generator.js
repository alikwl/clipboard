// Password Generator - Enhanced Version with Pronounceable & Passphrase Support
// Character sets
const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
  ambiguous: '0Ol1I',
  similar: 'il1Lo0O'
};

// Pronounceable password syllables
const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
const consonantBlends = ['bl', 'br', 'ch', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sc', 'sh', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'th', 'tr', 'tw', 'wh', 'wr'];

// Word list for passphrases (common but random words)
const wordList = [
  'ability', 'able', 'about', 'above', 'accept', 'according', 'account', 'across', 'action', 'activity',
  'actually', 'address', 'admit', 'adult', 'affect', 'after', 'again', 'against', 'agency', 'agent',
  'agree', 'agreement', 'ahead', 'allow', 'almost', 'alone', 'along', 'already', 'also', 'although',
  'always', 'american', 'among', 'amount', 'analysis', 'animal', 'another', 'answer', 'anyone', 'anything',
  'appear', 'apply', 'approach', 'area', 'argue', 'around', 'arrive', 'article', 'artist', 'assume',
  'attack', 'attention', 'attorney', 'audience', 'author', 'authority', 'available', 'avoid', 'away', 'baby',
  'back', 'ball', 'bank', 'base', 'beat', 'beautiful', 'because', 'become', 'before', 'begin',
  'behavior', 'behind', 'believe', 'benefit', 'best', 'better', 'between', 'beyond', 'billion', 'black',
  'blood', 'blue', 'board', 'body', 'book', 'born', 'both', 'break', 'bring', 'brother',
  'budget', 'build', 'building', 'business', 'call', 'camera', 'campaign', 'cancer', 'candidate', 'capital',
  'card', 'care', 'career', 'carry', 'case', 'catch', 'cause', 'cell', 'center', 'central',
  'century', 'certain', 'certainly', 'chair', 'challenge', 'chance', 'change', 'character', 'charge', 'check',
  'child', 'choice', 'choose', 'church', 'citizen', 'city', 'civil', 'claim', 'class', 'clear',
  'clearly', 'close', 'coach', 'cold', 'collection', 'college', 'color', 'come', 'commercial', 'common',
  'community', 'company', 'compare', 'computer', 'concern', 'condition', 'conference', 'congress', 'consider', 'consumer',
  'contain', 'continue', 'control', 'cost', 'could', 'country', 'couple', 'course', 'court', 'cover',
  'create', 'crime', 'cultural', 'culture', 'current', 'customer', 'dark', 'data', 'daughter', 'dead',
  'deal', 'death', 'debate', 'decade', 'decide', 'decision', 'deep', 'defense', 'degree', 'democrat',
  'democratic', 'describe', 'design', 'despite', 'detail', 'determine', 'develop', 'development', 'difference', 'different',
  'difficult', 'dinner', 'direction', 'director', 'discover', 'discuss', 'discussion', 'disease', 'doctor', 'door',
  'down', 'draw', 'dream', 'drive', 'drop', 'drug', 'during', 'each', 'early', 'east',
  'easy', 'economic', 'economy', 'edge', 'education', 'effect', 'effort', 'eight', 'either', 'election',
  'else', 'employee', 'energy', 'enjoy', 'enough', 'enter', 'entire', 'environment', 'environmental', 'especially',
  'establish', 'even', 'evening', 'event', 'ever', 'every', 'everybody', 'everyone', 'everything', 'evidence',
  'exactly', 'example', 'executive', 'exist', 'expect', 'experience', 'expert', 'explain', 'face', 'fact',
  'factor', 'fail', 'fall', 'family', 'fast', 'father', 'fear', 'federal', 'feel', 'feeling',
  'field', 'fight', 'figure', 'fill', 'film', 'final', 'finally', 'financial', 'find', 'fine',
  'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'five', 'floor', 'focus', 'follow',
  'food', 'foot', 'force', 'foreign', 'forget', 'form', 'former', 'forward', 'four', 'free',
  'friend', 'from', 'front', 'full', 'fund', 'future', 'game', 'garden', 'general', 'generation',
  'girl', 'give', 'glass', 'goal', 'good', 'government', 'great', 'green', 'ground', 'group',
  'grow', 'growth', 'guess', 'gun', 'hair', 'half', 'hand', 'hang', 'happen', 'happy',
  'hard', 'have', 'head', 'health', 'hear', 'heart', 'heat', 'heavy', 'help', 'here',
  'herself', 'high', 'himself', 'history', 'hold', 'home', 'hope', 'hospital', 'hotel', 'hour',
  'house', 'however', 'huge', 'human', 'hundred', 'husband', 'idea', 'identify', 'image', 'imagine',
  'impact', 'important', 'improve', 'include', 'including', 'increase', 'indeed', 'indicate', 'individual', 'industry',
  'information', 'inside', 'instead', 'institution', 'interest', 'interesting', 'international', 'interview', 'into', 'investment',
  'involve', 'issue', 'item', 'itself', 'join', 'just', 'keep', 'kill', 'kind', 'kitchen',
  'know', 'knowledge', 'land', 'language', 'large', 'last', 'late', 'later', 'laugh', 'lawyer',
  'lead', 'leader', 'learn', 'least', 'leave', 'left', 'legal', 'less', 'letter', 'level',
  'life', 'light', 'like', 'likely', 'line', 'list', 'listen', 'little', 'live', 'local',
  'long', 'look', 'lose', 'loss', 'love', 'machine', 'magazine', 'main', 'maintain', 'major',
  'majority', 'make', 'manage', 'management', 'manager', 'many', 'market', 'marriage', 'material', 'matter',
  'maybe', 'mean', 'measure', 'media', 'medical', 'meet', 'meeting', 'member', 'memory', 'mention',
  'message', 'method', 'middle', 'might', 'military', 'million', 'mind', 'minute', 'miss', 'mission',
  'model', 'modern', 'moment', 'money', 'month', 'more', 'morning', 'most', 'mother', 'mouth',
  'move', 'movement', 'movie', 'much', 'music', 'must', 'myself', 'name', 'nation', 'national',
  'natural', 'nature', 'near', 'nearly', 'necessary', 'need', 'network', 'never', 'news', 'newspaper',
  'next', 'nice', 'night', 'none', 'north', 'note', 'nothing', 'notice', 'number', 'occur',
  'offer', 'office', 'officer', 'official', 'often', 'once', 'only', 'onto', 'open', 'operation',
  'opportunity', 'option', 'order', 'organization', 'other', 'others', 'outside', 'over', 'owner', 'page',
  'pain', 'painting', 'paper', 'parent', 'part', 'participant', 'particular', 'particularly', 'partner', 'party',
  'pass', 'past', 'patient', 'pattern', 'peace', 'people', 'perform', 'performance', 'perhaps', 'period',
  'person', 'personal', 'phone', 'physical', 'pick', 'picture', 'piece', 'place', 'plan', 'plant',
  'play', 'player', 'point', 'police', 'policy', 'political', 'politics', 'poor', 'popular', 'population',
  'position', 'positive', 'possible', 'power', 'practice', 'prepare', 'present', 'president', 'pressure', 'pretty',
  'prevent', 'price', 'private', 'probably', 'problem', 'process', 'produce', 'product', 'production', 'professional',
  'professor', 'program', 'project', 'property', 'protect', 'prove', 'provide', 'public', 'pull', 'purpose',
  'push', 'quality', 'question', 'quickly', 'quite', 'race', 'radio', 'raise', 'range', 'rate',
  'rather', 'reach', 'read', 'ready', 'real', 'reality', 'realize', 'really', 'reason', 'receive',
  'recent', 'recently', 'recognize', 'record', 'reduce', 'reflect', 'region', 'relate', 'relationship', 'religious',
  'remain', 'remember', 'remove', 'report', 'represent', 'republican', 'require', 'research', 'resource', 'respond',
  'response', 'responsibility', 'rest', 'result', 'return', 'reveal', 'rich', 'right', 'rise', 'risk',
  'road', 'rock', 'role', 'room', 'rule', 'safe', 'same', 'save', 'scene', 'school',
  'science', 'scientist', 'score', 'season', 'seat', 'second', 'section', 'security', 'seek', 'seem',
  'sell', 'send', 'senior', 'sense', 'series', 'serious', 'serve', 'service', 'seven', 'several',
  'shake', 'share', 'shoot', 'short', 'shot', 'should', 'shoulder', 'show', 'side', 'sign',
  'significant', 'similar', 'simple', 'simply', 'since', 'sing', 'single', 'sister', 'site', 'situation',
  'size', 'skill', 'skin', 'small', 'smile', 'social', 'society', 'soldier', 'some', 'somebody',
  'someone', 'something', 'sometimes', 'song', 'soon', 'sort', 'sound', 'source', 'south', 'southern',
  'space', 'speak', 'special', 'specific', 'speech', 'spend', 'sport', 'spring', 'staff', 'stage',
  'stand', 'standard', 'star', 'start', 'state', 'statement', 'station', 'stay', 'step', 'still',
  'stock', 'stop', 'store', 'story', 'strategy', 'street', 'strong', 'structure', 'student', 'study',
  'stuff', 'style', 'subject', 'success', 'successful', 'such', 'suddenly', 'suffer', 'suggest', 'summer',
  'support', 'sure', 'surface', 'system', 'table', 'take', 'talk', 'task', 'teach', 'teacher',
  'team', 'technology', 'television', 'tell', 'tend', 'term', 'test', 'than', 'thank', 'that',
  'their', 'them', 'themselves', 'then', 'theory', 'there', 'these', 'they', 'thing', 'think',
  'third', 'this', 'those', 'though', 'thought', 'thousand', 'threat', 'three', 'through', 'throughout',
  'throw', 'thus', 'time', 'today', 'together', 'tonight', 'total', 'tough', 'toward', 'town',
  'trade', 'traditional', 'training', 'travel', 'treat', 'treatment', 'tree', 'trial', 'trip', 'trouble',
  'true', 'truth', 'turn', 'type', 'under', 'understand', 'unit', 'until', 'upon', 'usually',
  'value', 'various', 'very', 'victim', 'view', 'violence', 'visit', 'voice', 'vote', 'wait',
  'walk', 'wall', 'want', 'watch', 'water', 'weapon', 'wear', 'week', 'weight', 'well',
  'west', 'western', 'what', 'whatever', 'when', 'where', 'whether', 'which', 'while', 'white',
  'whole', 'whom', 'whose', 'wide', 'wife', 'will', 'wind', 'window', 'wish', 'with',
  'within', 'without', 'woman', 'wonder', 'word', 'work', 'worker', 'world', 'worry', 'would',
  'write', 'writer', 'wrong', 'yard', 'yeah', 'year', 'young', 'your', 'yourself'
];

// Current password type
let currentType = 'random';

// DOM elements
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const passwordOutput = document.getElementById('passwordOutput');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const strengthDetails = document.getElementById('strengthDetails');
const crackTime = document.getElementById('crackTime');
const copyBtn = document.getElementById('copyBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const generateBulkBtn = document.getElementById('generateBulkBtn');
const copyBulkBtn = document.getElementById('copyBulkBtn');
const downloadBulkBtn = document.getElementById('downloadBulkBtn');
const bulkCountDisplay = document.getElementById('bulkCountDisplay');

// Type selector buttons
const randomTypeBtn = document.getElementById('randomTypeBtn');
const pronounceableTypeBtn = document.getElementById('pronounceableTypeBtn');
const passphraseTypeBtn = document.getElementById('passphraseTypeBtn');

// Options containers
const randomOptions = document.getElementById('randomOptions');
const pronounceableOptions = document.getElementById('pronounceableOptions');
const passphraseOptions = document.getElementById('passphraseOptions');

// Password history
let passwordHistory = [];
const MAX_HISTORY = 10;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  generatePassword();
  setupEventListeners();
});

// Event listeners
function setupEventListeners() {
  // Type selector buttons
  randomTypeBtn.addEventListener('click', () => switchType('random'));
  pronounceableTypeBtn.addEventListener('click', () => switchType('pronounceable'));
  passphraseTypeBtn.addEventListener('click', () => switchType('passphrase'));

  // Random password options
  lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
  });

  // Pronounceable password options
  const pronounceableLength = document.getElementById('pronounceableLength');
  const pronounceableLengthValue = document.getElementById('pronounceableLengthValue');
  if (pronounceableLength) {
    pronounceableLength.addEventListener('input', () => {
      pronounceableLengthValue.textContent = pronounceableLength.value;
    });
    pronounceableLength.addEventListener('change', generatePassword);
  }

  // Passphrase options
  const wordCount = document.getElementById('wordCount');
  const wordCountValue = document.getElementById('wordCountValue');
  if (wordCount) {
    wordCount.addEventListener('input', () => {
      wordCountValue.textContent = wordCount.value;
    });
    wordCount.addEventListener('change', generatePassword);
  }

  const separator = document.getElementById('separator');
  if (separator) {
    separator.addEventListener('change', generatePassword);
  }

  // Auto-generate on option change
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', generatePassword);
  });

  lengthSlider.addEventListener('change', generatePassword);

  copyBtn.addEventListener('click', copyPassword);
  regenerateBtn.addEventListener('click', generatePassword);
  clearHistoryBtn.addEventListener('click', clearHistory);
  generateBulkBtn.addEventListener('click', generateBulk);
  copyBulkBtn.addEventListener('click', copyBulkPasswords);
  if (downloadBulkBtn) {
    downloadBulkBtn.addEventListener('click', downloadBulkPasswords);
  }

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      applyPreset(e.target.dataset.preset);
    });
  });
}

// Switch password type
function switchType(type) {
  currentType = type;
  
  // Update button states
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (type === 'random') {
    randomTypeBtn.classList.add('active');
    randomOptions.style.display = 'block';
    pronounceableOptions.style.display = 'none';
    passphraseOptions.style.display = 'none';
  } else if (type === 'pronounceable') {
    pronounceableTypeBtn.classList.add('active');
    randomOptions.style.display = 'none';
    pronounceableOptions.style.display = 'block';
    passphraseOptions.style.display = 'none';
  } else if (type === 'passphrase') {
    passphraseTypeBtn.classList.add('active');
    randomOptions.style.display = 'none';
    pronounceableOptions.style.display = 'none';
    passphraseOptions.style.display = 'block';
  }
  
  generatePassword();
}

// Apply preset configurations
function applyPreset(preset) {
  const presets = {
    easy: {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true
    },
    strong: {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false
    },
    ultra: {
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false
    },
    pin: {
      length: 6,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
      excludeAmbiguous: false
    }
  };

  const config = presets[preset];
  if (!config) return;

  lengthSlider.value = config.length;
  lengthValue.textContent = config.length;
  document.getElementById('includeUppercase').checked = config.uppercase;
  document.getElementById('includeLowercase').checked = config.lowercase;
  document.getElementById('includeNumbers').checked = config.numbers;
  document.getElementById('includeSymbols').checked = config.symbols;
  document.getElementById('excludeAmbiguous').checked = config.excludeAmbiguous;

  generatePassword();
}

// Generate password based on current type
function generatePassword() {
  let password = '';
  
  if (currentType === 'random') {
    password = generateRandomPassword();
  } else if (currentType === 'pronounceable') {
    password = generatePronounceablePassword();
  } else if (currentType === 'passphrase') {
    password = generatePassphrase();
  }
  
  // Display password
  passwordOutput.textContent = password;
  passwordOutput.style.color = '';

  // Calculate and display strength
  const strength = calculateStrength(password, {});
  displayStrength(strength);

  // Add to history
  addToHistory(password, strength);
}

// Generate random password
function generateRandomPassword() {
  const length = parseInt(lengthSlider.value);
  const options = {
    includeUpper: document.getElementById('includeUppercase').checked,
    includeLower: document.getElementById('includeLowercase').checked,
    includeNums: document.getElementById('includeNumbers').checked,
    includeSyms: document.getElementById('includeSymbols').checked,
    excludeAmb: document.getElementById('excludeAmbiguous').checked,
    excludeSim: document.getElementById('excludeSimilar')?.checked || false,
    noDuplicates: document.getElementById('noDuplicates')?.checked || false,
    noSequential: document.getElementById('noSequential')?.checked || false
  };

  // Build character set
  let charset = '';
  if (options.includeUpper) charset += charSets.uppercase;
  if (options.includeLower) charset += charSets.lowercase;
  if (options.includeNums) charset += charSets.numbers;
  if (options.includeSyms) charset += charSets.symbols;

  if (charset === '') {
    return 'Please select at least one character type';
  }

  // Apply exclusions
  if (options.excludeAmb) {
    charset = charset.split('').filter(c => !charSets.ambiguous.includes(c)).join('');
  }
  if (options.excludeSim) {
    charset = charset.split('').filter(c => !charSets.similar.includes(c)).join('');
  }

  // Generate password
  let password = '';
  const array = new Uint32Array(length * 2); // Extra for filtering
  crypto.getRandomValues(array);

  let attempts = 0;
  const maxAttempts = length * 10;
  const usedChars = new Set();

  for (let i = 0; i < length && attempts < maxAttempts; attempts++) {
    const char = charset[array[attempts] % charset.length];

    // Check for duplicates
    if (options.noDuplicates && usedChars.has(char)) {
      continue;
    }

    // Check for sequential characters
    if (options.noSequential && password.length > 0) {
      const lastChar = password[password.length - 1];
      if (Math.abs(char.charCodeAt(0) - lastChar.charCodeAt(0)) === 1) {
        continue;
      }
    }

    password += char;
    usedChars.add(char);
    i++; // Increment the loop counter when we successfully add a character
  }

  // Ensure minimum requirements are met
  if (options.includeUpper && !/[A-Z]/.test(password)) {
    const upperChars = charSets.uppercase.split('').filter(c => 
      !options.excludeAmb || !charSets.ambiguous.includes(c)
    );
    password = replaceRandomChar(password, upperChars);
  }
  if (options.includeLower && !/[a-z]/.test(password)) {
    const lowerChars = charSets.lowercase.split('').filter(c => 
      !options.excludeAmb || !charSets.ambiguous.includes(c)
    );
    password = replaceRandomChar(password, lowerChars);
  }
  if (options.includeNums && !/[0-9]/.test(password)) {
    const numChars = charSets.numbers.split('').filter(c => 
      !options.excludeAmb || !charSets.ambiguous.includes(c)
    );
    password = replaceRandomChar(password, numChars);
  }
  if (options.includeSyms && !/[^a-zA-Z0-9]/.test(password)) {
    password = replaceRandomChar(password, charSets.symbols.split(''));
  }

  return password;
}

// Generate pronounceable password
function generatePronounceablePassword() {
  const length = parseInt(document.getElementById('pronounceableLength').value);
  const capitalize = document.getElementById('pronounceableCapitalize').checked;
  const includeNumbers = document.getElementById('pronounceableNumbers').checked;
  const includeSymbols = document.getElementById('pronounceableSymbols').checked;
  
  let password = '';
  const array = new Uint32Array(length * 2);
  crypto.getRandomValues(array);
  
  let index = 0;
  while (password.length < length - (includeNumbers ? 2 : 0) - (includeSymbols ? 1 : 0)) {
    // Alternate between consonants/blends and vowels
    if (password.length % 2 === 0) {
      // Add consonant or blend
      const useBlend = array[index++] % 3 === 0 && password.length < length - 3;
      if (useBlend) {
        const blend = consonantBlends[array[index++] % consonantBlends.length];
        password += blend;
      } else {
        password += consonants[array[index++] % consonants.length];
      }
    } else {
      // Add vowel
      password += vowels[array[index++] % vowels.length];
    }
  }
  
  // Capitalize first letter
  if (capitalize && password.length > 0) {
    password = password.charAt(0).toUpperCase() + password.slice(1);
  }
  
  // Add numbers
  if (includeNumbers) {
    const num1 = array[index++] % 10;
    const num2 = array[index++] % 10;
    password += num1.toString() + num2.toString();
  }
  
  // Add symbol
  if (includeSymbols) {
    const symbols = '!@#$%^&*';
    password += symbols[array[index++] % symbols.length];
  }
  
  return password;
}

// Generate passphrase
function generatePassphrase() {
  const wordCount = parseInt(document.getElementById('wordCount').value);
  const separator = document.getElementById('separator').value;
  const capitalize = document.getElementById('passphraseCapitalize').checked;
  const includeNumbers = document.getElementById('passphraseNumbers').checked;
  const includeSymbols = document.getElementById('passphraseSymbols').checked;
  
  const array = new Uint32Array(wordCount + 10);
  crypto.getRandomValues(array);
  
  let words = [];
  for (let i = 0; i < wordCount; i++) {
    let word = wordList[array[i] % wordList.length];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }
  
  let passphrase = words.join(separator);
  
  // Add numbers
  if (includeNumbers) {
    const num = array[wordCount] % 100;
    passphrase += (separator || '') + num.toString();
  }
  
  // Add symbol
  if (includeSymbols) {
    const symbols = '!@#$%^&*';
    passphrase += symbols[array[wordCount + 1] % symbols.length];
  }
  
  return passphrase;
}

// Replace random character in password
function replaceRandomChar(password, chars) {
  if (chars.length === 0) return password;
  const pos = Math.floor(Math.random() * password.length);
  const char = chars[Math.floor(Math.random() * chars.length)];
  return password.substring(0, pos) + char + password.substring(pos + 1);
}

// Calculate password strength
function calculateStrength(password, options) {
  let score = 0;
  let feedback = [];

  // Length scoring
  if (password.length >= 16) {
    score += 30;
    feedback.push('✓ Excellent length');
  } else if (password.length >= 12) {
    score += 20;
    feedback.push('✓ Good length');
  } else if (password.length >= 8) {
    score += 10;
    feedback.push('⚠ Consider longer password');
  } else {
    feedback.push('✗ Too short');
  }

  // Character variety
  if (/[a-z]/.test(password)) {
    score += 10;
    feedback.push('✓ Lowercase letters');
  }
  if (/[A-Z]/.test(password)) {
    score += 10;
    feedback.push('✓ Uppercase letters');
  }
  if (/[0-9]/.test(password)) {
    score += 10;
    feedback.push('✓ Numbers');
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15;
    feedback.push('✓ Special characters');
  }

  // Uniqueness
  const uniqueChars = new Set(password).size;
  const uniqueRatio = uniqueChars / password.length;
  if (uniqueRatio > 0.8) {
    score += 15;
    feedback.push('✓ High character diversity');
  } else if (uniqueRatio > 0.6) {
    score += 10;
  }

  // Entropy calculation - determine actual charset size from password
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  
  const entropy = charsetSize > 0 ? Math.log2(Math.pow(charsetSize, password.length)) : 0;
  if (entropy > 80) {
    score += 10;
    feedback.push('✓ High entropy');
  }

  // Pattern detection
  if (!/(.)\1{2,}/.test(password)) {
    score += 5;
  } else {
    feedback.push('⚠ Contains repeated characters');
  }

  return {
    score: Math.min(score, 100),
    feedback: feedback,
    entropy: entropy.toFixed(1)
  };
}

// Display strength
function displayStrength(strength) {
  const { score, feedback, entropy } = strength;

  let label = '';
  let color = '';

  if (score >= 90) {
    label = 'Very Strong 🛡️';
    color = '#10b981';
  } else if (score >= 70) {
    label = 'Strong 💪';
    color = '#3b82f6';
  } else if (score >= 50) {
    label = 'Medium ⚠️';
    color = '#f59e0b';
  } else if (score >= 30) {
    label = 'Weak 😟';
    color = '#ef4444';
  } else {
    label = 'Very Weak 🚨';
    color = '#dc2626';
  }

  strengthBar.style.width = score + '%';
  strengthBar.style.backgroundColor = color;
  strengthText.textContent = label;
  strengthText.style.color = color;
  
  const feedbackHTML = feedback && feedback.length > 0 
    ? feedback.slice(0, 4).map(f => `<span>${f || ''}</span>`).join('') 
    : '';
  
  strengthDetails.innerHTML = `
    <div class="strength-info">
      <span>Entropy: ${entropy || 0} bits</span>
      <span>Score: ${score || 0}/100</span>
    </div>
    <div class="strength-feedback">
      ${feedbackHTML}
    </div>
  `;
  
  // Calculate and display crack time
  const crackTimeText = calculateCrackTime(entropy);
  if (crackTime) {
    crackTime.innerHTML = `<strong>Estimated crack time:</strong> ${crackTimeText}`;
    crackTime.style.color = color;
  }
}

// Calculate crack time based on entropy
function calculateCrackTime(entropy) {
  // Validate entropy
  if (!entropy || isNaN(entropy) || entropy <= 0) {
    return 'Unknown';
  }
  
  // Assume 1 billion guesses per second (modern GPU)
  const guessesPerSecond = 1e9;
  const possibleCombinations = Math.pow(2, entropy);
  
  // Check for infinity or invalid values
  if (!isFinite(possibleCombinations)) {
    return 'Trillions of years';
  }
  
  const secondsToCrack = possibleCombinations / (2 * guessesPerSecond); // Divide by 2 for average case
  
  if (!isFinite(secondsToCrack) || isNaN(secondsToCrack)) {
    return 'Trillions of years';
  }
  
  if (secondsToCrack < 1) {
    return 'Instant';
  } else if (secondsToCrack < 60) {
    return `${Math.round(secondsToCrack)} seconds`;
  } else if (secondsToCrack < 3600) {
    return `${Math.round(secondsToCrack / 60)} minutes`;
  } else if (secondsToCrack < 86400) {
    return `${Math.round(secondsToCrack / 3600)} hours`;
  } else if (secondsToCrack < 2592000) {
    return `${Math.round(secondsToCrack / 86400)} days`;
  } else if (secondsToCrack < 31536000) {
    return `${Math.round(secondsToCrack / 2592000)} months`;
  } else if (secondsToCrack < 3153600000) {
    return `${Math.round(secondsToCrack / 31536000)} years`;
  } else if (secondsToCrack < 31536000000000) {
    return `${Math.round(secondsToCrack / 31536000000)} centuries`;
  } else {
    return 'Trillions of years';
  }
}

// Copy password
function copyPassword() {
  const password = passwordOutput.textContent;
  if (password && !password.includes('Please select')) {
    navigator.clipboard.writeText(password).then(() => {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span style="color: #10b981;">✓ Copied!</span>';
      copyBtn.style.backgroundColor = '#d1fae5';
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.backgroundColor = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}

// Add to history
function addToHistory(password, strength) {
  const historyItem = {
    password: password,
    strength: strength.score,
    timestamp: new Date().toLocaleTimeString()
  };

  passwordHistory.unshift(historyItem);
  if (passwordHistory.length > MAX_HISTORY) {
    passwordHistory.pop();
  }

  renderHistory();
}

// Render history
function renderHistory() {
  if (passwordHistory.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No passwords generated yet</p>';
    return;
  }

  historyList.innerHTML = passwordHistory.map((item, index) => `
    <div class="history-item">
      <div class="history-password">${item.password}</div>
      <div class="history-meta">
        <span class="history-strength" style="color: ${getStrengthColor(item.strength)}">
          ${getStrengthLabel(item.strength)}
        </span>
        <span class="history-time">${item.timestamp}</span>
        <button class="btn-icon-sm" onclick="copyHistoryPassword(${index})" title="Copy">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Copy history password
function copyHistoryPassword(index) {
  const password = passwordHistory[index].password;
  navigator.clipboard.writeText(password).then(() => {
    // Visual feedback handled by button
  });
}

// Clear history
function clearHistory() {
  if (confirm('Clear all password history?')) {
    passwordHistory = [];
    renderHistory();
  }
}

// Get strength color
function getStrengthColor(score) {
  if (score >= 90) return '#10b981';
  if (score >= 70) return '#3b82f6';
  if (score >= 50) return '#f59e0b';
  if (score >= 30) return '#ef4444';
  return '#dc2626';
}

// Get strength label
function getStrengthLabel(score) {
  if (score >= 90) return 'Very Strong';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Medium';
  if (score >= 30) return 'Weak';
  return 'Very Weak';
}

// Generate bulk passwords
function generateBulk() {
  const count = parseInt(document.getElementById('bulkCount').value);
  if (count < 1 || count > 100) {
    alert('Please enter a number between 1 and 100');
    return;
  }

  const passwords = [];

  for (let i = 0; i < count; i++) {
    let password = '';
    if (currentType === 'random') {
      password = generateRandomPassword();
    } else if (currentType === 'pronounceable') {
      password = generatePronounceablePassword();
    } else if (currentType === 'passphrase') {
      password = generatePassphrase();
    }
    passwords.push(password);
  }

  document.getElementById('bulkOutput').value = passwords.join('\n');
  bulkCountDisplay.textContent = `${count} password${count > 1 ? 's' : ''} generated`;
}

// Copy bulk passwords
function copyBulkPasswords() {
  const bulkOutput = document.getElementById('bulkOutput');
  if (bulkOutput.value) {
    navigator.clipboard.writeText(bulkOutput.value).then(() => {
      const originalHTML = copyBulkBtn.innerHTML;
      copyBulkBtn.innerHTML = '<span style="color: #10b981;">✓ Copied!</span>';
      copyBulkBtn.style.backgroundColor = '#d1fae5';
      setTimeout(() => {
        copyBulkBtn.innerHTML = originalHTML;
        copyBulkBtn.style.backgroundColor = '';
      }, 2000);
    });
  }
}

// Download bulk passwords
function downloadBulkPasswords() {
  const bulkOutput = document.getElementById('bulkOutput');
  if (bulkOutput.value) {
    const blob = new Blob([bulkOutput.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    const originalHTML = downloadBulkBtn.innerHTML;
    downloadBulkBtn.innerHTML = '<span style="color: #10b981;">✓ Downloaded!</span>';
    setTimeout(() => {
      downloadBulkBtn.innerHTML = originalHTML;
    }, 2000);
  }
}
