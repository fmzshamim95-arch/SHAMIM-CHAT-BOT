from flask import Flask, request
import requests
import random

app = Flask(__name__)

ACCESS_TOKEN = "YOUR_PAGE_ACCESS_TOKEN"  # আপনার মেসেঞ্জার পেজ টোকেন
VERIFY_TOKEN = "YOUR_VERIFY_TOKEN"       # যেকোনো সিকিউরিটি টোকেন

# উদাহরণ ইসলামিক কনটেন্ট ডেটা
DOAAS = [
    "اللَّهُمَّ اجعلنا من الذين يستمعون القول فيتبعون أحسنه",
    "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
    "اللهم إني أعوذ بك من الهم والحزن"
]

HADITHS = [
    "إنما الأعمال بالنيات",
    "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه",
    "من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت"
]

QURAN_VERSES = [
    "وَعَسَى أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَكُمْ",
    "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا"
]

# Messenger verification
@app.route("/webhook", methods=["GET"])
def verify():
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")
    if token == VERIFY_TOKEN:
        return challenge
    return "Invalid verification token"

# Messenger webhook to receive messages
@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    
    if "entry" in data:
        for entry in data["entry"]:
            if "messaging" in entry:
                for message_event in entry["messaging"]:
                    sender_id = message_event["sender"]["id"]
                    if "message" in message_event and "text" in message_event["message"]:
                        user_message = message_event["message"]["text"].lower()
                        handle_message(sender_id, user_message)
    return "ok", 200

# Handle incoming messages
def handle_message(sender_id, message):
    if "doa" in message:
        send_text(sender_id, random.choice(DOAAS))
    elif "hadith" in message:
        send_text(sender_id, random.choice(HADITHS))
    elif "quran" in message or "ayat" in message:
        send_text(sender_id, random.choice(QURAN_VERSES))
    else:
        send_text(sender_id, "আপনি 'doa', 'hadith' বা 'quran' লিখলে ইসলামিক কনটেন্ট পাবেন।")

# Send text message
def send_text(sender_id, text):
    url = f"https://graph.facebook.com/v16.0/me/messages?access_token={ACCESS_TOKEN}"
    payload = {
        "recipient": {"id": sender_id},
        "message": {"text": text}
    }
    requests.post(url, json=payload)

if __name__ == "__main__":
    app.run(port=5000)
