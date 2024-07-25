const express = require('express');
const router = express.Router();
const path = require('path');

const os = require('os');

router.get('/', (req,res) => {
   res.send('Hello World!');
});

router.get('/status', (req, res) => {
    const uptime = os.uptime(); // System Uptime in seconds
    const loadavg = os.loadavg(); // Load average for 1, 5, and 15 minutes
    const freemem = os.freemem(); // Free memory in bytes
    const totalmem = os.totalmem(); // Total memory in bytes
    const cpus = os.cpus().length; // Number of CPU cores
    const platform = os.platform(); // OS platform

    res.json({
        uptime: `${Math.floor(uptime / 60)} minutes`,
        loadavg: loadavg,
        freemem: `${Math.floor(freemem / 1024 / 1024)} MB`,
        totalmem: `${Math.floor(totalmem / 1024 / 1024)} MB`,
        cpus: cpus,
        platform: platform
    });
});

module.exports = router;