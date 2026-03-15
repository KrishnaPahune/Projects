// GoLexi Popup Script
// Manages all UI interactions, settings persistence, and communication with content script

"use strict";

// ─── Default Settings ────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  fontSize: 18,
  lineSpacing: 1.8,
  letterSpacing: 0.5,
  wordSpacing: 0.3,
  fontFamily: "Arial",
  theme: "cream",
  readingSpeed: 200,
  highlightColor: "#fef08a",
  focusMode: false,
  rulerEnabled: false,
  overlayEnabled: false,
  overlayColor: "#fef9c3",
  overlayOpacity: 0.3,
  voiceURI: "",
};

const PRESETS = {
  dyslexia: {
    fontFamily: "OpenDyslexic",
    fontSize: 18,
    lineSpacing: 2.0,
    letterSpacing: 1.0,
    wordSpacing: 0.5,
    theme: "cream",
    highlightColor: "#fef08a",
    readingSpeed: 180,
    focusMode: true,
    rulerEnabled: true,
    overlayEnabled: false,
  },
  lowvision: {
    fontFamily: "Arial",
    fontSize: 24,
    lineSpacing: 2.2,
    letterSpacing: 0.5,
    wordSpacing: 0.3,
    theme: "yellow",
    readingSpeed: 160,
    focusMode: false,
    rulerEnabled: false,
    overlayEnabled: false,
  },
  focus: {
    fontFamily: "Verdana",
    fontSize: 17,
    lineSpacing: 2.0,
    letterSpacing: 0.3,
    wordSpacing: 0.2,
    theme: "blue",
    highlightColor: "#bfdbfe",
    readingSpeed: 200,
    focusMode: true,
    rulerEnabled: true,
    overlayEnabled: false,
  },
  night: {
    fontFamily: "Arial",
    fontSize: 18,
    lineSpacing: 1.8,
    letterSpacing: 0.3,
    wordSpacing: 0.2,
    theme: "dark",
    readingSpeed: 200,
    focusMode: false,
    rulerEnabled: false,
    overlayEnabled: false,
  },
};

// ─── State ───────────────────────────────────────────────────────────────────
let settings = { ...DEFAULT_SETTINGS };
let isActive = false;
let ttsPlaying = false;
let ttsProgress = 0;

// ─── DOM refs ────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  bindUI();
  populateVoices();
  syncUIFromSettings();
  await syncStatusFromContent();
  setInterval(pollContentStatus, 1000);
});

// ─── Settings ─────────────────────────────────────────────────────────────────
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("golexi-settings", (result) => {
      if (result["golexi-settings"]) {
        settings = { ...DEFAULT_SETTINGS, ...result["golexi-settings"] };
      }
      resolve();
    });
  });
}

function saveSettings() {
  chrome.storage.sync.set({ "golexi-settings": settings });
  // Push to content script
  sendToContent({ action: "updateSettings", settings });
}

// ─── Content bridge ───────────────────────────────────────────────────────────
function sendToContent(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) return;
    chrome.tabs.sendMessage(tabs[0].id, message, () => {
      // silence "could not establish connection" errors on non-injectable tabs
      if (chrome.runtime.lastError) {}
    });
  });
}

async function syncStatusFromContent() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) { resolve(); return; }
      chrome.tabs.sendMessage(tabs[0].id, { action: "getStatus" }, (resp) => {
        if (chrome.runtime.lastError || !resp) { resolve(); return; }
        isActive = resp.isActive;
        ttsPlaying = resp.ttsActive && !resp.ttsPaused;
        ttsProgress = resp.progress || 0;
        updateActivateUI();
        updateTTSUI();
        resolve();
      });
    });
  });
}

function pollContentStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) return;
    chrome.tabs.sendMessage(tabs[0].id, { action: "getStatus" }, (resp) => {
      if (chrome.runtime.lastError || !resp) return;
      ttsPlaying = resp.ttsActive && !resp.ttsPaused;
      ttsProgress = resp.progress || 0;
      updateTTSUI();
    });
  });
}

