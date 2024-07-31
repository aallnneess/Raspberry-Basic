const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

router.get('/', (req, res) => {
    res.send('<html><body><video src="/liveCam/stream" controls autoplay></video></body></html>');
});

router.get('/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'inline',
        'Transfer-Encoding': 'chunked'
    });

    console.log('Starting ffmpeg...');
    const ffmpeg = spawn('ffmpeg', ['-f', 'v4l2', '-i', '/dev/video0', '-c:v', 'libx264', '-f', 'mp4', '-movflags', 'frag_keyframe+empty_moov', '-']);

    ffmpeg.stdout.on('data', (data) => {
        console.log('Streaming data...');
        res.write(data);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.end();
    });

    req.on('close', () => {
        console.log('Request closed, killing ffmpeg...');
        ffmpeg.kill();
    });
});

module.exports = router;
