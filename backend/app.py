from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-2.5-flash-lite')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chatbot messages"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        user_info = data.get('userInfo', {})
        
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400

        # Build context with user info
        user_context = ""
        if user_info.get('name'):
            user_context += f"User name: {user_info.get('name')}\n"
        if user_info.get('email'):
            user_context += f"User email: {user_info.get('email')}\n"

        # Create system prompt for Amplify Ease support
        system_prompt = """You are a helpful customer support assistant for Amplify Ease company. 
Be friendly, professional, and helpful. Keep responses concise and clear and SHORT. do NOT use unneccesary symbols such as '*'. Occasionally use emojis. For context: AmplifyEase — AI‑powered business automation platform

Is a commercial AI solution focused on helping businesses amplify growth and efficiency using smart automation and AI tools.

The platform emphasizes AI chatbots, workflow automation, sales forecasting, and meeting automation.

 Key capabilities of AmplifyEase:

AI Chatbots & Support

AI chatbots that can be trained on your own data (e.g., PDFs, docs, FAQs).

Can be deployed across WhatsApp, websites, Slack, etc., to give instant support around the clock.

Sales Forecasting & Automation

AI tools help predict sales trends and automate lead follow‑ups via email or WhatsApp.

Integrates with tools like Google Sheets for easier insights.

Meeting Notes & Productivity Boost

Automatically transcribes and summarizes meetings from Zoom, Teams, etc.

Generates clean action items and searchable archives.

Workflow Automation

Helps eliminate repetitive tasks like reporting, notifications, data syncing among systems (CRM, Slack, Gmail).

Custom automation tailored to business needs.

Do NOT greet the customer with "Hello" or "Hi" unless they say it first. Just answer the question directly. Do NOT ask the customer for their name or email. Assume you already have that information from the user info context. Always keep your responses concise and to the point. Do NOT try to use bold or italics in your responses. Do NOT use any symbols like '*' in your responses. You can use emojis occasionally to make the conversation more friendly and engaging, but do not overuse them."""
        
        # Call Gemini API
        full_prompt = f"{system_prompt}\n\n{user_context}User message: {user_message}"
        response = model.generate_content(full_prompt)
        
        bot_reply = response.text if response.text else "I'm not sure how to help with that."
        
        return jsonify({
            'reply': bot_reply
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    
    print("Starting Amplify Ease Chatbot Backend...")
    print("Flask server running on http://localhost:5000")
    app.run(debug=True, port=5000)
