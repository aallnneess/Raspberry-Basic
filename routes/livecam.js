const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

router.get('/', (req, res) => {
    res.send('<html><body><video src="/liveCam/stream" controls autoplay></video></body></html>');
});

module.exports = router;
