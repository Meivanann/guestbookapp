var connection = require('./../../../config');

module.exports = {

    getConsignmentHq: (req,res) => { 
        let query = "SELECT * FROM consignment WHERE region = 'HQ' AND status='created' ORDER BY cn_datetime DESC; SELECT * FROM users WHERE position='driver';"

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
        let query = "SELECT * FROM consignment WHERE region = 'NORTH'  and status='assign to north' ORDER BY cn_datetime DESC; SELECT * FROM users WHERE position='driver';"

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
        let query = "SELECT * FROM consignment WHERE region = 'SOUTH'  and status='assign to south' ORDER BY cn_datetime DESC; SELECT * FROM users WHERE position='driver';"

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

    postConsignmentHq: (req, res) => {
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

                            let updateConsignmentQuery = "update consignment set driver_name = ?, region = ?, status = ?  where id = ?";
                            if(regrows[0].region === "SOUTH"){
                                status = "assign to south";
                                tracking_status = "TRANSIT JB"
                            }else if (regrows[0].region === "NORTH"){
                                status = "assign to south";
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
                            
                            let consignment_data = [driverName, regrows[0].region, status, row.id ];
                            console.log( "region : " + regrows[0].region);
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
                               "status": "user - " + req.params.id + "move consignment no [" + row.cn_no + " ] to " + status
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
                    let updateConsignmentQuery = "update consignment set driver_name = ?, status = ?  where id = ?";
                    let status = "out for delivery";

                    let consignment_data = [driverName, status, row.id ];

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
                            
                    //creating a record in tracking
                    var tracking_data={
                        "cn_no":row.cn_no,
                        "status":'ARRANGING',
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
                        "status": "user - " + req.params.id + "move consignment no [" + row.cn_no + " ] to " + status
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
                    let updateConsignmentQuery = "update consignment set driver_name = ?, status = ?  where id = ?";
                    let status = "out for delivery";

                    let consignment_data = [driverName, status, row.id ];

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
                            
                    //creating a record in tracking
                    var tracking_data={
                        "cn_no":row.cn_no,
                        "status":'ARRANGING',
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
                        "status": "user - " + req.params.id + "move consignment no [" + row.cn_no + " ] to " + status
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
    }
}