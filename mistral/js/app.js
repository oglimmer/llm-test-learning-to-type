/**
 * TypeMaster - 10 Finger Typing Application
 * Main JavaScript file handling all functionality
 */

// ===== Application State =====
const AppState = {
    currentMode: null,
    currentLesson: 0,
    isTyping: false,
    startTime: null,
    timerInterval: null,
    elapsedTime: 0,
    correctCount: 0,
    errorCount: 0,
    errorMap: new Map(), // Maps expected char to actual typed char
    currentText: '',
    currentIndex: 0,
    lessons: {
        beginner: [
            { name: 'Home Row - Left Hand', text: 'aaaa ssss dddd ffff', focus: 'ASDF' },
            { name: 'Home Row - Right Hand', text: 'jjjj kkkk llll ;;;;', focus: 'JKL;' },
            { name: 'Home Row Combined', text: 'asdf jkl; asdf jkl; asdf jkl;', focus: 'ASDF JKL;' },
            { name: 'Home Row with Spaces', text: 'a s d f j k l ; a s d f j k l ;', focus: 'ASDF JKL; + Space' },
            { name: 'Adding G and H', text: 'gh gh gh asdf jkl; asdf jkl;', focus: 'GH + Home Row' },
            { name: 'Simple Words', text: 'sad ask had lag dov fak add', focus: '3-4 letter words' },
            { name: 'Common Words 1', text: 'the and for are but not you', focus: 'Common English words' },
            { name: 'Common Words 2', text: 'all can her was one our two', focus: 'Common English words' },
            { name: 'Home Row Review', text: 'asdfghjkl; asdfghjkl; asdfghjkl;', focus: 'Full Home Row' },
            { name: 'Adding Top Row', text: 'qwertyuiop qwertyuiop asdfghjkl;', focus: 'QWERTY + Home Row' }
        ],
        advanced: [
            { name: 'All Letters Drill', text: 'qwertyuiopasdfghjkl;zxcvbnm', focus: 'Full Keyboard' },
            { name: 'Speed Drill 1', text: 'The quick brown fox jumps over the lazy dog.', focus: 'Speed' },
            { name: 'Speed Drill 2', text: 'Pack my box with five dozen liquor jugs.', focus: 'Speed' },
            { name: 'Complex Words 1', text: 'terminology understand development programming', focus: 'Long words' },
            { name: 'Complex Words 2', text: 'implementation configuration documentation', focus: 'Technical terms' },
            { name: 'Numbers and Symbols', text: '12345 67890 !@#$% ^&*()_+', focus: 'Numbers and Symbols' },
            { name: 'Mixed Case', text: 'The Quick Brown Fox Jumps Over The Lazy Dog', focus: 'Mixed Case' },
            { name: 'Paragraph Practice', text: 'In the beginning there was light. And the light was good. The earth was without form and void.', focus: 'Paragraph' },
            { name: 'Long Paragraph', text: 'To be or not to be that is the question. Whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune or to take arms against a sea of troubles.', focus: 'Long Text' },
            { name: 'Final Challenge', text: 'Programming is the art of telling another human what one wants the computer to do. Donald Knuth', focus: 'Final Challenge' }
        ]
    },
    userStats: {
        beginner: {
            totalLessons: 0,
            completedLessons: 0,
            bestWPM: 0,
            bestAccuracy: 0,
            totalTime: 0
        },
        advanced: {
            totalLessons: 0,
            completedLessons: 0,
            bestWPM: 0,
            bestAccuracy: 0,
            totalTime: 0
        }
    }
};

