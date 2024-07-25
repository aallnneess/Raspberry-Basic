const express = require('express');
const path = require('path'); // Modul zum Arbeiten mit Dateipfaden
const indexRouter = require('./routes/index'); // Importieren des Routings für die Indexseite

// Initialisieren der Express-App
const app = express();

app.use(express.json()); // Middleware zum Parsen von JSON-Daten
app.use(express.urlencoded({ extended: false })); // Middleware zum Parsen von URL-kodierten Daten
app.use(express.static(path.join(__dirname, 'public'))); // Bereitstellen statischer Dateien aus dem Verzeichnis 'public'

app.use('/', indexRouter); // Verwenden des indexRouters für Anfragen an die Haupt-URL

// Fehlerbearbeitung: Wenn Routen nicht gefunden wurden....
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Allgemeine Fehlerbehandlung
app.use((err, req, res, next) => {
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


