var connection = require('../../../config');

const fs = require('fs');
const AWS = require('aws-sdk');
const moment = require('moment');
const PDFDocument = require('pdfkit');
var commonFunction=require('../../commonFunction');   
const BUCKET_NAME = 'poddocs';
const IAM_USER_KEY = 'AKIARRRQHZXBINF6YWP2';
const IAM_SECRET_KEY = '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';
var pdf = require('html-pdf');
var COMMONURL=require('../../../common.json')
 
module.exports = {
    index: async(req,res) => {
        console.log(req.params.id);
        let cn_no = req.params.cn_no;
        var limit = (req.body.limit != undefined && req.body.limit != '') ? parseInt(req.body.limit) : 25;
        var sortby=req.body.sortby;
        var order=req.body.order
        
        var page = (req.body.page != undefined && req.body.page != '') ? parseInt(req.body.page) : 1;
            var skip = ((page - 1) * limit);
           // var filter_id = req.body.filter_id;
            var search=req.body.search;

var condition='';
var sortcondition='order by c.cn_no asc'
            if(search!=undefined && search!='')
            {
                condition ="and (c.cn_no like '%"+search+"%' or c.shipper_name like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' )";
            }

            if(sortby!=undefined && sortby!='' && order!=undefined && order!='')
            {
                sortcondition ="ORDER BY " + sortby + " " + order + "";
            }

         var totalnumber=0
var totalnumberofrecords="select COUNT(*) AS totalcount from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no   "+condition+" order by c.cn_no asc;";
var totalnumberdata=await commonFunction.getQueryResults(totalnumberofrecords);

console.log(totalnumberofrecords)
totalnumber=totalnumberdata[0].totalcount

        let query = "select o.*, c.quantity, c.expiry_date ,c.cn_datetime from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no  group by c.cn_no " + sortcondition + "  limit " + skip + "," + limit + " "
       
        if(search!=undefined && search!='')
        {
            query ="select o.*, c.quantity, c.expiry_date ,c.cn_datetime from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no and  (c.cn_no like '%"+search+"%' or c.shipper_code like '%"+search+"%' or  c.receiver_name like '%"+search+"%' or  c.destination_code like '%"+search+"%' ) " + sortcondition + "";
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
    //sep4backup
    // index: (req,res) => {
    //     console.log(req.params.id);
    //     let cn_no = req.params.cn_no;
    //     let query = "select o.*, c.quantity, c.expiry_date ,c.cn_datetime from out_for_delivery o, consignment c where o.status = 'In-progress' and o.cn_no = c.cn_no order by c.cn_no asc;"
    //    connection.query(query,cn_no, (err,rows) => {
    //         if(err){
    //             console.log(err);
    //         } else if (rows.length == 0 ){
    //            console.log("no results found");
    //            res.json({
    //             status: 2,
    //             message:"No results found"
    //         });
    //         } else {
    //             console.log("results found");
    //             res.json({
    //                 status: 1,
    //                 data:rows
    //             })
    //         }
            
    //     })
       
    // },

    ofdCompleted: (req,res) => {
        console.log(req.params.id);
        let cn_no = req.params.cn_no;
        let query = "select * from out_for_delivery where status = 'Completed' order by datetime desc;"
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
                    data:rows
                })
            }
            
        })
       
    },

    upload: async(req,res) => {
            const PDFDocument = require('pdfkit');
            const fs = require('fs');
            // const doc = new PDFDocument

            //Pipe its output somewhere, like to a file or HTTP response 
            //See below for browser usage 
            // doc.pipe(fs.createWriteStream('output.pdf'))


            //Add an image, constrain it to a given size, and center it vertically and horizontally 
            let test = new Date( "dd-mm-yyyy");
           console.log();
        let today = new Date();
        let file_url;
        // const doc = new PDFDocument;

        // if(!req.files){
        //     res.json({
        //         status:false,
        //         message:'file undefined error'
        //     })
        // }
        console.log(req.body);
        console.log(req.body.status);
        console.log(req.files);
        try {
            if(req.body.status != 'Close'){
                if(req.body.status === 'Completed'){
                    
                    if(req.files === null){
                        res.json({
                            status: false,
                            message:"You need to upload receipt screenshot to Completed this task"
                        })
                    }else{
                        connection.query('select * from consignment where cn_no = ?', req.body.cn_no, async (err,consignment_results) => {
                            if(err){
                                console.log(err);
                            } else {
                                
                                var checkingQuery="Select * from out_for_delivery as o where cn_no ='"+req.body.cn_no+"'"
                                var dataquery=await commonFunction.getQueryResults(checkingQuery)
                                console.clear()
                                console.log('sksks;',dataquery[0].attachment)
                                if(dataquery[0].attachment!=undefined && dataquery[0].attachment!=''){
                                        res.json({status:0,message:"Pod has been already uploaded this consigment"})

                                } 
                                else
                                {  
                            var file = req.files.file;
                            const doc = new PDFDocument
                            doc
                                .font('Times-Bold')
                                .fontSize(8)
                                .text("GOODS DELIVERED BY: PSA TRANSPORT SDN BHD",  { align: "left" })
                                .text("DO/CN NO: " + req.body.cn_no ,  { align: "left" })
                                .text("VOLUME: " + consignment_results[0].quantity, { align: "left" })
                                .text("DELIVERED DATE: " +  moment(new Date()).format('DD/MM/YYYY'), { align: "left" })
                                .text("REMARKS", { align: "left" })
                                .text("SHIPPER: " + consignment_results[0].shipper_code,250,82, { align: "left" })
                                .text("RECEIVER: " + consignment_results[0].receiver_code,250,89, { align: "left" })
                                .text("DESTINATION: " + consignment_results[0].destination_code,250,97, { align: "left" })
                                .fontSize(15)
                                .text("PROOF OF DELIVERY",430,78, { align: "left" })
                                .moveDown();

                            doc.image('./logo.png', 530, 65, {width: 55, height: 55})
                                .moveDown();

                            doc.image(file.data, 70, 160,{fit: [500, 500], align: 'center', valign: 'center'});
                            // doc.image('images/test.jpeg', 430, 15, {fit: [100, 100], align: 'center', valign: 'center'})

                                doc.end()
                            let s3bucket = new AWS.S3({
                                accessKeyId: IAM_USER_KEY,
                                secretAccessKey: IAM_SECRET_KEY,
                                Bucket: BUCKET_NAME
                            });

                            // s3bucket.createBucket(function() {
                                var params = {
                                    Bucket: BUCKET_NAME,
                                    Key: req.body.cn_no + '.pdf',
                                    Body: doc
                                }
                                s3bucket.upload(params,function (err, data) {
                                    if(err){
                                        console.log('error in callback');
                                        console.log(err);
                                    }
                                    console.log(data.Location);
                                    file_url = data.Location;

                                    //deleting the records
                                    let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
                                    connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
                                        if(err){
                                            console.log(err)
                                        } else {
                                            console.log("Tracking Data Deleted Successfully");
                                        }
                                    })

                                    //adding rows in  tracking
                                    // var tracking_data1 = {
                                    //     "cn_no": req.body.cn_no,
                                    //     "status": "ATTEMPTING",
                                    //     "datetime": today
                                    // }
                                    var tracking_data2 = {
                                        "cn_no": req.body.cn_no,
                                        "status": "POD_DELIVERED",
                                        "datetime": today,
                                        isold:1
                                    }
                                    
                                    //inserting record in tracking table
                                    // connection.query('INSERT INTO tracking SET ?', tracking_data1, (err,rows) => {
                                    //     if(err){
                                    //         console.log(err);
                                    //     } else {
                                    //         console.log("Tracking 1 added sucessfully");
                                    //     }
                                    // })
                                    connection.query('INSERT INTO tracking SET ?', tracking_data2, (err,rows) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log("Tracking 2 added sucessfully");
                                        }
                                    })
                                    
                                    //updating status in consignment table
                                    let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
                                    let data1 = [req.body.status, req.body.cn_no];
                                    connection.query(consignment_update_query, data1, (err,rows) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log("Consignment updated  sucessfully");
                                        }
                                    })
                                    
                                    //updating out for delivery
                                    let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                                    var ofd_data = {
                                        'status' : req.body.status,
                                        'attachment' : file_url,
                                        'datetime' : today
                                    }
                                    let data2 = [ofd_data, req.body.cn_no];
                                    connection.query(ofd_update_query, data2, (err,rows) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log("OFD updated  sucessfully");
                                        }
                                    })
                                    
                                    //creating a log
                                    var log_data = {
                                        "user_id" : req.params.id,
                                        "cn_no"   : req.body.cn_no,
                                        "status": " has uploaded POD for  Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
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
                                })
                            }
                        }
                        })
                    }
                }else{
                    if(req.files === null){

                        //updating out for delivery
                        let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                        var ofd_data = {
                            'status' : req.body.status,
                            'driver_name' : req.body.driver_name,
                        }
                        let data3 = [ofd_data, req.body.cn_no];
                        connection.query(ofd_update_query, data3, (err,rows) => {
                            if(err){
                                console.log(err);
                            } else {
                                console.log("OFD updated  sucessfully");
                            }
                        })

                         //deleting the records
                         let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
                         connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
                             if(err){
                                 res.json({
                                     status:false,
                                     message: 'there are some errors with query'
                                 })
                             } else {
                                 console.log("Tracking Data Successfully");
                             }
                         })

                            //creating a log
                        var log_data = {
                            "user_id" : req.params.id,
                            "cn_no"   : req.body.cn_no,
                            "status": " has updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
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
                    }else{
                        res.json({
                            status: false,
                            message:"Please select Status as Completed to upload POD."
                        })
                    }
                }
            }else {
                //updating out for delivery
                let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                var ofd_data = {
                    'status' : req.body.status,
                }
                let data4 = [ofd_data, req.body.cn_no];
                connection.query(ofd_update_query, data4, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("OFD updated  sucessfully");
                    }
                })

                //updating status in consignment table
                let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
                let data5 = [req.body.status, req.body.cn_no];
                connection.query(consignment_update_query, data5, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Consignment updated  sucessfully");
                    }
                })

                //creating a log
                var log_data = {
                    "user_id" : req.params.id,
                    "cn_no"   : req.body.cn_no,
                    "status": " has updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
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
            
        }
        catch (err) {
            console.log(err);
        }
    },

    manifestdriverprint: async (req, res) => {

        // const doc = new PDFDocument

        //Pipe its output somewhere, like to a file or HTTP response 
        //See below for browser usage 
        // doc.pipe(fs.createWriteStream('output.pdf'))


        //Add an image, constrain it to a given size, and center it vertically and horizontally 
        let test = new Date("dd-mm-yyyy");
        console.log();
        let today = new Date();
        let month = moment().format("YYY-MM-DD")
       
        // const doc = new PDFDocument;

        // if(!req.files){
        //     res.json({
        //         status:false,
        //         message:'file undefined error'
        //     })
        // }
        console.log(req.body);
        console.log(req.body);



        // console.log(req.files);
        var driver_name = req.body.driver;
        var start_date = req.body.start_date;
        var end_date = req.body.end_date;

        var options = { height: "20.5in", width: "8.3in", border: "2", format: 'Letter' };
        try {
            
                        let query = "select o.*,(c.carton_size + c.m3_size + c.m3_min_size + c.weight_min_size + c.weight_size + c.pallet_size +  c.p_size + c.s_size + c.m_size + c.l_size + c.xl_size + c.pkt_size + c.other_charges) as quantity FROM out_for_delivery o join consignment c on c.cn_no = o.cn_no where o.driver_name ='" + req.body.driver + "'  and  (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('" + req.body.start_date + "') AND DATE_FORMAT(o.datetime,'%Y-%m-%d')  <= DATE('" + req.body.end_date + "'))and o.status = 'In-progress' order by o.receiver_name"
                        let consignment_results = await commonFunction.getQueryResults(query)
                        console.log(query)
                        let invoice = {
                            consignment_results
                        }

                        const rows = invoice.consignment_results.map(await createRow).join(''); ///creating dynmaic table rows 
                        let table = await createTable(rows) //function for createtable
                        let tabledesign = await createHtml(table, driver_name, start_date, end_date) ////function for htm display in pdf




                       



                        ///textInRowFirst(doc, 'Nombre o razón social', 100);
                        // generateInvoiceTable(doc, invoice);
                        //  generateFooter(doc);



                        pdf.create(tabledesign, options).toFile('./uploads/' + driver_name + '-' + month + '.pdf', function (err, results) {
                            if (err) {
                                console.log(err);

                            } else {
                                console.log(results)

                                 
                                var filePath = COMMONURL.SERVERURL + ':' + COMMONURL.SERVERPORT + '/' + driver_name + '-' + month + '.pdf'
                                res.json({ invoice, filePath })
                            }
                        });





                        // doc.image(70, 160,{fit: [500, 500], align: 'center', valign: 'center'});
                        // doc.image('images/test.jpeg', 430, 15, {fit: [100, 100], align: 'center', valign: 'center'})


                        // let s3bucket = new AWS.S3({
                        //     accessKeyId: IAM_USER_KEY,
                        //     secretAccessKey: IAM_SECRET_KEY,
                        //     Bucket: BUCKET_NAME
                        // });

                        // s3bucket.createBucket(function() {
                        // var params = {
                        //     Bucket: BUCKET_NAME,
                        //     Key: req.body.cn_no + '.pdf',
                        //     Body: doc
                        // }
                        // s3bucket.upload(params,function (err, data) {
                        //     if(err){
                        //         console.log('error in callback');
                        //         console.log(err);
                        //     }
                        //     console.log(data.Location);
                        //     file_url = data.Location;

                        //     //deleting the records
                        //     let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
                        //     connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
                        //         if(err){
                        //             console.log(err)
                        //         } else {
                        //             console.log("Tracking Data Deleted Successfully");
                        //         }
                        //     })

                        //     //adding rows in  tracking
                        //     // var tracking_data1 = {
                        //     //     "cn_no": req.body.cn_no,
                        //     //     "status": "ATTEMPTING",
                        //     //     "datetime": today
                        //     // }
                        //     var tracking_data2 = {
                        //         "cn_no": req.body.cn_no,
                        //         "status": "POD_DELIVERED",
                        //         "datetime": today
                        //     }

                        //     //inserting record in tracking table
                        //     // connection.query('INSERT INTO tracking SET ?', tracking_data1, (err,rows) => {
                        //     //     if(err){
                        //     //         console.log(err);
                        //     //     } else {
                        //     //         console.log("Tracking 1 added sucessfully");
                        //     //     }
                        //     // })
                        //     connection.query('INSERT INTO tracking SET ?', tracking_data2, (err,rows) => {
                        //         if(err){
                        //             console.log(err);
                        //         } else {
                        //             console.log("Tracking 2 added sucessfully");
                        //         }
                        //     })

                        //     //updating status in consignment table
                        //     let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
                        //     let data1 = [req.body.status, req.body.cn_no];
                        //     connection.query(consignment_update_query, data1, (err,rows) => {
                        //         if(err){
                        //             console.log(err);
                        //         } else {
                        //             console.log("Consignment updated  sucessfully");
                        //         }
                        //     })

                        //     //updating out for delivery
                        //     let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                        //     var ofd_data = {
                        //         'status' : req.body.status,
                        //         'attachment' : file_url,
                        //         'datetime' : today
                        //     }
                        //     let data2 = [ofd_data, req.body.cn_no];
                        //     connection.query(ofd_update_query, data2, (err,rows) => {
                        //         if(err){
                        //             console.log(err);
                        //         } else {
                        //             console.log("OFD updated  sucessfully");
                        //         }
                        //     })

                        //     //creating a log
                        //     var log_data = {
                        //         "user_id" : req.params.id,
                        //         "cn_no"   : req.body.cn_no,
                        //         "status": " has uploaded POD for  Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
                        //     }
                        //     connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                        //         if (lgerr) {
                        //         console.log(lgerr)
                        //         }else{
                        //             console.log("log added successfully");
                        //         }
                        //     });

                        //     res.json({
                        //         status:true,
                        //         message:'Consignment Updated sucessfully'
                        //     })
                        // })
                        // }
                        // })
                  
                    // if(req.files === null){

                    //     //updating out for delivery
                    //     let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                    //     var ofd_data = {
                    //         'status' : req.body.status,
                    //         'driver_name' : req.body.driver_name,
                    //     }
                    //     let data3 = [ofd_data, req.body.cn_no];
                    //     connection.query(ofd_update_query, data3, (err,rows) => {
                    //         if(err){
                    //             console.log(err);
                    //         } else {
                    //             console.log("OFD updated  sucessfully");
                    //         }
                    //     })

                    //      //deleting the records
                    //      let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
                    //      connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
                    //          if(err){
                    //              res.json({
                    //                  status:false,
                    //                  message: 'there are some errors with query'
                    //              })
                    //          } else {
                    //              console.log("Tracking Data Successfully");
                    //          }
                    //      })

                    //         //creating a log
                    //     var log_data = {
                    //         "user_id" : req.params.id,
                    //         "cn_no"   : req.body.cn_no,
                    //         "status": " has updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
                    //     }
                    //     connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                    //         if (lgerr) {
                    //         console.log(lgerr)
                    //         }else{
                    //             console.log("log added successfully");
                    //         }
                    //     });
                    //     res.json({
                    //         status:true,
                    //         message:'Consignment Updated sucessfully'
                    //     })
                    // }else{
                    //     res.json({
                    //         status: false,
                    //         message:"Please select Status as Completed to upload POD."
                    //     })
                    // }
               
             

        }
        catch (err) {
            console.log(err);
        }
    },
    manifestdriverprintdemo: async (req,res) => {
        
        // const doc = new PDFDocument

        //Pipe its output somewhere, like to a file or HTTP response 
        //See below for browser usage 
        // doc.pipe(fs.createWriteStream('output.pdf'))


        //Add an image, constrain it to a given size, and center it vertically and horizontally 
        let test = new Date( "dd-mm-yyyy");
       console.log();
    let today = new Date();
    let file_url;
    // const doc = new PDFDocument;

    // if(!req.files){
    //     res.json({
    //         status:false,
    //         message:'file undefined error'
    //     })
    // }
    console.log(req.body);
    console.log(req.body);
   // console.log(req.files);
    try {
        if(req.body.status != 'Close'){
            if(req.body.status === 'Completed'){
                
                if(req.files === null){
                    res.json({
                        status: false,
                        message:"You need to upload receipt screenshot to Completed this task"
                    })
                }else{

                     
 
 

                    let query = "select o.*,(c.carton_size + c.m3_size + c.m3_min_size + c.weight_min_size + c.weight_size + c.pallet_size +  c.p_size + c.s_size + c.m_size + c.l_size + c.xl_size + c.pkt_size + c.other_charges) as quantity FROM out_for_delivery o join consignment c on c.cn_no = o.cn_no where o.driver_name ='" +req.body.driver +"'  and  (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('" + req.body.start_date + "') AND DATE_FORMAT(o.datetime,'%Y-%m-%d')  <= DATE('" + req.body.end_date + "'))and o.status = 'In-progress' order by o.receiver_name"
                   let consignment_results=await commonFunction.getQueryResults(query)
                   console.log(consignment_results)
                   let invoice={
                    consignment_results
                   }
                //    const table0 = {
                //     headers: ['Word', 'Comment', 'Summary'],
                //     rows: [
                //         ['Apple', 'Not this one', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.'],
                //         ['Tire', 'Smells like funny', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.']
                //     ]
                // };
                   
                    // connection.query('select * from consignment where cn_no = ?', req.body.cn_no, (err,consignment_results) => {
                        
                       // var file = req.files.file;
                        const doc = new PDFDocument
                        //var stream = doc.pipe(blobStream());
                        doc
                            .font('Times-Bold')
                            .fontSize(12)
                            .text("MANIFEST DRIVER",  { align: "left" })
                            .text("PSA TRANSPORT SDN BHD (344121-P)" ,  { align: "left" })





                           
                            // .text("DO/CN NO: " + req.body.cn_no ,  { align: "left" })
                            // .text("VOLUME: " + consignment_results[0].quantity, { align: "left" })
                            // .text("DELIVERED DATE: " +  moment(new Date()).format('DD/MM/YYYY'), { align: "left" })
                            // .text("REMARKS", { align: "left" })
                            // .text("SHIPPER: " + consignment_results[0].shipper_code,250,82, { align: "left" })
                            // .text("RECEIVER: " + consignment_results[0].receiver_code,250,89, { align: "left" })
                            // .text("DESTINATION: " + consignment_results[0].destination_code,250,97, { align: "left" })
                            // .fontSize(15)
                            // .text("PROOF OF DELIVERY",430,78, { align: "left" })
                            .moveDown();
                            doc
                            .font('Times-Roman', 10)
                             
                            .text("BANDAR PETALING JAYA SELATAN, PETALING" ,  { align: "left" })
                             .text("JAYA, SELANGOR 46000, MALAYSIA" ,  { align: "left" })
                             .text("PHONE: +603 - 77821548  E-MAIL:info@psatrans.com" ,  { align: "left" })
                             .text("FAX: +603 - 77859520   WEBSITE:http://www.psatrans.com" ,{ align: "left" })
                             .moveDown();
                          
                             doc
                             .text("Driver name: " + req.body.driver ,  { align: "left" } )
                             .text("Driver name: " + req.body.driver ,  { align: "right" } )
                             .moveDown()
                            

                            
                             
                             ///textInRowFirst(doc, 'Nombre o razón social', 100);
                            generateInvoiceTable(doc, invoice);
                            //  generateFooter(doc);

                              
                            
                        
                             doc.image('./logo.png', 530, 65, {width:60, height:40})
                            .moveDown();



                            
                        // doc.image(70, 160,{fit: [500, 500], align: 'center', valign: 'center'});
                        // doc.image('images/test.jpeg', 430, 15, {fit: [100, 100], align: 'center', valign: 'center'})
                        console.log('ssss',doc)
                        doc.pipe(fs.createWriteStream('mei.pdf'));
                            doc.end()
                            res.json({invoice})
                        // let s3bucket = new AWS.S3({
                        //     accessKeyId: IAM_USER_KEY,
                        //     secretAccessKey: IAM_SECRET_KEY,
                        //     Bucket: BUCKET_NAME
                        // });

                        // s3bucket.createBucket(function() {
                            // var params = {
                            //     Bucket: BUCKET_NAME,
                            //     Key: req.body.cn_no + '.pdf',
                            //     Body: doc
                            // }
                            // s3bucket.upload(params,function (err, data) {
                            //     if(err){
                            //         console.log('error in callback');
                            //         console.log(err);
                            //     }
                            //     console.log(data.Location);
                            //     file_url = data.Location;

                            //     //deleting the records
                            //     let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
                            //     connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
                            //         if(err){
                            //             console.log(err)
                            //         } else {
                            //             console.log("Tracking Data Deleted Successfully");
                            //         }
                            //     })

                            //     //adding rows in  tracking
                            //     // var tracking_data1 = {
                            //     //     "cn_no": req.body.cn_no,
                            //     //     "status": "ATTEMPTING",
                            //     //     "datetime": today
                            //     // }
                            //     var tracking_data2 = {
                            //         "cn_no": req.body.cn_no,
                            //         "status": "POD_DELIVERED",
                            //         "datetime": today
                            //     }
                                
                            //     //inserting record in tracking table
                            //     // connection.query('INSERT INTO tracking SET ?', tracking_data1, (err,rows) => {
                            //     //     if(err){
                            //     //         console.log(err);
                            //     //     } else {
                            //     //         console.log("Tracking 1 added sucessfully");
                            //     //     }
                            //     // })
                            //     connection.query('INSERT INTO tracking SET ?', tracking_data2, (err,rows) => {
                            //         if(err){
                            //             console.log(err);
                            //         } else {
                            //             console.log("Tracking 2 added sucessfully");
                            //         }
                            //     })
                                
                            //     //updating status in consignment table
                            //     let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
                            //     let data1 = [req.body.status, req.body.cn_no];
                            //     connection.query(consignment_update_query, data1, (err,rows) => {
                            //         if(err){
                            //             console.log(err);
                            //         } else {
                            //             console.log("Consignment updated  sucessfully");
                            //         }
                            //     })
                                
                            //     //updating out for delivery
                            //     let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                            //     var ofd_data = {
                            //         'status' : req.body.status,
                            //         'attachment' : file_url,
                            //         'datetime' : today
                            //     }
                            //     let data2 = [ofd_data, req.body.cn_no];
                            //     connection.query(ofd_update_query, data2, (err,rows) => {
                            //         if(err){
                            //             console.log(err);
                            //         } else {
                            //             console.log("OFD updated  sucessfully");
                            //         }
                            //     })
                                
                            //     //creating a log
                            //     var log_data = {
                            //         "user_id" : req.params.id,
                            //         "cn_no"   : req.body.cn_no,
                            //         "status": " has uploaded POD for  Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
                            //     }
                            //     connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                            //         if (lgerr) {
                            //         console.log(lgerr)
                            //         }else{
                            //             console.log("log added successfully");
                            //         }
                            //     });
                                
                            //     res.json({
                            //         status:true,
                            //         message:'Consignment Updated sucessfully'
                            //     })
                            // })
                       // }
                   // })
                }
            }else{
                // if(req.files === null){

                //     //updating out for delivery
                //     let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
                //     var ofd_data = {
                //         'status' : req.body.status,
                //         'driver_name' : req.body.driver_name,
                //     }
                //     let data3 = [ofd_data, req.body.cn_no];
                //     connection.query(ofd_update_query, data3, (err,rows) => {
                //         if(err){
                //             console.log(err);
                //         } else {
                //             console.log("OFD updated  sucessfully");
                //         }
                //     })

                //      //deleting the records
                //      let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
                //      connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
                //          if(err){
                //              res.json({
                //                  status:false,
                //                  message: 'there are some errors with query'
                //              })
                //          } else {
                //              console.log("Tracking Data Successfully");
                //          }
                //      })

                //         //creating a log
                //     var log_data = {
                //         "user_id" : req.params.id,
                //         "cn_no"   : req.body.cn_no,
                //         "status": " has updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
                //     }
                //     connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                //         if (lgerr) {
                //         console.log(lgerr)
                //         }else{
                //             console.log("log added successfully");
                //         }
                //     });
                //     res.json({
                //         status:true,
                //         message:'Consignment Updated sucessfully'
                //     })
                // }else{
                //     res.json({
                //         status: false,
                //         message:"Please select Status as Completed to upload POD."
                //     })
                // }
            }
        }else {
            //updating out for delivery
            let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
            var ofd_data = {
                'status' : req.body.status,
            }
            let data4 = [ofd_data, req.body.cn_no];
            connection.query(ofd_update_query, data4, (err,rows) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("OFD updated  sucessfully");
                }
            })

            //updating status in consignment table
            let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
            let data5 = [req.body.status, req.body.cn_no];
            connection.query(consignment_update_query, data5, (err,rows) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("Consignment updated  sucessfully");
                }
            })

            //creating a log
            var log_data = {
                "user_id" : req.params.id,
                "cn_no"   : req.body.cn_no,
                "status": " has updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
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
        
    }
    catch (err) {
        console.log(err);
    }
},

    deletePod : (req,res) => {
        
        let cn_no = req.body.cn_no;

        console.log("delete pod fnction");


        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_SECRET_KEY,
        });

        var params = {
            Bucket: BUCKET_NAME,
            Key: 'DIRECT5.pdf',
        };
        s3bucket.deleteObject(params, function (err, data) {
            if (data) {
                console.log("File deleted successfully");
            }
            else {
                console.log("Check if you have sufficient permissions : "+err);
            }
        });

        
        //deleting the records
        let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
        connection.query(tracking_delete_query, cn_no, (err,rows) => {
            if(err){
                console.log(err)
            } else {
                console.log("Tracking Data Deleted Successfully");
            }
        })

        let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
        let data1 = ["out for delivery", cn_no];
        connection.query(consignment_update_query, data1, (err,rows) => {
            if(err){
                console.log(err);
            } else {
                console.log("Consignment updated  sucessfully");
            }
        })
        
        //updating out for delivery
        let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
        var ofd_data = {
            'status' : "In-progress",
            'attachment' : "",
            // 'datetime' : today
        }
        let data2 = [ofd_data, cn_no];
        connection.query(ofd_update_query, data2, (err,rows) => {
            if(err){
                console.log(err);
            } else {
                console.log("OFD updated  sucessfully");
            }
        })
        
        //creating a log
        var log_data = {
            "user_id" : req.params.id,
            "cn_no"   : cn_no,
            "status": " has updated Consignment No. [" + cn_no + " ] to oUT FOR DELIVERY"
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
}

