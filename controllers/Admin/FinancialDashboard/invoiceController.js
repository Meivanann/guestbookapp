var connection = require('../../../config');
const pdfInvoice = require('pdf-invoice');
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
const fs = require('fs')


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

        console.log(start_date);
        if(start_date != "" && end_date != "")
        {
            console.log("1");
            query = "SELECT * FROM invoice where (invoice_date between ? and ?) and shipper_code = ?;"
            data = [start_date, end_date, shipper_code];
        }
        else{
            console.log("2");
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

    checkInvoice: (req,res) => {
        let invoice_no = req.params.invoice_no;
        let query = "SELECT * FROM invoice where invoice_no = ?;"
       connection.query(query, invoice_no, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                res.json({
                    status: false,
                    data:rows,
                    message:"NO Records found"
                })
            } else {
                // fetching consignment records
                let consignment_query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and shipper_code=? and is_billed = 1 and is_approved = 1;"
                let consignment_data = [rows[0].consignment_start_date, rows[0].consignment_end_date, rows[0].shipper_code];
                console.log(consignment_data);
                connection.query(consignment_query, consignment_data, (consignment_err,consignment_rows) => {
                    if(err){
                        console.log(err);
                    }else{
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
        let data = [start_date, end_date, shipper_code,shipper_code];
        console.log(req.body); 
        let query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and ( shipper_code=? or receiver_code = ?) and is_billed = 0 and is_approved = 1 and bill_to!='';"
      
        

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
    
    generateInvoice: (req,res) =>{
        let today = new Date();
        let total_amount = 0, sub_amount = 0, tax_amount = 0, shipper_details, shipper_acc_details, acc_bal = 0;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let shipper_code = req.body.shipper_code;
        let payment_due =req.body.payment_due;
        let invoice_number;
        let invoice_date = req.body.invoice_date;

        let query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and ( shipper_code=? or receiver_code = ?) and is_billed = 0 and is_approved = 1;"
        let data = [start_date, end_date, shipper_code, shipper_code];

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
                            "is_billed"   :   1
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
                            "consignment_end_date"  : end_date
                        };

                        let invoice_query = "INSERT INTO invoice SET ?"

                        connection.query(invoice_query,invoice_data, function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }else{
                                invoice_number = results.insertId;
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

    deleteInvoice: (req,res) => {
        let invoice_no = req.body.invoice_no;
        connection.query("select * from invoice where invoice_no = ? ", invoice_no, (invoice_err,invoice_rows) => {
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
                        "is_billed"   :   0
                    }
                    let consignment_update_data = [consignment_update_datas ,invoice_row.cn_no];

                    connection.query("UPDATE consignment SET ? where cn_no = ?",consignment_update_data, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }else{
                            console.log("consignment updated Successfully")
                        }
                    });
                }else{
                    let consignment_query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and ( shipper_code=? or receiver_code = ?) and is_billed = 1 and is_approved = 1;"
                    let consignment_data = [invoice_row.consignment_start_date, invoice_row.consignment_end_date, invoice_row.shipper_code, invoice_row.shipper_code];
            
                    connection.query(consignment_query, consignment_data, (consignment_err,consignment_rows) => {
                        if(consignment_err){
                            console.log(consignment_err);
                        } else if (consignment_rows.length == 0 ){
                            console.log("No consignments found");
                        }else{
                            Object.keys(consignment_rows).forEach(function(key) {
                                var row = consignment_rows[key];
                                if((row.bill_to === 'shipper' && row.shipper_code === invoice_row.shipper_code) || (row.bill_to === 'receiver' && row.receiver_code === invoice_row.shipper_code)){
                     
                                    var consignment_update_datas = {
                                        "is_billed"   :   0
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
                        }
                    });
                }
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, invoice_row.shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        let acc_bal = 0;
                        shipper_details = shipper_rows[0];

                        acc_bal = parseFloat(shipper_details.acc_bal) - parseFloat(invoice_row.inv_total_amount); 

                        let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                        var shipper_acc_update_data = {
                            "acc_bal"   :   acc_bal
                        }
                        let data111 = [shipper_acc_update_data ,invoice_row.shipper_code];

                        connection.query(shipper_acc_update,data111, function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }else{
                                console.log("Shipping updated Successfully")
                            }
                        });
                    }
                });

                let delete_query = "delete from shipper_acc_statements where invoice_no = ? and type ='Invoice';"
                connection.query(delete_query, invoice_no, (errr,rows) => {
                    if(errr){
                       console.log(errr);
                    } else {
                        console.log("Shipping account statement deleted successfully")
                    }
                });

                let delete_query1 = "delete from invoice where invoice_no = ?;"
                connection.query(delete_query1, invoice_no, (errr,rows) => {
                    if(errr){
                       console.log(errr);
                    } else {
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
        let today = new Date();
        let amount_paid = req.body.amount_paid;
        let payment_method = req.body.payment_method;
        let total_amount = req.body.total_amount;
        let shipper_code = req.body.shipper_code;
        let acc_bal = 0, amt = 0;
        console.log("record pay,emnt");

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
                        "paid_on"           :   req.body.paid_on,
                        "status"            :   "Paid"
                    }
                }else{
                    var invoice_data = {
                        "amount_paid"       :   parseFloat(invoice_rows[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   req.body.paid_on,
                        "status"            :   "Partially Paid"
                    }
                }
            
                let query = "UPDATE invoice SET ? where invoice_no = ?";
                let data1 = [invoice_data ,invoice_no];

                connection.query(query,data1, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }else{
                        
                        let shipper_query = "select * from shipping where shipper_code = ?"
                        connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                            if(err){
                                console.log(err);
                            }else{
                                acc_bal = parseFloat(shipper_rows[0].acc_bal) - parseFloat(amount_paid); 
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
                        // inserting transaction details 

                        var o_acc_data = {
                            "type"         : "Income",
                            "description"  :  "Payment for invoice " + invoice_no,
                            "amount"       :  amount_paid,
                            "account"      :  req.body.account,
                            "created_on"   :  today 
                        }
                        let o_acc_state_query = "INSERT INTO account_statements SET ?"
                        connection.query(o_acc_state_query, o_acc_data, function (lgerr, lgres, fields) {
                            if (lgerr) {
                                console.log(lgerr)
                            }else{
                                console.log("Shippin account statement  added successfully");
                            }
                        });


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
                            }
                        });

                        res.json({
                            status:true,
                            message:'Invoice Updated sucessfully'
                        })
                    }
                });
            }
        });
    },

    consignmentPreviewInvoice: (req,res) =>{
        let total_amount = 0, sub_amount = 0, tax_amount = 0, shipper_details;
        let query = "SELECT * FROM consignment where cn_no = ? and is_billed = 0 and is_approved = 1;"
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

    consignmentGenerateInvoice: (req,res) =>{
        let today = new Date();
        let total_amount = 0, sub_amount = 0, tax_amount = 0, shipper_details, shipper_acc_details, acc_bal = 0;
        let payment_due =req.body.payment_due;
        let invoice_number, code ;

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
                            // "invoice_no"        : invoice_number,
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
                            "cn_no" : req.body.cn_no
                        };

                        let invoice_query = "INSERT INTO invoice SET ?"

                        connection.query(invoice_query,invoice_data, function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }else{
                                invoice_number = results.insertId;
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