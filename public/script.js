const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit('chat message', message); // Emit the message content
    input.value = '';
  }
});

socket.on('chat message', function(data) {
  addMessage('User', data, false); // Assuming 'User' is the sender for received messages
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







