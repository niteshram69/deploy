# Deployment Guide - Ubuntu + Apache + PostgreSQL

This guide explains how to deploy the Mind AI Forge application to an Ubuntu server with Apache web server and PostgreSQL database.

## Prerequisites

- Ubuntu 20.04 LTS or later
- Root/sudo access to the server
- Minimum 2GB RAM, 20GB disk space
- Internet connection for downloading packages

## Quick Deploy (Automated)

The easiest way to deploy is using the automated deployment script:

```bash
# 1. Upload your project to the server (e.g., using git, scp, or rsync)
git clone <your-repo-url> /var/www/mindaiforge
# OR
scp -r ./mind-ai-forge-main user@server:/var/www/mindaiforge

# 2. Navigate to the project directory
cd /var/www/mindaiforge

# 3. Run the deployment script
sudo bash deploy.sh
```

The script will:
- ✅ Install Node.js, Apache, PostgreSQL, and PM2
- ✅ Set up the database with credentials you provide
- ✅ Build the frontend
- ✅ Configure Apache reverse proxy
- ✅ Start the backend with PM2
- ✅ Configure everything to run on system boot

During deployment, you'll be prompted for:
- **Database name** (default: `mindaiforge`)
- **Database username** (default: `mindaiforge_user`)
- **Database password** (required, will be hidden)
- **Domain/IP** (default: `localhost`)

## Manual Deployment

If you prefer to deploy manually or need custom configuration:

### 1. Install Dependencies

```bash
# Update package list
sudo apt-get update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# Install Apache
sudo apt-get install -y apache2

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install PM2 globally
sudo npm install -g pm2

# Enable Apache modules
sudo a2enmod proxy proxy_http rewrite ssl
```

### 2. Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE mindaiforge;
CREATE USER mindaiforge_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mindaiforge TO mindaiforge_user;
\c mindaiforge
GRANT ALL ON SCHEMA public TO mindaiforge_user;
\q
```

### 3. Configure Backend

Create `Backend/.env` file:

```env
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://mindaiforge_user:your_secure_password@localhost:5432/mindaiforge
JWT_SECRET=your_random_jwt_secret_here
```

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

### 4. Build and Deploy

```bash
# Install frontend dependencies and build
npm install
npm run build

# Install backend dependencies
cd Backend
npm install

# Initialize database schema
node init-db.js

# Run migrations (if needed)
node migrate-admin-features.js
```

### 5. Configure Apache

Create `/etc/apache2/sites-available/mindaiforge.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/mindaiforge/dist

    <Directory /var/www/mindaiforge/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ProxyPreserveHost On
    ProxyPass /api http://localhost:5001/api
    ProxyPassReverse /api http://localhost:5001/api

    Alias /uploads /var/www/mindaiforge/Backend/uploads
    <Directory /var/www/mindaiforge/Backend/uploads>
        Options -Indexes
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/mindaiforge_error.log
    CustomLog ${APACHE_LOG_DIR}/mindaiforge_access.log combined
</VirtualHost>
```

Enable the site:
```bash
sudo a2dissite 000-default.conf
sudo a2ensite mindaiforge.conf
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### 6. Start Backend

```bash
cd /var/www/mindaiforge/Backend
pm2 start server.js --name mindaiforge-backend
pm2 save
pm2 startup systemd
```

## Post-Deployment

### Create Admin User

```bash
cd /var/www/mindaiforge/Backend
node promote-admin.js
```

Follow the prompts to enter an email address to promote to admin.

### Configure Firewall

```bash
# Allow HTTP traffic
sudo ufw allow 80

# Allow HTTPS (if using SSL)
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### Setup SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-apache

# Obtain and install certificate
sudo certbot --apache -d your-domain.com
```

Certbot will automatically configure Apache for HTTPS and set up auto-renewal.

## Management Commands

### Backend (PM2)

```bash
# View status
pm2 status

# View logs
pm2 logs mindaiforge-backend

# Restart
pm2 restart mindaiforge-backend

# Stop
pm2 stop mindaiforge-backend

# Start
pm2 start mindaiforge-backend
```

### Apache

```bash
# Check status
sudo systemctl status apache2

# Restart
sudo systemctl restart apache2

# View error logs
sudo tail -f /var/log/apache2/mindaiforge_error.log

# View access logs
sudo tail -f /var/log/apache2/mindaiforge_access.log
```

### Database

```bash
# Connect to database
psql -U mindaiforge_user -d mindaiforge

# Backup database
pg_dump -U mindaiforge_user mindaiforge > backup.sql

# Restore database
psql -U mindaiforge_user mindaiforge < backup.sql
```

## Updating the Application

```bash
# Pull latest code
cd /var/www/mindaiforge
git pull

# Rebuild frontend
npm install
npm run build

# Update backend dependencies
cd Backend
npm install

# Restart backend
pm2 restart mindaiforge-backend

# Restart Apache
sudo systemctl restart apache2
```

## Troubleshooting

### Backend Not Starting

Check PM2 logs:
```bash
pm2 logs mindaiforge-backend
```

Common issues:
- Database connection failed: Verify `DATABASE_URL` in `Backend/.env`
- Port already in use: Check if another service is using port 5001
- Missing dependencies: Run `npm install` in `Backend/` directory

### Frontend Not Loading

Check Apache logs:
```bash
sudo tail -f /var/log/apache2/mindaiforge_error.log
```

Common issues:
- 404 errors: Verify `DocumentRoot` path in Apache config
- Proxy errors: Check if backend is running (`pm2 status`)
- Permission issues: Ensure Apache has read access to `dist/` directory

### Database Connection Issues

Test database connection:
```bash
psql -U mindaiforge_user -d mindaiforge -h localhost
```

Common issues:
- Authentication failed: Verify password in `Backend/.env`
- Database does not exist: Run `node init-db.js` in `Backend/` directory
- Connection refused: Check if PostgreSQL is running (`sudo systemctl status postgresql`)

## Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────────────┐
│         Apache (Port 80)        │
│  ┌──────────────────────────┐   │
│  │ Static Files (/dist)     │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ Reverse Proxy (/api)     │   │
│  └────┬─────────────────────┘   │
└───────┼─────────────────────────┘
        │ Proxy
        ▼
┌─────────────────────────────────┐
│  Node.js Backend (Port 5001)    │
│  - Express.js                   │
│  - JWT Authentication           │
│  - File Uploads                 │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│     PostgreSQL Database         │
│     - User data                 │
│     - Authentication            │
└─────────────────────────────────┘
```

## Security Best Practices

1. **Use HTTPS**: Always enable SSL/TLS in production (use Let's Encrypt)
2. **Strong Passwords**: Use strong, unique passwords for database and JWT secret
3. **Firewall**: Configure UFW to only allow necessary ports (80, 443, 22)
4. **Regular Updates**: Keep system packages, Node.js, and dependencies updated
5. **Backup**: Set up automated database backups
6. **Environment Variables**: Never commit `.env` files to version control
7. **File Permissions**: Ensure proper file permissions (600 for `.env`, 755 for directories)

## Support

For issues or questions:
1. Check the logs (PM2 and Apache)
2. Review the troubleshooting section
3. Verify all prerequisites are met
4. Check database connectivity
