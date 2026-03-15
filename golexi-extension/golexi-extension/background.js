chrome.runtime.onInstalled.addListener(() => {
  const defaultSettings = {
    fontSize: 18,
    lineSpacing: 1.8,
    letterSpacing: 0.5,
    wordSpacing: 0.3,
    fontFamily: "OpenDyslexic",
    theme: "cream",
    readingSpeed: 200,
    highlightColor: "#fef08a",
    focusMode: false,
    rulerEnabled: false,
    overlayEnabled: false,
    overlayColor: "#fef9c3",
    overlayOpacity: 0.3,
    autoScroll: false,
    syllableBreak: false,
  };

  chrome.storage.sync.get("golexi-settings", (result) => {
    if (!result["golexi-settings"]) {
      chrome.storage.sync.set({ "golexi-settings": defaultSettings });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === "content") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({ error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        });
      }
    });
    return true;
  }
});
