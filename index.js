const TelegramBot = require('node-telegram-bot-api');
const { v4: uuidv4 } = require('uuid');
const { connectDB, getDatabase, isJsonDatabase } = require('../config/database');
const User = require('../models/User');

// Bot configuration
const BOT_TOKEN = '7616948328:AAE558BkB5uW00Uy2vAzchBATIK7BAKeVkM';
const CHANNEL_USERNAME = '@royal_earning_official';
const CHANNEL_ID = '@royal_earning_official';
const BOT_URL = 'http://t.me/royal_earning_official_bot';
const REFERRAL_REWARD = 5;
const MIN_WITHDRAWAL = 100;

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Connect to database
connectDB();

// Helper function to generate referral code
function generateReferralCode() {
    return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
}

// Helper function to check channel membership
async function checkChannelMembership(userId) {
    try {
        const member = await bot.getChatMember(CHANNEL_ID, userId);
        return ['member', 'administrator', 'creator'].includes(member.status);
    } catch (error) {
        console.error('Error checking channel membership:', error);
        return false;
    }
}

// Helper function to create main menu keyboard
function getMainMenuKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                [{ text: '🔗 Get Referral Link' }, { text: '💰 Wallet' }],
                [{ text: '💳 Set UPI ID' }, { text: '❓ How to Use Bot' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    };
}

// Helper function to create channel join keyboard
function getChannelJoinKeyboard() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📢 Join Channel', url: 'https://t.me/royal_earning_official' }],
                [{ text: '✅ I Joined', callback_data: 'check_membership' }]
            ]
        }
    };
}

// Start command handler
bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const referralCode = match[1] ? match[1].trim() : null;
    
    try {
        // Check if user already exists
        let user = await User.findOne({ telegramId: userId });
        
        if (!user) {
            // Create new user
            const newReferralCode = generateReferralCode();
            user = new User({
                telegramId: userId,
                username: msg.from.username || '',
                firstName: msg.from.first_name || '',
                lastName: msg.from.last_name || '',
                referralCode: newReferralCode,
                referredBy: referralCode
            });
            
            // If user came through referral link, process referral
            if (referralCode) {
                const referrer = await User.findOne({ referralCode: referralCode });
                if (referrer && referrer.telegramId !== userId) {
                    user.referredBy = referralCode;
                }
            }
            
            await user.save();
        } else {
            // Update last active time
            user.lastActive = new Date();
            await user.save();
        }
        
        // Check channel membership
        const isMember = await checkChannelMembership(userId);
        
        if (!isMember) {
            await bot.sendMessage(chatId, 
                `🎉 Welcome to ROYAL EARNING Bot!\n\n` +
                `To start earning, you must first join our official channel.\n\n` +
                `📢 Please join the channel and then click "I Joined" button.`,
                getChannelJoinKeyboard()
            );
        } else {
            // Update membership status
            if (!user.isChannelMember) {
                user.isChannelMember = true;
                
                // Process referral reward if user was referred
                if (user.referredBy) {
                    const referrer = await User.findOne({ referralCode: user.referredBy });
                    if (referrer && !referrer.referredUsers.includes(userId)) {
                        referrer.referredUsers.push(userId);
                        referrer.walletBalance += REFERRAL_REWARD;
                        referrer.totalEarned += REFERRAL_REWARD;
                        await referrer.save();
                        
                        // Notify referrer
                        try {
                            await bot.sendMessage(referrer.telegramId, 
                                `🎉 Congratulations! You earned ₹${REFERRAL_REWARD} for referring a new user!\n\n` +
                                `💰 Your wallet balance: ₹${referrer.walletBalance}`
                            );
                        } catch (error) {
                            console.error('Error notifying referrer:', error);
                        }
                    }
                }
                
                await user.save();
            }
            
            await bot.sendMessage(chatId, 
                `🎉 Welcome to ROYAL EARNING Bot!\n\n` +
                `✅ You are verified and ready to start earning!\n\n` +
                `💰 Current Balance: ₹${user.walletBalance}\n` +
                `👥 Referrals: ${user.referredUsers.length}\n\n` +
                `Use the menu below to navigate:`,
                getMainMenuKeyboard()
            );
        }
        
    } catch (error) {
        console.error('Error in start command:', error);
        await bot.sendMessage(chatId, '❌ An error occurred. Please try again later.');
    }
});

