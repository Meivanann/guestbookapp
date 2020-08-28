var connection = require('../../../config');
let commonFunction=require('../../commonFunction');
var _=require('lodash')
module.exports = {
    getAccountStatement: async(req,res) => {
        let shipper_code = req.body.shipper_code;
        let type = req.body.type;
        let creditQuery="select * from credit_note where shipper_code ='"+shipper_code+"' and status != 'Paid'"
            let creditdata=await commonFunction.getQueryResults(creditQuery)

            let debitQuery="select * from debit_note where shipper_code ='"+shipper_code+"' and status != 'Paid'";
            let debitdata=await commonFunction.getQueryResults(debitQuery)
        console.log(type);
        if( type === 'A'){
            let outstanding_invoice_query = "SELECT * FROM invoice where shipper_code=? and status != 'Paid';"
            connection.query(outstanding_invoice_query, shipper_code,  (err,rows) => {
                if(err){
                    res.json({
                        status:false,
                        message: 'there are some error with query'
                    })
                } else if (rows.length == 0 ){
                    res.json({
                        status: -1,
                        message:' No results found'
                    })
                } else {
                    let shipper_query = "select * from shipping where shipper_code = ?"
                    connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                        if(err){
                            console.log(err);
                        }else{
                            shipper_details = shipper_rows[0];
                            
                            
                            var invoicedue=_.sumBy(rows, function (day) {

                                return day.inv_total_amount - day.amount_paid;
                
                            })
                            var creditdue=_.sumBy(creditdata, function (day) {

                                return day.amount - day.amount_paid;
                
                            })
                          
                            var debitdue=_.sumBy(debitdata, function (day) {

                                return day.amount - day.amount_paid;
                
                            })

                            var totaldue=(invoicedue-creditdue+debitdue)
                            res.json({
                                status:true,
                                data: rows,
                                shipper: shipper_details,
                                totaldue,
                                creditdata,
                                debitdata
                            })
                        }
                    });
                }
            })
        }else{
            console.log(req.body);
            let opening_bal = 0, closing_bal = 0;
            let outstanding_invoice_query = "SELECT * FROM shipper_acc_statements where shipper_code=? and created_on < ?;"
            let data = [ shipper_code, req.body.start_date ];
            connection.query(outstanding_invoice_query, data,  (err,rows) => {
                if(err){
                    res.json({
                        status:false,
                        message: 'there are some error with query'
                    })
                }else{
                    if (rows.length == 0 ){
                        opening_bal = 0;
                    } else {
                        Object.keys(rows).forEach(function(key) {
                            var row = rows[key];
                            if(row.type === 'Invoice'  || row.type === 'Debit'){
                                opening_bal = opening_bal + parseFloat(row.amount);
                            }else{
                                opening_bal = opening_bal - parseFloat(row.amount);
                            }
                        });
                    }

                    let query = "SELECT * FROM shipper_acc_statements where shipper_code=? and ( created_on between ? and ? );" 
                    let data1 = [ shipper_code, req.body.start_date, req.body.end_date ];
                    connection.query(query, data1,  (err,shipping_rows) => {
                        if(err){
                            res.json({
                                status:false,
                                message: 'there are some error with query'
                            })
                        }else{
                            if (shipping_rows.length == 0 ){
                                closing_bal = 0;
                            } else {
                                Object.keys(shipping_rows).forEach(function(key) {
                                    // console.log(row);
                                    var row = shipping_rows[key];
                                    if(row.type === 'Invoice'  || row.type === 'Debit'){
                                        closing_bal = parseFloat(closing_bal) + parseFloat(row.amount);
                                    }else{
                                        closing_bal = parseFloat(closing_bal) - parseFloat(row.amount);
                                    }

                                    console.log(closing_bal);
                                });
                                closing_bal = opening_bal + closing_bal;
                            }
                            let shipper_query = "select * from shipping where shipper_code = ?"
                            connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                                if(err){
                                    console.log(err);
                                }else{
                                    shipper_details = shipper_rows[0];
                                    res.json({
                                        status:true,
                                        data: shipping_rows,
                                        shipper: shipper_details,
                                        opening_bal:opening_bal,
                                        closing_bal: closing_bal,
                                        start_date:req.body.start_date,
                                        end_date:req.body.end_date
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }
    },
}