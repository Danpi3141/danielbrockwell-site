---
title: Flagstone
section: android
category: game
version: "1.3"
status: released
summary: "Minesweeper with no-guess boards, a safe first tap, hints that prove the next move, and a daily puzzle."
updated: 2026-10-11
screenshots:
  - { src: /assets/img/android/flagstone/home.png, alt: "The Flagstone home screen: a Continue card with the board so far, the daily puzzle for 23 November, and Beginner, Intermediate, Expert and Custom games", scale: 2 }
  - { src: /assets/img/android/flagstone/daily.png, alt: "A daily puzzle in progress: a 13 by 20 board with numbers, flags and 29 mines left", scale: 2 }
  - { src: /assets/img/android/flagstone/hint.png, alt: "A hint on a Beginner board: one square outlined as proof and one as a mine, with the text: This 1 still needs 1 mine and has just 1 hidden square left. So it is a mine.", scale: 2 }
---

## What it is

Flagstone is Minesweeper for Android phones. Boards are no-guess by default: every one can be solved by logic, and the first tap always opens an area. When you are stuck, a hint shows a move and proves why it is safe.

A daily puzzle gives everyone the same no-guess board each day, with a run of days solved. A magnifier helps on small squares, and undo can be set per game, from none to unlimited.

## What I built

- **Kotlin and Jetpack Compose**, minimum Android 8.0.
- **A no-guess board generator** and a solver that proves each hint.
- **A daily puzzle with no network:** its seed and first square come from the date alone, and the generator is deterministic, so every phone makes the same board.
- **A board that stays sharp on every screen:** squares are whole pixels at rest, so tiles never blur, even on low-density tablets.

## How it was made

From a written spec, in versions: 1.0, then a daily puzzle and undo in 1.1, confirm taps by default in 1.2, and fixes for sharpness, the daily board and undo in 1.3.

## Current version

Version {{ version }}, October 2026.
