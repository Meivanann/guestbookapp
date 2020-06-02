var express=require("express");
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');

const {
    PORT = 8011,
    NODE_ENV = 'developement',
    SESS_NAME = 'sid',
    SESS_SECRET = 'secretkey',
    SESS_LIFETIME =  10000 * 60 * 60 * 2,
} = process.env

const IN_PROD = NODE_ENV === 'production'

var cors = require('cors')

var app = express();


app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true, parameterLimit: 50000}));
app.use(fileUpload());
app.use(cookieParser());
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie:{
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}))

require("./routes/index.js")(app);


app.listen(PORT, () => {
    console.log('Server started on the port 8012')
});