# Deploying Your REST API to cPanel

This document provides a quick reference guide for deploying your Node.js RESTful API to cPanel.

## Quick Deployment Steps

1. **Prepare your application**
   - Update .env for production settings
   - Ensure all dependencies are in package.json
   - Create PM2 ecosystem file (ecosystem.config.js)

2. **Package your application**
   - Exclude node_modules and .git folders
   - Include all source files, config files, and package.json

3. **Upload to cPanel**
   - Use File Manager or SFTP
   - Upload to your desired directory (e.g., public_html/api)
   - Ensure proper file permissions (typically 644 for files, 755 for directories)

4. **Set up Node.js in cPanel**
   - Configure through Node.js App in cPanel
   - Set proper environment variables
   - Specify the entry point (src/index.js)

5. **Install dependencies**
   - Connect via SSH
   - Run `npm install --production`
   - Install PM2 globally: `npm install -g pm2`

6. **Start the application**
   - Run `pm2 start ecosystem.config.js`
   - Setup PM2 to start on reboot: `pm2 startup` and `pm2 save`

7. **Configure domain/subdomain**
   - Setup proper DNS records
   - Configure reverse proxy if needed
   - Use the provided .htaccess file

## Files Included for Deployment

- `.htaccess` - Apache configuration for URL rewriting and security
- `ecosystem.config.js` - PM2 configuration for process management
- `cpanel-deployment-guide.md` - Detailed step-by-step instructions
- `deploy-checklist.md` - Pre-deployment verification checklist

## Common Issues

- **Application not starting**: Check logs with `pm2 logs restapi`
- **Cannot connect to MongoDB**: Verify IP whitelist in MongoDB Atlas
- **Permission denied errors**: Check file ownership and permissions
- **Port 3000 not accessible**: Configure proper proxy in cPanel

## Post-Deployment

1. Verify API works by testing key endpoints
2. Monitor performance using `pm2 monit`
3. Set up regular backups
4. Configure automatic updates/deployment if possible

For detailed instructions, refer to the [full deployment guide](cpanel-deployment-guide.md). 