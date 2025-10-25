module.exports.config = {
    name: "slot",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "─꯭─⃝‌‌➳𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭",
    description: "Fair play slot game with balance transfer",
    commandCategory: "game-sp",
    usages: "[number coin required]",
    cooldowns: 5,
};

module.exports.languages = {
    "vi": {
        "missingInput": "[ SLOT ] Số tiền đặt cược không được để trống hoặc là số âm",
        "moneyBetNotEnough": "[ SLOT ] Số tiền bạn đặt lớn hơn hoặc bằng số dư của bạn!",
        "limitBet": "[ SLOT ] Số coin đặt không được dưới 50$!",
        "returnWin": "🎰 %1 | %2 | %3 🎰\nBạn đã thắng với %4$",
        "returnLose": "🎰 %1 | %2 | %3 🎰\nBạn đã thua và mất %4$",
        "transferSuccess": "💸 Bạn đã chuyển %1$ tới %2 thành công!"
    },
    "en": {
        "missingInput": "[ SLOT ] The bet money must not be blank or a negative number",
        "moneyBetNotEnough": "[ SLOT ] The money you betted is bigger than your balance!",
        "limitBet": "[ SLOT ] Your bet is too low, the minimum is 50$",
        "returnWin": "🎰 %1 | %2 | %3 🎰\nYou won with %4$",
        "returnLose": "🎰 %1 | %2 | %3 🎰\nYou lost and lost %4$",
        "transferSuccess": "💸 You have successfully transferred %1$ to %2!"
    }
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;

    const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const moneyUser = (await getData(senderID)).money;

    // যদি args[0] == "transfer" হয়, তাহলে ট্রান্সফার ফাংশন কল হবে
    if (args[0] == "transfer") {
        let targetID = args[1]; // ইউজারের আইডি যাকে পাঠাবে
        let transferAmount = parseInt(args[2]);
        if (!targetID || isNaN(transferAmount) || transferAmount <= 0) 
            return api.sendMessage("[ SLOT ] Invalid transfer command!", threadID, messageID);
        if (transferAmount > moneyUser) 
            return api.sendMessage("[ SLOT ] You don't have enough money to transfer!", threadID, messageID);

        await decreaseMoney(senderID, transferAmount);
        await increaseMoney(targetID, transferAmount);
        return api.sendMessage(getText("transferSuccess", transferAmount, targetID), threadID, messageID);
    }

    // স্লট গেম
    let moneyBet = parseInt(args[0]);
    if (isNaN(moneyBet) || moneyBet <= 0) 
        return api.sendMessage(getText("missingInput"), threadID, messageID);
    if (moneyBet > moneyUser) 
        return api.sendMessage(getText("moneyBetNotEnough"), threadID, messageID);
    if (moneyBet < 50) 
        return api.sendMessage(getText("limitBet"), threadID, messageID);

    let number = [], win = false;
    for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);

    if (number[0] == number[1] && number[1] == number[2]) {
        moneyBet *= 9;
        win = true;
    }
    else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
        moneyBet *= 2;
        win = true;
    }

    if (win) {
        await increaseMoney(senderID, moneyBet);
        api.sendMessage(`─꯭─⃝‌‌➳𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭\n` + 
            getText("returnWin", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet), threadID, messageID);
    } else {
        await decreaseMoney(senderID, moneyBet);
        api.sendMessage(`─꯭─⃝‌‌➳𝐒𝐡𝐚𝐦𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭\n` + 
            getText("returnLose", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet), threadID, messageID);
    }
		}
