const MODES = {
  beginner: {
    name: "Beginner",
    hint: "Focus on home-row control and steady rhythm. Prioritize accuracy over speed.",
    durationSec: 60,
    texts: [
      "asdf jkl; asdf jkl; keep your fingers on the home row and type evenly.",
      "small steps build strong habits. stay relaxed and press each key with control.",
      "the quick brown fox jumps over the lazy dog. keep your eyes on the screen."
    ]
  },
  advanced: {
    name: "Advanced",
    hint: "Use light keystrokes and look ahead by word groups while maintaining precision.",
    durationSec: 90,
    texts: [
      "consistent execution under pressure requires focus, timing, and fast error recovery.",
      "typing fluency comes from deliberate practice, efficient finger travel, and posture discipline.",
      "optimize cadence, reduce hesitation, and sustain accuracy through longer mixed-character passages 12345."
    ]
  }
};

const state = {
  mode: "beginner",
  isRunning: false,
  targetText: "",
  startTime: 0,
  timerId: null,
  errors: 0,
  durationSec: MODES.beginner.durationSec
};

const refs = {
  modeButtons: document.querySelectorAll(".mode-btn"),
  startBtn: document.getElementById("startBtn"),
  resetBtn: document.getElementById("resetBtn"),
  modeHint: document.getElementById("modeHint"),
  targetText: document.getElementById("targetText"),
  typingInput: document.getElementById("typingInput"),
  statusText: document.getElementById("statusText"),
  wpmValue: document.getElementById("wpmValue"),
  accuracyValue: document.getElementById("accuracyValue"),
  errorsValue: document.getElementById("errorsValue"),
  timeValue: document.getElementById("timeValue"),
  feedbackBox: document.getElementById("feedbackBox")
};

function pickText(mode) {
  const entries = MODES[mode].texts;
  return entries[Math.floor(Math.random() * entries.length)];
}

function setMode(mode) {
  state.mode = mode;
  state.durationSec = MODES[mode].durationSec;
  refs.modeButtons.forEach((btn) => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  refs.modeHint.textContent = MODES[mode].hint;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderTarget(progressText = "") {
  const target = state.targetText;
  let html = "";

  for (let i = 0; i < target.length; i += 1) {
    const char = escapeHtml(target[i]);
    if (i < progressText.length) {
      html += progressText[i] === target[i] ? `<span class=\"char-correct\">${char}</span>` : `<span class=\"char-wrong\">${char}</span>`;
    } else if (i === progressText.length && state.isRunning) {
      html += `<span class=\"char-current\">${char}</span>`;
    } else {
      html += char;
    }
  }

  refs.targetText.innerHTML = html;
}

function getElapsedSeconds() {
  if (!state.startTime) {
    return 0;
  }
  return Math.max(0, Math.floor((Date.now() - state.startTime) / 1000));
}

function calculateStats(inputValue) {
  const elapsed = Math.max(1, getElapsedSeconds());
  const minutes = elapsed / 60;
  const correctChars = inputValue.split("").reduce((count, ch, idx) => count + Number(ch === state.targetText[idx]), 0);
  const totalTyped = inputValue.length;
  const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);
  const wpm = Math.max(0, Math.round(correctChars / 5 / minutes));

  state.errors = Math.max(0, totalTyped - correctChars);

  return { wpm, accuracy, elapsed, errors: state.errors };
}

function feedbackMessage({ wpm, accuracy, errors }) {
  if (accuracy >= 97 && wpm >= (state.mode === "beginner" ? 25 : 45)) {
    return "Excellent control and rhythm. Maintain this pace for long sessions.";
  }

  if (accuracy < 90) {
    return `Accuracy is low (${accuracy}%). Slow down and focus on key precision.`;
  }

  if (errors > 12) {
    return "Error rate is rising. Relax your hands and reduce over-speeding.";
  }

  if (wpm < (state.mode === "beginner" ? 20 : 35)) {
    return "Speed is below target. Practice smooth finger transitions and look ahead by words.";
  }

  return "Good progress. Keep a consistent cadence and avoid hard key presses.";
}

function updateMetrics(inputValue) {
  const stats = calculateStats(inputValue);
  refs.wpmValue.textContent = String(stats.wpm);
  refs.accuracyValue.textContent = `${stats.accuracy}%`;
  refs.errorsValue.textContent = String(stats.errors);
  refs.timeValue.textContent = `${stats.elapsed}s`;
  refs.feedbackBox.textContent = feedbackMessage(stats);
}

function stopSession(completed = false) {
  state.isRunning = false;
  clearInterval(state.timerId);
  state.timerId = null;

  refs.typingInput.disabled = true;
  refs.statusText.textContent = completed
    ? "Session complete. Review your feedback and start a new round."
    : "Session stopped. Press Start Session to try again.";
}

function startSession() {
  state.isRunning = true;
  state.startTime = Date.now();
  state.errors = 0;
  state.targetText = pickText(state.mode);

  refs.typingInput.disabled = false;
  refs.typingInput.value = "";
  refs.typingInput.focus();
  refs.statusText.textContent = `Session live (${MODES[state.mode].name}) - ${state.durationSec} seconds.`;

  renderTarget();
  updateMetrics("");

  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    const elapsed = getElapsedSeconds();
    refs.timeValue.textContent = `${elapsed}s`;

    if (elapsed >= state.durationSec) {
      updateMetrics(refs.typingInput.value);
      stopSession(true);
    }
  }, 250);
}

function resetSession() {
  stopSession(false);
  state.startTime = 0;
  state.errors = 0;
  state.targetText = "";

  refs.typingInput.value = "";
  refs.typingInput.disabled = true;
  refs.typingInput.placeholder = "Press Start Session to begin";

  refs.targetText.textContent = "";
  refs.statusText.textContent = "Choose a mode and start your session.";
  refs.wpmValue.textContent = "0";
  refs.accuracyValue.textContent = "100%";
  refs.errorsValue.textContent = "0";
  refs.timeValue.textContent = "0s";
  refs.feedbackBox.textContent = "Start a session to receive real-time coaching.";
}

function handleTypingInput(event) {
  if (!state.isRunning) {
    return;
  }

  const inputValue = event.target.value;
  renderTarget(inputValue);
  updateMetrics(inputValue);

  if (inputValue === state.targetText) {
    stopSession(true);
  }
}

function attachEvents() {
  refs.modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setMode(btn.dataset.mode);
      if (!state.isRunning) {
        refs.statusText.textContent = `${MODES[state.mode].name} mode selected. Press Start Session.`;
      }
    });
  });

  refs.startBtn.addEventListener("click", startSession);
  refs.resetBtn.addEventListener("click", resetSession);
  refs.typingInput.addEventListener("input", handleTypingInput);
}

function init() {
  setMode(state.mode);
  attachEvents();
  refs.targetText.textContent = "";
}

init();
