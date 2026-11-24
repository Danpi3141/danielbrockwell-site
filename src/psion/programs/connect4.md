---
title: Connect 4
category: game
status: released
summary: "Connect 4 against the Organiser or a friend, with a coach, on two-line and four-line screens."
updated: 2026-11-21
pack: 32K
needs: "One 32K Datapak serves every model. In an emulator, load the pack image into slot B. On a real Organiser, write the image to a 32K Datapak, or load the psion/ folder from the source + build zip with RPBOOT."
licence: MIT
animations:
  - { src: /assets/img/psion/connect4/play-lz64.gif, alt: "Connect 4 on the four-line screen: the end of a 35-move game on a nearly full board; the Psion thinks, drops its last disc, and its winning four blink under Psion wins in 35 moves", screen: "Four-line: LZ and LZ64" }
  - { src: /assets/img/psion/connect4/play-cm.gif, alt: "The same Connect 4 game on the two-line screen: the Psion's last move and its winning four blinking under Psion wins in 35 moves", screen: "Two-line: CM, XP and LA (XP 32K)", lines: 2 }
models:
  cm:   { state: works, free: 4877 }
  xp:   { state: works, free: 4877 }
  la:   { state: works, free: 4877 }
  lz:   { state: works, free: 4875 }
  lz64: { state: works, free: 4875 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to play a game and save it."
tested_on: "the Jape emulator: CM (ROMs 2.4, 2.6, 3.3), XP (2.4, 2.6, 3.1), LA (XP 32K), LZ and LZ64, and random-key runs on all 29 Organiser ROMs it has. Real hardware checks are still to do."
files:
  - { file: connect4-1.0-psion.zip, kind: psion, version: "1.0", date: 2026-11-21 }
  - { file: connect4-1.0.opk, kind: build, version: "1.0", date: 2026-11-21 }
  - { file: connect4-1.0-source.zip, kind: source, version: "1.0", date: 2026-11-21 }
source: false
screenshots:
  - { src: /assets/img/psion/connect4/lz64-four.png, alt: "Four-line screen: the board on the left with Hollow's winning four, and 'Hollow wins in 16 moves' on the right", screen: "Four-line: LZ and LZ64" }
  - { src: /assets/img/psion/connect4/cm-four.png, alt: "Two-line screen: the whole board drawn in custom characters, with the result beside it", screen: "Two-line: CM, XP and LA (XP 32K)", lines: 2 }
  - { src: /assets/img/psion/connect4/lz64-review.png, alt: "Four-line screen in review: Hollow's move in column 4, move 10 of 10", screen: Review }
changelog:
  - { date: 2026-11-21, version: "1.0", change: "First release." }
---

## About

Connect 4 for every Organiser II model on one 32K Datapak. The launcher reads the model and loads the screen code for a two-line or a four-line display; everything else is shared, so the game plays the same on every model.

You can play the Organiser at eight levels (or Auto), play a friend with move timers and game clocks, or watch a demo. The opening book was made by my own perfect solver and checked against John Tromp's database, and the engine is 6303 machine code matched position for position against a JavaScript reference.

There is a coach that names a bad drop before you make it, take back, hints, a move list, a review that marks the moves that threw away a win, export and import of games, and save and resume after every move.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:C4` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:C4`.

## Manual

| Key | Action |
|---|---|
| <kbd>LEFT</kbd> <kbd>RIGHT</kbd> | Choose the next column with room |
| <kbd>EXE</kbd> or <kbd>DOWN</kbd> | Drop the disc. With the coach on, a drop that misses a four or lets one in is named first; press again to drop it |
| <kbd>1</kbd> to <kbd>7</kbd> | Choose that column (no SHIFT needed: the keys U V W O P Q I) |
| <kbd>DEL</kbd> | Take back your move, and the reply |
| <kbd>SPACE</kbd> | Hint: a short search, about 2 seconds |
| <kbd>MODE</kbd> | Ask the coach |
| <kbd>UP</kbd> | The move list |
| <kbd>ON/CLEAR</kbd> | The menu, which has Review game |
| Any key while it thinks | The Organiser moves now |

In menus, <kbd>UP</kbd> and <kbd>DOWN</kbd> move, a letter jumps to the next item starting with it, <kbd>EXE</kbd> takes the item and <kbd>ON/CLEAR</kbd> goes back. In the settings, <kbd>LEFT</kbd> and <kbd>RIGHT</kbd> change a value.

**Modes:** one player (levels 1 to 8, or Auto), two players, demo. **Two players** adds a move timer, game clocks, the swap rule, a match score and player names.

**Review:** <kbd>LEFT</kbd> and <kbd>RIGHT</kbd> step through the game, <kbd>UP</kbd> goes to the start and <kbd>DOWN</kbd> to the next marked move: "Win -> loss", "Missed a win", "Allows four" or "Allows fork".

## Technical notes

- The game needs 4,877 bytes free on a two-line model and 4,875 on a four-line one; a blank CM has room to spare and keeps 33 exported games.
- The program takes about 28K of the 32K Datapak.
- The engine searches about 280 positions a second, and level 8 solves most endings with 16 to 18 empty cells.
