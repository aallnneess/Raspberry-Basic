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

                let sourceBuffer;
                mediaSource.addEventListener('sourceopen', function() {
                    sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
                    sourceBuffer.mode = 'sequence';

                    sourceBuffer.addEventListener('updateend', function() {
                        if (mediaSource.readyState === 'open' && socket.readyState === WebSocket.CLOSED) {
                            mediaSource.endOfStream();
                        }
                    });

                    socket.onmessage = function(event) {
                        if (sourceBuffer && !sourceBuffer.updating) {
                            try {
                                sourceBuffer.appendBuffer(new Uint8Array(event.data));
                            } catch (e) {
                                console.error('Error appending buffer:', e);
                            }
                        }
                    };
                });

                mediaSource.addEventListener('sourceended', function() {
                    console.log('MediaSource ended');
                });

                socket.onerror = function(error) {
                    console.error('WebSocket error:', error);
                };

                socket.onclose = function(event) {
                    console.log('WebSocket closed:', event);
                    if (mediaSource.readyState === 'open' && sourceBuffer && !sourceBuffer.updating) {
                        mediaSource.endOfStream();
                    }
                };
            </script>
        </body>
        </html>
    `);
});

module.exports = router;