// ===== DOM Elements =====
const DOM = {
    // Mode Selection
    modeSelection: document.getElementById('modeSelection'),
    
    // Typing Area
    typingArea: document.getElementById('typingArea'),
    currentModeLabel: document.getElementById('currentMode'),
    lessonInfo: document.getElementById('lessonInfo'),
    timer: document.getElementById('timer'),
    textDisplay: document.getElementById('textDisplay'),
    typingInput: document.getElementById('typingInput'),
    keyboardGuide: document.getElementById('keyboardGuide'),
    
    // Results Area
    resultsArea: document.getElementById('resultsArea'),
    resultsSubtitle: document.getElementById('resultsSubtitle'),
    timeStat: document.getElementById('timeStat'),
    wpmStat: document.getElementById('wpmStat'),
    accuracyStat: document.getElementById('accuracyStat'),
    correctStat: document.getElementById('correctStat'),
    errorStat: document.getElementById('errorStat'),
    accuracyBar: document.getElementById('accuracyBar'),
    accuracyFill: document.getElementById('accuracyFill'),
    accuracyText: document.getElementById('accuracyText'),
    speedBar: document.getElementById('speedBar'),
    speedFill: document.getElementById('speedFill'),
    speedText: document.getElementById('speedText'),
    errorAnalysis: document.getElementById('errorAnalysis'),
    errorList: document.getElementById('errorList'),
    
    // Navigation
    navButtons: document.querySelectorAll('.nav-btn'),
    modeCards: document.querySelectorAll('.mode-card'),
    
    // Settings
    settingsPanel: document.getElementById('settingsPanel'),
    showKeyboard: document.getElementById('showKeyboard'),
    highlightErrors: document.getElementById('highlightErrors')
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    initKeyboardGuide();
    loadStats();
});

function initEventListeners() {
    // Mode navigation buttons
    DOM.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            selectMode(mode);
        });
    });

    // Mode cards
    DOM.modeCards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            selectMode(mode);
        });
    });

    // Typing input
    DOM.typingInput.addEventListener('input', handleTyping);
    DOM.typingInput.addEventListener('keydown', handleKeyDown);
    DOM.typingInput.addEventListener('focus', () => {
        if (!AppState.isTyping && AppState.currentMode) {
            startTypingSession();
        }
    });

    // Settings checkboxes
    DOM.showKeyboard.addEventListener('change', (e) => {
        DOM.keyboardGuide.style.display = e.target.checked ? 'block' : 'none';
    });

    DOM.highlightErrors.addEventListener('change', (e) => {
        updateTextDisplay();
    });

    // Prevent space from scrolling when input is focused
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.activeElement === DOM.typingInput) {
            e.preventDefault();
        }
    });
}

function initKeyboardGuide() {
    // Highlight home row keys
    const homeRowLeft = ['A', 'S', 'D', 'F'];
    const homeRowRight = ['J', 'K', 'L', ';'];
    
    document.querySelectorAll('.key').forEach(key => {
        const keyText = key.textContent.trim();
        if (homeRowLeft.includes(keyText)) {
            key.classList.add('home-row-left');
        } else if (homeRowRight.includes(keyText)) {
            key.classList.add('home-row-right');
        }
    });
}

// ===== Mode Selection =====
function selectMode(mode) {
    AppState.currentMode = mode;
    AppState.currentLesson = 0;
    AppState.isTyping = false;
    
    // Update UI
    DOM.modeSelection.style.display = 'none';
    DOM.typingArea.style.display = 'block';
    DOM.resultsArea.style.display = 'none';
    
    // Update navigation buttons
    DOM.navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    DOM.currentModeLabel.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    
    // Load first lesson
    loadLesson();
    
    // Reset input
    DOM.typingInput.value = '';
    DOM.typingInput.focus();
    
    // Update settings
    DOM.keyboardGuide.style.display = DOM.showKeyboard.checked ? 'block' : 'none';
}

function loadLesson() {
    const lessons = AppState.lessons[AppState.currentMode];
    const lesson = lessons[AppState.currentLesson];
    
    if (!lesson) {
        // All lessons completed
        showCompletionScreen();
        return;
    }
    
    AppState.currentText = lesson.text;
    AppState.currentIndex = 0;
    AppState.startTime = null;
    AppState.elapsedTime = 0;
    AppState.correctCount = 0;
    AppState.errorCount = 0;
    AppState.errorMap = new Map();
    AppState.isTyping = false;
    
    // Update lesson info
    DOM.lessonInfo.textContent = `Lesson ${AppState.currentLesson + 1}: ${lesson.name}`;
    
    // Reset timer
    clearInterval(AppState.timerInterval);
    DOM.timer.textContent = '00:00';
    
    // Update text display
    updateTextDisplay();
    
    // Focus input
    DOM.typingInput.value = '';
    DOM.typingInput.focus();
    
    // Update user stats
    AppState.userStats[AppState.currentMode].totalLessons++;
    saveStats();
}

