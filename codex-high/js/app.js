import { generatePrompt, getFingerHint, getModeMetadata } from "./texts.js";
import {
  buildLiveFeedback,
  buildSummaryFeedback,
  computeConsistency,
  mergeMistakeMaps,
  summarizePrompt,
  topWeakKeys,
} from "./feedback.js";

const STORAGE_KEY = "typeflow_best_results_v1";

const elements = {
  modeButtons: Array.from(document.querySelectorAll(".mode-button")),
  beginnerMode: document.getElementById("beginner-mode"),
  advancedMode: document.getElementById("advanced-mode"),
  duration: document.getElementById("duration"),
  startBtn: document.getElementById("start-btn"),
  restartBtn: document.getElementById("restart-btn"),
  wpm: document.getElementById("wpm"),
  accuracy: document.getElementById("accuracy"),
  errors: document.getElementById("errors"),
  timeLeft: document.getElementById("time-left"),
  timeProgressFill: document.getElementById("time-progress-fill"),
  modeDescription: document.getElementById("mode-description"),
  bestResult: document.getElementById("best-result"),
  textDisplay: document.getElementById("text-display"),
  typingInput: document.getElementById("typing-input"),
  fingerHint: document.getElementById("finger-hint"),
  liveFeedback: document.getElementById("live-feedback"),
  summary: document.getElementById("summary"),
  summaryWpm: document.getElementById("summary-wpm"),
  summaryAccuracy: document.getElementById("summary-accuracy"),
  summaryCharacters: document.getElementById("summary-characters"),
  summaryStreak: document.getElementById("summary-streak"),
  summaryConsistency: document.getElementById("summary-consistency"),
  summaryWeakKeys: document.getElementById("summary-weak-keys"),
  summaryFeedback: document.getElementById("summary-feedback"),
};

const state = {
  mode: "beginner",
  duration: Number(elements.duration.value),
  isRunning: false,
  timerId: null,
  startedAt: 0,
  elapsedSeconds: 0,
  timeLeft: Number(elements.duration.value),
  prompt: "",
  totals: {
    typed: 0,
    correct: 0,
    errors: 0,
    bestStreak: 0,
    mistakes: {},
  },
  wpmSamples: [],
  bestResults: loadBestResults(),
};

function loadBestResults() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return {};
    }
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

function saveBestResults() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bestResults));
}

