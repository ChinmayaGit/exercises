# Exercises Browser
PIN: 5675

Offline-friendly browser for the [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset).

Static files only: `index.html`, `data/exercises.json`, and `gifs/`.  
No Node.js is required on the server — **nginx is enough**.

## Local run (optional)

```bash
npm run serve
```

If GIFs are missing:

```bash
npm run download
```

## Move from Netlify → Nginx (your own server)

Netlify was only hosting static files. On your VPS/server, nginx does the same job.

### 1. Push latest code to GitHub

From your PC (so the server can pull everything, including `gifs/`):

```bash
git add -A
git commit -m "Prepare for nginx hosting"
git push
```

### 2. On the server (Ubuntu/Debian)

```bash
# Install nginx
sudo apt update && sudo apt install -y nginx git

# Clone the repo (includes data + gifs)
sudo git clone https://github.com/ChinmayaGit/exercises.git /var/www/exercises

# Permissions
sudo chown -R www-data:www-data /var/www/exercises

# Enable nginx site
sudo cp /var/www/exercises/deploy/nginx.conf /etc/nginx/sites-available/exercises
sudo ln -sf /etc/nginx/sites-available/exercises /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx
```

### 3. Open the site

- Browser: `http://YOUR_SERVER_IP`
- Or your domain if DNS points to this server

### 4. Update later

```bash
cd /var/www/exercises
sudo git pull
sudo systemctl reload nginx   # usually not needed for static HTML, but safe
```

### 5. HTTPS (optional, recommended)

After a domain points to the server:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. Stop using Netlify

In Netlify dashboard: stop auto-deploy or delete the site.  
Your live URL becomes the server IP/domain instead.

## Firewall tip

If the page does not load, open port 80 (and 443 for HTTPS):

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```
