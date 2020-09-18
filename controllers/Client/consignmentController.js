var connection = require('../../config');
var commonFunction = require('../commonFunction');
module.exports = {
    getclientpodcheck: async(req,res) => {
        console.log('excauting')
                let user_id=req.body.user_id
                let shipper_query = "SELECT * FROM shipping where user_id ='" + user_id + "'"
        let shipper_data=await commonFunction.getQueryResults(shipper_query);
        let shipper_code=''
        
        if (shipper_data.length > 0) {
            shipper_code=shipper_data[0].shipper_code!= undefined ?shipper_data[0].shipper_code:''
        }
        var limit = (req.body.limit != undefined && req.body.limit != '') ? parseInt(req.body.limit) : 25;
        var sortby=req.body.sortby;
        var order=req.body.order
                var page = (req.body.page != undefined && req.body.page != '') ? parseInt(req.body.page) : 1;
                    var skip = ((page - 1) * limit);
                   // var filter_id = req.body.filter_id;
                    var search=req.body.search;
        
                    var condition=''
                    var sortcondition='order by datetime desc'
        
                    if(sortby!=undefined && sortby!='' && order!=undefined && order!='')
                    {
                        sortcondition ="ORDER BY " + sortby + " " + order + "";
                    }
                    if(search!=undefined && search!='')
                    {
                        condition ="and (c.cn_no like '%"+search+"%' or c.shipper_code like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' )";
                    }
        
                    var totalnumber=0
                   
                    var totalnumberofrecords="select COUNT(*) AS totalcount from out_for_delivery  as c where c.status = 'Completed' and c.shipper_code='" + shipper_code + "'  "+condition+" order by c.datetime desc";
                    var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);
        
                    if (totalnumberdata.length > 0 ) {
                        
                        total=totalnumberdata[0]
                        console.log(total.totalcount);
                    totalnumber=total.totalcount!=undefined &&total.totalcount!='' ?total.totalcount:0
                    }
                    
                console.log(req.params.id);
                let cn_no = req.params.cn_no;
                let query = "select * from out_for_delivery where status = 'Completed' and shipper_code='" + shipper_code + "'  order by datetime desc limit " + skip + "," + limit + ""
              
                if(search!=undefined && search!='')
                {
                    query = "SELECT * FROM out_for_delivery where  status='Completed' and shipper_code='" + shipper_code + "'  and (cn_no like '%"+search+"%' or shipper_code like '%"+search+"%' or  receiver_name like '%"+search+"%' or  destination_code like '%"+search+"%' )  " + sortcondition + " ;"
                }
                connection.query(query,cn_no, (err,rows) => {
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
                            data:rows,
                            totalnumber
                        })
                    }
                    
                })
               
            },
            getclientPodBill: async(req,res) => {
        
                console.log(req.params.id);
                let user_id=req.body.user_id
                let shipper_query = "SELECT * FROM shipping where user_id ='" + user_id + "'"
        let shipper_data=await commonFunction.getQueryResults(shipper_query);
        let shipper_code=''
        
        if (shipper_data.length > 0) {
            shipper_code=shipper_data[0].shipper_code!= undefined ?shipper_data[0].shipper_code:''
        }
                let query = "SELECT * FROM consignment where is_billed = 0 and status = 'Close' and is_approved = 1 and shipper_code='" + shipper_code + "'"
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
            
    getConsignmentNorth: async(req,res) => { 

        let user_id=req.body.user_id
                let shipper_query = "SELECT * FROM shipping where user_id ='" + user_id + "'"
        let shipper_data=await commonFunction.getQueryResults(shipper_query);
        let shipper_code=''
        
        if (shipper_data.length > 0) {
            shipper_code=shipper_data[0].shipper_code!= undefined ?shipper_data[0].shipper_code:''
        }
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
                        condition ="and (c.cn_no like '%"+search+"%' or c.shipper_code like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' )";
                    }
        
                    var totalnumber=0
                    var totalnumberofrecords="select COUNT(*) AS totalcount from consignment c where ((region='NORTH' and status='created') or status='assign to north') and is_approved = 1 and shipper_code='" + shipper_code + "' "+condition+" ORDER BY cn_datetime desc;SELECT count(*) FROM users WHERE position='driver'";
                    var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);
        
                
                    total=totalnumberdata[0]
                    totalnumber=total[0].totalcount!=undefined?total[0].totalcount:0
               
                let query = "SELECT * FROM consignment where ((region='NORTH' and status='created') or status='assign to north')  and shipper_code='" + shipper_code + "'  and is_approved = 1  " + sortcondition + " limit " + skip + "," + limit + ";SELECT * FROM users WHERE position='driver';"
        
                if(search!=undefined && search!='')
                {
                    query = "SELECT * FROM consignment where ((region='NORTH' and status='created') or status='assign to north')  and shipper_code='" + shipper_code + "' and is_approved = 1 and (cn_no like '%"+search+"%' or shipper_code like '%"+search+"%' or  receiver_name like '%"+search+"%' or  destination_code like '%"+search+"%' )  " + sortcondition + " ;SELECT * FROM users WHERE position='driver';"
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
        
            getclientconsigmentroad: async(req,res) => {
                console.log(req.params.id);
                let user_id=req.body.user_id
                let shipper_query = "SELECT * FROM shipping where user_id ='" + user_id + "'"
        let shipper_data=await commonFunction.getQueryResults(shipper_query);
        let shipper_code=''
        
        if (shipper_data.length > 0) {
            shipper_code=shipper_data[0].shipper_code!= undefined ?shipper_data[0].shipper_code:''
        }
        
                let cn_no = req.params.cn_no;
                var limit = (req.body.limit != undefined && req.body.limit != '') ? parseInt(req.body.limit) : 25;
                var sortby=req.body.sortby;
                var order=req.body.order
                
                var page = (req.body.page != undefined && req.body.page != '') ? parseInt(req.body.page) : 1;
                    var skip = ((page - 1) * limit);
                   // var filter_id = req.body.filter_id;
                    var search=req.body.search;
        
        var condition='';
        var sortcondition='order by o.cn_no asc'
                    if(search!=undefined && search!='')
                    {
                        condition ="and c.cn_no='"+search+"'";
                    }
        
                    if(sortby!=undefined && sortby!='' && order!=undefined && order!='')
                    {
                        sortcondition ="ORDER BY " + sortby + " " + order + "";
                    }
        
                 var totalnumber=0
        var totalnumberofrecords="select COUNT(*) AS totalcount from out_for_delivery o, consignment c where o.status = 'In-progress' and  o.shipper_code='" + shipper_code + "' and o.cn_no = c.cn_no   "+condition+" order by c.cn_no asc;";
        var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);
        
        console.log(totalnumberofrecords)
        totalnumber=totalnumberdata[0].totalcount
        
                let query = "select o.*, c.quantity, c.expiry_date ,c.cn_datetime from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no and  o.shipper_code='" + shipper_code + "' group by c.cn_no " + sortcondition + "  limit " + skip + "," + limit + " "
               
                if(search!=undefined && search!='')
                {
                    query ="select o.*, c.quantity, c.expiry_date ,c.cn_datetime from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no  and o.shipper_code='" + shipper_code + "' and o.cn_no='"+search+"' " + sortcondition + "";
                }
               // let query = "select o.*, c.quantity, c.expiry_date ,c.cn_datetime from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no order by c.cn_no asc;"
               connection.query(query,cn_no, (err,rows) => {
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
                        
                            data:rows,
                            totalnumber,
                           // TotalPages: Math.ceil((totalnumberdata.length > 0 ? (totalnumberdata[0].totalcount) : 0) / limit)
                        })
                    }
                    
                })
               
            },
            getConsignmentSouth: async(req,res) => { 
        
                let user_id=req.body.user_id
                        let shipper_query = "SELECT * FROM shipping where user_id ='" + user_id + "'"
                let shipper_data=await commonFunction.getQueryResults(shipper_query);
                let shipper_code=''
                
                if (shipper_data.length > 0) {
                    shipper_code=shipper_data[0].shipper_code!= undefined ?shipper_data[0].shipper_code:''
                }
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
                                condition ="and (c.cn_no like '%"+search+"%' or c.shipper_code like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' )";
                            }
                
                            var totalnumber=0
                            var totalnumberofrecords="select COUNT(*) AS totalcount from consignment c where ((region='SOUTH' and status='created') or status='assign to south') and is_approved = 1 and shipper_code='" + shipper_code + "' "+condition+" ORDER BY cn_datetime desc;SELECT count(*) FROM users WHERE position='driver'";
                            var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);
                
                        
                            total=totalnumberdata[0]
                            totalnumber=total[0].totalcount!=undefined ?total[0].totalcount:0
          console.log(totalnumberdata);
                        let query = "SELECT * FROM consignment where ((region='SOUTH' and status='created') or status='assign to south')  and shipper_code='" + shipper_code + "'  and is_approved = 1  " + sortcondition + " limit " + skip + "," + limit + ";SELECT * FROM users WHERE position='driver';"
                
                        if(search!=undefined && search!='')
                        {
                            query = "SELECT * FROM consignment where ((region='NORTH' and status='created') or status='assign to south')  and shipper_code='" + shipper_code + "' and is_approved = 1 and (cn_no like '%"+search+"%' or shipper_code like '%"+search+"%' or  receiver_name like '%"+search+"%' or  destination_code like '%"+search+"%' )  " + sortcondition + " ;SELECT * FROM users WHERE position='driver';"
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
        
                    getConsignmenthq: async(req,res) => { 
        
                        let user_id=req.body.user_id
                                let shipper_query = "SELECT * FROM shipping where user_id ='" + user_id + "'"
                        let shipper_data=await commonFunction.getQueryResults(shipper_query);
                        let shipper_code=''
                        
                        if (shipper_data.length > 0) {
                            shipper_code=shipper_data[0].shipper_code!= undefined ?shipper_data[0].shipper_code:''
                        }
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
                                        condition ="and (c.cn_no like '%"+search+"%' or c.shipper_code like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' )";
                                    }
                        
                                    var totalnumber=0
                                    var totalnumberofrecords="select COUNT(*) AS totalcount from consignment c where ((region='HQ' and status='created') or status='assign to hq') and is_approved = 1 and shipper_code='" + shipper_code + "' "+condition+" ORDER BY cn_datetime desc;SELECT count(*) FROM users WHERE position='driver'";
                                    var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);
                        
                                
                                    total=totalnumberdata[0]
                                    totalnumber=total[0].totalcount!=undefined?total[0].totalcount:0
                               
                                let query = "SELECT * FROM consignment where ((region='HQ' and status='created') or status='assign to hq')  and shipper_code='" + shipper_code + "'  and is_approved = 1  " + sortcondition + " limit " + skip + "," + limit + ";SELECT * FROM users WHERE position='driver';"
                        
                                if(search!=undefined && search!='')
                                {
                                    query = "SELECT * FROM consignment where ((region='HQ' and status='created') or status='assign to hq')  and shipper_code='" + shipper_code + "' and is_approved = 1 and (cn_no like '%"+search+"%' or shipper_code like '%"+search+"%' or  receiver_name like '%"+search+"%' or  destination_code like '%"+search+"%' )  " + sortcondition + " ;SELECT * FROM users WHERE position='driver';"
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
    
    getAllConsignments: (req,res) => { 
        console.log(req.params.id);
        let shipper_query = "SELECT * FROM shipping where user_id = ?;"
        let query = "SELECT * FROM consignment where is_approved != 1 and shipper_code = ?;"

        connection.query(shipper_query, req.params.id, (err,results) => {
            if(err){
                console.log(err);
               
            } else {
                 if(results.length>0)
                 {
                let shippingcode=results[0].shipper_code!= undefined ?results[0].shipper_code:''
              
                connection.query(query, shippingcode, (err,rows) => {
                    if(err){
                        console.log(err);
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
            }
        }
        })
    },

    getAllApprovedConsignments: (req,res) => { 
        let shipper_query = "SELECT * FROM shipping where user_id = ?;"
        let query = "SELECT * FROM consignment where is_approved = 1 and shipper_code = ?;"

        connection.query(shipper_query, req.params.id, (err,results) => {
            if(err){
                console.log(err);
               
            } else {
                connection.query(query, results[0].shipper_code, (err,rows) => {
                    if(err){
                        console.log(err);
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
                        // this.uploadconsignments();
                        res.json({
                            status: true,
                            data:rows
                        })
                    }
                    
                })
            }
            
        })
    }
}


