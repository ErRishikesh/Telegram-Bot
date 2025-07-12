const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting ROYAL EARNING Bot System...');

// Start the Telegram bot
const botProcess = spawn('node', [path.join(__dirname, 'bot/index.js')], {
    stdio: 'inherit',
    cwd: __dirname
});

// Start the admin panel server
const adminProcess = spawn('node', [path.join(__dirname, 'admin/server.js')], {
    stdio: 'inherit',
    cwd: __dirname
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down ROYAL EARNING Bot System...');
    botProcess.kill('SIGINT');
    adminProcess.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down ROYAL EARNING Bot System...');
    botProcess.kill('SIGTERM');
    adminProcess.kill('SIGTERM');
    process.exit(0);
});

// Handle bot process exit
botProcess.on('exit', (code) => {
    console.log(`🤖 Bot process exited with code ${code}`);
    if (code !== 0) {
        console.log('🔄 Restarting bot...');
        setTimeout(() => {
            const newBotProcess = spawn('node', [path.join(__dirname, 'bot/index.js')], {
                stdio: 'inherit',
                cwd: __dirname
            });
        }, 5000);
    }
});

// Handle admin process exit
adminProcess.on('exit', (code) => {
    console.log(`📊 Admin panel process exited with code ${code}`);
    if (code !== 0) {
        console.log('🔄 Restarting admin panel...');
        setTimeout(() => {
            const newAdminProcess = spawn('node', [path.join(__dirname, 'admin/server.js')], {
                stdio: 'inherit',
                cwd: __dirname
            });
        }, 5000);
    }
});

console.log('✅ ROYAL EARNING Bot System started successfully!');
console.log('🤖 Telegram Bot: Running');
console.log('📊 Admin Panel: http://localhost:3000/admin');
console.log('👤 Admin Username: royal_earning');
console.log('🔑 Admin Password: Rishi@748');

