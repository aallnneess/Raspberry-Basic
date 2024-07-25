// const express = require('express');
// const router = express.Router();
// const { exec } = require('child_process');
// const path = require('path');
//
// router.get('/', (req, res) => {
//     res.send('Welcome to the Webcam Stream');
// });
//
// const imagePath = path.join(__dirname, '..', 'public', 'images', 'capture.jpg');
//
// router.get('/capture', (req, res) => {
//     // Shell command to capture an image using rpicam-still
//     exec(`rpicam-still -o ${imagePath}`, (error, stdout, stderr) => {
//
//         console.log('path: ', imagePath);
//
//         if (error) {
//             console.error(`Error capturing the image: ${error.message}`);
//             return res.status(500).send('Error capturing the image');
//         }
//         if (stderr) {
//             console.error(`stderr: ${stderr}`);
//             return res.status(500).send('Error capturing the image');
//         }
//
//         // Check if the file exists
//         res.sendFile(imagePath, (err) => {
//             if (err) {
//                 console.error(`Error sending the image file: ${err.message}`);
//                 return res.status(500).send('Error sending the image file');
//             }
//         });
//     });
// });
//
// module.exports = router;


const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

router.get('/', (req, res) => {
    res.send('Willkommen beim Webcam-Stream');
});

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
