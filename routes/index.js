const express = require('express');
const router = express.Router();
const path = require('path');
const { exec } = require('child_process');
const si = require('systeminformation');

const os = require('os');

router.get('/', (req,res) => {
   res.send('Hello World!');
});

router.get('/status', async (req, res) => {
    // Grundlegende Systeminformationen
    const uptime = os.uptime();
    const loadavg = os.loadavg();
    const freemem = os.freemem();
    const totalmem = os.totalmem();
    const cpus = os.cpus().length;
    const platform = os.platform();

    // CPU-Auslastung in Prozent
    const currentLoad = await si.currentLoad();
    const cpuUsage = currentLoad.avgLoad;

    // WLAN Signalstärke
    exec("iwconfig wlan0 | grep 'Link Quality'", (error, stdout, stderr) => {
        let signalStrength = 'N/A';
        if (!error && stdout) {
            const match = stdout.match(/Link Quality=(\d+\/\d+)/);
            if (match) {
                signalStrength = match[1];
            }
        }

        // Spannung
        exec("vcgencmd measure_volts", (error, stdout, stderr) => {
            let voltage = 'N/A';
            if (!error && stdout) {
                voltage = stdout.trim().split('=')[1];
            }

            res.json({
                uptime: `${Math.floor(uptime / 60)} minutes`,
                loadavg: loadavg,
                freemem: `${Math.floor(freemem / 1024 / 1024)} MB`,
                totalmem: `${Math.floor(totalmem / 1024 / 1024)} MB`,
                cpus: cpus,
                platform: platform,
                signal: signalStrength,
                voltage: voltage,
                cpuUsage: `${cpuUsage.toFixed(2)}%`,
            });
        });
    });
});

module.exports = router;






