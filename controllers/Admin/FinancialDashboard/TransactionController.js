var connection = require('../../../config');


module.exports = {
    getAllTransactions: (req,res) => {
        let query = "SELECT * FROM account_statements  where ispayment=1  and account NOT IN(21,22) order by created_on desc;"
        let total_amount = 0;
        connection.query(query,(err,rows) => {
            if(err){
                console.log(err)
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

    PostNewExpense: (req,res) => {
        var today = new Date();

         // inserting  Account of Statements
         var acc_data = {
            "account"       : req.body.account,
            "type"         : "Expense",
            "amount"       :  req.body.amount,
            "created_on"   :  req.body.today_date,
            "description"  :  req.body.description,
            "from_id": 12,
            ispayment: 1,
            credit:0,
            debit:req.body.amount,
            types:'Expense Transaction'
        }

        let acc_state_query = "INSERT INTO account_statements SET ?"
        connection.query(acc_state_query, acc_data, function (lgerr, lgres, fields) {
            if (lgerr) {
                console.log(lgerr)
            }else{
                console.log("Expense statement  added successfully");
                res.json({
                    status:true,
                    message:'Expense  statement add3ed sucessfully'
                })
            }
        });
    },

    PostNewIncome: (req,res) => {
        var today = new Date();

         // inserting  Account of Statements
         var acc_data = {
            "account"       : req.body.account,
            "type"         : "Income",
            "amount"       :  req.body.amount,
            "created_on"   :  req.body.today_date,
            "description"  :  req.body.description,
            "from_id": 12,
            ispayment: 1,
            credit:req.body.amount,
            debit:0,
            types:'Income Transaction'
             
        }

        let acc_state_query = "INSERT INTO account_statements SET ?"
        connection.query(acc_state_query, acc_data, function (lgerr, lgres, fields) {
            if (lgerr) {
                console.log(lgerr)
            }else{
                console.log("Income statement  added successfully");
                res.json({
                    status:true,
                    message:'Income  statement add3ed sucessfully'
                })
            }
        });
    },

    //14AUGBACKUP
    // getAllTransactions: (req,res) => {
    //     let query = "SELECT * FROM account_statements where ispayment=1  order by created_on desc;"
    //     let total_amount = 0;
    //     connection.query(query, (err,rows) => {
    //         if(err){
    //             res.json({
    //                 status:false,
    //                 message: 'there are some error with query'
    //             })
    //         } else if (rows.length == 0 ){
    //             res.json({
    //                 status: -1,
    //                 message:' No results found'
    //             })
    //         } else {

    //             Object.keys(rows).forEach(function(key) {
    //                 var row = rows[key];

    //                 if(row.type === 'Income'){
    //                     total_amount = total_amount + parseFloat(row.amount);
    //                 }else{
    //                     total_amount = total_amount - parseFloat(row.amount);
    //                 }
    //             });

    //             res.json({
    //                 status: 1,
    //                 data:rows,
    //                 total_amount: total_amount
    //             })
    //         }
    //     })
    // },

    // PostNewExpense: (req,res) => {
    //     var today = new Date();

    //      // inserting  Account of Statements
    //      var acc_data = {
    //         "account"       : req.body.account,
    //         "type"         : "Expense",
    //         "amount"       :  req.body.amount,
    //         "created_on"   :  req.body.today_date,
    //         "description"  :  req.body.description,
    //         "from_id": 12
    //     }

    //     let acc_state_query = "INSERT INTO account_statements SET ?"
    //     connection.query(acc_state_query, acc_data, function (lgerr, lgres, fields) {
    //         if (lgerr) {
    //             console.log(lgerr)
    //         }else{
    //             console.log("Expense statement  added successfully");
    //             res.json({
    //                 status:true,
    //                 message:'Expense  statement add3ed sucessfully'
    //             })
    //         }
    //     });
    // },

    // PostNewIncome: (req,res) => {
    //     var today = new Date();

    //      // inserting  Account of Statements
    //      var acc_data = {
    //         "account"       : req.body.account,
    //         "type"         : "Income",
    //         "amount"       :  req.body.amount,
    //         "created_on"   :  req.body.today_date,
    //         "description"  :  req.body.description,
    //         "from_id": 12
    //     }

    //     let acc_state_query = "INSERT INTO account_statements SET ?"
    //     connection.query(acc_state_query, acc_data, function (lgerr, lgres, fields) {
    //         if (lgerr) {
    //             console.log(lgerr)
    //         }else{
    //             console.log("Income statement  added successfully");
    //             res.json({
    //                 status:true,
    //                 message:'Income  statement add3ed sucessfully'
    //             })
    //         }
    //     });
    // },
}