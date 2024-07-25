const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

router.get('/', (req, res) => {
    res.send('Willkommen beim Webcam-Stream');
});

// Im prinzip wird nur der Shell-Befehl rpicam-still -o "path" ausgeführt, das bild aufgenommen, und unter dem Pfad gespeichert
// Der Path wird weiter gegeben durch fetch an die website und dort als blob -> Bild dargestellt

const imagePath = path.join(__dirname, '..', 'public', 'images', 'capture.jpg');

router.get('/capture', (req, res) => {
    // Shell-Befehl zum Aufnehmen eines Bildes mit rpicam-still
    exec(`rpicam-still -o ${imagePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Fehler beim Aufnehmen des Bildes: ${error.message}`);
            return res.status(500).send(`Fehler beim Aufnehmen des Bildes: ${error.message}`);
        }

        if (stderr) {
            console.warn(`Warnung: ${stderr}`);  // Protokollieren, aber nicht die Anfrage stoppen
        }

        console.log(`Bild erfolgreich aufgenommen: ${stdout}`);

        // Überprüfen, ob die Datei existiert
        res.sendFile(imagePath, (err) => {
            if (err) {
                console.error(`Fehler beim Senden der Bilddatei: ${err.message}`);
                return res.status(500).send(`Fehler beim Senden der Bilddatei: ${err.message}`);
            }
        });
    });
});

module.exports = router;
