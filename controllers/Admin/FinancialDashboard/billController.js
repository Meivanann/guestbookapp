var connection = require('../../../config');


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
                connection.query(vendor_query, vendor_id, (err, results) => {
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
                connection.query(vendor_query, vendor_id, (err, results) => {
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


    deleteBill: (req, res) => {
        let { bill_id, login_id } = req.body;
        let query = "select  * from users where id=" + login_id + "";
        let deleteQuery = "update  bill as b left join bill_details as bl  on b.id=bl.bill_id set b.isdelete=1,bl.isdelete=1 where  b.id=" + bill_id + ""
        connection.query(query, (err, rows) => {
            if (err) {
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

                connection.query(deleteQuery, (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
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
        let query = "select * from bill where id = ? and b.isdelete=0"

        connection.query(query, bill_id, (err, rows) => {
            if (err) {
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
                let bill_detail_query = "select * from bill_details where bill_id = ? and b.isdelete=0"
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
        let total_amount = req.body.amount;
        let data = JSON.parse(req.body.items);
        let acc_bal = 0, bill_id;

        console.log(req.body);

        // adding row in credit note table
        var billdata = {
            "vendor_id": vendor_id,
            "bill_date": today,
            "amount": total_amount,
            "status": "Unpaid",
            "payment_due_date": req.body.payment_due_date
        }
        let bill_query = "INSERT INTO bill SET ?"
        connection.query(bill_query, billdata, function (billerr, billres, fields) {
            if (billerr) {
                console.log(billerr)
            } else {
                console.log(billres.insertId);
                bill_id = billres.insertId;
                console.log("Bill  added successfully");

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
                        "total_amount": row.total_amount
                    }

                    let bill_detail_query = "INSERT INTO bill_details SET ?"
                    connection.query(bill_detail_query, bill_detail_data, function (billderr, billdres, fields) {
                        if (billderr) {
                            console.log(billderr)
                        } else {
                            console.log("Bill details added successflly");
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

                        res.json({
                            status: true,
                            message: 'Bill generated sucessfully'
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
        let payment_method = req.body.payment_method;
        let total_amount = req.body.total_amount;
        let vendor_id = req.body.vendor_id;
        let acc_bal = 0, amt = 0;

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
                    }
                });




                var o_acc_data = {
                    "type": "Expense",
                    "description": "Payment for bil " + bill_id,
                    "amount": amount_paid,
                    "account": req.body.account,
                    "created_on": today
                }
                let o_acc_state_query = "INSERT INTO account_statements SET ?"
                connection.query(o_acc_state_query, o_acc_data, function (lgerr, lgres, fields) {
                    if (lgerr) {
                        console.log(lgerr)
                    } else {
                        console.log(" account statement  added successfully");
                    }
                });


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
                    }
                });

                res.json({
                    status: true,
                    message: 'bill Updated sucessfully'
                })
            }
        });
    },

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