function toTime(seconds) {
  const safeSeconds = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function resetSessionTotals() {
  state.totals = {
    typed: 0,
    correct: 0,
    errors: 0,
    bestStreak: 0,
    mistakes: {},
  };
  state.wpmSamples = [];
}

function renderModeControls() {
  for (const button of elements.modeButtons) {
    const isActive = button.dataset.mode === state.mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function renderModeDescription() {
  const metadata = getModeMetadata(state.mode);
  elements.modeDescription.textContent = metadata.description;
}

function renderBestResult() {
  const best = state.bestResults[state.mode];
  if (!best) {
    elements.bestResult.textContent = "Best result: no completed sessions yet.";
    return;
  }
  elements.bestResult.textContent = `Best result: ${best.wpm} WPM at ${best.accuracy}% accuracy`;
}

function setPrompt(newPrompt) {
  state.prompt = newPrompt;
  renderPrompt();
  renderFingerHint();
}

function renderPrompt() {
  const input = elements.typingInput.value;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < state.prompt.length; index += 1) {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = state.prompt[index];

    if (index < input.length) {
      if (input[index] === state.prompt[index]) {
        span.classList.add("correct");
      } else {
        span.classList.add("incorrect");
      }
    } else if (index === input.length && state.isRunning) {
      span.classList.add("current");
    } else {
      span.classList.add("pending");
    }

    fragment.appendChild(span);
  }

  elements.textDisplay.replaceChildren(fragment);
}

function renderFingerHint() {
  const metadata = getModeMetadata(state.mode);
  if (!metadata.showFingerHints) {
    elements.fingerHint.textContent =
      "Advanced mode: distribute load across all fingers and keep your wrists neutral.";
    return;
  }

  const nextKey = state.prompt[elements.typingInput.value.length];
  elements.fingerHint.textContent = getFingerHint(nextKey);
}

function getCurrentSummary() {
  const current = summarizePrompt(state.prompt, elements.typingInput.value);
  return {
    typed: state.totals.typed + current.typed,
    correct: state.totals.correct + current.correct,
    errors: state.totals.errors + current.errors,
    bestStreak: Math.max(state.totals.bestStreak, current.bestStreak),
    mistakes: mergeMistakeMaps(state.totals.mistakes, current.mistakes),
  };
}

function getElapsedSeconds() {
  if (state.isRunning) {
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    return Math.max(0, Math.min(state.duration, elapsed));
  }
  return state.elapsedSeconds;
}

function calculateLiveMetrics() {
  const summary = getCurrentSummary();
  const elapsedSeconds = getElapsedSeconds();
  const elapsedMinutes = elapsedSeconds / 60;
  const accuracy =
    summary.typed === 0 ? 100 : Math.round((summary.correct / summary.typed) * 100);

  let wpm = 0;
  if (elapsedMinutes > 0 && summary.correct > 0) {
    wpm = Math.round(summary.correct / 5 / elapsedMinutes);
  }

  return {
    summary,
    wpm,
    accuracy,
  };
}

function renderTimer() {
  elements.timeLeft.textContent = toTime(state.timeLeft);
  const elapsed = state.duration - state.timeLeft;
  const progress = state.duration === 0 ? 0 : (elapsed / state.duration) * 100;
  elements.timeProgressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
}

function renderLiveStats() {
  const metrics = calculateLiveMetrics();
  elements.wpm.textContent = String(metrics.wpm);
  elements.accuracy.textContent = `${metrics.accuracy}%`;
  elements.errors.textContent = String(metrics.summary.errors);
  elements.liveFeedback.textContent = buildLiveFeedback({
    mode: state.mode,
    wpm: metrics.wpm,
    accuracy: metrics.accuracy,
    timeLeft: state.timeLeft,
  });
}

function applyCompletedPrompt() {
  const promptSummary = summarizePrompt(state.prompt, elements.typingInput.value);
  state.totals.typed += promptSummary.typed;
  state.totals.correct += promptSummary.correct;
  state.totals.errors += promptSummary.errors;
  state.totals.bestStreak = Math.max(state.totals.bestStreak, promptSummary.bestStreak);
  state.totals.mistakes = mergeMistakeMaps(state.totals.mistakes, promptSummary.mistakes);
  elements.typingInput.value = "";
}

function freezeControls(isRunning) {
  elements.startBtn.disabled = isRunning;
  elements.duration.disabled = isRunning;
  for (const button of elements.modeButtons) {
    button.disabled = isRunning;
  }
}

function hideSummary() {
  elements.summary.classList.add("hidden");
}

function showSummary(summary, metrics) {
  const weakKeys = topWeakKeys(summary.mistakes, 3);
  const consistency = computeConsistency(state.wpmSamples);
  const metadata = getModeMetadata(state.mode);
  const notes = buildSummaryFeedback({
    mode: state.mode,
    wpm: metrics.wpm,
    accuracy: metrics.accuracy,
    consistency,
    weakKeys,
    targetWpm: metadata.targetWpm,
  });

  elements.summaryWpm.textContent = String(metrics.wpm);
  elements.summaryAccuracy.textContent = `${metrics.accuracy}%`;
  elements.summaryCharacters.textContent = String(summary.typed);
  elements.summaryStreak.textContent = String(summary.bestStreak);
  elements.summaryConsistency.textContent = `${consistency}%`;
  elements.summaryWeakKeys.textContent = weakKeys.length === 0 ? "-" : weakKeys.join(", ");

  elements.summaryFeedback.replaceChildren(
    ...notes.map((note) => {
      const item = document.createElement("li");
      item.textContent = note;
      return item;
    })
  );

  elements.summary.classList.remove("hidden");
}

function maybeUpdateBest(metrics) {
  const currentBest = state.bestResults[state.mode];
  const shouldReplace =
    !currentBest ||
    metrics.wpm > currentBest.wpm ||
    (metrics.wpm === currentBest.wpm && metrics.accuracy > currentBest.accuracy);

  if (shouldReplace) {
    state.bestResults[state.mode] = {
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
    };
    saveBestResults();
  }
}

function completeSession() {
  if (!state.isRunning) {
    return;
  }

  state.isRunning = false;
  clearInterval(state.timerId);
  state.timerId = null;
  state.elapsedSeconds = state.duration;
  state.timeLeft = 0;
  renderTimer();

  freezeControls(false);
  elements.typingInput.disabled = true;

  const summary = getCurrentSummary();
  const elapsedMinutes = state.duration / 60;
  const accuracy =
    summary.typed === 0 ? 100 : Math.round((summary.correct / summary.typed) * 100);
  const wpm =
    summary.correct === 0 || elapsedMinutes === 0
      ? 0
      : Math.round(summary.correct / 5 / elapsedMinutes);
  const metrics = { wpm, accuracy };

  maybeUpdateBest(metrics);
  renderBestResult();
  renderLiveStats();
  showSummary(summary, metrics);
}

function restartSession() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }

  state.isRunning = false;
  state.elapsedSeconds = 0;
  state.timeLeft = state.duration;
  resetSessionTotals();

  elements.typingInput.disabled = true;
  elements.typingInput.value = "";
  freezeControls(false);

  hideSummary();
  setPrompt(generatePrompt(state.mode));
  renderTimer();
  renderLiveStats();
}

