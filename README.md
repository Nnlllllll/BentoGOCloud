sudo curl -L --output /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64

sudo chmod +x /usr/local/bin/cloudflared

cloudflared tunnel login
