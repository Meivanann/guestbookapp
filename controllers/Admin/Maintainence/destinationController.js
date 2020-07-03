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

    getRegion: (req,res) => {
        let query = "SELECT region FROM region where destination_code = ?;"

        connection.query(query, req.params.destination_code, (err,rows) => {
            if(err){
                console.log(err);   
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
                    data:rows[0]
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
        let query = "SELECT * FROM charges where shipper_code = ?;"
        let arra = [];
        connection.query(query, req.params.shipper_code, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else {
                let query1 = "SELECT destination_code FROM destination order by destination_name;"
                connection.query(query1, (err,all_rows) => {
                    if(err){
                        res.json({
                            status:false,
                            message: 'there are some error with query'
                        })
                    } else {

                        Object.keys(all_rows).forEach(function(key) {
                            var row = all_rows[key];

                            let selected = false, datass;
                            let carton_rate = 0;
                            let pkt_rate = 0;
                            let pallet_rate = 0;
                            let p_rate = 0;
                            let s_rate = 0;
                            let m_rate = 0;
                            let l_rate = 0;
                            let xl_rate = 0;
                            let m3_rate = 0;
                            let m3_min_rate = 0;
                            let weight_min_rate = 0;
                            let weight_rate = 0;


                            Object.keys(rows).forEach(function(key) {
                                var row1 = rows[key];

                                if(row.destination_code === row1.destination_code){
                                    selected = true;
                                    carton_rate = row1.carton_rate;
                                    pkt_rate = row1.pkt_rate;
                                    pallet_rate =  row1.pallet_rate;
                                    p_rate =  row1.p_rate;
                                    s_rate = row1.s_rate;
                                    m_rate = row1.m_rate;
                                    l_rate = row1.l_rate;
                                    xl_rate = row1.xl_rate;
                                    m3_rate = row1.m3_rate;
                                    m3_min_rate = row1.m3_min_rate;
                                    weight_rate =  row1.weight_min_rate;
                                    weight_rate = row1.weight_rate;
                                }
    
                            });

                            datass = {
                                "destination_code" : row.destination_code,
                                "selected" : selected,
                                "carton_rate"       :   carton_rate,
                                "pkt_rate"          :   pkt_rate,
                                "pallet_rate"       :   pallet_rate,
                                "p_rate"            :   p_rate,
                                "s_rate"            :   s_rate,
                                "m_rate"            :   m_rate,
                                "l_rate"            :   l_rate,
                                "xl_rate"           :   xl_rate,
                                "m3_rate"           :   m3_rate,
                                "m3_min_rate"       :   m3_min_rate,
                                "weight_min_rate"   :   weight_min_rate,
                                "weight_rate"       :   weight_rate,
                            }

                            arra.push(datass);
                        });

                        // console.log(arra);
                            res.json({
                                status: true,
                                shipper_code:req.params.shipper_code,
                                destination_code: arra,
                            })
                    }
                });
            }
        })
    },

    postDestinationShipperData:(req,res) => {
        let shipper_code = req.body.shipper_code;
        let data = JSON.parse(req.body.update_charges);

        // console.log(req.body);
        let query = "Delete from  charges where shipper_code = ?"
        connection.query(query, shipper_code,(err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            }  else {
                data.forEach(element => {
                    // console.log(element.selected);

                    if(element.selected === true) {
                    var charges_data = {
                        "shipper_code"     :    req.body.shipper_code,
                        "destination_code"  :   element.destination_code,
                        "carton_rate"       :   element.carton_rate,
                        "pkt_rate"          :   element.pkt_rate,
                        "pallet_rate"       :   element.pallet_rate,
                        "p_rate"            :   element.p_rate,
                        "s_rate"            :   element.s_rate,
                        "m_rate"            :   element.m_rate,
                        "l_rate"            :   element.l_rate,
                        "xl_rate"           :   element.xl_rate,
                        "m3_rate"           :   element.m3_rate,
                        "m3_min_rate"       :   element.m3_min_rate,
                        "weight_min_rate"   :   element.weight_min_rate,
                        "weight_rate"       :   element.weight_rate,
                    }

                    connection.query('INSERT INTO charges SET ?',charges_data, function (error, results, fields) {
                        if (error) {
                          res.json({
                              status:false,
                              message:'there are some error with query'
                          })
                        }else{
                            console.log("charges updated successfully");
                        }
                      });
                    }

                });

                res.json({
                    status:true,
                    message:'Charges updated sucessfully'
                })
            }
        })
    }

}