import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Settings,
  Eye,
  Focus,
  RotateCcw,
  ChevronRight,
  Zap,
  BookOpen,
  Moon,
  Sun,
  Droplet,
  X,
} from "lucide-react";

const themeColors = {
  cream: {
    bg: "bg-amber-50",
    text: "text-amber-950",
    accent: "bg-amber-100",
    button: "bg-amber-200 hover:bg-amber-300",
    dark: "bg-amber-900 text-amber-50",
  },
  dark: {
    bg: "bg-slate-900",
    text: "text-slate-100",
    accent: "bg-slate-800",
    button: "bg-slate-700 hover:bg-slate-600",
    dark: "bg-slate-950 text-slate-100",
  },
  pastel: {
    bg: "bg-pink-50",
    text: "text-purple-900",
    accent: "bg-purple-100",
    button: "bg-purple-200 hover:bg-purple-300",
    dark: "bg-purple-900 text-pink-50",
  },
};

const defaultSettings = {
  fontSize: 18,
  lineSpacing: 1.8,
  letterSpacing: 0.5,
  fontFamily: "sans-serif",
  theme: "cream",
  readingSpeed: 200,
};

const sampleText = `The solar system is a gravitational system consisting of the Sun and all objects that orbit it.
The Sun contains 99.86 percent of the system's mass.
The most massive objects in the Solar System are the eight planets and five recognized dwarf planets.
Earth is the third planet from the Sun and the only known planet to harbor life.`;

// ================= MAIN =================

