var connection = require('../../../config');

module.exports = {
    index: (req,res) => {
        let query = "SELECT * FROM destination;"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                res.json({
                    status: -1,
                    message:' No results found'
                })
            } else {
                res.json({
                    status: 1,
                    data:rows
                })
            }
        })
    },

    store: (req,res) => {

        console.log(req.body.destination_code);
        console.log(req.body.destination_name);
        let today = new Date();
   
        let validationQuery = "SELECT * FROM destination where destination_code = ? or destination_name = ?;"
        let validationData = [req.body.destination_code, req.body.destination_name];
        connection.query(validationQuery, validationData, (err,rows) => { 
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with validation query'
                })
            } else if (rows.length == 0 ){
                
                //adding a record in destination table
                var destination_data = {
                    'destination_code'    :  req.body.destination_code,
                    'destination_name'    :  req.body.destination_name,
                    'created_on'          :  today,
                    'created_by'          :  req.params.id,
                    'deleted_by'          :  '',
                }
                connection.query('INSERT INTO destination SET ?', destination_data, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Destination record added sucessfully");
                    }
                })

                //adding a record in  region table
                var region_data = {
                    'destination_code'    :  req.body.destination_code,
                    'destination_name'    :  req.body.destination_name,
                    'region'              :  req.body.region,
                }
                connection.query('INSERT INTO region SET ?', region_data, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Region record added sucessfully");
                    }
                })

                //adding rows in charges table using shipping table
                let chargeQuery = "select distinct shipper_code from shipping  order by shipper_code;"
                connection.query(chargeQuery, (err,rows) => { 
                    if(err){
                        console.log(err);
                    }else{
                        //inserting records in charge table
                        rows.forEach(e => {
                            var charge_data = {
                                'shipper_code'      : e.shipper_code,
                                'destination_code'  : req.body.destination_code,
                                'created_by'        : '',
                                'created_on'        : today,
                                'changed_by'        : '',
                                'changed_on'        : null,
                                'deleted_by'        : '',
                                'deleted_on'        : null
                            }

                            connection.query('INSERT INTO charges SET ?', charge_data, (err,rows) => {
                                if(err){
                                    console.log(err);
                                } else {
                                    console.log("charge for " + e.shipper_code + " added sucessfully");
                                }
                            })
                        });
                    }
                })

                 //adding a log
                 var log_data = {
                    "status": "user - " + req.params.id + "created destination -  name" + req.body.destination_name + " - " +  req.body.destination_code 
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
                    message:'Destination  Added sucessfully'
                })


            }else{
                res.json({
                    status:2,
                    message: 'Destination name / code Already exists'
                })
            }
        })
    },

    update: (req,res) => {
        let today = new Date();

        console.log(req.body);
        //updating destination table
        var destination_data = {
            'destination_code'      :  req.body.destination_code,
            'destination_name'      :  req.body.destination_name,
            'changed_on'            :  today,
            'changed_by'            :  req.params.id,
        }
        let destination_query = "UPDATE destination SET ? where destination_code = ?"
        let data = [destination_data, req.body.destination_code];

        connection.query(destination_query,data, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.json({
                    status:false,
                    message:'there are some error with query'
                })
            }else{
                console.log("Destination taable updated sucessfully")
             }
        })

        //updating the region table
        var region_data = {
            'destination_code'  : req.body.destination_code,
            'destination_name'  : req.body.destination_name,
            'region'            : req.body.region
        }
        let region_query = "UPDATE region SET ? where destination_code = ?"
        let data1 = [region_data, req.body.destination_code];

        connection.query(region_query,data1, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.json({
                    status:false,
                    message:'there are some error with query'
                })
            }else{
                console.log("region taable updated sucessfully")
             }
        })

        //adding a log
        var log_data = {
            "status": "user - " + req.params.id + "update destination -  name" + req.body.destination_name + " - " +  req.body.destination_code 
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
            message:'Destination  updated sucessfully'
        })
    },
    destroy: (req,res) => {
        let destination_code, destination_name;
        let query = "SELECT * FROM destination where id = ?;"
        let destination_id = req.params.destination_id;
        connection.query(query,destination_id, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                res.json({
                    status: 2,
                    message:' Data Doest exist'
                })
            } else {
                destination_code = rows[0].destination_code;
                destination_name = rows[0].destination_name;

                let delete_query = "delete from destination where id=?;"
                connection.query(delete_query, destination_id, (err,rows) => {
                    if(err){
                        console.log(" Error With destination Query");
                    } else {
                        //deleting the destination record in region table
                        let region_delete_query = "delete from region where destination_code=?;"
                        connection.query(delete_query, destination_code, (err,rows) => {
                            if(err){
                                console.log(" Error With region Query");
                            } else {
                               console.log(" Region deleted successfully");
                            }
                        })
                        //deleting the record in destination record in charges table
                        let charge_delete_query = "delete from charges where destination_code=?;"
                        connection.query(delete_query, destination_code, (err,rows) => {
                            if(err){
                                console.log(" Error With charge Query");
                            } else {
                                console.log(" Destination deleted successfully");
                            }
                        })
                        res.json({
                            status: 1,
                            message: 'Destination Record Deleted Successfully'
                        })
                    }
                })
            }
        })
    },

    getDestinationShipperData: (req,res) => {
        let query = "SELECT destination_code FROM charges where shipper_code = ?;"

        connection.query(query, req.params.shipper_code, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else {
                connection.query(query, req.params.shipper_code, (err,all_rows) => {
                    if(err){
                        res.json({
                            status:false,
                            message: 'there are some error with query'
                        })
                    } else {
                            res.json({
                                status: true,
                                shipper_code:req.params.shipper_code,
                                selectedDestinationCodes: rows,
                                allDestinationCodes:all_rows
                            })
                    }
                });
            }
        })
    },

    postDestinationShipperData:(req,res) => {
        let shipper_code = req.body.shipper_code;
        let data = JSON.parse(req.body.update_charges);

        let query = "Delete from  charges where shipper_code = ?"
        connection.query(query, shipper_code,(err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            }  else {
                data.forEach(element => {
                    console.log(element);
                });
                res.json({
                    status: 1,
                    data:"wait"
                })
            }
        })

    }

}