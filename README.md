# Exercises Browser

Offline-friendly browser for the [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset).

## Setup

Clone or pull this repo — it includes `data/exercises.json` and the `gifs/` folder.

If GIFs are missing, download them:

```bash
npm run download
```

## Run

Serve the folder (required — `file://` cannot load local JSON/GIFs):

```bash
npm run serve
```

Then open the URL shown (usually http://localhost:3000).

## Re-download

The download script skips GIFs that already exist, so you can safely re-run `npm run download` to resume or refresh.
