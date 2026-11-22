---
title: Reversi
category: game
status: working-build
summary: "Reversi on an 8 by 6 board for every Organiser II: eight levels, a coach, review, and one 16K pack."
updated: 2026-11-21
pack: 16K
needs: "16,346 bytes: one 16K Datapak serves every model. In an emulator, load the pack image into slot B. On a real Organiser, write it to a 16K or 32K Datapak, or load the psion/ folder from the source + build zip with RPBOOT."
licence: MIT
animations:
  - { src: /assets/img/psion/reversi/play-lz64.gif, alt: "Reversi on the four-line screen: three opening moves, the panel showing the discs each move turns, and the Psion's search display before each reply", screen: "Four-line (LZ and LZ64)" }
  - { src: /assets/img/psion/reversi/play-cm.gif, alt: "The same three Reversi moves on the two-line screen, with the scores and the Psion's search display", screen: "Two-line (CM, XP and LA)", lines: 2 }
models:
  cm:   { state: works, free: 5783 }
  xp:   { state: works, free: 5783 }
  la:   { state: works, free: 5783 }
  lz:   { state: works, free: 5781 }
  lz64: { state: works, free: 5781 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to play a game and save it."
tested_on: "the Jape emulator: CM, XP, LA, LZ and LZ64, and random keys on all 29 Organiser ROMs it has. Real hardware checks are still to do."
files:
  - { file: reversi-0.9-psion.zip, kind: psion, version: "0.9", date: 2026-11-21 }
  - { file: reversi-0.9.opk, kind: build, version: "0.9", date: 2026-11-21 }
  - { file: reversi-0.9-source.zip, kind: source, version: "0.9", date: 2026-11-21 }
source: false
screenshots:
  - { src: /assets/img/psion/reversi/lz64-game.png, alt: "Four-line screen: the 8 by 6 board on the left with columns A to H, the score You 7, Psion 7, the Psion's last move c6 and your next move a4 +2", screen: "Four-line (LZ and LZ64)" }
  - { src: /assets/img/psion/reversi/cm-thinking.png, alt: "Two-line screen: the whole board drawn in custom characters, and the Psion thinking at depth 3 with a progress bar", screen: "Two-line (CM, XP and LA)", lines: 2 }
  - { src: /assets/img/psion/reversi/lz64-menu.png, alt: "Four-line screen: the board with the menu beside it: New game, Take back, Tip, Swap sides", screen: Menu }
changelog:
  - { date: 2026-11-21, version: "0.9", change: "Working build: the core game and nine of the ten stretch goals, tested in the emulator on every model." }
---

## About

Reversi on a board 8 squares wide and 6 high, in 6303 machine code, for every Organiser II from the 8K CM to the LZ64. One 16K Datapak serves every model: the launcher reads the model and loads the screen code for a two-line or a four-line display, so the game plays the same, at the same strength, everywhere.

Play the Organiser at eight levels, play a friend, or watch a demo. The engine is matched position for position against a JavaScript reference engine, and its opening book came from deep analysis on the PC, since there is no published result for 8 by 6.

There is a coach that rates your move against a deeper search ("Coach c4 +3"), tips, take back, a move list and review, a corner handicap, player names, export and import of games, and save and resume after every move. Flipped discs turn a ring at a time, outward from the new disc.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:REV` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:REV`.

## Manual

| Key | Action |
|---|---|
| <kbd>A</kbd>–<kbd>H</kbd>, then <kbd>1</kbd>–<kbd>6</kbd> | Choose a square: the letter picks the column and lists its legal rows, the row (U V W O P Q, no SHIFT) picks the square |
| <kbd>LEFT</kbd> / <kbd>RIGHT</kbd> | The previous or next legal square |
| <kbd>UP</kbd> / <kbd>DOWN</kbd> | The nearest legal square on the row above or below |
| <kbd>EXE</kbd> | Play the square under the cursor. The prompt shows the discs it would turn: "You: d2 +4" |
| <kbd>S</kbd> | Show every legal square for a second |
| <kbd>T</kbd> | A tip: a short search, about 2 seconds |
| <kbd>L</kbd> | Flash the last move and the discs it flipped |
| <kbd>DEL</kbd> | Take back your move and the reply |
| <kbd>MODE</kbd> | The menu |
| <kbd>ON/CLEAR</kbd> | Cancel a half-typed square; otherwise "Leave? EXE" |

While the Organiser thinks, a bar fills for each tenth of the level's search, with the depth and its best move so far above it. <kbd>ON/CLEAR</kbd> makes it play that move now.

**The menu:** New game, Take back, Tip, Swap sides, Level, Players, Settings, Set up, Tally, Move list, Review, Export, Import, Help, Quit.

**Settings** include the level, one or two players or demo, which colour you play, confirm moves, the opening book, sound, scoring by discs or wins, a corner handicap of 0 to 4, standing hints, the coach, auto level and player names.

## Technical notes

- The game needs 5,783 bytes free on a two-line model and 5,781 on a four-line one, so it runs on a blank 8K CM.
- Every pack, screen and RAM figure is checked by the build, and the tests run the game on every Organiser ROM the emulator has.
