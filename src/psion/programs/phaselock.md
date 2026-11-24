---
title: Phaselock
category: game
status: working-build
summary: "A side-scrolling machine-code shooter: stars, enemies and ship move one pixel at a time at 20 frames a second."
updated: 2026-11-20
pack: 32K
needs: "30,085 bytes: a 32K Datapak. In an emulator, load the pack image into slot B of an LZ or LZ64. On a real Organiser, load the psion/ folder from the source + build zip with RPBOOT: A: needs about 14K free for the files, plus 8,142 bytes free to run it."
licence: MIT
animations:
  - { src: /assets/img/psion/phaselock/play-lz64.gif, alt: "Phaselock: the title, the WAVE 1: DRONES card, then wave 1 at 20 frames a second, the ship firing at drones as it moves between lanes", screen: "Four-line: LZ and LZ64" }
models:
  cm:   { state: no }
  xp:   { state: no }
  la:   { state: no }
  lz:   { state: works, free: 8142 }
  lz64: { state: works, free: 8142 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to play a game and save it."
tested_on: "the Jape emulator (LZ and LZ64). The pass on real hardware (LCD smear, sound, battery) is still to do."
files:
  - { file: phaselock-0.9-psion.zip, kind: psion, version: "0.9", date: 2026-11-20 }
  - { file: phaselock-0.9.opk, kind: build, version: "0.9", date: 2026-11-20 }
  - { file: phaselock-0.9-source.zip, kind: source, version: "0.9", date: 2026-11-20 }
source: false
screenshots:
  - { src: /assets/img/psion/phaselock/lz64-title.png, alt: "Four-line screen: PHASELOCK pixel shooter title, with the ship and two enemies, and Play, Scores, Quit", screen: Title }
  - { src: /assets/img/psion/phaselock/lz64-wave.png, alt: "Four-line screen in wave 1: the ship on the left firing, drone enemies across the lanes and scattered stars", screen: "Wave 1" }
  - { src: /assets/img/psion/phaselock/lz64-card.png, alt: "Four-line screen: the status card for WAVE 1: DRONES, with score 0, three lives and EXE=GO", screen: Status card }
changelog:
  - { date: 2026-11-20, version: "0.9", change: "Working build: milestones 1 to 6, tested in the emulator; made harder after the first play-through." }
---

## About

A side-scrolling shooter that moves the stars, the enemies and the ship one pixel at a time at 20 frames a second. One machine-code routine runs a whole wave; OPL does the title, the wave data, the status cards and the high scores.

Three lives, eight waves and a boss, about ten minutes. The ship fires by itself. Two rules make it hard:

- **Nothing gets away.** An enemy you let past comes back in on the right, now weaving towards your lane and shooting. A wave ends only when everything in it is destroyed. Mines are the exception: they cannot be shot and just leave.
- **Shots fill the lane.** An enemy shot hits anywhere over the five rows of its `+`, so the only way to dodge is to leave that lane.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:PHASE` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:PHASE`.

## Manual

| Key | Action |
|---|---|
| <kbd>UP</kbd> / <kbd>DOWN</kbd> | Move, 2 pixels a tick while held |
| <kbd>EXE</kbd> | Bomb: clears every enemy and enemy shot, once a wave. Let go of the arrow first: the keyboard reports one key at a time |
| <kbd>MODE</kbd> | Pause and show the status card |
| <kbd>ON/CLEAR</kbd> | Quit to the title |

If no key is pressed for 30 seconds the game pauses itself.

## Technical notes

- The machine-code core is assembled at three origins and compared to find its fix-ups, so the loader can place it anywhere.
- A reference model of the core in Python checks the strip builders, the collision tests and one frame of logic.
- Left for the hardware pass: whether one-pixel steps at 20 frames a second smear on the real LCD, the LCD busy flag, sound and battery. If a frame ever misses its tick, the status card shows `LATE` and the count.
