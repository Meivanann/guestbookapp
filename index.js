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

// cron.schedule('00 00 00 * *', () => {
//     console.log('Runing a job at 01:00 at America/Sao_Paulo timezone');
//   }, {
//     scheduled: true,
//     timezone: "America/Sao_Paulo"
//   });
var connection = require('./config');



var CronJob = require('cron').CronJob;
var job = new CronJob('59 59 23 * * *', function() {
 
    //cron job for moving the consignments which is in out for delivery back to cosignments
    let consignmentQuery = "SELECT * FROM consignment where status = 'out for delivery' and is_approved = 1;"
    connection.query(consignmentQuery, (err, rows) => {
        if(err){
           console.log("Error in some Query");
        } else if (rows.length == 0 ){
           console.log("no Results Found");
        } else {
            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                let status;
                let today = new Date();
                console.log();

                if(row.region === "SOUTH"){
                    status = "assign to south";
                }else if (row.region === "NORTH"){
                    status = "assign to south";
                }else {
                    status = "created"
                }
             
                if(row.expiry_date != null && today >= row.expiry_date){
                    let updateConsignmentQuery = "update consignment set status = ?  where cn_no = ?";
                    let consignment_data = [ status, row.cn_no ];
                    let delete_tracking = "delete from out_for_delivery where cn_no = ?;"

                    connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.log("updated sucessfully");
                        }
                    });
                    connection.query(delete_tracking, row.cn_no, (err,rows) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.log("Deleted sucessfully");
                        }
                    })
                 }else{
                     console.log("Consignment Not Applicable")
                 }

            })
        }
    })

}, null, true, 'Asia/Singapore');
job.start();


app.listen(PORT, () => {
    console.log('Server started on the port 8011')
});
