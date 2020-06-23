var connection = require('../../../config');


module.exports = {
    index: (req,res) => {
        let query = "SELECT * FROM psa.shipper_acc_statements where type='Debit';"

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
                res.json({
                    status: 1,
                    data:rows
                })
            }
        })
    },

    getDebitNote: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let query = "select * from shipper_acc_statements where type = 'Debit' and shipper_code = ?;"

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

    store: (req,res) => {
        var today = new Date();
        let shipper_code = req.body.shipper_code;
        let amount = req.body.amount;

         // inserting  Account of Statements
         var inv_acc_data = {
            "shipper_code" : shipper_code,
            "type"         : "Debit",
            "amount"       :  amount,
            "created_on"   :  today,
            "description"  :  req.body.description
        }
        let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
        connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
            if (lgerr) {
                console.log(lgerr)
            }else{
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
                acc_bal = parseFloat(shipper_details.acc_bal) - amount; 

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
                            message:'Debit Note generated sucessfully'
                        })
                    }
                });
            }
        })

    }

}