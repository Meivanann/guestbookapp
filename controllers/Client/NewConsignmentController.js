var connection = require('../../config');

module.exports = {
     generateNeConsignmentNumber: (req, res) => {
        let cn_no = 0;
        let query = "SELECT * FROM consignment where is_online = 1 order by cn_no desc;"
        connection.query(query, req.body.cn_no, (err,rows) => {
             if(err){
                 console.log(err);
             }  else if (rows.length === 0) {
                 res.json({
                     status:true,
                     cn_no : 1
                 })
             } else{
                 console.log(req.params.id);
                cn_no = parseFloat(rows[0].cn_no) + 1
                connection.query('select * from shipping where user_id = ?', req.params.id, (shipping_err,shipping_rows) => {
                    if(shipping_err){
                        console.log(shipping_err);
                    } else{
                        console.log(shipping_rows);
                        res.json({
                            status:true,
                            cn_no : cn_no,
                            shipper_details :shipping_rows[0]
                        });
        
                    }
                });
             }
        });

     },
    postNewConsignmentClient: (req,res) => {
        let region = req.body.region;
        let today = new Date();
        let status;

        // let quantity =  parseFloat(req.body.pkt_size) + parseFloat(req.body.carton_size) + parseFloat(req.body.pallet_size) + parseFloat(req.body.p_size)  + parseFloat(req.body.s_size) + parseFloat(req.body.m_size) + parseFloat(req.body.l_size) + parseFloat(req.body.xl_size) + parseFloat(req.body.m3_min_size) + parseFloat(req.body.m3_size) + parseFloat(req.body.weight_min_size) +   parseFloat(req.body.weight_size) + parseFloat(req.body.other_charges);

        // console.log(quantity);

        var consignment_data={
            "cn_no":req.body.cn_no,
            "shipper_code":req.body.shipper_code,
            "shipper_name":req.body.shipper_name,
            "receiver_code":req.body.receiver_code,
            "receiver_name":req.body.receiver_name,
            // "pod": req.body.pod,
            "destination_code":req.body.destination_code,
            "region":req.body.region,
            "cn_datetime":today,
            "quantity":req.body.quantity,
            "measure":req.body.measure,
            "pkt_size":req.body.pkt_size,
            "pkt_rate":req.body.pkt_rate,
            "carton_size":req.body.carton_size,
            "carton_rate":req.body.carton_rate,
            "pallet_size":req.body.pallet_size,
            "pallet_rate":req.body.pallet_rate,
            "p_size":req.body.p_size,
            "p_rate":req.body.p_rate,
            "s_size":req.body.s_size,
            "s_rate":req.body.s_rate,
            "m_size":req.body.m_size,
            "m_rate":req.body.m_rate,
            "l_size":req.body.l_size,
            "l_rate":req.body.l_rate,
            "xl_size":req.body.xl_size,
            "xl_rate":req.body.xl_rate,
            "m3_min_size":req.body.m3_min_size,
            "m3_min_rate":req.body.m3_min_rate,
            "m3_size":req.body.m3_size,
            "m3_rate":req.body.m3_rate,
            "weight_min_size":req.body.weight_min_size,
            "weight_min_rate":req.body.weight_min_size,
            "weight_size":req.body.weight_size,
            "weight_rate":req.body.weight_size,
            "other_charges":req.body.other_charges,
            "other_amount":req.body.other_amount,
            "sub_amount":req.body.sub_amount,
            "tax_amount":req.body.tax_amount,
            "total_amount":req.body.total_amount,
            "status":'created',
            "remarks":req.body.remarks,
            "invoice_no":'',
            'is_approved' : 0,
            'is_online' : 1
        }
        //inserting a record in consignmnet table
        let query = "INSERT INTO consignment SET ?"
        connection.query(query,consignment_data, function (error, results, fields) {
            if (error) {
                console.log(error);
              res.json({
                  status:false,
                  message:'there are some error with query'
              })
            }else{

                //creating a log
                var log_data = {
                    "user_id" : req.params.id,
                    "cn_no"   : req.body.cn_no,
                    "status": " has create new Consignment No. [" + req.body.cn_no + " ] to " + status
                }
                connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                    if (lgerr) {
                    console.log(lgerr)
                    }else{
                        console.log("log added successfully");
                    }
                });

                console.log("Consignment Added succesfullt")
                res.json({
                  status:true,
                  message:'Consignment Created sucessfully'
              })
            }
        });       
    },

    updateConsignment: (req,res) => {
        let today = new Date();
        let status, status_old, destination_old, quantity;
        let user_id = req.params.id;
        var consignment_data;

        console.log(req.body);
        //fetching the old record
        let query = "SELECT * FROM consignment where cn_no = ?;"
        connection.query(query, req.body.cn_no, (err,rows) => {
             if(err){
                 console.log(err);
             }  else {
                status_old = rows[0].status;
                destination_old = rows[0].destination_code;
                // quantity =  req.body.carton_size + req.body.m3_size + req.body.p_size + req.body.s_size + req.body.m_size + req.body.b_size + req.body.xl_size + req.body.pkt_size + req.body.other_charges;

                //setting the data for update
                    consignment_data={
                        "cn_no":req.body.cn_no,
                        "shipper_code":req.body.shipper_code,
                        "shipper_name":req.body.shipper_name,
                        "receiver_code":req.body.receiver_code,
                        "receiver_name":req.body.receiver_name,
                        // "pod": req.body.pod,
                        "destination_code":req.body.destination_code,
                        "region":req.body.region,
                        "cn_datetime":today,
                        "quantity":req.body.quantity,
                        "measure":req.body.measure,
                        "pkt_size":req.body.pkt_size,
                        "pkt_rate":req.body.pkt_rate,
                        "carton_size":req.body.carton_size,
                        "carton_rate":req.body.carton_rate,
                        "pallet_size":req.body.pallet_size,
                        "pallet_rate":req.body.pallet_rate,
                        "p_size":req.body.p_size,
                        "p_rate":req.body.p_rate,
                        "s_size":req.body.s_size,
                        "s_rate":req.body.s_rate,
                        "m_size":req.body.m_size,
                        "m_rate":req.body.m_rate,
                        "l_size":req.body.l_size,
                        "l_rate":req.body.l_rate,
                        "xl_size":req.body.xl_size,
                        "xl_rate":req.body.xl_rate,
                        "m3_min_size":req.body.m3_min_size,
                        "m3_min_rate":req.body.m3_min_rate,
                        "m3_size":req.body.m3_size,
                        "m3_rate":req.body.m3_rate,
                        "weight_min_size":req.body.weight_min_size,
                        "weight_min_rate":req.body.weight_min_size,
                        "weight_size":req.body.weight_size,
                        "weight_rate":req.body.weight_size,
                        "other_charges":req.body.other_charges,
                        "other_amount":req.body.other_amount,
                        "sub_amount":req.body.sub_amount,
                        "tax_amount":req.body.tax_amount,
                        "total_amount":req.body.total_amount,
                        "status":"created", 
                        "remarks":req.body.remarks,
                    }
                
                //updating the consignment
                let query = "UPDATE consignment SET ? where cn_no = ?"
                let data1 = [consignment_data ,req.body.cn_no ]
                connection.query(query,data1, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    res.json({
                        status:false,
                        message:'there are some error with query'
                    })
                    }else{
                        
                        //creating a log
                        var log_data = {
                            "user_id" : req.params.id,
                            "cn_no"   : req.body.cn_no,
                            "status": " has updated the Consignment No. [" + req.body.cn_no + " ] " 
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
                })
             }
         })
    }
}


