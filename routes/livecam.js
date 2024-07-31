const express = require('express');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

// Route für die Live-Stream-Seite
app.get('/live', (req, res) => {
    res.send(`
        <html>
        <body>
            <h1>Live Stream</h1>
            <video id="video" width="640" height="480" controls autoplay></video>
            <script>
                var video = document.getElementById('video');
                var socket = new WebSocket('ws://' + window.location.hostname + ':3000/stream');
                socket.binaryType = 'arraybuffer';
                socket.onmessage = function(event) {
                    var blob = new Blob([event.data], { type: 'video/mp4' });
                    video.src = URL.createObjectURL(blob);
                };
            </script>
        </body>
        </html>
    `);
});

// Route für den WebSocket-Stream
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server, path: '/stream' });

wss.on('connection', (ws) => {
    console.log('Client connected');
    const rpicam = spawn('rpicam-vid', ['-t', '0', '--inline', '-o', '-']);

    rpicam.stdout.on('data', (data) => {
        ws.send(data);
    });

    rpicam.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    rpicam.on('close', (code) => {
        console.log(`rpicam-vid process exited with code ${code}`);
    });

    ws.on('close', () => {
        rpicam.kill();
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
