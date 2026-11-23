---
title: Psion Spins
category: game
status: working-build
summary: "A five-reel Christmas slot machine for play-money credits, with Santa, carols in two parts, and an advent calendar."
updated: 2026-11-22
pack: 32K
needs: "27,429 bytes: one 32K Datapak serves every model. In an emulator, load the pack image into slot B. On a real Organiser, load the Organiser files zip with RPBOOT."
licence: MIT
animations:
  - { src: /assets/img/psion/spins/play-lz64.gif, alt: "Psion Spins on the four-line screen: one spin of the five reels, Santa walks across saying HO HO HO!, then the winning lines add up to 84 credits", screen: "Four-line (LZ and LZ64)" }
  - { src: /assets/img/psion/spins/play-cm.gif, alt: "Psion Spins on the two-line screen: two spins of the reels, with Santa walking across during the second", screen: "Two-line (CM, XP and LA)", lines: 2 }
models:
  cm:   { state: works, free: 5361 }
  xp:   { state: works, free: 5361 }
  la:   { state: works, free: 5361 }
  lz:   { state: works, free: 5359 }
  lz64: { state: works, free: 5359 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to play a game and save it."
tested_on: "the Jape emulator: CM, XP, LA, LZ and LZ64, and a spin with Santa on all 29 Organiser ROMs it has. Sound and the real LCD are still to check on hardware."
files:
  - { file: spins-0.9.1-psion.zip, kind: psion, version: "0.9.1", date: 2026-11-22 }
  - { file: spins-0.9.1.opk, kind: build, version: "0.9.1", date: 2026-11-22 }
  - { file: spins-0.9.1-source.zip, kind: source, version: "0.9.1", date: 2026-11-22 }
  - { file: spins-0.9-psion.zip, kind: psion, version: "0.9", date: 2026-11-21 }
  - { file: spins-0.9.opk, kind: build, version: "0.9", date: 2026-11-21 }
  - { file: spins-0.9-source.zip, kind: source, version: "0.9", date: 2026-11-21 }
source: false
screenshots:
  - { src: /assets/img/psion/spins/lz64-reels.png, alt: "Four-line screen: five reels of card symbols, bells and presents, 1000 credits, bet 20, EXE=SPIN", screen: "Four-line (LZ and LZ64)" }
  - { src: /assets/img/psion/spins/lz64-santa.png, alt: "Four-line screen: Santa walking across the reels, credits 980, bet 20", screen: "Santa's walk" }
  - { src: /assets/img/psion/spins/cm-reels.png, alt: "Two-line screen: five reels by two rows, 1000 credits, bet 20", screen: "Two-line (CM, XP and LA)", lines: 2 }
changelog:
  - { date: 2026-11-22, version: "0.9.1", change: "The bottom-right symbol lands in one frame, like the others. Before, its top row stayed cut off for a fifth of a second or more after every spin." }
  - { date: 2026-11-21, version: "0.9", change: "Working build: the whole core spec and its stretch goals, tested in the emulator on every model." }
---

## About

A five-reel Christmas slot machine in 6303 machine code, for every Organiser II from the 8K CM to the LZ64. The credits are play money: they have no value, and nothing can be bought, sold or cashed.

One 32K Datapak serves every model. The start-up code reads the model and loads the two-line or four-line screen driver; the game, its pay table and its return (95.7%, counted exactly from the reel strips) are the same on both.

Santa walks across the reels in several styles, the carols play in two parts (melody and bass, from one buzzer), and there is an advent calendar, a gamble on wins, an elf helper, New Year, settling snow and a jukebox.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:SANTA` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:SANTA`.

If there is too little memory, SANTA says how many more bytes it needs.

## Manual

| Key | Action |
|---|---|
| <kbd>EXE</kbd> | Spin. During a spin, stops every reel at once; during an animation, skips it |
| <kbd>UP</kbd> / <kbd>DOWN</kbd> | The line bet: 1, 2, 5 or 10 (a spin is 20 line bets) |
| <kbd>A</kbd> | Autoplay: 10, 25 or 50 spins, or until the Xmas Spins |
| <kbd>P</kbd> <kbd>L</kbd> <kbd>S</kbd> | Pay table, line viewer, statistics |
| <kbd>G</kbd> | After a win: gamble it |
| <kbd>MODE</kbd> | The menu: Spin, Bet, Autoplay, Pay table, Lines, Statistics, Settings, Jukebox, Scenes, Help, New player, Quit |
| <kbd>ON/CLEAR</kbd> | Stops autoplay; otherwise asks "Leave?" |

**Settings:** animation (Full, Quick, Off), Santa's styles, sound (On, Soft, Off), music, glass speed (8 to 15 frames a second), how wins are shown, when autoplay stops, and idle scenes. Everything is saved in `A:SANSAV` after every spin.

## Technical notes

- The game matches a JavaScript reference engine spin for spin: 100,000 spins on each grid with no difference.
- A 4,898-byte RAM array holds the kernel, the screen driver and one shared region for overlays, scene data and the playing tune. Some variables live in the launchers' own code once it has run.
- The sound engine plays 45 notes from E4 to C8 within 0.7% of pitch, with pulse width, slides, arpeggios and vibrato, and keeps tunes in time while the reels animate.
