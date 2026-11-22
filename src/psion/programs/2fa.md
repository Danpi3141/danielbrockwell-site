---
title: Psion 2FA
lcd_name: Psion 2FA
category: utility
status: in-development
summary: "A two-factor authenticator: the six-digit sign-in codes (TOTP) that phone apps show, on any Organiser II."
updated: 2026-11-21
pack: 16K
animations:
  - { src: /assets/img/psion/2fa/play-lz64.gif, alt: "Psion 2FA on the four-line screen: adding an account with the published test key, the Same as phone? check, then the code screen's bar running down until the code changes", screen: "Four-line (LZ and LZ64)" }
  - { src: /assets/img/psion/2fa/play-cm.gif, alt: "Psion 2FA on the two-line screen: the code screen counting down to the changeover, with the next code shown", screen: "Two-line (CM, XP and LA)", lines: 2 }
models:
  cm:   { state: works, free: 4603 }
  xp:   { state: works, free: 4603 }
  la:   { state: works, free: 4603 }
  lz:   { state: works, free: 4601 }
  lz64: { state: works, free: 4601 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to add an account, show its codes and save. It keeps 400 bytes spare so it can always start again."
tested_on: "the Jape emulator: CM, XP, LA, LZ and LZ64, and all 29 Organiser ROMs it has; every code checked against an independent RFC 6238 calculation on a PC."
screenshots:
  - { src: /assets/img/psion/2fa/lz64-codes.png, alt: "Four-line screen: three accounts, GITHUB, GOOGLE and AMAZON, each with its six-digit code, and the countdown bar about half full", screen: "Four-line (LZ and LZ64)" }
  - { src: /assets/img/psion/2fa/cm-codes.png, alt: "Two-line screen: GITHUB 598 204, and the next code 004 877 in 20 seconds", screen: "Two-line (CM, XP and LA)", lines: 2 }
  - { src: /assets/img/psion/2fa/lz64-key.png, alt: "Four-line screen: adding an account named GITHUB, its 16-character key typed in groups of four", screen: "Adding an account" }
  - { src: /assets/img/psion/2fa/lz64-check.png, alt: "Four-line screen: the current and next codes for GITHUB, and the question Same as phone? Y/N", screen: "Checking against a phone" }
changelog: []
---

## About

An authenticator that shows time-based one-time passwords (TOTP): the six-digit codes many sites ask for at sign-in, which phone apps such as Google Authenticator show. Add an account by typing its key; the Organiser then shows the current code with a bar counting down the 30 seconds, and the next code.

It runs on every Organiser II model from one 16K pack, in 6303 machine code, with SHA-1 and HMAC written for the 6303. Codes depend on the Organiser's clock, so adding an account ends with a check against your phone.

## Where it has got to

The first version is complete and tested in the emulator on all five models and all 29 Organiser ROMs it has, including with the Y2000FIX clock patch. Every code it showed matched a PC calculation of the same standard. Still to do on real hardware: how far the clock drifts against a phone, the keyboard feel, pack read times, switching off and on, and signing in to a real site with a code typed from the Organiser.

## Technical notes

- Account keys are kept in `A:TFAKEY`, settings in `A:TFASET`.
- It keeps 400 bytes free so that it can always start again; below that, saving a new account says OUT OF MEMORY.
