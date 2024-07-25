const express = require('express');
const router = express.Router();

const os = require('os');

router.get('/', (req,res) => {
   res.send('Hello World!');
});

router.get('/status', (req, res) => {
    res.send({
        freemem: os.freemem() / 1024 / 1024
    });
});

module.exports = router;