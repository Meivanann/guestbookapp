var connection = require('../../../config');

module.exports = {
    getShipperDetails: (req,res) => {
        console.log(req.params.id);
        let query = "SELECT * FROM shipping"
       connection.query(query, (err,rows) => {
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

    getDestinationDetails: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let query = "select distinct(c.destination_code) as destination_code, d.destination_name from charges c, destination d where shipper_code = ? and (pkt_rate != '0.00' or carton_rate != '0.00' or pallet_rate != '0.00' or p_rate != '0.00' or  s_rate != '0.00' or m_rate != '0.00' or l_rate != '0.00' or xl_rate != '0.00' or m3_min_rate != '0.00' or m3_rate != '0.00' or weight_min_rate != '0.00' or weight_rate != '0.00') and c.destination_code = d.destination_code order by destination_code;"
       connection.query(query, shipper_code, (err,rows) => {
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

    getChargeDetails: (req,res) => {
        let shipper_code = req.body.shipper_code;
        let destination_code = req.body.destination_code;
        let query = "select * from charges where shipper_code = ? and destination_code = ?;"
        let data = [ shipper_code, destination_code ];
       connection.query(query, data, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
               console.log("no results found");
               res.json({
                status: 2,
                message: "No data Found"
            })
            } else {
                console.log("results found");
                res.json({
                    status: 1,
                    data:rows
                })
            }
        })
    },


    postNewConsignment: (req,res) => {
        let region = req.body.region;
        let today = new Date();
        let status;

        console.log(req.body);

        console.log(region);
        var tracking_data1 = {
            "cn_no": req.body.cn_no,
            "status": "RECEIVED",
            "datetime": today
        }

        if( region === "SOUTH"){
            status = "assign to south"
        
            var tracking_data2 = {
                "cn_no": req.body.cn_no,
                "status": "TRANSIT JB",
                "datetime": today
            }
        }else if (region === "NORTH"){
            status = "assign to north";
            
            var tracking_data2 = {
                "cn_no": req.body.cn_no,
                "status": "TRANSIT PENANG",
                "datetime": today
            }
        }else {
            status = "created";
            var tracking_data2 = {
                "cn_no": req.body.cn_no,
                "status": "HQ",
                "datetime": today
            }
        }
        let quantity =  parseFloat(req.body.pkt_size) + parseFloat(req.body.carton_size) + parseFloat(req.body.pallet_size) + parseFloat(req.body.p_size)  + parseFloat(req.body.s_size) + parseFloat(req.body.m_size) + parseFloat(req.body.l_size) + parseFloat(req.body.xl_size) + parseFloat(req.body.m3_min_size) + parseFloat(req.body.m3_size) + parseFloat(req.body.weight_min_size) +   parseFloat(req.body.weight_size) + parseFloat(req.body.other_charges);

        console.log(quantity);

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
            "quantity":quantity,
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
            "status":status,
            "remarks":req.body.remarks,
            "invoice_no":'',
            "is_approved": 1
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

                //creating a log
                var log_data = {
                    "status": "user - " + req.params.id + "create new Consignment No. [" + req.body.cn_no + " ] to " + status
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

    checkConsignmentNote: (req,res) => {
        let cn_no = req.params.cn_no;
        let query = "SELECT * FROM consignment where cn_no = ?;"
       connection.query(query, cn_no, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                res.json({
                    status: 2,
                    data:rows
                })
            } else {
                res.json({
                    status: 1,
                    data:rows
                })
            }
            
        })
       
    },

    updateConsignment: (req,res) => {
        let today = new Date();
        let status, status_old, destination_old, quantity;
        let user_id = req.params.id;
        var consignment_data;

        //fetching the old record
        let query = "SELECT * FROM consignment where cn_no = ?;"
        connection.query(query, req.body.cn_no, (err,rows) => {
             if(err){
                 console.log(err);
             }  else {
                status_old = rows[0].status;
                destination_old = rows[0].destination_code;
                quantity =  req.body.carton_size + req.body.m3_size + req.body.p_size + req.body.s_size + req.body.m_size + req.body.b_size + req.body.xl_size + req.body.pkt_size + req.body.other_charges;

                //setting the data for update
                if(status_old === "Close"){
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
                        "quantity":quantity,
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
                        "status":"Close",
                        "remarks":req.body.remarks,
                    }
                }else{
                    if(req.body.destination_code === destination_old){
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
                            "quantity":quantity,
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
                            "status":status_old,
                            "remarks":req.body.remarks,
                            }
                    } else{
                        
                        //deleteing the entry in ofd
                        let ofd_query = "DELETE FROM out_for_delivery WHERE cn_no = ?;"
                        connection.query(ofd_query,req.body.cn_no , (err,rows) => {
                            if(err){
                                res.json({
                                    status:false,
                                    message: 'there are some errors with query'
                                })
                            } else {
                                res.json({
                                    status: 1,
                                    message: 'OFD records deleted Successfully'
                                })
                            }
                        })

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
                            "quantity":quantity,
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

                        //deleting records in tracking table
                        let trr_query = "DELETE FROM tracking WHERE cn_no = ?;"
                        connection.query(trr_query,req.body.cn_no , (err,rows) => {
                            if(err){
                                res.json({
                                    status:false,
                                    message: 'there are some errors with query'
                                })
                            } else {
                                res.json({
                                    status: 1,
                                    message: 'Tracking  Records deleted Successfully'
                                })
                            }
                        })
                    }
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
                            "status": "user - " + req.params.id + "updated the Consignment No. [" + req.body.cn_no + " ] " 
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


