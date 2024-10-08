const winston = require('winston');

module.exports = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({
        filename: 'log.txt'
    })],
});
