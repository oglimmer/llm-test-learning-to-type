// Beginner lessons progress from home-row index fingers outward,
// then add top and bottom rows, then capitals and punctuation.
// Each lesson keeps content short (~30–80 chars) so users get fast feedback loops.
const BEGINNER_LESSONS = [
  {
    title: "1. Home row — index fingers (f j)",
    hint: "Rest fingers on a s d f  j k l ;  — only use index fingers.",
    text: "fff jjj fff jjj fjf jfj fjfj jfjf fff jjj fj jf fjf",
  },
  {
    title: "2. Home row — middle fingers (d k)",
    hint: "Add middle fingers. Keep wrists relaxed, eyes on the screen.",
    text: "ddd kkk ddd kkk dkd kdk dk kd dkdk kdkd fjdk kdjf",
  },
  {
    title: "3. Home row — ring fingers (s l)",
    hint: "Ring fingers join. Reach without moving the whole hand.",
    text: "sss lll sss lll sl ls slsl lsls dskl lkds fjsl lsjf",
  },
  {
    title: "4. Home row — pinky fingers (a ;)",
    hint: "Pinkies are weakest — be patient and accurate, not fast.",
    text: "aaa ;;; aaa ;;; a; ;a a;a; ;a;a asdf jkl; asdf jkl;",
  },
  {
    title: "5. Home row words",
    hint: "Real words using only home-row keys.",
    text: "dad sad lad fall ask flask glass salad falls had jak",
  },
  {
    title: "6. Top row — e i",
    hint: "Reach up with middle fingers. Return to home row after each press.",
    text: "ded kik ded kik die fie sake like aside file desk like",
  },
  {
    title: "7. Top row — r u",
    hint: "Index fingers reach up-left and up-right.",
    text: "frf juj fur jar rule used rule fire user fork rude jus",
  },
  {
    title: "8. Top row — t y",
    hint: "Index-finger stretch; the trickiest top-row keys.",
    text: "ftf jyj try yet style they truly fairly stay yardstick",
  },
  {
    title: "9. Top row — w o",
    hint: "Ring fingers up. Keep elbows still.",
    text: "sws lol wow low slow word world owl follow yellow flow",
  },
  {
    title: "10. Top row — q p",
    hint: "Pinkies stretch up. Slow and deliberate.",
    text: "aqa ;p; quip pop apple paper proper quirky equip queue",
  },
  {
    title: "11. Bottom row — v m",
    hint: "Index fingers reach down-in.",
    text: "fvf jmj move vivid maple mover memory vast move myself",
  },
  {
    title: "12. Bottom row — c ,",
    hint: "Middle fingers down. Keep the home-row finger anchored.",
    text: "dcd k,k cocoa, candy, climb, crack, accent, decimal,",
  },
  {
    title: "13. Bottom row — x .",
    hint: "Ring fingers down. End sentences with a period.",
    text: "sxs l.l fix it. relax. exit. example. extra. excellent.",
  },
  {
    title: "14. Bottom row — z /",
    hint: "Pinkies down. Smooth, not sharp.",
    text: "aza ;/; zip. lazy/quiz. zero/zone. dazzle. amazing/jazz.",
  },
  {
    title: "15. Capitals & punctuation",
    hint: "Use the opposite-hand Shift to make capitals.",
    text: "Hello, World. The Quick Brown Fox. Anna and Ben. Q&A!",
  },
  {
    title: "16. Common words mix",
    hint: "Putting it all together. Aim for steady rhythm.",
    text: "the quick brown fox jumps over the lazy dog every day.",
  },
];

// Advanced texts: full sentences and short paragraphs of varied content.
// Mix prose, technical writing, and quotes to exercise different letter frequencies.
const ADVANCED_TEXTS = [
  "The art of programming is the art of organizing complexity. Mastering tools is only useful when paired with the discipline to keep things simple.",
  "Most software bugs are not in the code we wrote, but in the assumptions we forgot we were making. Write down what must be true before you trust the result.",
  "She read the message twice, picked up her coffee, and walked to the window. Outside, the snow had finally stopped, and the streets glowed under the lamps.",
  "Practice does not make perfect; practice makes permanent. Slow down enough to type each word correctly, and speed will follow on its own.",
  "Functions should do one thing, name themselves clearly, and never surprise the reader. A function that surprises is a bug waiting for the right input.",
  "When the wind picked up, the sailors reefed the mainsail and turned the bow into the waves. Forty miles offshore, the only light came from the compass.",
  "It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the one who is actually in the arena.",
  "Caching is one of the two hard problems in computer science. The other is naming things, and getting both right at the same time is genuinely difficult.",
  "Coffee on the table, rain on the roof, a single lamp burning by the window — these are the small mercies that get a person through a long evening of work.",
  "Reading code is a skill we practice less than writing it, yet professional programmers spend most of their day reading. Slow, careful reading pays off.",
];
