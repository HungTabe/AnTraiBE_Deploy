#!/bin/bash

# VPS Setup Script for AnTrai
# Run this script on a fresh Ubuntu 22.04+ VPS

set -e

echo "🚀 Setting up VPS for AnTrai deployment..."
echo "🐧 Ubuntu 22.04 LTS - Optimized for production"

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose (standalone)
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Install Certbot for SSL
echo "🔒 Installing Certbot for SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/antrai
sudo chown $USER:$USER /opt/antrai

# Create logs directory
sudo mkdir -p /var/log/antrai
sudo chown $USER:$USER /var/log/antrai

# Install Node.js 18 LTS (for development)
echo "📦 Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js version
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install PM2 for process management (alternative to Docker)
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Create systemd service for Docker
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/docker-compose@antrai.service > /dev/null <<EOF
[Unit]
Description=Docker Compose Application Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/antrai
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

echo "✅ VPS setup completed!"
echo ""
echo "🐧 Ubuntu 22.04 LTS is ready for AnTrai!"
echo ""
echo "📝 Next steps:"
echo "1. Logout and login again to apply docker group changes"
echo "2. Clone your repository to /opt/antrai"
echo "3. Copy .env.example to .env and configure it"
echo "4. Run ./scripts/deploy-production.sh production"
echo ""
echo "🔧 Useful commands:"
echo "   Check Docker: docker --version"
echo "   Check Docker Compose: docker-compose --version"
echo "   Check Nginx: sudo systemctl status nginx"
echo "   Check firewall: sudo ufw status"

