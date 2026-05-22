Home feito por Pedro,
Info feito por Pedro,
Main feito por Nathan e
Settings feito por Nathan
Como usar:
cd AppReact
npm i
npm run dev
seguir localhost:5173


# CLoud Flare
# Debian:

# Add cloudflare gpg key
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null

# Add this repo to your apt repositories
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

# install cloudflared
sudo apt-get update && sudo apt-get install cloudflared

# A Service to automatically run your tunnel whenever your machine starts:
sudo cloudflared service install $CLOUDFLARE_TOKEN

# OR run the tunnel manually in your current terminal session only:
cloudflared tunnel run --token $CLOUDFLARE_TOKEN