// Callback query handler for channel membership check
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id.toString();
    const data = callbackQuery.data;
    
    if (data === 'check_membership') {
        try {
            const isMember = await checkChannelMembership(userId);
            
            if (isMember) {
                const user = await User.findOne({ telegramId: userId });
                if (user) {
                    user.isChannelMember = true;
                    
                    // Process referral reward if user was referred
                    if (user.referredBy) {
                        const referrer = await User.findOne({ referralCode: user.referredBy });
                        if (referrer && !referrer.referredUsers.includes(userId)) {
                            referrer.referredUsers.push(userId);
                            referrer.walletBalance += REFERRAL_REWARD;
                            referrer.totalEarned += REFERRAL_REWARD;
                            await referrer.save();
                            
                            // Notify referrer
                            try {
                                await bot.sendMessage(referrer.telegramId, 
                                    `🎉 Congratulations! You earned ₹${REFERRAL_REWARD} for referring a new user!\n\n` +
                                    `💰 Your wallet balance: ₹${referrer.walletBalance}`
                                );
                            } catch (error) {
                                console.error('Error notifying referrer:', error);
                            }
                        }
                    }
                    
                    await user.save();
                    
                    await bot.editMessageText(
                        `🎉 Welcome to ROYAL EARNING Bot!\n\n` +
                        `✅ You are verified and ready to start earning!\n\n` +
                        `💰 Current Balance: ₹${user.walletBalance}\n` +
                        `👥 Referrals: ${user.referredUsers.length}\n\n` +
                        `Use the menu below to navigate:`,
                        {
                            chat_id: chatId,
                            message_id: callbackQuery.message.message_id,
                            ...getMainMenuKeyboard()
                        }
                    );
                }
            } else {
                await bot.answerCallbackQuery(callbackQuery.id, {
                    text: '❌ You have not joined the channel yet. Please join first!',
                    show_alert: true
                });
            }
        } catch (error) {
            console.error('Error checking membership:', error);
            await bot.answerCallbackQuery(callbackQuery.id, {
                text: '❌ Error checking membership. Please try again.',
                show_alert: true
            });
        }
    }
});

