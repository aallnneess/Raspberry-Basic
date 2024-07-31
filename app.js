// const express = require('express');
// const path = require('path'); // Modul zum Arbeiten mit Dateipfaden
// const statusRouter = require('./routes/status'); // Importieren des Routings für die Indexseite
// const webcamRouter = require('./routes/webcam');
// const liveCamRouter = require('./routes/livecam');
//
// // Initialisieren der Express-App
// const app = express();
//
// app.use(express.json()); // Middleware zum Parsen von JSON-Daten
// app.use(express.urlencoded({ extended: false })); // Middleware zum Parsen von URL-kodierten Daten
// app.use(express.static(path.join(__dirname, 'public'))); // Bereitstellen statischer Dateien aus dem Verzeichnis 'public'
//
// app.use('/status', statusRouter); // Verwenden des indexRouters für Anfragen an die Haupt-URL
// app.use('/webcam', webcamRouter);
// app.use('/liveCam', liveCamRouter);
//
// // Fehlerbearbeitung: Wenn Routen nicht gefunden wurden....
// app.use((req, res, next) => {
//     const error = new Error('Not Found');
//     error.status = 404;
//     next(error);
// });
//
// // Allgemeine Fehlerbehandlung
// app.use((error, req, res, next) => {
//     res.status(error.status || 500); // Setzen des Statuscodes auf den Fehlerstatus oder 500 (Interner Serverfehler)
//     res.json({
//         error: {
//             message: error.message // Zurückgeben der Fehlermeldung im JSON-Format
//         }
//     });
// });
//
// const PORT = 3000;
//
// app.listen(PORT, () => {
//     console.log(`Server running on Port ${PORT}`);
// });













const express = require('express');
const path = require('path');
const statusRouter = require('./routes/status');
const webcamRouter = require('./routes/webcam');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/status', statusRouter);
app.use('/webcam', webcamRouter);

// Fehlerbearbeitung: Wenn Routen nicht gefunden wurden....
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Allgemeine Fehlerbehandlung
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/stream' });

wss.on('connection', (ws) => {
    console.log('Client connected');
    const ffmpeg = spawn('ffmpeg', [
        '-f', 'v4l2',
        '-input_format', 'mjpeg',
        '-i', '/dev/video0',
        '-c:v', 'libx264',
        '-f', 'mpegts',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-'
    ]);

    ffmpeg.stdout.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
    });

    ws.on('close', () => {
        ffmpeg.kill();
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        ffmpeg.kill();
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});











