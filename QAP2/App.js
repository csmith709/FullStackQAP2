// Imports
const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

//extend event emitter
class ServerEvents extends EventEmitter {}
//init new emitter obj
const serverEvents = new ServerEvents();

// Create event emitter for log
class ServerLogger extends EventEmitter {}
const logger = new ServerLogger();

// Log to console and file
logger.on('log', (message) => {
    console.log(message);
    fs.appendFile('logs/server.log', message + '\n', (err) => {
        if (err) console.error('An error has occurred writing log to file', err);
    });
});

// Setup http server
const server = http.createServer((req, res) => {
    const route = req.url;
    logger.emit('log', `Route requested: ${route}`);

    // Emit event for route access
    serverEvents.emit('routeAccess', route);

    let filePath = path.join(__dirname, 'views', route === '/' ? 'index.html' : `${route}.html`);

    // Error handling and serving files
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Squirrel Not Found</h1>', 'utf-8');
            logger.emit('log', `Error: 404 Not Found for route: ${route}`);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
            logger.emit('log', `Served: ${filePath}`);
        }
    });

    //emit event for HTTP status codes
    res.on('finish', () => {
        logger.emit('log', `HTTP status code: ${res.statusCode}`);
    });
});

module.exports = server;
