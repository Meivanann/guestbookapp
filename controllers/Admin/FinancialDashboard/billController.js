var connection = require('../../../config');

const commonFunction = require('../../commonFunction');
var _=require('lodash')
//const { async } = require('q');
module.exports = {
    getAllVendors: (req, res) => {
        let query = "SELECT * FROM vendors;"

        connection.query(query, (err, rows) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0) {
                res.json({
                    status: -1,
                    message: ' No results found'
                })
            } else {
                res.json({
                    status: 1,
                    data: rows
                })
            }
        })
    },

    postNewVendor: (req, res) => {
        //inserting the record in shipping table
        var vendor_data = {
            'name': req.body.name,
            'contact': req.body.contact,
            'address1': req.body.address1,
            'city': req.body.city,
            'state': req.body.state,
            'country': req.body.country,
            'postcode': req.body.postcode,
            'telephone': req.body.telephone,
            'mobile': req.body.mobile,
            'fax': req.body.fax,
            'email': req.body.email,
            // 'credit_limit'    :  req.body.credit_limit,
            // 'term_day'        :  req.body.term_day,
            // 'invoice_format'  :  req.body.invoice_format,
            'deleted_by': ''
        }

        connection.query('INSERT INTO vendors SET ?', vendor_data, (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Vendor record added sucessfully");
                res.json({
                    status: true,
                    message: 'Vednor Added Successfully'
                })
            }
        })
    },

    updateVendor: (req, res) => {
        let today = new Date();
        var vendor_data = {
            'name': req.body.name,
            'contact': req.body.contact,
            'address1': req.body.address1,
            'city': req.body.city,
            'state': req.body.state,
            'country': req.body.country,
            'postcode': req.body.postcode,
            'telephone': req.body.telephone,
            'mobile': req.body.mobile,
            'fax': req.body.fax,
            'email': req.body.email,
            // 'credit_limit'    :  req.body.credit_limit,
            // 'term_day'        :  req.body.term_day,
            // 'invoice_format'  :  req.body.invoice_format,
            'deleted_by': '',
            'changed_on': today,
            'changed_by': req.params.id
        }

        let query = "UPDATE vendors SET ? where id = ?"

        let data = [vendor_data, req.body.id];
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
            } else {
                console.log("Vendor record updated sucessfully");
                res.json({
                    status: true,
                    message: 'Vednor updated Successfully'
                })
            }
        });
    },

    destroyVendor: (req, res) => {
        let query = "delete from vendors where id = ?";

        connection.query(query, req.params.vendor_id, (err, rows) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'there are some errors with query'
                })
            } else {
                res.json({
                    status: 1,
                    message: 'Vendor Deleted Successfully'
                })
            }
        })

    },

    getAllBills: (req, res) => {
        let query = "select v.name, b.* from vendors v, bill b where b.vendor_id = v.id and b.isdelete=0"

        connection.query(query, (err, rows) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0) {
                res.json({
                    status: -1,
                    message: ' No results found'
                })
            } else {

                console.log(rows);
                res.json({
                    status: 1,
                    data: rows
                })
            }
        })
    },

    getBill: (req, res) => {
        let vendor_id = req.params.vendor_id;
        let query = "select v.name, b.* from vendors v, bill b where b.vendor_id = ? and b.vendor_id = v.id and b.isdelete=0"

        connection.query(query, vendor_id, (err, rows) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0) {
                let vendor_query = "select * from vendors where id = ?"
                connection.query(vendor_query, vendor_id, async(err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({
                            status: -1,
                            message: ' No results found',
                            shipper: results[0],
                        })
                    }
                });

            } else {
                let vendor_query = "select * from vendors where id = ?"
                connection.query(vendor_query, vendor_id, async(err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({
                            status: true,
                            data: rows,
                            shipper: results[0],
                        })
                    }
                });
            }
        })
    },


    deleteBill: async(req, res) => {
        let { bill_id, login_id } = req.body;
        let query = "select  * from users where id=" + login_id + "";
        let deleteQuery = "update  bill as b left join bill_details as bl  on b.id=bl.bill_id set b.isdelete=1,bl.isdelete=1 where  b.id=" + bill_id + ""
        connection.query(query, async(err, rows) => {
            if (err) {
                console.log(err)
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0) {

                res.json({
                    status: 0,
                    message: ' No results found',
                     
                })
            } else {

                connection.query(deleteQuery, async(err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let deleteBillquery="DELETE FROM account_statements  where bill_no='"+bill_id+"'";
                        let deletedata=await commonFunction.getQueryResults(deleteBillquery)
                        res.json({
                            status: 1,
                            data: "delete  bill successfully",

                        })
                    }
                });
            }
        })
    },
    getBillDetails: (req, res) => {
        let vendor_id = req.params.vendor_id;
        let bill_id = req.params.bill_id;
        let query = "select * from bill as b where b.id = ? and b.isdelete=0"

        connection.query(query, bill_id, (err, rows) => {
            if (err) {
                console.log(err)
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0) {
                let vendor_query = "select * from vendors where id = ?"
                connection.query(vendor_query, vendor_id, (err, vendor_rows) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({
                            status: -1,
                            message: ' No results found',
                            vendor: vendor_rows[0],
                        })
                    }
                });

            } else {

                // fetching credit note details
                let bill_detail_query = "select * from bill_details as b where b.bill_id = ? and b.isdelete=0"
                connection.query(bill_detail_query, bill_id, (err, bill_detail_rows) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // fetching the shipper details
                        let vendor_query = "select * from vendors where id = ?"
                        connection.query(vendor_query, vendor_id, (err, vendor_rows) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json({
                                    status: true,
                                    vendor: vendor_rows[0],
                                    bill_details: bill_detail_rows,
                                    bill: rows
                                })
                            }
                        });
                    }
                });


            }
        })
    },

    createBill: (req, res) => {
        var today = new Date();
        let vendor_id = req.body.vendor_id;
        let bill_date=req.body.bill_date;
        let total_amount = req.body.amount;
        let data = JSON.parse(req.body.items);
        let acc_bal = 0, bill_id;

        console.log('sss',data);

        // adding row in credit note table
        var billdata = {
            "vendor_id": vendor_id,
            "bill_date": bill_date,
            "amount": total_amount,
            "status": "Unpaid",
            "payment_due_date": req.body.payment_due_date,
            debit:0,
            credit:total_amount
        }
        let bill_query = "INSERT INTO bill SET ?"
        connection.query(bill_query, billdata, function (billerr, billres, fields) {
            if (billerr) {
                console.log(billerr)
            } else {
                console.log(billres.insertId);
                bill_id = billres.insertId;
                console.log("Bill  added successfully");
let newobject={ }
                // adding the rows in credit note details table
                Object.keys(data).forEach(function (key) {
                    var row = data[key];
                    console.log(row);

                    var bill_detail_data = {
                        "bill_id": bill_id,
                        "item_name": row.name,
                        "expense_category": row.expense_category,
                        "description": row.description,
                        "oty": row.qty,
                        "price": row.price,
                        "total_amount": row.total_amount,
                        debit:total_amount,
                        credit:0
                    }

                    
                    let bill_detail_query = "INSERT INTO bill_details SET ?"
                    connection.query(bill_detail_query, bill_detail_data, function (billderr, billdres, fields) {
                        if (billderr) {
                            console.log(billderr)
                        } else {
                            console.log("Bill details added successflly");
                            
                           newobject={
                            type:'Expense',
                            account:row.expense_category,
                            amount:row.total_amount,
                            description:'bill details from create bill',
                            debit:row.total_amount,
                            credit:0,
                            bill_no:bill_id,
                            types:'Bill details',
                            created_on:bill_date,
                            from_id:3,
                            bill_detail_id:billdres.insertId
                            
                        }
                            let account_statementsquery="insert  into account_statements set ? ";
                            connection.query(account_statementsquery, newobject, function (err, data) {
                            console.log(err)

                            })
                        }
                    });
                });


            }
        });

        // affecting the shipper account ovberall amount
        let vendor_query = "select * from vendors where id = ?"
        connection.query(vendor_query, vendor_id, (err, vendor_rows) => {
            if (err) {
                console.log(err);
            } else {
                vendor_details = vendor_rows[0];
                acc_bal = parseFloat(vendor_details.acc_bal) + parseFloat(total_amount);

                // updating the shipper account
                let vendor_acc_update = "UPDATE vendors SET ? where id = ?";
                var vendor_acc_update_data = {
                    "acc_bal": acc_bal
                }
                let data111 = [vendor_acc_update_data, vendor_id];

                connection.query(vendor_acc_update, data111, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Vendor data updated Successfully")

                        // let newarray=[]

                        // data.forEach(element => {
                        //     newarray.push({
                        //         type:'Expense',
                        //         account:element.expense_category,
                        //         amount:element.total_amount,
                        //         description:'bill details from create bill',
                        //         debit:total_amount,
                        //         credit:0,
                        //         bill_no:bill_id,
                        //         types:'Bill details',
                        //         created_on:bill_date,
                        //         from_id:3
                        //     })
                        // });

                       //var Expenseobject={type:'Expense',account:20,amount:total_amount,description:'invoice from create invoice',debit:0,credit:total_amount,invoice_number:invoice_number,types:'Invoice'}
                        var accountpayable={type:'Expense',account:21,amount:total_amount,description:'bill from create bill',debit:0,credit:total_amount,bill_no:bill_id,types:'Bill',created_on:bill_date,from_id:2}
                        var array=[accountpayable]
                        let accountdetailsbill = array.map((m) => Object.values(m))
                        let acc_query = "INSERT INTO account_statements(type,account,amount,description,debit,credit,bill_no,types,created_on,from_id) values ? "
                        connection.query(acc_query, [accountdetailsbill], function (err, data) {
                            if (err) {
                                console.log(err)
                            }else{
                                console.log("account statement  added successfully");
                            }
                        });

                        res.json({
                            status: true,
                            message: 'Bill generated sucessfully'
                        })
                    }
                });
            }
        })

    },
    //24AUGBACKUP
    // createBill: (req, res) => {
    //     var today = new Date();
    //     let vendor_id = req.body.vendor_id;
    //     let bill_date=req.body.bill_date;
    //     let total_amount = req.body.amount;
    //     let data = JSON.parse(req.body.items);
    //     let acc_bal = 0, bill_id;

    //     console.log('sss',data);

    //     // adding row in credit note table
    //     var billdata = {
    //         "vendor_id": vendor_id,
    //         "bill_date": bill_date,
    //         "amount": total_amount,
    //         "status": "Unpaid",
    //         "payment_due_date": req.body.payment_due_date,
    //         debit:0,
    //         credit:total_amount
    //     }
    //     let bill_query = "INSERT INTO bill SET ?"
    //     connection.query(bill_query, billdata, function (billerr, billres, fields) {
    //         if (billerr) {
    //             console.log(billerr)
    //         } else {
    //             console.log(billres.insertId);
    //             bill_id = billres.insertId;
    //             console.log("Bill  added successfully");

    //             // adding the rows in credit note details table
    //             Object.keys(data).forEach(function (key) {
    //                 var row = data[key];
    //                 console.log(row);

    //                 var bill_detail_data = {
    //                     "bill_id": bill_id,
    //                     "item_name": row.name,
    //                     "expense_category": row.expense_category,
    //                     "description": row.description,
    //                     "oty": row.qty,
    //                     "price": row.price,
    //                     "total_amount": row.total_amount,
    //                     debit:total_amount,
    //                     credit:0
    //                 }

    //                 let bill_detail_query = "INSERT INTO bill_details SET ?"
    //                 connection.query(bill_detail_query, bill_detail_data, function (billderr, billdres, fields) {
    //                     if (billderr) {
    //                         console.log(billderr)
    //                     } else {
    //                         console.log("Bill details added successflly");
    //                     }
    //                 });
    //             });


    //         }
    //     });

    //     // affecting the shipper account ovberall amount
    //     let vendor_query = "select * from vendors where id = ?"
    //     connection.query(vendor_query, vendor_id, (err, vendor_rows) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             vendor_details = vendor_rows[0];
    //             acc_bal = parseFloat(vendor_details.acc_bal) + parseFloat(total_amount);

    //             // updating the shipper account
    //             let vendor_acc_update = "UPDATE vendors SET ? where id = ?";
    //             var vendor_acc_update_data = {
    //                 "acc_bal": acc_bal
    //             }
    //             let data111 = [vendor_acc_update_data, vendor_id];

    //             connection.query(vendor_acc_update, data111, function (error, results, fields) {
    //                 if (error) {
    //                     console.log(error);
    //                 } else {
    //                     console.log("Vendor data updated Successfully")

    //                     let newarray=[]

    //                     data.forEach(element => {
    //                         newarray.push({
    //                             type:'Expense',
    //                             account:element.expense_category,
    //                             amount:element.total_amount,
    //                             description:'bill details from create bill',
    //                             debit:total_amount,
    //                             credit:0,
    //                             bill_no:bill_id,
    //                             types:'Bill details',
    //                             created_on:bill_date,
    //                             from_id:3
    //                         })
    //                     });

    //                    //var Expenseobject={type:'Expense',account:20,amount:total_amount,description:'invoice from create invoice',debit:0,credit:total_amount,invoice_number:invoice_number,types:'Invoice'}
    //                     var accountpayable={type:'Expense',account:21,amount:total_amount,description:'bill from create bill',debit:0,credit:total_amount,bill_no:bill_id,types:'Bill',created_on:bill_date,from_id:2}
    //                     var array=[accountpayable,...newarray]
    //                     let accountdetailsbill = array.map((m) => Object.values(m))
    //                     let acc_query = "INSERT INTO account_statements(type,account,amount,description,debit,credit,bill_no,types,created_on,from_id) values ? "
    //                     connection.query(acc_query, [accountdetailsbill], function (err, data) {
    //                         if (err) {
    //                             console.log(err)
    //                         }else{
    //                             console.log("account statement  added successfully");
    //                         }
    //                     });

    //                     res.json({
    //                         status: true,
    //                         message: 'Bill generated sucessfully'
    //                     })
    //                 }
    //             });
    //         }
    //     })

    // },
    editBill: async(req, res) => {
        var today = new Date();
        let billid = req.body.billid;
        let bill_date=req.body.bill_date;
        let total_amount = req.body.amount;
        let data = req.body.items;
        let acc_bal = 0, bill_id;
        let deleteid=req.body.deleteids
        let newbills=_.filter(data, function(e){ 
            if(e.id==0)
            {
                return e
            }
         });

         let updatebills=_.filter(data, function(e){ 
            if(e.id!=0)
            {
                return e
            }
         });


        var selectQuery="select * from bill where id="+billid+""
         var selectdata=await commonFunction.getQueryResults(selectQuery);
        console.log('sss',data);

        let vendor_id=selectdata[0].vendor_id;
        // adding row in credit note table
        var billdata = {
             
            "bill_date": bill_date,
            "amount": total_amount,
            "status": "Unpaid",
            "payment_due_date": req.body.payment_due_date,
            debit:0,
            credit:total_amount
        }
        let bill_query = "update bill SET ? where id="+billid+""
        connection.query(bill_query, billdata, function (billerr, billres, fields) {
            if (billerr) {
                console.log(billerr)
            } else {
                console.log(billres.insertId);
                 
                console.log("Bill  added successfully");

                // adding billsdetails
                if(newbills.length > 0 )
                {

                    let newobject={ }
                    // adding the rows in credit note details table
                    Object.keys(newbills).forEach(function (key) {
                        var row = data[key];
                        console.log(row);
    
                        var bill_detail_data = {
                            "bill_id": billid,
                            "item_name": row.item_name,
                            "expense_category": row.expense_category,
                            "description": row.description,
                            "oty": row.oty,
                            "price": row.price,
                            "total_amount": row.total_amount,
                            debit:row.total_amount,
                            credit:0
                        }
    
                        
                        let bill_detail_query = "INSERT INTO bill_details SET ?"
                        connection.query(bill_detail_query, bill_detail_data, function (billderr, billdres, fields) {
                            if (billderr) {
                                console.log(billderr)
                            } else {
                                console.log("Bill details added successflly");
                                
                               newobject={
                                type:'Expense',
                                account:row.expense_category,
                                amount:row.total_amount,
                                description:'bill details from create bill',
                                debit:row.total_amount,
                                credit:0,
                                bill_no:billid,
                                types:'Bill details',
                                created_on:bill_date,
                                from_id:3,
                                bill_detail_id:billdres.insertId
                                
                            }
                                let account_statementsquery="insert  into account_statements set ? ";
                                connection.query(account_statementsquery, newobject, function (err, data) {
                                console.log(err)
    
                                })
                            }
                        });
                    });
                }
                //updating bills details
                if(updatebills.length > 0 )
                {

                    let newobject={ }
                    // adding the rows in credit note details table
                    Object.keys(updatebills).forEach(function (key) {
                        var row = data[key];
                        console.log(row);
    
                        var bill_detail_data = {
                            "bill_id": billid,
                            "item_name": row.item_name,
                            "expense_category": row.expense_category,
                            "description": row.description,
                            "oty": row.oty,
                            "price": row.price,
                            "total_amount": row.total_amount,
                            debit:row.total_amount,
                            credit:0
                        }
    
                        
                        let bill_detail_query = "update  bill_details SET ? where id="+row.id+""
                        connection.query(bill_detail_query, bill_detail_data, function (billderr, billdres, fields) {
                            if (billderr) {
                                console.log(billderr)
                            } else {
                                console.log("Bill details updated successflly");
                                
                               newobject={
                                type:'Expense',
                                account:row.expense_category,
                                amount:row.total_amount,
                                description:'bill details from create bill',
                                debit:row.total_amount,
                                credit:0,
                                bill_no:billid,
                                types:'Bill details',
                                created_on:bill_date,
                                from_id:3,
                                bill_detail_id:row.id
                                
                            }
                                let account_statementsquery="update  account_statements set ?  where bill_detail_id="+row.id+"";
                                connection.query(account_statementsquery, newobject, function (err, data) {
                                console.log(err)
    
                                })
                            }
                        });
                    });
                }



            }
        });

        if (req.body.deleteids.length >0) {
        
            var deletebilldetails="update bill_details as bd set isdelete=1 where id in ("+deleteid+")";
            var deletebilldata=await commonFunction.getQueryResults(deletebilldetails);
            var deleteaccountstatment="delete from account_statements  where bill_detail_id in ("+deleteid+")";
            var deleteaccountstatmentdata=await commonFunction.getQueryResults(deleteaccountstatment);
        }

        // affecting the shipper account ovberall amount
        let vendor_query = "select * from vendors where id = ?"
        connection.query(vendor_query, vendor_id, (err, vendor_rows) => {
            if (err) {
                console.log(err);
            } else {
                vendor_details = vendor_rows[0];
                acc_bal = parseFloat(vendor_details.acc_bal) + parseFloat(total_amount);

                // updating the shipper account
                let vendor_acc_update = "UPDATE vendors SET ? where id = ?";
                var vendor_acc_update_data = {
                    "acc_bal": acc_bal
                }
                let data111 = [vendor_acc_update_data, vendor_id];

                connection.query(vendor_acc_update, data111, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Vendor data updated Successfully")

                        // let newarray=[]

                        // data.forEach(element => {
                        //     newarray.push({
                        //         type:'Expense',
                        //         account:element.expense_category,
                        //         amount:element.total_amount,
                        //         description:'bill details from create bill',
                        //         debit:total_amount,
                        //         credit:0,
                        //         bill_no:bill_id,
                        //         types:'Bill details',
                        //         created_on:bill_date,
                        //         from_id:3
                        //     })
                        // });

                       //var Expenseobject={type:'Expense',account:20,amount:total_amount,description:'invoice from create invoice',debit:0,credit:total_amount,invoice_number:invoice_number,types:'Invoice'}
                        var accountpayable={type:'Expense',account:21,amount:total_amount,description:'bill from create bill',debit:0,credit:total_amount,bill_no:bill_id,types:'Bill',created_on:bill_date,from_id:2}
                        var array=[accountpayable]
                        let accountdetailsbill = array.map((m) => Object.values(m))
                        let acc_query = "update  account_statements set ?  where id="+billid+""
                        connection.query(acc_query, accountpayable, function (err, data) {
                            if (err) {
                                console.log(err)
                            }else{
                                console.log("account statement  added successfully");
                            }
                        });

                        res.json({
                            status: 1,
                            message: 'update bill sucessfully'
                        })
                    }
                });
            }
        })

    },

    recordPayment: (req, res) => {
        console.log(req.body);
        let today = new Date();
        let bill_id = req.body.id;
        let amount_paid = req.body.amount_paid;
        let account=req.body.account;
        let payment_method = req.body.payment_method;
        let total_amount = req.body.total_amount;
        let vendor_id = req.body.vendor_id;
        let acc_bal = 0, amt = 0;
        let paymentObject = {

            'payment_type': payment_method,
            'account': account,
            'amount': amount_paid,
            'type': 2,      //bill
            'debit': 0,
            'credit': amount_paid,
            'bill_id': bill_id,
            paymentdate:today
        }
        var accountobject={payment_type:payment_method,account:21,amount:amount_paid,type:2,debit:amount_paid,credit:0,'bill_id': bill_id,paymentdate:today}



        let payment=[]
    payment.push(paymentObject,accountobject)
        // Fetching and updating the credit note table
        connection.query("select * from bill where id = ?", bill_id, function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                amt = parseFloat(results[0].amount) - parseFloat(results[0].amount_paid);
                if (amt === parseFloat(amount_paid)) {
                    var bill_data = {
                        "amount_paid": parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method": payment_method,
                        "paid_on": today,
                        "status": "Paid"
                    }
                } else {
                    var bill_data = {
                        "amount_paid": parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method": payment_method,
                        "paid_on": today,
                        "status": "Partially Paid"
                    }
                }

                let query = "UPDATE bill SET ? where id = ?";
                let data1 = [bill_data, bill_id];

                connection.query(query, data1, function (uperr, upress, fields) {
                    if (uperr) {
                        console.log(uperr);
                    } else {


                        let paymentvalues= payment.map((m) => Object.values(m))
                        var paymentQuery = "insert payments(payment_type,account,amount,type,debit,credit,bill_id,paymentdate)values ? "
                        connection.query(paymentQuery, [paymentvalues], function (err, datas) {
                            if (error) {
                                console.log(error);
                            } else {

                                // updating the vendor account
                                let vendor_query = "select * from vendors where id = ?"
                                connection.query(vendor_query, vendor_id, (vendor_err, vendor_rows) => {
                                    if (vendor_err) {
                                        console.log(vendor_err);
                                    } else {
                                        acc_bal = parseFloat(vendor_rows[0].acc_bal) - parseFloat(amount_paid);
                                        let vendor_acc_update = "UPDATE vendors SET ? where id = ?";
                                        var vendor_acc_update_data = {
                                            "acc_bal": acc_bal
                                        }
                                        let data111 = [vendor_acc_update_data, vendor_id];

                                        connection.query(vendor_acc_update, data111, function (error, results, fields) {
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log("Vendor updated Successfully")
                                            }
                                        });

                                    }
                                });
                                
                                var o_acc_data = {
                                    "type": "Expense",
                                   
                                    "account": account,
                                    "amount": amount_paid,
                                    "description": "Payment for bil " + bill_id,
                                    "debit": 0,
                                    "credit": req.body.amount_paid,
                                   
                                    
                                    bill_no:bill_id,
                                    types:'Bill payment',
                                    "created_on": today,
                                    ispayment:1,
                                    from_id:5,
                                    payment_method:payment_method

                                }

                                // for account of  payment amount come under credit form bill but account payable account amount come under the debit for bill payment
                                var accountpayable={type:'Expense',account:21,amount:amount_paid,description:'bill from bill payment',debit:amount_paid,credit:0,bill_no:bill_id,types:'Bill payment',created_on:today,ispayment:1,from_id:5,payment_method:payment_method}
                        var array=[accountpayable,o_acc_data]
                        let accountdetailsbill = array.map((m) => Object.values(m))
                        let acc_query = "INSERT INTO account_statements(type,account,amount,description,debit,credit,bill_no,types,created_on,ispayment,from_id,payment_method) values ? "
                        connection.query(acc_query, [accountdetailsbill], function (err, data) {
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
                                //     } else {
                                //         console.log(" account statement  added successfully");
                                //     }
                                // });


                                console.log(results);
                                //creating a log
                                var log_data = {
                                    "status": " has recorded the payment for bill no " + bill_id,
                                    "user_id": req.params.id
                                }
                                connection.query('INSERT INTO log SET ?', log_data, function (lgerr, lgres, fields) {
                                    if (lgerr) {
                                        console.log(lgerr)
                                    } else {
                                        console.log("log added successfully");
                                        res.json({
                                            status: true,
                                            message: 'bill Updated sucessfully'
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }
        });
    },

    //14augbackup
    // createBill: (req, res) => {
    //     var today = new Date();
    //     let vendor_id = req.body.vendor_id;
    //     let total_amount = req.body.amount;
    //     let data = JSON.parse(req.body.items);
    //     let acc_bal = 0, bill_id;

    //     console.log(req.body);

    //     // adding row in credit note table
    //     var billdata = {
    //         "vendor_id": vendor_id,
    //         "bill_date": today,
    //         "amount": total_amount,
    //         "status": "Unpaid",
    //         "payment_due_date": req.body.payment_due_date
    //     }
    //     let bill_query = "INSERT INTO bill SET ?"
    //     connection.query(bill_query, billdata, function (billerr, billres, fields) {
    //         if (billerr) {
    //             console.log(billerr)
    //         } else {
    //             console.log(billres.insertId);
    //             bill_id = billres.insertId;
    //             console.log("Bill  added successfully");

    //             // adding the rows in credit note details table
    //             Object.keys(data).forEach(function (key) {
    //                 var row = data[key];
    //                 console.log(row);

    //                 var bill_detail_data = {
    //                     "bill_id": bill_id,
    //                     "item_name": row.name,
    //                     "expense_category": row.expense_category,
    //                     "description": row.description,
    //                     "oty": row.qty,
    //                     "price": row.price,
    //                     "total_amount": row.total_amount
    //                 }

    //                 let bill_detail_query = "INSERT INTO bill_details SET ?"
    //                 connection.query(bill_detail_query, bill_detail_data, function (billderr, billdres, fields) {
    //                     if (billderr) {
    //                         console.log(billderr)
    //                     } else {
    //                         console.log("Bill details added successflly");
    //                     }
    //                 });
    //             });


    //         }
    //     });

    //     // affecting the shipper account ovberall amount
    //     let vendor_query = "select * from vendors where id = ?"
    //     connection.query(vendor_query, vendor_id, (err, vendor_rows) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             vendor_details = vendor_rows[0];
    //             acc_bal = parseFloat(vendor_details.acc_bal) + parseFloat(total_amount);

    //             // updating the shipper account
    //             let vendor_acc_update = "UPDATE vendors SET ? where id = ?";
    //             var vendor_acc_update_data = {
    //                 "acc_bal": acc_bal
    //             }
    //             let data111 = [vendor_acc_update_data, vendor_id];

    //             connection.query(vendor_acc_update, data111, function (error, results, fields) {
    //                 if (error) {
    //                     console.log(error);
    //                 } else {
    //                     console.log("Vendor data updated Successfully")

    //                     res.json({
    //                         status: true,
    //                         message: 'Bill generated sucessfully'
    //                     })
    //                 }
    //             });
    //         }
    //     })

    // },


    //14augbackup

    // recordPayment: (req, res) => {
    //     console.log(req.body);
    //     let today = new Date();
    //     let bill_id = req.body.id;
    //     let amount_paid = req.body.amount_paid;
    //     let payment_method = req.body.payment_method;
    //     let total_amount = req.body.total_amount;
    //     let vendor_id = req.body.vendor_id;
    //     let acc_bal = 0, amt = 0;
    //     let paymentObject = {

    //         'payment_type': payment_method,
    //         'account': 1,
    //         'amount': amount_paid,
    //         'type': 2,      //invoice
    //         'debit': 0,
    //         'credit': amount_paid,
    //         'bill_id': bill_id
    //     }


    //     // Fetching and updating the credit note table
    //     connection.query("select * from bill where id = ?", bill_id, function (error, results, fields) {
    //         if (error) {
    //             console.log(error);
    //         } else {
    //             amt = parseFloat(results[0].amount) - parseFloat(results[0].amount_paid);
    //             if (amt === parseFloat(amount_paid)) {
    //                 var bill_data = {
    //                     "amount_paid": parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
    //                     "payment_method": payment_method,
    //                     "paid_on": today,
    //                     "status": "Paid"
    //                 }
    //             } else {
    //                 var bill_data = {
    //                     "amount_paid": parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
    //                     "payment_method": payment_method,
    //                     "paid_on": today,
    //                     "status": "Partially Paid"
    //                 }
    //             }

    //             let query = "UPDATE bill SET ? where id = ?";
    //             let data1 = [bill_data, bill_id];

    //             connection.query(query, data1, function (uperr, upress, fields) {
    //                 if (uperr) {
    //                     console.log(uperr);
    //                 } else {



    //                     var paymentQuery = "insert payments SET ? "
    //                     connection.query(paymentQuery, paymentObject, function (err, datas) {
    //                         if (error) {
    //                             console.log(error);
    //                         } else {

    //                             // updating the vendor account
    //                             let vendor_query = "select * from vendors where id = ?"
    //                             connection.query(vendor_query, vendor_id, (vendor_err, vendor_rows) => {
    //                                 if (vendor_err) {
    //                                     console.log(vendor_err);
    //                                 } else {
    //                                     acc_bal = parseFloat(vendor_rows[0].acc_bal) - parseFloat(amount_paid);
    //                                     let vendor_acc_update = "UPDATE vendors SET ? where id = ?";
    //                                     var vendor_acc_update_data = {
    //                                         "acc_bal": acc_bal
    //                                     }
    //                                     let data111 = [vendor_acc_update_data, vendor_id];

    //                                     connection.query(vendor_acc_update, data111, function (error, results, fields) {
    //                                         if (error) {
    //                                             console.log(error);
    //                                         } else {
    //                                             console.log("Vendor updated Successfully")
    //                                         }
    //                                     });

    //                                 }
    //                             }); var o_acc_data = {
    //                                 "type": "Expense",
    //                                 "description": "Payment for bil " + bill_id,
    //                                 "amount": amount_paid,
    //                                 "account": req.body.account,
    //                                 "created_on": today
    //                             }
    //                             let o_acc_state_query = "INSERT INTO account_statements SET ?"
    //                             connection.query(o_acc_state_query, o_acc_data, function (lgerr, lgres, fields) {
    //                                 if (lgerr) {
    //                                     console.log(lgerr)
    //                                 } else {
    //                                     console.log(" account statement  added successfully");
    //                                 }
    //                             });


    //                             console.log(results);
    //                             //creating a log
    //                             var log_data = {
    //                                 "status": " has recorded the payment for bill no " + bill_id,
    //                                 "user_id": req.params.id
    //                             }
    //                             connection.query('INSERT INTO log SET ?', log_data, function (lgerr, lgres, fields) {
    //                                 if (lgerr) {
    //                                     console.log(lgerr)
    //                                 } else {
    //                                     console.log("log added successfully");
    //                                     res.json({
    //                                         status: true,
    //                                         message: 'bill Updated sucessfully'
    //                                     })
    //                                 }
    //                             });
    //                         }
    //                     });
    //                 }
    //             })
    //         }
    //     });
    // },

    getAllVendorProducts: (req, res) => {
        let query = "SELECT * FROM vendors_products_services;"

        connection.query(query, (err, rows) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0) {
                res.json({
                    status: -1,
                    message: ' No results found'
                })
            } else {
                res.json({
                    status: 1,
                    data: rows
                })
            }
        })
    },

    postNewVendorProduct: (req, res) => {

        let today = new Date();

        var vendor_data = {
            'name': req.body.name,
            'description': req.body.description,
            'price': req.body.price,
            'expense_category': req.body.expense_category,
            'created_on': today,
            'created_by': req.params.id
        }

        connection.query('INSERT INTO vendors_products_services SET ?', vendor_data, (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Vendor Products record added sucessfully");
                res.json({
                    status: true,
                    message: 'Vednor Products Added Successfully'
                })
            }
        })
    },

    updateVendorProduct: (req, res) => {
        let today = new Date();
        var vendor_data = {
            'name': req.body.name,
            'description': req.body.description,
            'price': req.body.price,
            'expense_category': req.body.expense_category,
            'changed_on': today,
            'changed_by': req.params.id
        }

        let query = "UPDATE vendors_products_services SET ? where id = ?"

        let data = [vendor_data, req.body.id];
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
            } else {
                console.log("Vendor Product updated sucessfully");
                res.json({
                    status: true,
                    message: 'Vendor product updated Successfully'
                })
            }
        });
    },

    destroyVendorProduct: (req, res) => {
        let query = "delete from vendors_products_services where id = ?";

        connection.query(query, req.params.vendor_product_id, (err, rows) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'there are some errors with query'
                })
            } else {
                res.json({
                    status: 1,
                    message: 'Vendor Product Deleted Successfully'
                })
            }
        })

    },

}