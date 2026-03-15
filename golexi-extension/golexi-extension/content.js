(function () {
  "use strict";

  let settings = {};
  let isActive = false;
  let ttsActive = false;
  let ttsPaused = false;
  let currentWordIndex = 0;
  let allWords = [];
  let wordSpans = [];
  let utteranceQueue = [];
  let rulerEl = null;
  let overlayEl = null;
  let originalStyles = new Map();
  let ttsPanel = null;
  let readingContainer = null;

  chrome.storage.sync.get("golexi-settings", (result) => {
    settings = result["golexi-settings"] || getDefaultSettings();
    setupRuler();
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes["golexi-settings"]) {
      settings = changes["golexi-settings"].newValue;
      if (isActive) applyReadingStyles();
      updateOverlay();
      updateRuler();
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case "activate":
        activateGoLexi();
        sendResponse({ ok: true });
        break;
      case "deactivate":
        deactivateGoLexi();
        sendResponse({ ok: true });
        break;
      case "getStatus":
        sendResponse({ isActive, ttsActive, ttsPaused, progress: getProgress() });
        break;
      case "ttsPlay":
        startTTS();
        sendResponse({ ok: true });
        break;
      case "ttsPause":
        pauseTTS();
        sendResponse({ ok: true });
        break;
      case "ttsStop":
        stopTTS();
        sendResponse({ ok: true });
        break;
      case "ttsJump":
        jumpToWord(message.index);
        sendResponse({ ok: true });
        break;
      case "updateSettings":
        settings = message.settings;
        if (isActive) applyReadingStyles();
        updateOverlay();
        updateRuler();
        sendResponse({ ok: true });
        break;
      case "extractText":
        sendResponse({ text: extractPageText() });
        break;
    }
    return true;
  });

  function activateGoLexi() {
    if (isActive) return;
    isActive = true;
    applyReadingStyles();
    injectTTSPanel();
    if (settings.overlayEnabled) injectOverlay();
    if (settings.rulerEnabled) showRuler();
  }

  function deactivateGoLexi() {
    isActive = false;
    stopTTS();
    removeReadingStyles();
    removeTTSPanel();
    removeOverlay();
    hideRuler();
  }

  const FONT_MAP = {
    OpenDyslexic: '"OpenDyslexic", "Comic Sans MS", cursive',
    Arial: "Arial, sans-serif",
    Verdana: "Verdana, Geneva, sans-serif",
    Tahoma: "Tahoma, Geneva, sans-serif",
    "Times New Roman": '"Times New Roman", Times, serif',
    Georgia: "Georgia, serif",
    "Comic Sans": '"Comic Sans MS", "Comic Sans", cursive',
    Trebuchet: '"Trebuchet MS", Helvetica, sans-serif',
  };

  const THEME_MAP = {
    cream: { bg: "#fef9f0", text: "#3d2b1f", link: "#7c4a1a" },
    dark: { bg: "#1e1e2e", text: "#cdd6f4", link: "#89b4fa" },
    pastel: { bg: "#f5f0ff", text: "#3b1f5e", link: "#7c3aed" },
    blue: { bg: "#eff6ff", text: "#1e3a5f", link: "#2563eb" },
    green: { bg: "#f0fdf4", text: "#14532d", link: "#16a34a" },
    yellow: { bg: "#fefce8", text: "#713f12", link: "#ca8a04" },
  };

  function applyReadingStyles() {
    const theme = THEME_MAP[settings.theme] || THEME_MAP.cream;
    const font = FONT_MAP[settings.fontFamily] || FONT_MAP.Arial;

    const elements = document.querySelectorAll(
      "p, li, td, th, h1, h2, h3, h4, h5, h6, span, a, div[class*='content'], article, section, main"
    );

    elements.forEach((el) => {
      if (!originalStyles.has(el)) {
        originalStyles.set(el, {
          fontSize: el.style.fontSize,
          lineHeight: el.style.lineHeight,
          letterSpacing: el.style.letterSpacing,
          wordSpacing: el.style.wordSpacing,
          fontFamily: el.style.fontFamily,
          backgroundColor: el.style.backgroundColor,
          color: el.style.color,
        });
      }

      el.style.fontSize = settings.fontSize + "px";
      el.style.lineHeight = settings.lineSpacing;
      el.style.letterSpacing = settings.letterSpacing + "px";
      el.style.wordSpacing = settings.wordSpacing + "em";
      el.style.fontFamily = font;
    });

    if (!originalStyles.has(document.body)) {
      originalStyles.set(document.body, {
        backgroundColor: document.body.style.backgroundColor,
        color: document.body.style.color,
      });
    }
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;

    let styleTag = document.getElementById("golexi-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "golexi-style";
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      * { max-width: 900px !important; }
      body { background-color: ${theme.bg} !important; color: ${theme.text} !important; }
      p, li, td, h1, h2, h3, h4, h5, h6, article, section {
        font-size: ${settings.fontSize}px !important;
        line-height: ${settings.lineSpacing} !important;
        letter-spacing: ${settings.letterSpacing}px !important;
        word-spacing: ${settings.wordSpacing}em !important;
        font-family: ${font} !important;
        color: ${theme.text} !important;
      }
      a { color: ${theme.link} !important; }
      .golexi-word-highlight {
        background-color: ${settings.highlightColor} !important;
        border-radius: 3px !important;
        padding: 0 2px !important;
        font-weight: bold !important;
        outline: 2px solid rgba(0,0,0,0.2) !important;
      }
      .golexi-sentence-highlight {
        background-color: ${settings.highlightColor}44 !important;
        border-radius: 4px !important;
        padding: 2px 4px !important;
      }
      .golexi-focus-dim {
        opacity: 0.25 !important;
        transition: opacity 0.2s !important;
      }
    `;
  }

  function removeReadingStyles() {
    originalStyles.forEach((orig, el) => {
      Object.assign(el.style, orig);
    });
    originalStyles.clear();

    const styleTag = document.getElementById("golexi-style");
    if (styleTag) styleTag.remove();

    clearHighlights();
  }

  function extractPageText() {
    const article = document.querySelector("article, main, [role='main'], .content, #content, #main");
    const container = article || document.body;
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const el = node.parentElement;
          if (!el) return NodeFilter.FILTER_REJECT;
          const tag = el.tagName.toLowerCase();
          const skip = ["script", "style", "noscript", "head", "nav", "footer", "header", "aside", "button", "input", "select", "textarea"];
          if (skip.includes(tag)) return NodeFilter.FILTER_REJECT;
          const text = node.textContent.trim();
          if (!text) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes.map((n) => n.textContent.trim()).join(" ").replace(/\s+/g, " ").trim();
  }

  function prepareWordSpans() {
    wordSpans = [];
    allWords = [];
    const textNodes = getReadableTextNodes();

    textNodes.forEach((node) => {
      const parent = node.parentElement;
      if (!parent || parent.dataset.goLexiWrapped) return;

      const text = node.textContent;
      const words = text.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      words.forEach((part) => {
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else if (part.trim()) {
          const span = document.createElement("span");
          span.textContent = part;
          span.dataset.goLexiWord = allWords.length;
          wordSpans.push(span);
          allWords.push(part);
          fragment.appendChild(span);
        }
      });

      parent.dataset.goLexiWrapped = "1";
      node.replaceWith(fragment);
    });
  }

  function getReadableTextNodes() {
    const article = document.querySelector("article, main, [role='main']") || document.body;
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const el = node.parentElement;
        if (!el) return NodeFilter.FILTER_REJECT;
        const tag = el.tagName.toLowerCase();
        const skip = ["script", "style", "noscript", "head", "nav", "footer", "header", "aside", "button", ".golexi-tts-panel"];
        if (skip.some((s) => tag === s || el.closest(s))) return NodeFilter.FILTER_REJECT;
        if (el.dataset.goLexiWrapped) return NodeFilter.FILTER_REJECT;
        const text = node.textContent.trim();
        if (text.length < 2) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  function startTTS() {
    if (ttsActive && !ttsPaused) return;

    if (!allWords.length) {
      prepareWordSpans();
    }

    if (ttsPaused) {
      speechSynthesis.resume();
      ttsPaused = false;
      ttsActive = true;
      updateTTSPanel();
      return;
    }

    speechSynthesis.cancel();
    ttsActive = true;
    ttsPaused = false;
    speakFrom(currentWordIndex);
  }

  function speakFrom(index) {
    if (!ttsActive || index >= allWords.length) {
      ttsActive = false;
      currentWordIndex = 0;
      updateTTSPanel();
      clearHighlights();
      return;
    }

    const CHUNK = 20;
    const chunk = allWords.slice(index, index + CHUNK).join(" ");
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = settings.readingSpeed / 200;
    utterance.pitch = 1;

    let wordOffset = index;

    utterance.onboundary = (e) => {
      if (e.name !== "word") return;
      const wordIdx = chunk.substring(0, e.charIndex).split(/\s+/).filter(Boolean).length - 1 + wordOffset;
      if (wordIdx >= 0) {
        highlightWord(wordIdx);
        currentWordIndex = wordIdx;
        updateTTSProgress();
      }
    };

    utterance.onend = () => {
      if (!ttsActive) return;
      const next = index + CHUNK;
      currentWordIndex = next;
      speakFrom(next);
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        ttsActive = false;
        updateTTSPanel();
      }
    };

    speechSynthesis.speak(utterance);
    updateTTSPanel();
  }

  function pauseTTS() {
    if (!ttsActive) return;
    speechSynthesis.pause();
    ttsPaused = true;
    updateTTSPanel();
  }

  function stopTTS() {
    speechSynthesis.cancel();
    ttsActive = false;
    ttsPaused = false;
    currentWordIndex = 0;
    clearHighlights();
    updateTTSPanel();
  }

  function jumpToWord(index) {
    if (!ttsActive && !ttsPaused) return;
    speechSynthesis.cancel();
    currentWordIndex = index;
    ttsActive = true;
    ttsPaused = false;
    speakFrom(index);
  }

  function getProgress() {
    if (!allWords.length) return 0;
    return Math.round((currentWordIndex / allWords.length) * 100);
  }

  function highlightWord(index) {
    clearHighlights();
    if (!wordSpans[index]) return;

    const span = wordSpans[index];
    span.classList.add("golexi-word-highlight");

    span.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    if (settings.focusMode) {
      const currentPara = span.closest("p, li, h1, h2, h3, h4, h5, h6");
      document.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6").forEach((el) => {
        if (el !== currentPara) el.classList.add("golexi-focus-dim");
        else el.classList.remove("golexi-focus-dim");
      });
    }
  }

  function clearHighlights() {
    document.querySelectorAll(".golexi-word-highlight").forEach((el) => el.classList.remove("golexi-word-highlight"));
    document.querySelectorAll(".golexi-focus-dim").forEach((el) => el.classList.remove("golexi-focus-dim"));
  }

  function injectTTSPanel() {
    if (ttsPanel) return;

    ttsPanel = document.createElement("div");
    ttsPanel.className = "golexi-tts-panel";
    ttsPanel.innerHTML = `
      <div class="golexi-panel-inner">
        <div class="golexi-panel-left">
          <svg class="golexi-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span class="golexi-label">GoLexi</span>
        </div>
        <div class="golexi-panel-controls">
          <button id="golexi-stop-btn" title="Stop">
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
          </button>
          <button id="golexi-play-btn" class="golexi-play-main" title="Play/Pause">
            <svg class="golexi-icon-play" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            <svg class="golexi-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
        </div>
        <div class="golexi-panel-center">
          <div class="golexi-progress-bar">
            <div class="golexi-progress-fill" id="golexi-progress-fill"></div>
          </div>
          <span class="golexi-progress-label" id="golexi-progress-label">0%</span>
        </div>
        <div class="golexi-panel-right">
          <label class="golexi-speed-label">Speed</label>
          <input type="range" id="golexi-speed-slider" min="80" max="400" step="10" value="${settings.readingSpeed}" class="golexi-speed-slider"/>
          <span class="golexi-speed-val" id="golexi-speed-val">${settings.readingSpeed}</span>
        </div>
        <button id="golexi-close-btn" class="golexi-close-btn" title="Close GoLexi">✕</button>
      </div>
    `;

    const style = document.createElement("style");
    style.id = "golexi-panel-style";
    style.textContent = getPanelCSS();
    document.head.appendChild(style);
    document.body.appendChild(ttsPanel);

    document.getElementById("golexi-play-btn").addEventListener("click", () => {
      if (ttsActive && !ttsPaused) pauseTTS();
      else startTTS();
    });

    document.getElementById("golexi-stop-btn").addEventListener("click", stopTTS);

    document.getElementById("golexi-close-btn").addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "deactivateFromContent" });
      deactivateGoLexi();
    });

    document.getElementById("golexi-speed-slider").addEventListener("input", (e) => {
      settings.readingSpeed = parseInt(e.target.value);
      document.getElementById("golexi-speed-val").textContent = settings.readingSpeed;
      chrome.storage.sync.set({ "golexi-settings": settings });
    });
  }

  function updateTTSPanel() {
    if (!ttsPanel) return;
    const playBtn = document.getElementById("golexi-play-btn");
    if (!playBtn) return;
    const playIcon = playBtn.querySelector(".golexi-icon-play");
    const pauseIcon = playBtn.querySelector(".golexi-icon-pause");

    if (ttsActive && !ttsPaused) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
    updateTTSProgress();
  }

  function updateTTSProgress() {
    const fill = document.getElementById("golexi-progress-fill");
    const label = document.getElementById("golexi-progress-label");
    if (!fill || !label) return;
    const p = getProgress();
    fill.style.width = p + "%";
    label.textContent = p + "%";
  }

  function removeTTSPanel() {
    if (ttsPanel) {
      ttsPanel.remove();
      ttsPanel = null;
    }
    const s = document.getElementById("golexi-panel-style");
    if (s) s.remove();
  }

  function injectOverlay() {
    if (overlayEl) return;
    overlayEl = document.createElement("div");
    overlayEl.id = "golexi-overlay";
    overlayEl.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none; z-index: 999998;
      background-color: ${settings.overlayColor};
      opacity: ${settings.overlayOpacity};
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(overlayEl);
  }

  function updateOverlay() {
    if (!settings.overlayEnabled) { removeOverlay(); return; }
    if (!overlayEl) injectOverlay();
    overlayEl.style.backgroundColor = settings.overlayColor;
    overlayEl.style.opacity = settings.overlayOpacity;
  }

  function removeOverlay() {
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
  }

  function setupRuler() {
    rulerEl = document.createElement("div");
    rulerEl.id = "golexi-ruler";
    rulerEl.style.cssText = `
      display: none; position: fixed; left: 0; width: 100vw; height: 32px;
      background: rgba(99,102,241,0.18); border-top: 2px solid rgba(99,102,241,0.5);
      border-bottom: 2px solid rgba(99,102,241,0.5); pointer-events: none;
      z-index: 999997; transition: top 0.05s linear;
    `;
    document.body.appendChild(rulerEl);

    document.addEventListener("mousemove", (e) => {
      if (rulerEl && settings.rulerEnabled && isActive) {
        rulerEl.style.top = e.clientY - 16 + "px";
      }
    });
  }

  function showRuler() { if (rulerEl) rulerEl.style.display = "block"; }
  function hideRuler() { if (rulerEl) rulerEl.style.display = "none"; }
  function updateRuler() {
    if (settings.rulerEnabled && isActive) showRuler();
    else hideRuler();
  }

  function getDefaultSettings() {
    return {
      fontSize: 18, lineSpacing: 1.8, letterSpacing: 0.5, wordSpacing: 0.3,
      fontFamily: "Arial", theme: "cream", readingSpeed: 200,
      highlightColor: "#fef08a", focusMode: false, rulerEnabled: false,
      overlayEnabled: false, overlayColor: "#fef9c3", overlayOpacity: 0.3,
    };
  }

  function getPanelCSS() {
    return `
      .golexi-tts-panel {
        position: fixed !important; bottom: 20px !important; left: 50% !important;
        transform: translateX(-50%) !important; z-index: 999999 !important;
        width: min(700px, 96vw) !important;
        background: linear-gradient(135deg, #312e81 0%, #4c1d95 100%) !important;
        border-radius: 16px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.35) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        color: white !important; padding: 12px 16px !important;
      }
      .golexi-panel-inner {
        display: flex !important; align-items: center !important; gap: 12px !important;
      }
      .golexi-panel-left {
        display: flex !important; align-items: center !important; gap: 6px !important;
        flex-shrink: 0 !important;
      }
      .golexi-logo-icon { width: 22px !important; height: 22px !important; color: #a5b4fc !important; }
      .golexi-label { font-weight: 700 !important; font-size: 13px !important; color: #a5b4fc !important; }
      .golexi-panel-controls {
        display: flex !important; align-items: center !important; gap: 6px !important;
        flex-shrink: 0 !important;
      }
      .golexi-panel-controls button {
        background: rgba(255,255,255,0.12) !important; border: none !important;
        border-radius: 8px !important; width: 34px !important; height: 34px !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
        cursor: pointer !important; color: white !important; padding: 0 !important;
        transition: background 0.15s !important;
      }
      .golexi-panel-controls button:hover { background: rgba(255,255,255,0.22) !important; }
      .golexi-panel-controls button svg { width: 14px !important; height: 14px !important; }
      .golexi-play-main {
        background: white !important; color: #312e81 !important;
        width: 40px !important; height: 40px !important; border-radius: 50% !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
      }
      .golexi-play-main:hover { background: #e0e7ff !important; }
      .golexi-play-main svg { color: #312e81 !important; }
      .golexi-panel-center {
        flex: 1 !important; display: flex !important; align-items: center !important; gap: 8px !important;
      }
      .golexi-progress-bar {
        flex: 1 !important; height: 6px !important; background: rgba(255,255,255,0.2) !important;
        border-radius: 99px !important; overflow: hidden !important;
      }
      .golexi-progress-fill {
        height: 100% !important; background: #a5b4fc !important;
        border-radius: 99px !important; width: 0% !important; transition: width 0.3s !important;
      }
      .golexi-progress-label {
        font-size: 11px !important; color: rgba(255,255,255,0.6) !important;
        min-width: 28px !important; text-align: right !important;
      }
      .golexi-panel-right {
        display: flex !important; align-items: center !important; gap: 6px !important;
        flex-shrink: 0 !important;
      }
      .golexi-speed-label { font-size: 10px !important; color: rgba(255,255,255,0.5) !important; }
      .golexi-speed-slider {
        -webkit-appearance: none !important; width: 70px !important; height: 4px !important;
        background: rgba(255,255,255,0.2) !important; border-radius: 99px !important;
        outline: none !important; cursor: pointer !important;
      }
      .golexi-speed-slider::-webkit-slider-thumb {
        -webkit-appearance: none !important; width: 14px !important; height: 14px !important;
        background: white !important; border-radius: 50% !important;
      }
      .golexi-speed-val { font-size: 11px !important; color: rgba(255,255,255,0.7) !important; min-width: 28px !important; }
      .golexi-close-btn {
        background: rgba(255,255,255,0.1) !important; border: none !important;
        border-radius: 6px !important; color: rgba(255,255,255,0.6) !important;
        cursor: pointer !important; font-size: 12px !important;
        padding: 4px 8px !important; transition: all 0.15s !important;
      }
      .golexi-close-btn:hover { background: rgba(255,255,255,0.2) !important; color: white !important; }
    `;
  }
})();
