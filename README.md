# Cask Companion — by Tankyu Distillery

A small, open-source Chrome extension for anyone curious about whisky cask ownership: estimate the angel's share, bottle yield and cost per bottle of a maturing cask, and track your own cask's journey to bottling day.

Made by the team at [Tankyu Distillery (丹丘蒸留所)](https://tankyudistillery.jp) in Higashikawa, Hokkaido — a public-built, private-operate craft spirits distillery at the foot of the Daisetsuzan mountains.

## Features

- **Calculator** — choose a cask type (octave to puncheon), fill strength and climate, and estimate evaporation loss compounding yearly, final ABV, 700 ml bottle yield (cask strength or 46%), and cost per bottle.
- **Climate presets** — maturation in Hokkaido's 66°C annual temperature swing behaves differently from a Scottish dunnage warehouse or a subtropical rickhouse. Presets for all three.
- **My Cask tracker** — enter a fill date and target age; track days matured, days to bottling, and milestones including the three-year JSLMA Japanese whisky standard. All data stays local (`chrome.storage.local`); nothing is collected or transmitted.

## Install

From the Chrome Web Store (link after review), or load unpacked:

1. Clone this repo
2. `chrome://extensions` → enable Developer mode → "Load unpacked" → select the folder

## Why we built this

We run a [Private Cask programme](https://tankyudistillery.jp/en/private-cask) at our distillery in Higashikawa, and the questions prospective owners ask most are exactly what this tool answers: *how much will the angels take in Hokkaido's climate, and how many bottles will I end up with?* The maths deserved to be public.

If you'd rather see a cask warehouse than calculate one, [come visit the distillery](https://tankyudistillery.jp/en/tour) — 15 minutes from Asahikawa Airport, tours from ¥2,000 with a tasting of our gin and new made spirits.

## Licence

MIT. Estimates are for curiosity and planning; real maturation varies with warehouse, wood and weather.
