var connection = require('../../../config');
const { parse } = require('handlebars');
let commonFunction=require('../../commonFunction');

module.exports = {
    index: (req,res) => {
        let query = "SELECT * FROM credit_note;"

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

    editCreditNote: async(req,res) => {
        let credit_id = req.body.creditid;
        let shippercode=req.body.shippercode;
        let creditdetails=req.body.credit_details;
        let totalamount=req.body.totalamount;
        let payment_due_date=req.body.payment_due_date
        let acc_bal = 0
        var credit_note_data = {
            "shipper_code"      : shippercode,
            "credit_date"       : today,
            "amount"            : totalamount,
            "status"            : "Unpaid",
            "payment_due_date"  : payment_due_date
        }
        let query = "select * from credit_note as c inner join credit_note_details as cd on cd.credit_note_id=c.id where c.id="+credit_id+"";
        let data=await commonFunction.getQueryResults(query);
 if (data.length > 0) {


    let credit_note_query = "update  credit_note SET  ? where id="+credit_id+""
    connection.query(credit_note_query, credit_note_data, function (crerr, crres, fields) {
        if (crerr) {
            console.log(crerr)
        }else{
           // console.log(crres.insertId);
            //credit_note_id = crres.insertId;
            console.log("Credit note added successfully");

            // adding the rows in credit note details table
            Object.keys(creditdetails).forEach(function(key) {
                var row = data[key];
                console.log(row);
row.shipper_code=shippercode;
row.credit_note_id=credit_note_id
                

            //     let credit_detail_query = "INSERT INTO credit_note_details SET ?"
            //     connection.query(credit_detail_query, credit_detail_data, function (crderr, crdres, fields) {
            //         if (crderr) {
            //             console.log(crderr)
            //         }else{
            //             console.log("Credit note details added successflly");
            //         }
            //     });
             });
             let credits = creditdetails.map((m) => Object.values(m))

            let credit_note_query = "update  credit_note_details SET  amount='?',description='?',credit_note_id ='?',shipper_code='?' where credit_note_id="+credit_id+""
            connection.query(credit_note_query, credits, function (crerr, crres, fields) {
                if (crerr) {
                    console.log(crerr)
                }else{
                    var inv_acc_data = {
                        "shipper_code" : shippercode,
                        "type"         : "Credit",
                        "amount"       :  totalamount,
                        "updated_on"   :  today,
                        "description"  :  "Credit note"
                    }
                    let acc_state_query = "update  shipper_acc_statements SET ? where shipper_code="+shippercode+" and type='Credit'and amount="+amount+" order by  id desc "
                    connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
                        if (lgerr) {
                            console.log(lgerr)
                        }else{
                            console.log(lgres.insertId);
                            console.log(" Update Shipping account statement  added successfully");
                        }
                    });
                
                    // affecting the shipper account ovberall amount
                    let shipper_query = "select * from shipping where shipper_code = ?"
                    connection.query(shipper_query, shippercode, (err,shipper_rows) => {
                        if(err){
                            console.log(err);
                        }else{
                            shipper_details = shipper_rows[0];
                            acc_bal = parseFloat(shipper_details.acc_bal) + parseFloat(total_amount);
                
                            // updating the shipper account
                            let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                            var shipper_acc_update_data = {
                                "acc_bal"   :   acc_bal
                            }
                            let data111 = [shipper_acc_update_data ,shippercode];
                
                            connection.query(shipper_acc_update,data111, function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }else{
                                    console.log("Shipping updated Successfully")
                
                                    res.json({
                                        status:true,
                                        message:'Credit Note generated sucessfully'
                                    })
                                }
                            });
                        }
                    })


            }
        });

            
        }
    });

    
     
 }
        

      
    },

    deleteCreditNote: async(req,res) => {
        let credit_id = req.body.creditid;
        let query = "DELETE credit_note FROM credit_note LEFT JOIN  credit_note_details ON credit_note.id = credit_note_details.credit_note_id  WHERE credit_note.id=" + credit_id + "";
        let data=await commonFunction.getQueryResults(query);
console.log(query)
        res.json({status:1,message:'Delete credit note successfully' })

      
    },
    getCreditNote: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let query = "select * from credit_note where shipper_code = ?;"

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
    
    getCreditNoteDetails: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let credit_note_id = req.params.credit_note_id;
        let query = "select * from credit_note where id = ?;"

        connection.query(query, credit_note_id, (err,rows) => {
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

                // fetching credit note details
                let credit_detail_query = "select * from credit_note_details where credit_note_id = ?"
                connection.query(credit_detail_query, credit_note_id, (err,credit_detail_rows) => {
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
                                    credit_note_details: credit_detail_rows,
                                    credit_note:rows
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
        let acc_bal = 0, credit_note_id;

        console.log(req.body);

        // adding row in credit note table
        var credit_note_data = {
            "shipper_code"      : shipper_code,
            "credit_date"       : today,
            "amount"            : total_amount,
            "status"            : "Unpaid",
            "payment_due_date"  : req.body.payment_due_date
        }
        let credit_note_query = "INSERT INTO credit_note SET ?"
        connection.query(credit_note_query, credit_note_data, function (crerr, crres, fields) {
            if (crerr) {
                console.log(crerr)
            }else{
                console.log(crres.insertId);
                credit_note_id = crres.insertId;
                console.log("Credit note added successfully");

                // adding the rows in credit note details table
                Object.keys(data).forEach(function(key) {
                    var row = data[key];
                    console.log(row);

                    var credit_detail_data = {
                        "credit_note_id"    :   credit_note_id,
                        "shipper_code"      :   shipper_code,
                        "amount"            :   row.amount,
                        "description"       :   row.description
                    }

                    let credit_detail_query = "INSERT INTO credit_note_details SET ?"
                    connection.query(credit_detail_query, credit_detail_data, function (crderr, crdres, fields) {
                        if (crderr) {
                            console.log(crderr)
                        }else{
                            console.log("Credit note details added successflly");
                        }
                    });
                });

                
            }
        });

         // inserting  Account of Statements
         var inv_acc_data = {
            "shipper_code" : shipper_code,
            "type"         : "Credit",
            "amount"       :  total_amount,
            "created_on"   :  today,
            "description"  :  "Credit note"
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
                acc_bal = parseFloat(shipper_details.acc_bal) + parseFloat(total_amount);

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
                            message:'Credit Note generated sucessfully'
                        })
                    }
                });
            }
        })

    },

    recordPayment: (req,res) => {
        let today = new Date();
        let credit_note_id = req.body.id;
        let amount_paid = req.body.amount_paid;
        let payment_method = req.body.payment_method;
        let total_amount = req.body.total_amount;
        let shipper_code = req.body.shipper_code;
        let acc_bal =0, amt = 0;

        // Fetching and updating the credit note table
        connection.query("select * from credit_note where id = ?",credit_note_id, function (error, results, fields) {
            if (error) {
                console.log(error);
            }else{
                amt =  parseFloat(results[0].amount) -  parseFloat(results[0].amount_paid);
                if(amt === parseFloat(amount_paid) )
                {
                    var credit_note_data = {
                        "amount_paid"       :   parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   today,
                        "status"            :   "Paid"
                    }
                }else{
                    var credit_note_data = {
                        "amount_paid"       :   parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   today,
                        "status"            :   "Partially Paid"
                    }
                }

                let query = "UPDATE credit_note SET ? where id = ?";
                let data1 = [credit_note_data ,credit_note_id];

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
                    }
                });

                  // inserting  Account of Statements
                  var inv_acc_data = {
                    "shipper_code" : shipper_code,
                    "type"         : "Payment",
                    "invoice_no"   :  credit_note_id,
                    "description"  :  "Payment for Credit note  " + credit_note_id,
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
                    "description"  :  "Payment for credit note " + credit_note_id,
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
                    "user_id"   : req.params.id,
                    "status": " has recorded th payment for crednit Note number " + credit_note_id 
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
                    message:'Credit Note Updated sucessfully'
                })
            }
        });
    }

}