---
layout: layouts/page.njk
title: CV
section: cv
description: "Daniel Brockwell's CV: portfolio manager in digital assets at Nickel Digital Asset Management, computer science graduate, and builder of the infrastructure behind the work."
---

<div class="print-only cv-print-head">
<p class="cv-name">{{ site.name }}</p>
<p class="small">Portfolio Manager, digital assets · {{ site.email }} · danielbrockwell.uk · {{ site.region }}</p>
</div>

{% if "/downloads/cv/daniel-brockwell-cv.pdf" | fileExists %}<p><a class="button" href="/downloads/cv/daniel-brockwell-cv.pdf" download>Download as PDF</a></p>{% endif %}

## Profile

Portfolio manager at Nickel Digital Asset Management, with nearly five years in digital asset investment. Takes investment and trading ideas from origination to execution for an eight-figure liquid fund. Computer science graduate (2:1, Sheffield) who builds the tools behind the work: a full Ethereum node, on-chain alerting, backtests and market-making bots. Based in the {{ site.region }}.

## Experience

### Portfolio Manager, Nickel Digital Asset Management
<p class="small">November 2022 to present</p>

- Originate investment and trading ideas for an eight-figure long-only liquid digital asset fund, present recommendations for approval and manage their execution.
- Certified under the FCA Certification Regime for client dealing since September 2025 (FCA register reference [DXB01169](https://register.fca.org.uk/s/individual?id=003Sk00000kJM0oIAG)).
- Manage positions and yield strategies, including staking and liquidity provision, weighing liquidity, concentration risk and expected return.
- Set up and maintain a full Ethereum node, giving the fund its own source of on-chain data.
- Built custom on-chain alerting for stablecoin depegs, large withdrawals from protocols and high lending rates. In April 2024 an alert on falling liquidity in Synthetix's sETH wrapper flagged sUSD depeg risk early, and the fund exited its sUSD exposure.
- Use Tenderly to simulate transactions before execution, identifying unexpected asset transfers and suspicious smart contract interactions.
- Backtest other managers' trading strategies to evaluate historical performance, risk and execution assumptions.
- Build and run market-making bots on venues including Hyperliquid, quoting both sides and managing inventory risk, primarily to earn exchange incentives.
- Research DeFi protocols in depth (fee flows, token holder incentives, governance, competitive position) and assess their smart contract, liquidity and governance risk.

### DeFi Analyst, Nickel Digital Asset Management
<p class="small">January 2022 to November 2022</p>

- Identified, developed and executed a profitable trade around the September 2022 Ethereum Merge, exploiting Aave's stale exchange rates on the proof-of-work fork.
- Built financial models linking protocol usage to token valuation.
- Analysed lending, derivatives and infrastructure protocols, and assessed governance proposals for their effect on token holders.

### Intellectual Property Office (the UK Patent Office)
<p class="small">IT Graduate, Existing Systems: September 2021 to December 2021<br>
L2 Applications Support (year in industry): August 2019 to August 2020</p>

- Maintained and supported the internal systems, databases and applications behind the Office's operations.

## Skills

- **Investment and trading:** idea generation and implementation, portfolio construction, protocol and token valuation, market structure, risk assessment (smart contract, liquidity, governance), yield strategies (staking, liquidity provision), market making (two-sided quoting, inventory risk)
- **Data and infrastructure:** Python, SQL, running an Ethereum node, on-chain data and alerting, transaction simulation (Tenderly), backtesting
- **Software engineering:** Kotlin and Jetpack Compose (Android), JavaScript (Node), 6303 assembly and OPL, search algorithms and low-level optimisation
- **Domain knowledge:** DeFi (DEXs, lending, derivatives), staking, governance, stablecoins, market infrastructure

## Selected technical achievements

- [Twin primes](/personal/primes/): found the third-largest known twin primes, 144,654 digits each (January 2026; [PrimePages top 20](https://t5k.org/top20/page.php?id=1)).
- [y-cruncher](/personal/y-cruncher/): the current world record for log(10), 2.5 trillion digits (January 2026; [y-cruncher records](https://www.numberworld.org/y-cruncher/)).
- [Chess](/psion/chess/): a chess engine in 6303 machine code for an 8-bit pocket computer, about 1950 Elo at its top level (estimated against Stockfish).
- [Flagstone](/android/flagstone/) and [Hatchwork](/android/hatchwork/): released Android puzzle games in Kotlin, with solvers that prove every puzzle can be solved without guessing.

## Education

### BSc (Hons) Computer Science (with a Year in Industry), University of Sheffield
<p class="small">September 2017 to June 2021</p>

Upper second-class honours (2:1). Dissertation: an Android app that categorises spending automatically with machine learning, using Open Banking transaction data (merchant name, frequency, timing).

### A levels
Maths (A), Computer Science, Physics, Further Maths.
