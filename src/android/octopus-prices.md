---
title: Octopus Prices
section: android
category: utility
status: in-use
summary: "A companion app for Octopus Energy's Agile tariff: half-hourly prices, my own price forecast, usage, costs and carbon."
updated: 2026-10-25
screenshots:
  - { src: /assets/img/android/octopus-prices/rates.png, alt: "The Rates screen showing London's public Agile prices: the current rate of 62.41p per kWh with its carbon intensity, and an appliance finder saying a two-hour run is cheapest at 02:00", scale: 2 }
  - { src: /assets/img/android/octopus-prices/chart.png, alt: "The 48-hour chart of upcoming Agile rates, from an evening peak of about 62p down to around 30p overnight", scale: 2 }
---

## What it is

Octopus Agile sets a new electricity price for every half-hour, published a day ahead at about 4 pm. Octopus Prices is the app I wanted for living on that tariff:

- **Rates:** live half-hourly prices on a 48-hour chart, published and forecast, with a "cheapest time" finder for appliances, the gas rate and carbon intensity.
- **A better forecast** for prices that are not yet published, from National Grid's carbon, wind and solar forecasts plus recent prices. In a backtest its average error was 7.3p, against 11.6p for the usual same-time-of-day average. The app shows its own recent accuracy.
- **Costs:** a daily cost log for electricity and gas, savings against the standard variable tariff for your region, year-to-date reports and a tariff comparison.
- **Day details:** usage against price, half-hour by half-hour, with carbon, baseload and peak, weather and the generation mix.
- **Carbon:** a 10 by 10 chart of where the electricity is coming from, nationally or for your region, for any half-hour.
- **Alerts and a widget:** a daily "new rates are in" alert, price alerts, a live price in the status bar, and a resizable home-screen widget with the next 48 hours.

It is not affiliated with Octopus Energy. The screenshots show the public prices for London, which the app shows before you sign in. The source code is not published.

## What I built

- **Kotlin and Jetpack Compose**, with Hilt, Room and WorkManager, for Android 8.0 and later.
- **Four data sources:** the Octopus Energy API, the National Grid ESO carbon intensity API, Open-Meteo for weather and postcodes.io for regions.
- **Sign in by postcode** for public Agile prices only, or with an Octopus API key for usage and costs. Credentials are stored encrypted, and backup and restore uses a QR code.
- **Tests:** unit tests, lint and Compose UI tests, run by CI on every push.
