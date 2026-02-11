#!/bin/bash

# ======================================
# Mind AI Forge - Ubuntu Deployment Script
# ======================================
# This script automates deployment on Ubuntu with Apache and PostgreSQL
# Run as: sudo bash deploy.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Mind AI Forge Deployment Script${NC}"
echo -e "${GREEN}======================================${NC}\n"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use sudo)${NC}" 
   exit 1
fi

# Get the actual user who invoked sudo
ACTUAL_USER=${SUDO_USER:-$USER}
APP_DIR=$(pwd)

echo -e "${YELLOW}Configuration:${NC}"
echo "  App Directory: $APP_DIR"
echo "  Running user: $ACTUAL_USER"
echo ""

# ======================================
# 1. Install System Dependencies
# ======================================
echo -e "${GREEN}[1/7] Installing system dependencies...${NC}"

# Update package list
apt-get update

# Install Node.js (using NodeSource repository for latest LTS)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js already installed: $(node -v)"
fi

# Install Apache2
if ! command -v apache2 &> /dev/null; then
    echo "Installing Apache2..."
    apt-get install -y apache2
else
    echo "Apache2 already installed"
fi

# Install PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    apt-get install -y postgresql postgresql-contrib
else
    echo "PostgreSQL already installed: $(psql --version)"
fi

# Install PM2 globally (process manager for Node.js)
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
else
    echo "PM2 already installed: $(pm2 -v)"
fi

# Enable required Apache modules
echo "Enabling Apache modules..."
a2enmod proxy
a2enmod proxy_http
a2enmod rewrite
a2enmod ssl

echo -e "${GREEN}✓ System dependencies installed${NC}\n"

# ======================================
# 2. Database Setup
# ======================================
echo -e "${GREEN}[2/7] Setting up PostgreSQL database...${NC}"

# Prompt for database credentials
read -p "Enter PostgreSQL database name [mindaiforge]: " DB_NAME
DB_NAME=${DB_NAME:-mindaiforge}

read -p "Enter PostgreSQL username [mindaiforge_user]: " DB_USER
DB_USER=${DB_USER:-mindaiforge_user}

read -sp "Enter PostgreSQL password (will be hidden): " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Error: Password cannot be empty${NC}"
    exit 1
fi

# Create database and user
sudo -u postgres psql <<EOF
-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Create user if not exists
DO
\$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
      CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
   END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
EOF

echo -e "${GREEN}✓ Database setup complete${NC}\n"

# ======================================
# 3. Configure Backend Environment
# ======================================
echo -e "${GREEN}[3/7] Configuring backend environment...${NC}"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file for backend
cat > "$APP_DIR/Backend/.env" <<EOF
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
JWT_SECRET=$JWT_SECRET
EOF

chown $ACTUAL_USER:$ACTUAL_USER "$APP_DIR/Backend/.env"
chmod 600 "$APP_DIR/Backend/.env"

echo -e "${GREEN}✓ Backend environment configured${NC}\n"

# ======================================
# 4. Install Dependencies & Build Frontend
# ======================================
echo -e "${GREEN}[4/7] Installing dependencies and building frontend...${NC}"

# Install frontend dependencies
cd "$APP_DIR"
echo "Installing frontend dependencies..."
sudo -u $ACTUAL_USER npm install

# Build frontend
echo "Building frontend..."
sudo -u $ACTUAL_USER npm run build

# Install backend dependencies
cd "$APP_DIR/Backend"
echo "Installing backend dependencies..."
sudo -u $ACTUAL_USER npm install

echo -e "${GREEN}✓ Dependencies installed and frontend built${NC}\n"

# ======================================
# 5. Initialize Database Schema
# ======================================
echo -e "${GREEN}[5/7] Initializing database schema...${NC}"

cd "$APP_DIR/Backend"
sudo -u $ACTUAL_USER node init-db.js

# Run migrations if needed
if [ -f migrate-admin-features.js ]; then
    echo "Running migrations..."
    sudo -u $ACTUAL_USER node migrate-admin-features.js
fi

echo -e "${GREEN}✓ Database schema initialized${NC}\n"

# ======================================
# 6. Configure Apache VirtualHost
# ======================================
echo -e "${GREEN}[6/7] Configuring Apache...${NC}"

# Prompt for domain/IP
read -p "Enter your domain name or server IP [localhost]: " DOMAIN
DOMAIN=${DOMAIN:-localhost}

# Create Apache VirtualHost configuration
cat > /etc/apache2/sites-available/mindaiforge.conf <<EOF
<VirtualHost *:80>
    ServerName $DOMAIN
    DocumentRoot $APP_DIR/dist

    # Serve static frontend files
    <Directory $APP_DIR/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle client-side routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Proxy API requests to Node.js backend
    ProxyPreserveHost On
    ProxyPass /api http://localhost:5001/api
    ProxyPassReverse /api http://localhost:5001/api

    # Serve uploaded files
    Alias /uploads $APP_DIR/Backend/uploads
    <Directory $APP_DIR/Backend/uploads>
        Options -Indexes
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/mindaiforge_error.log
    CustomLog \${APACHE_LOG_DIR}/mindaiforge_access.log combined
</VirtualHost>
EOF

# Disable default site and enable our site
a2dissite 000-default.conf 2>/dev/null || true
a2ensite mindaiforge.conf

# Test Apache configuration
apache2ctl configtest

# Restart Apache
systemctl restart apache2

echo -e "${GREEN}✓ Apache configured and restarted${NC}\n"

# ======================================
# 7. Start Backend with PM2
# ======================================
echo -e "${GREEN}[7/7] Starting backend with PM2...${NC}"

cd "$APP_DIR/Backend"

# Stop existing instance if running
sudo -u $ACTUAL_USER pm2 delete mindaiforge-backend 2>/dev/null || true

# Start backend
sudo -u $ACTUAL_USER pm2 start server.js --name mindaiforge-backend

# Save PM2 configuration
sudo -u $ACTUAL_USER pm2 save

# Setup PM2 to start on boot
sudo -u $ACTUAL_USER pm2 startup systemd -u $ACTUAL_USER --hp /home/$ACTUAL_USER

echo -e "${GREEN}✓ Backend started with PM2${NC}\n"

# ======================================
# Deployment Complete
# ======================================
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}======================================${NC}\n"

echo -e "${YELLOW}Application Details:${NC}"
echo "  Frontend URL: http://$DOMAIN"
echo "  Backend API: http://$DOMAIN/api"
echo "  Database: PostgreSQL ($DB_NAME)"
echo ""

echo -e "${YELLOW}Useful Commands:${NC}"
echo "  Check backend status: pm2 status"
echo "  View backend logs: pm2 logs mindaiforge-backend"
echo "  Restart backend: pm2 restart mindaiforge-backend"
echo "  Check Apache status: systemctl status apache2"
echo "  View Apache logs: tail -f /var/log/apache2/mindaiforge_error.log"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Create an admin user: cd $APP_DIR/Backend && node promote-admin.js"
echo "  2. Configure firewall to allow HTTP (port 80): ufw allow 80"
echo "  3. (Optional) Setup SSL certificate with Let's Encrypt"
echo ""

echo -e "${GREEN}Deployment successful!${NC}"
