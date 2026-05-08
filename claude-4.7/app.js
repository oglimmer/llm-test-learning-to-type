// =============================================================
// Keyboard layout. Each key carries the finger expected to press
// it, so the next-key hint can colour the right finger zone and,
// for shifted characters, light up the opposite-hand Shift key.
// =============================================================
const F = {
  PL: "pinky-l", RL: "ring-l", ML: "middle-l", IL: "index-l",
  T:  "thumb",
  IR: "index-r", MR: "middle-r", RR: "ring-r", PR: "pinky-r",
};
const LEFT_FINGERS = new Set([F.PL, F.RL, F.ML, F.IL]);

const LAYOUT = [
  [
    { k: "`", sh: "~", f: F.PL },
    { k: "1", sh: "!", f: F.PL },
    { k: "2", sh: "@", f: F.RL },
    { k: "3", sh: "#", f: F.ML },
    { k: "4", sh: "$", f: F.IL },
    { k: "5", sh: "%", f: F.IL },
    { k: "6", sh: "^", f: F.IR },
    { k: "7", sh: "&", f: F.IR },
    { k: "8", sh: "*", f: F.MR },
    { k: "9", sh: "(", f: F.RR },
    { k: "0", sh: ")", f: F.PR },
    { k: "-", sh: "_", f: F.PR },
    { k: "=", sh: "+", f: F.PR },
    { k: "Backspace", label: "⌫", f: F.PR, cls: "bksp" },
  ],
  [
    { k: "Tab", label: "Tab", f: F.PL, cls: "tab" },
    { k: "q", sh: "Q", f: F.PL },
    { k: "w", sh: "W", f: F.RL },
    { k: "e", sh: "E", f: F.ML },
    { k: "r", sh: "R", f: F.IL },
    { k: "t", sh: "T", f: F.IL },
    { k: "y", sh: "Y", f: F.IR },
    { k: "u", sh: "U", f: F.IR },
    { k: "i", sh: "I", f: F.MR },
    { k: "o", sh: "O", f: F.RR },
    { k: "p", sh: "P", f: F.PR },
    { k: "[", sh: "{", f: F.PR },
    { k: "]", sh: "}", f: F.PR },
    { k: "\\", sh: "|", f: F.PR },
  ],
  [
    { k: "CapsLock", label: "Caps", f: F.PL, cls: "shift-l" },
    { k: "a", sh: "A", f: F.PL },
    { k: "s", sh: "S", f: F.RL },
    { k: "d", sh: "D", f: F.ML },
    { k: "f", sh: "F", f: F.IL },
    { k: "g", sh: "G", f: F.IL },
    { k: "h", sh: "H", f: F.IR },
    { k: "j", sh: "J", f: F.IR },
    { k: "k", sh: "K", f: F.MR },
    { k: "l", sh: "L", f: F.RR },
    { k: ";", sh: ":", f: F.PR },
    { k: "'", sh: '"', f: F.PR },
    { k: "Enter", label: "⏎", f: F.PR, cls: "enter" },
  ],
  [
    { k: "ShiftL", label: "Shift", f: F.PL, cls: "shift-l" },
    { k: "z", sh: "Z", f: F.PL },
    { k: "x", sh: "X", f: F.RL },
    { k: "c", sh: "C", f: F.ML },
    { k: "v", sh: "V", f: F.IL },
    { k: "b", sh: "B", f: F.IL },
    { k: "n", sh: "N", f: F.IR },
    { k: "m", sh: "M", f: F.IR },
    { k: ",", sh: "<", f: F.MR },
    { k: ".", sh: ">", f: F.RR },
    { k: "/", sh: "?", f: F.PR },
    { k: "ShiftR", label: "Shift", f: F.PR, cls: "shift-r" },
  ],
  [{ k: " ", label: "Space", f: F.T, cls: "space" }],
];

// =============================================================
// State
// =============================================================
const state = {
  mode: "beginner",
  lessonIndex: 0,
  text: "",
  typed: [],          // entries are the actual char pressed at each index
  startTime: null,
  endTime: null,
  totalKeystrokes: 0, // forward keystrokes only
  errorCount: 0,
  errorByChar: {},
  finished: false,
  timerId: null,
};

// =============================================================
// DOM helpers
// =============================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);

// =============================================================
// Persistence
// =============================================================
const STORAGE_KEY = "touchtype.v1";
function persist() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ mode: state.mode, lessonIndex: state.lessonIndex }),
    );
  } catch {}
}
function restorePersisted() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (s.mode === "advanced") state.mode = "advanced";
    if (Number.isInteger(s.lessonIndex)) {
      state.lessonIndex = Math.max(0, Math.min(s.lessonIndex, BEGINNER_LESSONS.length - 1));
    }
  } catch {}
}

