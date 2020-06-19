var connection = require('../../../config');

const fs = require('fs');
const AWS = require('aws-sdk');


const BUCKET_NAME = 'poddocs';
const IAM_USER_KEY = 'AKIARRRQHZXBINF6YWP2';
const IAM_SECRET_KEY = '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';


module.exports = {
    index: (req,res) => {
        console.log(req.params.id);
        let cn_no = req.params.cn_no;
        let query = "select * from out_for_delivery where status = 'In-progress' order by datetime desc;"
       connection.query(query,cn_no, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
               console.log("no results found");
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
                        var file = req.files.file;

                        let s3bucket = new AWS.S3({
                            accessKeyId: IAM_USER_KEY,
                            secretAccessKey: IAM_SECRET_KEY,
                            Bucket: BUCKET_NAME
                        });

                        // s3bucket.createBucket(function() {
                            var params = {
                                Bucket: BUCKET_NAME,
                                Key: req.body.cn_no,
                                Body: file.data
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
                                    "status": "user - " + req.params.id + "updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
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
                }else{
                    if(req.files === null){

                        //updating out for delivery
                        let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                        var ofd_data = {
                            'status' : req.body.status,
                            'driver' : req.body.driver_name,
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
                            "status": "user - " + req.params.id + "updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
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
                    "status": "user - " + req.params.id + "updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
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
    }
}


