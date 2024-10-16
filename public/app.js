const ws = new WebSocket('ws://localhost:3000'); // Change to your deployed URL in production

ws.onmessage = (event) => {
    const msgData = JSON.parse(event.data);
    if (msgData.type === 'register') {
        if (msgData.success) {
            msgData.messages.forEach(addMessage); // Display previous messages
            document.getElementById('registration-container').style.display = 'none';
            document.getElementById('chat-container').style.display = 'block';
        } else {
            alert('Username already taken, please choose another one.');
        }
    } else if (msgData.username) {
        addMessage(msgData);
    }
};

document.getElementById('registerButton').onclick = () => {
    const username = document.getElementById('usernameInput').value;
    if (username.trim()) {
        ws.send(JSON.stringify({ type: 'register', username }));
    }
};

document.getElementById('sendButton').onclick = () => {
    const input = document.getElementById('messageInput');
    if (input.value.trim()) {
        ws.send(JSON.stringify({ username: document.getElementById('usernameInput').value, text: input.value }));
        input.value = '';
    }
};

function addMessage(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message username-' + msg.username.toLowerCase(); // Assign class based on username
    messageDiv.textContent = `${msg.username}: ${msg.text}`;
    document.getElementById('messages').appendChild(messageDiv);
}
