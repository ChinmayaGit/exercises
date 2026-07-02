# Exercises Browser

Offline-friendly browser for the [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset).

## Setup

Download the JSON and all GIFs locally:

```bash
npm run download
```

This creates:

- `data/exercises.json` — exercise metadata
- `gifs/` — one GIF per exercise (`0001.gif`, …)

## Run

Serve the folder (required — `file://` cannot load local JSON/GIFs):

```bash
npm run serve
```

Then open the URL shown (usually http://localhost:3000).

## Re-download

The download script skips GIFs that already exist, so you can safely re-run `npm run download` to resume or refresh.
