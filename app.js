const express = require('express');
const path = require('path'); // Modul zum Arbeiten mit Dateipfaden
const statusRouter = require('./routes/status'); // Importieren des Routings für die Indexseite
const webcamRouter = require('./routes/webcam');

// Initialisieren der Express-App
const app = express();

app.use(express.json()); // Middleware zum Parsen von JSON-Daten
app.use(express.urlencoded({ extended: false })); // Middleware zum Parsen von URL-kodierten Daten
app.use(express.static(path.join(__dirname, 'public'))); // Bereitstellen statischer Dateien aus dem Verzeichnis 'public'

app.use('/status', statusRouter); // Verwenden des indexRouters für Anfragen an die Haupt-URL
app.use('/webcam', webcamRouter);

// Fehlerbearbeitung: Wenn Routen nicht gefunden wurden....
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Allgemeine Fehlerbehandlung
app.use((error, req, res, next) => {
    res.status(error.status || 500); // Setzen des Statuscodes auf den Fehlerstatus oder 500 (Interner Serverfehler)
    res.json({
        error: {
            message: error.message // Zurückgeben der Fehlermeldung im JSON-Format
        }
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});


