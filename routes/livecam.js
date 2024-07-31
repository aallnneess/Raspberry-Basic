const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('livecam.html', { root: 'public' });
});

module.exports = router;
