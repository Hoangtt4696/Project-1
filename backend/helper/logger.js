const fs = require('fs');
const winston = require('winston');
const logDir = 'log-error';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
module.exports = logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.simple(),
      ),
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/results-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      )
    }),
    // new winston.transports.File({
    //   filename: 'log/error.log',
    //   level: 'error',
    //   format: winston.format.combine(
    //     winston.format.timestamp(),
    //     winston.format.simple(),
    //   )
    // }),
  ]
});