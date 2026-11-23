---
title: Hatchwork
section: android
status: released
summary: "Calm nonogram puzzles for Android: 300 hand-drawn pictures, every one solvable by logic alone."
updated: 2026-10-10
screenshots:
  - { src: /assets/img/android/hatchwork/home.png, alt: "The Hatchwork home screen: the daily puzzle, the Ink and Colour albums, generated puzzles and the puzzle maker", scale: 2 }
  - { src: /assets/img/android/hatchwork/lesson.png, alt: "A 5 by 5 puzzle half solved, with two inked rows, crossed squares and a lesson: Row 4: overlap. Wherever the 3 sits, it covers these squares.", scale: 2 }
  - { src: /assets/img/android/hatchwork/solved.png, alt: "The solved puzzle revealed as a heart, with three stars for no hints and no mistakes", scale: 2 }
---

## What it is

Hatchwork is a picture logic puzzle. The numbers beside each row and column give the runs of inked squares, and solving them reveals a picture. Every puzzle has exactly one solution, and can be finished by logic without guessing. These are two separate properties, and each is checked on its own.

There are 300 hand-drawn pictures in 25 albums, from 5 by 5 up to 30 by 30, in black and white or colour. Generated puzzles come in any size from 5 to 30 and four grades, each with a short code that replays it exactly. A daily puzzle follows a weekly rhythm, small and easy on Monday and a big Expert on Sunday. You can also draw your own picture, check it is fair, and share it as a code.

## What I built

- **Kotlin and Jetpack Compose**, for Android 7.0 and later.
- **A uniqueness check:** a search that counts solutions and stops at two, so a puzzle passes only with exactly one.
- **A logic solver** that checks a puzzle can be finished without guessing: line by line for the albums and most grades, and with at most eight contradiction steps for Expert (assume a square, show it leads to a contradiction). The same solver gives hints that explain the next step.
- **A puzzle maker** that runs a drawing through the same checks before it can be shared.
- **Big boards on small screens:** zoom stops, a mini map with hidden-line counts, an arrow pad, and clue strips that never take more than half the screen.
- **Two ways to play:** Catch mistakes (three hearts), or free solving with a Check button.
- No adverts, no accounts, no network; progress saves as you play and can be exported.

## Current version

Version 1.5, October 2026.
