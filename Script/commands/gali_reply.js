const fs = require("fs");
module.exports.config = {
	name: "gali",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", 
	description: "no prefix",
	commandCategory: "no prefix",
	usages: "abal",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Shamim Bokasoda")==0 || event.body.indexOf("Shamim mc")==0 || event.body.indexOf("chod")==0 || event.body.indexOf("Shamim")==0 || event.body.indexOf("bc")==0 || event.body.indexOf("Shamim re chudi")==0 || event.body.indexOf("shamim re chod")==0 || event.body.indexOf("Shamim Abal")==0 || event.body.indexOf("Shamim Boakachoda")==0 || event.body.indexOf("Shamim madarchod")==0 || event.body.indexOf("Shamim re chudi")==0 || event.body.indexOf("shamim Bokachoda")==0) {
		var msg = {
				body: "তোর মতো বোকাচোদা রে আমার বস শামিম চু*দা বাদ দিছে🤣\nশামিম এখন আর hetars চুষে না🥱😈",
			}
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
