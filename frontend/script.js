const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const widgetToggle = document.getElementById('widgetToggle');
const closeBtn = document.getElementById('closeBtn');
const chatWidget = document.getElementById('chatWidget');

// Track user info
let userInfo = {
    name: null,
    email: null,
    interest: null,
    companySize: null,
    timeline: null
};

let chatState = 'waiting_name';

// Widget toggle handlers
widgetToggle.addEventListener('click', () => {
    chatWidget.classList.add('open');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

closeBtn.addEventListener('click', () => {
    chatWidget.classList.remove('open');
});

// Add initial greeting when widget loads
addBotMessage('Hi! 👋 I\'m Amplify Ease support assistant. I\'m here to help you today! What\'s your name?');

// Send message on button click
sendBtn.addEventListener('click', sendMessage);

// Send message on Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;

    // Immediately disable button to prevent double-sends
    sendBtn.disabled = true;

    // Add user message to UI
    addUserMessage(message);
    userInput.value = '';
    userInput.focus();

    // Send to backend Gemini API
    sendToBackend(message);
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function showButtons(options) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'button-options';
    options.forEach((option) => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = option;
        btn.onclick = () => {
            addUserMessage(option);
            sendToBackend(option);
        };
        buttonsDiv.appendChild(btn);
    });
    messagesDiv.appendChild(buttonsDiv);
    scrollToBottom();
}

function handleUserInfo(userMessage) {
    // Collect name
    if (chatState === 'waiting_name') {
        userInfo.name = userMessage;
        chatState = 'waiting_email';
        addBotMessage(`Nice to meet you, ${userMessage}! 😊 Could you please provide your email address?`);
        return true;
    }
    
    // Collect email
    if (chatState === 'waiting_email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(userMessage)) {
            userInfo.email = userMessage;
            chatState = 'product_selection';
            addBotMessage(`Perfect! I've saved your email: ${userMessage}. 📧\n\nWhat are you interested in?`);
            showButtons([
                '💼 Custom AI Solutions',
                '📈 Sales Automation',
                '⚡ Workflow Automation',
                '💬 AI Chatbots',
                ' Other'
            ]);
            return true;
        } else {
            addBotMessage('That doesn\'t look like a valid email. Please try again.');
            return true;
        }
    }
    
    // If they selected a product option, ask about company size
    if (chatState === 'product_selection') {
        userInfo.interest = userMessage;
        chatState = 'company_size';
        addBotMessage(`Got it! ${userMessage}\n\nWhat's the size of your company?`);
        showButtons([
            '👤 Startup (1-10)',
            '🏢 Small (11-50)',
            '🏛️ Medium (51-500)',
            '🌍 Enterprise (500+)'
        ]);
        return true;
    }
    
    // If they selected company size, ask about timeline
    if (chatState === 'company_size') {
        userInfo.companySize = userMessage;
        chatState = 'ready_to_chat';
        addBotMessage(`Excellent! ${userMessage}\n\nWhen are you looking to get started?`);
        showButtons([
            '⚡ ASAP (1-2 weeks)',
            '📅 Soon (1 month)',
            '🗓️ Flexible (2-3 months)',
            '🤔 Still exploring'
        ]);
        return true;
    }
    
    // If they selected timeline, we're ready for regular chat
    if (chatState === 'ready_to_chat') {
        userInfo.timeline = userMessage;
        chatState = 'chatting';
        addBotMessage(`Perfect! ${userMessage}\n\nThanks for sharing that info! Feel free to ask me anything your query.`);
        return true;
    }
    
    return false;
}

async function sendToBackend(userMessage) {
    try {
        // Check if we need to collect user info
        if (handleUserInfo(userMessage)) {
            sendBtn.disabled = false;  // Re-enable after info collection step
            return;
        }
        
        // If we're still in info collection phase, don't send to backend
        if (chatState === 'product_selection' || chatState === 'company_size' || chatState === 'ready_to_chat') {
            sendBtn.disabled = false;  // Re-enable for next step
            return;
        }
        
        // Now we're in actual chat mode - make API call
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: userMessage,
                userInfo: userInfo
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        addBotMessage(data.reply);
        sendBtn.disabled = false;  // Re-enable after API response
    } catch (error) {
        console.error('Error:', error);
        addBotMessage('Sorry, I encountered an error. Please try again.');
        sendBtn.disabled = false;  // Re-enable on error
    }
}

function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get user info when needed (for display in messages)
function getUserDisplayInfo() {
    if (userInfo.name && userInfo.email) {
        return `${userInfo.name} (${userInfo.email})`;
    } else if (userInfo.name) {
        return userInfo.name;
    }
    return 'Guest';
}
