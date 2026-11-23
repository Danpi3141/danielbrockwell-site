# danielbrockwell-site

Daniel Brockwell's website: Psion Organiser II programs with downloads, Android and personal projects, About, CV and Contact. Static, built with Eleventy 3, hosted on Cloudflare Workers static assets. No cookies; Cloudflare Web Analytics counts visits on the live build.

## Commands

| Command | Does |
|---|---|
| `npm install` | Installs Eleventy and html-validate (once) |
| `npm run dev` | Local preview that reloads as you edit |
| `npm run build` | Builds the site into `_site/` |
| `npm run check` | After a build: checks every internal link, the 50 KB page budget, no stray email addresses or phone numbers, that every page's JSON-LD parses and that the links in llms.txt, the feed and the sitemap resolve, then validates the HTML |
| `npm run cv-pdf` | After a build: prints the CV page to `src/downloads/cv/daniel-brockwell-cv.pdf` with headless Chrome or Edge. After any CV change run `npm run build && npm run cv-pdf && npm run deploy` |
| `npm run package` | Makes the Psion release files (below) |
| `npm run deploy` | Builds, runs the checks, and deploys to Cloudflare if they pass (needs `npx wrangler login` once) |

## Adding a Psion program

Add one Markdown file to `src/psion/programs/`. Its file name is the address: `chess.md` is `/psion/chess/`. The overview, the home page and the All downloads table update themselves. Required fields: `title`, `category` (game or utility), `status` (released, in-use, ongoing, working-build, in-development, planned, exploring), `summary` (120 characters at most), `updated`, and `models` with a `state` (works, no, untested) and an optional `note` for each of cm, xp, la, lz and lz64. Optional: `pack`, `needs`, `licence`, `files`, `source`, `screenshots`, `tested_on`, `changelog`, `lcd_name` (a shorter name for the LCD panel on its card), `public: false` (left out of the site) and `draft: true` (left out of the live build only).

The build stops if a required field is missing, a value is not in its list, or a listed file or screenshot does not exist.

## Downloads

Each released program offers two files, listed under `files` with a `kind`:

- `kind: build`: `<slug>-<version>.opk`, the pack image.
- `kind: source`: `<slug>-<version>-source.zip`, source + build. It is laid out like the PsionII folder so it builds as it is: `Programs/<Folder>/` is the program's git repo at HEAD plus the built pack, `Tools/` is the shared Tools repo at HEAD, with `LICENSE` (MIT) and `RELEASE.txt` at the top.

`python -I tools/package_psion.py` writes both into `src/downloads/psion/<slug>/` from `~/PsionII`. It stops if a repo has uncommitted changes, and it never overwrites a released file with different bytes: a new build needs a new version in `RELEASES`. The zip is reproducible (sorted entries, one fixed date), so running it again gives the same SHA-256. The page reads each file's size and SHA-256 from the file at build time, so the page cannot disagree with the download.

When a program's repo is public, set `source:` to its address and the Source block links to it instead.

## Screenshots

Four-line and two-line LCD screenshots come from the emulator at 4 pixels a dot and are shown at half size. `node tools/make_share.mjs` makes `src/assets/img/share.png`, the 1200 by 630 image shown when a page is shared.

## For search engines, feed readers and LLM agents

All of these are built from the same front matter as the pages (code in `lib/machine.js`), so they cannot disagree with them:

- **JSON-LD** in every page head: the WebSite, the Person (in full on Home, About and CV, from `src/_data/person.json`), the page itself, a SoftwareApplication for each program and Android app (version, platform, download, size, licence), a CreativeWork with its sources for each personal project, and the breadcrumb trail.
- **`/llms.txt`** (`src/llms.11ty.js`): the whole site in one Markdown file. It opens in the llmstxt.org format (who Daniel is, every page with a one-line note), then gives the full text of every page, each program's facts (models, memory, downloads with SHA-256, changelog) first. `/llms-full.txt`, its old second file, redirects to it.
- **`/feed.xml`** (`src/feed.11ty.js`): RSS 2.0 of every program and project, newest `updated` first; an entry comes back when its `updated` changes.
- **`/sitemap.xml`**: each page's last change is the newest of its `updated`, its source file's last commit (today if it has uncommitted changes), and for a section page the `updated` of every entry it lists.

`src/_data/person.json` repeats facts from the CV (role, degree, records): change it when the CV changes. An Android app's `version` is front matter, and its page's Current version line reads it.

## Deploying

Live at https://danielbrockwell.uk. `wrangler.jsonc` attaches the bare domain and www as custom domains and turns workers.dev and preview URLs off, so the site has one address; a Redirect Rule on the zone (in the Cloudflare dashboard, not in this repo) sends www to the bare domain. Deploys run from this machine with `npm run deploy`.

The repo is on Forgejo (`origin`) with a public backup on GitHub (Danpi3141/danielbrockwell-site); `git push` sends to both.

`wrangler.jsonc` serves `_site/` with Cloudflare's own 404 page handling and trailing-slash folders. Cloudflare's build command is `npx @11ty/eleventy`, its deploy command `npx wrangler deploy`. `src/_headers` sets the security headers, sends downloads as attachments, and marks the style guide as not indexed.

## Still to do

- The pixel font: Matrix Sans, self-hosted in `src/assets/fonts/`, once confirmed. Until then the wordmark and LCD text use the monospace fallback.
