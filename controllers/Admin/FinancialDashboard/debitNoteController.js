var connection = require('../../../config');
const { parse } = require('handlebars');


module.exports = {
    index: (req,res) => {
        let query = "SELECT * FROM debit_note;"

        connection.query(query, (err,rows) => {
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

                console.log(rows);
                res.json({
                    status: 1,
                    data:rows
                })
            }
        })
    },

    getDebitNote: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let query = "select * from debit_note where shipper_code = ?;"

        connection.query(query, shipper_code, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];
                        res.json({
                            status: -1,
                            message:' No results found',
                            shipper: shipper_details,
                        })
                    }
                });
             
            } else {
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];
                        res.json({
                            status:true,
                            data: rows,
                            shipper: shipper_details,
                        })
                    }
                });
            }
        })
    },
    
    getDebitNoteDetails: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let debit_note_id = req.params.debit_note_id;
        let query = "select * from debit_note where id = ?;"

        connection.query(query, debit_note_id, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];
                        res.json({
                            status: -1,
                            message:' No results found',
                            shipper: shipper_details,
                        })
                    }
                });
             
            } else {

                // fetching debit note details
                let debit_detail_query = "select * from debit_note_details where debit_note_id = ?"
                connection.query(debit_detail_query, debit_note_id, (err,debit_detail_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                       // fetching the shipper details
                        let shipper_query = "select * from shipping where shipper_code = ?"
                        connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                            if(err){
                                console.log(err);
                            }else{
                                shipper_details = shipper_rows[0];
                                res.json({
                                    status:true,
                                    shipper: shipper_details,
                                    debit_note_details: debit_detail_rows,
                                    debit_note:rows
                                })
                            }
                        });
                    }
                });

                
            }
        })
    },
    store: (req,res) => {
        var today = new Date();
        let shipper_code = req.body.shipper_code;
        let total_amount = req.body.amount;
        let data = JSON.parse(req.body.items);
        let acc_bal = 0, debit_note_id;

        console.log(req.body);

        // adding row in debit note table
        var debit_note_data = {
            "shipper_code"      : shipper_code,
            "debit_date"       : today,
            "amount"            : total_amount,
            "status"            : "Unpaid",
            "payment_due_date"  : req.body.payment_due_date
        }
        let debit_note_query = "INSERT INTO debit_note SET ?"
        connection.query(debit_note_query, debit_note_data, function (crerr, crres, fields) {
            if (crerr) {
                console.log(crerr)
            }else{
                console.log(crres.insertId);
                debit_note_id = crres.insertId;
                console.log("debit note added successfully");

                // adding the rows in debit note details table
                Object.keys(data).forEach(function(key) {
                    var row = data[key];
                    console.log(row);

                    var debit_detail_data = {
                        "debit_note_id"    :   debit_note_id,
                        "shipper_code"      :   shipper_code,
                        "amount"            :   row.amount,
                        "description"       :   row.description
                    }

                    let debit_detail_query = "INSERT INTO debit_note_details SET ?"
                    connection.query(debit_detail_query, debit_detail_data, function (crderr, crdres, fields) {
                        if (crderr) {
                            console.log(crderr)
                        }else{
                            console.log("Debit note details added successflly");
                        }
                    });
                });

                
            }
        });

         // inserting  Account of Statements
         var inv_acc_data = {
            "shipper_code" : shipper_code,
            "type"         : "Debit",
            "amount"       :  total_amount,
            "created_on"   :  today,
            "description"  :  "Debit note"
        }
        let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
        connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
            if (lgerr) {
                console.log(lgerr)
            }else{
                console.log(lgres.insertId);
                console.log("Shippin account statement  added successfully");
            }
        });

        // affecting the shipper account ovberall amount
        let shipper_query = "select * from shipping where shipper_code = ?"
        connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
            if(err){
                console.log(err);
            }else{
                shipper_details = shipper_rows[0];
                acc_bal = parseFloat(shipper_details.acc_bal) - parseFloat(total_amount); 

                // updating the shipper account
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

                        res.json({
                            status:true,
                            message:'debit Note generated sucessfully'
                        })
                    }
                });
            }
        })

    },

    recordPayment: (req,res) => {
        let today = new Date();
        let debit_note_id = req.body.id;
        let amount_paid = req.body.amount_paid;
        let payment_method = req.body.payment_method;
        let total_amount = req.body.total_amount;
        let shipper_code = req.body.shipper_code;
        let acc_bal =0, amt = 0;

        // Fetching and updating the debit note table
        connection.query("select * from debit_note where id = ?",debit_note_id, function (error, results, fields) {
            if (error) {
                console.log(error);
            }else{
                amt =  parseFloat(results[0].amount) -  parseFloat(results[0].amount_paid);
                if(amt === parseFloat(amount_paid))
                {
                    var debit_note_data = {
                        "amount_paid"       :   parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   today,
                        "status"            :   "Paid"
                    }
                }else{
                    var debit_note_data = {
                        "amount_paid"       :   parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   today,
                        "status"            :   "Partially Paid"
                    }
                }

                let query = "UPDATE debit_note SET ? where id = ?";
                let data1 = [debit_note_data ,debit_note_id];

                connection.query(query,data1, function (uperr, upress, fields) {
                    if (uperr) {
                        console.log(uperr);
                    }else{

                        // updating the shipper account
                        let shipper_query = "select * from shipping where shipper_code = ?"
                        connection.query(shipper_query, shipper_code, (shipper_err,shipper_rows) => {
                            if(shipper_err){
                                console.log(shipper_err);
                            }else{
                                acc_bal = parseFloat(shipper_rows[0].acc_bal) + parseFloat(amount_paid); 
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
                    }
                });

                  // inserting  Account of Statements
                  var inv_acc_data = {
                    "shipper_code" : shipper_code,
                    "type"         : "Payment",
                    "invoice_no"   :  debit_note_id,
                    "description"  :  "Payment for Debit note  " + debit_note_id,
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

                
                var o_acc_data = {
                    "type"         : "Income",
                    "description"  :  "Payment for debit note " + debit_note_id,
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
                    "status": "user - " + req.params.id + "updated the debit No. [" + debit_note_id + " ] " 
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
                    message:'Debit Note Updated sucessfully'
                })
            }
        });
    }

}