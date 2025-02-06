// Get references to HTML elements
const nameInput = document.getElementById("my-name-input");
const messageInput = document.getElementById("my-message-input");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

// Function to format messages
function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
    return `
      <div class="mine messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${formattedTime}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="yours messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${message.sender} ${formattedTime}
        </div>
      </div>
    `;
  }
}

// Fetch messages from the server
function fetchMessages() {
  return [
    {
      id: 1,
      text: "This is my message",
      sender: "Uyen Duong",
      timestamp: 1537410673072
    },
    {
      id: 2,
      text: "This is another message",
      sender: "Uyen Duong",
      timestamp: 1537410673072
    },
    {
      id: 3,
      text: "This is a message from someone else",
      sender: "Tuan Nguyen",
      timestamp: 1537410673072
    }
  ];
}

// Update messages in the chatbox
function updateMessages() {
  const messages = fetchMessages();
  let formattedMessages = "";
  messages.forEach(message => {
    formattedMessages += formatMessage(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
}

// Send a new message
sendButton.addEventListener("click", function(event) {
  event.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;
  sendMessages(sender, message);
  myMessage.value = "";
});

// Getting messages with .then callbacks
const serverURL = `https://it3049c-chat.fly.dev/messages`;

function fetchMessages() {
  return fetch(serverURL)
    .then(response => response.json());
}

//Getting messages with async/ await
async function fetchMessages() {
  const response = await fetch(serverURL);
  return response.json();
}

// Sending messages
function sendMessages(username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date()
  };

  fetch(serverURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMessage)
  });
}


// Update messages on load and set interval for updates
updateMessages();
setInterval(updateMessages, 10000);
