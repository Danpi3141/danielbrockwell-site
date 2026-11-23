---
layout: layouts/page.njk
title: The Ethereum Merge trade
description: "How a lending position on Aave, built before the Ethereum Merge in September 2022, paid out on the proof-of-work fork, where Chainlink's prices stood still."
---

<p class="small">September 2022 · DeFi Analyst, Nickel Digital Asset Management</p>

On 15 September 2022 Ethereum moved from proof of work to proof of stake. Some miners were set to keep a proof-of-work copy of the chain running (it launched as EthereumPoW), and that copy would start with every balance, loan and smart contract exactly as they stood on Ethereum at the moment of the Merge.

## What would be different on the copy

- **Its prices would freeze.** Chainlink supported only the proof-of-stake chain, so on the fork the price feeds that Aave relies on would stop at their last pre-Merge values. Aave there would go on valuing every asset at its September 2022 price, whatever it was really worth.
- **Most of its tokens would be close to worthless.** USDC and wBTC are backed by assets held off the chain, and their issuers would honour only the proof-of-stake versions. The fork's own ether was the one asset on it that could be traded outside the chain.

## The position

Before the Merge we deposited USDC on Aave and borrowed ETH against it. On Ethereum this was an ordinary loan, repaid in the usual way after the Merge. On the fork it was copied along with everything else, and there it looked very different. We held the fork's copy of the borrowed ether, which could be sold. The debt was owed in a coin we expected to end up close to worthless, on a chain few people would keep using, so there was no reason to repay it.

The catch was the collateral. On the fork our USDC was still locked in Aave behind that loan.

## Freeing the collateral

The frozen prices solved that. wBTC on the fork traded at a steep discount, since only the proof-of-stake version could be redeemed for bitcoin, yet Aave on the fork still valued it at the pre-Merge bitcoin price. We bought fork wBTC cheaply and deposited it as collateral in place of the USDC. At Aave's stale prices the loan was still well covered, so we could withdraw the USDC, convert it into the fork's ether, and sell that ether along with the ether we had borrowed.

The trade was profitable.

## Why it worked

The opportunity was in the plumbing rather than the headlines: which oracles a lending protocol trusts, which tokens can be redeemed on which chain, and what a copied loan is worth when nobody will ever enforce it. Seeing it meant working out how Aave, Chainlink and the token issuers would each behave on the fork. Acting on it meant executing on a brand-new chain.

[Back to the CV](/cv/) · [Home](/)
