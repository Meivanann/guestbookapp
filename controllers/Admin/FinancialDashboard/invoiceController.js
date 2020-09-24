var connection = require('../../../config');
const pdfInvoice = require('pdf-invoice');
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
const fs = require('fs')
const commonFunction = require('../../commonFunction');
//const { async } = require('q');
var moment=require('moment');
var _=require('lodash')
module.exports = {
    getAllInvoices: (req,res) => {
       
        console.log(req.params.id);
        let today = new Date();
        let last30Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
        let overdue_amount = 0, due = 0, average_date;
        let query = "SELECT * FROM invoice order by invoice_date desc;"
       connection.query(query, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                res.json({
                    status: 2,
                    message:"No Results Found"
                })
            } else {
                console.log("results found");

                Object.keys(rows).forEach(function(key) {
                    var row = rows[key];
                    
                    if(row.status != 'Paid' && row.payment_due_date < today)
                    {
                        overdue_amount = overdue_amount + ( parseFloat(row.inv_total_amount) - parseFloat(row.amount_paid));
                    }

                    if(row.status != 'Paid' && row.payment_due_date < last30Days)
                    {
                        due = due + (parseFloat(row.inv_total_amount) - parseFloat(row.amount_paid));
                    }

                });
                var date1 = new Date();
                var date2 = new Date(rows[0].payment_due_date);
                console.log(date2);
                var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); 

                res.json({
                    status: 1,
                    data:rows,
                    overdue_amount:overdue_amount,
                    due_30_days:due,
                    average_time:diffDays
                })
            }
            
        })
       
    },
    getInvoices: (req,res) => {
        console.log(req.params.id);
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let shipper_code = req.body.shipper_code;
        let query, data;
         let search=req.body.search;

        console.log(start_date);
        if(start_date != "" &&  start_date != undefined && end_date != ""&& end_date != undefined)
        {
            console.log("date")
            console.log("1iisl");
            query = "SELECT * FROM invoice where (invoice_date between ? and ?);"
            data = [start_date, end_date];
        }
        if(search != "" &&  search != undefined && search != ""&& search != undefined)
        {
            console.log("date")
            console.log("1iisl");
            query = "SELECT * FROM invoice where invoice_no in(?)"
            data = [search];
        }

        if(shipper_code != "" &&  shipper_code != undefined && shipper_code != ""&& shipper_code != undefined)
        {
            console.log("2iksll;");
            query = "SELECT * FROM invoice where shipper_code = ?;"
            data = [shipper_code];
        }
        
       connection.query(query,data, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                res.json({
                    status: 2,
                    message:"No Results Found"
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
    getpaymentlist: (req,res) => {
        console.log(req.params.id);
        let invoice_no = req.body.invoice_no;
        // let end_date = req.body.end_date;
        // let shipper_code = req.body.shipper_code;
       // let query, data;
        // let search=req.body.search;

        //console.log(start_date);
      let query="select * from payments where invoice_id='"+invoice_no+"' and type=1"
        
       connection.query(query, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                res.json({
                    status: 2,
                    message:"No Results Found"
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

    //backup19Aug
    // getInvoices: (req,res) => {
    //     console.log(req.params.id);
    //     let start_date = req.body.start_date;
    //     let end_date = req.body.end_date;
    //     let shipper_code = req.body.shipper_code;
    //     let query, data;

    //     console.log(start_date);
    //     if(start_date != "" && end_date != "")
    //     {
    //         console.log("1");
    //         query = "SELECT * FROM invoice where (invoice_date between ? and ?) and shipper_code = ?;"
    //         data = [start_date, end_date, shipper_code];
    //     }
    //     else{
    //         console.log("2");
    //         query = "SELECT * FROM invoice where shipper_code = ?;"
    //         data = [shipper_code];
    //     }
        
    //    connection.query(query,data, (err,rows) => {
    //         if(err){
    //             console.log(err);
    //         } else if (rows.length == 0 ){
    //             res.json({
    //                 status: 2,
    //                 message:"No Results Found"
    //             })
    //         } else {
    //             console.log("results found");
    //             res.json({
    //                 status: 1,
    //                 data:rows
    //             })
    //         }
            
    //     })
       
    // },


    // manifestdriverprint: async (req, res) => {

    //     // const doc = new PDFDocument

    //     //Pipe its output somewhere, like to a file or HTTP response 
    //     //See below for browser usage 
    //     // doc.pipe(fs.createWriteStream('output.pdf'))


    //     //Add an image, constrain it to a given size, and center it vertically and horizontally 
    //     let test = new Date("dd-mm-yyyy");
    //     console.log();
    //     let today = new Date();
    //     let month = moment().format("YYY-MM-DD")
       
    //     // const doc = new PDFDocument;

    //     // if(!req.files){
    //     //     res.json({
    //     //         status:false,
    //     //         message:'file undefined error'
    //     //     })
    //     // }
    //     console.log(req.body);
    //     console.log(req.body);



    //     // console.log(req.files);
    //     var driver_name = req.body.driver;
    //     var start_date = req.body.start_date;
    //     var end_date = req.body.end_date;

    //     var options = { height: "20.5in", width: "8.3in", border: "2", format: 'Letter' };
    //     try {
            
    //         let query = "SELECT * FROM invoice where invoice_no = ?;"
    //         connection.query(query, invoice_no, (err,rows) => {
    //              if(err){
    //                  console.log(err);
    //              } else if (rows.length == 0 ){
    //                  res.json({
    //                      status: false,
    //                      data:rows,
    //                      message:"NO Records found"
    //                  })
    //              } else {
    //                  // fetching consignment records
    //                  let consignment_query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and shipper_code=? and is_billed = 1 and is_approved = 1 order by cn_no asc"
    //                  let consignment_data = [rows[0].consignment_start_date, rows[0].consignment_end_date, rows[0].shipper_code];
    //                  console.log(consignment_data);
    //                  connection.query(consignment_query, consignment_data, (consignment_err,consignment_rows) => {
    //                      if(err){
    //                          console.log(err);
    //                      }else{
    //                          // fetching shipper details
    //                          let shipper_query = "select * from shipping where shipper_code = ?"
    //                          connection.query(shipper_query, rows[0].shipper_code, (err,shipper_rows) => {
    //                              if(err){
    //                                  console.log(err);
    //                              }else{
    //                                  shipper_details = shipper_rows[0];
    //                                 //  const rows = invoice.consignment_results.map(await createRow).join(''); ///creating dynmaic table rows 
    //                                 //  let table = await createTable(rows) //function for createtable
    //                                 //  let tabledesign = await createHtml(table, driver_name, start_date, end_date) ////function for htm display in pdf
             
             
             
             
                                    
             
             
             
    //                                  ///textInRowFirst(doc, 'Nombre o razón social', 100);
    //                                  // generateInvoiceTable(doc, invoice);
    //                                  //  generateFooter(doc);
             
             
             
    //                                  pdf.create(tabledesign, options).toFile('./uploads/' + driver_name + '-' + month + '.pdf', function (err, results) {
    //                                      if (err) {
    //                                          console.log(err);
             
    //                                      } else {
    //                                          console.log(results)
             
                                              
    //                                          var filePath = COMMONURL.SERVERURL + ':' + COMMONURL.SERVERPORT + '/' + driver_name + '-' + month + '.pdf'
    //                                          res.json({ invoice, filePath })
    //                                      }
    //                                  });
             
             
    //                              }
    //                          });
    //                      }
    //                  });
    //              }
                 
    //          })
                        



    //                     // doc.image(70, 160,{fit: [500, 500], align: 'center', valign: 'center'});
    //                     // doc.image('images/test.jpeg', 430, 15, {fit: [100, 100], align: 'center', valign: 'center'})


    //                     // let s3bucket = new AWS.S3({
    //                     //     accessKeyId: IAM_USER_KEY,
    //                     //     secretAccessKey: IAM_SECRET_KEY,
    //                     //     Bucket: BUCKET_NAME
    //                     // });

    //                     // s3bucket.createBucket(function() {
    //                     // var params = {
    //                     //     Bucket: BUCKET_NAME,
    //                     //     Key: req.body.cn_no + '.pdf',
    //                     //     Body: doc
    //                     // }
    //                     // s3bucket.upload(params,function (err, data) {
    //                     //     if(err){
    //                     //         console.log('error in callback');
    //                     //         console.log(err);
    //                     //     }
    //                     //     console.log(data.Location);
    //                     //     file_url = data.Location;

    //                     //     //deleting the records
    //                     //     let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
    //                     //     connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
    //                     //         if(err){
    //                     //             console.log(err)
    //                     //         } else {
    //                     //             console.log("Tracking Data Deleted Successfully");
    //                     //         }
    //                     //     })

    //                     //     //adding rows in  tracking
    //                     //     // var tracking_data1 = {
    //                     //     //     "cn_no": req.body.cn_no,
    //                     //     //     "status": "ATTEMPTING",
    //                     //     //     "datetime": today
    //                     //     // }
    //                     //     var tracking_data2 = {
    //                     //         "cn_no": req.body.cn_no,
    //                     //         "status": "POD_DELIVERED",
    //                     //         "datetime": today
    //                     //     }

    //                     //     //inserting record in tracking table
    //                     //     // connection.query('INSERT INTO tracking SET ?', tracking_data1, (err,rows) => {
    //                     //     //     if(err){
    //                     //     //         console.log(err);
    //                     //     //     } else {
    //                     //     //         console.log("Tracking 1 added sucessfully");
    //                     //     //     }
    //                     //     // })
    //                     //     connection.query('INSERT INTO tracking SET ?', tracking_data2, (err,rows) => {
    //                     //         if(err){
    //                     //             console.log(err);
    //                     //         } else {
    //                     //             console.log("Tracking 2 added sucessfully");
    //                     //         }
    //                     //     })

    //                     //     //updating status in consignment table
    //                     //     let consignment_update_query = "UPDATE consignment set status = ? where cn_no = ?"
    //                     //     let data1 = [req.body.status, req.body.cn_no];
    //                     //     connection.query(consignment_update_query, data1, (err,rows) => {
    //                     //         if(err){
    //                     //             console.log(err);
    //                     //         } else {
    //                     //             console.log("Consignment updated  sucessfully");
    //                     //         }
    //                     //     })

    //                     //     //updating out for delivery
    //                     //     let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
    //                     //     var ofd_data = {
    //                     //         'status' : req.body.status,
    //                     //         'attachment' : file_url,
    //                     //         'datetime' : today
    //                     //     }
    //                     //     let data2 = [ofd_data, req.body.cn_no];
    //                     //     connection.query(ofd_update_query, data2, (err,rows) => {
    //                     //         if(err){
    //                     //             console.log(err);
    //                     //         } else {
    //                     //             console.log("OFD updated  sucessfully");
    //                     //         }
    //                     //     })

    //                     //     //creating a log
    //                     //     var log_data = {
    //                     //         "user_id" : req.params.id,
    //                     //         "cn_no"   : req.body.cn_no,
    //                     //         "status": " has uploaded POD for  Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
    //                     //     }
    //                     //     connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
    //                     //         if (lgerr) {
    //                     //         console.log(lgerr)
    //                     //         }else{
    //                     //             console.log("log added successfully");
    //                     //         }
    //                     //     });

    //                     //     res.json({
    //                     //         status:true,
    //                     //         message:'Consignment Updated sucessfully'
    //                     //     })
    //                     // })
    //                     // }
    //                     // })
                  
    //                 // if(req.files === null){

    //                 //     //updating out for delivery
    //                 //     let ofd_update_query = "UPDATE out_for_delivery set ? where cn_no = ?"
    //                 //     var ofd_data = {
    //                 //         'status' : req.body.status,
    //                 //         'driver_name' : req.body.driver_name,
    //                 //     }
    //                 //     let data3 = [ofd_data, req.body.cn_no];
    //                 //     connection.query(ofd_update_query, data3, (err,rows) => {
    //                 //         if(err){
    //                 //             console.log(err);
    //                 //         } else {
    //                 //             console.log("OFD updated  sucessfully");
    //                 //         }
    //                 //     })

    //                 //      //deleting the records
    //                 //      let tracking_delete_query = "delete from tracking  where cn_no = ? and (status = 'ATTEMPTING' or status ='DELIVERED');"
    //                 //      connection.query(tracking_delete_query, req.body.cn_no, (err,rows) => {
    //                 //          if(err){
    //                 //              res.json({
    //                 //                  status:false,
    //                 //                  message: 'there are some errors with query'
    //                 //              })
    //                 //          } else {
    //                 //              console.log("Tracking Data Successfully");
    //                 //          }
    //                 //      })

    //                 //         //creating a log
    //                 //     var log_data = {
    //                 //         "user_id" : req.params.id,
    //                 //         "cn_no"   : req.body.cn_no,
    //                 //         "status": " has updated Consignment No. [" + req.body.cn_no + " ] to " + req.body.status
    //                 //     }
    //                 //     connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
    //                 //         if (lgerr) {
    //                 //         console.log(lgerr)
    //                 //         }else{
    //                 //             console.log("log added successfully");
    //                 //         }
    //                 //     });
    //                 //     res.json({
    //                 //         status:true,
    //                 //         message:'Consignment Updated sucessfully'
    //                 //     })
    //                 // }else{
    //                 //     res.json({
    //                 //         status: false,
    //                 //         message:"Please select Status as Completed to upload POD."
    //                 //     })
    //                 // }
               
             

    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // },

    checkInvoice: async(req,res) => {
        let invoice_no = req.params.invoice_no;
        let query = "SELECT * FROM invoice where invoice_no = ?;"
       connection.query(query, invoice_no, async(err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                res.json({
                    status: false,
                    data:rows,
                    message:"NO Records found"
                })
            } else {
let cnoids=[]
                let updatequery = "SELECT * FROM consignment as c left join out_for_delivery as o  on o.cn_no=c.cn_no where (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('"+moment(rows[0].consignment_start_date).format('YYYY-MM-DD')+"') AND DATE_FORMAT(o.datetime,'%Y-%m-%d')  <= DATE('"+moment(rows[0].consignment_end_date).format('YYYY-MM-DD')+"')) and c.status = 'Close' and ( c.shipper_code='"+rows[0].shipper_code+"') and c.is_billed = 1 and c.is_approved = 1 and c.bill_to!='' order by c.cn_no asc "
                let updatedata=await commonFunction.getQueryResults(updatequery);
                console.log('updatedquery', updatequery)
if (updatedata.length > 0 ) {
 let sumtotal=   _.sumBy(updatedata, function (day) {
     
        return  Number(day.total_amount)
 
    })
    updatedata.forEach(element => {
       // cnoids.push(element.cn_no)

        if(element.bill_to!=undefined)
        {
            console.log('ss',element.bill_to);
        if((element.bill_to === 'shipper' && element.shipper_code === rows[0].shipper_code) || (element.bill_to === 'receiver' && element.receiver_code === rows[0].shipper_code)){
            //console.log('ssss',row.bill_to);
             
            cnoids.push(element.cn_no);

        }
        // else
        // {
        //     console.log('correct');
            
        // }

    }
    });
    console.clear()
    console.log('updated',sumtotal)

 
    
}
                

            let cnolist=rows.length>0&&rows[0].cnolist!=undefined ?rows[0].cnolist.replace(/\s/g, ""):''
            console.log('kls',cnolist.replace(/\s/g, ""))
            if (cnolist!=undefined && cnolist!='') {
                    let cnoarry=cnolist.split(',')
                    console.log('kls',cnoarry)
                    let consignment_query = "SELECT * FROM consignment as c left join  out_for_delivery as o  on o.cn_no=c.cn_no where o.cn_no in ('"+cnoarry.join("','")+"') and c.status = 'Close' and c.shipper_code=? and c.is_billed = 1 and c.is_approved = 1 order by c.cn_no asc"
                    let consignment_data = [rows[0].shipper_code];
                    connection.query(consignment_query, consignment_data, (consignment_err,consignment_rows) => {
                        if(err){
                            console.log(err);
                        }else{
    
                            console.log('consigment',consignment_query);
                            console.log('cnoarray',_.sumBy(consignment_rows, function (day) {
     
                                return  Number(day.total_amount)
                         
                            }))
                            // fetching shipper details
                            let shipper_query = "select * from shipping where shipper_code = ?"
                            connection.query(shipper_query, rows[0].shipper_code, (err,shipper_rows) => {
                                if(err){
                                    console.log(err);
                                }else{
                                    shipper_details = shipper_rows[0];
                                    res.json({
                                        status:true,
                                        consignments: consignment_rows,
                                        shipper: shipper_details,
                                        invoice: rows
                                    })
                                }
                            });
                        }
                    });
                }
                else
                {

                    //let previewquery = "SELECT * FROM consignment as c left join out_for_delivery as o  on o.cn_no=c.cn_no where (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('" + start_date + "') AND DATE_FORMAT(o.datetime,'%Y-%m-%d')  <= DATE('" + end_date + "')) and c.status = 'Close' and ( c.shipper_code=? or c.receiver_code = ?) and c.is_billed = 1 and c.is_approved = 1 and c.bill_to!='' order by o.id desc "
               
               
                    // fetching consignment records
               // let consignment_query = "SELECT * FROM consignment as c left join  out_for_delivery as o  on o.cn_no=c.cn_no where (o.datetime between ? and ? ) and c.status = 'Close' and c.shipper_code=? and c.is_billed = 1 and c.is_approved = 1 order by c.cn_no asc"
               let consignment_query = "SELECT * FROM consignment as c left join  out_for_delivery as o  on o.cn_no=c.cn_no where (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('"+moment(rows[0].consignment_start_date).format('YYYY-MM-DD')+"') and DATE_FORMAT(o.datetime,'%Y-%m-%d') <= DATE('"+moment(rows[0].consignment_end_date).format('YYYY-MM-DD')+"') ) and c.status = 'Close' and c.shipper_code=? and c.is_billed = 1 and c.is_approved = 1 order by c.cn_no asc"
               let consignment_data = [rows[0].shipper_code];
                console.log(consignment_data);
                connection.query(consignment_query, consignment_data, (consignment_err,consignment_rows) => {
                    if(err){
                        console.log(err);
                    }else{

                        console.log('consigment',consignment_query);
                        console.log('consigmentsection',_.sumBy(consignment_rows, function (day) {
 
                            return  Number(day.total_amount)
                     
                        }))
                        // fetching shipper details
                        let shipper_query = "select * from shipping where shipper_code = ?"
                        connection.query(shipper_query, rows[0].shipper_code, (err,shipper_rows) => {
                            if(err){
                                console.log(err);
                            }else{
                                shipper_details = shipper_rows[0];
                                res.json({
                                    status:true,
                                    consignments: consignment_rows,
                                    shipper: shipper_details,
                                    invoice: rows
                                })
                            }
                        });
                    }
                });
            }
        }

        })
        
       
    },

    previewInvoice: (req,res) =>{
        let total_amount = 0, sub_amount = 0, tax_amount = 0, shipper_details;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let shipper_code = req.body.shipper_code;
        let payment_due =req.body.payment_due;
        // let invoice_number = req.body.invoice_number;
        let invoice_date = req.body.invoice_date;
        let data = [ shipper_code,shipper_code];
        console.log(req.body); 
      
        let query = "SELECT * FROM consignment as c left join out_for_delivery as o  on o.cn_no=c.cn_no where (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('" + start_date + "') AND DATE_FORMAT(o.datetime,'%Y-%m-%d')  <= DATE('" + end_date + "')) and c.status = 'Close' and ( c.shipper_code=? or c.receiver_code = ?) and c.is_billed = 0 and c.is_approved = 1 and c.bill_to!='' order by c.cn_no asc "
      
       

        connection.query(query, data, (err,rows) => {
            console.log(query)

            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                console.log(rows);
                res.json({
                    status: 2,
                    message:"No Results Found"
                })
            }else{
                let result=[]
            
                Object.keys(rows).forEach(function(key) {
                    var row = rows[key];
                    if(row.bill_to!=undefined)
                    {
                        console.log('ss',row.bill_to);
                    if((row.bill_to === 'shipper' && row.shipper_code === shipper_code) || (row.bill_to === 'receiver' && row.receiver_code === shipper_code)){
                        console.log('ssss',row.bill_to);
                        sub_amount = sub_amount + parseFloat(row.sub_amount);
                        tax_amount = tax_amount + parseFloat(row.tax_amount);
                        result.push(rows[key]);

                    }
                    // else
                    // {
                    //     console.log('correct');
                        
                    // }

                }
                    
                });

                total_amount = sub_amount + tax_amount;
 
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];
                        res.json({
                            status:true,
                            consignments: result,
                            shipper: shipper_details,
                            sub_amount:sub_amount,
                            tax_amount: tax_amount,
                            total_amount: total_amount,
                            payment_due:payment_due,
                            invoice_date:invoice_date,
                            // invoice_number:invoice_number
                        })
                    }
                });
            }
        })
    },

    generateInvoice: async(req,res) =>{
        let today = new Date();
        
        let uniquequery="SELECT invoice_no as totalcount FROM invoice order by invoice_no desc limit 1"
        let uniquedata=await commonFunction.getQueryResults(uniquequery)
        let total_amount = 0, sub_amount = 0, tax_amount = 0, shipper_details, shipper_acc_details, acc_bal = 0;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let shipper_code = req.body.shipper_code;
        let payment_due =req.body.payment_due;
        let invoice_number=0
        let invoice_date = req.body.invoice_date;
var result=[]
var cnoids=[]
        let cnolistquery = "SELECT * FROM consignment as c left join out_for_delivery as o  on o.cn_no=c.cn_no where (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('" + start_date + "') AND DATE_FORMAT(o.datetime,'%Y-%m-%d')  <= DATE('" + end_date + "')) and c.status = 'Close' and ( c.shipper_code='" + shipper_code + "' or c.receiver_code = '" + shipper_code + "') and c.is_billed = 0 and c.is_approved = 1 and c.bill_to!='' order by c.cn_no asc "
        let cndata=await commonFunction.getQueryResults(cnolistquery)
console.log('skl',cnolistquery)
        if (cndata.length > 0 ) {
            Object.keys(cndata).forEach(function(key) {
                var row = cndata[key];
                if(row.bill_to!=undefined)
                {
                    console.log('ss',row.bill_to);
                if((row.bill_to === 'shipper' && row.shipper_code === shipper_code) || (row.bill_to === 'receiver' && row.receiver_code === shipper_code)){
                    console.log('ssss',row.bill_to);
                   // sub_amount = sub_amount + parseFloat(row.sub_amount);
                   // tax_amount = tax_amount + parseFloat(row.tax_amount);
                    result.push(cndata[key]);

                }
                // else
                // {
                //     console.log('correct');
                    
                // }

            }
                
            });
        }
        console.log('array',result)

        if (result.length > 0 ) {
            result.forEach(element => {
                cnoids.push(element.cn_no)
            });
            }
            console.log('cnoids',cnoids);
        if (uniquedata.length > 0 ) {
            invoice_number=Number(uniquedata[0].totalcount) + Number(1)
            }
        let query = "SELECT * FROM consignment as c  left join out_for_delivery as o  on o.cn_no=c.cn_no   where (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('"+start_date+"') and DATE_FORMAT(o.datetime,'%Y-%m-%d') <= DATE('"+end_date+"') )  and c.status = 'Close' and ( c.shipper_code=? or c.receiver_code = ?) and c.is_billed = 0 and c.is_approved = 1;"
        let data = [shipper_code, shipper_code];

        connection.query(query, data, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                console.log(rows);
                res.json({
                    status: 2,
                    message:"No Results Found"
                })
            }else{

                Object.keys(rows).forEach(function(key) {
                    var row = rows[key];
                    if((row.bill_to === 'shipper' && row.shipper_code === shipper_code) || (row.bill_to === 'receiver' && row.receiver_code === shipper_code)){
                            
                        sub_amount = sub_amount + parseFloat(row.sub_amount);
                        tax_amount = tax_amount + parseFloat(row.tax_amount);

                        var consignment_update_datas = {
                            "is_billed"   : 1
                        }
                        let consignment_update_data = [consignment_update_datas ,row.cn_no];

                        connection.query("UPDATE consignment SET ? where cn_no = ?",consignment_update_data, function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }else{
                                console.log("condignment updated Successfully")
                            }
                        });
                    }
                });

                total_amount = sub_amount + tax_amount;

                // getting the shipper details
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];

                        acc_bal = parseFloat(shipper_details.acc_bal) + parseFloat(total_amount); 
                           // creating an invoice record
                        var invoice_data = {
                            // "invoice_no"        : invoice_number,
                            "invoice_date"      : invoice_date,
                            "shipper_code"      : shipper_code,
                            "shipper_name"      : shipper_details.shipper_name,
                            "inv_sub_amount"    : sub_amount,
                            "inv_tax_amount"    : tax_amount,
                            "inv_total_amount"  : total_amount,
                            "status"            : "Unpaid",
                            "pdf_name"          : "test",
                            "payment_due_date"  : payment_due,
                            "consignment_start_date" : start_date,
                            "consignment_end_date"  : end_date,
                            debit:total_amount,
                            credit:0,
                            invoice_no:invoice_number,
                            cnolist:cnoids.join()
                        };

                        let invoice_query = "INSERT INTO invoice SET ?"

                        connection.query(invoice_query,invoice_data, async function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }else{

                                console.log('results',results);
                                console.log('invoicenumber',invoice_number);
                                let invoiceupdatequery="UPDATE consignment as c SET c.invoice_no='"+invoice_number+"' where c.cn_no in ('"+cnoids.join("','")+"') ";
                                let invoiceupdatedata=await commonFunction.getQueryResults(invoiceupdatequery)
                                //invoice_number = results.insertId;
                                let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                                var shipper_acc_update_data = {
                                    "acc_bal"   :   acc_bal
                                }
                                let data111 = [shipper_acc_update_data ,shipper_code];

                                connection.query(shipper_acc_update,data111, function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                    }else{
                                        console.log("Shipping updated Successfully")
                                    }
                                });

                                // inserting  Account of Statements
                                var inv_acc_data = {
                                    "shipper_code" : shipper_code,
                                    "type"         : "Invoice",
                                    "invoice_no"   :  invoice_number,
                                    "description"  :  payment_due,
                                    "amount"       :  total_amount,
                                    "created_on"   :  today 
                                }
                                let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
                                connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
                                    if (lgerr) {
                                        console.log(lgerr)
                                    }else{
                                        console.log("Shippin account statement  added successfully");
                                    }
                                });

                                var incomeobject={type:'Income',account:20,amount:total_amount,description:'invoice from create invoice',debit:0,credit:total_amount,invoice_number:invoice_number,types:'Invoice',created_on:invoice_date,from_id:1,shipper_code:shipper_code}
                                var accountReacivable={type:'Income',account:22,amount:total_amount,description:'invoice from create invoice',debit:total_amount,credit:0,invoice_number:invoice_number,types:'Invoice',created_on:invoice_date,from_id:1,shipper_code:shipper_code}
                                var array=[incomeobject,accountReacivable]
                                let accountdetailsinvoice = array.map((m) => Object.values(m))
                                let acc_query = "INSERT INTO account_statements(type,account,amount,description,debit,credit,invoice_number,types,created_on,from_id,shipper_code) values ? "
                                connection.query(acc_query, [accountdetailsinvoice], function (err, data) {
                                    if (err) {
                                        console.log(err)
                                    }else{
                                        console.log("account statement  added successfully");
                                    }
                                });



                                res.json({
                                    status:true,
                                    message:'Invoice generated sucessfully',
                                    invoice_number: invoice_number
                                })
                            }
                        });                
                    }
                });

            }
        })
    },
    //14augbackup
    
    // generateInvoice: (req,res) =>{
    //     let today = new Date();
    //     let total_amount = 0, sub_amount = 0, tax_amount = 0, shipper_details, shipper_acc_details, acc_bal = 0;
    //     let start_date = req.body.start_date;
    //     let end_date = req.body.end_date;
    //     let shipper_code = req.body.shipper_code;
    //     let payment_due =req.body.payment_due;
    //     let invoice_number;
    //     let invoice_date = req.body.invoice_date;

    //     let query = "SELECT * FROM consignment as c  left join out_for_delivery as o  on o.cn_no=c.cn_no   where (o.datetime between ? and ? ) and c.status = 'Close' and ( c.shipper_code=? or c.receiver_code = ?) and c.is_billed = 0 and c.is_approved = 1;"
    //     let data = [start_date, end_date, shipper_code, shipper_code];

    //     connection.query(query, data, (err,rows) => {
    //         if(err){
    //             console.log(err);
    //         } else if (rows.length == 0 ){
    //             console.log(rows);
    //             res.json({
    //                 status: 2,
    //                 message:"No Results Found"
    //             })
    //         }else{
    //             Object.keys(rows).forEach(function(key) {
    //                 var row = rows[key];
    //                 if((row.bill_to === 'shipper' && row.shipper_code === shipper_code) || (row.bill_to === 'receiver' && row.receiver_code === shipper_code)){
                            
    //                     sub_amount = sub_amount + parseFloat(row.sub_amount);
    //                     tax_amount = tax_amount + parseFloat(row.tax_amount);

    //                     var consignment_update_datas = {
    //                         "is_billed"   :   1
    //                     }
    //                     let consignment_update_data = [consignment_update_datas ,row.cn_no];

    //                     connection.query("UPDATE consignment SET ? where cn_no = ?",consignment_update_data, function (error, results, fields) {
    //                         if (error) {
    //                             console.log(error);
    //                         }else{
    //                             console.log("condignment updated Successfully")
    //                         }
    //                     });
    //                 }
    //             });

    //             total_amount = sub_amount + tax_amount;

    //             // getting the shipper details
    //             let shipper_query = "select * from shipping where shipper_code = ?"
    //             connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
    //                 if(err){
    //                     console.log(err);
    //                 }else{
    //                     shipper_details = shipper_rows[0];

    //                     acc_bal = parseFloat(shipper_details.acc_bal) + parseFloat(total_amount); 
    //                        // creating an invoice record
    //                     var invoice_data = {
    //                         // "invoice_no"        : invoice_number,
    //                         "invoice_date"      : invoice_date,
    //                         "shipper_code"      : shipper_code,
    //                         "shipper_name"      : shipper_details.shipper_name,
    //                         "inv_sub_amount"    : sub_amount,
    //                         "inv_tax_amount"    : tax_amount,
    //                         "inv_total_amount"  : total_amount,
    //                         "status"            : "Unpaid",
    //                         "pdf_name"          : "test",
    //                         "payment_due_date"  : payment_due,
    //                         "consignment_start_date" : start_date,
    //                         "consignment_end_date"  : end_date
    //                     };

    //                     let invoice_query = "INSERT INTO invoice SET ?"

    //                     connection.query(invoice_query,invoice_data, function (error, results, fields) {
    //                         if (error) {
    //                             console.log(error);
    //                         }else{
    //                             invoice_number = results.insertId;
    //                             let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
    //                             var shipper_acc_update_data = {
    //                                 "acc_bal"   :   acc_bal
    //                             }
    //                             let data111 = [shipper_acc_update_data ,shipper_code];

    //                             connection.query(shipper_acc_update,data111, function (error, results, fields) {
    //                                 if (error) {
    //                                     console.log(error);
    //                                 }else{
    //                                     console.log("Shipping updated Successfully")
    //                                 }
    //                             });

    //                             // inserting  Account of Statements
    //                             var inv_acc_data = {
    //                                 "shipper_code" : shipper_code,
    //                                 "type"         : "Invoice",
    //                                 "invoice_no"   :  invoice_number,
    //                                 "description"  :  payment_due,
    //                                 "amount"       :  total_amount,
    //                                 "created_on"   :  today 
    //                             }
    //                             let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
    //                             connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
    //                                 if (lgerr) {
    //                                     console.log(lgerr)
    //                                 }else{
    //                                     console.log("Shippin account statement  added successfully");
    //                                 }
    //                             });

    //                             res.json({
    //                                 status:true,
    //                                 message:'Invoice generated sucessfully',
    //                                 invoice_number: invoice_number
    //                             })
    //                         }
    //                     });                
    //                 }
    //             });

    //         }
    //     })
    // },

    deleteInvoice: (req,res) => {
        let user_id=req.body.user_id
        let invoice_no = req.body.invoice_no;
        connection.query("select * from invoice where invoice_no = ? ", invoice_no, async(invoice_err,invoice_rows) => {
            if(invoice_err){
                console.log(invoice_err);
            } else if (invoice_rows.length == 0 ){
                console.log(invoice_rows);
                res.json({
                    status: 2,
                    message:"No Results Found"
                })
            }else{
                let invoice_row = invoice_rows[0];

                if(invoice_row.cn_no != null && invoice_row != ""){

                    var consignment_update_datas = {
                        "is_billed"   :   0,
                        "invoice_no"   :   0
                    }
                    let consignment_update_data = [consignment_update_datas ,invoice_row.cn_no];

                    connection.query("UPDATE consignment SET ? where cn_no = ?",consignment_update_data, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }else{
                            console.log('correct')

                            let today=moment().format('YYYY-MM-DD')
                            var log_data = {
                                "user_id" : user_id,
                                "invoice_no"   : invoice_no,
                                "status": "Invoice "+invoice_no+" has deleted on" +today
                            }
                            connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                                if (lgerr) {
                                console.log(lgerr)
                                }else{
                                    console.log("log added successfully");
                                }
                            });
                       // }
                            console.log("consignment updated Successfully")
                        }
                    });
                }else{
                    let cnoarry=[]
                    let cnolist=invoice_rows.length>0&&invoice_rows[0].cnolist!=undefined ?invoice_rows[0].cnolist.replace(/\s/g, ""):''
            console.log('kls',cnolist.replace(/\s/g, ""))
            if (cnolist!=undefined && cnolist!='') {
                     cnoarry=cnolist.split(',')
                }  
                 // let start_date=moment(invoice_row.consignment_start_date).format('YYYY-MM-DD');
                  //  let end_date=moment(invoice_row.consignment_end_date).format('YYYY-MM-DD')
                   // let consignment_query = "SELECT * FROM consignment as c INNER JOIN out_for_delivery as o on o.cn_no=c.cn_no where (DATE_FORMAT(o.datetime,'%Y-%m-%d') >= DATE('"+start_date+"') and DATE_FORMAT(o.datetime,'%Y-%m-%d') <= DATE('"+end_date+"') )  and c.status = 'Close' and ( c.shipper_code=? or c.receiver_code = ?) and c.is_billed = 1 and c.is_approved = 1;"
                   let consignment_query = "SELECT * FROM consignment as c INNER JOIN out_for_delivery as o on o.cn_no=c.cn_no where o.cn_no in ('"+cnoarry.join("','")+"')  and c.status = 'Close' and ( c.shipper_code=? or c.receiver_code = ?) and c.is_billed = 1 and c.is_approved = 1;"
                   let consignment_data = [invoice_row.shipper_code, invoice_row.shipper_code];
                    // let consignment_query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and ( shipper_code=? or receiver_code = ?) and is_billed = 1 and is_approved = 1;"
                    // let consignment_data = [invoice_row.consignment_start_date, invoice_row.consignment_end_date, invoice_row.shipper_code, invoice_row.shipper_code];
            console.log('cnolos',consignment_query)
                    connection.query(consignment_query, consignment_data, async(consignment_err,consignment_rows) => {
                        if(consignment_err){
                            console.log(consignment_err);
                        } else if (consignment_rows.length == 0 ){
                            console.log("No consignments found");
                        }else{
                            Object.keys(consignment_rows).forEach(function(key) {
                                var row = consignment_rows[key];
                                if((row.bill_to === 'shipper' && row.shipper_code === invoice_row.shipper_code) || (row.bill_to === 'receiver' && row.receiver_code === invoice_row.shipper_code)){
                     
                                    var consignment_update_datas = {
                                        "is_billed"   :   0,
                                        "invoice_no"   :   0
                                    }
                                    let consignment_update_data = [consignment_update_datas ,row.cn_no];
            
                                    connection.query("UPDATE consignment SET ? where cn_no = ?",consignment_update_data, function (error, results, fields) {
                                        if (error) {
                                            console.log(error);
                                        }else{
                                            console.log("condignment updated Successfully")
                                        }
                                    });
                                }
                            });


                            let today=moment().format('YYYY-MM-DD')
                            var log_data = {
                                "user_id" : user_id,
                                "invoice_no"   : invoice_no,
                                "status": "Invoice "+invoice_no+" has deleted on" +today
                            }
                            connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                                if (lgerr) {
                                console.log(lgerr)
                                }else{
                                    console.log("log added successfully");
                                }
                            });
                        }
                    });
                }
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, invoice_row.shipper_code, async(err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        let acc_bal = 0;
                        shipper_details = shipper_rows[0];

                        acc_bal = parseFloat(shipper_rows.length > 0 && shipper_rows[0].acc_bal!=undefined&&shipper_rows[0].acc_bal!=''?shipper_rows[0].acc_bal:0) - parseFloat(invoice_row.inv_total_amount); 

                        let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                        var shipper_acc_update_data = {
                            "acc_bal"   :   acc_bal
                        }
                        let data111 = [shipper_acc_update_data ,invoice_row.shipper_code];

                        connection.query(shipper_acc_update,data111, async function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }else{
                                console.log("Shipping updated Successfully")
                            }
                        });
                    }
                });

                let delete_query = "delete from shipper_acc_statements where invoice_no = ? and type ='Invoice';"
                connection.query(delete_query, invoice_no, async(errr,rows) => {
                    if(errr){
                       console.log(errr);
                    } else {
                        console.log("Shipping account statement deleted successfully")
                    }
                });

                let delete_query1 = "delete from invoice where invoice_no = ?;"
                connection.query(delete_query1, invoice_no, async(errr,rows) => {
                    if(errr){
                       console.log(errr);
                    } else {


                        let deleteBillquery="delete from account_statements  where invoice_number="+invoice_no+"";
                        let deletedata=await commonFunction.getQueryResults(deleteBillquery)
                        console.log("Invoice deleted successfully")
                    }
                });

                 res.json({
                    status: true,
                    message:"Invoice deleted successfully"
                })
            }
        });
    },

    recordPayment: (req,res) => {
        let invoice_no = req.body.invoice_no;
        let today = moment().format('YYYY-MM-DD');
        let amount_paid = req.body.amount_paid;
        let payment_method = req.body.payment_method;
        let total_amount = req.body.total_amount;
        let shipper_code = req.body.shipper_code;
        let account=req.body.account;
        let payment_date = req.body.payment_date;
        let acc_bal = 0, amt = 0;
        console.log("record pay,emnt");
        let paymentObject= {

            'payment_type':payment_method,
            'account':account,
            'amount':amount_paid,
            'type':1,      //invoice
            'debit':amount_paid,
            'credit':0,
            'invoice_id':invoice_no,
            paymentdate:payment_date,
            money_type:1,
            category:0,
            "shipper_code" : shipper_code
        }  
        

        let salesbjectpayment= {

            'payment_type':payment_method,
            'account':20,
            'amount':amount_paid,
            'type':1,      //invoice
            'debit':0,
            'credit':amount_paid,
            'invoice_id':invoice_no,
            paymentdate:payment_date,
            money_type:1,
            category:0,
            "shipper_code" : shipper_code
        }   
        

var accountobject={payment_type:payment_method,account:22,amount:amount_paid,type:1,debit:0,credit:amount_paid,'invoice_id':invoice_no, paymentdate:payment_date,money_type:1,category:0,"shipper_code" : shipper_code}
let payment=[]
payment.push(paymentObject,accountobject,salesbjectpayment)
// updating the invoice table and recording the payment
        connection.query("select * from invoice where invoice_no = ?",invoice_no, function (error, invoice_rows, fields) {
            if (error) {
                console.log(error);
            }else{
                amt =  parseFloat(invoice_rows[0].inv_total_amount) -  parseFloat(invoice_rows[0].amount_paid);
                if(amt === parseFloat(amount_paid) )
                {
                    var invoice_data = {
                        "amount_paid"       :   parseFloat(invoice_rows[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   payment_date,
                        "status"            :   "Paid"
                    }
                }else{
                    var invoice_data = {
                        "amount_paid"       :   parseFloat(invoice_rows[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   payment_date,
                        "status"            :   "Partially Paid"
                    }
                }
            
                let query = "UPDATE invoice SET ? where invoice_no = ?";
                let data1 = [invoice_data ,invoice_no];

                connection.query(query,data1, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }else{

                        
                        let paymentvalues= payment.map((m) => Object.values(m))
                        var paymentQuery = "insert payments(payment_type,account,amount,type,debit,credit,invoice_id,paymentdate,money_type,category,shipper_code)values ? "
                        connection.query(paymentQuery,[paymentvalues], function (err, datas) {
                            if (error) {
                                console.log(error);
                            }else{

                                let shipper_query = "select * from shipping where shipper_code = ?"
                                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                                    if(err){
                                        console.log(err);
                                    }else{

                                        acc_bal = parseFloat(shipper_rows.length>0&&shipper_rows[0].acc_bal!=undefined&&shipper_rows[0].acc_bal!=''?shipper_rows[0].acc_bal:0 ) - parseFloat(amount_paid); 
                                        let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                                        var shipper_acc_update_data = {
                                            "acc_bal"   :   acc_bal
                                        }
                                        let data111 = [shipper_acc_update_data ,shipper_code];
        
                                        connection.query(shipper_acc_update,data111, function (error, results, fields) {
                                            if (error) {
                                                console.log(error);
                                            }else{
                                                console.log("Shipping updated Successfully")
                                            }
                                        });
        
                                    }
                                });
        
                                // inserting  Account of Statements
                                var inv_acc_data = {
                                    "shipper_code" : shipper_code,
                                    "type"         : "Payment",
                                    "invoice_no"   :  invoice_no,
                                    "description"  :  "Payment for invoice " + invoice_no,
                                    "amount"       :  amount_paid,
                                    "created_on"   :  payment_date 
                                }
                                
                                let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
                                connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
                                    if (lgerr) {
                                        console.log(lgerr)
                                    }else{
                                        console.log("Shippin account statement  added successfully");
                                    }
                                });
                                // inserting transaction details 
        
                                var o_acc_data = {
                                    "type"         : "Income",
                                    "account"      :  req.body.account,
                                    "amount"       :  amount_paid,
                                    "description"  :  "Payment for invoice " + invoice_no,
                                   
                                    
                                    "debit"      : amount_paid,
                                    "credit"      :  0,
                                    invoice_no:invoice_no,
                                    types:'invoice payment',
                                    "created_on": payment_date,
                                    "created_on"   :  payment_date,
                                    ispayment:1,
                                    from_id:4,  //4-invoice payment
                                    payment_method:payment_method,
                                    is_profit:0,
                                    money_type:1,
                                    category:0,
                                    shipper_code:shipper_code
                                }
   // for account of  payment amount come under debit from invoice but account reciveable account amount come under the credit for invoice payment
                                var accountrecivable={type:'Income',account:22,amount:amount_paid,description:'invoice payment from invoice',debit:0,credit:amount_paid,invoice_no:invoice_no,types:'invoice payment',created_on:payment_date,ispayment:1,from_id:4,payment_method:payment_method,is_profit:0,money_type:1,category:0,shipper_code:shipper_code}
                                var salesobject={type:'Income',account:20,amount:amount_paid,description:"invoice "+invoice_no+" payment from invoice",debit:0,credit:amount_paid,invoice_no:invoice_no,types:'invoice payment',created_on:payment_date,ispayment:1,from_id:4,payment_method:payment_method,is_profit:1,money_type:1,category:0,shipper_code:shipper_code}
                                var array=[accountrecivable,o_acc_data,salesobject]
                                let accountdetailsinvoice = array.map((m) => Object.values(m))

                                let acc_query = "INSERT INTO account_statements(type,account,amount,description,debit,credit,invoice_number,types,created_on,ispayment,from_id,payment_method,is_profit,money_type,category,shipper_code)values ? "
                        connection.query(acc_query, [accountdetailsinvoice], function (err, data) {
                            if (err) {
                                console.log(err)
                            }else{
                                console.log("account statement  added successfully");
                            }
                        });
                                // let o_acc_state_query = "INSERT INTO account_statements SET ?"
                                // connection.query(o_acc_state_query, o_acc_data, function (lgerr, lgres, fields) {
                                //     if (lgerr) {
                                //         console.log(lgerr)
                                //     }else{
                                //         console.log("Shippin account statement  added successfully");
                                //     }
                                // });
        
        
                                console.log(results);
                                //creating a log
                                var log_data = {
                                    "user_id" : req.params.id,
                                    "status": " has recorded the payment for invoice no "+ invoice_no
                                }
                                connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                                    if (lgerr) {
                                    console.log(lgerr)
                                    }else{
                                        console.log("log added successfully");


                                        res.json({
                                            status:true,
                                            message:'Invoice Updated sucessfully'
                                        })
                                    }
                                });
                            }

                        })
                        
                        


                       
                    }
                });
            }
        });
    },

    //14augbackup
    // recordPayment: (req,res) => {
    //     let invoice_no = req.body.invoice_no;
    //     let today = new Date();
    //     let amount_paid = req.body.amount_paid;
    //     let payment_method = req.body.payment_method;
    //     let total_amount = req.body.total_amount;
    //     let shipper_code = req.body.shipper_code;
    //     let acc_bal = 0, amt = 0;
    //     console.log("record pay,emnt");

    //     // updating the invoice table and recording the payment
    //     connection.query("select * from invoice where invoice_no = ?",invoice_no, function (error, invoice_rows, fields) {
    //         if (error) {
    //             console.log(error);
    //         }else{
    //             amt =  parseFloat(invoice_rows[0].inv_total_amount) -  parseFloat(invoice_rows[0].amount_paid);
    //             if(amt === parseFloat(amount_paid) )
    //             {
    //                 var invoice_data = {
    //                     "amount_paid"       :   parseFloat(invoice_rows[0].amount_paid) + parseFloat(amount_paid),
    //                     "payment_method"    :   payment_method,
    //                     "paid_on"           :   req.body.paid_on,
    //                     "status"            :   "Paid"
    //                 }
    //             }else{
    //                 var invoice_data = {
    //                     "amount_paid"       :   parseFloat(invoice_rows[0].amount_paid) + parseFloat(amount_paid),
    //                     "payment_method"    :   payment_method,
    //                     "paid_on"           :   req.body.paid_on,
    //                     "status"            :   "Partially Paid"
    //                 }
    //             }
            
    //             let query = "UPDATE invoice SET ? where invoice_no = ?";
    //             let data1 = [invoice_data ,invoice_no];

    //             connection.query(query,data1, function (error, results, fields) {
    //                 if (error) {
    //                     console.log(error);
    //                 }else{
                        
    //                     let shipper_query = "select * from shipping where shipper_code = ?"
    //                     connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
    //                         if(err){
    //                             console.log(err);
    //                         }else{
    //                             acc_bal = parseFloat(shipper_rows[0].acc_bal) - parseFloat(amount_paid); 
    //                             let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
    //                             var shipper_acc_update_data = {
    //                                 "acc_bal"   :   acc_bal
    //                             }
    //                             let data111 = [shipper_acc_update_data ,shipper_code];

    //                             connection.query(shipper_acc_update,data111, function (error, results, fields) {
    //                                 if (error) {
    //                                     console.log(error);
    //                                 }else{
    //                                     console.log("Shipping updated Successfully")
    //                                 }
    //                             });

    //                         }
    //                     });

    //                     // inserting  Account of Statements
    //                     var inv_acc_data = {
    //                         "shipper_code" : shipper_code,
    //                         "type"         : "Payment",
    //                         "invoice_no"   :  invoice_no,
    //                         "description"  :  "Payment for invoice " + invoice_no,
    //                         "amount"       :  amount_paid,
    //                         "created_on"   :  today 
    //                     }
                        
    //                     let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
    //                     connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
    //                         if (lgerr) {
    //                             console.log(lgerr)
    //                         }else{
    //                             console.log("Shippin account statement  added successfully");
    //                         }
    //                     });
    //                     // inserting transaction details 

    //                     var o_acc_data = {
    //                         "type"         : "Income",
    //                         "description"  :  "Payment for invoice " + invoice_no,
    //                         "amount"       :  amount_paid,
    //                         "account"      :  req.body.account,
    //                         "created_on"   :  today 
    //                     }
    //                     let o_acc_state_query = "INSERT INTO account_statements SET ?"
    //                     connection.query(o_acc_state_query, o_acc_data, function (lgerr, lgres, fields) {
    //                         if (lgerr) {
    //                             console.log(lgerr)
    //                         }else{
    //                             console.log("Shippin account statement  added successfully");
    //                         }
    //                     });


    //                     console.log(results);
    //                     //creating a log
    //                     var log_data = {
    //                         "user_id" : req.params.id,
    //                         "status": " has recorded the payment for invoice no "+ invoice_no
    //                     }
    //                     connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
    //                         if (lgerr) {
    //                         console.log(lgerr)
    //                         }else{
    //                             console.log("log added successfully");
    //                         }
    //                     });

    //                     res.json({
    //                         status:true,
    //                         message:'Invoice Updated sucessfully'
    //                     })
    //                 }
    //             });
    //         }
    //     });
    // },

    consignmentPreviewInvoice: (req,res) =>{
        let total_amount = 0, sub_amount = 0, tax_amount = 0, shipper_details;
        let query = "SELECT * FROM consignment where cn_no = ? and is_billed = 0 and is_approved = 1 order by cn_no"
        let today = new Date(), code;
        connection.query(query, req.body.cn_no, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                console.log(rows);
                res.json({
                    status: 2,
                    message:"No Results Found"
                })
            }else{
    
                if(rows[0].bill_to === 'shipper'){
                    code =  rows[0].shipper_code 
                } else{
                    code =  rows[0].receiver_code
                }
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];
                        res.json({
                            status:true,
                            consignments: rows,
                            shipper: shipper_details,
                            sub_amount:rows[0].sub_amount,
                            tax_amount: rows[0].tax_amount,
                            total_amount: rows[0].total_amount,
                            payment_due:req.body.payment_due,
                            invoice_date:req.body.invoice_date,
                            // invoice_number:invoice_number
                        })
                    }
                });
            }
        })
    },

    consignmentGenerateInvoice: async(req,res) =>{
        let today = new Date();
        let total_amount = 0, sub_amount = 0, tax_amount = 0, shipper_details, shipper_acc_details, acc_bal = 0;
        let payment_due =req.body.payment_due;
        let invoice_number, code ;
        let uniquequery="SELECT invoice_no as totalcount FROM invoice order by invoice_no desc limit 1"
        let uniquedata=await commonFunction.getQueryResults(uniquequery);

        if (uniquedata.length > 0 ) {
            invoice_number=Number(uniquedata[0].totalcount) + Number(1)
            }

            console.log(invoice_number)
        let query = "SELECT * FROM consignment where cn_no = ? and is_billed = 0 and is_approved = 1;"


        connection.query(query, req.body.cn_no, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                console.log(rows);
                res.json({
                    status: 2,
                    message:"No Results Found"
                })
            }else{

                // updating consignment record
                var consignment_update_datas = {
                    "is_billed"   :   1
                }
                let consignment_update_data = [consignment_update_datas ,rows[0].cn_no];

                connection.query("UPDATE consignment SET ? where cn_no = ?",consignment_update_data, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }else{
                        console.log("condignment updated Successfully")
                    }
                });

                if(rows[0].bill_to === 'shipper'){
                    code =  rows[0].shipper_code 
                } else{
                    code =  rows[0].receiver_code
                }
                // getting the shipper details
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];

                        acc_bal = parseFloat(shipper_details.acc_bal) + parseFloat(rows[0].total_amount); 
                           // creating an invoice record
                        var invoice_data = {
                             "invoice_no"        : invoice_number,
                            "invoice_date"      : req.body.invoice_date,
                            "shipper_code"      : rows[0].shipper_code,
                            "shipper_name"      : shipper_details.shipper_name,
                            "inv_sub_amount"    : rows[0].sub_amount,
                            "inv_tax_amount"    : rows[0].tax_amount,
                            "inv_total_amount"  : rows[0].total_amount,
                            "status"            : "Unpaid",
                            "pdf_name"          : "test",
                            "payment_due_date"  : req.body.payment_due,
                            "consignment_start_date" : null,
                            "consignment_end_date"  : null,
                            "cn_no" : req.body.cn_no,
                            "cnolist" : req.body.cn_no
                        };

                        let invoice_query = "INSERT INTO invoice SET ?"

                        connection.query(invoice_query,invoice_data, async function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }else{

                                console.log('results',results);
                                console.log('invoicenumber',invoice_number);
                                let invoiceupdatequery="UPDATE consignment as c SET c.invoice_no='"+invoice_number+"' where c.cn_no = '"+req.body.cn_no+"' ";
                                let invoiceupdatedata=await commonFunction.getQueryResults(invoiceupdatequery)
                                //invoice_number = results.insertId;
                                let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                                var shipper_acc_update_data = {
                                    "acc_bal"   :   acc_bal
                                }
                                let data111 = [shipper_acc_update_data ,rows[0].shipper_code];

                                connection.query(shipper_acc_update,data111, function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                    }else{
                                        console.log("Shipping updated Successfully")
                                    }
                                });

                                // inserting  Account of Statements
                                var inv_acc_data = {
                                    "shipper_code" : code,
                                    "type"         : "Invoice",
                                    "invoice_no"   :  invoice_number,
                                    "description"  :  req.body.payment_due,
                                    "amount"       :  rows[0].total_amount,
                                    "created_on"   :  today 
                                }
                                let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
                                connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
                                    if (lgerr) {
                                        console.log(lgerr)
                                    }else{
                                        console.log("Shippin account statement  added successfully");
                                    }
                                });

                                res.json({
                                    status:true,
                                    message:'Invoice generated sucessfully',
                                    invoice_number:invoice_number
                                })
                            }
                        });                
                    }
                });

            }
        })
    },
}