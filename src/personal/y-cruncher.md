---
title: y-cruncher
section: personal
status: in-development
summary: "Computing mathematical constants to record sizes, including the world record for log(10): 2.5 trillion digits."
updated: 2026-11-22
links:
  - { label: "y-cruncher's records table", url: "https://www.numberworld.org/y-cruncher/" }
  - { label: "Primes: the third-largest known twin primes", url: /personal/primes/ }
---

## World record: log(10) to 2.5 trillion digits

<p class="big-number">2,500,000,000,000 digits</p>

I computed the natural logarithm of 10 to 2,500,000,000,000 decimal digits with y-cruncher, announced in January 2026. It is the current world record in y-cruncher's records table.

| | |
|---|---|
| Constant | log(10) |
| Decimal digits | 2,500,000,000,000 |
| Computation | 166 hours |
| Verification | 147 hours |
| Machine | 2 × Intel Xeon 6230R, 192 GB of memory |

## What it is

y-cruncher is a program for computing constants such as pi, e and logarithms to billions or trillions of digits. A record run is a test of planning as much as of hardware: choosing the formula, fitting the working data into memory and onto disk, keeping a job alive for a week, and then checking the result with a second, independent computation.
