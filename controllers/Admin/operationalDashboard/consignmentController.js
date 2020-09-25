var connection = require('./../../../config');
var _ = require('lodash');
var moment=require('moment');
var commonFunction=require('../../commonFunction');   
module.exports = {
    trackingcronjob:async (req,res) => { 
        console.log('sonofgod')
        let today=moment().format('YYYY-MM-DD HH:mm:ss')
        let cnoids=[]
        let assignids=[]
        var tracking_data;
        let query = "SELECT * FROM consignment WHERE ((region = 'HQ' AND status='created') or status ='assign to hq') and isReceived=1 and is_approved=1"
        let assignedquery = "SELECT * FROM consignment WHERE (status ='assign to north' or status ='assign to south') and isAssigned=1 and is_approved=1"
        let assigneddata=await commonFunction.getQueryResults(assignedquery)
       console.log(assignedquery)
      
       
      
      
        connection.query(query, async(err,rows) => {
            if(err){
                 console.log(err);
            } else if (rows.length == 0 ){
                  console.log('NO DATA FOUND')
            } else {
                rows.forEach(element => {
                    cnoids.push(element.cn_no)
                });
               
                let cnos=cnoids.join('","')
                console.log('date',cnos)

                let selectedquery = "SELECT * FROM consignment WHERE cn_no in('"+cnoids.join("','")+"')"
           let data=await commonFunction.getQueryResults(selectedquery)

          
           if (data.length > 0) {
            data.forEach(element => {

                var timeminute=moment(moment().format('YYYY-MM-DD HH:mm:ss')).diff(new Date(element.cn_datetime), 'minutes')
                console.log('timelog',timeminute)
                if (timeminute > 5) {
                    var tracking_data2 = {
                        "cn_no": element.cn_no,
                        "status":'ARRANGING_FOR_DELIVERY',
                        "datetime": today,
                        isold:1
                    }
                    connection.query('INSERT INTO tracking SET ?', tracking_data2, (err,rows) => {
                        if(err){
                            console.log(err);
                        } else {
                            console.log(rows)
                             if (rows.insertId>0) {

                                let updatedquery = "update  consignment set isReceived=0 where  cn_no ='"+element.cn_no+"'"

                                connection.query(updatedquery, (err,datas) => {
                                    if(err){
                                        console.log(err);
                                    } else {
                                    }
                                })
                             }
                        }
                    })
                    
                }
            });
          

               
           }
        

            }
            
        })


        console.log('sons',moment().format('YYYY-MM-DD HH:mm:ss'))
console.log('length',assigneddata.length)
        if (assigneddata.length > 0 ) {
            assigneddata.forEach(element => {
                assignids.push(element.cn_no)
            });
            let assignidss=assignids.join('","')
            console.log('sona',assignidss,assignids)
            let assignedupdatequery = "SELECT * FROM consignment WHERE cn_no in('"+assignids.join("','")+"')"
            let assignupdatedata=await commonFunction.getQueryResults(assignedupdatequery)
           console.log('assignedquery',assignedupdatequery)
           
            if (assignupdatedata.length > 0) {

                assignupdatedata.forEach(element => {
                
                    var timeminute=moment(moment().format('YYYY-MM-DD HH:mm:ss')).diff(new Date(element.assignedtime), 'hours')
                    console.log('timeline',timeminute,element.assignedtime)
                    if (timeminute > 8 && timeminute < 10) {
        
                        if (element.status=='assign to north') {
                             tracking_data = {
                                "cn_no": element.cn_no,
                                "status":'AUTO_UPDATE_TRANSIT_PENANG',
                                "datetime": today,
                                isold:1
                            } 
                        }
                        if (element.status=='assign to south') {
                            console.log('south')
                            tracking_data = {
                                "cn_no": element.cn_no,
                                "status":'AUTO_UPDATE_TRANSIT_JB',
                                "datetime": today,
                                isold:1
                            }  
                        }
                        // var tracking_data2 = {
                        //     "cn_no": element.cn_no,
                        //     "status": '',
                        //     "datetime": today
                        // }
                        connection.query('INSERT INTO tracking SET ?', tracking_data, (err,rows) => {
                            if(err){
                                console.log(err);
                            } else {
                                 if (rows.insertId > 0) {
        console.log('ssss') 
                                    let updatedquery = "update   consignment set isAssigned=0 where  cn_no ='"+element.cn_no+"' and ( status='assign to north' or status='assign to south')"
        
                                    connection.query(updatedquery, (err,datas) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                        }
                                    })
                                 }
                            }
                        })
                        
                    }
                    if (timeminute > 10) {
                        var tracking_data2 = {
                            "cn_no": element.cn_no,
                            "status": 'ARRANGING_FOR_DELIVERY',
                            "datetime": today,
                            isold:1
                            
                        }
                        connection.query('INSERT INTO tracking SET ?', tracking_data2, (err,rows) => {
                            if(err){
                                console.log(err);
                            } else {
                                 if (rows.insertId > 0) {
        
                                    let updatedquery = "update   consignment set isAssigned=0 where  cn_no ='"+element.cn_no+"'"
        
                                    connection.query(updatedquery, (err,datas) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                        }
                                    })
                                 }
                            }
                        })
                        
                    }
                });
              
        
                   
               }

           }

     },

    getConsignmentHq: (req,res) => { 
        let query = "SELECT * FROM consignment WHERE ((region = 'HQ' AND status='created') or status ='assign to hq') and is_approved = 1 ORDER BY cn_datetime desc; SELECT * FROM users WHERE position='driver';"

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
    pagnitiongetConsignmentHq: async(req,res) => { 

        var limit = (req.body.limit != undefined && req.body.limit != '') ? parseInt(req.body.limit) : 25;
var sortby=req.body.sortby;
var order=req.body.order
        var page = (req.body.page != undefined && req.body.page != '') ? parseInt(req.body.page) : 1;
            var skip = ((page - 1) * limit);
           // var filter_id = req.body.filter_id;
            var search=req.body.search;

            var condition=''
            var sortcondition='order by cn_datetime desc'

            if(sortby!=undefined && sortby!='' && order!=undefined && order!='')
            {
                sortcondition ="ORDER BY " + sortby + " " + order + "";
            }
            if(search!=undefined && search!='')
            {
                condition ="and (c.cn_no like '%"+search+"%' or c.shipper_name like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' )";
            }

            var totalnumber=0
            var totalnumberofrecords="select COUNT(*) AS totalcount from consignment c where ((region='HQ' and status='created') or status='assign to hq') and is_approved = 1 "+condition+" ORDER BY cn_datetime desc;SELECT count(*) FROM users WHERE position='driver'";
            var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);

        console.log('ssss')
            total=totalnumberdata[0]
            totalnumber=total[0].totalcount
       
        let query = "SELECT * FROM consignment WHERE ((region = 'HQ' AND status='created') or status ='assign to hq') and is_approved = 1  " + sortcondition + " limit " + skip + "," + limit + "; SELECT * FROM users WHERE position='driver';"

        if(search!=undefined && search!='')
        {
            query = "SELECT * FROM consignment WHERE ((region = 'HQ' AND status='created') or status ='assign to hq') and is_approved = 1  and (cn_no like '%"+search+"%' or shipper_name like '%"+search+"%' or  receiver_name like '%"+search+"%' or  destination_code like '%"+search+"%' ) " + sortcondition + " ; SELECT * FROM users WHERE position='driver';"
        }
    
console.log('hqquery',query)
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
                    data:rows,
                    totalnumber
                })
            }
            
        })
    },

    getConsignmentSouth: async(req,res) => { 
        var limit = (req.body.limit != undefined && req.body.limit != '') ? parseInt(req.body.limit) : 25;
        var sortby=req.body.sortby;
        var order=req.body.order
                var page = (req.body.page != undefined && req.body.page != '') ? parseInt(req.body.page) : 1;
                    var skip = ((page - 1) * limit);
                   // var filter_id = req.body.filter_id;
                    var search=req.body.search;
        
                    var condition=''
                    var sortcondition='order by cn_datetime desc'
        
                    if(sortby!=undefined && sortby!='' && order!=undefined && order!='')
                    {
                        sortcondition ="ORDER BY " + sortby + " " + order + "";
                    }
                    if(search!=undefined && search!='')
                    {
                        condition ="and (c.cn_no like '%"+search+"%' or c.shipper_name like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' )";
                    }
        
                    var totalnumber=0
                    var totalnumberofrecords="select COUNT(*) AS totalcount from consignment c where ((region='SOUTH' and status='created') or status='assign to south') and is_approved = 1 "+condition+" ;SELECT count(*) FROM users WHERE position='driver'";
                    var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);
        
                
                    total=totalnumberdata[0]
                    totalnumber=total[0].totalcount


        let query = "SELECT * FROM consignment where ((region='SOUTH' and status='created') or status='assign to south') and is_approved = 1  " + sortcondition + " limit " + skip + "," + limit + "; SELECT * FROM users WHERE position='driver';"

        if(search!=undefined && search!='')
        {
            query = "SELECT * FROM consignment where ((region='SOUTH' and status='created') or status='assign to south') and is_approved = 1 and (cn_no like '%"+search+"%' or shipper_name like '%"+search+"%' or  receiver_name like '%"+search+"%' or  destination_code like '%"+search+"%' ) " + sortcondition + ";SELECT * FROM users WHERE position='driver';"
        }

        connection.query(query, (err,rows) => {
            if(err){
                console.log(err)
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
                    data:rows,
                    totalnumber
                })
            }
            
        })
    },



