// const express = require('express');
// const router = express.Router();
// const { spawn } = require('child_process');
//
// router.get('/', (req, res) => {
//     res.send('Hello World');
// });
//
// module.exports = router;

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// Route für die Live-Stream-Seite
router.get('/', (req, res) => {
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

module.exports = router;
