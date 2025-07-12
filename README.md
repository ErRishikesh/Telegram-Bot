# ROYAL EARNING - Telegram Referral Bot System

A complete Telegram bot system with referral functionality, wallet management, and admin panel for managing users and withdrawal requests.

## Features

### Telegram Bot Features
- ✅ **Channel Subscription Verification** - Users must join the specified channel before accessing bot features
- 🔗 **Referral System** - Users get unique referral links and earn ₹5 per successful referral
- 💰 **Wallet Management** - Track earnings, referral count, and total earned amount
- 💳 **UPI Integration** - Users can set UPI ID for withdrawals
- 💸 **Withdrawal System** - Minimum withdrawal of ₹100 with admin approval
- 📱 **User-Friendly Interface** - Easy-to-use menu buttons and interactive responses

### Admin Panel Features
- 🔐 **Secure Admin Login** - Protected admin access with JWT authentication
- 📊 **Dashboard Statistics** - Overview of total users, earnings, and pending withdrawals
- 👥 **User Management** - View user profiles, referral details, and manually adjust balances
- 💸 **Withdrawal Management** - Approve/decline withdrawal requests with admin notes
- 🔍 **Search & Filter** - Search users and filter withdrawals by status
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (optional - JSON database fallback available)
- Telegram Bot Token
- Telegram Channel

### Quick Setup

1. **Extract the files** to your hosting directory
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update the configuration values:
   ```env
   BOT_TOKEN=your_telegram_bot_token
   CHANNEL_USERNAME=@your_channel_username
   CHANNEL_ID=@your_channel_id
   BOT_URL=http://t.me/your_bot_username
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   DATABASE_TYPE=json  # Use 'mongodb' for MongoDB
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

### For cPanel/Shared Hosting

1. **Upload files** to your hosting directory
2. **Install Node.js** (if not available, contact your hosting provider)
3. **Set environment variables** in your hosting control panel or create `.env` file
4. **Use JSON database** by setting `DATABASE_TYPE=json` in environment variables
5. **Start the application** using your hosting provider's Node.js interface

## Configuration

### Bot Configuration
- `BOT_TOKEN`: Your Telegram bot token from @BotFather
- `CHANNEL_USERNAME`: Your Telegram channel username (e.g., @royal_earning_official)
- `CHANNEL_ID`: Your Telegram channel ID (same as username for public channels)
- `BOT_URL`: Your bot's URL (e.g., http://t.me/royal_earning_official_bot)

### Admin Configuration
- `ADMIN_USERNAME`: Admin panel login username
- `ADMIN_PASSWORD`: Admin panel login password
- `JWT_SECRET`: Secret key for JWT token generation

### Database Configuration
- `DATABASE_TYPE`: Set to 'mongodb' for MongoDB or 'json' for file-based storage
- `MONGODB_URI`: MongoDB connection string (only needed if using MongoDB)

## Usage

### For Users
1. Start the bot by clicking the bot link or searching for it on Telegram
2. Join the required channel when prompted
3. Use the menu buttons to:
   - Get referral link
   - Check wallet balance
   - Set UPI ID for withdrawals
   - Request withdrawal (minimum ₹100)

### For Admins
1. Access the admin panel at `http://your-domain.com/admin`
2. Login with your admin credentials
3. Use the dashboard to:
   - View statistics and user overview
   - Manage user accounts and balances
   - Process withdrawal requests
   - Monitor bot activity

## File Structure

```
royal_earning_bot/
├── bot/
│   └── index.js              # Main Telegram bot logic
├── admin/
│   └── server.js             # Admin panel Express server
├── config/
│   └── database.js           # Database configuration
├── models/
│   ├── User.js               # MongoDB user model
│   └── JsonDatabase.js       # JSON database fallback
├── public/
│   ├── admin.html            # Admin panel HTML
│   └── admin.js              # Admin panel JavaScript
├── data/                     # JSON database files (auto-created)
├── app.js                    # Main application launcher
├── package.json              # Node.js dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## API Endpoints

### Admin API
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get users list with pagination
- `GET /api/admin/users/:telegramId` - Get user details
- `PUT /api/admin/users/:telegramId/balance` - Update user balance
- `GET /api/admin/withdrawals` - Get withdrawal requests
- `PUT /api/admin/withdrawals/:telegramId/:withdrawalId` - Process withdrawal

## Security Features

- JWT-based admin authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration
- Secure password handling

## Troubleshooting

### Common Issues

1. **Bot not responding**:
   - Check if BOT_TOKEN is correct
   - Verify bot is not already running elsewhere
   - Check network connectivity

2. **Channel verification not working**:
   - Ensure CHANNEL_ID is correct
   - Bot must be admin in the channel (for private channels)
   - Check channel username format

3. **Admin panel not accessible**:
   - Verify PORT configuration
   - Check if admin server is running
   - Ensure firewall allows the port

4. **Database connection issues**:
   - For MongoDB: Check MONGODB_URI
   - For JSON: Ensure write permissions in data directory
   - Check DATABASE_TYPE setting

### Support

For technical support or questions:
- Contact: @royal_earning_official
- Email: Support available through Telegram

## License

This project is licensed under the ISC License.

## Credits

Developed by ROYAL RISHI for ROYAL EARNING Bot System.

---

**Note**: This bot system is designed for educational and legitimate referral marketing purposes. Ensure compliance with Telegram's Terms of Service and local regulations when using this system.

