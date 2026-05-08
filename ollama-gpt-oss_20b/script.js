import { words as beginnerWords } from './data/beginner.js';
import { words as advancedWords } from './data/advanced.js';

const beginnerBtn = document.getElementById('beginnerBtn');
const advancedBtn = document.getElementById('advancedBtn');
const wordDisplay = document.getElementById('wordDisplay');
const typingInput = document.getElementById('typingInput');
const feedbackList = document.getElementById('feedbackList');

let words = [];
let currentIndex = 0;
let startTime = null;
let totalTyped = 0;
let totalErrors = 0;

function startTest(modeWords) {
  words = modeWords;
  currentIndex = 0;
  totalTyped = 0;
  totalErrors = 0;
  startTime = Date.now();
  typingInput.value = '';
  typingInput.disabled = false;
  typingInput.focus();
  feedbackList.innerHTML = '';
  showCurrentWord();
}

function showCurrentWord() {
  if (currentIndex < words.length) {
    wordDisplay.textContent = words[currentIndex];
  } else {
    wordDisplay.textContent = 'All words completed!';
    typingInput.disabled = true;
    showFinalStats();
  }
}

function compareWords(expected, typed) {
  let errors = 0;
  const minLen = Math.min(expected.length, typed.length);
  for (let i = 0; i < minLen; i++) {
    if (expected[i] !== typed[i]) errors++;
  }
  errors += Math.abs(expected.length - typed.length);
  return errors;
}

function showFinalStats() {
  const durationSec = (Date.now() - startTime) / 1000;
  const cpm = Math.round((totalTyped / durationSec) * 60);
  const accuracy = Math.round(((totalTyped - totalErrors) / totalTyped) * 100);
  const li = document.createElement('li');
  li.textContent = `Total: ${totalTyped} chars, ${totalErrors} errors, CPM: ${cpm}, Accuracy: ${accuracy}%`;
  feedbackList.appendChild(li);
}

typingInput.addEventListener('input', () => {
  const value = typingInput.value;
  totalTyped = value.length;
  if (value.endsWith(' ')) {
    const typedWord = value.trim();
    const expectedWord = words[currentIndex];
    const errors = compareWords(expectedWord, typedWord);
    totalErrors += errors;
    const li = document.createElement('li');
    const percentCorrect = Math.round(((expectedWord.length - errors) / expectedWord.length) * 100);
    li.textContent = `Word ${currentIndex + 1}: ${percentCorrect}% correct`;
    feedbackList.appendChild(li);
    currentIndex++;
    showCurrentWord();
    typingInput.value = '';
  }
});

beginnerBtn.addEventListener('click', () => startTest(beginnerWords));
advancedBtn.addEventListener('click', () => startTest(advancedWords));
