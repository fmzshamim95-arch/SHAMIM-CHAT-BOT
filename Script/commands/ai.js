const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "1.0.2",
    credit: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "AI chat with reply or image analysis",
    cooldowns: 0,
    hasPermssion: 0,
    commandCategory: "google",
    usages: {
      en: "{pn} your message or reply to image"
    }
  },

  run: async ({ api, args, event }) => {
    const input = args.join(" ");
    const encodedApi = "aHR0cHM6Ly9hcGlzLWtlaXRoLnZlcmNlbC5hcHAvYWkvZGVlcHNlZWtWMz9xPQ==";
    const apiUrl = Buffer.from(encodedApi, "base64").toString("utf-8");

    try {
      let responseText = "";

      // যদি user কোনো মেসেজ reply করে
      if (event.type === "message_reply") {
        const imageUrl = event.messageReply.attachments?.[0]?.url;

        if (imageUrl) {
          // Image analysis POST request
          const res = await axios.post(apiUrl, {
            image: imageUrl,
            prompt: input || "Describe this image."
          });
          responseText = res.data?.result || res.data?.response || res.data?.message || "AI couldn't generate a response.";
        } else if (input) {
          // Reply করা হলেও text আছে
          const res = await axios.get(apiUrl, { params: { q: input } });
          responseText = res.data?.result || res.data?.response || res.data?.message || "AI couldn't respond.";
        } else {
          responseText = "Please reply to an image or type a message.";
        }

      } else {
        // সাধারণ text command
        if (!input) {
          responseText = "Hey! I'm your AI Bot 🤖\nReply to a message or type your query.";
        } else {
          const res = await axios.get(apiUrl, { params: { q: input } });
          responseText = res.data?.result || res.data?.response || res.data?.message || "AI couldn't respond.";
        }
      }

      api.sendMessage(responseText, event.threadID, event.messageID);

    } catch (err) {
      console.error("AI Error:", err.message);
      api.sendMessage("Oops! Something went wrong while processing your request.", event.threadID, event.messageID);
    }
  }
};
