---
title: BigNum
category: utility
status: in-development
summary: "A big-number calculator modelled on YAFU: exact arithmetic, primality proofs, and factoring up to a quadratic sieve."
updated: 2026-11-25
pack: 64K
animations:
  - { src: /assets/img/psion/bignum/play-lz64.gif, alt: "BigNum on the four-line screen: FACTOR(2**64+1) is typed in, trial division and a prime check run, Pollard's rho counts its steps, and it shows the two prime factors 274177 and 67280421310721", screen: "Four-line: LZ and LZ64" }
  - { src: /assets/img/psion/bignum/sieve-lz64.gif, alt: "The quadratic sieve factoring 2**101-1: the relations count up to 142, they are combined, and the factors of 13 and 18 digits appear", screen: "the sieve on 2**101-1, shown ten times as fast" }
  - { src: /assets/img/psion/bignum/play-cm.gif, alt: "BigNum on the two-line screen: FACTOR(FACT(25)+1) is typed in, and it shows 401 and a 23-digit probable prime, one factor to a page", screen: "Two-line: CM, XP and LA (XP 32K)", lines: 2 }
models:
  cm:   { state: limited, free: 5990 }
  xp:   { state: works, free: 13290 }
  la:   { state: works, free: 17490 }
  lz:   { state: works, free: 17490 }
  lz64: { state: works, free: 17490 }
limited_note: "The CM runs a reduced BigNum: numbers to 617 digits, no sieve, no saving or resuming, and a shorter entry line."
memory_note: "Free memory as the Organiser's FREE reports it, measured in the emulator: enough for everything that model can usually do. With less, BigNum still starts, with smaller limits, down to 5,990 bytes on any model."
tested_on: "the Jape emulator: CM, XP, LA (XP 32K), LZ and LZ64, and all 29 Organiser ROMs it has, with the answers checked against a PC. Its sieve has been seen running on a real LZ64."
screenshots:
  - { src: /assets/img/psion/bignum/lz64-factors.png, alt: "Four-line screen: 2**64+1 = P6 274177, P14 67280421310721, 2 factors in 17 seconds", screen: "Factors: P marks a proven prime, with its digits" }
  - { src: /assets/img/psion/bignum/lz64-sieve.png, alt: "Four-line screen: the quadratic sieve on a 31-digit number with 132 primes, 60 of 142 relations found, 45%, 1 minute 31 seconds left, the whole job about 4 minutes", screen: "The sieve running" }
  - { src: /assets/img/psion/bignum/lz64-proved.png, alt: "Four-line screen: 2**107-1, P33 PROVED by N+1, 100% of N+1 factored, C=certificate", screen: "A primality proof" }
  - { src: /assets/img/psion/bignum/lz64-digits.png, alt: "Four-line screen: the first 60 of the 664 digits of 2**2203-1", screen: "The digits of 2**2203-1" }
  - { src: /assets/img/psion/bignum/cm-factor.png, alt: "Two-line screen: PRP23, factor 2 of 2, 3868132180381 and dots", screen: "Two-line: CM, XP and LA (XP 32K)", lines: 2 }
  - { src: /assets/img/psion/bignum/cm-na.png, alt: "Two-line screen on a CM: NOT AVAILABLE, with QS(2**64+1) on the entry line", screen: "No sieve on the CM", lines: 2 }
changelog: []
---

## About

A calculator for whole numbers of up to 2,467 digits. Type a line such as `2**127-1`, `FACTOR(2**64+1)` or `P=NEXTPRIME(10**30)` and press <kbd>EXE</kbd>: it evaluates expressions, tests numbers for primality, proves primes with a certificate, and factors numbers by a chain of methods that ends in a self-initialising quadratic sieve.

It follows [YAFU](https://github.com/bbuhrow/yafu), the PC factoring program, as far as an Organiser allows. It is all 6303 machine code, read from the pack in pieces as they are wanted, and the same pack is meant for every Organiser II model.

## What each model can do

The free memory when BigNum starts decides its limits, not the model. These are the usual ones:

<div class="table-scroll">

| Model | Largest number | Sieve | Line length | Save and resume |
|---|---|---|---|---|
| CM | 2,048 bits, 617 digits | None | 128 | No |
| XP | 8,192 bits, 2,467 digits | To 50 digits | 254 | Yes |
| LA (XP 32K), LZ, LZ64 | 8,192 bits, 2,467 digits | To 55 digits | 254 | Yes |

</div>

**The CM's version is much reduced.** It has about 2K for numbers, so there is no sieve, and SAVE, LOAD, RESUME, LOG and checkpoints are left out, with one earlier line kept for recall. The arithmetic, the functions, the primality tests and proofs, and the other factoring methods (trial division, rho, P−1, P+1 and elliptic curves) are there. An XP or LZ with little memory free is cut down in the same way, by degrees.

## Functions

| Group | |
|---|---|
| Operators | `**` `*` `/` `%` `+` `-`, brackets, variables A to Z, and ANS |
| Arithmetic | GCD, LCM, MOD, SQRT, NROOT, ABS, SIZE |
| Modular | MODEXP, MODINV, MODSQRT, CRT, JACOBI |
| Primes | ISPRIME, PROVE, NEXTPRIME, PREVPRIME, LLT |
| Factoring | FACTOR runs them all; TRIAL, RHO, PM1, PP1, ECM and QS run one |
| From the factors | PHI, TAU, SIGMA |
| Sequences | FACT, PRIMORIAL, FIB, LUC, BINOM |
| Commands | SET, VARS, CLR, SAVE, LOAD, RESUME, BENCH, LOG, HELP |

A long job shows what it is doing, how far it has got and the time left. <kbd>ON/CLEAR</kbd> pauses it, to continue, skip to the next method, keep it on a pack for another day, or give it up.

## How long it takes

Measured in the emulator, at an Organiser's speed:

| Job | LZ64 | CM |
|---|---|---|
| Is 2<sup>127</sup> − 1 prime? (39 digits) | 5 seconds | 5 seconds |
| Is 2<sup>521</sup> − 1 prime? (157 digits) | 2 min 50 s | 3 min 29 s |
| Is 2<sup>2047</sup> + 1919 prime? (617 digits) | 6 h 13 min | 7 h 23 min |
| Factor 2<sup>101</sup> − 1 (31 digits) | 4 to 5 min | 5 h 36 min |
| Factor 2<sup>128</sup> + 1 (39 digits) | 43 min | about 2 days |
| Factor 40 digits into 20 and 20 | 38 min in the sieve | about 5 days |
| Factor 48 digits into 24 and 24 | 20 to 22 h in the sieve | months |

The CM has no sieve, so it looks for factors with elliptic curves, where luck matters more. Its 5 h 36 min was measured; the longer factoring times are estimates, from the time one curve takes and how many are usually needed.

Beyond 48 digits the sieve's times are estimates from a model of it on a PC: about two days for 50 digits, and three to four weeks for 55, its limit.

## Technical notes

- It needs a 64K pack, in the Organiser while it runs.
- Numbers below 2<sup>64</sup> that pass the prime test are certain to be prime. Above that, ISPRIME finds a probable prime (marked PRP) and PROVE proves it when enough of N−1 or N+1 can be factored.
- The sieve uses up to 240 primes, a multiplier, and one large prime in each relation.
