---
title: Psion 2FA
lcd_name: Psion 2FA
category: utility
status: working-build
summary: "A two-factor authenticator: the six-digit sign-in codes (TOTP) that phone apps show, on any Organiser II."
updated: 2026-11-24
pack: 16K
needs: "11,627 bytes: one 16K Datapak serves every model. In an emulator, load the pack image into slot B. On a real Organiser, load the Organiser files zip with RPBOOT."
licence: MIT
animations:
  - { src: /assets/img/psion/2fa/play-lz64.gif, alt: "Psion 2FA on the four-line screen: adding an account with the published test key, the Same as phone? check, then the code screen's bar running down until the code changes", screen: "Four-line: LZ and LZ64" }
  - { src: /assets/img/psion/2fa/play-cm.gif, alt: "Psion 2FA on the two-line screen: the code screen counting down to the changeover, with the next code shown", screen: "Two-line: CM, XP and LA (XP 32K)", lines: 2 }
models:
  cm:   { state: works, free: 4607 }
  xp:   { state: works, free: 4607 }
  la:   { state: works, free: 4607 }
  lz:   { state: works, free: 4605 }
  lz64: { state: works, free: 4605 }
memory_note: "Free memory as the Organiser's FREE reports it on a fresh machine, measured in the emulator: enough to add an account, show its codes and save. It keeps 400 bytes spare so it can always start again."
tested_on: "the Jape emulator: CM, XP, LA (XP 32K), LZ and LZ64, and all 29 Organiser ROMs it has; every code checked against an independent RFC 6238 calculation on a PC."
screenshots:
  - { src: /assets/img/psion/2fa/lz64-codes.png, alt: "Four-line screen: three accounts, GITHUB, GOOGLE and AMAZON, each with its six-digit code, and the countdown bar about half full", screen: "Four-line: LZ and LZ64" }
  - { src: /assets/img/psion/2fa/cm-codes.png, alt: "Two-line screen: GITHUB 598 204, and the next code 004 877 in 20 seconds", screen: "Two-line: CM, XP and LA (XP 32K)", lines: 2 }
  - { src: /assets/img/psion/2fa/lz64-key.png, alt: "Four-line screen: adding an account named GITHUB, its 16-character key typed in groups of four", screen: "Adding an account" }
  - { src: /assets/img/psion/2fa/lz64-check.png, alt: "Four-line screen: the current and next codes for GITHUB, and the question Same as phone? Y/N", screen: "Checking against a phone" }
files:
  - { file: 2fa-0.9.1-psion.zip, kind: psion, version: "0.9.1", date: 2026-11-24 }
  - { file: 2fa-0.9.1.opk, kind: build, version: "0.9.1", date: 2026-11-24 }
  - { file: 2fa-0.9.1-source.zip, kind: source, version: "0.9.1", date: 2026-11-24 }
  - { file: 2fa-0.9-psion.zip, kind: psion, version: "0.9", date: 2026-11-23 }
  - { file: 2fa-0.9.opk, kind: build, version: "0.9", date: 2026-11-23 }
  - { file: 2fa-0.9-source.zip, kind: source, version: "0.9", date: 2026-11-23 }
source: false
changelog:
  - { date: 2026-11-24, version: "0.9.1", change: "Leaving with ON/CLEAR goes straight back to the Organiser's menu. Before, holding the key for more than about a quarter of a second left a blank screen (a pattern on the LZ) until another key was pressed. It needs 4 more bytes of memory." }
  - { date: 2026-11-23, version: "0.9", change: "Working build: the whole first version, tested in the emulator on every model and all 29 Organiser ROMs. Real hardware still to come." }
---

## About

An authenticator that shows time-based one-time passwords (TOTP): the six-digit codes many sites ask for at sign-in, which phone apps such as Google Authenticator show. Add an account by typing its key; the Organiser then shows the current code with a bar counting down the 30 seconds, and the next code.

