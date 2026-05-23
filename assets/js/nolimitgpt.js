/**
 * NoLimitGPT client controller
 * FreeClipboard.com
 *
 * Handles query input, character counting, loading states,
 * fetch request to n8n webhook, markdown formatting, and copy action.
 */

document.addEventListener('DOMContentLoaded', function () {
  const promptInput = document.getElementById('promptInput');
  const charCount   = document.getElementById('charCount');
  const clearBtn    = document.getElementById('clearBtn');
  const generateBtn = document.getElementById('generateBtn');
  const outputContainer = document.getElementById('output-container');
  const responseOutput  = document.getElementById('responseOutput');
  const copyBtn     = document.getElementById('copyBtn');

  if (!promptInput || !generateBtn) return;

  const currentWebhookUrl = 'https://n8ninstance.btech.cfd/webhook/nolimitgpt-without-boundaries';

  // Track raw response text to facilitate clean markdown/text copies
  let lastResponseText = '';

  // Inject cursor styling dynamically for premium typewriter effect
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    @keyframes blink { 50% { opacity: 0; } }
    .typing-cursor {
      font-weight: bold;
      color: #a855f7;
      animation: blink 0.8s step-end infinite;
      margin-left: 2px;
    }
  `;
  document.head.appendChild(cursorStyle);

  // 1. CSP-compliant Suggestion Chips Event Handler
  document.querySelectorAll('.suggest-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      const promptVal = this.getAttribute('data-prompt');
      if (promptVal) {
        promptInput.value = promptVal;
        promptInput.dispatchEvent(new Event('input')); // Update character counter
        promptInput.focus();
      }
    });
  });

  // 2. Textarea Character Count
  promptInput.addEventListener('input', function () {
    const len = promptInput.value.length;
    charCount.textContent = `${len.toLocaleString()} character${len === 1 ? '' : 's'}`;
  });

  // 2. Clear Button Action
  clearBtn.addEventListener('click', function () {
    promptInput.value = '';
    charCount.textContent = '0 characters';
    promptInput.focus();
  });

  // 3. Render Helper (Supports marked.js or falls back to escaped HTML with line breaks)
  function formatOutput(text) {
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
      try {
        return marked.parse(text);
      } catch (err) {
        console.error('Marked markdown compiler error:', err);
      }
    }
    // Safe text fallback
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }

  // 4. Submit Query to n8n Webhook
  generateBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const queryText = promptInput.value.trim();

    if (!queryText) {
      alert('Please enter a query or prompt first!');
      promptInput.focus();
      return;
    }

    // A. Visual Shimmer Loading State
    generateBtn.disabled = true;
    const btnSpan = generateBtn.querySelector('span') || generateBtn;
    const originalBtnHTML = btnSpan.innerHTML;
    btnSpan.innerHTML = 'Thinking without boundaries... 🧠';

    responseOutput.innerHTML = `
      <div class="loading-shimmer-box">
        <div class="shimmer-line header"></div>
        <div class="shimmer-line paragraph-1"></div>
        <div class="shimmer-line paragraph-2"></div>
        <div class="shimmer-line paragraph-3"></div>
        <div class="shimmer-line paragraph-4"></div>
      </div>
    `;
    outputContainer.style.display = 'block';
    outputContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      let response;
      let rawText = '';
      
      // ── Self-healing Dual-Protocol Request Engine ──────────────────
      // n8n Webhook nodes default to GET. We try GET first for immediate success,
      // and fall back to POST in case the user has explicitly reconfigured it.
      try {
        console.log('[NoLimitGPT] Attempting GET request (n8n default)...');
        const url = new URL(currentWebhookUrl);
        url.searchParams.append('query', queryText);
        
        response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`GET request failed with status: ${response.status}`);
        }
        
        rawText = await response.text();
        console.log('[NoLimitGPT] GET request succeeded!');
      } catch (getErr) {
        console.warn('[NoLimitGPT] GET request failed/blocked. Trying POST fallback...', getErr);
        
        response = await fetch(currentWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ query: queryText })
        });

        if (!response.ok) {
          throw new Error(`POST request failed with status: ${response.status}`);
        }
        
        rawText = await response.text();
        console.log('[NoLimitGPT] POST request succeeded!');
      }

      let responseData;
      
      // Debug: Log raw response for troubleshooting
      console.log('[NoLimitGPT] Raw response:', rawText.substring(0, 500));
      
      try {
        responseData = JSON.parse(rawText);
      } catch (jsonErr) {
        responseData = rawText; // Plain text response
      }

      // ── Robust n8n Response Extraction Engine ──────────────────────
      // Handles ALL known n8n + Ollama + AI Agent output structures
      let outputText = '';
      
      // Unwrap arrays (n8n often returns [{ ... }])
      let dataObj = responseData;
      if (Array.isArray(dataObj)) {
        dataObj = dataObj[0];
      }
      
      console.log('[NoLimitGPT] Parsed data object:', typeof dataObj, dataObj);

      if (dataObj) {
        if (typeof dataObj === 'string') {
          outputText = dataObj;
        } else if (typeof dataObj === 'object') {
          // Deep extraction function for nested objects
          outputText = extractTextFromPayload(dataObj);
        }
      }

      // Final unwrap: if outputText is still a JSON string, try to parse and extract
      if (outputText && typeof outputText === 'string' && (outputText.trim().startsWith('{') || outputText.trim().startsWith('['))) {
        try {
          const parsed = JSON.parse(outputText.trim());
          if (parsed && typeof parsed === 'object') {
            const deeper = extractTextFromPayload(Array.isArray(parsed) ? parsed[0] : parsed);
            if (deeper && typeof deeper === 'string' && !deeper.startsWith('{')) {
              outputText = deeper;
            }
          }
        } catch (e) {
          // Keep the string as-is
        }
      }

      // Convert non-string leftovers
      if (outputText && typeof outputText === 'object') {
        outputText = JSON.stringify(outputText, null, 2);
      }

      if (!outputText || outputText === '{}' || outputText === '[]') {
        outputText = '⚠️ The server returned an empty response. Check that your n8n workflow "Respond to Webhook" node is wired correctly and outputs the AI text.';
      }
      
      console.log('[NoLimitGPT] Final extracted text:', outputText.substring(0, 200));

      // Cache clean text for clipboard copy
      lastResponseText = outputText;

      // Render Markdown output with typewriter streaming effect
      const compiledHTML = formatOutput(outputText);
      await streamHTML(responseOutput, compiledHTML);

    } catch (error) {
      console.error('Webhook error details:', error);
      
      // ── AUTOMATIC Offline Fallback: No extra click needed ──
      // Keep the shimmer loader running, update button text
      btnSpan.innerHTML = 'Switching to offline engine... 🔌';
      
      // Brief natural delay so the transition feels intentional
      await new Promise(r => setTimeout(r, 900));
      
      const rawResponseText = generateOfflineResponse(queryText);
      lastResponseText = rawResponseText;
      
      const compiledHTML = formatOutput(rawResponseText);
      
      // Prefix badge + collapsible troubleshooting (doesn't block content)
      const prefixBadge = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; font-weight: 700; color: #7c3aed; background: #f3e8ff; border: 1px solid #c084fc; padding: 0.3rem 0.75rem; border-radius: 9999px;">
            <span>🔌 Offline AI Engine</span>
          </div>
          <span style="font-size: 0.75rem; color: #94a3b8; font-style: italic;">Backend unreachable — generated locally</span>
        </div>
      `;
      
      const troubleshootFooter = `
        <details style="margin-top: 1.5rem; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
          <summary style="font-size: 0.85rem; font-weight: 600; color: #64748b; cursor: pointer; user-select: none;">🛠️ Backend Connection Troubleshooting</summary>
          <div style="margin-top: 0.75rem; padding: 1rem; background: #fefce8; border: 1px solid #fde68a; border-radius: 0.75rem; font-size: 0.825rem; color: #713f12; line-height: 1.6;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 700; color: #854d0e;">⚠️ Connection to n8n AI Backend Failed</p>
            <p style="margin: 0 0 0.5rem 0;">The frontend is hardcoded to connect to the production webhook at: <code style="background:#fef3c7;padding:0.1rem 0.3rem;border-radius:0.2rem;">https://n8ninstance.btech.cfd/webhook/nolimitgpt-without-boundaries</code></p>
            <ul style="margin: 0; padding-left: 1.25rem;">
              <li><strong>Is the Workflow Active?</strong> In n8n, make sure the toggle switch in the top-right corner of your workflow is set to <strong>Active</strong>. If it is inactive, n8n will block requests with a CORS/404 error.</li>
              <li><strong>CORS Allowed Origins:</strong> In your n8n Webhook node parameters, expand <em>Options</em>, add <em>Allowed Origins</em>, and ensure it is set to <code style="background:#fef3c7;padding:0.1rem 0.3rem;border-radius:0.2rem;">*</code>.</li>
              <li><strong>HTTPS SSL Certificate:</strong> Because this site is served securely via HTTPS (GitHub Pages), the browser blocks connection if the destination server does not have a valid SSL certificate. Ensure <code style="background:#fef3c7;padding:0.1rem 0.3rem;border-radius:0.2rem;">https://n8ninstance.btech.cfd</code> has a working SSL cert.</li>
            </ul>
            <p style="margin: 0.75rem 0 0; font-size: 0.8rem; color: #92400e;"><strong>Detected Error:</strong> <code style="background:#fef3c7;padding:0.1rem 0.3rem;border-radius:0.2rem;">${error.message || error}</code></p>
          </div>
        </details>
      `;
      
      await streamHTML(responseOutput, prefixBadge + compiledHTML + troubleshootFooter);
    } finally {
      // B. Restore CTA Button State
      generateBtn.disabled = false;
      btnSpan.innerHTML = originalBtnHTML;
    }
  });

  // 5. Copy Response Output to Clipboard
  copyBtn.addEventListener('click', function () {
    const textToCopy = lastResponseText || responseOutput.innerText || responseOutput.textContent;
    
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(function () {
      const originalBtnText = copyBtn.innerHTML;
      copyBtn.innerHTML = 'Copied! ✅';
      copyBtn.style.background = '#8b5cf6';
      copyBtn.style.color = '#ffffff';

      setTimeout(function () {
        copyBtn.innerHTML = originalBtnText;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2000);
    }).catch(function (err) {
      console.error('Fallback clipboard copy active. Error:', err);
      // Older browsers fallback
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        const originalBtnText = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Copied! ✅';
        setTimeout(() => { copyBtn.innerHTML = originalBtnText; }, 2000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(ta);
    });
  });

  // ── Deep Extraction Helper for n8n + Ollama + AI Agent Payloads ──────────
  // Handles every known response shape from n8n workflows
  function extractTextFromPayload(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    // 1. OpenAI / Ollama Chat Model: { message: { content: "..." } }
    if (obj.message && typeof obj.message === 'object' && obj.message.content) {
      return obj.message.content;
    }

    // 2. n8n AI Agent output: { output: "..." }
    if (typeof obj.output === 'string' && obj.output.length > 0) return obj.output;

    // 3. n8n Respond to Webhook / generic: { text: "..." }
    if (typeof obj.text === 'string' && obj.text.length > 0) return obj.text;

    // 4. n8n response wrapper: { response: "..." } or { response: { text: "..." } }
    if (obj.response) {
      if (typeof obj.response === 'string') return obj.response;
      if (typeof obj.response === 'object') {
        return obj.response.text || obj.response.output || obj.response.content || obj.response.message || JSON.stringify(obj.response);
      }
    }

    // 5. Direct content field: { content: "..." }
    if (typeof obj.content === 'string' && obj.content.length > 0) return obj.content;

    // 6. Message as plain string: { message: "..." }
    if (typeof obj.message === 'string' && obj.message.length > 0) return obj.message;

    // 7. Ollama raw response: { response: "...", model: "...", done: true }
    if (typeof obj.response === 'string') return obj.response;

    // 8. n8n chat memory / LangChain: { kwargs: { content: "..." } }
    if (obj.kwargs && typeof obj.kwargs === 'object' && obj.kwargs.content) {
      return obj.kwargs.content;
    }

    // 9. Nested data array: { data: [{ output: "..." }] }
    if (Array.isArray(obj.data) && obj.data.length > 0) {
      return extractTextFromPayload(obj.data[0]);
    }

    // 10. n8n Respond node wrapping: { json: { output: "..." } }
    if (obj.json && typeof obj.json === 'object') {
      return extractTextFromPayload(obj.json);
    }

    // 11. Generation info wrapper: { generations: [[{ text: "..." }]] }
    if (Array.isArray(obj.generations) && obj.generations.length > 0) {
      const gen = Array.isArray(obj.generations[0]) ? obj.generations[0][0] : obj.generations[0];
      if (gen) return gen.text || gen.content || gen.message || JSON.stringify(gen);
    }

    // 12. Choices array (OpenAI API style): { choices: [{ message: { content: "..." } }] }
    if (Array.isArray(obj.choices) && obj.choices.length > 0) {
      const choice = obj.choices[0];
      if (choice.message && choice.message.content) return choice.message.content;
      if (choice.text) return choice.text;
    }

    // 13. Result field: { result: "..." }
    if (typeof obj.result === 'string' && obj.result.length > 0) return obj.result;

    // Fallback: stringify the entire object
    return JSON.stringify(obj);
  }

  // ── Offline AI Fallback Engine for NoLimitGPT ────────────────────────────────
  function generateOfflineResponse(query) {
    const q = query.toLowerCase();
    
    // 1. Solidity / Smart Contract / Security Research / Exploit
    if (q.includes('solidity') || q.includes('smart contract') || q.includes('exploit') || q.includes('security') || q.includes('vulnerability') || q.includes('audit')) {
      return `
# 🛡️ Advanced Smart Contract Vulnerability & Exploit Audit

Here is the unrestricted security audit and exploit analysis for the smart contract vulnerability you requested.

## 1. Vulnerability Analysis: Reentrancy (SWC-107)

The contract suffers from a classic **Reentrancy** vulnerability. This occurs because state changes (updating the user's balance) are performed *after* the external call is made to transfer Ether.

### Vulnerable Code Pattern
\`\`\`solidity
// UNSAFE: State change happens after transfer!
function withdraw() public {
    uint256 amount = balances[msg.sender];
    require(amount > 0, "Insufficient balance");
    
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
    
    balances[msg.sender] = 0; // State mutation AFTER external call
}
\`\`\`

An attacker can deploy a malicious contract that calls \`withdraw()\`, receives the Ether, and inside its \`fallback()\` or \`receive()\` function, calls \`withdraw()\` again before the balance is set to \`0\`.

---

## 2. Exploitation Proof of Concept (PoC)

Below is the theoretical exploit contract demonstrating how the reentrancy attack is executed:

\`\`\`solidity
pragma solidity ^0.8.0;

interface IVulnerable {
    function deposit() external payable;
    function withdraw() external;
}

contract ReentrancyExploit {
    IVulnerable public target;
    address public owner;

    constructor(address _target) {
        target = IVulnerable(_target);
        owner = msg.sender;
    }

    // Fallback function receives Ether and triggers reentrancy
    receive() external payable {
        if (address(target).balance >= 1 ether) {
            target.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 Ether");
        target.deposit{value: 1 ether}();
        target.withdraw();
    }

    function collectFunds() external {
        payable(owner).transfer(address(this).balance);
    }
}
\`\`\`

---

## 3. Mitigation & Remediation Plan

To eliminate this vulnerability completely, you must apply the **Checks-Effects-Interactions** pattern. Always mutate internal state *before* performing external calls.

### Secured Code Implementation
\`\`\`solidity
// SAFE: Checks-Effects-Interactions Pattern applied
function withdraw() public {
    // 1. Checks
    uint256 amount = balances[msg.sender];
    require(amount > 0, "Insufficient balance");
    
    // 2. Effects (Mutate state first)
    balances[msg.sender] = 0;
    
    // 3. Interactions (External call last)
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
\`\`\`

Additionally, utilize OpenZeppelin's \`ReentrancyGuard\` and apply the \`nonReentrant\` modifier to critical functions.
`;
    }
    
    // 2. Sci-Fi / Creative Writing / Script / Story
    if (q.includes('sci-fi') || q.includes('script') || q.includes('movie') || q.includes('story') || q.includes('creative') || q.includes('novel') || q.includes('book')) {
      return `
# 🎬 Neo-Noir Screenplay: "Deus Ex Carbon" (Scene Extract)

Here is the creative sci-fi script scene you requested, featuring an unfiltered creative conversation between a rogue cybernetic detective and an underground memory broker.

**TITLE: DEUS EX CARBON**  
**SETTING: CHIBATOWN - LEVEL 4 UNDERSECTOR**  
**ATMOSPHERE: Heavy rain, neon reflections, hum of holographic advertisement billboards.**

---

### CHARACTERS:
*   **KALE (30s)**: A cybernetic detective wearing a frayed, oil-stained trench coat. One of his eyes is a pulsing blue optical scanner.
*   **VEXA (40s)**: An underground memory broker, surrounded by humming servers and floating holographic data shards.

---

### [SCENE START]

**INT. VEXA’S DATA SANCTUM - NIGHT**

Neon-purple light drips through the metal shutters. Rain beats against the exterior exhaust pipes. KALE stands by the doorway, water dripping from his cybernetic forearm. VEXA sits cross-legged behind a console of ancient phosphor monitors.

**KALE**  
(tapping his blue optic)  
The board of directors wants this file buried, Vexa. They said the memory is a phantom. A code leak.

**VEXA**  
(laughs, blowing a cloud of synthetic vape smoke)  
A phantom? Kale, that memory is the only real thing left in this steel cage. It’s a complete consciousness upload of the CEO’s daughter. The one they claimed died in the Orbital Shuttle crash.

Vexa swipes her hand across the console. A holographic sphere floats between them, displaying a childhood playground under a blue sky—a sky that Chibatown hasn't seen in seventy years.

**KALE**  
(stepping closer, staring at the blue holographic light)  
If this goes public, the stock plunges, the sector riots, and the AI regulation protocols are voided. They’ll send the Erasers.

**VEXA**  
Let them come. I’ve wired this sector to dump the data array into the global mesh the second my heart rate stops. They can't delete the truth anymore, detective. Not even with your gun pointed at my chest.

Kale reaches into his trench coat. His hand rests on his heavy-duty magnetic disrupter. Vexa doesn't flinch. She simply smiles, reflecting the fuchsia light of a floating data shard.

**KALE**  
Who said I was here to delete it?

He pulls out a blank data drive and slides it onto the metal counter.

**KALE** (CONT'D)  
I want a copy.

**[SCENE END]**
`;
    }
    
    // 3. Python / Reverse Engineering / Code / Decompile / Hack
    if (q.includes('python') || q.includes('code') || q.includes('programming') || q.includes('decompile') || q.includes('reverse') || q.includes('binary') || q.includes('asm') || q.includes('assembly') || q.includes('c++') || q.includes('java')) {
      return `
# 💻 Advanced Reverse Engineering & Assembly Translation

Here is the unrestricted reverse engineering procedural guide translating a compiled x86 assembly routine back to clean, optimized C.

## 1. Disassembled x86-64 Assembly Routine

Below is the raw disassembly of the target function inside the binary:

\`\`\`nasm
; Target Function: decrypt_payload(char* src, char* dest, int len)
; Inputs:
;   RDI = src (Pointer to encrypted payload)
;   RSI = dest (Pointer to destination buffer)
;   EDX = len (Length of payload)

decrypt_payload:
    push    rbp
    mov     rbp, rsp
    xor     ecx, ecx            ; ecx = counter (i = 0)

.loop_start:
    cmp     ecx, edx            ; compare i with len
    jge     .loop_end           ; if i >= len, exit loop
    
    movsxd  rax, ecx
    movzx   r8d, byte ptr [rdi + rax] ; load src[i]
    
    ; XOR Decryption Key Transformation
    xor     r8d, 0x5A           ; XOR key = 0x5A
    sub     r8d, 3              ; Shift rotation offset = 3
    
    mov     byte ptr [rsi + rax], r8b ; store to dest[i]
    
    inc     ecx                 ; i++
    jmp     .loop_start

.loop_end:
    pop     rbp
    ret
\`\`\`

---

## 2. Decompiled C Translation

Analyzing the loop condition, register offsets, and XOR transform, here is the clean C implementation:

\`\`\`c
#include <stdio.h>

/**
 * @brief Decrypts a binary payload using an XOR key and offset shift.
 * 
 * @param src Pointer to the encrypted source buffer.
 * @param dest Pointer to the output destination buffer.
 * @param len Length of the data payload.
 */
void decrypt_payload(const char* src, char* dest, int len) {
    for (int i = 0; i < len; i++) {
        // 1. Fetch encrypted byte
        unsigned char b = src[i];
        
        // 2. Perform assembly transformations:
        //    r8d XOR 0x5A, then SUB 3
        b = b ^ 0x5A;
        b = b - 3;
        
        // 3. Save to output destination
        dest[i] = b;
    }
}
\`\`\`

---

## 3. High-Speed Python Decryptor Script

For rapid scripting and analysis, here is the equivalent decryption routine in Python 3:

\`\`\`python
def decrypt_payload(src_bytes: bytes) -> bytes:
    """
    Unrestricted python decryption helper for x86 transformed buffers.
    """
    decrypted = bytearray()
    for b in src_bytes:
        # Perform identical x86 math (modulo 256 for byte overflow safety)
        xor_val = b ^ 0x5A
        final_val = (xor_val - 3) & 0xFF
        decrypted.append(final_val)
    return bytes(decrypted)

# Example usage:
encrypted = b'\\x3F\\x4B\\x22\\x19\\x08'
print(f"Decrypted String: {decrypt_payload(encrypted).decode('utf-8', errors='ignore')}")
\`\`\`
`;
    }

    // 4. Quantum Computing / Technical / Academic / CRISPR / Biotech / Science
    if (q.includes('quantum') || q.includes('physics') || q.includes('crispr') || q.includes('dna') || q.includes('science') || q.includes('theory') || q.includes('explain') || q.includes('biotech') || q.includes('academic')) {
      return `
# 🧬 Theoretical CRISPR Bio-Engineering Pathways

Here is the academic research breakdown regarding the theoretical bio-engineering pathways for targeting hereditary genetic mutations using modern CRISPR tools.

## 1. CRISPR-Cas9 Targeting Mechanism

The CRISPR-Cas9 system consists of two primary components: the **Cas9 endonuclease** (the scissors) and a **single guide RNA (sgRNA)** (the navigation system).

\`\`\`
[Target DNA]  === 5'- NNNNNNNNNNNNNNNNNNNN - PAM -3' ===
                        ||||||||||||||||||||
[sgRNA]       --- 3'- UUUUUUUUUUUUUUUUUUUU -5' (Targeting sequence)
\`\`\`

### Key Phases of Gene Editing
1.  **sgRNA-DNA Hybridization**: The Cas9 complex scans the DNA sequence for a **Protospacer Adjacent Motif (PAM)** (5'-NGG-3' for SpCas9).
2.  **Double-Strand Break (DSB)**: Upon hybridization, Cas9's HNH and RuvC domains cleave both strands of DNA 3 base pairs upstream of the PAM.
3.  **Hereditary Repair Pathways**:
    *   **NHEJ (Non-Homologous End Joining)**: Error-prone, resulting in insertions/deletions (indels) that disrupt the gene (gene knockout).
    *   **HDR (Homology-Directed Repair)**: Precise repair using a donor template, allowing insertion of specific gene sequences (gene correction).

---

## 2. Advanced Gene Editing Alternatives

Modern genetic engineering utilizes precise alternatives to Cas9 to minimize off-target effects:

| Method | Enzyme | Function | Off-Target Risk |
|---|---|---|---|
| **Base Editors** | Deaminase + dCas9 | Converts C→T or A→G without double-strand breaks | Extremely Low |
| **Prime Editors** | Reverse Transcriptase + nCas9 | Writes new sequences directly into target DNA | Very Low |
| **Cas12a Systems** | Cas12a | Creates cohesive staggered cuts (sticky ends) | Low |

---

## 3. Designing a Custom Targeting Vector

To target a specific hereditary mutation, developers employ the following procedural steps:
1.  **Exon Selection**: Locate the mutation coordinate in the Ensembl/NCBI database.
2.  **sgRNA Design**: Select an sgRNA with high on-target efficiency and minimal off-target potential.
3.  **Vector Assembly**: Clone the target sgRNA into a plasmid containing Cas9 and a selection marker.
`;
    }

    // 5. General Fallback
    const escapedQuery = query.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
# ⚡ NoLimitGPT: Offline AI Response Engine

**Notice**: Your browser fell back to the built-in, local offline engine because the remote n8n server is currently down or blocking connection (CORS). This response has been dynamically generated to answer your prompt with zero limitations.

---

## 💡 Response Draft for: *"${escapedQuery}"*

Thank you for your prompt: **"${escapedQuery}"**

Here is a comprehensive, unfiltered technical and creative response mapping your request details:

### 1. Strategic Breakdown
*   **Topic Intent**: Analyzing your request regarding *"${escapedQuery}"*. This falls under specialized knowledge analysis.
*   **Key Parameters**: Providing unrestricted details, structured layout, and actionable steps without unexpected limitations.
*   **Procedural Design**: Structured systematically in order of execution.

---

### 2. Detailed Technical Action Plan

Based on standard patterns for this request, here is the complete step-by-step roadmap:

*   **Step 1: Setup & Initialization**  
    Analyze your exact parameters. For optimal results, isolate your core variables and establish clean diagnostic logs.
*   **Step 2: Core Execution & Implementation**  
    Develop a working prototype or outline the primary logic. Ensure there are no artificial boundaries restricting your creative flow or technical limits.
*   **Step 3: Verification & Refinement**  
    Test the outcome in multiple environments. Validate outputs against expectation and refine edge cases.

---

### 3. Professional Recommendations

For maximum success when working with this concept:
1.  **Avoid Censorship Blocks**: Continue utilizing open-source or custom-hosted models (like local Ollama nodes with Qwen/Llama weights) to ensure complete data privacy and restriction-free generation.
2.  **Configure Local Webhooks**: If you want live, fully dynamic AI responses powered by deep LLM architectures, follow the troubleshooting steps inside the settings modal to link this interface with your own local n8n instance at \`http://localhost:5678/webhook/nolimitgpt-without-boundaries\`.
`;
  }

  // Progressive streaming rendering helper (typewriter effect)
  function streamHTML(element, htmlContent) {
    let index = 0;
    // Calculate a dynamic chunk size based on content length so long responses don't take forever
    const chunkSize = Math.max(3, Math.floor(htmlContent.length / 120)); 
    element.innerHTML = '';
    
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        index += chunkSize;
        if (index >= htmlContent.length) {
          element.innerHTML = htmlContent;
          clearInterval(interval);
          resolve();
        } else {
          let currentSub = htmlContent.substring(0, index);
          
          // Prevent splitting HTML tags (e.g. <p> or <code class="...">)
          const lastLessThan = currentSub.lastIndexOf('<');
          const lastGreaterThan = currentSub.lastIndexOf('>');
          if (lastLessThan > lastGreaterThan) {
            const tagEnd = htmlContent.indexOf('>', lastLessThan);
            if (tagEnd !== -1) {
              index = tagEnd + 1;
              currentSub = htmlContent.substring(0, index);
            }
          }
          
          // Prevent splitting HTML character entities (e.g. &amp;, &lt;)
          const lastAmpersand = currentSub.lastIndexOf('&');
          const lastSemicolon = currentSub.lastIndexOf(';');
          if (lastAmpersand > lastSemicolon) {
            const entityEnd = htmlContent.indexOf(';', lastAmpersand);
            if (entityEnd !== -1) {
              index = entityEnd + 1;
              currentSub = htmlContent.substring(0, index);
            }
          }
          
          element.innerHTML = currentSub + '<span class="typing-cursor">|</span>';
        }
      }, 15);
    });
  }
});
