const snippets = {
  javascript: {
    basics: {
      'Hello World': {
        code: `console.log('Hello, World!');`,
        desc: 'Basic console output'
      },
      'Variables': {
        code: `// Variable declarations
const constantValue = 'cannot be reassigned';
let mutableValue = 'can be reassigned';
var oldStyle = 'function-scoped';`,
        desc: 'Different ways to declare variables'
      },
      'If-Else': {
        code: `if (condition) {
  // code if true
} else if (anotherCondition) {
  // code if another condition is true
} else {
  // code if all conditions are false
}`,
        desc: 'Conditional statements'
      }
    },
    arrays: {
      'Array Methods': {
        code: `const arr = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = arr.map(x => x * 2);

// Filter - keep elements that match condition
const evens = arr.filter(x => x % 2 === 0);

// Reduce - combine elements into single value
const sum = arr.reduce((acc, x) => acc + x, 0);

// Find - get first matching element
const found = arr.find(x => x > 3);`,
        desc: 'Common array manipulation methods'
      },
      'Array Destructuring': {
        code: `const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest);  // [3, 4, 5]`,
        desc: 'Destructure arrays into variables'
      }
    },
    async: {
      'Async/Await': {
        code: `async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
        desc: 'Modern asynchronous code with async/await'
      },
      'Promise': {
        code: `const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error));`,
        desc: 'Creating and using Promises'
      }
    }
  },
  python: {
    basics: {
      'Hello World': {
        code: `print('Hello, World!')`,
        desc: 'Basic output in Python'
      },
      'Variables': {
        code: `# Variable assignments
name = "John"
age = 30
is_active = True
items = [1, 2, 3]`,
        desc: 'Python variable declarations'
      }
    },
    arrays: {
      'List Comprehension': {
        code: `# List comprehension
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]`,
        desc: 'Concise way to create lists'
      }
    }
  }
};

function updateCategories() {
  const lang = document.getElementById('languageSelect').value;
  const categorySelect = document.getElementById('categorySelect');
  categorySelect.innerHTML = '';
  
  Object.keys(snippets[lang] || {}).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
  });
  
  updateSnippets();
}

function updateSnippets() {
  const lang = document.getElementById('languageSelect').value;
  const category = document.getElementById('categorySelect').value;
  const snippetSelect = document.getElementById('snippetSelect');
  snippetSelect.innerHTML = '';
  
  const categorySnippets = snippets[lang]?.[category] || {};
  Object.keys(categorySnippets).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    snippetSelect.appendChild(option);
  });
  
  generateSnippet();
}

function generateSnippet() {
  const lang = document.getElementById('languageSelect').value;
  const category = document.getElementById('categorySelect').value;
  const snippetName = document.getElementById('snippetSelect').value;
  
  const snippet = snippets[lang]?.[category]?.[snippetName];
  
  if (snippet) {
    document.getElementById('codeOutput').textContent = snippet.code;
    document.getElementById('snippetDescription').textContent = snippet.desc;
  }
}

function copySnippet() {
  const code = document.getElementById('codeOutput').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
}

updateCategories();
