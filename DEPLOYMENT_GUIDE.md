# cPanel Deployment Guide for ROYAL EARNING Bot

This guide will help you deploy the ROYAL EARNING Telegram Bot System on cPanel shared hosting.

## Prerequisites

1. **cPanel hosting account** with Node.js support
2. **Telegram Bot Token** from @BotFather
3. **Telegram Channel** for user verification
4. **Domain or subdomain** for the admin panel

## Step-by-Step Deployment

### 1. Prepare Your Hosting Environment

1. **Login to cPanel**
2. **Check Node.js availability**:
   - Look for "Node.js" or "Node.js Selector" in cPanel
   - If not available, contact your hosting provider
3. **Note your domain/subdomain** where you'll deploy the bot

### 2. Upload Files

1. **Extract the zip file** to your computer
2. **Upload all files** to your hosting directory:
   - For main domain: `public_html/`
   - For subdomain: `public_html/subdomain_name/`
3. **Ensure all files are uploaded** including hidden files like `.htaccess`

### 3. Configure Node.js (if available in cPanel)

1. **Go to Node.js section** in cPanel
2. **Create new Node.js app**:
   - **Node.js version**: Select latest available (14+ recommended)
   - **Application mode**: Production
   - **Application root**: Your upload directory
   - **Application URL**: Your domain/subdomain
   - **Application startup file**: `app.js`

### 4. Install Dependencies

1. **Open Terminal** in cPanel (if available) or use File Manager
2. **Navigate to your app directory**
3. **Run installation command**:
   ```bash
   npm install
   ```
   
   If terminal is not available:
   - Upload `node_modules` folder from your local development
   - Or contact hosting support for npm installation

### 5. Configure Environment Variables

**Method 1: Using cPanel Environment Variables**
1. Go to Node.js app settings
2. Add environment variables:
   ```
   BOT_TOKEN=7616948328:AAE558BkB5uW00Uy2vAzchBATIK7BAKeVkM
   CHANNEL_USERNAME=@royal_earning_official
   CHANNEL_ID=@royal_earning_official
   BOT_URL=http://t.me/royal_earning_official_bot
   ADMIN_USERNAME=royal_earning
   ADMIN_PASSWORD=Rishi@748
   DATABASE_TYPE=json
   PORT=3000
   ```

**Method 2: Using .env file**
1. Create `.env` file in your app directory
2. Copy content from `.env.example`
3. Update with your actual values

### 6. Set Up Database

Since most shared hosting doesn't support MongoDB, use JSON database:

1. **Ensure DATABASE_TYPE=json** in environment variables
2. **Create data directory** (will be auto-created if permissions allow)
3. **Set proper permissions** for data directory (755 or 777)

### 7. Start the Application

1. **In Node.js app settings**, click "Start"
2. **Check application status** - should show "Running"
3. **Test the admin panel**: Visit `http://yourdomain.com/admin`

### 8. Configure Telegram Bot

1. **Set webhook** (optional for shared hosting):
   - Most shared hosting works with polling (default)
   - If webhook is required, contact hosting support

2. **Test bot functionality**:
   - Send `/start` to your bot
   - Check if channel verification works
   - Test referral link generation

## Alternative Deployment Methods

### Method 1: Using PM2 (if available)

```bash
npm install -g pm2
pm2 start app.js --name "royal-earning-bot"
pm2 startup
pm2 save
```

### Method 2: Using Forever (if available)

```bash
npm install -g forever
forever start app.js
```

### Method 3: Manual Process Management

If process managers are not available:
1. Use cPanel's Node.js interface
2. Set startup file to `app.js`
3. Enable "Auto-restart" if available

## Troubleshooting

### Common Issues and Solutions

1. **"Node.js not available"**:
   - Contact hosting provider to enable Node.js
   - Consider upgrading hosting plan
   - Use VPS hosting as alternative

2. **"Cannot install npm packages"**:
   - Upload `node_modules` folder manually
   - Contact hosting support for npm access
   - Use hosting provider's package installer

3. **"Permission denied" errors**:
   - Set directory permissions to 755
   - Set file permissions to 644
   - Ensure data directory is writable

4. **"Port already in use"**:
   - Use different port in environment variables
   - Check hosting provider's port restrictions
   - Use hosting provider's assigned port

5. **"Bot not responding"**:
   - Check if application is running
   - Verify BOT_TOKEN is correct
   - Check network connectivity
   - Review application logs

6. **"Admin panel not accessible"**:
   - Check if port is open
   - Verify domain configuration
   - Check .htaccess file
   - Review hosting provider's restrictions

### Hosting Provider Specific Notes

**Shared Hosting Limitations**:
- Limited Node.js support
- Port restrictions
- Process limitations
- Memory constraints

**Recommended Hosting Providers**:
- Hostinger (Node.js support)
- A2 Hosting (Node.js support)
- InMotion Hosting (VPS)
- DigitalOcean (VPS)
- Heroku (Cloud platform)

## Performance Optimization

1. **Use JSON database** for shared hosting
2. **Enable compression** in .htaccess
3. **Set proper cache headers**
4. **Monitor resource usage**
5. **Optimize bot responses**

## Security Considerations

1. **Protect sensitive files**:
   - .env file should not be web-accessible
   - Use .htaccess to block access
   
2. **Use strong passwords**:
   - Change default admin credentials
   - Use complex JWT secret
   
3. **Regular updates**:
   - Keep dependencies updated
   - Monitor for security issues

## Monitoring and Maintenance

1. **Check application logs** regularly
2. **Monitor user activity** through admin panel
3. **Backup data directory** periodically
4. **Update bot token** if compromised
5. **Review withdrawal requests** daily

## Support

If you encounter issues during deployment:

1. **Check hosting provider documentation**
2. **Contact hosting support** for Node.js specific issues
3. **Review application logs** for error details
4. **Test locally** before deploying to production

For bot-specific support:
- Contact: @royal_earning_official
- Review README.md for detailed documentation

---

**Note**: Shared hosting environments vary significantly. Some steps may not apply to your specific hosting provider. Always consult your hosting provider's documentation for Node.js deployment guidelines.

