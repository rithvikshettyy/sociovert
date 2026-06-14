#!/bin/bash
# ─────────────────────────────────────────────────────────────
# SocioVert VPS Setup Script
# Run on a fresh Ubuntu 22.04+ VPS
# Usage: chmod +x setup-vps.sh && sudo ./setup-vps.sh
# ─────────────────────────────────────────────────────────────

set -e

echo "═══════════════════════════════════════════"
echo " SocioVert — VPS Setup"
echo "═══════════════════════════════════════════"

# ─── System packages ───
echo ""
echo "📦 Installing system dependencies..."
sudo apt update
sudo apt install -y \
  ffmpeg \
  ghostscript \
  libreoffice-core \
  libreoffice-writer \
  libreoffice-calc \
  libreoffice-impress \
  tesseract-ocr \
  tesseract-ocr-eng \
  imagemagick \
  p7zip-full \
  unrar \
  unzip \
  curl \
  git \
  exiftool \
  pandoc

echo "✅ System dependencies installed"

# ─── Node.js 20 via nvm ───
echo ""
echo "📦 Installing Node.js 20..."
if ! command -v node &> /dev/null; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm use 20
  nvm alias default 20
fi
echo "✅ Node.js $(node -v) installed"

# ─── PM2 ───
echo ""
echo "📦 Installing PM2..."
npm install -g pm2
echo "✅ PM2 installed"

# ─── yt-dlp ───
echo ""
echo "📦 Installing yt-dlp..."
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
echo "✅ yt-dlp installed"

# ─── Create temp directory ───
mkdir -p /tmp/sociovert
chmod 777 /tmp/sociovert

# ─── Setup cron for cleanup ───
echo ""
echo "⏰ Setting up cleanup cron..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CRON_CMD="*/15 * * * * $SCRIPT_DIR/cleanup-cron.sh"
(crontab -l 2>/dev/null | grep -v "cleanup-cron.sh"; echo "$CRON_CMD") | crontab -
echo "✅ Cleanup cron installed (every 15 minutes)"

# ─── Build the app ───
echo ""
echo "🔨 Building SocioVert..."
cd "$(dirname "$0")/.."
npm install
npm run build
echo "✅ Build complete"

# ─── Start with PM2 ───
echo ""
echo "🚀 Starting with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -1 | bash 2>/dev/null || true
echo "✅ SocioVert is running!"

echo ""
echo "═══════════════════════════════════════════"
echo " Setup complete!"
echo ""
echo " App running on: http://localhost:3000"
echo " Configure Nginx for your domain"
echo " Don't forget to set up .env.local"
echo "═══════════════════════════════════════════"
