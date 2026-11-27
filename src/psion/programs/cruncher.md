---
title: Psion Cruncher
category: utility
status: in-development
summary: "Pi, e, square roots and logs to thousands of digits on every Organiser II, in machine code, with checked digits."
updated: 2026-11-27
pack: 32K
animations:
  - { src: /assets/img/psion/cruncher/play-lz64.gif, alt: "Pi to 1,000 digits on the four-line screen: the size is typed in, the estimate says about 1 minute 11, the status screen counts up to 100%, Check OK to 1,000, then the viewer finds 999999 at digit 762", caption: "Four-line: LZ and LZ64 (3× speed)" }
  - { src: /assets/img/psion/cruncher/play-xp.gif, alt: "e to 1,000 digits on the two-line screen: the size, the estimate, the status line counting up, OK, and the digits in the viewer", caption: "Two-line: CM, XP and LA (XP 32K) (3× speed)", lines: 2 }
models:
  cm:   { state: limited }
  xp:   { state: works }
  la:   { state: works }
  lz:   { state: works }
  lz64: { state: works }
limited_note: "The CM has no swap mode, and room for 2,760 digits of pi and 5,304 of e."
memory_note: "The limits come from the memory free when it starts: the tables below are for a machine with nothing else in memory."
tested_on: "the Jape emulator: CM, XP, LA (XP 32K), LZ and LZ64, and all 29 Organiser ROMs it has, with every digit checked against a separate model of the arithmetic."
screenshots:
  - { src: /assets/img/psion/cruncher/lz64-running.png, alt: "Four-line screen: Pi 10,000 digits, step 1 of 4, 16 atan 1/5, a progress bar at 59%, 1 hour 10 minutes gone and 48 minutes 15 seconds left", screen: "Pi to 10,000 digits, an hour in" }
  - { src: /assets/img/psion/cruncher/lz64-estswap.png, alt: "Four-line screen: e 75,216 digits, About 48h09, Verify off, Swap on", screen: "e on a Rampak: 75,216 digits in two days" }
  - { src: /assets/img/psion/cruncher/lz64-finished.png, alt: "Four-line screen: Pi 1,000 digits, Time 1m13s, Check OK to 1,000, EXE=view MODE=menu", screen: "Finished and checked" }
  - { src: /assets/img/psion/cruncher/lz64-feynman.png, alt: "Four-line screen: the viewer from digit 761 of pi, 49999 99837, where Find put it", screen: "Find 999999: digit 762" }
  - { src: /assets/img/psion/cruncher/lz64-counts.png, alt: "Four-line screen: how many of each digit in the first 1,000 of pi: 0: 93, 1: 116, 2: 103, 3: 102, 4: 93, 5: 97, 6: 94, 7: 95", screen: "Counts" }
  - { src: /assets/img/psion/cruncher/lz64-menu.png, alt: "Four-line screen: the menu: Pi, E, Root2, Root3, Root5, Phi, Ln2, Ln10, View, Bench, Stress, Setup", screen: Menu }
  - { src: /assets/img/psion/cruncher/xp-running.png, alt: "Two-line screen: Pi 10,000, step 1 of 4, 62%, 1 hour 10 minutes gone and 42 minutes 6 seconds left", screen: "Two-line: running", lines: 2 }
  - { src: /assets/img/psion/cruncher/xp-viewer.png, alt: "Two-line screen: the viewer: digits 1 to 20 of pi, 1415926535 and 8979323846", screen: "Two-line: the viewer", lines: 2 }
changelog: []
---

## About

