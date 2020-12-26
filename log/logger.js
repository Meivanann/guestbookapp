const winston = require('winston');
// creates a new Winston Logger
const logger = 
{
 error: winston.createLogger({
    level: 'info' ,
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
   
  }),
  simple: winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.File({ filename: 'common.log'}),],
    
  })
}

module.exports = logger;