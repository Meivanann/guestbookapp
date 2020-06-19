var connection = require('../../../config');
const pdfInvoice = require('pdf-invoice');
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
const fs = require('fs')


module.exports = {
    getAllInvoices: (req,res) => {
        console.log(req.params.id);
        let query = "SELECT * FROM invoice;"
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
                let consignment_query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and shipper_code=?;"
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
        let invoice_number = req.body.invoice_number;
        let invoice_date = req.body.invoice_date;

        let query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and shipper_code=? and is_billed = 0;"
        let data = [start_date, end_date, shipper_code];

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
                    sub_amount = sub_amount + parseFloat(row.sub_amount);
                    tax_amount = tax_amount + parseFloat(row.tax_amount);
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
                            consignments: rows,
                            shipper: shipper_details,
                            sub_amount:sub_amount,
                            tax_amount: tax_amount,
                            total_amount: total_amount,
                            payment_due:payment_due,
                            invoice_date:invoice_date,
                            invoice_number:invoice_number
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
        let invoice_number = req.body.invoice_number;
        let invoice_date = req.body.invoice_date;

        let query = "SELECT * FROM consignment where (cn_datetime between ? and ? ) and status = 'Close' and shipper_code=? and is_billed = 0;"
        let data = [start_date, end_date, shipper_code];

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
                });

                total_amount = sub_amount + tax_amount;

                // getting the shipper details
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];

                        acc_bal = parseFloat(shipper_details.acc_bal) + total_amount; 
                           // creating an invoice record
                        var invoice_data = {
                            "invoice_no"        : invoice_number,
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
                                    message:'Invoice generated sucessfully'
                                })
                            }
                        });                
                    }
                });

            }
        })
    },
    recordPayment: (req,res) => {
        let invoice_no = req.body.invoice_no;
        let today = new Date();
        let amount_paid = req.body.amount_paid;
        let payment_method = req.body.payment_method;
        let total_amount = req.body.total_amount;
        let shipper_code = req.body.shipper_code;
        let acc_bal = 0;

        // updating the invoice table and recording the payment

        if(total_amount === amount_paid )
        {
            var invoice_data = {
                "amount_paid"       :   amount_paid,
                // "payment_method"    :   payment_method,
                // "paid_on"           :   today,
                "status"            :   "Paid"
            }
        }else{
            var invoice_data = {
                "amount_paid"       :   amount_paid,
                // "payment_method"    :   payment_method,
                // "paid_on"           :   today,
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

                console.log(results);
                //creating a log
                var log_data = {
                    "status": "user - " + req.params.id + "updated the invoice No. [" + invoice_no + " ] " 
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
}