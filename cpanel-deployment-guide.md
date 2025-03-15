# cPanel Deployment Guide for Your Node.js API

This guide will walk you through deploying your RESTful API on cPanel.

## Prerequisites
- cPanel hosting account with Node.js support
- SSH access to your cPanel server (recommended)
- MongoDB Atlas account with a working cluster
- Domain or subdomain pointed to your cPanel account

## Step 1: Check Node.js Support in cPanel

1. Log in to your cPanel account
2. Search for "Node.js" in the cPanel dashboard
3. If you see "Setup Node.js App", your hosting supports Node.js
4. If not, contact your hosting provider to enable Node.js support

## Step 2: Prepare Your Application Files

1. Create a production build of your application:
   - Run `npm run build` (if applicable)
   - Make sure all dependencies are in package.json
   - Set NODE_ENV=production in .env file

2. Compress your application files into a ZIP archive:
   ```bash
   zip -r api-deployment.zip . -x "node_modules/*" ".git/*"
   ```

## Step 3: Upload Files to cPanel

### Method 1: Using File Manager

1. Log in to cPanel and open File Manager
2. Navigate to the directory where you want to deploy your application (typically `public_html` or a subdomain folder)
3. Click "Upload" and select your ZIP file
4. Once uploaded, extract the ZIP file using the "Extract" option

### Method 2: Using SFTP (Recommended)

1. Use an FTP client like FileZilla
2. Connect to your server using SFTP credentials from cPanel
3. Upload all files except node_modules and .git folders
4. Make sure to preserve file permissions

## Step 4: Set Up Node.js in cPanel

1. In cPanel, find and click on "Setup Node.js App"
2. Click "Create Application"
3. Configure your application:
   - Application root: Path to your application (e.g., `/home/username/public_html/api`)
   - Application URL: Your domain or subdomain
   - Application startup file: `src/index.js`
   - Node.js version: Select the latest stable version (v18.x or higher)
   - Environment variables: Add your .env variables here
   - Save the configuration

## Step 5: Install Dependencies

1. Connect to your server via SSH:
   ```bash
   ssh username@your-domain.com
   ```

2. Navigate to your application directory:
   ```bash
   cd ~/public_html/api
   ```

3. Install dependencies:
   ```bash
   npm install --production
   ```

4. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

## Step 6: Configure Environment Variables

1. In cPanel Node.js App setup, add these environment variables:
   - NODE_ENV=production
   - PORT=3000 (or as specified by your hosting)
   - MONGODB_URI=your_mongodb_connection_string
   - JWT_SECRET=your_secure_jwt_secret_key
   - JWT_EXPIRES_IN=7d

2. Alternatively, create/edit the .env file in your application directory with the same variables

## Step 7: Start Your Application

### Using cPanel Node.js App Manager

1. In the Node.js App Manager, click on your application
2. Click "Start" to start your application

### Using PM2 (Recommended for Better Process Management)

1. Connect via SSH
2. Navigate to your application directory
3. Start the application with PM2:
   ```bash
   pm2 start src/index.js --name api
   ```
4. Make PM2 auto-start on server reboot:
   ```bash
   pm2 startup
   pm2 save
   ```

## Step 8: Configure Application URL

1. In cPanel, go to "Domains" or "Subdomains"
2. Add a new subdomain or configure an existing domain
3. Point the domain/subdomain to your application directory
4. Configure reverse proxy (if needed) to forward requests to port 3000

## Step 9: Verify Deployment

1. Visit your domain/subdomain in a browser
2. Test the API using a tool like Postman or your test script
3. Check for any errors in the logs:
   - SSH into your server
   - Run `pm2 logs api` to see application logs

## Troubleshooting

### Application Won't Start

1. Check application logs: `pm2 logs api`
2. Verify environment variables are set correctly
3. Ensure MongoDB connection string is correct
4. Check file permissions: files should be readable by the web user

### 503 Service Unavailable

1. Verify the application is running: `pm2 list`
2. Check if the port is correctly configured
3. Ensure reverse proxy is properly configured in cPanel

### MongoDB Connection Issues

1. Verify MongoDB Atlas IP allowlist includes your server's IP
2. Check MongoDB credentials are correct
3. Test connection from your server: 
   ```bash
   mongo "mongodb+srv://username:password@cluster.url/dbname" --eval "db.serverStatus()"
   ```

## Best Practices for Production

1. Set up automatic backups for your application
2. Configure PM2 monitoring: `pm2 monit`
3. Implement proper error logging and monitoring
4. Set up a continuous integration/deployment pipeline
5. Regularly update dependencies for security fixes 