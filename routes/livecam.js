const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// router.get('/', (req, res) => {
//     res.send('Hello from Video Stream');
// });

router.get('/', (req, res) => {
    res.send('<html><body><video src="/liveCam/stream" controls autoplay></video></body></html>');
});

router.get('/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Transfer-Encoding': 'chunked'
    });

    const rpicam = spawn('rpicam-vid', ['-t', '0', '-o', '-', '--inline']);
    rpicam.stdout.pipe(res);

    req.on('close', () => {
        rpicam.kill();
    });
});

module.exports = router;