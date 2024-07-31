// const express = require('express');
// const path = require('path'); // Modul zum Arbeiten mit Dateipfaden
// const statusRouter = require('./routes/status'); // Importieren des Routings für die Indexseite
// const webcamRouter = require('./routes/webcam');
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
const WebSocket = require('ws');
const ffmpeg = require('fluent-ffmpeg');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/status', statusRouter);
app.use('/webcam', webcamRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});

// WebSocket Server für den Stream
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Client connected');

    const rtspUrl = 'rtsp://192.168.178.70:8554/stream1';
    const ffmpegCommand = ffmpeg(rtspUrl)
        .outputFormat('mp4')
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('start', (commandLine) => {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', (err) => {
            console.error('FFmpeg error:', err.message);
            ws.close();
        })
        .on('end', () => {
            console.log('FFmpeg stream ended');
        });

    const ffstream = ffmpegCommand.pipe();

    ffstream.on('data', chunk => {
        console.log('Sende Chunk:', chunk.length);
        ws.send(chunk);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        ffmpegCommand.kill('SIGKILL');
    });
});