function nextLesson() {
    AppState.currentLesson++;
    loadLesson();
}

function restartLesson() {
    loadLesson();
}

function backToModeSelection() {
    AppState.currentMode = null;
    AppState.currentLesson = 0;
    AppState.isTyping = false;
    
    DOM.modeSelection.style.display = 'block';
    DOM.typingArea.style.display = 'none';
    DOM.resultsArea.style.display = 'none';
    
    clearInterval(AppState.timerInterval);
}

// ===== Typing Logic =====
function startTypingSession() {
    if (AppState.isTyping) return;
    
    AppState.isTyping = true;
    AppState.startTime = Date.now();
    AppState.correctCount = 0;
    AppState.errorCount = 0;
    AppState.errorMap = new Map();
    
    // Start timer
    AppState.timerInterval = setInterval(() => {
        AppState.elapsedTime = Math.floor((Date.now() - AppState.startTime) / 1000);
        updateTimer();
    }, 1000);
    
    updateTextDisplay();
}

function handleTyping(e) {
    if (!AppState.isTyping) {
        startTypingSession();
    }
    
    const typedText = DOM.typingInput.value;
    
    // Handle the current character
    if (AppState.currentIndex < AppState.currentText.length) {
        const currentChar = AppState.currentText[AppState.currentIndex];
        const typedChar = typedText[AppState.currentIndex];
        
        if (typedChar !== undefined) {
            if (typedChar === currentChar) {
                AppState.correctCount++;
            } else {
                AppState.errorCount++;
                // Track errors
                const errorKey = currentChar;
                const existing = AppState.errorMap.get(errorKey) || { count: 0, typed: [] };
                existing.count++;
                existing.typed.push(typedChar);
                AppState.errorMap.set(errorKey, existing);
            }
            
            AppState.currentIndex++;
            updateTextDisplay();
        }
    }
    
    // Check if lesson is complete
    if (AppState.currentIndex >= AppState.currentText.length) {
        endTypingSession();
    }
}

function handleKeyDown(e) {
    // Prevent backspace from deleting more than current index
    if (e.code === 'Backspace' && DOM.typingInput.value.length <= AppState.currentIndex) {
        e.preventDefault();
    }
    
    // Highlight key on keyboard guide
    highlightKeyboardKey(e.key);
}

function highlightKeyboardKey(key) {
    // Remove previous highlights
    document.querySelectorAll('.key').forEach(k => {
        k.classList.remove('active');
    });
    
    // Find and highlight the key
    const keyElements = document.querySelectorAll('.key');
    const keyMap = {
        ' ': 'space',
        'Backspace': 'backspace',
        'Enter': 'enter',
        'Tab': 'Tab',
        'CapsLock': 'caps-lock',
        'Shift': 'shift',
        '\\': '\\'
    };
    
    let found = false;
    keyElements.forEach(k => {
        const keyText = k.textContent.trim();
        if (keyText === key || keyMap[key] === k.classList.contains('backspace') ? 'backspace' : 
            k.classList.contains('enter') ? 'enter' : 
            k.classList.contains('space') ? 'space' : 
            k.classList.contains('caps-lock') ? 'caps-lock' : 
            k.classList.contains('shift') ? 'shift' : keyText) {
            k.classList.add('active');
            found = true;
        }
    });
    
    // If it's a character key, try to find it
    if (!found && key.length === 1) {
        keyElements.forEach(k => {
            if (k.textContent.trim().toLowerCase() === key.toLowerCase()) {
                k.classList.add('active');
            }
        });
    }
}

