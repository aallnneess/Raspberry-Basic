const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

router.get('/', (req, res) => {
    res.send('Welcome to the Webcam Stream');
});

const imagePath = path.join(__dirname, '..', 'public', 'images', 'capture.jpg');

router.get('/capture', (req, res) => {
    // Shell-Kommando zum Aufnehmen eines Bildes
    exec(`raspistill -o ${imagePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Fehler beim Aufnehmen des Bildes: ${error.message}`);
            return res.status(500).send('Fehler beim Aufnehmen des Bildes');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Fehler beim Aufnehmen des Bildes');
        }

        // Senden des aufgenommenen Bildes als Antwort
        res.sendFile(imagePath);
    });
});

module.exports = router;