const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

let clients = {};
let messages = [];

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const msgData = JSON.parse(message);

        if (msgData.type === 'register') {
            if (!clients[msgData.username]) {
                clients[msgData.username] = ws;
                ws.send(JSON.stringify({ type: 'register', success: true, messages }));
                broadcast({ username: msgData.username, type: 'new_user' });
            } else {
                ws.send(JSON.stringify({ type: 'register', success: false }));
            }
        } else {
            messages.push({ username: msgData.username, text: msgData.text });
            broadcast({ username: msgData.username, text: msgData.text });
        }
    });

    ws.on('close', () => {
        for (const username in clients) {
            if (clients[username] === ws) {
                delete clients[username];
                broadcast({ username, type: 'user_left' });
                break;
            }
        }
    });
});

function broadcast(msg) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
