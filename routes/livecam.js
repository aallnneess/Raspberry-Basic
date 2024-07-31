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

                let mediaSource = new MediaSource();
                video.src = URL.createObjectURL(mediaSource);

                mediaSource.addEventListener('sourceopen', function() {
                    let sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
                    socket.onmessage = function(event) {
                        sourceBuffer.appendBuffer(new Uint8Array(event.data));
                    };
                });
            </script>
        </body>
        </html>
    `);
});

module.exports = router;

