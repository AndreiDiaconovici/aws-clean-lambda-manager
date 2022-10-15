import * as winston from 'winston'

let sessionLogger: winston.Logger | undefined

function getLogger (): winston.Logger {
  if (sessionLogger == null) {
    sessionLogger = winston.createLogger({
      level: 'debug', // Can be updated based on lambda env variable
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()]
    })
    return sessionLogger
  }
  return sessionLogger
}

export const logger = getLogger()
