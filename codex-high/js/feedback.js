function toDisplayKey(value) {
  if (value === " ") {
    return "space";
  }
  return value;
}

export function summarizePrompt(prompt, input) {
  const compareLength = Math.min(prompt.length, input.length);
  let correct = 0;
  let errors = 0;
  let streak = 0;
  let bestStreak = 0;
  const mistakes = {};

  for (let index = 0; index < compareLength; index += 1) {
    if (prompt[index] === input[index]) {
      correct += 1;
      streak += 1;
      if (streak > bestStreak) {
        bestStreak = streak;
      }
    } else {
      errors += 1;
      streak = 0;
      const expectedKey = toDisplayKey(prompt[index]);
      mistakes[expectedKey] = (mistakes[expectedKey] ?? 0) + 1;
    }
  }

  if (input.length > prompt.length) {
    errors += input.length - prompt.length;
  }

  return {
    typed: input.length,
    correct,
    errors,
    bestStreak,
    mistakes,
  };
}

export function mergeMistakeMaps(baseMap = {}, extraMap = {}) {
  const merged = { ...baseMap };
  for (const [key, value] of Object.entries(extraMap)) {
    merged[key] = (merged[key] ?? 0) + value;
  }
  return merged;
}

export function topWeakKeys(mistakeMap = {}, limit = 3) {
  return Object.entries(mistakeMap)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([key]) => key);
}

export function computeConsistency(samples = []) {
  if (samples.length < 2) {
    return 100;
  }

  const mean = samples.reduce((sum, value) => sum + value, 0) / samples.length;
  if (mean === 0) {
    return 0;
  }

  const variance =
    samples.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    samples.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficient = standardDeviation / mean;
  const score = Math.max(0, Math.min(100, Math.round(100 - coefficient * 100)));
  return score;
}

export function buildLiveFeedback({ mode, wpm, accuracy, timeLeft }) {
  if (wpm === 0) {
    return "Start with smooth keystrokes, then build speed.";
  }
  if (accuracy < 88) {
    return "Accuracy is dropping. Slow down slightly and reset finger position.";
  }
  if (mode === "beginner" && wpm < 20) {
    return "Good control. Keep your rhythm steady and avoid looking at the keyboard.";
  }
  if (mode === "advanced" && wpm < 45) {
    return "Push pace gently while keeping punctuation and case precise.";
  }
  if (timeLeft <= 15) {
    return "Final stretch: stay relaxed and finish with clean strokes.";
  }
  return "Strong tempo and control. Keep this rhythm.";
}

export function buildSummaryFeedback({
  mode,
  wpm,
  accuracy,
  consistency,
  weakKeys = [],
  targetWpm,
}) {
  const notes = [];

  if (accuracy < 90) {
    notes.push("Prioritize correct key presses first, then increase speed.");
  }
  if (wpm < targetWpm) {
    notes.push(
      `Your current speed is below the ${mode} target (${targetWpm} WPM). Add short daily sessions.`
    );
  }
  if (consistency < 75) {
    notes.push("Your pace varied. Aim for even bursts rather than sprinting.");
  }
  if (weakKeys.length > 0) {
    notes.push(`Spend 3 minutes drilling: ${weakKeys.join(", ")}.`);
  }
  if (notes.length === 0) {
    notes.push("Excellent session. Keep this quality and increase duration gradually.");
  }

  return notes;
}
