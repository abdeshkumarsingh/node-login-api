# Deployment Checklist for cPanel

## 1. Files to Include in Your Deployment Package
- [ ] All source code files (src/ directory)
- [ ] package.json and package-lock.json
- [ ] .env file (with production settings)
- [ ] README.md

## 2. Configure Environment Variables
- [ ] Set NODE_ENV=production
- [ ] Set secure JWT_SECRET
- [ ] Configure correct MongoDB URI
- [ ] Set appropriate PORT (usually 3000 or as specified by cPanel)

## 3. Security Checks
- [ ] Remove any hardcoded credentials
- [ ] Ensure all sensitive data is in .env file
- [ ] Make sure error responses don't expose server details in production

## 4. Production Optimizations
- [ ] Enable compression middleware
- [ ] Configure proper CORS settings
- [ ] Set cache headers for static assets (if any) 