var connection = require('../../../config');
const pdfInvoice = require('pdf-invoice');
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)

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
                res.json({
                    status: true,
                    data:rows
                })
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

                // getting the shipper details
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];

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

        // updating the invoice table and recording the payment

        if(total_amount === amount_paid )
        {
            var invoice_data = {
                "amount_paid"       :   amount_paid,
                "payment_method"    :   payment_method,
                "paid_on"           :   today,
                "status"            :   "Paid"
            }
        }else{
            var invoice_data = {
                "amount_paid"       :   amount_paid,
                "payment_method"    :   payment_method,
                "paid_on"           :   today,
                "status"            :   "Partially Paid"
            }
        }
       
        let query = "UPDATE invoice SET ? where invoice_no = ?";
        let data1 = [invoice_data ,invoice_no];

        connection.query(query,data1, function (error, results, fields) {
            if (error) {
                console.log(error);
            }else{
                
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