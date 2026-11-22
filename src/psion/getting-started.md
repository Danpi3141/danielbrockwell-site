---
layout: layouts/page.njk
title: Getting started
section: psion
description: "How to run Psion Organiser II programs in an emulator or load them onto a real Organiser, and which file you need."
---

Every program here comes as a **pack image** (`.opk`): a copy of a whole Datapak, Rampak or Flashpak. You can run it in an emulator straight away, or put it onto a pack for a real Organiser. Released programs also have a **source + build zip** with the source, the same pack image, and a `psion/` folder for loading over a Comms Link.

## What you need

- For the emulator: a web browser and the Jape emulator, which runs the Organiser's own ROMs.
- For a real Organiser: a model the program supports (see its Compatibility table), and either a pack writer for the image, or a Comms Link cable and a PC program such as Psi2Win to send the files.

## Running a program in an emulator

1. Download the program's pack image.
2. Open Jape and choose the model, such as **LZ64**.
3. **Select OPK file**, choose the image, **Create**, then put it in **Slot B**.
4. On the Organiser's main menu choose **Prog**, then **Run**, and type the name shown on the program's page, such as `B:C4`.

## Loading a program onto a real Organiser

There are two ways:

- **Write the pack image** to a Datapak or Flashpak of the size the program's page gives, with a pack writer.
- **Load it with RPBOOT** over a Comms Link. Download the source + build zip and use the `psion/` folder inside the program's folder. In Psi2Win, set the folder to `psion`, run `RPBOOT` on the Organiser, and it copies the program onto a pack in B: or C:. Delete `A:RPLOAD` afterwards to free its RAM.

## Which model do I have?

The model name is on the case, and the Organiser shows it when it starts.

| Model | RAM | Screen |
|---|---|---|
{%- for m in models_list %}
| {{ m.name }} | {{ m.ram }} | {{ m.screen }} |
{%- endfor %}

## Which file do I need?

| You want to | Download |
|---|---|
| Play in an emulator | The build (pack image, `.opk`) |
| Write a pack with a pack writer | The build (pack image, `.opk`) |
| Load over a Comms Link with RPBOOT | The source + build zip, for its `psion/` folder |
| Read or change the code, or rebuild it | The source + build zip |

Each download lists its size in bytes and its SHA-256 checksum, so you can check the file arrived whole.

## Troubleshooting

- **"NEEDS" or "OUT OF MEMORY":** the program needs more free RAM. Delete files you don't need from A:, or use a model with more memory.
- **The program isn't found:** check you typed the device letter of the slot the pack is in, such as `B:` or `C:`.
- **The checksum doesn't match:** download the file again.
