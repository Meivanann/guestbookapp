var express=require("express");
var bodyParser=require('body-parser');
var morgan = require('morgan');

var logger=require('./log/logger')
const {
    PORT = 8011,
    NODE_ENV = 'developement',
    SESS_NAME = 'sid',
    SESS_SECRET = 'secretkey',
    SESS_LIFETIME =  10000 * 60 * 60 * 2,
} = process.env

const IN_PROD = NODE_ENV === 'production'

 

var app = express();


app.use(morgan('combined', { stream: logger.error  }));
app.use(express.static('uploads'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true, parameterLimit: 50000}));
// app.use(fileUpload());
 
app.use(function(err, req, res, next) {
    logger.error.error(`${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`);
    next(err)
  }) 



//
require("./routes/index.js")(app);
require("./config.js");

 


// cron.schedule('00 00 00 * *', () => {
//     console.log('Runing a job at 01:00 at America/Sao_Paulo timezone');
//   }, {
//     scheduled: true,
//     timezone: "America/Sao_Paulo"
//   });
 

app.listen(PORT, () => {
     
    console.log('Server started on the port 8011' )
});
