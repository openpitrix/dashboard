const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, printf, splat
} = format;
const { root } = require('../lib/utils');

const myFormat = printf(info => {
  const { level, message, meta = {} } = info;
  const ts = new Date(info.timestamp).toLocaleString();
  const params = meta.body || {};

  return `${ts} ${level}: ${message} -- ${JSON.stringify(params)}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), splat(), myFormat),
  exitOnError: false,
  transports: [
    new transports.File({
      filename: root('logs/error.log'),
      level: 'error',
      maxsize: 1024 * 1024 * 10 // bytes
    }),
    // when using logger.info, just output to console
    // so `docker logs` will catch it
    new transports.Console()
    // todo: disable write info message to file, delegate to docker logs
    // new transports.File({
    //   filename: root('logs/app.log'),
    //   maxsize: 1024 * 1024 * 20
    // })
  ]
});

module.exports = logger;
