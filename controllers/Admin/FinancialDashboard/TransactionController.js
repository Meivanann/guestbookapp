var connection = require('../../../config');


module.exports = {
    getAllTransactions: (req,res) => {
        let query = "SELECT * FROM account_statements order by created_on desc;"
        let total_amount = 0;
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

                Object.keys(rows).forEach(function(key) {
                    var row = rows[key];

                    if(row.type === 'Income'){
                        total_amount = total_amount + parseFloat(row.amount);
                    }else{
                        total_amount = total_amount - parseFloat(row.amount);
                    }
                });

                res.json({
                    status: 1,
                    data:rows,
                    total_amount: total_amount
                })
            }
        })
    },

    // PostNewExpense: (req,res) => {
    //     var today = new Date();

    //      // inserting  Account of Statements
    //      var acc_data = {
    //         "account" : "Cash",
    //         "type"         : "Debit",
    //         "amount"       :  req.body.amount,
    //         "created_on"   :  today,
    //         "description"  :  req.body.description
    //     }

    //     let acc_state_query = "INSERT INTO account_statements SET ?"
    //     connection.query(acc_state_query, acc_data, function (lgerr, lgres, fields) {
    //         if (lgerr) {
    //             console.log(lgerr)
    //         }else{
    //             console.log("Account statement  added successfully");
    //             res.json({
    //                 status:true,
    //                 message:'Account  statement add3ed sucessfully'
    //             })
    //         }
    //     });
    // },
}