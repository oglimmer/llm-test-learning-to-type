# TypeFlow — Typing Trainer

A 10-finger typing trainer with beginner and advanced modes, real-time performance feedback, and a virtual keyboard with finger guides.

## Run

Open `index.html` in any modern browser. No build step, no dependencies.

```sh
# macOS
open index.html

# Linux
xdg-open index.html

# or use a local server
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Modes

| Mode | What it does |
|------|-------------|
| **Beginner** | 20 progressive lessons starting from home row (F/J), adding keys one pair at a time |
| **Advanced** | Full sentences and paragraphs for speed and accuracy training |

## Performance Feedback

- **Live stats** — WPM, accuracy, time, errors update as you type
- **Results panel** — rating, problem key breakdown, and improvement tips after each session
- **Progress** — best scores per lesson saved in localStorage
