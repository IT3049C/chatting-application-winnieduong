// References to HTML elements
const nameInput = document.getElementById("my-name-input");
const messageInput = document.getElementById("my-message-input");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

// Server URLs
const SERVER_URL = "https://it3049c-chat.fly.dev";
const MESSAGES_URL = `${SERVER_URL}/messages`;

// Interval timing constant
const MILLISECONDS_IN_TEN_SECONDS = 10000;

// Function to format a message into HTML
function formatMessage(message) {
    const formattedTime = new Date(message.timestamp).toLocaleTimeString();
    const isMine = message.sender === nameInput.value.trim();
    const messageClass = isMine ? "mine" : "yours";

    return `
        <div class="${messageClass} messages">
            <div class="message">${message.text}</div>
            ${isMine ? "" : `<div class="sender-info">${message.sender} ${formattedTime}</div>`}
        </div>
    `;
}

// Function to fetch messages from the server
async function fetchMessages() {
    try {
        const response = await fetch(MESSAGES_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch messages.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}

// Function to update messages in the chatbox
async function updateMessagesInChatBox() {
    const messages = await fetchMessages();
    console.log("Fetched Messages:", messages); // Logging to inspect structure
    chatBox.innerHTML = messages.map(formatMessage).join("");
}

// Function to send a message to the server
async function sendMessage() {
    const senderName = nameInput.value.trim();
    const messageText = messageInput.value.trim();

    if (!senderName || !messageText) {
        alert("Please enter both your name and a message.");
        return;
    }

    const newMessage = {
        sender: senderName,
        text: messageText,
        timestamp: new Date().toISOString() // Using ISO format
    };

    try {
        const response = await fetch(MESSAGES_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newMessage)
        });

        if (!response.ok) {
            throw new Error("Failed to send message.");
        }

        // Wait for the message to appear on the server before updating UI
        setTimeout(updateMessagesInChatBox, 1000);
        messageInput.value = ""; // Clear input after sending
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Event listener for send button click
sendButton.addEventListener("click", sendMessage);

// Initial update of messages in chatbox
updateMessagesInChatBox();

// Set interval to fetch messages every 10 seconds
setInterval(updateMessagesInChatBox, MILLISECONDS_IN_TEN_SECONDS);