// ─── UI Binding ───────────────────────────────────────────────────────────────
function bindUI() {
  // Tabs
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      $$(".tab-content").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
    });
  });

  // Settings gear → go to display tab
  $("btn-settings-tab").addEventListener("click", () => {
    $$(".tab")[2].click(); // Display tab
  });

  // ── Main Tab ──
  $("toggle-active").addEventListener("change", (e) => {
    isActive = e.target.checked;
    if (isActive) {
      sendToContent({ action: "activate" });
    } else {
      sendToContent({ action: "deactivate" });
    }
    updateActivateUI();
  });

  $("btn-play").addEventListener("click", () => {
    if (ttsPlaying) {
      sendToContent({ action: "ttsPause" });
      ttsPlaying = false;
    } else {
      if (!isActive) {
        // Auto-activate if not active
        isActive = true;
        $("toggle-active").checked = true;
        sendToContent({ action: "activate" });
        updateActivateUI();
        setTimeout(() => sendToContent({ action: "ttsPlay" }), 300);
      } else {
        sendToContent({ action: "ttsPlay" });
      }
      ttsPlaying = true;
    }
    updateTTSUI();
  });

  $("btn-stop").addEventListener("click", () => {
    sendToContent({ action: "ttsStop" });
    ttsPlaying = false;
    ttsProgress = 0;
    updateTTSUI();
  });

  $("speed-slider").addEventListener("input", (e) => {
    settings.readingSpeed = parseInt(e.target.value);
    $("speed-val").textContent = settings.readingSpeed;
    $("tts-wpm-badge").textContent = settings.readingSpeed + " WPM";
    saveSettings();
  });

  $("voice-select").addEventListener("change", (e) => {
    settings.voiceURI = e.target.value;
    saveSettings();
  });

  $("toggle-focus").addEventListener("change", (e) => {
    settings.focusMode = e.target.checked;
    saveSettings();
  });

  $("toggle-ruler").addEventListener("change", (e) => {
    settings.rulerEnabled = e.target.checked;
    saveSettings();
  });

  $("toggle-overlay").addEventListener("change", (e) => {
    settings.overlayEnabled = e.target.checked;
    $("toggle-overlay-2").checked = e.target.checked;
    toggleOverlayDetail(e.target.checked);
    saveSettings();
  });

  // ── Text Tab ──
  $("font-select").addEventListener("change", (e) => {
    settings.fontFamily = e.target.value;
    saveSettings();
  });

  $("font-size-slider").addEventListener("input", (e) => {
    settings.fontSize = parseInt(e.target.value);
    $("font-size-val").textContent = settings.fontSize + "px";
    saveSettings();
  });

  $("line-spacing-slider").addEventListener("input", (e) => {
    settings.lineSpacing = parseFloat(e.target.value);
    $("line-spacing-val").textContent = settings.lineSpacing.toFixed(1) + "×";
    saveSettings();
  });

  $("letter-spacing-slider").addEventListener("input", (e) => {
    settings.letterSpacing = parseFloat(e.target.value);
    $("letter-spacing-val").textContent = settings.letterSpacing + "px";
    saveSettings();
  });

  $("word-spacing-slider").addEventListener("input", (e) => {
    settings.wordSpacing = parseFloat(e.target.value);
    $("word-spacing-val").textContent = settings.wordSpacing.toFixed(1) + "em";
    saveSettings();
  });

  // ── Display Tab ──
  $$(".theme-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".theme-swatch").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      settings.theme = btn.dataset.theme;
      saveSettings();
    });
  });

  $$("#highlight-grid .highlight-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#highlight-grid .highlight-swatch").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      settings.highlightColor = btn.dataset.color;
      saveSettings();
    });
  });

  $("toggle-overlay-2").addEventListener("change", (e) => {
    settings.overlayEnabled = e.target.checked;
    $("toggle-overlay").checked = e.target.checked;
    toggleOverlayDetail(e.target.checked);
    saveSettings();
  });

  $$("#overlay-color-grid .highlight-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#overlay-color-grid .highlight-swatch").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      settings.overlayColor = btn.dataset.color;
      saveSettings();
    });
  });

  $("overlay-opacity-slider").addEventListener("input", (e) => {
    settings.overlayOpacity = parseFloat(e.target.value);
    $("overlay-opacity-val").textContent = Math.round(settings.overlayOpacity * 100) + "%";
    saveSettings();
  });

  // ── Tools Tab ──
  $$(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = PRESETS[btn.dataset.preset];
      if (!preset) return;
      settings = { ...settings, ...preset };
      saveSettings();
      syncUIFromSettings();
      // Visual feedback
      btn.style.background = "var(--accent-light)";
      btn.style.color = "var(--accent)";
      setTimeout(() => { btn.style.background = ""; btn.style.color = ""; }, 800);
    });
  });

  $("btn-extract-text").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, (resp) => {
        if (chrome.runtime.lastError || !resp) return;
        $("extracted-text-area").value = resp.text || "No text found.";
        $("text-modal").classList.remove("hidden");
      });
    });
  });

  $("btn-reset").addEventListener("click", () => {
    settings = { ...DEFAULT_SETTINGS };
    saveSettings();
    syncUIFromSettings();
  });

  $("close-modal").addEventListener("click", () => {
    $("text-modal").classList.add("hidden");
  });

  $("copy-text-btn").addEventListener("click", () => {
    const ta = $("extracted-text-area");
    ta.select();
    navigator.clipboard.writeText(ta.value).catch(() => document.execCommand("copy"));
    $("copy-text-btn").textContent = "Copied!";
    setTimeout(() => { $("copy-text-btn").textContent = "Copy Text"; }, 1500);
  });
}