// =============================================================
// Lesson selection
// =============================================================
function pickAdvancedText(avoid) {
  // pick a different text than the previous one when possible
  const pool = ADVANCED_TEXTS.filter((t) => t !== avoid);
  return pool[Math.floor(Math.random() * pool.length)] || ADVANCED_TEXTS[0];
}

function loadCurrentLesson() {
  if (state.mode === "beginner") {
    const lesson = BEGINNER_LESSONS[state.lessonIndex];
    state.text = lesson.text;
    $("#lessonHint").textContent = lesson.hint;
  } else {
    state.text = pickAdvancedText(state.text);
    $("#lessonHint").textContent = "";
  }
  state.typed = [];
  state.startTime = null;
  state.endTime = null;
  state.totalKeystrokes = 0;
  state.errorCount = 0;
  state.errorByChar = {};
  state.finished = false;
  stopTimer();
  renderText();
  renderStats();
  highlightNextKey();
}

// =============================================================
// Render: text display
// =============================================================
function renderText() {
  const root = $("#textDisplay");
  root.replaceChildren();
  const frag = document.createDocumentFragment();
  for (let i = 0; i < state.text.length; i++) {
    const expected = state.text[i];
    const span = el("span", { className: "ch", textContent: expected });
    if (i < state.typed.length) {
      if (state.typed[i] === expected) span.classList.add("done");
      else span.classList.add(expected === " " ? "bad-space" : "bad");
    } else if (i === state.typed.length && !state.finished) {
      span.classList.add("cursor");
    }
    frag.appendChild(span);
  }
  root.appendChild(frag);
}

// =============================================================
// Render: keyboard
// =============================================================
function buildKeyboard() {
  const root = $("#keyboard");
  root.replaceChildren();
  for (const row of LAYOUT) {
    const rowEl = el("div", { className: "kb-row" });
    for (const key of row) {
      const k = el("div", { className: "key" });
      if (key.cls) k.classList.add(key.cls);
      k.style.setProperty("--finger", `var(--f-${key.f})`);
      k.dataset.k = key.k;
      if (key.sh) k.dataset.sh = key.sh;
      k.dataset.hand = LEFT_FINGERS.has(key.f) ? "L" : key.f === F.T ? "T" : "R";
      k.textContent = key.label ?? key.k;
      rowEl.appendChild(k);
    }
    root.appendChild(rowEl);
  }
}

function highlightNextKey() {
  $$(".key.next").forEach((k) => k.classList.remove("next"));
  if (state.finished) return;
  const pos = state.typed.length;
  if (pos >= state.text.length) return;
  const next = state.text[pos];
  let needShiftFromHand = null; // 'L' or 'R' if shift key is required
  $$(".key").forEach((k) => {
    if (k.dataset.k === next) k.classList.add("next");
    else if (k.dataset.sh === next) {
      k.classList.add("next");
      needShiftFromHand = k.dataset.hand;
    }
  });
  if (needShiftFromHand) {
    // opposite-hand shift
    const shiftKey = needShiftFromHand === "L" ? "ShiftR" : "ShiftL";
    $$(".key").forEach((k) => {
      if (k.dataset.k === shiftKey) k.classList.add("next");
    });
  }
}

function flashKey(ch) {
  const target = [...$$(".key")].find(
    (k) => k.dataset.k === ch || k.dataset.sh === ch,
  );
  if (!target) return;
  target.classList.add("pressed");
  setTimeout(() => target.classList.remove("pressed"), 90);
}

// =============================================================
// Stats
// =============================================================
function calcStats() {
  if (!state.startTime) return { wpm: 0, accuracy: 100, errors: 0, time: 0 };
  const end = state.endTime ?? Date.now();
  const elapsedMs = Math.max(end - state.startTime, 1);
  const minutes = elapsedMs / 60000;
  let correct = 0;
  for (let i = 0; i < state.typed.length; i++) {
    if (state.typed[i] === state.text[i]) correct++;
  }
  const wpm = Math.round(correct / 5 / minutes);
  const accuracy =
    state.totalKeystrokes === 0
      ? 100
      : Math.round(((state.totalKeystrokes - state.errorCount) / state.totalKeystrokes) * 100);
  return { wpm, accuracy, errors: state.errorCount, time: Math.floor(elapsedMs / 1000) };
}

function renderStats() {
  const s = calcStats();
  $("#wpm").textContent = s.wpm;
  $("#accuracy").innerHTML = `${s.accuracy}<span class="unit">%</span>`;
  $("#time").innerHTML = `${s.time}<span class="unit">s</span>`;
  $("#errors").textContent = s.errors;
}

function startTimer() {
  if (state.timerId) return;
  state.timerId = setInterval(renderStats, 200);
}
function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