function textInRowFirst(doc, text, heigth) {
    doc.y = heigth;
    doc.x = 30;
    doc.fillColor('black')
    doc.text(text, {
      paragraphGap: 5,
      indent: 5,
      align: 'justify',
      columns: 1,
    });
    return doc
  }

function generateTableRow(doc, y, c1, c2, c3, c4, c5,c6) {
    doc
      .fontSize(10)
      .text(c1, 50, y)
      .text(c2, 120, y)
      .text(c3, 140, y, { width: 90, align: "right" })
      .text(c4, 180, y, { width: 90, align: "right" })
      .text(c5, 200, y,{align: "right" })
      .text(c6, 190, y, { align: "right" });
  }

  function generateInvoiceTable(doc, invoice) {
    let i,
      invoiceTableTop = 300;
  
    for (i = 0; i < invoice.consignment_results.length; i++) {
      const item = invoice.consignment_results[i];
      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        moment(item.datetime).format('YYYY-MM-DD'),
        item.cn_no,
        item.shipper_code,
        item.quantity,
        item.receiver_name,
        ''
       
      );
    }
  }


  function createTable(rows) 
  {
      return`
  <table>
    <tr>
        <th style="width: 12%; text-align: left; background: rgb(0, 0, 0); color: rgb(255, 255, 255);">Date</td>
        <th style="width: 12%; text-align: left; background: rgb(0, 0, 0); color: rgb(255, 255, 255);">CNO</td>
        <th style="width: 12%; text-align: left; background: rgb(0, 0, 0); color: rgb(255, 255, 255);">Shipper code</td>
        <th style="width: 12%; text-align: left; background: rgb(0, 0, 0); color: rgb(255, 255, 255);">QUANTITY</td>
        <th style="width: 12%; text-align: left; background: rgb(0, 0, 0); color: rgb(255, 255, 255);">RECIVERCODE</td>
        <th style="width: 12%; text-align: left; background: rgb(0, 0, 0); color: rgb(255, 255, 255);">Chop/sign</td>
         
    </tr>
    ${rows}
  </table>`
   }
   function createRow(item) 
  { 
      var table=`<tr>
  <td style="border-bottom: 1px solid rgb(68, 68, 68);">${moment(item.datetime).format('DD/MM/YYYY')}</td>
  <td style="border-bottom: 1px solid rgb(68, 68, 68);">${item.cn_no}</td>
  <td style="border-bottom: 1px solid rgb(68, 68, 68);">${item.shipper_code}</td>
  <td style="border-bottom: 1px solid rgb(68, 68, 68);">${item.quantity}</td>
  <td style="border-bottom: 1px solid rgb(68, 68, 68);">${item.receiver_name}</td>
  <td style="border-bottom: 1px solid rgb(68, 68, 68);"></td>
   
</tr>`
      return table
 }

 function createHtml(table,driver_name,start_date,end_date)
 { 
    var html=`<div id="divToPrint" class="mt4" style="background-color: white; width: 210mm; min-height: 297mm; margin-left: auto; margin-right: auto;"><div><table width="100%" style="table-layout: fixed; border-spacing: 0px; padding: 20px 50px;">
    <tbody><tr><td><table width="100%" style="table-layout: fixed; border-spacing: 0px;">
        <tbody>
            <tr>
                <td style="font-size: 24px; font-weight: bold; padding-bottom: 30px;">MANIFEST DRIVER</td>
            </tr>
            <tr>
                <td style="font-size: 14px; font-weight: bold;">PSA TRANSPORT SDN BHD (344121-P)</td>
            </tr>
            <tr>
                <td style="font-size: 14px; font-weight: normal;">BANDAR PETALING JAYA SELATAN, PETALING JAYA, SELANGOR 46000, MALAYSIA.</td>
            </tr>
            <tr>
                <td style="font-size: 14px; font-weight: normal;">
                    <table>
                        <tbody>
                            <tr>
                                <td>PHONE: +603 - 7782 1548</td>
                                <td>E-MAIL: info@psatrans.com</td>
                            </tr>
                        </tbody>
                    </table>
                </td></tr><tr><td style="font-size: 14px; font-weight: normal;"><table>
                    <tbody>
                        <tr>
                            <td>FAX: +603 - 7785 9520</td>
                            <td>WEBSITE: http://www.psatrans.com/</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table></td><td style="font-size: 24px; font-weight: bold; text-align: right;"><table width="100%" style="table-layout: fixed; border-spacing: 0px;"><tbody><tr><td style="font-size: 24px; font-weight: bold; text-align: right;"><img src="https://poddocs.s3.us-east-2.amazonaws.com/logos/logo.png" style="width: 180px; height: 180px;"></td></tr></tbody></table></td></tr></tbody></table><table width="100%" style="table-layout: fixed; border-spacing: 0px; padding: 20px 50px;"><tbody><tr><td><table width="100%" style="table-layout: fixed; border-spacing: 0px;"><tbody><tr><td style="font-size: 12px; font-weight: bold; padding-bottom: 0px; color: rgb(136, 136, 136);">Driver Name :</td></tr><tr><td style="font-size: 14px; font-weight: bold;">${driver_name}</td></tr></tbody></table></td><td style="padding-left: 100px;"><table width="100%" style="table-layout: fixed; border-spacing: 0px;"><tbody><tr><td style="font-size: 14px; font-weight: normal;"><b>From date: </b>${start_date}</td></tr><tr><td style="font-size: 14px; font-weight: normal;"><b>To date: </b>${end_date}</td></tr></tbody></table></td></tr></tbody></table>
${table}
`
return  html
}


