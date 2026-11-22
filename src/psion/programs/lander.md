---
title: Lunar Lander
category: game
status: released
summary: "Land on the pad with a four-step throttle and side thrusters before the fuel runs out, one pixel at a time."
updated: 2026-11-20
pack: 16K
needs: "11,807 bytes: a 16K Datapak or larger. In an emulator, load the pack image into slot B of an LZ or LZ64. On a real Organiser, load the psion/ folder from the source + build zip with RPBOOT (about 11.7K, or about 5K without the source text)."
licence: MIT
animations:
  - { src: /assets/img/psion/lander/play-lz64.gif, alt: "Lunar Lander: the lander crosses the terrain, brakes over the pad with the throttle and side bursts, lands, plants its flag, and the LEVEL 2 card shows score 320", screen: "Four-line (LZ and LZ64)" }
models:
  cm:   { state: no }
  xp:   { state: no }
  la:   { state: no }
  lz:   { state: works, free: 2834 }
  lz64: { state: works, free: 2834 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to play a game and save it."
tested_on: "the Jape emulator (LZ64), with the game's rules checked against a Python simulation."
files:
  - { file: lander-1.0-psion.zip, kind: psion, version: "1.0", date: 2026-11-20 }
  - { file: lander-1.0.opk, kind: build, version: "1.0", date: 2026-11-20 }
  - { file: lander-1.0-source.zip, kind: source, version: "1.0", date: 2026-11-20 }
source: false
screenshots:
  - { src: /assets/img/psion/lander/lz64-title.png, alt: "Four-line screen: LUNAR LANDER title with the best score and the keys for sound, help, play and quit", screen: Title }
  - { src: /assets/img/psion/lander/lz64-descent.png, alt: "Four-line screen: the lander falling over jagged terrain towards a flat pad, with fuel 482, vertical speed 19, horizontal speed 0 and throttle 1 OK on the right", screen: "Descent, with the HUD" }
changelog:
  - { date: 2026-11-20, version: "1.0", change: "First release." }
---

## About

A single-screen Lunar Lander in OPL. The lander moves down one pixel at a time across a 75 by 32 pixel sky, drawn with two user-defined characters that are redefined as it falls. Land gently on the pad with a four-step throttle and side thrusters before the fuel runs out.

Each level has less fuel, a narrower pad and more starting drift. You have three ships, and the best score is kept between games.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:LANDER` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:LANDER`.

## Manual

| Key | Action |
|---|---|
| <kbd>UP</kbd> / <kbd>DOWN</kbd> | Throttle up or down one step (0 to 3). It stays where you leave it |
| <kbd>LEFT</kbd> / <kbd>RIGHT</kbd> | One side burst: sideways speed changes by 16, costs 2 fuel |
| <kbd>ON/CLEAR</kbd> | Pause. <kbd>Q</kbd> quits the game (the score still counts), any other key carries on |

On the title screen: <kbd>EXE</kbd> or <kbd>SPACE</kbd> plays, <kbd>S</kbd> switches the engine sound on and off, <kbd>H</kbd> shows the keys, <kbd>ON/CLEAR</kbd> quits.

**The HUD:** F is fuel, V the vertical speed (v falling, ^ rising), H the horizontal speed, T the throttle, and OK means it is safe to land now.

**Rules:**

- Gravity adds 2 to the downward speed every tick (5 ticks a second). Throttle 1 burns 1 fuel and gives 1 thrust, 2 gives 2 (holds your speed), 3 burns 4 and gives 4.
- Land on the pad with a downward speed of 24 or less and a sideways speed of 8 or less. Anything else is a crash.
- Each landing scores the fuel left plus 25 × the level. A crash replays the level with new terrain.
- Fuel starts at 500 and drops by 25 a level, never below 275. The pad narrows from 3 wide to 1.

## Technical notes

- Nine OPL procedures, about 11.7K with their source text; the best score lives in the data file `A:LANDER`.
- The game's physics was checked against a Python simulation of the same rules.
