const socket = io();
// Get DOM elements
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const nicknameHeader = document.getElementById('nickname-header');
const onlineCount = document.getElementById('online-count');

let nickname = prompt('Enter your nickname:');
nicknameHeader.textContent = `Welcome, ${nickname}`;

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const message = input.value.trim();
  if (message.startsWith('/')) {
    handleSlashCommand(message);
  } else if (message) {
    socket.emit('chat message', message);
    input.value = '';
  }
});

socket.on('chat message', function(data) {
  addMessage(nickname,data.message, false); // Assuming 'User' is the sender for received messages
});
socket.on('user count', function(count) {
  document.getElementById('online-count').textContent = count;
});

function addMessage(sender, message, isSent) {
  // Automatically replace keywords with emojis
  const messageWithEmojis = replaceKeywordsWithEmojis(message);

  const messageElement = document.createElement('li');
  messageElement.classList.add(isSent ? 'message-sent' : 'message-received');

  const senderElement = document.createElement('div');
  senderElement.classList.add('message-sender');
  senderElement.innerText = sender;

  const contentElement = document.createElement('div');
  contentElement.classList.add('message-content');
  contentElement.innerText = messageWithEmojis;

  const timestampElement = document.createElement('div');
  timestampElement.classList.add('message-timestamp');
  timestampElement.innerText = new Date().toLocaleTimeString();

  messageElement.appendChild(senderElement);
  messageElement.appendChild(contentElement);
  messageElement.appendChild(timestampElement);
  messages.appendChild(messageElement);

  messages.scrollTop = messages.scrollHeight;
}

function replaceKeywordsWithEmojis(message) {
  // Define a list of keyword replacements
  const keywordReplacements = {
    'hey': '👋',
    'smile': '😊',
    'heart': '❤️',
    'love': '❤️',
    'react': '⚛️',
    'woah': "😲",
    'hey': "👋",
    'lol': "😂",
    'like': "❤️",
    'congratulations': "🎉",
    // Add more keyword replacements here
  };

  // Loop through keyword replacements and replace in the message
  for (const keyword in keywordReplacements) {
    if (keywordReplacements.hasOwnProperty(keyword)) {
      const emoji = keywordReplacements[keyword];
      const caseInsensitiveKeyword = new RegExp(keyword, 'gi'); // 'gi' for case-insensitive search
      message = message.replace(caseInsensitiveKeyword, emoji);
    }
  }
  return message;
}  

// Handle slash commands
function handleSlashCommand(message) {
  if (message === '/random') {
    const randomNumber = Math.floor(Math.random() * 1000000000000); // Generate a random number between 0 and 99
    addSystemMessage(`🤖 System: The random number is ${randomNumber}`);
  } else if (message === '/clear') {
    clearMessages();
  } else if (message === '/help') {
    showHelpMessage()  
  } else {
    addMessage('You', command, true);
  }
  
}
function showHelpMessage() {
  const helpText = `
    🤖 System: Slash Commands:
    /random - Generate a random number
    /clear - Clear all messages
    /help - Show this help message
  `;
  addMessage('System', helpText, false);
}
// Add a system message to the chat
function addSystemMessage(message) {
  const messageElement = document.createElement('li');
  messageElement.classList.add('message-system');

  const contentElement = document.createElement('div');
  contentElement.classList.add('message-content');
  contentElement.innerText = message;

  messageElement.appendChild(contentElement);
  messages.appendChild(messageElement);

  messages.scrollTop = messages.scrollHeight;
}

// Clear all messages
function clearMessages() {
  messages.innerHTML = '';
}



 
  









