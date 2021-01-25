var express=require("express");
var bodyParser=require('body-parser');
var morgan = require('morgan');
var fs = require('fs')
var path = require('path')
var logger=require('./log/logger')
const {
    PORT = 8011,
    NODE_ENV = 'developement',
    SESS_NAME = 'sid',
    SESS_SECRET = 'secretkey',
    SESS_LIFETIME =  10000 * 60 * 60 * 2,
} = process.env

var accessLogStream = fs.createWriteStream('./logs/applicationlog.log', { flags: 'a' })  

 

var app = express();


app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static('uploads'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true, parameterLimit: 50000}));
// app.use(fileUpload());

app.use(function(req,res,next)
{
    //Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin','*');

    //Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization')
    //Set to true if you need the website to inculde cookies in the request sent to the API (eg in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials',true)
     
    next()
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
