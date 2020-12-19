module.exports = app => { 
    const fs = require('fs');
    const multer = require('multer');
    var connection = require('./config');

    global.__basedir = __dirname;
 
    // -> Multer Upload Storage
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
    });
    
    const upload = multer({storage: storage});

    // -> Express Upload RestAPIs
    app.post('/api/:id/client/uploadconsignments', upload.single("uploadfile"), (req, res) =>{
    importExcelData2MySQL(req.file.path, req.params.id);
    res.json({
            'statues' : true,
            'msg': 'File uploaded/import successfully!'
        });
    });

    function importExcelData2MySQL(filePath, user_id){
        let cn_no = 0000;
        // generating the consignment number
        connection.query("SELECT * FROM consignment where is_online = 1 order by id desc;", (cn_no_err,cn_no_rows) => {
           if(cn_no_err){
               console.log(cn_no_err);
           }  else if (cn_no_rows.length === 0){
              
           } else{
               let test = (cn_no_rows[0].cn_no).split('/');
               cn_no = parseFloat(test[2]);
               
           }
        });

        const fs = require("fs");
        const mysql = require("mysql");
        const fastcsv = require("fast-csv");

        let stream = fs.createReadStream(filePath);
        let csvData = [];
        let csvStream = fastcsv
        .parse()
        .on("data", function(data) {
            console.log(data);
            csvData.push(data);
        })
        .on("end", function() {
            // remove the first line: header
            csvData.shift();

            csvData.forEach(csv => {
                console.log(csv[0]);
            });
            // create a new connection to the database
            const connection = mysql.createConnection({
                host     : 'localhost',
                port     : '3306',
                user     : 'root',
                password : 'root',
                database : 'psa',
            });

            // open the connection
            connection.connect(error => {
            if (error) {
                console.error(error);
            } else {
                let query =
                "INSERT INTO consignment_pending (shipper_code, shipper_name, receiver_code, receiver_name,destination_code, region, carton_size, m3_size, pallet_size, s_size, m_size, l_size, xl_size, pkt_size, other_charges, m3_min_size, weight_min_size, weight_size, p_size) VALUES ?";
                connection.query(query, [csvData], (error, response) => {
                console.log(error || response);
    
            let today = new Date();
            connection.query("select * from consignment_pending", (pending_err,pending_rows) => {
                if(pending_err){
                    console.log(pending_err);
                }  else if (pending_rows.length === 0) {
                } else{
                    Object.keys(pending_rows).forEach(function(key) {
                        var row = pending_rows[key];
                        // cn_no = parseFloat(cn_no) + 1;
                        // calculating the charges
                        let data = [ row.shipper_code, row.destination_code ];
                        let query = "select * from charges where shipper_code = ? and destination_code = ?;"
                        connection.query(query, data, (charge_err,charges_rows) => {
                            if(charge_err){
                                console.log(charge_err);
                            } else if (charges_rows.length == 0 ){
                                console.log("no results found");
                            } else {
                                console.log("results found");
                                let charge_data = charges_rows[0];
                                let tax;
                                connection.query("SELECT * FROM tax;", (tax_err,tax_rows) => {
                                    if(tax_err){
                                        console.log(tax_err);
                                    } else {
                                        console.log(tax_rows[0]);
                                        tax = tax_rows[0].tax_percentage;


                                        let pkt_rate = parseFloat(row.pkt_size) * parseFloat(charge_data.pkt_rate);
                                        let carton_rate = row.carton_size * charge_data.carton_rate;
                                        let pallet_rate = parseFloat(row.pallet_size) * parseFloat(charge_data.pallet_rate);
                                        let s_rate = parseFloat(row.s_size) * parseFloat(charge_data.s_rate);
                                        let m_rate = parseFloat(row.m_size) * parseFloat(charge_data.m_rate);
                                        let l_rate = parseFloat(row.l_size) * parseFloat(charge_data.l_rate);
                                        let xl_rate =  parseFloat(row.xl_size) * parseFloat(charge_data.xl_rate);
                                        let p_rate = parseFloat(row.p_size) * parseFloat(charge_data.p_rate);
                                        let m3_rate = parseFloat(row.m3_size) * parseFloat(charge_data.m3_rate);
                                        let m3_min_rate = parseFloat(row.m3_min_size) * parseFloat(charge_data.m3_min_rate);
                                        let weight_min_rate = parseFloat(row.weight_min_size) * parseFloat(charge_data.weight_min_rate);
                                        let weight_rate = parseFloat(row.weight_size) * parseFloat(charge_data.weight_rate);
                                        
                            

                                        
                                        let sub_amount = pkt_rate + carton_rate + pallet_rate + p_rate + s_rate + m_rate + l_rate + xl_rate + m3_min_rate + m3_rate + weight_rate + weight_min_rate  ;
                                        // console.log(pkt_rate + carton_rate + pallet_rate + p_rate + s_rate + m_rate + l_rate + xl_rate + m3_min_rate + m3_rate + weight_rate + weight_min_rate + other_amount);
                                        console.log(tax);
                                        let tax_amount = sub_amount/parseFloat(tax);
                                        let total_amount = sub_amount + tax_amount;
                                            cn_no = cn_no + 1;
                                        var consignment_data = {
                                            "cn_no": new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + cn_no,
                                            "shipper_code":row.shipper_code,
                                            "shipper_name":row.shipper_name,
                                            "receiver_code":row.receiver_code,
                                            "receiver_name":row.receiver_name,
                                            // "pod": req.body.pod,
                                            "destination_code":row.destination_code,
                                            "region":row.region,
                                            "cn_datetime":today,
                                            "quantity":parseFloat(row.carton_size) + parseFloat(row.pkt_size) + parseFloat(row.p_size) + parseFloat(row.pallet_size) + parseFloat(row.s_size) + parseFloat(row.m_size) + parseFloat(row.l_size) + parseFloat(row.xl_size) + parseFloat(row.m3_min_size) + parseFloat(row.m3_size) + parseFloat(row.weight_min_size) + parseFloat(row.weight_size) + parseFloat(row.other_charges),
                                            "pkt_size": row.pkt_size,
                                            "pkt_rate": charge_data.pkt_rate,
                                            "carton_size":row.carton_size,
                                            "carton_rate":charge_data.carton_rate,
                                            "pallet_size":row.pallet_size,
                                            "pallet_rate":charge_data.pallet_rate,
                                            "p_size":row.p_size,
                                            "p_rate":charge_data.p_rate,
                                            "s_size":row.s_size,
                                            "s_rate":charge_data.s_rate,
                                            "m_size":row.m_size,
                                            "m_rate":charge_data.m_rate,
                                            "l_size":row.l_size,
                                            "l_rate": charge_data.l_rate,
                                            "xl_size":row.xl_size,
                                            "xl_rate":charge_data.xl_rate,
                                            "m3_min_size":row.m3_min_size,
                                            "m3_min_rate": charge_data.m3_min_rate,
                                            "m3_size":row.m3_size,
                                            "m3_rate":charge_data.m3_rate,
                                            "weight_min_size":row.weight_min_size,
                                            "weight_min_rate": charge_data.weight_min_rate,
                                            "weight_size":row.weight_size,
                                            "weight_rate": charge_data.weight_rate,
                                            "other_charges":row.other_charges,
                                            "other_amount": 0,
                                            "sub_amount":sub_amount,
                                            "tax_amount":tax_amount,
                                            "total_amount":total_amount,
                                            "status":'created',
                                            "invoice_no":'',
                                            'is_approved' : 0,
                                            'is_online' : 1,
                                        }

                                            //inserting a record in consignmnet table
                                        let query = "INSERT INTO consignment SET ?"
                                        connection.query(query,consignment_data, function (error, results, fields) {
                                            if (error) {
                                                console.log(error);
                                            
                                            }else{
                                                console.log(results.insertId);
                                                // creating a log
                                                var log_data = {
                                                    "user_id" : user_id,
                                                    "cn_no"   : new Date().getFullYear() + '/' + new Date().getMonth() + '/' + cn_no,
                                                    "status": " has create new Consignment No. [" + new Date().getFullYear() + "/" + new Date().getMonth() + "/" + cn_no + " ] " 
                                                }
                                                connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                                                    if (lgerr) {
                                                    console.log(lgerr)
                                                    }else{
                                                        console.log("log added successfully");
                                                    }
                                                });

                                                connection.query('Delete from consignment_pending where id = ?',row.id, function (lgerr, lgres, fields) {
                                                    if (lgerr) {
                                                    console.log(lgerr)
                                                    }else{
                                                        console.log("Deleted successfully");
                                                    }
                                                });

                                                console.log("Consignment Added succesfully")
                                            }
                                        });  
                                    }
                                });
                            }
                        });
                    

                    });
                }
            });
        });
    }
    });
    });

       stream.pipe(csvStream);
    }
}
