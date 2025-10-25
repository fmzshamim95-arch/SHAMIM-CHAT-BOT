import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

# Facebook Messenger token
VERIFY_TOKEN = 'YOUR_VERIFY_TOKEN'
PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN'

# Google Custom Search API info
GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'
CX = 'YOUR_CUSTOM_SEARCH_ENGINE_ID'  # Custom Search Engine ID

# Webhook verification
@app.route('/webhook', methods=['GET'])
def verify():
    token_sent = request.args.get("hub.verify_token")
    if token_sent == VERIFY_TOKEN:
        return request.args.get("hub.challenge")
    return "Invalid verification token"

# Receiving messages
@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json()
    if data['object'] == 'page':
        for entry in data['entry']:
            messaging = entry['messaging']
            for message_event in messaging:
                if message_event.get('message'):
                    sender_id = message_event['sender']['id']
                    message_text = message_event['message'].get('text')
                    if message_text:
                        # Google Images search
                        image_url = search_image_google(message_text)
                        if image_url:
                            send_image(sender_id, image_url)
    return "ok", 200

# Google Image search function
def search_image_google(query):
    url = f"https://www.googleapis.com/customsearch/v1?q={query}&cx={CX}&searchType=image&num=1&key={GOOGLE_API_KEY}"
    response = requests.get(url).json()
    if 'items' in response:
        return response['items'][0]['link']
    return None

# Send image to Messenger
def send_image(recipient_id, image_url):
    post_url = f"https://graph.facebook.com/v17.0/me/messages?access_token={PAGE_ACCESS_TOKEN}"
    response_msg = {
        "recipient": {"id": recipient_id},
        "message": {"attachment": {"type": "image", "payload": {"url": image_url, "is_reusable": True}}}
    }
    requests.post(post_url, json=response_msg)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
