---
title: Primes
section: personal
status: in-development
summary: "Hunting large primes of special forms, including the third-largest known twin primes: 144,654 digits each."
updated: 2026-11-22
links:
  - { label: "Twin primes: the top 20 (PrimePages)", url: "https://t5k.org/top20/page.php?id=1" }
  - { label: "152748736824915 · 2^480480 − 1 on PrimePages", url: "https://t5k.org/primes/page.php?id=141439" }
  - { label: "Prime finder for the LZ64", url: /psion/prime-finder/ }
  - { label: "y-cruncher: record computations of constants", url: /personal/y-cruncher/ }
---

## The third-largest known twin primes

<p class="big-number">152748736824915 · 2<sup>480480</sup> ± 1</p>

A pair of primes two apart, each 144,654 digits long. They rank third on the PrimePages list of the largest known twin primes, found in January 2026 and proven prime. The PrimePages credit Vink and Brockwell, with TwinGen, NewPGen, the Twin Prime Search and PRST.

## What it is

I search for large primes of special forms: numbers such as k · 2<sup>n</sup> ± 1, which the fastest primality tests can handle. Most of the work is sieving out candidates with small factors, then running long tests on the few that are left.

## On the Organiser

A prime finder for the Psion Organiser LZ64 is in the works: Proth and Lucas-style tests with Karatsuba multiplication and sieving in 6303 machine code, driven from OPL. See its entry in the Psion section.
