var connection = require('../../../config');

module.exports = {
    index: (req,res) => {
        let query = "SELECT * FROM shipping where deleted_by = '';"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are sopme error with query'
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
        let shipper_code = req.body.shipper_code;
        let shipper_name = req.body.shipper_name;
        let today = new Date();
        
        console.log(shipper_name);
        console.log(shipper_code);
        let validationQuery = "SELECT * FROM shipping where shipper_code = ? or shipper_name = ?;"
        let validationData = [shipper_code, shipper_name];
        connection.query(validationQuery, validationData, (err,rows) => { 
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with validation query'
                })
            } else if (rows.length == 0 ){
                
                //inserting the record in shipping table
                var shipping_data = {
                    'shipper_code'    :  shipper_code,
                    'shipper_name'    :  shipper_name,
                    'contact'         :  req.body.contact,
                    'gst_id'          :  req.body.gst_id,
                    'address1'        :  req.body.address1,
                    'city'            :  req.body.city,
                    'state'           :  req.body.state,
                    'country'         :  req.body.country,
                    'postcode'        :  req.body.postcode,
                    'telephone'       :  req.body.telephone,
                    'mobile'          :  req.body.mobile,
                    'fax'             :  req.body.fax,
                    'email'           :  req.body.email,
                    'credit_limit'    :  req.body.credit_limit,
                    'term_day'        :  req.body.term_day,
                    'invoice_format'  :  req.body.invoice_format,
                    'deleted_by'      :  ''
                }

                connection.query('INSERT INTO shipping SET ?', shipping_data, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Shipping record added sucessfully");
                    }
                })


                //inserting the record in charges table based on shipping
                let chargeQuery = "select distinct destination_code from destination where deleted_by = ''  order by destination_code;"
                connection.query(chargeQuery, (err,rows) => { 
                    if(err){
                        console.log(err);
                    }else{
                        //inserting records in charge table
                        rows.forEach(e => {
                            var charge_data = {
                                'shipper_code'      : shipper_code,
                                'destination_code'  : e.destination_code,
                                'created_by'        : '',
                                'created_on'        : today
                            }

                            connection.query('INSERT INTO charges SET ?', charge_data, (err,rows) => {
                                if(err){
                                    console.log(err);
                                } else {
                                    console.log("charge for " + e.destination_code + " added sucessfully");
                                }
                            })

                        });
                    }
                })

                //inserting record in accounta table
                var account_data = {
                    'shipper_code' : shipper_code,
                    'shipper_name' : shipper_name,
                    'details'      : 'Account created',
                    'amount'       : '0.00',
                    'acc_bal'      : '0.00',
                    'update_time'  : today
                }

                connection.query('INSERT INTO shipper_acc SET ?', account_data, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Account- Record added sucessfully");
                    }
                })

                //adding a log
                var log_data = {
                    "status": "user - " + req.params.id + "created shipper name" + shipper_name + " - " +  shipper_code 
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
                    message:'Shipper  Added sucessfully'
                })

            } else {
                res.json({
                    status:2,
                    message: 'shipper name / Code Already exists'
                })
            }
        })
    },
    
    update: (req,res) => {
        let today = new Date();

        var shipping_data = {
            'shipper_name'    :  req.body.shipper_name,
            'contact'         :  req.body.contact,
            'gst_id'          :  req.body.gst_id,
            'address1'        :  req.body.address1,
            'city'            :  req.body.city,
            'state'           :  req.body.state,
            'country'         :  req.body.country,
            'postcode'        :  req.body.postcode,
            'telephone'       :  req.body.telephone,
            'mobile'          :  req.body.mobile,
            'fax'             :  req.body.fax,
            'email'           :  req.body.email,
            'credit_limit'    :  req.body.credit_limit,
            'term_day'        :  req.body.term_day,
            'invoice_format'  :  req.body.invoice_format,
            'deleted_by'      :  '',
            'changed_on'      :  today,
            'changed_by'      :  req.params.id   
        }

        let query = "UPDATE shipping SET ? where shipper_code = ?"

        let data = [shipping_data, req.body.shipper_code];
            connection.query(query,data, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    res.json({
                        status:false,
                        message:'there are some error with query'
                    })
                }else{ 

                    //updating account data
                    let updatequery = "UPDATE shipper_acc SET ? where shipper_code = ?"
                    var account_data = {
                        'shipper_name' : req.bofy.shipper_name
                    }
                    let data1 = [account_data , req.body.shipper_code];

                    connection.query(updatequery,data1, function (error, results, fields) { 
                        if(error){
                            console.log(error);
                        }else{
                            console.log("shipper_acc updated sucessfully")
                        }
                    })

                     //adding a log
                    var log_data = {
                        "status": "user - " + req.params.id + "updates shipper code" + req.body.shipper_code + " - " +  req.body.shipper_name 
                    }
                    connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                        if (lgerr) {
                        console.log(lgerr)
                        }else{
                            console.log("log added successfully");
                        }
                    });

                    res.json({
                        status:1,
                        message:'Shipping Data Sucessfully updated'
                    })
                }
            })
    },
    destroy: (req,res) => {
        let shipper_code, shipper_name;
        let query = "SELECT * FROM shipping where id = ?;"
        let shipping_id = req.params.shipping_id;
        connection.query(query,shipping_id, (err,rows) => {
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
                shipper_code = rows[0].shipper_code;
                shipper_name = rows[0].shipper_name;

                let delete_query = "delete from shipping where id=?;"
                connection.query(delete_query, shipping_id, (err,rows) => {
                    if(err){
                        res.json({
                            status:false,
                            message: 'there are some errors with query'
                        })
                    } else {
                        res.json({
                            status: 1,
                            message: 'Shipping Record Deleted Successfully'
                        })
                    }
                })
            }
        })
    }
}


