const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');

module.exports.config = {
    name: 'autosent',
    version: '11.0.0',
    hasPermssion: 0,
    credits: 'Shahadat Islam',
    description: 'Automatically sends stylish messages at scheduled times (BD Time)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

const messages = [
    { time: '12:00 AM', message: 'এখন সময় রাত 12:00 AM ⏳ ঘুমিয়ে পড় Bby 😴💤❤️' },
    { time: '1:00 PM', message: 'এখন সময় দুপুর 1:00 PM ⏳ মোবাইল রাখো, খাবার খাও 🍽️😋' },
    { time: '8:00 PM', message: 'এখন সময় রাত 8:00 PM ⏳ রাতের খাবার সময় 🍽️😋' }
];

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00FF00")("╔════════════════════════════════════════════╗"));
    console.log(chalk.bold.hex("#00FF00")("║   ✦✧ 𝗔𝘂𝘁𝗼𝗦𝗲𝗻𝘁 𝗕𝗼𝘁 𝗟𝗼𝗮𝗱𝗲𝗱 ✧✦      ║"));
    console.log(chalk.bold.hex("#00FF00")("║      ⏰ 𝗕𝗗 𝗧𝗜𝗠𝗘 𝗦𝗰𝗵𝗲𝗱𝘂𝗹𝗲 ⏰         ║"));
    console.log(chalk.bold.hex("#00FF00")("╚════════════════════════════════════════════╝\n"));

    messages.forEach(({ time, message }) => {
        const currentDate = moment().tz('Asia/Dhaka').format('DD-MM-YYYY');

        const [hour, minute, period] = time.split(/[: ]/);
        let hour24 = parseInt(hour, 10);
        if (period === 'PM' && hour !== '12') hour24 += 12;
        else if (period === 'AM' && hour === '12') hour24 = 0;

        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Dhaka';
        rule.hour = hour24;
        rule.minute = parseInt(minute, 10);

        schedule.scheduleJob(rule, () => {
            if (!global.data?.allThreadID) return;
            global.data.allThreadID.forEach(threadID => {
                api.sendMessage(message, threadID, (error) => {
                    if (error) console.error(`Failed to send message to ${threadID}:`, error);
                });
            });
        });

        // ────────────── Premium Big Stylish Box ──────────────
        console.log(chalk.hex("#FFD700")("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        console.log(chalk.hex("#00FFFF")("🕒 ") + chalk.hex("#FF4500")(`[ ${time} ]`) + chalk.hex("#8A2BE2")(" ⏳"));
        console.log(chalk.hex("#FFA500")("🍽️ ") + chalk.hex("#FF69B4")(message));
        console.log(chalk.hex("#ADFF2F")(`📅 DATE : ${currentDate}`));
        console.log(chalk.hex("#00CED1")("🤖 Bot Owner : 𝐒𝐡𝐚𝐦𝐢𝐦"));
        console.log(chalk.hex("#FFD700")("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
    });

    console.log(chalk.hex("#FF69B4")("─꯭─⃝‌‌➳𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 ✦🌙\n"));
};

module.exports.run = () => {
    // Main logic handled in onLoad
};