It runs on every Organiser II model from one 16K pack, in 6303 machine code, with SHA-1 and HMAC written for the 6303. Codes depend on the Organiser's clock, so adding an account ends with a check against your phone.

## Install

1. Download the **Organiser files** zip and unzip it.
2. Serve the folder with Psi2Win and run `RPBOOT` on the Organiser: it copies the program onto a pack. [Getting started](/psion/getting-started/) has the steps.
3. **Prog**, **Run**, type `B:TFA` (or the pack you chose) and press <kbd>EXE</kbd>.

In the Jape emulator, use the pack image instead: **Select OPK file**, choose it, **Create**, then **Slot B**, and run `B:TFA`.

If there is too little memory, TFA says how many more bytes it needs. On a two-line model, `B:CLOCK` opens straight on its clock screen, with a year 2000 fix built in (see Credits).

## Manual

| Key on the code screen | Two-line screen | Four-line screen |
|---|---|---|
| <kbd>MODE</kbd>, <kbd>EXE</kbd> | The name menu | The name menu |
| <kbd>UP</kbd> / <kbd>DOWN</kbd> | The previous or next account | The three accounts shown move by one |
| <kbd>RIGHT</kbd> | | The next codes (any key goes back) |
| <kbd>ON/CLEAR</kbd> | Leave (the account is remembered) | Leave |

**The name menu** lists the accounts in the order they were added, then **Tools**: Add, Rename, Delete, Setup and Help. With many accounts it comes in pages: **More** goes to the next.

**Adding an account:** a name of 1 to 8 characters, then the key the site gives you, in the program's own editor: A to Z and 2 to 7, 16 to 64 characters, shown in groups of four. Then it shows the first code and the seconds left. Compare it with your phone: <kbd>Y</kbd> saves the account, <kbd>N</kbd> goes back to the key.

**Setup:** Device (whether the keys are kept on A:, B: or C:), PIN, and Zone (how far the Organiser's clock is from UTC: codes are made from UTC). Two-line models also have Summer and Clock.

**PIN:** 4 to 8 digits, asked at the start and whenever the Organiser switches on inside the program. It switches off after two minutes idle. Help has a self-test.

## Security

An Organiser has no network or radio, so nothing can reach into it. Its weakness is that whoever holds it, or copies its pack, holds the keys.

- **The PIN stops a casual look, not a theft.** It also scrambles the stored keys, but anyone with the pack who has seen one code, and when it was shown, can try every PIN on a PC in under a second. Eight digits are better than four; neither is strong.
- **Deleted keys stay on a Datapak** until the whole pack is wiped under ultraviolet light. Keep the keys in A: or on a Rampak if deleting them matters.
- **Keep each site's backup codes somewhere else**, and add each account to a phone as well. The Psion should never be the only way in.
- **Don't use it for your most important account** until it has run beside a phone for a few weeks.

## Where it has got to

Version 0.9.1 is a working build: the whole first version, tested in the emulator on all five models and all 29 Organiser ROMs it has, including alongside Jaap Scherphuis's Y2000FIX clock patch. Every code it showed matched a PC calculation of the same standard. Still to do on real hardware: how far the clock drifts against a phone, the keyboard feel, pack read times, switching off and on, and signing in to a real site with a code typed from the Organiser.

## Credits

The year 2000 handling comes from **Y2000FIX by [Jaap Scherphuis](https://www.jaapsch.net/psion/)**. A two-line Organiser cannot hold a year after 1999, so Y2000FIX keeps the clock 84 years behind and adds them back when the time is shown: 84 years is three blocks of 28, so the days of the week and the leap years stay right. Psion 2FA uses the same idea for its clock screen and CLOCK, reads a clock set through Y2000FIX correctly, and was tested against the real Y2000FIX in the emulator. Thank you, Jaap.

## Technical notes

- Account keys are kept in `TFAKEY` (on A:, B: or C:, as Setup's Device says), settings in `A:TFASET`.
- It keeps 400 bytes free so that it can always start again; below that, saving a new account says OUT OF MEMORY.
