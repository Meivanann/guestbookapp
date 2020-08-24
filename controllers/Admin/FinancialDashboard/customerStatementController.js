var connection = require('../../../config');


module.exports = {
    getAccountStatement: (req,res) => {
        let shipper_code = req.body.shipper_code;
        let type = req.body.type;
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
                            res.json({
                                status:true,
                                data: rows,
                                shipper: shipper_details
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
                            if(row.type === 'Invoice'  || row.type === 'debit'){
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
                                    if(row.type === 'Invoice'  || row.type === 'debit'){
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