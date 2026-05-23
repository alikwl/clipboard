/**
 * AI YouTube Title & Hook Generator
 * Freeclipboard.com
 *
 * Architecture:
 *  1. Listens for click on #generateBtn
 *  2. Tries n8n webhook (POST) first — swap URL to activate
 *  3. Falls back to rich offline template engine automatically
 *  4. Renders copyable cards into #titleOutput and #hookOutput
 *  5. Global copyText() helper for all copy buttons
 */

// ─── Global Copy Utility ──────────────────────────────────────────────────────
function copyText(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = element.innerText;
    element.innerText = 'Copied! ✅';
    setTimeout(() => { element.innerText = originalText; }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    const originalText = element.innerText;
    element.innerText = 'Copied! ✅';
    setTimeout(() => { element.innerText = originalText; }, 2000);
  });
}

// ─── Offline Template Engine ──────────────────────────────────────────────────

/**
 * Converts raw input to Title Case, stripping redundant
 * prefix phrases so templates look natural.
 */
function toTitleCase(str) {
  const stopWords = ['how to', 'best way to', 'a guide to', 'ways to', 'tips for', 'why', 'what is', 'the truth about'];
  let cleaned = str.toLowerCase();
  stopWords.forEach(sw => { cleaned = cleaned.replace(new RegExp('^' + sw + '\\s+', 'i'), ''); });
  return cleaned.replace(/\b\w/g, c => c.toUpperCase()).trim();
}

