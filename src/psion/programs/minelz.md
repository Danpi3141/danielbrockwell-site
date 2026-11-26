---
title: MineLZ
category: game
status: working-build
summary: "Minesweeper in OPL: five sizes up to Expert's 30 by 16, which scrolls under the screen, a safe first move, best times."
updated: 2026-11-26
pack: 16K
needs: "11,210 bytes: a 16K Datapak. In an emulator, load the pack image into slot B of an LZ or LZ64. On a real Organiser, load the Organiser files zip with RPBOOT: the files are small enough for A: on a 32K LZ, with room left to play."
licence: MIT
animations:
  - { src: /assets/img/psion/minelz/play-lz64.gif, alt: "A Quick game on the four-line screen: the first move opens an area on the left, then the cursor moves to each square the numbers show is safe and uncovers it, until CLEARED! and a new best time", caption: "Four-line: LZ and LZ64 (real time)" }
models:
  cm:   { state: no }
  xp:   { state: no }
  la:   { state: no }
  lz:   { state: works, free: 5992 }
  lz64: { state: works, free: 5992 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to play every size and keep the best times. Once the best-times file exists, 5,950 is enough."
tested_on: "the Jape emulator: all 14 LZ and LZ64 ROMs it has, other languages included. Every move checked against a separate model of the rules."
screenshots:
  - { src: /assets/img/psion/minelz/lz64-quick1.png, alt: "Four-line screen: a Quick field after the first move, an open area on the left edged with numbers, one flag placed, the rest covered", screen: "Quick after the first move" }
  - { src: /assets/img/psion/minelz/lz64-intermed.png, alt: "Four-line screen: four rows of the 16 by 16 Intermediate field, with a narrow panel on the right: 40 mines left, 0 minutes, 4 seconds, row 9", screen: "Intermediate, with its panel" }
  - { src: /assets/img/psion/minelz/lz64-expert.png, alt: "Four-line screen: 20 columns and 4 rows of the 30 by 16 Expert field, two flags placed and a small open area", screen: "Expert: the window follows the cursor" }
  - { src: /assets/img/psion/minelz/lz64-lost.png, alt: "Four-line screen: a lost Quick game, every mine shown, the one that was hit crossed out and a wrong flag marked", screen: "A mine hit" }
  - { src: /assets/img/psion/minelz/lz64-best.png, alt: "Four-line screen: the best times for Quick, page 1 of 4: 1. 03:47 DAN, then two empty places", screen: "Best times" }
files:
  - { file: minelz-0.9.2-psion.zip, kind: psion, version: "0.9.2", date: 2026-11-26 }
  - { file: minelz-0.9.2.opk, kind: build, version: "0.9.2", date: 2026-11-26 }
  - { file: minelz-0.9.2-source.zip, kind: source, version: "0.9.2", date: 2026-11-26 }
source: false
changelog:
  - { date: 2026-11-26, version: "0.9.2", change: "Working build: the whole first version, tested in the emulator on all 14 LZ and LZ64 ROMs." }
---

## About

Minesweeper for the LZ and LZ64. The field fills all four rows of the screen; bigger fields scroll under the 20 by 4 window, which follows the cursor and always shows its eight neighbours. The first move always opens an area, and never hits a mine.

It is written in OPL alone, with the squares drawn as user-defined characters: covered, flag, mine, the mine that was hit, a wrong flag, and an open square. The digit 1 is redrawn in bold, because the Organiser's own 1 is hard to tell from the flag.

There is also a Minesweeper for Android, [Flagstone](/android/flagstone/), with no-guess boards.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:MINELZ` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:MINELZ`.

The source + build zip also has a 32K pack image with each procedure's source on it, to edit and translate on the Organiser. With too little memory free, MineLZ says how many more bytes it needs.

## Manual

| Game | Field | Mines | Beside the field |
|---|---|---|---|
| Quick | 20 × 4 | 10 | Nothing: the whole field is in view, and S shows the status |
| Beginner | 9 × 9 | 10 | A wide panel: mines left, time, the rows in view |
| Intermediate | 16 × 16 | 40 | A narrow panel: mines left, minutes, seconds, the cursor's row |
| Expert | 30 × 16 | 99 | Nothing: it scrolls both ways, and S shows the status |
| Custom | 5 to 30 × 4 to 24 | 1 to a third of the squares | The panel that fits its width |

| Key | In play |
|---|---|
| Arrows | Move the cursor. Held, they repeat, and the cursor stops where you let go |
| <kbd>EXE</kbd> | Uncover a square. On a number with all its flags placed, uncover the rest of its neighbours |
| <kbd>F</kbd> | Place a flag, or take it off |
| <kbd>S</kbd> | Mines left, time, and the cursor's column and row, until the next key |
| <kbd>ON/CLEAR</kbd> | Pause: the field is hidden and the clock stops. Resume, New or Menu |

The clock counts only play: not the pause, and not time with the machine off. Left alone until the machine switches itself off, the game pauses first, and switching on shows the pause screen.

**Best** keeps the three best times of Quick, Beginner, Intermediate and Expert, with initials (<kbd>LEFT</kbd> and <kbd>RIGHT</kbd> change the game, <kbd>DEL</kbd> clears one). **Set** turns the sound on or off. Custom games keep no times.

## Where it has got to

Version 0.9.2 is a working build: the whole first version of the design, tested in the emulator on every LZ and LZ64 ROM it has. Every board, area, flag and win was checked against a separate model of the rules, with 200 first moves on each size to show the first move always opens an area. The design's second stage, a no-guess mode with a solver in machine code, is not in this version.

## Technical notes

- The field is two string arrays laid out the same way, the screen rows and the mines, so a square is one number in both and its neighbours are fixed steps. A row of the screen is one `PRINT`.
- Opening an area marks the squares waiting in their rows and finds the next with `LOC`, rather than keeping a stack. One square opens in 0.02 seconds; a large area of 380 squares takes 10.
- `RND` is slow floating point, so it only seeds a 16-bit integer generator for the mines: Expert's 99 are laid in about 1.5 seconds.
- OPL reads a procedure from the pack each time it is called, so the busiest work stays in one procedure. At its deepest point the game uses 5,933 bytes on a 32K LZ.
- The best times and the sound setting are kept in `A:MINEBEST`.
