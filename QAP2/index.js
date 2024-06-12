const server = require('./App');
const logger = require('./logger');

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    logger.emit('log', `Server started on port ${PORT}`);
});
