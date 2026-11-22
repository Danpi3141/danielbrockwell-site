---
title: Rampart
category: game
status: released
summary: "Real-time two-lane tower defence: build towers to stop monsters reaching your wall. 15 waves, then endless mode."
updated: 2026-11-20
pack: 32K
needs: "30,531 bytes: a 32K Datapak. In an emulator, load the pack image into slot B of an LZ or LZ64. On a real Organiser, load the psion/ folder from the source + build zip with RPBOOT (about 32K, or about 14K without the source text)."
licence: MIT
animations:
  - { src: /assets/img/psion/rampart/play-lz64.gif, alt: "Rampart: in the build phase two archer towers are added, SPACE starts the wave, and grunts march along both lanes while the towers shoot them", screen: "Four-line (LZ and LZ64)" }
models:
  cm:   { state: no }
  xp:   { state: no }
  la:   { state: no }
  lz:   { state: works, free: 5622 }
  lz64: { state: works, free: 5622 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to play a game and save it."
tested_on: "the Jape emulator (LZ64), with the balance checked against a Python simulation."
files:
  - { file: rampart-1.0-psion.zip, kind: psion, version: "1.0", date: 2026-11-20 }
  - { file: rampart-1.0.opk, kind: build, version: "1.0", date: 2026-11-20 }
  - { file: rampart-1.0-source.zip, kind: source, version: "1.0", date: 2026-11-20 }
source: false
screenshots:
  - { src: /assets/img/psion/rampart/lz64-title.png, alt: "Four-line screen: the RAMPART title drawn in custom characters, with a scrolling line about tower defence", screen: Title }
  - { src: /assets/img/psion/rampart/lz64-build.png, alt: "Four-line screen between waves: two towers built on the top bank, 5 gold left, and WAVE 1: GRUNTS, SPACE=GO in the lanes", screen: "Building, between waves" }
  - { src: /assets/img/psion/rampart/lz64-wave.png, alt: "Four-line screen during a wave: towers on the top bank, a monster in lane A and a shot flying towards it, the castle wall on the left", screen: "A wave in progress" }
changelog:
  - { date: 2026-11-20, version: "1.0", change: "First release." }
---

## About

A real-time, two-lane tower defence game in OPL. Monsters march right to left along the two middle lines towards your castle wall; you build towers on the top and bottom lines to stop them. There are 15 waves in three acts, ending with a dragon, then an endless mode and a high-score table.

Four towers (Archer, Cannon, Frost and Mage), six kinds of monster including a troll and the dragon, gold with interest between waves, and a once-a-wave pot of boiling oil.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:RAMPART` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:RAMPART`.

## Manual

| Key | Action |
|---|---|
| <kbd>LEFT</kbd> / <kbd>RIGHT</kbd> | Move the cursor along a bank (wraps round) |
| <kbd>UP</kbd> / <kbd>DOWN</kbd> | Top bank or bottom bank |
| <kbd>EXE</kbd> | Empty slot: the build menu. Tower: its type, level, upgrade cost and sale value |
| <kbd>A</kbd> <kbd>C</kbd> <kbd>F</kbd> <kbd>M</kbd> | Build an Archer, Cannon, Frost or Mage tower at the cursor |
| <kbd>U</kbd> | Upgrade the tower at the cursor |
| <kbd>DEL</kbd> | Sell the tower at the cursor, for half of everything spent on it |
| <kbd>O</kbd> | Boiling oil, once a wave: 3 damage to every monster in the 5 cells nearest the wall |
| <kbd>SPACE</kbd> | Start the next wave |
| <kbd>MODE</kbd> | Key reminder |
| <kbd>ON/CLEAR</kbd> | Pause menu: Resume or Quit |

**Towers:**

| Tower | Cost | Upgrade | Damage | Range | Notes |
|---|---|---|---|---|---|
| Archer | 10 | 15 | 1, then 2 | 1 | Armour blunts it |
| Cannon | 25 | 30 | 3, then 5 | 2 | Every 2nd tick; ignores armour |
| Frost | 30 | 30 | none | 1 | Freezes its lane for 1 tick (2 when upgraded) |
| Mage | 45 | 50 | 2, then 4 | 2 | Shoots its own lane, else the other |

At most 12 towers at once. You start with 40 gold and 20 lives (Easy 60 and 30, Hard 30 and 10). A cleared wave pays 5 plus the wave number, 5 more if nothing got through, plus interest of 1 per 10 gold held (up to 5).

## Technical notes

- 29 OPL procedures; the high scores are kept in the data file `A:RAMPHS`.
- During a wave the Organiser's own cursor is switched off and replaced by a blinking block, because it would chase every update round the screen.
