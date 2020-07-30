var connection = require('./../../../config');

module.exports = {

    getAllConsignments: (req,res) => { 
        let query = "SELECT cn_no FROM consignment where is_approved = 1;"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message:'there are some error with query'
                    })
            } else if (rows.length == 0 ){
                res.json({
                    status:false,
                    message:"No results found"
                   });
            } else {
                res.json({
                    status: true,
                    data:rows
                })
            }
            
        })
    },

    getAllTheConsignments: (req,res) => { 
        let query = "SELECT * FROM consignment;"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message:'there are some error with query'
                    })
            } else if (rows.length == 0 ){
                res.json({
                    status:false,
                    message:"No results found"
                   });
            } else {
                res.json({
                    status: true,
                    data:rows
                })
            }
            
        })
    },


    getConsignmentHq: (req,res) => { 
        let query = "SELECT * FROM consignment WHERE ((region = 'HQ' AND status='created') or status ='assign to hq') and is_approved = 1 ORDER BY cn_no asc; SELECT * FROM users WHERE position='driver';"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message:'there are some error with query'
                    })
            } else if (rows.length == 0 ){
                res.json({
                    status:false,
                    message:"No results found"
                   });
            } else {
                res.json({
                    status: 1,
                    data:rows
                })
            }
            
        })
    },

    getConsignmentNorth: (req,res) => { 
        let query = "SELECT * FROM consignment where ((region='NORTH' and status='created') or status='assign to north') and is_approved = 1 ORDER BY cn_no asc; SELECT * FROM users WHERE position='driver';"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message:'there are some error with query'
                    })
            } else if (rows.length == 0 ){
                res.json({
                    status:false,
                    message:"No results found"
                   });
            } else {
                res.json({
                    status: 1,
                    data:rows
                })
            }
            
        })
    },

    getConsignmentSouth: (req,res) => { 
        let query = "SELECT * FROM consignment where ((region='SOUTH' and status='created') or status='assign to south') and is_approved = 1 ORDER BY cn_no asc; SELECT * FROM users WHERE position='driver';"

        connection.query(query, (err,rows) => {
            if(err){
                console.log(query)
                res.json({
                    status:false,
                    message:'there are some error with query'
                    })
            } else if (rows.length == 0 ){
                res.json({
                    status:false,
                    message:"No results found"
                   });
            } else {
                res.json({
                    status: 1,
                    data:rows
                })
            }
            
        })
    },

    postConsignmentHq: (req, res) => {
        let consignmentIds = req.body.arr;
        let driverName = req.body.driver;
        let consignmentQuery = "SELECT * FROM consignment WHERE id IN ("+ consignmentIds +");"
        let consignments;
        //fetch all the consignment request

        console.log(req.body);
        connection.query(consignmentQuery, (err, rows) => {
            if(err){
                res.json({
                    status:false,
                    message:'there are some error with query'
                    })
            } else if (rows.length == 0 ){
                res.json({
                    status:false,
                    message:"No results found"
                   });
            } else {

                console.log(rows);
                //loop in consignments
                Object.keys(rows).forEach(function(key) {
                    var row = rows[key];

                    console.log(row);
                    //region fetch based upon destination code
                    let regionQuery = "SELECT * FROM region WHERE destination_code = ? ;"
                    connection.query(regionQuery,[row.destination_code], (regerr, regrows) => {
                        if(err){
                            console.log(regerr);
                        }else { 
                        
                            //updating the consignments
                            let status, tracking_status;
                            let ts = Date.now();
                            let date_ob = new Date(ts);

                            console.log(regrows);
                            let updateConsignmentQuery = "update consignment set driver_name = ?,  status = ?, expiry_date = ?  where id = ?";
                            if(regrows[0].region === "SOUTH"  && row.region != "SOUTH"){
                                status = "assign to south";
                                tracking_status = "TRANSIT JB"
                            }else if (regrows[0].region === "NORTH" && row.region != "NORTH"){
                                status = "assign to north";
                                tracking_status = "TRANSIT PENANG"
                            }else {
                                status = "out for delivery"
                                tracking_status = "ARRANGING"

                                //out for delivery
                                var ofd_data={
                                    'cn_no' : row.cn_no,
                                    'shipper_code': row.shipper_code,
                                    'destination_code': row.destination_code,
                                    'driver_name': driverName,
                                    'receiver_name': row.receiver_name,
                                }

                                connection.query('INSERT INTO out_for_delivery SET ?',ofd_data, function (ofderr, ofdres, fields) {
                                    if (ofderr) {
                                      console.log(ofderr)
                                    }else{
                                        console.log("out for delivery data added suceessfully");
                                    }
                                });

                            }
                            
                            let consignment_data = [driverName, status, req.body.expiry_date ,row.id ];
                            // console.log( "region : " + regrows[0].region);
                            console.log( "status : " + status);
                            console.log( "cn_no : " + row.cn_no);
                            connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
                                if(err){
                                    console.log(err)
                                } else {
                                    console.log("updated sucessfully");
                                }
                            })

                            //creating a record in tracking
                            var tracking_data={
                                "cn_no":row.cn_no,
                                "status":tracking_status,
                                "datetime":date_ob,
                            }
                            connection.query('INSERT INTO tracking SET ?',tracking_data, function (trerr, trres, fields) {
                                if (trerr) {
                                  console.log(trerr)
                                }else{
                                    console.log("tracking data added suceessfully");
                                }
                            });

                            //creating a log
                            var log_data = {
                                "user_id"   : req.params.id,
                                "cn_no"     : row.cn_no,
                               "status": " has moved the  consignment no [" + row.cn_no + " ] to " + status
                            }
                            connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                                if (lgerr) {
                                  console.log(lgerr)
                                }else{
                                    console.log("log added successfully");
                                }
                            });
                        }
                    })
                  });
            }
        })

        res.json({
            status:true,
            message:"Successfully updated the records"
            });
    },

    postConsignmentNorth: (req, res) => {
        let consignmentIds = req.body.arr;
        let driverName = req.body.driver;
        let consignmentQuery = "SELECT * FROM consignment WHERE id IN ("+ consignmentIds +");"
        let consignments;
        //fetch all the consignment request
        connection.query(consignmentQuery, (err, rows) => {
            if(err){
                res.json({
                    status:false,
                    message:'there are some error with query'
                    })
            } else if (rows.length == 0 ){
                res.json({
                    status:false,
                    message:"No results found"
                   });
            } else {

                //loop in consignments
                Object.keys(rows).forEach(function(key) {
                    var row = rows[key];
                        
                    //updating the consignments
                    let ts = Date.now();
                    let date_ob = new Date(ts);
                    let status, out_for_deleivery_status;
                    let updateConsignmentQuery = "update consignment set driver_name = ?, status = ?, expiry_date = ?  where id = ?";
                    
                    if(row.status === 'created'){
                        status = "assign to hq";
                        out_for_deleivery_status = "HQ";
                        let consignment_data = [driverName, status, req.body.expiry_date, row.id ];
                        connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
                            if(err){
                                console.log(err)
                            } else {
                                console.log("updated sucessfully");
                            }
                        })
                    } else{
                        status = "out for delivery";
                        out_for_deleivery_status = "ARRANGING";
                        let consignment_data = [driverName, status, req.body.expiry_date, row.id ];
                        connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
                            if(err){
                                console.log(err)
                            } else {
                                console.log("updated sucessfully");
                            }
                        })

                         //out for delivery
                        var ofd_data={
                            'cn_no' : row.cn_no,
                            'shipper_code': row.shipper_code,
                            'destination_code': row.destination_code,
                            'driver_name': driverName,
                            'receiver_name': row.receiver_name,
                        }

                        connection.query('INSERT INTO out_for_delivery SET ?',ofd_data, function (ofderr, ofdres, fields) {
                            if (ofderr) {
                                console.log(ofderr)
                            }else{
                                console.log("out for delivery data added suceessfully");
                            }
                        });
                    }
     
                    //creating a record in tracking
                    var tracking_data={
                        "cn_no":row.cn_no,
                        "status":out_for_deleivery_status,
                        "datetime":date_ob,
                    }
                    connection.query('INSERT INTO tracking SET ?',tracking_data, function (trerr, trres, fields) {
                        if (trerr) {
                            console.log(trerr)
                        }else{
                            console.log("tracking data added suceessfully");
                        }
                    });

                    //creating a log
                    var log_data = {
                        "user_id"   : req.params.id,
                        "cn_no"     : row.cn_no,
                        "status": " has moved the  consignment no [" + row.cn_no + " ] to " + status
                    }
                    connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                        if (lgerr) {
                            console.log(lgerr)
                        }else{
                            console.log("log added successfully");
                        }
                    });
                });
            }
        })

        res.json({
            status:true,
            message:"Successfully updated the records"
            });
    },

    postConsignmentSouth: (req, res) => {
        let consignmentIds = req.body.arr;
        let driverName = req.body.driver;
        let consignmentQuery = "SELECT * FROM consignment WHERE id IN ("+ consignmentIds +");"

        //fetch all the consignment request
        connection.query(consignmentQuery, (err, rows) => {
            if(err){
                res.json({
                    status:false,
                    message:'there are some error with query'
                    })
            } else if (rows.length == 0 ){
                res.json({
                    status:false,
                    message:"No results found"
                   });
            } else {

                //loop in consignments
                Object.keys(rows).forEach(function(key) {
                    var row = rows[key];
                        
                    //updating the consignments
                    let ts = Date.now();
                    let date_ob = new Date(ts);
                    let status, out_for_deleivery_status;
                    let updateConsignmentQuery = "update consignment set driver_name = ?, status = ?, expiry_date = ?  where id = ?";
                
 
                    if(row.status === 'created'){
                        status = "assign to hq";
                        out_for_deleivery_status = "HQ";
                        let consignment_data = [driverName, status, req.body.expiry_date, row.id ];

                        connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
                            if(err){
                                console.log(err)
                            } else {
                                console.log("updated sucessfully");
                            }
                        })
                    } else{
                        status = "out for delivery";
                        out_for_deleivery_status = "ARRANGING";
                        let consignment_data = [driverName, status, req.body.expiry_date, row.id ];

                        connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
                            if(err){
                                console.log(err)
                            } else {
                                console.log("updated sucessfully");
                            }
                        })

                        
                        //out for delivery
                        var ofd_data={
                            'cn_no' : row.cn_no,
                            'shipper_code': row.shipper_code,
                            'destination_code': row.destination_code,
                            'driver_name': driverName,
                            'receiver_name': row.receiver_name,
                        }

                        connection.query('INSERT INTO out_for_delivery SET ?',ofd_data, function (ofderr, ofdres, fields) {
                            if (ofderr) {
                                console.log(ofderr)
                            }else{
                                console.log("out for delivery data added suceessfully");
                            }
                        });
                    }
                   
                            
                    //creating a record in tracking
                    var tracking_data={
                        "cn_no":row.cn_no,
                        "status":out_for_deleivery_status,
                        "datetime":date_ob,
                    }
                    connection.query('INSERT INTO tracking SET ?',tracking_data, function (trerr, trres, fields) {
                        if (trerr) {
                            console.log(trerr)
                        }else{
                            console.log("tracking data added suceessfully");
                        }
                    });

                    //creating a log
                    var log_data = {
                        "user_id"   : req.params.id,
                        "cn_no"     : row.cn_no,
                        "status": " has moved the  consignment no [" + row.cn_no + " ] to " + status
                    }
                    connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                        if (lgerr) {
                            console.log(lgerr)
                        }else{
                            console.log("log added successfully");
                        }
                    });
                });
            }
        })

        res.json({
            status:true,
            message:"Successfully updated the records"
            });
    },

    deleteConsignment: (req,res) => { 
        let cn_no = req.params.cn_no;

        connection.query('delete from consignment where cn_no= ?',cn_no, function (lgerr, lgres, fields) {
            if (lgerr) {
                console.log(lgerr)
            }else{
                console.log("Consignment deleted successfully");
                connection.query('delete from tracking where cn_no= ?',cn_no, function (err, lgres, fields) {
                    if (err) {
                        console.log(err)
                    }else{
                        console.log("Tracking deleted successfully");
                    }
                });
                connection.query('delete from out_for_delivery where cn_no= ?',cn_no, function (er, lgres, fields) {
                    if (er) {
                        console.log(er)
                    }else{
                        console.log(" Out for delivery record deleted successfully");
                    }
                });

                //creating a log
                var log_data = {
                    "user_id" : req.params.id,
                    "cn_no"   : cn_no,
                    "status": " has deleted the POD for  Consignment No. [" + cn_no + " ] and pushed back to out for delivery "
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
                    message:"Consignment Deleted Successfully"
                    });
            }
        });
    },

    getLogs: (req,res) => {
        let cn_no = req.params.cn_no;
        let query = "SELECT l.*, u.firstname FROM log l, users u where l.user_id = u.id and l.cn_no = ?;"
       connection.query(query, cn_no, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                res.json({
                    status: 2,
                    message: "No consignment record found",
                    data:rows
                })
            } else {
        
                res.json({
                    status: true,
                    logs:rows,
                })
                
            }
            
        })
       
    },


    postConsignmentBack: (req, res) => {
        console.log(req.body);
        let data = JSON.parse(req.body.arr);
        let consignmentIds = req.body.arr;
        let today = new Date();
        Object.keys(data).forEach(function(key) {
            var row = data[key];
            console.log(row);
            let query = "SELECT * FROM consignment where cn_no = ?;"
            connection.query(query, row, (err,rowss) => {
                 if(err){
                     console.log(err);
                 }else {
                     console.log(rowss[0])
                     let regionQuery = "SELECT * FROM region WHERE destination_code = ? ;"
                connection.query(regionQuery,rowss[0].destination_code, (regerr, regrows) => {
                    if(err){
                        console.log(regerr);
                    }else { 
                        if(regrows[0].region === "SOUTH"  && rowss[0].region != "SOUTH"){
                            status = "assign to south";
                        }else if (regrows[0].region === "NORTH"  && rowss[0].region != "NORTH"){
                            status = "assign to north";
                        }else {
                            status = "assign to hq";
                        }
             
                            let updateConsignmentQuery = "update consignment set status = ?  where cn_no = ?";
                            let consignment_data = [ status, rowss[0].cn_no ];
                            let delete_tracking = "delete from out_for_delivery where cn_no = ?;"

                            connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
                                if(err){
                                    console.log(err)
                                } else {
                                    console.log("cONSIGNMENT updated sucessfully");
                                }
                            });
                            connection.query(delete_tracking, rowss[0].cn_no, (err,rows) => {
                                if(err){
                                    console.log(err)
                                } else {
                                    console.log("OFD Deleted sucessfully");
                                }
                            })
                        
                    }
                });
                 }
                 
             })
        });
        res.json({
            status:true,
            message:"Successfully updated the records"
            });
        
     
    },
}