const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

router.get('/', (req, res) => {
    res.send('Welcome to the Webcam Stream');
});

const imagePath = path.join(__dirname, '..', 'public', 'images', 'capture.jpg');

router.get('/capture', (req, res) => {
    // Shell command to capture an image using rpicam-still
    exec(`rpicam-still -o ${imagePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error capturing the image: ${error.message}`);
            return res.status(500).send('Error capturing the image');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error capturing the image');
        }

        // Send the captured image as a response
        res.sendFile(imagePath);
    });
});

module.exports = router;
