/* ============================================
   TypeFlow — Typing Trainer
   ============================================ */

(function () {
    "use strict";

    // ----------------------------------------------------------------
    // Keyboard layout (US QWERTY)
    // ----------------------------------------------------------------

    var KEYBOARD_ROWS = [
        [
            { key: "`", display: "`", w: 1 },
            { key: "1", display: "1", w: 1 },
            { key: "2", display: "2", w: 1 },
            { key: "3", display: "3", w: 1 },
            { key: "4", display: "4", w: 1 },
            { key: "5", display: "5", w: 1 },
            { key: "6", display: "6", w: 1 },
            { key: "7", display: "7", w: 1 },
            { key: "8", display: "8", w: 1 },
            { key: "9", display: "9", w: 1 },
            { key: "0", display: "0", w: 1 },
            { key: "-", display: "-", w: 1 },
            { key: "=", display: "=", w: 1 },
            { key: "Backspace", display: "Bksp", w: 2 },
        ],
        [
            { key: "Tab", display: "Tab", w: 1.5 },
            { key: "q", display: "Q", w: 1 },
            { key: "w", display: "W", w: 1 },
            { key: "e", display: "E", w: 1 },
            { key: "r", display: "R", w: 1 },
            { key: "t", display: "T", w: 1 },
            { key: "y", display: "Y", w: 1 },
            { key: "u", display: "U", w: 1 },
            { key: "i", display: "I", w: 1 },
            { key: "o", display: "O", w: 1 },
            { key: "p", display: "P", w: 1 },
            { key: "[", display: "[", w: 1 },
            { key: "]", display: "]", w: 1 },
            { key: "\\", display: "\\", w: 1.5 },
        ],
        [
            { key: "CapsLock", display: "Caps", w: 1.75 },
            { key: "a", display: "A", w: 1 },
            { key: "s", display: "S", w: 1 },
            { key: "d", display: "D", w: 1 },
            { key: "f", display: "F", w: 1 },
            { key: "g", display: "G", w: 1 },
            { key: "h", display: "H", w: 1 },
            { key: "j", display: "J", w: 1 },
            { key: "k", display: "K", w: 1 },
            { key: "l", display: "L", w: 1 },
            { key: ";", display: ";", w: 1 },
            { key: "'", display: "'", w: 1 },
            { key: "Enter", display: "Enter", w: 2.25 },
        ],
        [
            { key: "ShiftLeft", display: "Shift", w: 2.25 },
            { key: "z", display: "Z", w: 1 },
            { key: "x", display: "X", w: 1 },
            { key: "c", display: "C", w: 1 },
            { key: "v", display: "V", w: 1 },
            { key: "b", display: "B", w: 1 },
            { key: "n", display: "N", w: 1 },
            { key: "m", display: "M", w: 1 },
            { key: ",", display: ",", w: 1 },
            { key: ".", display: ".", w: 1 },
            { key: "/", display: "/", w: 1 },
            { key: "ShiftRight", display: "Shift", w: 2.75 },
        ],
        [{ key: " ", display: "Space", w: 8 }],
    ];

    // ----------------------------------------------------------------
    // Finger assignments
    // ----------------------------------------------------------------

    var FINGER_MAP = {
        "`": "l-pinky", "1": "l-pinky", q: "l-pinky", a: "l-pinky", z: "l-pinky",
        "2": "l-ring", w: "l-ring", s: "l-ring", x: "l-ring",
        "3": "l-mid", e: "l-mid", d: "l-mid", c: "l-mid",
        "4": "l-index", "5": "l-index", r: "l-index", f: "l-index", v: "l-index",
        t: "l-index", g: "l-index", b: "l-index",
        "6": "r-index", "7": "r-index", y: "r-index", h: "r-index", n: "r-index",
        u: "r-index", j: "r-index", m: "r-index",
        "8": "r-mid", i: "r-mid", k: "r-mid", ",": "r-mid",
        "9": "r-ring", o: "r-ring", l: "r-ring", ".": "r-ring",
        "0": "r-pinky", "-": "r-pinky", "=": "r-pinky", p: "r-pinky",
        "[": "r-pinky", "]": "r-pinky", "\\": "r-pinky",
        ";": "r-pinky", "'": "r-pinky", "/": "r-pinky",
        " ": "thumb",
    };

    var FINGER_LABELS = {
        "l-pinky": "left pinky",
        "l-ring": "left ring",
        "l-mid": "left middle",
        "l-index": "left index",
        "r-index": "right index",
        "r-mid": "right middle",
        "r-ring": "right ring",
        "r-pinky": "right pinky",
        thumb: "thumb",
    };

    // ----------------------------------------------------------------
    // Beginner lessons — progressive key introduction
    // ----------------------------------------------------------------

    var BEGINNER_LESSONS = [
        {
            name: "Home Row: J and F",
            desc: "Place your index fingers on F and J \u2014 feel the bumps!",
            text: "jjj fff jjj fff jfj fjf jfj fjf jf fj jf fj fjfj jfjf",
        },
        {
            name: "Home Row: D and K",
            desc: "Add your middle fingers to D and K.",
            text: "ddd kkk ddd kkk dkd kdk fjdk dkfj fjdk jfkd dkfj fjdk",
        },
        {
            name: "Home Row: S and L",
            desc: "Add your ring fingers to S and L.",
            text: "sss lll sss lll sls lsl fjdk sl fjdk sl sldkfj fjdkls",
        },
        {
            name: "Home Row: A and ;",
            desc: "Add your pinky fingers to A and ;.",
            text: "aaa ;;; aaa ;;; a;a ;a; asdf jkl; asdf jkl; a;sldkfj",
        },
        {
            name: "Home Row: All Keys",
            desc: "Practice all home row keys together.",
            text: "asdf jkl; fdsa ;lkj asdf jkl; fdsa ;lkj asdf jkl; fjdk sla;",
        },
        {
            name: "Home Row: G and H",
            desc: "Reach your index fingers inward to G and H.",
            text: "fgf jhj fgf jhj gh hg fg jh asdfg hjkl; gash lash half",
        },
        {
            name: "Home Row Words",
            desc: "Real words using home row keys.",
            text: "ask lad fall glad half dash flash glass salad shall flag",
        },
        {
            name: "Top Row: E and I",
            desc: "Reach up with your middle fingers to E and I.",
            text: "ded kik ded kik die did kid lie file side like fiddle",
        },
        {
            name: "Top Row: R and U",
            desc: "Reach up with your index fingers to R and U.",
            text: "frf juj frf juj fur rude rule duke sure fire ridge dusk",
        },
        {
            name: "Top Row: W and O",
            desc: "Reach up with your ring fingers to W and O.",
            text: "sws lol sws lol low owl slow flow woke wood world glow",
        },
        {
            name: "Top Row: Q and P",
            desc: "Reach up with your pinky fingers to Q and P.",
            text: "aqa ;p; aqa ;p; quip pique plaque quail drip plop kept",
        },
        {
            name: "Top Row: T and Y",
            desc: "Index fingers reach to T and Y.",
            text: "ftf jyj ftf jyj try yet style thirty dusty dirty youth",
        },
        {
            name: "Top and Home Rows",
            desc: "Combine top and home row keys.",
            text: "the quick red wolf just played without fear or worry today",
        },
        {
            name: "Bottom Row: C and M",
            desc: "Reach down with your middle fingers to C and comma.",
            text: "dcd k,k dcd k,k come mock calm claim comic make mice,",
        },
        {
            name: "Bottom Row: V and N",
            desc: "Index fingers reach down to V and N.",
            text: "fvf jnj fvf jnj van vine knave novel invent oven naïve",
        },
        {
            name: "Bottom Row: X and .",
            desc: "Ring fingers reach down to X and period.",
            text: "sxs l.l sxs l.l fix wax fox mix. next text. taxed. six.",
        },
        {
            name: "Bottom Row: Z and /",
            desc: "Pinky fingers reach down to Z and slash.",
            text: "aza ;/; aza ;/; zeal fizz jazz zero zone zig zap maze/s",
        },
        {
            name: "Bottom Row: B",
            desc: "Left index finger reaches down to B.",
            text: "fbf fbf ball grab able brief noble bloom herb climb verb",
        },
        {
            name: "All Keys Practice",
            desc: "Practice with all keys combined.",
            text: "the quick brown fox jumps over the lazy dog while five boxing wizards jump quickly",
        },
        {
            name: "Common Words",
            desc: "The most common English words for building speed.",
            text: "the be to of and a in that have it for not on with he as you do at this but his by from",
        },
    ];

    // ----------------------------------------------------------------
    // Advanced texts
    // ----------------------------------------------------------------

    var ADVANCED_TEXTS = [
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
        "How vexingly quick daft zebras jump! The five boxing wizards jump quickly at dawn.",
        "A journey of a thousand miles begins with a single step. Fortune favors the bold and the prepared mind.",
        "To be or not to be, that is the question. Whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune.",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
        "The only thing we have to fear is fear itself. Ask not what your country can do for you; ask what you can do for your country.",
        "In the beginning there was nothing. Then there was everything. The universe expanded in every direction, filling the void with stars and galaxies beyond count.",
        "Software engineering is the art of building systems that work reliably, scale gracefully, and evolve without breaking. Clean code reads like well-written prose.",
        "Programming is not about typing, it is about thinking. The best code is no code at all. Every line of code you write is a line that must be maintained and understood.",
        "Success is not final, failure is not fatal; it is the courage to continue that counts. Hard work beats talent when talent does not work hard enough.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall. Life is what happens when you are busy making other plans.",
        "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish, and never stop learning.",
        "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are not smart enough to debug it.",
        "Simplicity is the ultimate sophistication. Make things as simple as possible, but not simpler. Complexity is the enemy of execution and reliability.",
        "The function of good software is to make the complex appear to be simple. Good design is obvious. Great design is transparent. The best interface is no interface.",
        "We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize the best of our energies.",
    ];

    // ----------------------------------------------------------------
    // Application state
    // ----------------------------------------------------------------

    var state = {
        mode: "beginner",
        lessonIndex: 0,
        text: "",
        position: 0,
        charStates: [],
        errorCount: 0,
        totalKeystrokes: 0,
        startTime: null,
        timerInterval: null,
        isActive: false,
        isComplete: false,
        errorMap: {},
    };

    // ----------------------------------------------------------------
    // DOM cache
    // ----------------------------------------------------------------

    var dom = {};

    function cacheDom() {
        dom.modeBtns = document.querySelectorAll(".mode-switch__btn");
        dom.lessonNav = document.getElementById("lessonNav");
        dom.lessonSelect = document.getElementById("lessonSelect");
        dom.lessonDescription = document.getElementById("lessonDescription");
        dom.textSelector = document.getElementById("textSelector");
        dom.newTextBtn = document.getElementById("newTextBtn");
        dom.typingArea = document.getElementById("typingArea");
        dom.typingPrompt = document.getElementById("typingPrompt");
        dom.textDisplay = document.getElementById("textDisplay");
        dom.wpmValue = document.getElementById("wpmValue");
        dom.accuracyValue = document.getElementById("accuracyValue");
        dom.timeValue = document.getElementById("timeValue");
        dom.errorsValue = document.getElementById("errorsValue");
        dom.keyboard = document.getElementById("keyboard");
        dom.fingerHint = document.getElementById("fingerHint");
        dom.restartBtn = document.getElementById("restartBtn");
        dom.nextBtn = document.getElementById("nextBtn");
        dom.results = document.getElementById("results");
        dom.resultsStats = document.getElementById("resultsStats");
        dom.resultsDetails = document.getElementById("resultsDetails");
        dom.retryBtn = document.getElementById("retryBtn");
        dom.continueBtn = document.getElementById("continueBtn");
    }

    // ----------------------------------------------------------------
    // Keyboard rendering
    // ----------------------------------------------------------------

    function renderKeyboard() {
        dom.keyboard.innerHTML = "";

        KEYBOARD_ROWS.forEach(function (row) {
            var rowEl = document.createElement("div");
            rowEl.className = "keyboard__row";

            row.forEach(function (kd) {
                var el = document.createElement("div");
                var keyLower = kd.key.toLowerCase();
                var finger = FINGER_MAP[keyLower] || FINGER_MAP[kd.key] || "";

                el.className = "key";
                el.dataset.key = kd.key;
                if (finger) el.dataset.finger = finger;

                var base = 42;
                var gap = 4;
                el.style.width = kd.w * base + (kd.w - 1) * gap + "px";

                if (kd.key === "f" || kd.key === "j") el.classList.add("key--home");

                var specials = [
                    "Backspace", "Tab", "CapsLock", "Enter",
                    "ShiftLeft", "ShiftRight", " ",
                ];
                if (specials.indexOf(kd.key) !== -1) el.classList.add("key--special");

                el.textContent = kd.display;
                rowEl.appendChild(el);
            });

            dom.keyboard.appendChild(rowEl);
        });
    }

    // ----------------------------------------------------------------
    // Event listeners
    // ----------------------------------------------------------------

    function setupEventListeners() {
        dom.modeBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                setMode(btn.dataset.mode);
            });
        });

        dom.lessonSelect.addEventListener("change", function (e) {
            state.lessonIndex = parseInt(e.target.value, 10);
            loadText();
        });

        dom.newTextBtn.addEventListener("click", function () {
            loadText();
        });

        dom.typingArea.addEventListener("click", function () {
            dom.typingArea.focus();
        });

        document.addEventListener("keydown", handleKeyDown);

        dom.restartBtn.addEventListener("click", function () {
            loadText();
        });

        dom.nextBtn.addEventListener("click", nextLesson);

        dom.retryBtn.addEventListener("click", function () {
            dom.results.hidden = true;
            loadText();
        });

        dom.continueBtn.addEventListener("click", function () {
            dom.results.hidden = true;
            nextLesson();
        });
    }

    // ----------------------------------------------------------------
    // Mode management
    // ----------------------------------------------------------------

    function setMode(mode) {
        state.mode = mode;

        dom.modeBtns.forEach(function (btn) {
            var active = btn.dataset.mode === mode;
            btn.classList.toggle("mode-switch__btn--active", active);
            btn.setAttribute("aria-selected", String(active));
        });

        dom.lessonNav.hidden = mode !== "beginner";
        dom.textSelector.hidden = mode !== "advanced";
        dom.nextBtn.hidden = true;

        if (mode === "beginner") populateLessonSelect();

        loadText();
    }

    // ----------------------------------------------------------------
    // Lesson helpers
    // ----------------------------------------------------------------

    function populateLessonSelect() {
        dom.lessonSelect.innerHTML = "";

        BEGINNER_LESSONS.forEach(function (lesson, i) {
            var opt = document.createElement("option");
            opt.value = i;
            opt.textContent = (i + 1) + ". " + lesson.name;
            if (i === state.lessonIndex) opt.selected = true;
            dom.lessonSelect.appendChild(opt);
        });
    }

    function nextLesson() {
        if (state.mode === "beginner") {
            state.lessonIndex = Math.min(
                state.lessonIndex + 1,
                BEGINNER_LESSONS.length - 1
            );
            dom.lessonSelect.value = state.lessonIndex;
        }
        loadText();
    }

    // ----------------------------------------------------------------
    // Text loading & reset
    // ----------------------------------------------------------------

    function loadText() {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }

        var text;
        if (state.mode === "beginner") {
            var lesson = BEGINNER_LESSONS[state.lessonIndex];
            text = lesson.text;
            dom.lessonDescription.textContent = lesson.desc;
        } else {
            text = ADVANCED_TEXTS[Math.floor(Math.random() * ADVANCED_TEXTS.length)];
        }

        state.text = text;
        state.position = 0;
        state.charStates = new Array(text.length).fill("pending");
        state.errorCount = 0;
        state.totalKeystrokes = 0;
        state.startTime = null;
        state.isActive = false;
        state.isComplete = false;
        state.errorMap = {};

        dom.results.hidden = true;
        dom.nextBtn.hidden = true;
        dom.typingPrompt.hidden = false;

        renderText();
        resetStatsDisplay();
        highlightCurrentKey();
        updateFingerHint();
        dom.typingArea.focus();
    }

    // ----------------------------------------------------------------
    // Text rendering
    // ----------------------------------------------------------------

    function renderText() {
        var display = dom.textDisplay;
        display.innerHTML = "";

        var chars = state.text.split("");
        for (var i = 0; i < chars.length; i++) {
            var ch = chars[i];

            // Insert word-break opportunity before spaces
            if (ch === " ") {
                display.appendChild(document.createElement("wbr"));
            }

            var span = document.createElement("span");
            span.className = "char";
            span.textContent = ch === " " ? "\u00A0" : ch;

            if (state.isComplete) {
                span.classList.add(
                    "char--" + state.charStates[i]
                );
            } else if (i < state.position) {
                span.classList.add("char--" + state.charStates[i]);
            } else if (i === state.position) {
                span.classList.add("char--current");
            } else {
                span.classList.add("char--pending");
            }

            display.appendChild(span);
        }

        // Keep current char visible
        var cur = display.querySelector(".char--current");
        if (cur) cur.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    // ----------------------------------------------------------------
    // Input handling
    // ----------------------------------------------------------------

    function handleKeyDown(e) {
        var ignore = [
            "Control", "Alt", "Meta", "Shift",
            "CapsLock", "Tab", "Escape",
            "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        ];
        if (ignore.indexOf(e.key) !== -1) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (state.isComplete) return;

        // Don't capture when a form element is focused
        var tag = e.target.tagName;
        if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") return;

        e.preventDefault();

        if (e.key === "Backspace") {
            handleBackspace();
            return;
        }

        if (e.key.length !== 1) return;
        processChar(e.key);
    }

    function processChar(typed) {
        if (state.position >= state.text.length) return;

        if (!state.isActive) startSession();

        var expected = state.text[state.position];
        state.totalKeystrokes++;

        if (typed === expected) {
            state.charStates[state.position] = "correct";
        } else {
            state.charStates[state.position] = "incorrect";
            state.errorCount++;
            state.errorMap[expected] = (state.errorMap[expected] || 0) + 1;
        }

        state.position++;

        if (state.position >= state.text.length) {
            endSession();
        }

        renderText();
        updateLiveStats();
        highlightCurrentKey();
        updateFingerHint();
    }

    function handleBackspace() {
        if (state.position <= 0) return;

        state.position--;

        // If previous was an error, undo the error count
        if (state.charStates[state.position] === "incorrect") {
            state.errorCount = Math.max(0, state.errorCount - 1);
            var expected = state.text[state.position];
            if (state.errorMap[expected]) {
                state.errorMap[expected]--;
                if (state.errorMap[expected] <= 0) delete state.errorMap[expected];
            }
        }

        state.charStates[state.position] = "pending";
        state.totalKeystrokes = Math.max(0, state.totalKeystrokes - 1);

        renderText();
        updateLiveStats();
        highlightCurrentKey();
        updateFingerHint();
    }

    // ----------------------------------------------------------------
    // Session lifecycle
    // ----------------------------------------------------------------

    function startSession() {
        state.isActive = true;
        state.startTime = Date.now();
        dom.typingPrompt.hidden = true;

        state.timerInterval = setInterval(updateLiveStats, 250);
    }

    function endSession() {
        state.isActive = false;
        state.isComplete = true;

        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }

        updateLiveStats();
        showResults();
        saveProgress();
    }

    // ----------------------------------------------------------------
    // Live statistics
    // ----------------------------------------------------------------

    function resetStatsDisplay() {
        dom.wpmValue.textContent = "0";
        dom.accuracyValue.textContent = "100";
        dom.timeValue.textContent = "0:00";
        dom.errorsValue.textContent = "0";
    }

    function updateLiveStats() {
        if (!state.startTime) return;

        var elapsed = Date.now() - state.startTime;
        var minutes = elapsed / 60000;
        var seconds = Math.floor(elapsed / 1000);

        var correct = 0;
        for (var i = 0; i < state.charStates.length; i++) {
            if (state.charStates[i] === "correct") correct++;
        }

        var wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
        var accuracy =
            state.totalKeystrokes > 0
                ? Math.round(
                      ((state.totalKeystrokes - state.errorCount) /
                          state.totalKeystrokes) *
                          100
                  )
                : 100;

        dom.wpmValue.textContent = wpm;
        dom.accuracyValue.textContent = accuracy;
        dom.timeValue.textContent = formatTime(seconds);
        dom.errorsValue.textContent = state.errorCount;
    }

    // ----------------------------------------------------------------
    // Keyboard highlighting
    // ----------------------------------------------------------------

    function highlightCurrentKey() {
        var actives = dom.keyboard.querySelectorAll(".key--active");
        for (var i = 0; i < actives.length; i++) {
            actives[i].classList.remove("key--active");
        }

        if (state.position >= state.text.length || state.isComplete) return;

        var nextChar = state.text[state.position];
        var keyToFind = nextChar.toLowerCase();

        var keyEl = dom.keyboard.querySelector(
            '[data-key="' + CSS.escape(keyToFind) + '"]'
        );
        if (keyEl) keyEl.classList.add("key--active");

        // Highlight shift for uppercase letters
        if (/[A-Z]/.test(nextChar)) {
            var finger = FINGER_MAP[keyToFind];
            if (finger && finger.indexOf("l-") === 0) {
                var rs = dom.keyboard.querySelector('[data-key="ShiftRight"]');
                if (rs) rs.classList.add("key--active");
            } else {
                var ls = dom.keyboard.querySelector('[data-key="ShiftLeft"]');
                if (ls) ls.classList.add("key--active");
            }
        }
    }

    function updateFingerHint() {
        if (state.position >= state.text.length || state.isComplete) {
            dom.fingerHint.textContent = "";
            return;
        }

        var nextChar = state.text[state.position];
        var finger = FINGER_MAP[nextChar.toLowerCase()] || FINGER_MAP[nextChar];

        if (finger) {
            var label = FINGER_LABELS[finger] || finger;
            var display = nextChar === " " ? "space" : nextChar;
            dom.fingerHint.textContent =
                'Use your ' + label + ' finger for "' + display + '"';
        } else {
            dom.fingerHint.textContent = "";
        }
    }

    // ----------------------------------------------------------------
    // Results panel
    // ----------------------------------------------------------------

    function showResults() {
        var elapsed = Date.now() - state.startTime;
        var minutes = elapsed / 60000;
        var seconds = Math.floor(elapsed / 1000);

        var correct = 0;
        for (var i = 0; i < state.charStates.length; i++) {
            if (state.charStates[i] === "correct") correct++;
        }

        var wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
        var accuracy =
            state.totalKeystrokes > 0
                ? Math.round(
                      ((state.totalKeystrokes - state.errorCount) /
                          state.totalKeystrokes) *
                          100
                  )
                : 100;

        // Rating
        var rating, ratingClass;
        if (wpm < 20) {
            rating = "Keep practicing!";
            ratingClass = "rating--bronze";
        } else if (wpm < 35) {
            rating = "Good progress!";
            ratingClass = "rating--bronze";
        } else if (wpm < 50) {
            rating = "Nice speed!";
            ratingClass = "rating--silver";
        } else if (wpm < 70) {
            rating = "Great typing!";
            ratingClass = "rating--silver";
        } else if (wpm < 90) {
            rating = "Excellent!";
            ratingClass = "rating--gold";
        } else {
            rating = "Outstanding!";
            ratingClass = "rating--gold";
        }

        dom.resultsStats.innerHTML =
            '<div class="results__grid">' +
            '<div class="result-card"><span class="result-card__value">' + wpm + '</span><span class="result-card__label">WPM</span></div>' +
            '<div class="result-card"><span class="result-card__value">' + accuracy + '%</span><span class="result-card__label">Accuracy</span></div>' +
            '<div class="result-card"><span class="result-card__value">' + formatTime(seconds) + '</span><span class="result-card__label">Time</span></div>' +
            '<div class="result-card"><span class="result-card__value">' + state.errorCount + '</span><span class="result-card__label">Errors</span></div>' +
            '</div>' +
            '<p class="results__rating ' + ratingClass + '">' + rating + '</p>';

        // Problem keys
        var problemKeys = Object.keys(state.errorMap)
            .map(function (k) { return { key: k, count: state.errorMap[k] }; })
            .sort(function (a, b) { return b.count - a.count; })
            .slice(0, 5);

        var detailsHTML = "";

        if (problemKeys.length > 0) {
            var keysHTML = problemKeys
                .map(function (pk) {
                    var display = pk.key === " " ? "space" : pk.key;
                    return (
                        '<span class="problem-key">' +
                        escapeHTML(display) +
                        " <small>(" + pk.count + ")</small></span>"
                    );
                })
                .join(" ");

            detailsHTML +=
                '<div class="results__section">' +
                '<h3 class="results__section-title">Problem Keys</h3>' +
                '<p class="results__problem-keys">' + keysHTML + "</p></div>";
        }

        // Tip
        var tip;
        if (accuracy < 85) {
            tip = "Focus on accuracy over speed. Slow down and aim for fewer errors before increasing pace.";
        } else if (accuracy < 95) {
            tip = "Good accuracy! Try to be a bit more precise. Watch the highlighted keys carefully.";
        } else if (wpm < 30) {
            tip = "Great accuracy! Now work on building speed. Regular practice builds muscle memory.";
        } else if (problemKeys.length > 0) {
            var worstKey = problemKeys[0].key === " " ? "space" : problemKeys[0].key;
            tip = 'Pay extra attention to the "' + worstKey + '" key. Practice words that use it frequently.';
        } else {
            tip = "Excellent work! Keep challenging yourself with the next lesson or advanced mode.";
        }

        detailsHTML +=
            '<div class="results__section">' +
            '<h3 class="results__section-title">Tip</h3>' +
            '<p class="results__tip">' + tip + "</p></div>";

        dom.resultsDetails.innerHTML = detailsHTML;

        // Button labels
        if (state.mode === "beginner" && state.lessonIndex < BEGINNER_LESSONS.length - 1) {
            dom.continueBtn.textContent = "Next Lesson";
            dom.continueBtn.hidden = false;
        } else if (state.mode === "advanced") {
            dom.continueBtn.textContent = "New Text";
            dom.continueBtn.hidden = false;
        } else {
            dom.continueBtn.hidden = true;
        }

        dom.results.hidden = false;
    }

    // ----------------------------------------------------------------
    // Local storage
    // ----------------------------------------------------------------

    function saveProgress() {
        try {
            var raw = localStorage.getItem("typeflow_progress");
            var data = raw ? JSON.parse(raw) : {};

            var elapsed = Date.now() - state.startTime;
            var minutes = elapsed / 60000;
            var correct = 0;
            for (var i = 0; i < state.charStates.length; i++) {
                if (state.charStates[i] === "correct") correct++;
            }
            var wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
            var accuracy =
                state.totalKeystrokes > 0
                    ? Math.round(
                          ((state.totalKeystrokes - state.errorCount) /
                              state.totalKeystrokes) *
                              100
                      )
                    : 100;

            var key =
                state.mode + "-" +
                (state.mode === "beginner" ? state.lessonIndex : "session");

            if (!data[key] || wpm > (data[key].wpm || 0)) {
                data[key] = { wpm: wpm, accuracy: accuracy, date: new Date().toISOString() };
            }

            if (state.mode === "beginner") {
                if (!Array.isArray(data.completedLessons)) data.completedLessons = [];
                if (data.completedLessons.indexOf(state.lessonIndex) === -1) {
                    data.completedLessons.push(state.lessonIndex);
                }
            }

            localStorage.setItem("typeflow_progress", JSON.stringify(data));
        } catch (_) {
            // localStorage may be unavailable — fail silently
        }
    }

    // ----------------------------------------------------------------
    // Utilities
    // ----------------------------------------------------------------

    function formatTime(totalSeconds) {
        var min = Math.floor(totalSeconds / 60);
        var sec = totalSeconds % 60;
        return min + ":" + (sec < 10 ? "0" : "") + sec;
    }

    function escapeHTML(str) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // ----------------------------------------------------------------
    // Initialise
    // ----------------------------------------------------------------

    function init() {
        cacheDom();
        renderKeyboard();
        setupEventListeners();
        setMode("beginner");
    }

    document.addEventListener("DOMContentLoaded", init);
})();
