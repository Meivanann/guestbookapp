var connection = require('../../../config');
const commonFunction = require('../../commonFunction');

module.exports = {
    index: (req,res) => {
        console.log(req.params.id);
        let query = "SELECT * FROM consignment WHERE ((region = 'HQ' AND status='created') or status ='assign to hq') and is_approved = 1 ORDER BY cn_datetime desc limit 4;SELECT * FROM consignment where ((region='SOUTH' and status='created') or status='assign to south') and is_approved = 1 ORDER BY cn_datetime DESC limit 4; SELECT * FROM consignment where ((region='NORTH' and status='created') or status='assign to north') and is_approved = 1 ORDER BY cn_datetime DESC limit 4;SELECT * FROM out_for_delivery where  status='Completed'	 order by datetime desc limit 4; SELECT * FROM consignment where is_billed = 0 and status = 'Close'	 and is_approved = 1 order by cn_datetime desc limit 4;select o.*, c.quantity from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no order by datetime desc limit 20;SELECT * FROM consignment where  (status='created' or status='assign to south' or status='assign to north') and date(cn_datetime) > DATE(NOW() - INTERVAL 3 DAY) and is_approved = 1 order by cn_datetime desc limit 3; select * from consignment where is_approved = 0 order by cn_datetime desc limit 3;"
       connection.query(query, (err,rows) => {
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

    getPodBill: (req,res) => {
        console.log(req.params.id);
        let query = "SELECT * FROM consignment where is_billed = 0 and status = 'Close' and is_approved = 1;"
       connection.query(query, (err,rows) => {
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

    getAllConsignmentsForApproval: async(req,res) => {
        console.log(req.params.id);
            let reciverObject={}
            let cityObject={};
            let stateObject={};
        let reciverquery="SELECT * FROM  shipping as r  ";

        let reciverdata=await commonFunction.getQueryResults(reciverquery);

        reciverdata.forEach(element => {
            //combinedObject[element.shipper_code]
            reciverObject[element.shipper_code]=element.address1
            cityObject[element.shipper_code]=element.city
            stateObject[element.shipper_code]=element.state + "-" +element.postcode
        });
        
        let query = "SELECT * FROM consignment as c  where is_approved = 0 order by cn_datetime"
       connection.query(query, (err,rows) => {
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
                rows.forEach(element => {
                    
    
                    element.receiver_address=reciverObject[element.receiver_code]? reciverObject[element.receiver_code]: ''
                    element.receiver_city=cityObject[element.receiver_code]? cityObject[element.receiver_code]: ''
                    element.receiver_state=stateObject[element.receiver_code]? stateObject[element.receiver_code]: ''
                });
           
                res.json({
                    status: 1,
                    data:rows
                })
            }
            
        })
       
    },
    //sep4 backup
    // getAllConsignmentsForApproval: async(req,res) => {
    //     console.log(req.params.id);
    //         let reciverObject={}
    //     let reciverquery="SELECT * FROM  shipping as r  ";

    //     let reciverdata=await commonFunction.getQueryResults(reciverquery);

    //     reciverdata.forEach(element => {
    //         reciverObject[element.shipper_code]=element.address1
    //     });
        
    //     let query = "SELECT * FROM consignment as c  where is_approved = 0 order by cn_datetime"
    //    connection.query(query, (err,rows) => {
    //         if(err){
    //             console.log(err);
    //         } else if (rows.length == 0 ){
    //            console.log("no results found");

           
    //            res.json({
    //                 status: 2,
    //                 message:"No results found"
    //             });
    //         } else {
    //             console.log("results found");
    //             rows.forEach(element => {
                    
    
    //                 element.receiver_address=reciverObject[element.receiver_code]? reciverObject[element.receiver_code]: ''
    //             });
           
    //             res.json({
    //                 status: 1,
    //                 data:rows
    //             })
    //         }
            
    //     })
       
    // },

    postConsignmentApproval : (req,res) => {
        let cn_no = req.body.cn_no;
        let query = 'select * from consignment where cn_no = ?'
        let today = new Date();
        let status;

        connection.query(query, cn_no, (err, rows) => {
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


                var tracking_data1 = {
                    "cn_no": req.body.cn_no,
                    "status": "RECEIVED",
                    "datetime": today
                }
                if( rows[0].region === "SOUTH"){
                    status = "assign to south"
                
                    var tracking_data2 = {
                        "cn_no": req.body.cn_no,
                        "status": "TRANSIT JB",
                        "datetime": today
                    }
                }else if (rows[0].region === "NORTH"){
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

                // updating the consignment
                let update_query = "UPDATE consignment SET ? where cn_no = ?"

                var update_consignment_data = {
                    "is_approved" : 1,
                    "status"      : status
                }
                let data1 = [update_consignment_data ,cn_no ]
                connection.query(update_query,data1, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }else{
                        console.log("consignment updated sucessfully")
                    }
                });

                // insertig the tracking data
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
                    "user_id" : req.params.id,
                    "cn_no"   : req.body.cn_no,
                    "status": " has  approved Consignment No. [" + req.body.cn_no + " ]"
                }
                connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                    if (lgerr) {
                    console.log(lgerr)
                    }else{
                        console.log("log added successfully");
                    }
                });

                console.log("Consignment Approved  succesfully")
                res.json({
                  status:true,
                  message:'Consignment Approved  sucessfully'
              })
            }
        });

    }
}


