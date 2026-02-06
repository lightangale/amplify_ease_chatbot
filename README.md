# Amplify Ease Chatbot - Simple Setup

Clean, simple chatbot using:
- **Frontend**: Plain HTML, CSS, JavaScript
- **Backend**: Python Flask
- **AI**: Google Gemini 2.5 Flash Lite API

## Quick Start

### 1. Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

### 3. Add API Key

Edit `.env` file in root:
```
GEMINI_API_KEY=your_api_key_here
```

### 4. Start Backend

```bash
python app.py
```

You should see:
```
Starting Amplify Ease Chatbot Backend...
Flask server running on http://localhost:5000
```

### 5. Start Frontend

Open `frontend/index.html` in your browser or serve it:

```bash
# Using Python
cd frontend
python -m http.server 8000

# Visit: http://localhost:8000
```

## Project Structure

```
amplify_ease_chatbot/
├── frontend/
│   ├── index.html      # Widget page
│   ├── styles.css      # Styling
│   └── script.js       # JavaScript logic
├── backend/
│   ├── app.py          # Flask app with Gemini API
│   └── requirements.txt # Python dependencies
├── .env                # API key (your own)
└── .gitignore          # Git ignore
```

## How It Works

1. User types message in frontend
2. Frontend sends to backend API (`/api/chat`)
3. Backend sends to Gemini API
4. Gemini generates response
5. Backend returns response to frontend
6. Frontend displays in chat

## Features

✅ Clean, simple HTML/CSS/JS interface
✅ AI-powered responses via Gemini
✅ CORS enabled for frontend-backend communication
✅ Error handling
✅ Mobile responsive design

## Troubleshooting

### "GEMINI_API_KEY not found"
- Make sure .env file is in root directory
- Make sure you added your API key: `GEMINI_API_KEY=xxxx`

### "Connection refused" error
- Make sure Flask backend is running: `python app.py`
- Make sure it's on port 5000

### No responses from bot
- Check browser console for errors (F12)
- Make sure API key is valid
- Check Flask server logs

## API Endpoint

**POST** `/api/chat`

Request:
```json
{
  "message": "Hello, tell me about your product"
}
```

Response:
```json
{
  "reply": "Hello! Here's information about our product..."
}
```

Done! 🎉