/** Pick `n` unique random items from an array */
function pickUnique(arr, n) {
  const shuffled = arr.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

// ── Title Templates ────────────────────────────────────────────────────────────
const TITLE_TEMPLATES = {
  'high-energy': {
    'long-form': [
      t => `🔥 ${t}: The Explosive Guide That Will Change Everything`,
      t => `${t} — I Tried It For 30 Days and the Results Were INSANE`,
      t => `NOBODY Is Talking About This ${t} Secret (Until Now)`,
      t => `This ${t} Method Took Me From Zero to Viral in 7 Days`,
      t => `I Broke Every Rule About ${t} — Here's What Happened`,
    ],
    'shorts': [
      t => `${t} in 60 seconds 🔥`,
      t => `This ${t} hack changes everything ⚡`,
      t => `Wait until the end! ${t} like a pro 💪`,
      t => `I can't believe this ${t} works 🤯`,
      t => `The FASTEST way to do ${t} 🚀`,
    ],
  },
  'educational': {
    'long-form': [
      t => `How to Master ${t}: A Step-by-Step Complete Beginner's Guide`,
      t => `The Science Behind ${t}: What Experts Actually Know`,
      t => `${t} Explained: Everything You Need to Know in 2025`,
      t => `I Studied ${t} for 100 Hours — Here Are the Key Lessons`,
      t => `The Ultimate ${t} Guide: From Basics to Advanced Techniques`,
    ],
    'shorts': [
      t => `Learn ${t} in under a minute`,
      t => `Quick ${t} lesson you'll thank me for`,
      t => `The one ${t} fact most people get wrong`,
      t => `${t}: The 3-second rule explained`,
      t => `What nobody teaches you about ${t}`,
    ],
  },
  'dramatic': {
    'long-form': [
      t => `I Almost Quit Because of ${t}… Until I Discovered This`,
      t => `The Dark Side of ${t} They Don't Want You to Know`,
      t => `${t} Ruined My Life — And Then Saved It`,
      t => `Warning: This ${t} Strategy Could Change Everything`,
      t => `I Exposed the Biggest Lie in ${t} (Shocking Truth)`,
    ],
    'shorts': [
      t => `${t} almost destroyed me 💔`,
      t => `The ugly truth about ${t} 😳`,
      t => `This ${t} moment changed my life forever`,
      t => `I was embarrassed by my ${t}… until this`,
      t => `You've been doing ${t} WRONG this whole time 🚨`,
    ],
  },
  'clicky': {
    'long-form': [
      t => `7 ${t} Tricks Even Experts Don't Know About`,
      t => `If You're Not Doing This ${t} Hack, You're Missing Out`,
      t => `The ${t} Method That Has Everyone Talking in 2025`,
      t => `I Found the Only ${t} Tutorial You'll Ever Need`,
      t => `5 ${t} Mistakes That Are Killing Your Results (Fix These Now)`,
    ],
    'shorts': [
      t => `Try this ${t} trick RIGHT NOW 👇`,
      t => `Save this ${t} hack before it's gone`,
      t => `The ${t} tip that blew up my account`,
      t => `Nobody's sharing this ${t} strategy...`,
      t => `This ${t} tip has 10M views for a reason`,
    ],
  },
  'casual': {
    'long-form': [
      t => `Just Tried ${t} For the First Time — My Honest Thoughts`,
      t => `Here's Why I Switched to This ${t} Approach`,
      t => `Let's Talk About ${t} (My Story + Practical Tips)`,
      t => `I've Been Doing ${t} for Years — This is What I Learned`,
      t => `Everything I Wish I Knew Before Starting ${t}`,
    ],
    'shorts': [
      t => `Real talk about ${t} 😄`,
      t => `My honest ${t} experience`,
      t => `Okay so about ${t}... 👀`,
      t => `${t} vibes only ✨`,
      t => `Things I do for ${t} (don't judge me)`,
    ],
  },
};

// ── Hook Templates ─────────────────────────────────────────────────────────────
const HOOK_TEMPLATES = {
  'high-energy': {
    'long-form': [
      t => `"If you're serious about ${t}, you need to stop what you're doing and watch this video RIGHT NOW. What I'm about to show you took me years to figure out."`,
      t => `"I used to struggle with ${t} every single day. Then I discovered ONE thing that completely flipped my results. Stick with me because this will blow your mind."`,
      t => `"What if I told you that everything you've been taught about ${t} is completely backwards? In the next few minutes, I'm going to prove it."`,
      t => `"This video about ${t} is already making people angry. Because I'm telling the truth nobody else will say out loud."`,
      t => `"By the end of this video, you'll never approach ${t} the same way again. This is the one thing that separates beginners from absolute pros."`,
    ],
    'shorts': [
      t => `"Stop scrolling — this ${t} hack takes 30 seconds and changes everything."`,
      t => `"You've been doing ${t} wrong. Watch this."`,
      t => `"Nobody is talking about this ${t} trick and I don't know why."`,
      t => `"Here's what happened when I tried ${t} for the first time ever."`,
      t => `"If you want results with ${t}, this is the only video you need."`,
    ],
  },
  'educational': {
    'long-form': [
      t => `"Today we're breaking down ${t} from the absolute basics all the way to advanced tactics. Whether you're a complete beginner or you've been at this for years, stay with me because there's something here for everyone."`,
      t => `"${t} is one of the most misunderstood topics online. In this video, I'm cutting through all the noise and showing you exactly how it works, step by step."`,
      t => `"Most people who fail at ${t} are making the same three mistakes. By the end of this video, you'll know exactly what they are — and how to avoid them."`,
      t => `"Let's talk about ${t}. I've spent hundreds of hours researching this topic and today I'm sharing everything I've learned in one clear, concise guide."`,
      t => `"If you've ever felt confused or overwhelmed by ${t}, this video will finally give you the clear roadmap you need to see real results."`,
    ],
    'shorts': [
      t => `"Quick lesson about ${t} that most people never learn."`,
      t => `"Here's the one ${t} concept that makes everything else click."`,
      t => `"The simplest way to understand ${t} — ever."`,
      t => `"Learn this ${t} principle in under a minute."`,
      t => `"This ${t} fact changed how I think about everything."`,
    ],
  },
  'dramatic': {
    'long-form': [
      t => `"I almost gave up on ${t} completely. I was frustrated, exhausted, and ready to quit. Then something happened that changed everything — and I documented the entire journey."`,
      t => `"The moment I realized the truth about ${t}, my entire world turned upside down. I'm still processing it. But I need you to see this."`,
      t => `"What I'm about to share with you about ${t} cost me two years and thousands of dollars to figure out. I'm sharing it so you don't have to go through what I did."`,
      t => `"Three months ago, ${t} nearly destroyed everything I'd worked for. Today, it's the best thing that ever happened to me. Here's the full unfiltered story."`,
      t => `"I was embarrassed to talk about this. But I've decided that honesty matters more. This is the real, messy truth about my experience with ${t}."`,
    ],
    'shorts': [
      t => `"${t} almost broke me. This is what saved it."`,
      t => `"Nobody warned me ${t} would be this hard."`,
      t => `"I cried over ${t}. For real. Here's why."`,
      t => `"The day ${t} changed my entire life in 10 seconds."`,
      t => `"I lost everything trying ${t}. Then gained it all back."`,
    ],
  },
  'clicky': {
    'long-form': [
      t => `"I've tested 47 different approaches to ${t}. I'm about to show you the only one that actually works. You can skip years of trial and error starting right now."`,
      t => `"There's a specific trick with ${t} that top creators use but never talk about publicly. I found it accidentally and it doubled my results overnight."`,
      t => `"Five ${t} mistakes you're probably making right now — and the quick fixes that will turn things around faster than you think."`,
      t => `"I collected data on ${t} for 90 days straight. The patterns I found were shocking. Here's exactly what the numbers revealed."`,
      t => `"In the next 10 minutes, I'm going to show you more useful ${t} strategies than most people learn in a full year. Let's get into it."`,
    ],
    'shorts': [
      t => `"Save this ${t} hack. You'll need it later."`,
      t => `"Tell me you do ${t} without telling me you do ${t}."`,
      t => `"POV: You just discovered the best ${t} trick on the internet."`,
      t => `"I found the secret to ${t} and I'm sharing it right now."`,
      t => `"This ${t} shortcut took me 3 years to discover."`,
    ],
  },
  'casual': {
    'long-form': [
      t => `"Hey everyone! So today I want to talk about something I've been obsessing over lately — ${t}. Fair warning, this is going to be a pretty honest, unfiltered conversation."`,
      t => `"Okay so I've been experimenting with ${t} for a while now and honestly? I have a lot of thoughts. Some of it surprised me, some of it frustrated me — let's talk about all of it."`,
      t => `"So you want to get into ${t}? Same! I've been on this journey for a while and today I'm just going to sit down with you and share everything I know, no fluff."`,
      t => `"Real talk: ${t} is one of those things everyone has an opinion about. Here's mine — and why I think most of the popular advice gets it completely wrong."`,
      t => `"I wasn't planning to make a video about ${t} but so many of you have been asking about it that here we are. Let's figure this out together."`,
    ],
    'shorts': [
      t => `"Just a girl/guy figuring out ${t} in real time 😅"`,
      t => `"Me trying ${t} for the first time vs. now."`,
      t => `"Okay ${t} has been living rent free in my head."`,
      t => `"The way ${t} has completely taken over my life..."`,
      t => `"Storytime: how ${t} surprised me completely."`,
    ],
  },
};

// ── Generate Results (Client-side) ────────────────────────────────────────────
function generateOffline(topic, format, tone) {
  const titleKey = topic ? toTitleCase(topic) : 'Your Topic';
  const toneMap   = TITLE_TEMPLATES[tone]  || TITLE_TEMPLATES['clicky'];
  const hookMap   = HOOK_TEMPLATES[tone]   || HOOK_TEMPLATES['clicky'];
  const formatKey = format === 'shorts' ? 'shorts' : 'long-form';

  const titleFns = toneMap[formatKey]  || toneMap['long-form'];
  const hookFns  = hookMap[formatKey]  || hookMap['long-form'];

  const titles = pickUnique(titleFns, 3).map(fn => fn(titleKey));
  const hooks  = pickUnique(hookFns,  3).map(fn => fn(titleKey));

  return { titles, hooks };
}

// Helper: Clean and convert any string format to list of items
function parseStringToList(str) {
  if (!str) return [];
  
  // If it contains HTML tags, let's extract the text content from elements
  if (str.includes('<') && str.includes('>')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = str;
    
    // Find all potential child elements
    const elements = tempDiv.querySelectorAll('.output-item, div, li, p');
    if (elements.length > 0) {
      let items = [];
      elements.forEach(el => {
        const text = el.textContent.trim();
        // Skip elements that only contain other elements to avoid duplicates
        if (text && !el.querySelector('.output-item, div, li, p') && !items.includes(text)) {
          items.push(text);
        }
      });
      if (items.length > 0) {
        return items.map(line => line.replace(/^[\d\-\*\•\.\s]+[:\-\.\s]*/, '').trim()).filter(Boolean);
      }
    }
    // Fallback: strip tags
    const cleanText = tempDiv.textContent || tempDiv.innerText || '';
    return cleanText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[\d\-\*\•\.\s]+[:\-\.\s]*/, '').trim())
      .filter(line => line.length > 0);
  }
  
  // Otherwise split by newline, strip numbering/bullets
  return str.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    // Strip leading bullets/numbers like "1. ", "- ", "* ", "1-", "• "
    .map(line => line.replace(/^[\d\-\*\•\.\s]+[:\-\.\s]*/, '').trim())
    .filter(line => line.length > 0);
}

