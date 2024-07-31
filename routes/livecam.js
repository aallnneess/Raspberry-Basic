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

    console.log('Starting rpicam-vid...');
    const rpicam = spawn('rpicam-vid', ['-t', '0', '-o', '-', '--inline']);

    rpicam.stdout.pipe(res);

    rpicam.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    rpicam.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    req.on('close', () => {
        console.log('Request closed, killing rpicam-vid...');
        rpicam.kill();
    });
});

module.exports = router;