// Message handlers
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const text = msg.text;
    
    // Skip if it's a command
    if (text && text.startsWith('/')) return;
    
    try {
        const user = await User.findOne({ telegramId: userId });
        
        if (!user) {
            await bot.sendMessage(chatId, 'Please start the bot first by typing /start');
            return;
        }
        
        if (!user.isChannelMember) {
            await bot.sendMessage(chatId, 
                'Please join our channel first to use the bot.',
                getChannelJoinKeyboard()
            );
            return;
        }
        
        // Update last active time
        user.lastActive = new Date();
        await user.save();
        
        switch (text) {
            case '🔗 Get Referral Link':
                const referralLink = `${BOT_URL}?start=${user.referralCode}`;
                await bot.sendMessage(chatId, 
                    `🔗 Your Referral Link:\n\n` +
                    `${referralLink}\n\n` +
                    `💰 Earn ₹${REFERRAL_REWARD} for each successful referral!\n\n` +
                    `📋 Share this link with your friends. When they join through your link and subscribe to our channel, you'll earn ₹${REFERRAL_REWARD} instantly!`
                );
                break;
                
            case '💰 Wallet':
                const withdrawButton = user.walletBalance >= MIN_WITHDRAWAL ? 
                    [[{ text: '💸 Withdraw Money', callback_data: 'withdraw_money' }]] : [];
                
                await bot.sendMessage(chatId, 
                    `💰 Your Wallet Details:\n\n` +
                    `💵 Current Balance: ₹${user.walletBalance}\n` +
                    `📈 Total Earned: ₹${user.totalEarned}\n` +
                    `👥 Total Referrals: ${user.referredUsers.length}\n` +
                    `💳 UPI ID: ${user.upiId || 'Not Set'}\n\n` +
                    `${user.walletBalance >= MIN_WITHDRAWAL ? 
                        '✅ You can withdraw money now!' : 
                        `❌ Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}`}`,
                    {
                        reply_markup: {
                            inline_keyboard: withdrawButton
                        }
                    }
                );
                break;
                
            case '💳 Set UPI ID':
                await bot.sendMessage(chatId, 
                    `💳 Please enter your UPI ID:\n\n` +
                    `Example: yourname@paytm, yourname@phonepe, yourname@googlepay\n\n` +
                    `⚠️ Make sure your UPI ID is correct. This will be used for payments.`
                );
                user.awaitingUpiId = true;
                await user.save();
                break;
                
            case '❓ How to Use Bot':
                await bot.sendMessage(chatId, 
                    `❓ How to Use ROYAL EARNING Bot:\n\n` +
                    `1️⃣ Get your referral link from "Get Referral Link" button\n\n` +
                    `2️⃣ Share your referral link with friends on social media, WhatsApp, etc.\n\n` +
                    `3️⃣ When someone joins through your link and subscribes to our channel, you earn ₹${REFERRAL_REWARD}\n\n` +
                    `4️⃣ Check your earnings in "Wallet" section\n\n` +
                    `5️⃣ Set your UPI ID for withdrawals\n\n` +
                    `6️⃣ Withdraw money when you have minimum ₹${MIN_WITHDRAWAL}\n\n` +
                    `💡 Tips:\n` +
                    `• Share your link in groups and social media\n` +
                    `• The more people join, the more you earn!\n` +
                    `• Payments are processed within 24-48 hours\n\n` +
                    `📞 Support: Contact @royal_earning_official`
                );
                break;
                
            default:
                // Check if user is setting UPI ID
                if (user.awaitingUpiId) {
                    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
                    if (upiRegex.test(text)) {
                        user.upiId = text;
                        user.awaitingUpiId = false;
                        await user.save();
                        
                        await bot.sendMessage(chatId, 
                            `✅ UPI ID set successfully!\n\n` +
                            `💳 Your UPI ID: ${text}\n\n` +
                            `You can now withdraw money when you have minimum ₹${MIN_WITHDRAWAL} in your wallet.`
                        );
                    } else {
                        await bot.sendMessage(chatId, 
                            `❌ Invalid UPI ID format!\n\n` +
                            `Please enter a valid UPI ID like:\n` +
                            `yourname@paytm\n` +
                            `yourname@phonepe\n` +
                            `yourname@googlepay`
                        );
                    }
                } else {
                    await bot.sendMessage(chatId, 
                        'Please use the menu buttons to navigate.',
                        getMainMenuKeyboard()
                    );
                }
                break;
        }
        
    } catch (error) {
        console.error('Error handling message:', error);
        await bot.sendMessage(chatId, '❌ An error occurred. Please try again later.');
    }
});

// Handle withdrawal callback
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id.toString();
    const data = callbackQuery.data;
    
    if (data === 'withdraw_money') {
        try {
            const user = await User.findOne({ telegramId: userId });
            
            if (!user) {
                await bot.answerCallbackQuery(callbackQuery.id, {
                    text: 'User not found!',
                    show_alert: true
                });
                return;
            }
            
            if (user.walletBalance < MIN_WITHDRAWAL) {
                await bot.answerCallbackQuery(callbackQuery.id, {
                    text: `Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}`,
                    show_alert: true
                });
                return;
            }
            
            if (!user.upiId) {
                await bot.answerCallbackQuery(callbackQuery.id, {
                    text: 'Please set your UPI ID first!',
                    show_alert: true
                });
                return;
            }
            
            // Create withdrawal request
            const withdrawalRequest = {
                amount: user.walletBalance,
                status: 'pending',
                requestDate: new Date()
            };
            
            user.withdrawalRequests.push(withdrawalRequest);
            user.walletBalance = 0; // Deduct from wallet
            await user.save();
            
            await bot.editMessageText(
                `✅ Withdrawal Request Submitted!\n\n` +
                `💰 Amount: ₹${withdrawalRequest.amount}\n` +
                `💳 UPI ID: ${user.upiId}\n` +
                `📅 Request Date: ${withdrawalRequest.requestDate.toLocaleDateString()}\n\n` +
                `⏳ Your request is being processed. You will receive payment within 24-48 hours.\n\n` +
                `📞 For support, contact @royal_earning_official`,
                {
                    chat_id: chatId,
                    message_id: callbackQuery.message.message_id
                }
            );
            
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            await bot.answerCallbackQuery(callbackQuery.id, {
                text: 'Error processing withdrawal. Please try again.',
                show_alert: true
            });
        }
    }
});

// Error handling
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

console.log('🤖 ROYAL EARNING Bot is running...');
console.log('📢 Channel:', CHANNEL_USERNAME);
console.log('🔗 Bot URL:', BOT_URL);

