const serverURL = "https://it3049c-chat.fly.dev/messages";

// Get references to HTML elements
const nameInput = document.getElementById("my-name-input");
const messageInput = document.getElementById("my-message-input");  // Fixed selector
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

// Function to format messages
function formatMessage(message, myName) {
    const time = new Date(message.timestamp);
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const isMine = myName === message.sender;
    return `
        <div class="${isMine ? "mine" : "yours"} messages">
            <div class="message">${message.text}</div>
            <div class="sender-info">${isMine ? formattedTime : message.sender + " " + formattedTime}</div>
        </div>
    `;
}

// Fetch messages from the server
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

// Update messages in the chatbox
async function updateMessages() {
    const messages = await fetchMessages();
    chatBox.innerHTML = messages.map(msg => formatMessage(msg, nameInput.value)).join("");
}

// Send a new message
async function sendMessage(username, text) {
    const newMessage = {
        sender: username,
        text: text,
        timestamp: new Date().toISOString()  // Use ISO format for Playwright test validation
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
        sendMessage(sender, message);
        messageInput.value = "";
    } else {
        alert("Please enter your name and a message before sending.");
    }
});

// Update messages on load and set interval for updates
updateMessages();
setInterval(updateMessages, 10000);
