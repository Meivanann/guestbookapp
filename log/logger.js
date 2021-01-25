const winston = require('winston');
// creates a new Winston Logger
const logger = 
{
  success:new winston.createLogger({
  level: 'info' ,
  format:winston.format.combine(
    winston.format.label({ label: 'log' }),
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: './logs/commonlog.log', level: 'info' }),
  ],
   
}),
error:new winston.createLogger({
  level: 'error' ,
  format:winston.format.combine(
    winston.format.label({ label: 'errorlog' }),
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: './logs/errorlog.log', level: 'error' }),
  ],
   
})
}

// const logger = 
// {
//  error: winston.createLogger({
//     level: 'error' ,
//     format: winston.format.simple(),
//     transports: [
//       new winston.transports.File({ filename: 'error.log'}),
//     ],
   
//   }),
//   simple: winston.createLogger({
//     level: 'info',
//     format: winston.format.simple(),
//     transports: [new winston.transports.File({ filename: 'common.log'}),
//   ],
    
//   })
// }

module.exports = logger;