// ─── Sync UI ──────────────────────────────────────────────────────────────────
function syncUIFromSettings() {
  // Text tab
  $("font-select").value = settings.fontFamily;
  $("font-size-slider").value = settings.fontSize;
  $("font-size-val").textContent = settings.fontSize + "px";
  $("line-spacing-slider").value = settings.lineSpacing;
  $("line-spacing-val").textContent = parseFloat(settings.lineSpacing).toFixed(1) + "×";
  $("letter-spacing-slider").value = settings.letterSpacing;
  $("letter-spacing-val").textContent = settings.letterSpacing + "px";
  $("word-spacing-slider").value = settings.wordSpacing;
  $("word-spacing-val").textContent = parseFloat(settings.wordSpacing).toFixed(1) + "em";

  // Main tab
  $("speed-slider").value = settings.readingSpeed;
  $("speed-val").textContent = settings.readingSpeed;
  $("tts-wpm-badge").textContent = settings.readingSpeed + " WPM";
  $("toggle-focus").checked = settings.focusMode;
  $("toggle-ruler").checked = settings.rulerEnabled;
  $("toggle-overlay").checked = settings.overlayEnabled;

  // Display tab
  $$(".theme-swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === settings.theme);
  });

  $$("#highlight-grid .highlight-swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color === settings.highlightColor);
  });

  $("toggle-overlay-2").checked = settings.overlayEnabled;
  toggleOverlayDetail(settings.overlayEnabled);
  $("overlay-opacity-slider").value = settings.overlayOpacity;
  $("overlay-opacity-val").textContent = Math.round(settings.overlayOpacity * 100) + "%";

  $$("#overlay-color-grid .highlight-swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color === settings.overlayColor);
  });
}

function updateActivateUI() {
  const toggle = $("toggle-active");
  const card = toggle.closest(".activate-card");
  const statusText = $("activate-status-text");

  toggle.checked = isActive;

  if (isActive) {
    card.classList.add("is-active");
    statusText.textContent = "Active on this page";
  } else {
    card.classList.remove("is-active");
    statusText.textContent = "Inactive on this page";
  }
}

function updateTTSUI() {
  const playIcon = document.querySelector(".play-icon");
  const pauseIcon = document.querySelector(".pause-icon");

  if (ttsPlaying) {
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
  } else {
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
  }

  $("tts-progress-fill").style.width = ttsProgress + "%";
  $("tts-progress-label").textContent = ttsProgress + "%";
}

function toggleOverlayDetail(show) {
  const detail = $("overlay-detail");
  if (show) detail.classList.remove("hidden");
  else detail.classList.add("hidden");
}

// ─── Voices ───────────────────────────────────────────────────────────────────
function populateVoices() {
  const select = $("voice-select");

  function fill() {
    const voices = speechSynthesis.getVoices();
    select.innerHTML = '<option value="">Default voice</option>';
    voices.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      if (v.voiceURI === settings.voiceURI) opt.selected = true;
      select.appendChild(opt);
    });
  }

  fill();
  speechSynthesis.onvoiceschanged = fill;
}
