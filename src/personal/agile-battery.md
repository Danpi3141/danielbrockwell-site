---
title: Agile battery optimiser
section: personal
status: in-use
summary: "A Raspberry Pi service that charges a home battery when Agile electricity is cheap and runs on it when it's dear."
updated: 2026-11-05
links:
  - { label: "Octopus Agile", url: "https://octopus.energy/smart/agile/" }
---

## What it does

Octopus Agile prices electricity by the half-hour, a day ahead, following the wholesale market: evenings are dear, nights and windy afternoons are cheap, and now and then prices go below zero. An EcoFlow RIVER 3 Plus battery (286 Wh) sits between the mains and the appliances plugged into it.

This service, running on a Raspberry Pi, plans every half-hour: charge from the grid, run the appliances from the battery, or hold. It carries out the plan by setting the battery's backup reserve and charging speed. It has been controlling the battery live since October 2026, after running in simulation first.

The source code is not published.

## How it decides

- **An exact optimiser.** Dynamic programming over the battery's charge, the day's throughput and its mode, slot by slot, across every published price.
- **Real costs, not just prices.** 85% round-trip efficiency, standby draw, a degradation charge for every kWh delivered, at most one full cycle a day, and a minimum net benefit before a plan is worth acting on.
- **Its own forecasts.** Load from the battery's telemetry (the median for each time of day, blending into the live load for the next hour) and solar measured by half-hour.
- **No guessing at prices.** It never plans on prices that are not yet published, and values the energy left at the end of the horizon at a cautious 25th-percentile price.
- **No export.** The battery can only discharge into what the appliances actually draw.
- **Measured against alternatives.** Each plan is compared with a simple threshold strategy and with no battery at all. Reports keep gross benefit, energy cost, assumed degradation and net benefit apart.

## Built to fail safe

Controlling real hardware unattended needs the same habits as an execution system:

- **One writer.** Only the executor sends commands. Each one is range-checked, spaced at least ten minutes apart, rate-limited, and counted as done only when the device's telemetry shows the new value. Three failures in a row lock it out for an hour.
- **Safe by default.** With no current price or telemetry it makes no new decision. Stopping, pausing or an hour without inputs sets and verifies a 50% reserve, and the reserve can never leave 20–90%. So even if the Pi, the wifi or EcoFlow's cloud goes down, the battery never runs flat.
- **Simulation first.** It starts read-only: every write path is blocked unless an authorisation file names that exact device and control.
- **Supervised.** A systemd watchdog is fed only while every worker thread is still ticking. A separate health check every ten minutes restarts the service, within limits, if it is down or stuck. Both were tested by killing and freezing the process on the Pi.
- **Locked down.** No network listeners, a sandboxed service, and secrets passed only as systemd credentials and redacted from every log.

## Beyond price

- **Weather and grid stress.** Met Office warnings and National Grid (NESO) stress notices raise the minimum reserve and start a full charge, with a text message.
- **Octopus Saving Sessions.** It joins Power-downs automatically and runs the appliances from the battery during them. It recommends weekend Happy Hours in the daily email.
- **Power cuts.** It tells a mains cut from a planned discharge using two independent signals, and sends a text and an email when the power goes off and comes back.
- **A daily email.** Once tomorrow's prices are out, usually just before 4 pm, it sends the prices, the planned charge, battery and hold pattern, and the expected saving.

## Built with

Python on a Raspberry Pi, about 8,700 lines. It uses the Octopus Energy API, EcoFlow's MQTT messages over TLS (protobuf), SQLite, systemd and Cronicle. The test suite has 127 tests, all against mocks, so nothing in it can reach Octopus or EcoFlow.
