---
title: BigNum
category: utility
status: working-build
summary: "A big-number calculator modelled on YAFU: exact arithmetic, primality proofs, and factoring up to a quadratic sieve."
updated: 2026-11-25
pack: 64K
needs: "56,475 bytes: one 64K Datapak serves every model, and stays in the Organiser while BigNum runs. In an emulator, load the pack image into slot B. On a real Organiser, load the Organiser files zip with RPBOOT."
licence: MIT
animations:
  - { src: /assets/img/psion/bignum/play-lz64.gif, alt: "BigNum on the four-line screen: FACTOR(2**64+1) is typed in, trial division and a prime check run, the quadratic sieve counts its relations and combines them, and it shows the two prime factors 274177 and 67280421310721", caption: "Four-line: LZ and LZ64 (3× speed)" }
  - { src: /assets/img/psion/bignum/sieve-lz64.gif, alt: "The quadratic sieve factoring 2**101-1: the relations count up to 142, they are combined, and the factors of 13 and 18 digits appear", caption: "The sieve factoring 2**101-1 (10× speed)" }
  - { src: /assets/img/psion/bignum/play-cm.gif, alt: "BigNum on the two-line screen: FACTOR(FACT(25)+1) is typed in, and it shows 401 and a 23-digit probable prime, one factor to a page", caption: "Two-line: CM, XP and LA (XP 32K)", lines: 2 }
models:
  cm:   { state: limited, free: 5620 }
  xp:   { state: works, free: 13200 }
  la:   { state: works, free: 17400 }
  lz:   { state: works, free: 17400 }
  lz64: { state: works, free: 17400 }
limited_note: "The CM runs a reduced BigNum: numbers to 616 digits, no sieve, no saving or resuming, and a shorter entry line."
memory_note: "Free memory as the Organiser's FREE reports it, measured in the emulator: enough for everything that model can usually do. With less, BigNum still starts, with smaller limits, down to 5,620 bytes on any model."
tested_on: "the Jape emulator: CM, XP, LA (XP 32K), LZ and LZ64, and all 29 Organiser ROMs it has, with the answers checked against a PC. It has had some testing on a real LZ64."
screenshots:
  - { src: /assets/img/psion/bignum/lz64-factors.png, alt: "Four-line screen: 2**64+1 = P6 274177, P14 67280421310721, 2 factors in 35 seconds", screen: "Factors: P marks a proven prime, with its digits" }
  - { src: /assets/img/psion/bignum/lz64-sieve.png, alt: "Four-line screen: the quadratic sieve on a 31-digit number with 132 primes, 60 of 142 relations found, 47%, 1 minute 5 seconds left, the whole job about 3 minutes", screen: "The sieve running" }
  - { src: /assets/img/psion/bignum/lz64-save.png, alt: "Four-line screen: 2**168-1 = P1 3^2, P1 5, and the question Save on A, B, C?", screen: "Saving the factors of 2**168-1" }
  - { src: /assets/img/psion/bignum/lz64-proved.png, alt: "Four-line screen: 2**107-1, P33 PROVED by N+1, 100% of N+1 factored, C=certificate", screen: "A primality proof" }
  - { src: /assets/img/psion/bignum/lz64-digits.png, alt: "Four-line screen: the first 60 of the 664 digits of 2**2203-1", screen: "The digits of 2**2203-1" }
  - { src: /assets/img/psion/bignum/cm-factor.png, alt: "Two-line screen: PRP23, factor 2 of 2, 3868132180381 and dots", screen: "Two-line: CM, XP and LA (XP 32K)", lines: 2 }
  - { src: /assets/img/psion/bignum/cm-na.png, alt: "Two-line screen on a CM: NOT AVAILABLE, with QS(2**64+1) on the entry line", screen: "No sieve on the CM", lines: 2 }
files:
  - { file: bignum-0.9.8-psion.zip, kind: psion, version: "0.9.8", date: 2026-11-25 }
  - { file: bignum-0.9.8.opk, kind: build, version: "0.9.8", date: 2026-11-25 }
  - { file: bignum-0.9.8-source.zip, kind: source, version: "0.9.8", date: 2026-11-25 }
  - { file: bignum-0.9.7-psion.zip, kind: psion, version: "0.9.7", date: 2026-11-25 }
  - { file: bignum-0.9.7.opk, kind: build, version: "0.9.7", date: 2026-11-25 }
  - { file: bignum-0.9.7-source.zip, kind: source, version: "0.9.7", date: 2026-11-25 }
  - { file: bignum-0.9.5-psion.zip, kind: psion, version: "0.9.5", date: 2026-11-25 }
  - { file: bignum-0.9.5.opk, kind: build, version: "0.9.5", date: 2026-11-25 }
  - { file: bignum-0.9.5-source.zip, kind: source, version: "0.9.5", date: 2026-11-25 }
