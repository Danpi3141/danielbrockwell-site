---
title: Hatchwork
section: android
status: released
summary: "Calm nonogram puzzles for Android: 300 hand-drawn pictures, every one solvable by logic alone."
updated: 2026-10-10
---

## What it is

Hatchwork is a picture logic puzzle. The numbers beside each row and column give the runs of inked squares, and solving them reveals a picture. Every puzzle has exactly one solution, and the solver proves that no guess is ever needed.

There are 300 hand-drawn pictures in 25 albums, from 5 by 5 up to 30 by 30, in black and white or colour. Generated puzzles come in any size from 5 to 30 and four grades, each with a short code that replays it exactly. A daily puzzle follows a weekly rhythm, small and easy on Monday and a big Expert on Sunday. You can also draw your own picture, check it is fair, and share it as a code.

## What I built

- **Kotlin and Jetpack Compose**, for Android 7.0 and later.
- **A line-logic solver** that proves every puzzle has one solution and no guesses, and gives hints that explain the next step.
- **A puzzle maker** that checks a drawing is fair before it can be shared.
- **Big boards on small screens:** zoom stops, a mini map with hidden-line counts, an arrow pad, and clue strips that never take more than half the screen.
- **Two ways to play:** Catch mistakes (three hearts), or free solving with a Check button.
- No adverts, no accounts, no network; progress saves as you play and can be exported.

## Status and what is next

Version 1.5.