// Helper: Parse a single text block containing both titles and hooks
function parseSingleTextResponse(text) {
  let titles = [];
  let hooks = [];
  
  // Clean up carriage returns
  const cleanText = text.replace(/\r/g, '');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
  
  let isTitleSection = true; // default starting section
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    // Detect transition to hooks section
    if (lower.includes('hook') && (lower.includes(':') || lower.includes('section') || lower.includes('viral') || lower.startsWith('hook'))) {
      isTitleSection = false;
      continue;
    }
    // Detect transition to titles section
    if (lower.includes('title') && (lower.includes(':') || lower.includes('section') || lower.includes('viral') || lower.startsWith('title'))) {
      isTitleSection = true;
      continue;
    }
    
    // Clean the item content
    const cleaned = line.replace(/^[\d\-\*\•\.\s]+[:\-\.\s]*/, '').trim();
    if (!cleaned) continue;
    
    if (isTitleSection) {
      titles.push(cleaned);
    } else {
      hooks.push(cleaned);
    }
  }
  
  // Fallback: if one is empty, split evenly
  if (titles.length === 0 || hooks.length === 0) {
    const allItems = lines.map(line => line.replace(/^[\d\-\*\•\.\s]+[:\-\.\s]*/, '').trim()).filter(Boolean);
    const mid = Math.ceil(allItems.length / 2);
    titles = allItems.slice(0, mid);
    hooks = allItems.slice(mid);
  }
  
  return { titles, hooks };
}