source: false
changelog:
  - { date: 2026-11-25, version: "0.9.8", change: "The sieve no longer stalls: in 0.9.5 and 0.9.7 some numbers of 14 to 17 digits, or a part that size left over in a longer one, took minutes or never finished (answers were never wrong). S on the factors' screen saves them, except on the CM. A power follows its prime, as in 3^2. Rho's time left is right for small numbers, and it is only tried where it pays." }
  - { date: 2026-11-25, version: "0.9.7", change: "Less memory needed: it starts from 5,620 bytes free (5,990 before), the larger limits also start lower, and every model has 93 bytes more for numbers. LLT of a composite number gives 0 at once, however large." }
  - { date: 2026-11-25, version: "0.9.5", change: "Working build, the first released: tested in the emulator on every model and all 29 Organiser ROMs." }
---

## About

A calculator for whole numbers of up to 2,466 digits. Type a line such as `2**127-1`, `FACTOR(2**64+1)` or `P=NEXTPRIME(10**30)` and press <kbd>EXE</kbd>: it evaluates expressions, tests numbers for primality, proves primes with a certificate, and factors numbers by a chain of methods that ends in a self-initialising quadratic sieve.

It follows [YAFU](https://github.com/bbuhrow/yafu), the PC factoring program, as far as an Organiser allows. It is all 6303 machine code, read from the pack in pieces as they are wanted, and the same pack serves every Organiser II model.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a 64K pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:BIGNUM` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:BIGNUM`.

Leave the pack in while it runs. If there is too little memory, BigNum says how many more bytes it needs.

## Limits by free memory

The free memory when BigNum starts decides its limits, not the model. An empty CM has about 6,500 bytes free, an XP 14,700, and an LA (XP 32K), LZ or LZ64 over 22,000.

| Free memory | Largest number | Sieve | Save and resume |
|---|---|---|---|
| 17,400 or more | <span class="tip" tabindex="0" aria-describedby="size-17400">~2,466 digits<span class="sr">. </span><span class="tip-text" role="tooltip" id="size-17400">Every 2,466-digit number, and 2,467-digit ones up to 2<sup>8192</sup> − 1, about 1.09 × 10<sup>2466</sup></span></span> | <span class="tip" tabindex="0" aria-describedby="sieve-55">~55 digits<span class="sr">. </span><span class="tip-text" role="tooltip" id="sieve-55">Every 55-digit number, and 56-digit ones up to 2<sup>184</sup> − 1, which is <span class="tip-num">24,<wbr>519,<wbr>928,<wbr>653,<wbr>854,<wbr>221,<wbr>733,<wbr>733,<wbr>552,<wbr>434,<wbr>404,<wbr>946,<wbr>937,<wbr>899,<wbr>825,<wbr>954,<wbr>937,<wbr>634,<wbr>815</span></span></span> | Yes |
| 13,200 to 17,399 | <span class="tip" tabindex="0" aria-describedby="size-13200">~2,466 digits<span class="sr">. </span><span class="tip-text" role="tooltip" id="size-13200">Every 2,466-digit number, and 2,467-digit ones up to 2<sup>8192</sup> − 1, about 1.09 × 10<sup>2466</sup></span></span> | <span class="tip" tabindex="0" aria-describedby="sieve-50">~50 digits<span class="sr">. </span><span class="tip-text" role="tooltip" id="sieve-50">Every 50-digit number, and 51-digit ones up to 2<sup>168</sup> − 1, which is <span class="tip-num">374,<wbr>144,<wbr>419,<wbr>156,<wbr>711,<wbr>147,<wbr>060,<wbr>143,<wbr>317,<wbr>175,<wbr>368,<wbr>453,<wbr>031,<wbr>918,<wbr>731,<wbr>001,<wbr>855</span></span></span> | Yes |
| 11,340 to 13,199 | <span class="tip" tabindex="0" aria-describedby="size-11340">~616 digits<span class="sr">. </span><span class="tip-text" role="tooltip" id="size-11340">Every 616-digit number, and 617-digit ones up to 2<sup>2048</sup> − 1, about 3.23 × 10<sup>616</sup></span></span> | <span class="tip" tabindex="0" aria-describedby="sieve-44">~44 digits<span class="sr">. </span><span class="tip-text" role="tooltip" id="sieve-44">Every 44-digit number, and 45-digit ones up to 2<sup>148</sup> − 1, which is <span class="tip-num">356,<wbr>811,<wbr>923,<wbr>176,<wbr>489,<wbr>970,<wbr>264,<wbr>571,<wbr>492,<wbr>362,<wbr>373,<wbr>784,<wbr>095,<wbr>686,<wbr>655</span></span></span> | Yes |
| 5,620 to 11,339 | <span class="tip" tabindex="0" aria-describedby="size-5620">~616 digits<span class="sr">. </span><span class="tip-text" role="tooltip" id="size-5620">Every 616-digit number, and 617-digit ones up to 2<sup>2048</sup> − 1, about 3.23 × 10<sup>616</sup></span></span> | None | No |

**The CM's version is much reduced.** It has about 2K for numbers, so there is no sieve, and SAVE, LOAD, RESUME, LOG and checkpoints are left out, with one earlier line kept for recall. Everything else works: arithmetic, functions, primality tests and proofs, and factoring by trial division, rho, P−1, P+1 and elliptic curves. Any other model with that little memory free has the same limits.

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

## Manual

Type a line and press <kbd>EXE</kbd>. `P=NEXTPRIME(10**30)` stores the answer in a variable, and ANS is the last one.

| Where | Key | Action |
|---|---|---|
| Entry line | <kbd>UP</kbd> <kbd>DOWN</kbd> | Earlier lines |
| | <kbd>MODE</kbd> | The menu: Insert (lists the functions), Vars, Set, Resume, Bench, Log, Quit |
| | <kbd>ON/CLEAR</kbd> | Clears the line; on an empty line, asks whether to leave |
| Results | <kbd>UP</kbd> <kbd>DOWN</kbd> | The previous or next page or factor |
| | <kbd>EXE</kbd> | All the digits of a number too long for its line |
| | <kbd>P</kbd>, <kbd>C</kbd> | Prove the first probable prime; show a proved prime's certificate |
| | <kbd>V</kbd> and a letter | Keep the number shown in that variable |
| | <kbd>M</kbd> | How the factor shown was found |
| | <kbd>S</kbd> | Save the factors: then <kbd>A</kbd>, <kbd>B</kbd> or <kbd>C</kbd> adds them to the file BIGLOG there, and LOG shows it (not on the CM) |
| Running | <kbd>ON/CLEAR</kbd> | Pause: <kbd>C</kbd> continue, <kbd>S</kbd> skip to the next method, <kbd>K</kbd> keep and stop, <kbd>A</kbd> abandon |
| | <kbd>S</kbd> | Skip to the next method |

A long job shows what it is doing, how far it has got and the time left. **Keep and stop** writes it to A: or a pack, and RESUME carries it on another day. `SET KEEP B:` chooses the device, and then the job is also kept every half hour (on a Datapak, only the sieve's relations, to save its space).

`SET` alone lists the settings: <kbd>EXE</kbd> puts the one shown on the entry line to be changed.

| Setting | Default | |
|---|---|---|
| TDIV | 10000 | Trial division's limit, up to 65535 |
| RHOIT | Auto | Maximum rho steps |
| PM1B1, PP1B1 | Auto | The bounds of P−1 and P+1 |
| ECMB1, CURVES | Auto | The bound and number of elliptic curves |
| PROOF | OFF | ON: FACTOR proves each prime it reports |
| KEEP | OFF | Where jobs are kept: A:, B: or C: |
| EVERY | 30 | Minutes between saves |
| LOG | OFF | Where finished results are written |
| BEEP | ON | Beep when a job of over a minute ends |

`SAVE A,"NAME"` writes variable A to a file on A: and `LOAD A,"NAME"` reads it back; `"B:NAME"` uses a pack.

## How long it takes

Measured in the emulator, at an Organiser's speed:

| Job | LZ64 | CM |
|---|---|---|
| Is 2<sup>127</sup> − 1 prime? (39 digits) | 6 seconds | 6 seconds |
| Is 2<sup>521</sup> − 1 prime? (157 digits) | 2 min 52 s | 3 min 23 s |
| Is 2<sup>2047</sup> + 1919 prime? (617 digits) | 6 h 13 min | 7 h 13 min |
| Factor 2<sup>101</sup> − 1 (31 digits) | 4 to 5 min | 5 h 29 min |
| Factor 2<sup>128</sup> + 1 (39 digits) | ~33 min | ~2 days\* |
| Factor 40 digits into 20 and 20 | ~40 min | ~5 days\* |
| Factor 48 digits into 24 and 24 | 9 to 21 h | months\* |

\* Estimate.

The time depends on the number as well as its length. On the LZ64, twelve 40-digit numbers took from 25 to 52 minutes, and eight 48-digit numbers from 9 to 21 hours, 15 on average. Going by a model of the sieve on a PC, 50 digits would take one or two days and 55 digits, the limit, about two weeks.

## Free memory and the sieve

The sieve works with a set of small primes, and the memory free when BigNum starts decides how many fit. With fewer, it finds the same factors but takes longer. The four-line progress screen shows how many as **base**.

<div class="table-scroll">

| Primes that fit | 36 digits | 40 digits | 44 digits | 48 digits |
|---|---|---|---|---|
| 230 (empty LZ64) | 1 | 1 | 1 | 1 |
| 200 | 1 | 1.05 | 1.3 | 1.4 |
| 160 | 1.1 | 1.4 | 1.9 | 2 |
| 120 | 1.5 | 2 | 4 | 6\* |
| 106 | 1.6 | 2.6 | 5 | 10\* |
| 80 | 2.3 | 5 | 20\* | – |

</div>

Times as long as on an empty LZ64. \* Estimate.

A longer number needs more memory for each prime: about 39 bytes at 36 digits and 50 at 48. So an empty XP fits 132 primes for 36 digits, 118 for 40, 107 for 44 and 97 for 48. Numbers kept in variables leave less room for primes; CLR clears them before a long job.

## Technical notes

- Numbers below 2<sup>64</sup> that pass the prime test are certain to be prime. Above that, ISPRIME finds a probable prime (marked PRP) and PROVE proves it when enough of N−1 or N+1 can be factored.
- The sieve uses up to 240 primes, a multiplier, and one large prime in each relation.
