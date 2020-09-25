var express=require("express");
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var consignmentcontroller=require('./controllers/Admin/operationalDashboard/consignmentController')
var CronJob = require('cron').CronJob;
var moment=require('moment')
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
app.use(express.static('uploads'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true, parameterLimit: 50000}));
// app.use(fileUpload());
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


require("./fileupload.js")(app);

require("./routes/index.js")(app);

// cron.schedule('00 00 00 * *', () => {
//     console.log('Runing a job at 01:00 at America/Sao_Paulo timezone');
//   }, {
//     scheduled: true,
//     timezone: "America/Sao_Paulo"
//   });
var connection = require('./config');



//var CronJob = require('cron').CronJob;
//var job = new CronJob('59 59 23 * * *', function() {
    var job = new CronJob('59 59 23 * * *', function() {
        
    //cron job for moving the consignments which is in out for delivery back to cosignments
    let consignmentQuery = "SELECT * FROM consignment as cd inner join out_for_delivery as c on c.cn_no=cd.cn_no where cd.status = 'out for delivery' and cd.is_approved = 1 and c.is_done=0  "
     console.log(consignmentQuery)
    connection.query(consignmentQuery, (err, rows) => {
        
        if(err){
            console.log(err);
           console.log("Error in some Query");
        } else if (rows.length == 0 ){
           console.log("no Results Found");
        } else {
            
             
            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                let status;
                let today = new Date();
                 
                let regionQuery = "SELECT * FROM region WHERE destination_code = ? ;"
                connection.query(regionQuery,row.destination_code, async(regerr, regrows) => {
                    if(err){
                        console.log(regerr);
                    }else { 
                        if(regrows[0].region === "SOUTH"  && row.region != "SOUTH"){
                            status = "assign to south";
                        }else if (regrows[0].region === "NORTH"  && row.region != "NORTH"){
                            status = "assign to north";
                        }else {
                            status = "assign to hq";
                        }
             
                        if(row.expiry_date != null && moment(today).format('YYYY-MM-DD') >= moment(row.expiry_date).format('YYYY-MM-DD')){
                            
                            let updateConsignmentQuery = "update consignment set status = ?  where cn_no = ?";
                            let consignment_data = [ status, row.cn_no ];
                            let delete_tracking = "delete from out_for_delivery where cn_no = ?;"
                            console.log('sjsk',today,row.expiry_date)
                            console.log('fine',consignment_data)
                          await connection.query(updateConsignmentQuery, [ status, row.cn_no ], async(err,rows) => {
                                console.log('s',rows)
                                if(err){
                                    console.log(err)
                                } else {
                                    console.log("updated sucessfully");
                                }
                            });
                           await  connection.query(delete_tracking, row.cn_no, async(err,rows) => {
                                if(err){
                                    console.log(err)
                                } else {
                                    var tracking_data2 = {
                                        "cn_no": row.cn_no,
                                        "status":'CONSIGMENT_EXPIRED',
                                        "datetime": today,
                                        isold:1
                                    }
                                    
                                   await connection.query('INSERT INTO tracking SET ?', tracking_data2, (err,rows) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log(rows)
                                             
                                        }
                                    })

                                    console.log("Deleted sucessfully");
                                }
                            })
                        }else{
                            console.log("Consignment Not Applicable")
                        }
                        
                    }
                });
            

            })
        }
    })

}, null, true, 'Asia/Singapore');
job.start();



//var job = new CronJob('59 59 23 * * *', function() {
    var trackingjob = new CronJob('0 */5 * * * *', function() {
    //cron job for moving the consignments which is in out for delivery back to cosignments
    consignmentcontroller.trackingcronjob()
}, null, true, 'Asia/Singapore');
trackingjob.start();

app.listen(PORT, () => {
     
    console.log('Server started on the port 8011' )
});