// =============================================================
// Typing
// =============================================================
function handleChar(ch) {
  if (state.finished) return;
  if (state.startTime == null) {
    state.startTime = Date.now();
    startTimer();
  }
  const pos = state.typed.length;
  if (pos >= state.text.length) return;
  const expected = state.text[pos];
  state.typed.push(ch);
  state.totalKeystrokes += 1;
  if (ch !== expected) {
    state.errorCount += 1;
    state.errorByChar[expected] = (state.errorByChar[expected] || 0) + 1;
  }
  renderText();
  renderStats();
  highlightNextKey();
  flashKey(ch);
  if (state.typed.length === state.text.length) finish();
}

function backspace() {
  if (state.finished) return;
  if (state.typed.length === 0) return;
  state.typed.pop();
  renderText();
  renderStats();
  highlightNextKey();
}

function finish() {
  state.finished = true;
  state.endTime = Date.now();
  stopTimer();
  renderStats();
  highlightNextKey();
  showResults();
}

// =============================================================
// Results dialog
// =============================================================
function buildFeedback(stats) {
  const tips = [];
  if (stats.accuracy >= 98 && stats.wpm >= 40) {
    tips.push("Excellent — both speed and accuracy are strong.");
  } else if (stats.accuracy >= 98) {
    tips.push("Excellent accuracy. Speed will come with practice.");
  } else if (stats.accuracy < 90) {
    tips.push("Slow down and aim for 95% accuracy — speed follows accuracy.");
  } else if (stats.accuracy < 95 && stats.wpm >= 40) {
    tips.push("Good speed. Ease off slightly to drop the error rate.");
  } else {
    tips.push("Keep at it — consistency builds muscle memory.");
  }

  const sorted = Object.entries(state.errorByChar)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => (c === " " ? "␣" : c));
  if (sorted.length) {
    tips.push(`Most-missed keys: ${sorted.join(", ")}`);
  }
  return tips.join(" ");
}

function showResults() {
  const s = calcStats();
  $("#rWpm").textContent = s.wpm;
  $("#rAccuracy").textContent = `${s.accuracy}%`;
  $("#rTime").textContent = `${s.time}s`;
  $("#rErrors").textContent = s.errors;
  $("#rFeedback").textContent = buildFeedback(s);
  const dlg = $("#resultsDialog");
  if (typeof dlg.showModal === "function") dlg.showModal();
}

// =============================================================
// Mode + lesson controls
// =============================================================
function setMode(mode) {
  if (mode !== "beginner" && mode !== "advanced") return;
  state.mode = mode;
  $$(".mode-btn").forEach((b) => {
    const active = b.dataset.mode === mode;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-selected", active ? "true" : "false");
  });
  $("#lessonBar").style.display = mode === "beginner" ? "" : "none";
  persist();
  loadCurrentLesson();
}

function buildLessonSelect() {
  const sel = $("#lessonSelect");
  sel.replaceChildren();
  BEGINNER_LESSONS.forEach((l, i) => {
    sel.appendChild(el("option", { value: String(i), textContent: l.title }));
  });
  sel.value = String(state.lessonIndex);
}

function nextExercise() {
  if (state.mode === "beginner") {
    state.lessonIndex = (state.lessonIndex + 1) % BEGINNER_LESSONS.length;
    $("#lessonSelect").value = String(state.lessonIndex);
    persist();
  }
  loadCurrentLesson();
}

function restartExercise() {
  loadCurrentLesson();
}

// =============================================================
// Wiring
// =============================================================
function shouldIgnoreKey() {
  const tag = document.activeElement?.tagName;
  if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") return true;
  if (document.querySelector("dialog[open]")) return true;
  return false;
}

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (shouldIgnoreKey()) return;

  if (e.key === "Escape") {
    e.preventDefault();
    restartExercise();
    return;
  }
  if (e.key === "Tab") {
    e.preventDefault();
    return;
  }
  if (e.key === "Backspace") {
    e.preventDefault();
    backspace();
    return;
  }
  if (e.key.length === 1) {
    e.preventDefault();
    handleChar(e.key);
  }
});

$$(".mode-btn").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

$("#lessonSelect").addEventListener("change", (e) => {
  state.lessonIndex = Number(e.target.value);
  persist();
  loadCurrentLesson();
});

$("#restartBtn").addEventListener("click", restartExercise);
$("#nextBtn").addEventListener("click", nextExercise);

$("#resultsDialog").addEventListener("close", (e) => {
  const v = e.target.returnValue;
  if (v === "next") nextExercise();
  else restartExercise();
});

// =============================================================
// Init
// =============================================================
restorePersisted();
buildKeyboard();
buildLessonSelect();
setMode(state.mode);