// ── Render Copyable Cards ─────────────────────────────────────────────────────
function renderCards(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach((text, idx) => {
    const card = document.createElement('div');
    card.className = 'copyable-card-item';

    const p = document.createElement('p');
    p.className = 'item-content-text';
    p.textContent = text;

    const btn = document.createElement('button');
    btn.className = 'item-copy-btn';
    btn.id = `copy-${containerId}-${idx}`;
    btn.innerHTML = '📋 Copy';
    btn.addEventListener('click', function () {
      copyText(text, btn);
    });

    card.appendChild(p);
    card.appendChild(btn);
    container.appendChild(card);
  });
}

// ── Main Event Listener ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const generateBtn    = document.getElementById('generateBtn');
  const titleContainer = document.getElementById('titleOutput');
  const hookContainer  = document.getElementById('hookOutput');
  const outputContainer = document.getElementById('output-container');

  if (!generateBtn) return;

  // ── n8n Webhook URL Config ──────────────────────────────────────────────────
  // Replace the value below with your actual n8n execution URL to enable
  // webhook-powered AI generation. When set to the placeholder below, the tool
  // automatically falls back to the built-in client-side engine.
  const N8N_WEBHOOK_URL = 'https://n8ninstance.btech.cfd/webhook/youtube-title-generator';
  const USE_WEBHOOK = N8N_WEBHOOK_URL && N8N_WEBHOOK_URL.includes('/webhook');

  generateBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    // 1. Get user inputs
    const topic  = document.getElementById('videoTopic').value.trim();
    const format = document.getElementById('videoFormat').value;
    const tone   = document.getElementById('videoTone').value;

    if (!topic) {
      alert('Please enter a video topic!');
      return;
    }

    // 2. Visual Polish: Loading State
    generateBtn.innerText = 'Generating Magic... 🚀';
    generateBtn.disabled = true;
    titleContainer.innerHTML = '<p class="loading-text">⏳ Generating your titles...</p>';
    hookContainer.innerHTML  = '<p class="loading-text">⏳ Generating your hooks...</p>';
    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (USE_WEBHOOK) {
      // 3a. n8n Webhook Path
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, format, tone }),
        });

        if (!response.ok) throw new Error('Network response failed');

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = text; // raw string fallback
          }
        }

        // Normalize array-based or object-based responses
        const resultData = Array.isArray(data) ? data[0] : data;
        let titles = [];
        let hooks = [];

        if (resultData) {
          // Extract text from resultData recursively in case it's in response.text or content
          let rawText = '';
          if (typeof resultData === 'string') {
            rawText = resultData;
          } else if (resultData) {
            if (resultData.response && typeof resultData.response === 'object') {
              rawText = resultData.response.text || resultData.response.output || JSON.stringify(resultData.response);
            } else {
              rawText = resultData.content || resultData.text || resultData.output || resultData.response || resultData.message || JSON.stringify(resultData);
            }
          }

          // Check if the extracted text itself is a JSON string
          let parsedJson = null;
          if (rawText && typeof rawText === 'string' && (rawText.trim().startsWith('{') || rawText.trim().startsWith('['))) {
            try {
              parsedJson = JSON.parse(rawText.trim());
            } catch (e) {
              // Not valid JSON
            }
          }

          const targetObj = parsedJson || resultData;

          // If structure contains explicit titles/hooks arrays/strings
          if (targetObj && (targetObj.titles || targetObj.hooks)) {
            if (Array.isArray(targetObj.titles)) {
              titles = targetObj.titles;
            } else if (typeof targetObj.titles === 'string') {
              titles = parseStringToList(targetObj.titles);
            }
            
            if (Array.isArray(targetObj.hooks)) {
              hooks = targetObj.hooks;
            } else if (typeof targetObj.hooks === 'string') {
              hooks = parseStringToList(targetObj.hooks);
            }
          } else {
            // Parse raw text response
            const parsed = parseSingleTextResponse(rawText);
            titles = parsed.titles;
            hooks = parsed.hooks;
          }
        }

        // Render cards
        if (titles.length > 0 || hooks.length > 0) {
          renderCards(titles, 'titleOutput');
          renderCards(hooks,  'hookOutput');
        } else {
          // Unrecognized text display fallback
          const displayText = typeof resultData === 'string' ? resultData : JSON.stringify(resultData);
          titleContainer.innerHTML = `<div class="copyable-card-item"><p class="item-content-text">${displayText}</p></div>`;
          hookContainer.innerHTML = `<div class="copyable-card-item"><p class="item-content-text">Results generated. Copy options directly above.</p></div>`;
        }

      } catch (error) {
        console.error('Webhook error:', error);
        
        // Show styled error message to user instead of silently showing random results
        titleContainer.innerHTML = `
          <div class="error-msg-box" style="padding: 1.25rem; color: #b91c1c; border: 1px solid #fee2e2; background: #fef2f2; border-radius: 0.75rem; text-align: left;">
            <p style="font-weight: 700; margin-bottom: 0.25rem;">⚠️ AI Generation Failed</p>
            <p style="font-size: 0.9rem; color: #7f1d1d; line-height: 1.4;">Could not fetch response from the n8n AI engine. This might be due to a temporary network issue or missing CORS settings.</p>
            <p style="font-size: 0.8rem; color: #991b1b; margin-top: 0.5rem; font-family: monospace;">Details: ${error.message}</p>
            <button id="fallbackBtn" class="btn-generate-custom" style="margin-top: 1rem; width: auto; font-size: 0.85rem; padding: 0.5rem 1rem; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
              Use Offline Fallback Instead
            </button>
          </div>
        `;
        
        hookContainer.innerHTML = `
          <div class="error-msg-box" style="padding: 1.25rem; color: #334155; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 0.75rem; text-align: left; height: 100%; display: flex; flex-direction: column; justify-content: center;">
            <p style="font-weight: 600; margin-bottom: 0.25rem; color: #475569;">💡 Tip for Host</p>
            <p style="font-size: 0.85rem; color: #64748b; line-height: 1.45;">Ensure the n8n Webhook Node response is configured to return the generated titles and hooks, and the server allows cross-origin requests (CORS).</p>
          </div>
        `;

        // Register action on manual fallback button
        const fallbackBtn = document.getElementById('fallbackBtn');
        if (fallbackBtn) {
          fallbackBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const result = generateOffline(topic, format, tone);
            renderCards(result.titles, 'titleOutput');
            renderCards(result.hooks,  'hookOutput');
          });
        }
      }
    } else {
      // 3b. Offline-only path (no webhook configured)
      await new Promise(r => setTimeout(r, 800));
      const result = generateOffline(topic, format, tone);
      renderCards(result.titles, 'titleOutput');
      renderCards(result.hooks,  'hookOutput');
    }

    // 5. Restore Button State
    generateBtn.innerText = 'Generate Viral Titles & Hooks 🚀';
    generateBtn.disabled = false;
  });
});
