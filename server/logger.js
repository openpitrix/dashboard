const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, label, printf
} = format;
const { root } = require('../lib/utils');

// const logger = (params = {}) => {
//   params = pick(params, ['method', 'url', 'body']);
//   debug(
//     '[api] %s -- %s %s -- %o',
//     new Date().toLocaleString(),
//     params.method.toUpperCase(),
//     params.url,
//     params.body
//   );
// };

const myFormat = printf(info => {
  console.log('inspect info: ', info);

  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
  level: 'info',
  // format: format.json(),
  format: combine(timestamp(), myFormat),
  exitOnError: false,
  transports: [
    new transports.File({ filename: root('logs/error.log'), level: 'error' })
    // new transports.File({ filename: root('logs/app.log') })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      // format: winston.format.simple()
    })
  );
}

module.exports = logger;