function handleTimerTick() {
  state.elapsedSeconds = getElapsedSeconds();
  state.timeLeft = Math.max(0, state.duration - state.elapsedSeconds);
  renderTimer();

  const metrics = calculateLiveMetrics();
  state.wpmSamples.push(metrics.wpm);
  renderLiveStats();

  if (state.timeLeft <= 0) {
    completeSession();
  }
}

function startSession() {
  if (state.isRunning) {
    return;
  }

  resetSessionTotals();
  hideSummary();
  setPrompt(generatePrompt(state.mode));

  state.isRunning = true;
  state.elapsedSeconds = 0;
  state.timeLeft = state.duration;
  state.startedAt = Date.now();

  elements.typingInput.disabled = false;
  elements.typingInput.value = "";
  elements.typingInput.focus();

  freezeControls(true);
  renderTimer();
  renderPrompt();
  renderFingerHint();
  renderLiveStats();

  state.timerId = window.setInterval(handleTimerTick, 1000);
}

function handleModeChange(nextMode) {
  if (state.isRunning || state.mode === nextMode) {
    return;
  }
  state.mode = nextMode;
  renderModeControls();
  renderModeDescription();
  renderBestResult();
  restartSession();
}

function handleInput(event) {
  if (!state.isRunning) {
    event.target.value = "";
    return;
  }

  renderPrompt();
  renderFingerHint();

  if (event.target.value.length >= state.prompt.length) {
    applyCompletedPrompt();
    setPrompt(generatePrompt(state.mode));
  }

  renderLiveStats();
}

function handleDurationChange(event) {
  if (state.isRunning) {
    return;
  }
  state.duration = Number(event.target.value);
  restartSession();
}

function initialize() {
  renderModeControls();
  renderModeDescription();
  renderBestResult();
  hideSummary();
  setPrompt(generatePrompt(state.mode));
  renderTimer();
  renderLiveStats();
}

elements.beginnerMode.addEventListener("click", () => handleModeChange("beginner"));
elements.advancedMode.addEventListener("click", () => handleModeChange("advanced"));
elements.startBtn.addEventListener("click", startSession);
elements.restartBtn.addEventListener("click", restartSession);
elements.typingInput.addEventListener("input", handleInput);
elements.duration.addEventListener("change", handleDurationChange);

initialize();
