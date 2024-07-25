const express = require('express');
const router = express.Router();
const path = require('path');

const os = require('os');

router.get('/', (req,res) => {
   res.send('Hello World!');
});

router.get('/status', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'status.html'));
});

module.exports = router;