function updateTextDisplay() {
    const typedText = DOM.typingInput.value;
    let displayHTML = '';
    
    for (let i = 0; i < AppState.currentText.length; i++) {
        const char = AppState.currentText[i];
        const typedChar = typedText[i];
        let classes = 'char';
        
        if (i < AppState.currentIndex) {
            if (typedChar === char) {
                classes += ' correct';
            } else {
                classes += ' incorrect';
                if (DOM.highlightErrors.checked) {
                    classes += ' error-highlight';
                }
            }
        }
        
        if (i === AppState.currentIndex) {
            classes += ' current';
        }
        
        // Escape special characters
        const escapedChar = escapeHtml(char);
        displayHTML += `<span class="${classes}" data-index="${i}">${escapedChar}</span>`;
    }
    
    DOM.textDisplay.innerHTML = displayHTML;
    
    // Scroll to current position
    scrollTextDisplayToCurrent();
}

function scrollTextDisplayToCurrent() {
    const currentChar = DOM.textDisplay.querySelector('.char.current');
    if (currentChar) {
        const container = DOM.textDisplay;
        const charRect = currentChar.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        if (charRect.left < containerRect.left || charRect.right > containerRect.right) {
            currentChar.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'center' 
            });
        }
    }
}

function updateTimer() {
    const minutes = Math.floor(AppState.elapsedTime / 60);
    const seconds = AppState.elapsedTime % 60;
    DOM.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endTypingSession() {
    if (!AppState.isTyping) return;
    
    AppState.isTyping = false;
    clearInterval(AppState.timerInterval);
    
    // Ensure we have end time
    if (AppState.startTime) {
        AppState.elapsedTime = Math.floor((Date.now() - AppState.startTime) / 1000);
        updateTimer();
    }
    
    // Update user stats
    const stats = AppState.userStats[AppState.currentMode];
    stats.completedLessons++;
    stats.totalTime += AppState.elapsedTime;
    
    // Calculate WPM (assuming average word length of 5 characters)
    const wordCount = AppState.currentText.length / 5;
    const wpm = wordCount > 0 ? Math.round((wordCount / AppState.elapsedTime) * 60) : 0;
    
    // Update best stats
    if (wpm > stats.bestWPM) {
        stats.bestWPM = wpm;
    }
    
    const accuracy = calculateAccuracy();
    if (accuracy > stats.bestAccuracy) {
        stats.bestAccuracy = accuracy;
    }
    
    saveStats();
    
    // Show results
    showResults(wpm, accuracy);
}

// ===== Results =====
function showResults(wpm, accuracy) {
    DOM.typingArea.style.display = 'none';
    DOM.resultsArea.style.display = 'block';
    
    // Update stats
    const minutes = Math.floor(AppState.elapsedTime / 60);
    const seconds = AppState.elapsedTime % 60;
    DOM.timeStat.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    DOM.wpmStat.textContent = wpm;
    DOM.accuracyStat.textContent = `${Math.round(accuracy)}%`;
    DOM.correctStat.textContent = AppState.correctCount;
    DOM.errorStat.textContent = AppState.errorCount;
    
    // Update results subtitle
    DOM.resultsSubtitle.textContent = `Lesson ${AppState.currentLesson + 1} Complete!`;
    
    // Update progress bars
    updateProgressBars(wpm, accuracy);
    
    // Show error analysis if there are errors
    if (AppState.errorCount > 0) {
        showErrorAnalysis();
    } else {
        DOM.errorAnalysis.style.display = 'none';
    }
    
    // Scroll to results
    DOM.resultsArea.scrollIntoView({ behavior: 'smooth' });
}

function calculateAccuracy() {
    const total = AppState.correctCount + AppState.errorCount;
    if (total === 0) return 100;
    return (AppState.correctCount / total) * 100;
}

function updateProgressBars(wpm, accuracy) {
    // Accuracy bar
    DOM.accuracyFill.style.width = `${accuracy}%`;
    DOM.accuracyText.textContent = `Accuracy: ${Math.round(accuracy)}%`;
    
    // Speed bar - max 100 WPM for visualization
    const speedPercent = Math.min(wpm, 100);
    DOM.speedFill.style.width = `${speedPercent}%`;
    DOM.speedText.textContent = `Speed: ${wpm} WPM`;
    
    // Set bar colors based on performance
    DOM.accuracyFill.style.background = getColorForAccuracy(accuracy);
    DOM.speedFill.style.background = getColorForSpeed(wpm);
}

function getColorForAccuracy(accuracy) {
    if (accuracy >= 95) return 'linear-gradient(90deg, #10b981, #059669)';
    if (accuracy >= 85) return 'linear-gradient(90deg, #3b82f6, #10b981)';
    if (accuracy >= 70) return 'linear-gradient(90deg, #f59e0b, #3b82f6)';
    return 'linear-gradient(90deg, #ef4444, #f59e0b)';
}

function getColorForSpeed(wpm) {
    if (wpm >= 60) return 'linear-gradient(90deg, #10b981, #059669)';
    if (wpm >= 40) return 'linear-gradient(90deg, #3b82f6, #10b981)';
    if (wpm >= 20) return 'linear-gradient(90deg, #f59e0b, #3b82f6)';
    return 'linear-gradient(90deg, #ef4444, #f59e0b)';
}

function showErrorAnalysis() {
    DOM.errorAnalysis.style.display = 'block';
    DOM.errorList.innerHTML = '';
    
    // Get top 5 most common errors
    const errors = Array.from(AppState.errorMap.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5);
    
    if (errors.length === 0) {
        DOM.errorAnalysis.style.display = 'none';
        return;
    }
    
    errors.forEach(([expected, data]) => {
        const errorItem = document.createElement('div');
        errorItem.className = 'error-item';
        
        // Show most common wrong key
        const mostCommonWrong = data.typed.reduce((acc, char, _, arr) => {
            const count = arr.filter(c => c === char).length;
            return count > acc.count ? { char, count } : acc;
        }, { char: '', count: 0 }).char;
        
        errorItem.textContent = `${escapeHtml(expected)} → ${escapeHtml(mostCommonWrong)} (${data.count}x)`;
        DOM.errorList.appendChild(errorItem);
    });
}

function showCompletionScreen() {
    DOM.typingArea.style.display = 'none';
    DOM.resultsArea.style.display = 'block';
    
    const mode = AppState.currentMode;
    const stats = AppState.userStats[mode];
    
    DOM.resultsSubtitle.textContent = `All ${AppState.lessons[mode].length} lessons completed in ${mode} mode!`;
    DOM.timeStat.textContent = `${Math.floor(stats.totalTime / 60)}:${(stats.totalTime % 60).toString().padStart(2, '0')}`;
    DOM.wpmStat.textContent = stats.bestWPM;
    DOM.accuracyStat.textContent = `${stats.bestAccuracy}%`;
    DOM.correctStat.textContent = '--';
    DOM.errorStat.textContent = '--';
    
    // Update progress bars
    DOM.accuracyFill.style.width = `${stats.bestAccuracy}%`;
    DOM.accuracyText.textContent = `Best Accuracy: ${stats.bestAccuracy}%`;
    DOM.speedFill.style.width = `${Math.min(stats.bestWPM, 100)}%`;
    DOM.speedText.textContent = `Best Speed: ${stats.bestWPM} WPM`;
    
    DOM.errorAnalysis.style.display = 'none';
    
    // Update action buttons
    const retryBtn = DOM.resultsArea.querySelector('button[onclick="restartLesson()"]');
    const nextBtn = DOM.resultsArea.querySelector('button[onclick="nextLesson()"]');
    
    retryBtn.style.display = 'none';
    nextBtn.style.display = 'none';
}

// ===== Statistics =====
function saveStats() {
    try {
        localStorage.setItem('typeMasterStats', JSON.stringify(AppState.userStats));
    } catch (e) {
        console.warn('Could not save stats:', e);
    }
}

function loadStats() {
    try {
        const savedStats = localStorage.getItem('typeMasterStats');
        if (savedStats) {
            AppState.userStats = JSON.parse(savedStats);
        }
    } catch (e) {
        console.warn('Could not load stats:', e);
    }
}

// ===== Settings =====
function closeSettings() {
    DOM.settingsPanel.style.display = 'none';
}

// ===== Utilities =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Export for testing =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        selectMode,
        loadLesson,
        handleTyping,
        calculateAccuracy,
        updateProgressBars
    };
}
