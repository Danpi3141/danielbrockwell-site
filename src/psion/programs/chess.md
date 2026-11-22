---
title: Chess
category: game
status: released
summary: "A chess engine in 6303 machine code for the four-line Organisers, eight levels from about 450 to 1950 Elo."
updated: 2026-11-22
pack: 64K
needs: "The pack image is a 256K Flashpak image with about 60K used. In an emulator, load it into slot B of an LZ or LZ64. On a real Organiser, load the psion/ folder from the source + build zip with RPBOOT onto a Rampak or Flashpak of 64K or more in B: or C:."
licence: MIT
animations:
  - { src: /assets/img/psion/chess/play-lz64.gif, alt: "Chess on the four-line screen: after 1.e4 e5 the player types G1F3 and F1C4, the Psion pauses to think and replies Nc6, then Nf6, while the view switches between the two halves of the board", screen: "Four-line (LZ and LZ64)" }
models:
  cm:   { state: no }
  xp:   { state: no }
  la:   { state: no }
  lz:   { state: works, free: 18431 }
  lz64: { state: works, free: 18431 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to play and save. Chess picks the biggest table that still leaves room for its save file: 128 entries from 18,431, 256 from 19,330, the full 512 from 21,122. With 17,056 to 18,430 it plays without saving."
tested_on: "the Jape emulator (LZ64), with speed checks on a real Organiser that matched the emulator."
files:
  - { file: chess-1.1-psion.zip, kind: psion, version: "1.1", date: 2026-11-22 }
  - { file: chess-1.1.opk, kind: build, version: "1.1", date: 2026-11-22 }
  - { file: chess-1.1-source.zip, kind: source, version: "1.1", date: 2026-11-22 }
  - { file: chess-1.0.opk, kind: build, version: "1.0", date: 2026-11-21 }
  - { file: chess-1.0-source.zip, kind: source, version: "1.0", date: 2026-11-21 }
source: false
screenshots:
  - { src: /assets/img/psion/chess/lz64-board.png, alt: "Four-line screen: White's half of the board as letters on the left, with rank numbers, the last move dxc4, and a map of the whole board in custom characters on the right", screen: "Board, White's half" }
  - { src: /assets/img/psion/chess/lz64-other-half.png, alt: "Four-line screen: Black's half of the board, ranks 8 to 5, after pressing MODE", screen: "Board, Black's half (MODE)" }
  - { src: /assets/img/psion/chess/lz64-hint.png, alt: "Four-line screen: the bottom line reads HINT E1G1, suggesting castling", screen: Hint }
changelog:
  - { date: 2026-11-22, version: "1.1", change: "The launcher keeps room for the save file, so a game that starts with a bigger table can always be saved. 1.0 could pick its full table and then show CANNOT SAVE: NO ROOM with 19,712 to 21,086 bytes free." }
  - { date: 2026-11-21, version: "1.0", change: "First release." }
---

## About

A full chess game for the LZ and LZ64. The engine is written in 6303 assembler and matched node for node against a JavaScript reference engine, so every change could be measured before it went onto the Organiser. Eight levels, measured against Stockfish's limited-strength scale, run from about 450 to about 1950; level 7, at 30 seconds a move, plays at about 1700.

It has a position book of 4,887 positions that recognises transpositions, and plays king and pawn against king perfectly from a compressed distance table on the pack. The game has clocks, take back, hints, a move list, game review with analysis, set-up, a real-board mode, two-player mode, and PGN export and import.

The game picks the largest transposition table the free RAM allows, so it runs on a 32K LZ with a smaller table and on an LZ64 with the full one.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:CHESS` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:CHESS`.

If there is too little RAM, CHESS says how many bytes are missing.

## Manual

| Key | Action |
|---|---|
| <kbd>A</kbd>–<kbd>H</kbd> then <kbd>1</kbd>–<kbd>8</kbd> | Type a move, such as E2E4. No SHIFT: the keys U V W O P Q I J are 1 to 8. Castle by moving the king (E1G1) |
| Arrows, <kbd>EXE</kbd> | Point: the arrows move a cursor, <kbd>EXE</kbd> picks the piece up, then the arrows step through its legal squares and <kbd>EXE</kbd> puts it down |
| <kbd>DEL</kbd> | Rub out a typed square; with nothing typed, take back your move and the reply |
| <kbd>MODE</kbd> | Show the other half of the board |
| <kbd>SPACE</kbd> | Hint: a 2-second look |
| <kbd>ON/CLEAR</kbd> | Clear what you typed, or open the menu |

While it thinks, any key makes it move now. The menu has new game, level, take back, hint, flip, move list, game review, export PGN, import game, set up, settings, offer a draw, resign, and save and leave. The game is saved after every move and resumes where it was.

**Levels:** 1 to 8, or Auto. They take 1, 1, 2, 3, 3, 10, 30 and 255 seconds a move and measure at about 450, 650, 950, 1200, 1450, 1550, 1700 and 1950.

**Game review** (<kbd>G</kbd> in the menu): <kbd>RIGHT</kbd> or <kbd>EXE</kbd> for the next move, <kbd>LEFT</kbd> or <kbd>DEL</kbd> for the one before, <kbd>DOWN</kbd> and <kbd>UP</kbd> for ten plies, <kbd>SPACE</kbd> to analyse, <kbd>P</kbd> to play on from that position.

## Technical notes

- The engine searches about 70 to 120 positions a second on the Organiser.
- The game uses a RAM array of 19,030 bytes with its full 512-entry transposition table; with room for the save file it needs 21,122 bytes free for that table, 18,431 for the smallest.
- The program takes about 60K of its 256K pack budget.
- Bishop and knight mates succeed in about 80% of random starts.