//sep14 backup
    // getConsignmentHq: (req,res) => { 
    //     let query = "SELECT * FROM consignment WHERE ((region = 'HQ' AND status='created') or status ='assign to hq') and is_approved = 1 ORDER BY cn_datetime desc; SELECT * FROM users WHERE position='driver';"

    //     connection.query(query, (err,rows) => {
    //         if(err){
    //             res.json({
    //                 status:false,
    //                 message:'there are some error with query'
    //                 })
    //         } else if (rows.length == 0 ){
    //             res.json({
    //                 status:false,
    //                 message:"No results found"
    //                });
    //         } else {
    //             res.json({
    //                 status: 1,
    //                 data:rows
    //             })
    //         }
            
    //     })
    // },
    getConsignmentNorth: async(req,res) => { 

        var limit = (req.body.limit != undefined && req.body.limit != '') ? parseInt(req.body.limit) : 25;
var sortby=req.body.sortby;
var order=req.body.order
        var page = (req.body.page != undefined && req.body.page != '') ? parseInt(req.body.page) : 1;
            var skip = ((page - 1) * limit);
           // var filter_id = req.body.filter_id;
            var search=req.body.search;

            var condition=''
            var sortcondition='order by cn_datetime desc'

            if(sortby!=undefined && sortby!='' && order!=undefined && order!='')
            {
                sortcondition ="ORDER BY " + sortby + " " + order + "";
            }
            if(search!=undefined && search!='')
            {
                condition ="and (c.cn_no like '%"+search+"%' or c.shipper_name like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' )";
            }

            var totalnumber=0
            var totalnumberofrecords="select COUNT(*) AS totalcount from consignment c where ((region='NORTH' and status='created') or status='assign to north') and is_approved = 1 "+condition+" ORDER BY cn_datetime desc;SELECT count(*) FROM users WHERE position='driver'";
            var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);

        
            total=totalnumberdata[0]
            totalnumber=total[0].totalcount
       
        let query = "SELECT * FROM consignment where ((region='NORTH' and status='created') or status='assign to north') and is_approved = 1  " + sortcondition + " limit " + skip + "," + limit + ";SELECT * FROM users WHERE position='driver';"

        if(search!=undefined && search!='')
        {
            query = "SELECT * FROM consignment where ((region='NORTH' and status='created') or status='assign to north') and is_approved = 1 and (cn_no like '%"+search+"%' or shipper_code like '%"+search+"%' or  receiver_name like '%"+search+"%' or  destination_code like '%"+search+"%' ) " + sortcondition + " ;SELECT * FROM users WHERE position='driver';"
        }
        console.log('ss',query)

        connection.query(query, (err,rows) => {
            if(err){
                console.log(err)
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
                

// var sortorder = _.orderBy(rows[0], [sortby],[order]);


                res.json({
                    status: 1,
                    data:rows,
                    totalnumber
                })
            }
            
        })
    },


    //sep5backup
    // getConsignmentNorth: (req,res) => { 
    //     let query = "SELECT * FROM consignment where ((region='NORTH' and status='created') or status='assign to north') and is_approved = 1 ORDER BY cn_datetime desc; SELECT * FROM users WHERE position='driver';"

    //     connection.query(query, (err,rows) => {
    //         if(err){
    //             res.json({
    //                 status:false,
    //                 message:'there are some error with query'
    //                 })
    //         } else if (rows.length == 0 ){
    //             res.json({
    //                 status:false,
    //                 message:"No results found"
    //                });
    //         } else {
    //             res.json({
    //                 status: 1,
    //                 data:rows
    //             })
    //         }
            
    //     })
    // },


    //sep14 backup

    // getConsignmentSouth: (req,res) => { 
    //     let query = "SELECT * FROM consignment where ((region='SOUTH' and status='created') or status='assign to south') and is_approved = 1 ORDER BY cn_datetime desc; SELECT * FROM users WHERE position='driver';"

    //     connection.query(query, (err,rows) => {
    //         if(err){
    //             console.log(query)
    //             res.json({
    //                 status:false,
    //                 message:'there are some error with query'
    //                 })
    //         } else if (rows.length == 0 ){
    //             res.json({
    //                 status:false,
    //                 message:"No results found"
    //                });
    //         } else {
    //             res.json({
    //                 status: 1,
    //                 data:rows
    //             })
    //         }
            
    //     })
    // },

    postConsignmentHq: (req, res) => {
        let today=moment().format('YYYY-MM-DD')
        let consignmentIds = req.body.arr;
        let driverName = req.body.driver;
        var assigneddatetime=''
        var isAssigned=0
        let todaytime=moment().format('YYYY-MM-DD HH:mm:ss')
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
                    var checkingQuery="select  * FROM out_for_delivery WHERE cn_no ='"+ row.cn_no +"'"
                   

                    connection.query(checkingQuery, function(err,data){

                        if (err) {
                            console.log(err)
                        }
                        else
                        {
                            console.log(data)
                            if (data.length==0) {
                                console.log('ssss')
                                let regionQuery = "SELECT * FROM region WHERE destination_code = ? ;"
                                connection.query(regionQuery,[row.destination_code], (regerr, regrows) => {
                                    if(err){
                                        console.log(regerr);
                                    }else { 
                                    
                                        if(regrows.length > 0)
                                        { 
                                            console.log('ssskk')
                                        //updating the consignments
                                        let status, tracking_status;
                                        let ts = Date.now();
                                        let date_ob = new Date(ts);
            
                                         
                                        let updateConsignmentQuery = "update consignment set driver_name = ?,assignedtime=?,  status = ?, expiry_date = ?,isAssigned= ? where id = ?";
                                        if(regrows[0].region === "SOUTH"  && row.region != "SOUTH"){
                                            status = "assign to south";
                                            tracking_status = "TRANSIT JB"
                                            assigneddatetime=todaytime
                                            isAssigned=1
                                        }else if (regrows[0].region === "NORTH" && row.region != "NORTH"){
                                            status = "assign to north";
                                            tracking_status = "TRANSIT PENANG"
                                            assigneddatetime=todaytime
                                            isAssigned=1
                                        }else {
                                            status = "out for delivery"
                                            tracking_status = "ARRANGING"
                                            assigneddatetime=''
                                            //out for delivery
                                            var ofd_data={
                                                'cn_no' : row.cn_no,
                                                'shipper_code': row.shipper_code,
                                                'destination_code': row.destination_code,
                                                'driver_name': driverName,
                                                'receiver_name': row.receiver_name,
                                                assigned_date:today
                                            }
            
                                            connection.query('INSERT INTO out_for_delivery SET ?',ofd_data, function (ofderr, ofdres, fields) {
                                                if (ofderr) {
                                                  console.log(ofderr)
                                                }else{
                                                    console.log(ofdres)
                                                    console.log("out for delivery data added suceessfully");
                                                }
                                            });
            
                                        }
                                        
                                        let consignment_data = [driverName,assigneddatetime, status, req.body.expiry_date,isAssigned ,row.id ];
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
                                            isold:1
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
                                }
                                })
                            }
                        }
                    });
                    
                    //region fetch based upon destination code
                    
                  });
            }
        })

        res.json({
            status:true,
            message:"Successfully updated the records"
            });
    },

    postConsignmentNorth: (req, res) => {
        let today=moment().format('YYYY-MM-DD')
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
                        
                    var checkingQuery="select  * FROM out_for_delivery WHERE cn_no ='"+ row.id +"'"
                   

                    connection.query(checkingQuery, function(err,data){

                        if (err) {
                            console.log(err)
                        }
                        else
                        {
                            console.log(data)
                            if (data.length == 0)
                            {
                                console.log('ss')
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
                                    assigned_date:today
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
                                isold:1
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
 }
})
                    //updating the consignments
                   
                });
            }
        })

        res.json({
            status:true,
            message:"Successfully updated the records"
            });
    },

    postConsignmentSouth: (req, res) => {
        let today=moment().format('YYYY-MM-DD')
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



                    var checkingQuery="select  * FROM out_for_delivery WHERE cn_no IN ("+ row.id +")"
                        
                    //updating the consignments

                    connection.query(checkingQuery, function(err,data){

                        if (err) {
                            console.log(err)
                        }
                        else
                        {

                            console.log('query',checkingQuery)
                            if (data.length==0) {
                                console.log(data)
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
                                        assigned_date:today
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
                                    isold:1
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

    //sep6backup
    // postConsignmentHq: (req, res) => {
    //     let consignmentIds = req.body.arr;
    //     let driverName = req.body.driver;
    //     let consignmentQuery = "SELECT * FROM consignment WHERE id IN ("+ consignmentIds +");"
    //     let consignments;
    //     //fetch all the consignment request

    //     console.log(req.body);
    //     connection.query(consignmentQuery, (err, rows) => {
    //         if(err){
    //             res.json({
    //                 status:false,
    //                 message:'there are some error with query'
    //                 })
    //         } else if (rows.length == 0 ){
    //             res.json({
    //                 status:false,
    //                 message:"No results found"
    //                });
    //         } else {

    //             console.log(rows);
    //             //loop in consignments
    //             Object.keys(rows).forEach(function(key) {
    //                 var row = rows[key];

    //                 console.log(row);
    //                 //region fetch based upon destination code
    //                 let regionQuery = "SELECT * FROM region WHERE destination_code = ? ;"
    //                 connection.query(regionQuery,[row.destination_code], (regerr, regrows) => {
    //                     if(err){
    //                         console.log(regerr);
    //                     }else { 
                        
    //                         if(regrows.length > 0)
    //                         { 
    //                         //updating the consignments
    //                         let status, tracking_status;
    //                         let ts = Date.now();
    //                         let date_ob = new Date(ts);

    //                         console.log(regrows);
    //                         let updateConsignmentQuery = "update consignment set driver_name = ?,  status = ?, expiry_date = ?  where id = ?";
    //                         if(regrows[0].region === "SOUTH"  && row.region != "SOUTH"){
    //                             status = "assign to south";
    //                             tracking_status = "TRANSIT JB"
    //                         }else if (regrows[0].region === "NORTH" && row.region != "NORTH"){
    //                             status = "assign to north";
    //                             tracking_status = "TRANSIT PENANG"
    //                         }else {
    //                             status = "out for delivery"
    //                             tracking_status = "ARRANGING"

    //                             //out for delivery
    //                             var ofd_data={
    //                                 'cn_no' : row.cn_no,
    //                                 'shipper_code': row.shipper_code,
    //                                 'destination_code': row.destination_code,
    //                                 'driver_name': driverName,
    //                                 'receiver_name': row.receiver_name,
    //                             }

    //                             connection.query('INSERT INTO out_for_delivery SET ?',ofd_data, function (ofderr, ofdres, fields) {
    //                                 if (ofderr) {
    //                                   console.log(ofderr)
    //                                 }else{
    //                                     console.log("out for delivery data added suceessfully");
    //                                 }
    //                             });

    //                         }
                            
    //                         let consignment_data = [driverName, status, req.body.expiry_date ,row.id ];
    //                         // console.log( "region : " + regrows[0].region);
    //                         console.log( "status : " + status);
    //                         console.log( "cn_no : " + row.cn_no);
    //                         connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
    //                             if(err){
    //                                 console.log(err)
    //                             } else {
    //                                 console.log("updated sucessfully");
    //                             }
    //                         })

    //                         //creating a record in tracking
    //                         var tracking_data={
    //                             "cn_no":row.cn_no,
    //                             "status":tracking_status,
    //                             "datetime":date_ob,
    //                         }
    //                         connection.query('INSERT INTO tracking SET ?',tracking_data, function (trerr, trres, fields) {
    //                             if (trerr) {
    //                               console.log(trerr)
    //                             }else{
    //                                 console.log("tracking data added suceessfully");
    //                             }
    //                         });

    //                         //creating a log
    //                         var log_data = {
    //                             "user_id"   : req.params.id,
    //                             "cn_no"     : row.cn_no,
    //                            "status": " has moved the  consignment no [" + row.cn_no + " ] to " + status
    //                         }
    //                         connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
    //                             if (lgerr) {
    //                               console.log(lgerr)
    //                             }else{
    //                                 console.log("log added successfully");
    //                             }
    //                         });
    //                     }
    //                 }
    //                 })
    //               });
    //         }
    //     })

    //     res.json({
    //         status:true,
    //         message:"Successfully updated the records"
    //         });
    // },

    // postConsignmentNorth: (req, res) => {
    //     let consignmentIds = req.body.arr;
    //     let driverName = req.body.driver;
    //     let consignmentQuery = "SELECT * FROM consignment WHERE id IN ("+ consignmentIds +");"
    //     let consignments;
    //     //fetch all the consignment request
    //     connection.query(consignmentQuery, (err, rows) => {
    //         if(err){
    //             res.json({
    //                 status:false,
    //                 message:'there are some error with query'
    //                 })
    //         } else if (rows.length == 0 ){
    //             res.json({
    //                 status:false,
    //                 message:"No results found"
    //                });
    //         } else {

    //             //loop in consignments
    //             Object.keys(rows).forEach(function(key) {
    //                 var row = rows[key];
                        
    //                 //updating the consignments
    //                 let ts = Date.now();
    //                 let date_ob = new Date(ts);
    //                 let status, out_for_deleivery_status;
    //                 let updateConsignmentQuery = "update consignment set driver_name = ?, status = ?, expiry_date = ?  where id = ?";
                    
    //                 if(row.status === 'created'){
    //                     status = "assign to hq";
    //                     out_for_deleivery_status = "HQ";
    //                     let consignment_data = [driverName, status, req.body.expiry_date, row.id ];
    //                     connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
    //                         if(err){
    //                             console.log(err)
    //                         } else {
    //                             console.log("updated sucessfully");
    //                         }
    //                     })
    //                 } else{
    //                     status = "out for delivery";
    //                     out_for_deleivery_status = "ARRANGING";
    //                     let consignment_data = [driverName, status, req.body.expiry_date, row.id ];
    //                     connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
    //                         if(err){
    //                             console.log(err)
    //                         } else {
    //                             console.log("updated sucessfully");
    //                         }
    //                     })

    //                      //out for delivery
    //                     var ofd_data={
    //                         'cn_no' : row.cn_no,
    //                         'shipper_code': row.shipper_code,
    //                         'destination_code': row.destination_code,
    //                         'driver_name': driverName,
    //                         'receiver_name': row.receiver_name,
    //                     }

    //                     connection.query('INSERT INTO out_for_delivery SET ?',ofd_data, function (ofderr, ofdres, fields) {
    //                         if (ofderr) {
    //                             console.log(ofderr)
    //                         }else{
    //                             console.log("out for delivery data added suceessfully");
    //                         }
    //                     });
    //                 }
     
    //                 //creating a record in tracking
    //                 var tracking_data={
    //                     "cn_no":row.cn_no,
    //                     "status":out_for_deleivery_status,
    //                     "datetime":date_ob,
    //                 }
    //                 connection.query('INSERT INTO tracking SET ?',tracking_data, function (trerr, trres, fields) {
    //                     if (trerr) {
    //                         console.log(trerr)
    //                     }else{
    //                         console.log("tracking data added suceessfully");
    //                     }
    //                 });

    //                 //creating a log
    //                 var log_data = {
    //                     "user_id"   : req.params.id,
    //                     "cn_no"     : row.cn_no,
    //                     "status": " has moved the  consignment no [" + row.cn_no + " ] to " + status
    //                 }
    //                 connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
    //                     if (lgerr) {
    //                         console.log(lgerr)
    //                     }else{
    //                         console.log("log added successfully");
    //                     }
    //                 });
    //             });
    //         }
    //     })

    //     res.json({
    //         status:true,
    //         message:"Successfully updated the records"
    //         });
    // },

    // postConsignmentSouth: (req, res) => {
    //     let consignmentIds = req.body.arr;
    //     let driverName = req.body.driver;
    //     let consignmentQuery = "SELECT * FROM consignment WHERE id IN ("+ consignmentIds +");"

    //     //fetch all the consignment request
    //     connection.query(consignmentQuery, (err, rows) => {
    //         if(err){
    //             res.json({
    //                 status:false,
    //                 message:'there are some error with query'
    //                 })
    //         } else if (rows.length == 0 ){
    //             res.json({
    //                 status:false,
    //                 message:"No results found"
    //                });
    //         } else {

    //             //loop in consignments
    //             Object.keys(rows).forEach(function(key) {
    //                 var row = rows[key];
                        
    //                 //updating the consignments
    //                 let ts = Date.now();
    //                 let date_ob = new Date(ts);
    //                 let status, out_for_deleivery_status;
    //                 let updateConsignmentQuery = "update consignment set driver_name = ?, status = ?, expiry_date = ?  where id = ?";
                
 
    //                 if(row.status === 'created'){
    //                     status = "assign to hq";
    //                     out_for_deleivery_status = "HQ";
    //                     let consignment_data = [driverName, status, req.body.expiry_date, row.id ];

    //                     connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
    //                         if(err){
    //                             console.log(err)
    //                         } else {
    //                             console.log("updated sucessfully");
    //                         }
    //                     })
    //                 } else{
    //                     status = "out for delivery";
    //                     out_for_deleivery_status = "ARRANGING";
    //                     let consignment_data = [driverName, status, req.body.expiry_date, row.id ];

    //                     connection.query(updateConsignmentQuery, consignment_data, (err,rows) => {
    //                         if(err){
    //                             console.log(err)
    //                         } else {
    //                             console.log("updated sucessfully");
    //                         }
    //                     })

                        
    //                     //out for delivery
    //                     var ofd_data={
    //                         'cn_no' : row.cn_no,
    //                         'shipper_code': row.shipper_code,
    //                         'destination_code': row.destination_code,
    //                         'driver_name': driverName,
    //                         'receiver_name': row.receiver_name,
    //                     }

    //                     connection.query('INSERT INTO out_for_delivery SET ?',ofd_data, function (ofderr, ofdres, fields) {
    //                         if (ofderr) {
    //                             console.log(ofderr)
    //                         }else{
    //                             console.log("out for delivery data added suceessfully");
    //                         }
    //                     });
    //                 }
                   
                            
    //                 //creating a record in tracking
    //                 var tracking_data={
    //                     "cn_no":row.cn_no,
    //                     "status":out_for_deleivery_status,
    //                     "datetime":date_ob,
    //                 }
    //                 connection.query('INSERT INTO tracking SET ?',tracking_data, function (trerr, trres, fields) {
    //                     if (trerr) {
    //                         console.log(trerr)
    //                     }else{
    //                         console.log("tracking data added suceessfully");
    //                     }
    //                 });

    //                 //creating a log
    //                 var log_data = {
    //                     "user_id"   : req.params.id,
    //                     "cn_no"     : row.cn_no,
    //                     "status": " has moved the  consignment no [" + row.cn_no + " ] to " + status
    //                 }
    //                 connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
    //                     if (lgerr) {
    //                         console.log(lgerr)
    //                     }else{
    //                         console.log("log added successfully");
    //                     }
    //                 });
    //             });
    //         }
    //     })

    //     res.json({
    //         status:true,
    //         message:"Successfully updated the records"
    //         });
    // },

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

    onlineDeleteConsignment: (req,res) => { 
        let cn_no = req.body.cn_no;
        let login_id=req.body.login_id

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
                    "user_id" : req.body.login_id,
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
        var assigneddatetime='';
        var isAssigned=0;
       let  todaytime=moment().format("YYYY-MM-DD HH:mm:ss")
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
                            assigneddatetime=todaytime
                            isAssigned=1
                        }else if (regrows[0].region === "NORTH"  && rowss[0].region != "NORTH"){
                            status = "assign to north";
                            assigneddatetime=todaytime
                            isAssigned=1
                        }else {
                            status = "assign to hq";
                        }
             
                            let updateConsignmentQuery = "update consignment set status = ?,isAssigned = ?,assignedtime = ?   where cn_no = ?";
                            let consignment_data = [ status,isAssigned,assigneddatetime, rowss[0].cn_no ];
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