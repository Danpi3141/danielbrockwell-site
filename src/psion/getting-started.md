---
layout: layouts/page.njk
title: Getting started
section: psion
description: "How to load a Psion Organiser II program onto a real Organiser from its Organiser files zip, or run it in an emulator."
---

Each program's main download is its **Organiser files** zip: the program's translated procedures (`.OB3`) and a loader, **RPBOOT**, which copies them onto a pack over a Comms Link. This is the way to put a program on a real Organiser.

Two other downloads sit beside it: the **pack image** (`.opk`), a copy of a whole pack for emulators and pack writers, and the **source + build** zip, for reading the code or building it again.

## What you need

- An Organiser II that the program supports: see the ticks in its Compatibility table, with the free memory it needs.
- A Comms Link cable, and **Psi2Win** (or Psion's own CL) on the PC to serve the files.
- A pack to copy the program to. A Rampak or Flashpak in B: or C: is best; internal memory (A:) works for the smaller programs. The program's page gives the size.

## Loading a program with RPBOOT

1. Download the program's Organiser files zip and unzip it. You get a folder such as `connect4-1.0-psion`.
2. In Psi2Win, set **Folder** to that folder, pick the Comms Link port in **Setup**, and click **Start!**.
3. If RPBOOT isn't on the Organiser yet: **COMMS**, **RECEIVE**, **PROCEDURE**, type `RPBOOT` and press <kbd>EXE</kbd>. Then **PROG**, **EDIT** `RPBOOT`, and <kbd>MODE</kbd>, **TRAN** to translate it. You only do this once.
4. **PROG**, **RUN** `RPBOOT`. Choose the pack to copy the program to and watch the progress bar until it says, for example, `NOW RUN B:C4`.
5. **PROG**, **RUN**, and type that name, such as `B:C4`.

RPBOOT fetches the right loader for your model by itself: RPLOAD on an LZ or LZ64, RPLOADCM on a CM, XP or LA (XP 32K). It keeps the loader in A:; delete `A:RPLOAD` afterwards if you want the memory back. The zip's `README.txt` repeats these steps and lists its files.

## Running a program in an emulator

1. Download the program's pack image (`.opk`).
2. Open the Jape emulator and choose the model, such as **LZ64**.
3. **Select OPK file**, choose the image, **Create**, then put it in **Slot B**.
4. **Prog**, **Run**, and type the name shown on the program's page, such as `B:C4`.

## Which model do I have?

The model name is on the case. To be sure, ask the Organiser: its model byte is at address −24. Make a one-line procedure: **PROG**, **NEW**, name it `MODEL`, type `PRINT PEEKB(-24) :GET`, translate it, and run it. Then look up the number:

| `PEEKB(-24)` | Model | ROM | RAM | Display |
|---|---|---|---|---|
{%- for m in models_list %}
| {{ m.peek }} | {{ m.name }} | {{ m.rom }} | {{ m.ram }} | {{ m.display }} |
{%- endfor %}

The display is lines × characters: the CM, XP and LA (XP 32K) show 2 lines of 16, the LZ and LZ64 4 lines of 20.

## How much free memory do I have?

Each program's page gives the free memory it needs on each model, as the Organiser's own `FREE` reports it. To see yours, make a one-line procedure: **PROG**, **NEW**, name it `FREEM`, type `PRINT FREE :GET`, translate it, and run it from the main menu.

## Which file do I need?

| You want to | Download |
|---|---|
| Put the program on a real Organiser over a Comms Link | Organiser files (zip) |
| Play in an emulator | Pack image (`.opk`) |
| Write a pack with a pack writer | Pack image (`.opk`) |
| Read or change the code, or rebuild it | Source + build (zip) |

Each download lists its size in bytes and its SHA-256 checksum, so you can check the file arrived whole.

## Troubleshooting

- **"NEEDS" or "OUT OF MEMORY":** the program needs more free memory. Delete files you don't need from A:, or use a model with more memory.
- **RPBOOT stops with an error:** it shows which file failed. Check Psi2Win is still serving the unzipped folder, then run RPBOOT again. On a Datapak each run uses up some of its space, so a Rampak or A: is better for retries.
- **The program isn't found:** check you typed the device letter of the pack it went to, such as `B:` or `C:`.
- **The checksum doesn't match:** download the file again.
