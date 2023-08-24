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
  if (message) {
    socket.emit('chat message', message); // Emit the message content
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
  const slashCommands = {
    "/clear": {
      description: "Clear all messages",
      execute: () => {
        while (messages?.firstChild) {
          messages.removeChild(messages.firstChild);
        }
      },
    },
  
    "/random": {
      description: "Generate a random number",
      execute: () => {
        const randomNumber = Math.floor(Math.random() * 100000);
        addClientOnlyMessageToChat(
          `🧑‍🏫 Your random number is ${randomNumber} (only you can view this message)`
        );
      },
    },
  };
  
  // Handle slash commands
  if (message in slashCommands) {
    slashCommands[message].execute();
    return scrollToBottom();
  }
  return message;
}