The Psion Cruncher works out pi, e, the square roots of 2, 3 and 5, the golden ratio, ln 2 and ln 10 to thousands of digits, in the spirit of [y-cruncher](https://www.numberworld.org/y-cruncher/) on a PC. Pick a constant and a size: it says how long the run will take, shows a status screen while it works, and at the end checks every 1,000 digits against a table on its pack. With Verify on, it works the constant out again by a second, different formula and compares.

It runs on every Organiser II, CM to LZ64, all in 6303 machine code; OPL only starts it. With a Rampak in a slot, swap mode keeps the numbers on the pack instead of in memory, for e and the roots to 75,000 digits.

It shares its tools with [BigNum](/psion/bignum/), the big-number calculator.

## Where it has got to

Version 0.9 (27 November) has everything in the design's first version: the eight constants, each with its own formula and a second one for Verify; any size from 12 digits to the machine's limit; an estimate of the time before a run and the time left during it; the check table; a viewer with Go to, Find and Counts; saving results and viewing them later; swap mode on one Rampak or two; checkpoints; a benchmark and a stress test. It has passed on all 29 Organiser ROMs in the emulator.

Harder constants, such as Euler's gamma, Catalan's constant and zeta(3), are not in this version, and nor are hex digits or sending digits to a PC.

## Limits

The most digits there is room for, which the program offers as `Max` when it asks for a size. In memory:

| | CM | XP | LA (XP 32K) | LZ | LZ64 |
|---|---|---|---|---|---|
| Free at the menu | 6,533 | 14,717 | 22,908 | 22,252 | 22,275 |
| Pi, ln 2, ln 10 | 2,760 | 12,612 | 22,476 | 21,684 | 21,708 |
| e, the roots, the golden ratio | 5,304 | 24,396 | 43,512 | 41,976 | 42,036 |

With Verify on, e can be checked by its second formula up to about half these sizes; above that it is checked by the same series taken two terms at a time. Checkpoints on A: halve the limit, because the copy needs the room; on a Rampak they do not.

Swap mode with one 32K Rampak in C:, with the time the program estimates for that size (48h09 is 48 hours 9 minutes, 7d17 is 7 days 17 hours). Pi and the logs keep their sum in memory and only one number on the pack, so memory still sets their limit:

| | XP | LA (XP 32K) | LZ | LZ64 |
|---|---|---|---|---|
| Pi | 19,188 · 10h06 | 38,916 · 41h20 | 37,332 · 38h12 | 37,392 · 38h17 |
| ln 2 | 19,188 · 8h35 | 38,916 · 34h54 | 37,332 · 32h15 | 37,392 · 32h20 |
| ln 10 | 19,188 · 10h23 | 38,916 · 42h09 | 37,332 · 38h58 | 37,392 · 39h04 |
| e | 75,216 · 48h09 | 75,216 · 48h09 | 75,216 · 48h09 | 75,216 · 48h09 |
| Root 2 | 75,216 · 81h51 | 75,216 · 81h51 | 75,216 · 81h51 | 75,216 · 81h51 |
| Root 3 | 75,216 · 82h08 | 75,216 · 82h08 | 75,216 · 82h08 | 75,216 · 82h08 |
| Root 5 | 75,216 · 76h07 | 75,216 · 76h07 | 75,216 · 76h07 | 75,216 · 76h07 |
| Golden ratio | 75,216 · 76h08 | 75,216 · 76h08 | 75,216 · 76h08 | 75,216 · 76h08 |

With more pack room, e, the roots and the golden ratio go further:

| | e | Root 2 | Root 3 | Root 5, golden ratio |
|---|---|---|---|---|
| Two 32K Rampaks, the program on one of them | 78,204 · 51h55 | 78,204 · 88h29 | 78,204 · 88h47 | 78,204 · 82h17 |
| 64K free: a 64K RAM pack, or two empty Rampaks with the program on A: of an LZ64 | 151,056 · 7d17 | 130,056 · 10d04 | 129,444 · 10d03 | 144,228 · 11d15 |

Beyond 64K of room nothing more is used: a number is at most 65,000 bytes, about 151,000 digits of e, because its length and every position in it are 16 bits. The roots stop sooner, where their divisors outgrow 16 bits.

## Run times

The program's own estimates, in memory. Every model has the same processor at the same speed, so the times are the same on all of them; a model with less memory stops sooner. Whole runs in the emulator came within 2% of these.

| | 1,000 digits | 5,000 | 10,000 | At the LZ64's limit | 10,000 with Verify |
|---|---|---|---|---|---|
| Pi | 71 s | 28 min | 1.9 h | 8.9 h | 4.0 h |
| e | 23 s | 7 min | 25 min | 6.4 h | 55 min |
| Root 2 | 27 s | 10 min | 38 min | 11.3 h | 1.6 h |
| Root 3 | 27 s | 10 min | 38 min | 11.3 h | 1.5 h |
| Root 5, golden ratio | 25 s | 9 min | 35 min | 10.3 h | 1.6 h |
| ln 2 | 63 s | 25 min | 1.7 h | 8.0 h | 3.7 h |
| ln 10 | 73 s | 30 min | 2.0 h | 9.3 h | 4.6 h |

The time grows with the square of the digits: twice the digits take four times as long.

## Technical notes

- The methods are those of the 1960s and 1970s, when computers were this size: every step combines a long number with a short one in a single pass. Pi is Machin's 16 atan(1/5) − 4 atan(1/239), verified by Gauss's three-term formula; ln 2 and ln 10 are sums of atanh(1/x), and each verifies the other's formula. e and the roots are nested series: each root comes from a near miss such as 99² = 2 · 70² + 1, which gains about four digits a term.
- e is verified by the series for 1/e: the two are multiplied, column by column, and the product must come to 1.
- The check table holds a 16-bit check of every 1,000 digits, 1,842 bytes in all, made from two independent sources of digits that agree.
- The estimate goes through every pass the run will make, so it is right to about 1%.
- Dividing a long number takes 82 processor cycles a byte by a divisor under 256, and 145 by a larger one. Dividing by multiplying with a reciprocal was tried and measured slower.
- The pack holds one file of 31,102 bytes, the kernel, the check table, Help and 28 overlays, read from the pack as they are wanted; 3,973 bytes stay in memory. With the launcher it takes 31,354 bytes of a 32K Datapak, which stays in the Organiser while it runs.
- In swap mode a number is kept on the Rampak in blocks of 250 bytes. A block takes 20 ms to read and 79 ms to write, so four steps are done on each block while it is in memory, and the pack is read and written once for all four. Swap mode needs ROM 3.0 or later: the 2.4 and 2.6 ROMs know no Rampaks.
