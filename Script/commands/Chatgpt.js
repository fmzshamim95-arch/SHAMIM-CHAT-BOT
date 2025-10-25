# interactive_ai_messenger_bot.py
from flask import Flask, request
import requests
import openai
import json

app = Flask(__name__)

# ====== Configuration ======
openai.api_key = "YOUR_OPENAI_API_KEY"
PAGE_ACCESS_TOKEN = "YOUR_PAGE_ACCESS_TOKEN"
VERIFY_TOKEN = "YOUR_VERIFY_TOKEN"

# ====== Flask routes ======
@app.route("/", methods=["GET"])
def verify():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")
    if mode == "subscribe" and token == VERIFY_TOKEN:
        return challenge, 200
    return "Verification token mismatch", 403

@app.route("/", methods=["POST"])
def webhook():
    data = request.get_json()
    if "entry" in data:
        for entry in data["entry"]:
            messaging_events = entry.get("messaging", [])
            for event in messaging_events:
                sender_id = event["sender"]["id"]

                if "message" in event:
                    if "text" in event["message"]:
                        user_message = event["message"]["text"]
                        handle_user_text(sender_id, user_message)
                    elif "attachments" in event["message"]:
                        send_text_message(sender_id, "Thanks! I currently respond to text and buttons.")
                elif "postback" in event:
                    payload = event["postback"]["payload"]
                    handle_postback(sender_id, payload)
    return "ok", 200

# ====== Handle user messages ======
def handle_user_text(sender_id, message):
    message_lower = message.lower()
    
    # Quick commands
    if message_lower == "help":
        send_quick_replies(sender_id)
    elif message_lower == "joke":
        send_text_message(sender_id, "Why did the computer go to the doctor? Because it caught a virus! 😄")
    elif message_lower.startswith("image:"):
        prompt = message[6:].strip()
        send_generated_image(sender_id, prompt)
    else:
        response_text = get_gpt_response(message)
        send_text_message(sender_id, response_text)

# ====== Handle Postbacks ======
def handle_postback(sender_id, payload):
    if payload == "GET_STARTED":
        send_text_message(sender_id, "Welcome! Type 'help' to see my features.")
    elif payload == "MORE_INFO":
        send_generic_template(sender_id)

# ====== GPT Chat Integration ======
def get_gpt_response(user_message):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_message}],
            max_tokens=200
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        print("GPT Error:", e)
        return "Sorry, I couldn't process that."

# ====== Image Generation ======
def send_generated_image(recipient_id, prompt):
    try:
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="512x512"
        )
        image_url = response['data'][0]['url']
        send_image_message(recipient_id, image_url)
    except Exception as e:
        print("Image Generation Error:", e)
        send_text_message(recipient_id, "Sorry, I couldn't generate the image.")

# ====== Messenger Messaging Functions ======
def send_text_message(recipient_id, text):
    url = f"https://graph.facebook.com/v16.0/me/messages?access_token={PAGE_ACCESS_TOKEN}"
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": text}
    }
    headers = {"Content-Type": "application/json"}
    requests.post(url, json=payload, headers=headers)

def send_image_message(recipient_id, image_url):
    url = f"https://graph.facebook.com/v16.0/me/messages?access_token={PAGE_ACCESS_TOKEN}"
    payload = {
        "recipient": {"id": recipient_id},
        "message": {
            "attachment": {
                "type": "image",
                "payload": {"url": image_url, "is_reusable": True}
            }
        }
    }
    headers = {"Content-Type": "application/json"}
    requests.post(url, json=payload, headers=headers)

def send_quick_replies(recipient_id):
    url = f"https://graph.facebook.com/v16.0/me/messages?access_token={PAGE_ACCESS_TOKEN}"
    payload = {
        "recipient": {"id": recipient_id},
        "message": {
            "text": "Choose an option:",
            "quick_replies": [
                {"content_type": "text", "title": "Joke", "payload": "JOKE"},
                {"content_type": "text", "title": "Info", "payload": "INFO"},
                {"content_type": "text", "title": "Generate Image", "payload": "IMAGE_PROMPT"}
            ]
        }
    }
    headers = {"Content-Type": "application/json"}
    requests.post(url, json=payload, headers=headers)

def send_generic_template(recipient_id):
    url = f"https://graph.facebook.com/v16.0/me/messages?access_token={PAGE_ACCESS_TOKEN}"
    payload = {
        "recipient": {"id": recipient_id},
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Interactive AI Bot",
                            "image_url": "https://i.imgur.com/8Km9tLL.png",
                            "subtitle": "Chat, generate images, tell jokes, and more!",
                            "buttons": [
                                {"type": "postback", "title": "More Info", "payload": "MORE_INFO"},
                                {"type": "web_url", "title": "OpenAI", "url": "https://openai.com"}
                            ]
                        }
                    ]
                }
            }
        }
    }
    headers = {"Content-Type": "application/json"}
    requests.post(url, json=payload, headers=headers)

# ====== Run Server ======
if __name__ == "__main__":
    app.run(port=5000, debug=True)
