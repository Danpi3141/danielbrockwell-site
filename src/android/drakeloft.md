---
title: Drakeloft
section: android
category: game
status: in-development
summary: "A dragon-keeping game for Android: hatch, breed and battle 112 dragons on floating isles, offline, with no adverts."
updated: 2026-11-18
offers_download: true
buildLabel: "Build: APK"
clips:
  - { src: /assets/video/drakeloft.mp4, poster: /assets/img/android/drakeloft/play.png, alt: "The isle map panning across lofts, gardens and dragons, then a battle: Hearthkin beats a team of three with Wing Buffet and Furnace Breath, ending on the Victory card", caption: "Across the isles, then a Ladder battle won with three knockouts (25 seconds, no sound; the battle is sped up by a quarter). Recorded from a debug build with a test save, played by a script." }
screenshots:
  - { src: /assets/img/android/drakeloft/isle.png, alt: "The isle: a stone loft with the dragon Cobble beside the hatchery, with gold, food and gems along the top", scale: 2 }
  - { src: /assets/img/android/drakeloft/hatched.png, alt: "A newly hatched dragon, Cobble, a common stone dragon, with buttons to place or sell it", scale: 2 }
  - { src: /assets/img/android/drakeloft/build.png, alt: "The Build menu open on Lofts: Stone loft for 100 gold, with Ember, Tide, Bloom and Storm lofts opening at higher levels", scale: 2 }
---

<div class="callout"><p>Drakeloft is an unofficial remake of Dragon City. It is not affiliated with that game or its owners, and uses only my own art and code.</p></div>

## What it is

Drakeloft is a dragon-keeping game for Android, played offline and held sideways. You hatch dragons on floating isles, feed them, breed new kinds, and work towards collecting all 112 in the Almanac. Teams of three go into turn-based fights.

There is no shop, no adverts, no account and no network: every gem is earned by playing.

## What I built

- **Kotlin and Jetpack Compose**, about 135 source files, with 151 files of JVM tests.
- **The game's systems:** the isles and their buildings, feeding and levelling, breeding, the Almanac, turn-based battles, daily goals, sound and weather.
- **A map that runs at the screen's full refresh rate**, 120 frames a second on a 120 Hz phone, with a battery saver that holds it to 30 and rests it when idle.
- **Runs on Android 7.0 and later**, with an older path for each Android 8 feature, tested both ways.
- **Separate debug, QA and release builds** that install side by side with their own saves, and a release check that every build for the phone must pass.

## How it was made

I wrote a spec before writing the app, then built it milestone by milestone against it.

## Status and what is next

The APK's version, size and licence line are still to decide, so there is no download yet. Once it is released it will appear below, with short steps for installing an APK from outside the Play Store.
