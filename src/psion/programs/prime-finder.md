---
title: Prime finder
category: utility
status: in-development
summary: "Proth, Riesel and Mersenne tests and sieved searches for large primes, in machine code on the LZ and LZ64."
updated: 2026-11-22
pack: 64K
animations:
  - { src: /assets/img/psion/prime-finder/play-lz64.gif, alt: "Prime finder: a Proth test of 3 x 2^189 + 1 is typed in, the squarings count up to 188, and it reports 3*2^189+1 IS PRIME! in 6 seconds", screen: "Four-line (LZ and LZ64)" }
models:
  cm:   { state: no }
  xp:   { state: no }
  la:   { state: no }
  lz:   { state: works, free: 12216 }
  lz64: { state: works, free: 12216 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to run a test and save the result to A:. The menu alone needs 3,188; a small search with its results needs 14,641."
tested_on: "the Jape emulator (LZ and LZ64): single tests, a sieved search and the results checked against the same arithmetic on a PC, and M1279 proved prime in 9 minutes 31 seconds on the LZ64."
screenshots:
  - { src: /assets/img/psion/prime-finder/lz64-menu.png, alt: "Four-line screen: the Prime finder menu: Test, Size, Kfixed, Mersenne, Cullen, Results, Quit", screen: Menu }
  - { src: /assets/img/psion/prime-finder/lz64-search.png, alt: "Four-line screen: a Riesel search mid-test on 3*2^475-1, 46% through with 29 seconds left and 2 primes found so far", screen: "A search running" }
  - { src: /assets/img/psion/prime-finder/lz64-sieve.png, alt: "Four-line screen: sieving a Proth search at n=1024, the current sieving prime 38867 and 1724 candidates left", screen: Sieving }
  - { src: /assets/img/psion/prime-finder/lz64-m1279.png, alt: "Four-line screen: the result of testing 2^1279-1: IS PRIME!, in 9 minutes 31 seconds", screen: "M1279 proved prime" }
changelog: []
---

## About

A prime finder for the LZ and LZ64: Proth, Riesel and Mersenne tests with Karatsuba multiplication and sieving in 6303 machine code, driven from OPL. Test a single number such as 3 · 2<sup>189</sup> + 1, or run a search over a range of exponents: the sieve removes candidates with small factors first, then each survivor is tested, and every result is saved to A: as it goes, so a long search can stop and resume.

It sits beside my [record prime searches](/personal/primes/), and found the same 13 Riesel primes 3 · 2<sup>n</sup> − 1 for n up to 100 as the PC does.

## Where it has got to

Milestones 0 to 6 of the plan are done and tested in the emulator: the PC reference, the squaring routine, Mersenne, Proth and Riesel tests, jobs with checkpoints and resume, the four sieves, and the Karatsuba speed-ups. Still to do: running it on a real Organiser, getting closer to the planned speed at 256 to 1,024 bits, and a few kilobytes more of memory savings.

## Technical notes

- Loaded with RPBOOT, its files need a 64K pack or larger in B: or C:.
- On the LZ64 a result file goes in the extra memory banks first; on the LZ it shares the main memory, which the figures above allow for.
