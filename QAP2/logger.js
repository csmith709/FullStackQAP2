const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class ServerLogger extends EventEmitter {}

const logger = new ServerLogger();

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Log to console and file
logger.on('log', (message) => {
    console.log(message);
    fs.appendFile(path.join(logsDir, 'server.log'), message + '\n', (err) => {
        if (err) console.error('Error writing to log file', err);
    });
});

module.exports = logger;

