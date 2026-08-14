# Exercises Browser
PIN: 5675
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

## Host with Nginx (server / VPS)

Unlike the old single-HTML Podroid setup, this app needs a web server because it loads `data/exercises.json` and `gifs/` over HTTP.

**On your server (Linux):**

```bash
# Install nginx (Debian/Ubuntu)
sudo apt update && sudo apt install -y nginx

# Clone the project
sudo git clone https://github.com/ChinmayaGit/exercises.git /var/www/exercises

# Use the included config
sudo cp /var/www/exercises/deploy/nginx.conf /etc/nginx/sites-available/exercises
sudo ln -sf /etc/nginx/sites-available/exercises /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # optional: remove default site
sudo nginx -t
sudo systemctl reload nginx
```

Open `http://YOUR_SERVER_IP` in a browser (phone or desktop).

**Update later:**

```bash
cd /var/www/exercises && sudo git pull
```

**HTTPS (optional):** use [Certbot](https://certbot.eff.org/) with Let's Encrypt after you have a domain pointing to the server.

## Re-download

The download script skips GIFs that already exist, so you can safely re-run `npm run download` to resume or refresh.
