const serverURL = "https://it3049c-chat.fly.dev/messages";

// Get references to HTML elements
const nameInput = document.getElementById("my-name-input");
const messageInput = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

// Function to format messages
function formatMessage(message, myName) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${String(time.getMinutes()).padStart(2, "0")}`;

  if (myName === message.sender) {
    return `
      <div class="mine messages">
        <div class="message">${message.text}</div>
        <div class="sender-info">${formattedTime}</div>
      </div>
    `;
  } else {
    return `
      <div class="yours messages">
        <div class="message">${message.text}</div>
        <div class="sender-info">${message.sender} ${formattedTime}</div>
      </div>
    `;
  }
}

// Function to fetch messages from the server
async function fetchMessages() {
  try {
    const response = await fetch(serverURL);
    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Function to update chat messages in the UI
async function updateMessages() {
  const messages = await fetchMessages();
  let formattedMessages = "";
  messages.forEach(message => {
    formattedMessages += formatMessage(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
}

// Function to send a new message
async function sendMessages(username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date().getTime()
  };

  try {
    await fetch(serverURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage)
    });
    updateMessages();
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Event listener for the send button
sendButton.addEventListener("click", function (event) {
  event.preventDefault();
  const sender = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (sender && message) {
    sendMessages(sender, message);
    messageInput.value = "";
  } else {
    alert("Please enter your name and a message before sending.");
  }
});

// Update messages when the page loads
updateMessages();

// Auto-refresh messages every 10 seconds
const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);
