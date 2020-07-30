var connection = require('../../../config');

const fs = require('fs');
const AWS = require('aws-sdk');
const moment = require('moment');

const BUCKET_NAME = 'poddocs';
const IAM_USER_KEY = 'AKIARRRQHZXBINF6YWP2';
const IAM_SECRET_KEY = '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';



module.exports = {
    index: (req,res) => {
        console.log(req.params.id);
        let cn_no = req.params.cn_no;
        let query = "select o.*, c.quantity, c.expiry_date ,c.cn_datetime from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no order by datetime desc;"
       connection.query(query,cn_no, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
               console.log("no results found");
               res.json({
                status: 2,
                message:"No results found"
            });
            } else {
                console.log("results found");
                res.json({
                    status: 1,
                    data:rows
                })
            }
            
        })
       
    },

    ofdCompleted: (req,res) => {
        console.log(req.params.id);
        let cn_no = req.params.cn_no;
        let query = "select * from out_for_delivery where status = 'Completed' order by datetime desc;"
       connection.query(query,cn_no, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
               console.log("no results found");
               res.json({
                status: 2,
                message:"No results found"
            });
            } else {
                console.log("results found");
                res.json({
                    status: 1,
                    data:rows
                })
            }
            
        })
       
    },

    upload: (req,res) => {
            const PDFDocument = require('pdfkit');
            const fs = require('fs');
            // const doc = new PDFDocument

            //Pipe its output somewhere, like to a file or HTTP response 
            //See below for browser usage 
            // doc.pipe(fs.createWriteStream('output.pdf'))


            //Add an image, constrain it to a given size, and center it vertically and horizontally 
            let test = new Date( "dd-mm-yyyy");
           console.log();
        let today = new Date();
        let file_url;
        // const doc = new PDFDocument;

        // if(!req.files){
        //     res.json({
        //         status:false,
        //         message:'file undefined error'
        //     })
        // }
        console.log(req.body);
        console.log(req.body.status);
        console.log(req.files);
        try {
            if(req.body.status != 'Close'){
                if(req.body.status === 'Completed'){
                    
                    if(req.files === null){
                        res.json({
                            status: false,
                            message:"You need to upload receipt screenshot to Completed this task"
                        })
                    }else{
                        connection.query('select * from consignment where cn_no = ?', req.body.cn_no, (err,consignment_results) => {
                            if(err){
                                console.log(err);
                            } else { 
                            var file = req.files.file;
                            const doc = new PDFDocument
                            doc
                                .font('Times-Bold')
                                .fontSize(8)
                                .text("GOODS DELIVERED BY: PSA TRANSPORT SDN BHD",  { align: "left" })
                                .text("DO/CN NO: " + req.body.cn_no ,  { align: "left" })
                                .text("VOLUME: " + consignment_results[0].quantity, { align: "left" })
                                .text("DELIVERED DATE: " +  moment(new Date()).format('DD/MM/YYYY'), { align: "left" })
                                .text("REMARKS", { align: "left" })
                                .text("SHIPPER: " + consignment_results[0].shipper_code,250,82, { align: "left" })
                                .text("RECEIVER: " + consignment_results[0].receiver_code,250,89, { align: "left" })
                                .text("DESTINATION: " + consignment_results[0].destination_code,250,97, { align: "left" })
                                .fontSize(15)
                                .text("PROOF OF DELIVERY",430,78, { align: "left" })
                                .moveDown();

                            doc.image('./logo.png', 530, 65, {width: 55, height: 55})
                                .moveDown();

                            doc.image(file.data, 70, 160,{fit: [500, 500], align: 'center', valign: 'center'});
                            // doc.image('images/test.jpeg', 430, 15, {fit: [100, 100], align: 'center', valign: 'center'})

                                doc.end()
                            let s3bucket = new AWS.S3({
                                accessKeyId: IAM_USER_KEY,
                                secretAccessKey: IAM_SECRET_KEY,
                                Bucket: BUCKET_NAME
                            });

                            // s3bucket.createBucket(function() {
                                var params = {
                                    Bucket: BUCKET_NAME,
                                    Key: req.body.cn_no + '.pdf',
                                    Body: doc
                                }
                                s3bucket.upload(params,function (err, data) {
                                    if(err){
                                        console.log('error in callback');
                                        console.log(err);
                                    }
                                    console.log(data.Location);
                                    file_url = data.Location;

                                    //deleting the records
                                    let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
                                    connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
                                        if(err){
                                            console.log(err)
                                        } else {
                                            console.log("Tracking Data Deleted Successfully");
                                        }
                                    })

                                    //adding rows in  tracking
                                    var tracking_data1 = {
                                        "cn_no": req.body.cn_no,
                                        "status": "ATTEMPTING",
                                        "datetime": today
                                    }
                                    var tracking_data2 = {
                                        "cn_no": req.body.cn_no,
                                        "status": "DELIVERED",
                                        "datetime": today
                                    }
                                    
                                    //inserting record in tracking table
                                    connection.query('INSERT INTO tracking SET ?', tracking_data1, (err,rows) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log("Tracking 1 added sucessfully");
                                        }
                                    })
                                    connection.query('INSERT INTO tracking SET ?', tracking_data2, (err,rows) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log("Tracking 2 added sucessfully");
                                        }
                                    })
                                    
                                    //updating status in consignment table
                                    let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
                                    let data1 = [req.body.status, req.body.cn_no];
                                    connection.query(consignment_update_query, data1, (err,rows) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log("Consignment updated  sucessfully");
                                        }
                                    })
                                    
                                    //updating out for delivery
                                    let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                                    var ofd_data = {
                                        'status' : req.body.status,
                                        'attachment' : file_url,
                                        'datetime' : today
                                    }
                                    let data2 = [ofd_data, req.body.cn_no];
                                    connection.query(ofd_update_query, data2, (err,rows) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log("OFD updated  sucessfully");
                                        }
                                    })
                                    
                                    //creating a log
                                    var log_data = {
                                        "user_id" : req.params.id,
                                        "cn_no"   : req.body.cn_no,
                                        "status": " has uploaded POD for  Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
                                    }
                                    connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                                        if (lgerr) {
                                        console.log(lgerr)
                                        }else{
                                            console.log("log added successfully");
                                        }
                                    });
                                    
                                    res.json({
                                        status:true,
                                        message:'Consignment Updated sucessfully'
                                    })
                                })
                            }
                        })
                    }
                }else{
                    if(req.files === null){

                        //updating out for delivery
                        let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                        var ofd_data = {
                            'status' : req.body.status,
                            'driver_name' : req.body.driver_name,
                        }
                        let data3 = [ofd_data, req.body.cn_no];
                        connection.query(ofd_update_query, data3, (err,rows) => {
                            if(err){
                                console.log(err);
                            } else {
                                console.log("OFD updated  sucessfully");
                            }
                        })

                         //deleting the records
                         let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
                         connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
                             if(err){
                                 res.json({
                                     status:false,
                                     message: 'there are some errors with query'
                                 })
                             } else {
                                 console.log("Tracking Data Successfully");
                             }
                         })

                            //creating a log
                        var log_data = {
                            "user_id" : req.params.id,
                            "cn_no"   : req.body.cn_no,
                            "status": " has updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
                        }
                        connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                            if (lgerr) {
                            console.log(lgerr)
                            }else{
                                console.log("log added successfully");
                            }
                        });
                        res.json({
                            status:true,
                            message:'Consignment Updated sucessfully'
                        })
                    }else{
                        res.json({
                            status: false,
                            message:"Please select Status as Completed to upload POD."
                        })
                    }
                }
            }else {
                //updating out for delivery
                let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                var ofd_data = {
                    'status' : req.body.status,
                }
                let data4 = [ofd_data, req.body.cn_no];
                connection.query(ofd_update_query, data4, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("OFD updated  sucessfully");
                    }
                })

                //updating status in consignment table
                let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
                let data5 = [req.body.status, req.body.cn_no];
                connection.query(consignment_update_query, data5, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Consignment updated  sucessfully");
                    }
                })

                //creating a log
                var log_data = {
                    "user_id" : req.params.id,
                    "cn_no"   : req.body.cn_no,
                    "status": " has updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
                }
                connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                    if (lgerr) {
                    console.log(lgerr)
                    }else{
                        console.log("log added successfully");
                    }
                });
                res.json({
                    status:true,
                    message:'Consignment Updated sucessfully'
                })
            }
            
        }
        catch (err) {
            console.log(err);
        }
    },

    deletePod : (req,res) => {
        
        let cn_no = req.params.cn_no;

        console.log("delete pod fnction");


        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_SECRET_KEY,
        });

        var params = {
            Bucket: BUCKET_NAME,
            Key: 'DIRECT5.pdf',
        };
        s3bucket.deleteObject(params, function (err, data) {
            if (data) {
                console.log("File deleted successfully");
            }
            else {
                console.log("Check if you have sufficient permissions : "+err);
            }
        });

        
        //deleting the records
        let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
        connection.query(tracking_delete_query, cn_no, (err,rows) => {
            if(err){
                console.log(err)
            } else {
                console.log("Tracking Data Deleted Successfully");
            }
        })

        let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
        let data1 = ["out for delivery", cn_no];
        connection.query(consignment_update_query, data1, (err,rows) => {
            if(err){
                console.log(err);
            } else {
                console.log("Consignment updated  sucessfully");
            }
        })
        
        //updating out for delivery
        let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
        var ofd_data = {
            'status' : "In-progress",
            'attachment' : "",
            // 'datetime' : today
        }
        let data2 = [ofd_data, cn_no];
        connection.query(ofd_update_query, data2, (err,rows) => {
            if(err){
                console.log(err);
            } else {
                console.log("OFD updated  sucessfully");
            }
        })
        
        //creating a log
        var log_data = {
            "user_id" : req.params.id,
            "cn_no"   : cn_no,
            "status": " has updated Consignment No. [" + cn_no + " ] to oUT FOR DELIVERY"
        }
        connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
            if (lgerr) {
            console.log(lgerr)
            }else{
                console.log("log added successfully");
            }
        });
        
        res.json({
            status:true,
            message:'Consignment Updated sucessfully'
        })
    }
}