const GoLexiPrototype = () => {
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [cleanMode, setCleanMode] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  const speakingRef = useRef(false);

  const words = sampleText.split(" ");
  const sentences = sampleText.split("\n");

  // word count per sentence (for synchronization)
  const sentenceWordCounts = sentences.map((s) => s.split(" ").length);

  const theme = themeColors[settings.theme];

  // ================= SETTINGS STORAGE =================

  useEffect(() => {
    const saved = localStorage.getItem("golexi-settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("golexi-settings", JSON.stringify(settings));
  }, [settings]);

  // ================= SPEECH ENGINE =================

  const speakWord = (index) => {
    if (!speakingRef.current) return;

    if (index >= words.length) {
      setAudioPlaying(false);
      speakingRef.current = false;
      setCurrentWord(0);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(words[index]);

    utterance.rate = settings.readingSpeed / 200;

    utterance.onend = () => {
      if (!speakingRef.current) return;

      setCurrentWord(index + 1);
      speakWord(index + 1);
    };

    speechSynthesis.speak(utterance);
  };

  const playAudio = () => {
    speechSynthesis.cancel();
    speakingRef.current = true;
    setAudioPlaying(true);
    speakWord(currentWord);
  };

  const pauseAudio = () => {
    speechSynthesis.cancel();
    speakingRef.current = false;
    setAudioPlaying(false);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    speakingRef.current = false;
    setAudioPlaying(false);
    setCurrentWord(0);
  };

  // ================= COGNITIVE ADAPTATION =================

  useEffect(() => {
    if (currentWord > 20 && settings.readingSpeed < 180) {
      setSettings((prev) => ({
        ...prev,
        fontSize: prev.fontSize + 1,
      }));
    }
  }, [currentWord]);

  // ================= PROGRESS =================

  const progress = Math.floor((currentWord / words.length) * 100);

  const minutesLeft = Math.ceil(
    (words.length - currentWord) / settings.readingSpeed
  );

  // ================= SENTENCE SYNC =================

  const getCurrentSentenceIndex = () => {
    let total = 0;

    for (let i = 0; i < sentenceWordCounts.length; i++) {
      total += sentenceWordCounts[i];

      if (currentWord < total) {
        return i;
      }
    }

    return sentenceWordCounts.length - 1;
  };

  // ================= DASHBOARD =================

  const Dashboard = () => (
    <div className={`${theme.bg} ${theme.text} min-h-screen p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen />
        <h1 className="text-2xl font-bold">GoLexi</h1>
      </div>

      <div className={`${theme.accent} p-6 rounded-xl mb-6`}>
        <h2 className="font-semibold">Dyslexia Friendly Reader</h2>
        <p className="text-sm opacity-70">Adaptive reading technology</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setCurrentScreen("reading")}
          className={`${theme.dark} text-white rounded-xl p-4`}
        >
          <Eye className="mx-auto mb-2" />
          Start Reading
        </button>

        <button
          onClick={() => setCurrentScreen("settings")}
          className={`${theme.button} rounded-xl p-4`}
        >
          <Settings className="mx-auto mb-2" />
          Settings
        </button>
      </div>

      <div className="space-y-3">
        {[
          { icon: Focus, label: "Focus Mode", desc: "Read line by line" },
          { icon: Zap, label: "Adaptive Reading", desc: "Adjusts automatically" },
        ].map((f, i) => (
          <div key={i} className={`${theme.accent} p-4 rounded-xl flex gap-3`}>
            <f.icon size={18} />
            <div>
              <div className="text-sm font-semibold">{f.label}</div>
              <div className="text-xs opacity-60">{f.desc}</div>
            </div>
            <ChevronRight size={16} className="ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );

  // ================= READING MODE =================

  const ReadingMode = () => (
    <div className={`${theme.bg} ${theme.text} min-h-screen p-6`}>
      <div className="flex justify-between mb-6">
        <button onClick={() => setCurrentScreen("dashboard")}>
          <X />
        </button>

        <div>Reading Mode</div>

        <button onClick={() => setFocusMode(!focusMode)}>
          <Focus />
        </button>
      </div>

      <button
        onClick={() => setCleanMode(!cleanMode)}
        className="mb-4 text-sm underline"
      >
        {cleanMode
          ? "Disable Distraction-Free Mode"
          : "Enable Distraction-Free Mode"}
      </button>

      {!focusMode ? (
        <div
          className={`${theme.accent} p-8 rounded-xl mb-6 ${
            cleanMode ? "max-w-2xl mx-auto break-words" : ""
          }`}
          style={{
            fontSize: settings.fontSize,
            lineHeight: settings.lineSpacing,
            letterSpacing: settings.letterSpacing,
            fontFamily: settings.fontFamily,
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              className={`mr-1 ${
                i === currentWord && audioPlaying
                  ? "bg-indigo-200 font-bold rounded px-1"
                  : ""
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sentences.map((sentence, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl transition-all ${
                i === getCurrentSentenceIndex()
                  ? "bg-indigo-200 text-black font-semibold"
                  : "opacity-40"
              }`}
            >
              {sentence}
            </div>
          ))}
        </div>
      )}

      {/* PROGRESS */}

      <div className="mb-4">
        <div className="w-full h-2 bg-gray-300 rounded">
          <div className="h-2 bg-indigo-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="text-xs mt-1">
          {progress}% complete • {minutesLeft} min left
        </div>
      </div>

      {/* AUDIO */}

      <div className={`${theme.dark} p-6 rounded-xl text-white mb-4`}>
        <div className="flex items-center gap-4">
          <button
            onClick={audioPlaying ? pauseAudio : playAudio}
            className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center"
          >
            {audioPlaying ? <Pause /> : <Play />}
          </button>

          <div>
            <div className="text-sm font-semibold">Audio Reader</div>
            <div className="text-xs opacity-70">
              {settings.readingSpeed} WPM
            </div>
          </div>
        </div>

        {/* SPEED CONTROL */}

        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Speed</span>
            <span>{settings.readingSpeed} WPM</span>
          </div>

          <input
            type="range"
            min="100"
            max="400"
            step="10"
            value={settings.readingSpeed}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                readingSpeed: parseInt(e.target.value),
              }))
            }
            className="w-full"
          />

          <button
            onClick={stopAudio}
            className="mt-3 bg-red-500 text-white px-3 py-2 rounded"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );

  // ================= SETTINGS =================

  const SettingsScreen = () => (
    <div className={`${theme.bg} ${theme.text} min-h-screen p-6`}>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentScreen("dashboard")}>
          <X />
        </button>

        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-bold mb-3">Theme</h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "cream", icon: Sun },
            { id: "pastel", icon: Droplet },
            { id: "dark", icon: Moon },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSettings((s) => ({ ...s, theme: t.id }))}
              className={`p-4 rounded-xl border ${
                settings.theme === t.id ? "border-black" : ""
              }`}
            >
              <t.icon className="mx-auto" />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setSettings(defaultSettings)}
        className={`${theme.accent} w-full p-3 rounded-xl`}
      >
        <RotateCcw size={16} className="inline mr-2" />
        Reset Settings
      </button>
    </div>
  );

  return (
    <div className="font-sans">
      {currentScreen === "dashboard" && <Dashboard />}
      {currentScreen === "reading" && <ReadingMode />}
      {currentScreen === "settings" && <SettingsScreen />}
    </div>
  );
};

export default GoLexiPrototype;