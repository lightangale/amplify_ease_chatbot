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


