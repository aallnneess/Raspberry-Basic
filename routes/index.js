const express = require('express');
const router = express.Router();
const path = require('path');
const { exec } = require('child_process');

const os = require('os');

router.get('/', (req,res) => {
   res.send('Hello World!');
});

router.get('/status', (req, res) => {
    // Grundlegende Systeminformationen
    const uptime = os.uptime();
    const loadavg = os.loadavg();
    const freemem = os.freemem();
    const totalmem = os.totalmem();
    const cpus = os.cpus().length;
    const platform = os.platform();

    // CPU-Auslastung und freier Speicherplatz
    const cpuUsage = getCpuUsage();

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
                cpuUsage: cpuUsage,
                signal: signalStrength,
                voltage: voltage
            });
        });
    });
});

function getCpuUsage() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;

    for (let cpu in cpus) {
        user += cpus[cpu].times.user;
        nice += cpus[cpu].times.nice;
        sys += cpus[cpu].times.sys;
        idle += cpus[cpu].times.idle;
        irq += cpus[cpu].times.irq;
    }

    total = user + nice + sys + idle + irq;

    return {
        idle: idle / cpus.length,
        total: total / cpus.length
    };
}

module.exports = router;






