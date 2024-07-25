const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
   res.send('Hello World!');
});

router.get('/status', (req, res) => {
    res.send('Hello World - Status!');
});

module.exports = router;