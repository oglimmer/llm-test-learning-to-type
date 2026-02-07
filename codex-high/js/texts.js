const BEGINNER_WORDS = [
  "home",
  "row",
  "calm",
  "quick",
  "focus",
  "space",
  "hands",
  "learn",
  "type",
  "train",
  "small",
  "steady",
  "simple",
  "shift",
  "light",
  "rhythm",
  "skill",
  "press",
  "thumb",
  "index",
  "middle",
  "ring",
  "pinky",
  "letters",
  "words",
  "practice",
  "sound",
  "clean",
  "screen",
  "habit",
  "daily",
  "motion",
  "relax",
  "elbow",
  "wrist",
  "better",
];

const ADVANCED_WORDS = [
  "precision",
  "workflow",
  "optimize",
  "keyboard",
  "paragraph",
  "maintain",
  "performance",
  "complex",
  "velocity",
  "measured",
  "analysis",
  "strategy",
  "execute",
  "feature",
  "context",
  "command",
  "session",
  "advance",
  "improve",
  "quality",
  "consistency",
  "discipline",
  "monitor",
  "baseline",
  "progress",
  "accuracy",
  "development",
  "operator",
  "stability",
  "robust",
];

const ADVANCED_TOKENS = [
  "2026",
  "101",
  "42",
  "v2",
  "debug()",
  "index.js",
  "commit;",
  "review:",
];

const PUNCTUATION = [".", ",", ";", "!", "?"];

const MODE_METADATA = {
  beginner: {
    label: "Beginner",
    description:
      "Large, clean words with finger hints. Focus on posture, rhythm, and accuracy.",
    showFingerHints: true,
    targetWpm: 28,
    promptLength: 36,
  },
  advanced: {
    label: "Advanced",
    description:
      "Mixed case, punctuation, and symbols. Emphasis on speed without dropping accuracy.",
    showFingerHints: false,
    targetWpm: 55,
    promptLength: 48,
  },
};

const FINGER_MAP = new Map([
  ["1", "Left pinky"],
  ["q", "Left pinky"],
  ["a", "Left pinky"],
  ["z", "Left pinky"],
  ["2", "Left ring"],
  ["w", "Left ring"],
  ["s", "Left ring"],
  ["x", "Left ring"],
  ["3", "Left middle"],
  ["e", "Left middle"],
  ["d", "Left middle"],
  ["c", "Left middle"],
  ["4", "Left index"],
  ["5", "Left index"],
  ["r", "Left index"],
  ["t", "Left index"],
  ["f", "Left index"],
  ["g", "Left index"],
  ["v", "Left index"],
  ["b", "Left index"],
  ["6", "Right index"],
  ["7", "Right index"],
  ["y", "Right index"],
  ["u", "Right index"],
  ["h", "Right index"],
  ["j", "Right index"],
  ["n", "Right index"],
  ["m", "Right index"],
  ["8", "Right middle"],
  ["i", "Right middle"],
  ["k", "Right middle"],
  [",", "Right middle"],
  ["9", "Right ring"],
  ["o", "Right ring"],
  ["l", "Right ring"],
  [".", "Right ring"],
  ["0", "Right pinky"],
  ["p", "Right pinky"],
  [";", "Right pinky"],
  ["/", "Right pinky"],
  ["-", "Right pinky"],
  ["=", "Right pinky"],
]);

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function maybeUppercase(word) {
  if (Math.random() < 0.14) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  return word;
}

function maybePunctuate(word) {
  if (Math.random() < 0.22) {
    return `${word}${randomItem(PUNCTUATION)}`;
  }
  return word;
}

export function getModeMetadata(mode) {
  return MODE_METADATA[mode] ?? MODE_METADATA.beginner;
}

export function getFingerHint(key) {
  if (!key) {
    return "Prepare both hands on home row (ASDF JKL;).";
  }
  if (key === " ") {
    return "Use either thumb for space.";
  }
  const mappedFinger = FINGER_MAP.get(key.toLowerCase());
  if (!mappedFinger) {
    return "Keep your eyes forward and maintain even rhythm.";
  }
  return `Use ${mappedFinger} for "${key}".`;
}

export function generatePrompt(mode) {
  const config = getModeMetadata(mode);
  const tokens = [];
  const wordPool = mode === "advanced" ? ADVANCED_WORDS : BEGINNER_WORDS;

  for (let index = 0; index < config.promptLength; index += 1) {
    if (mode === "advanced" && Math.random() < 0.12) {
      tokens.push(randomItem(ADVANCED_TOKENS));
      continue;
    }

    let word = randomItem(wordPool);
    if (mode === "advanced") {
      word = maybeUppercase(word);
      word = maybePunctuate(word);
    }
    tokens.push(word);
  }

  const text = tokens.join(" ").replace(/\s+/g, " ").trim();
  if (mode === "advanced") {
    return `${text}.`;
  }
  return text;
}
