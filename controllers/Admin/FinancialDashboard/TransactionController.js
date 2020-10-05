var connection = require('../../../config');
let commonFunction=require('../../commonFunction');

module.exports = {

    Edittransaction: (req,res) => {
        var today = new Date();
let transaction_id=req.body.transaction_id
         // inserting  Account of Statements
         var acc_data = {
           // "account"       : req.body.account,
            
            "amount"       :  req.body.amount,
            "created_on"   :  today,
            "description"  :  req.body.description,
            
           // ispayment: 1,
            credit:req.body.amount,
            debit:0,
             
             
        }

        let acc_state_query = "update account_statements SET ? where id=" + transaction_id + ""
        connection.query(acc_state_query, acc_data, function (lgerr, lgres, fields) {
            if (lgerr) {
                console.log(lgerr)
            }else{
                console.log("Income statement  added successfully");
                res.json({
                    status:1,
                    message:'Update  statement  sucessfully'
                })
            }
        });
    },

    deleteTransaction: async(req,res) => {
        var today = new Date();

        let transaction_id=req.body.transaction_id
         // inserting  Account of Statements
         let query = "DELETE account_statements FROM account_statements WHERE id=" + transaction_id + "";
         let data=await commonFunction.getQueryResults(query);

         
                console.log("Income statement  added successfully");
                res.json({
                    status:true,
                    message:'Income  statement add3ed sucessfully'
                })
            }, 


            getTransactiondetails: async(req,res) => {
                var today = new Date();
        
                let transaction_id=req.body.transaction_id
                 // inserting  Account of Statements
                 let query = "select *  FROM account_statements WHERE id=" + transaction_id + "";
                 let data=await commonFunction.getQueryResults(query);
        
                 
                        if (data.length > 0 ) {
                            res.json({
                                status:1,
                                message:'Transaction list successfully '
                            })
                        }
                        else
                        {

                            res.json({
                                status:0,
                                message:'No records found'
                            })
                        }
                        
                    } ,
    getAllTransactions: (req,res) => {
        let search=req.body.search
        let condition=''
        if(search!=undefined)
        {
            condition="and account='"+search+"'"
        }
        ///users/1598410859774-admin.jpg
        let query = "SELECT * FROM account_statements  where ispayment=1 and account NOT IN(21,22) and is_profit=0  "+condition+" order by created_on desc "
        //let query = "SELECT * FROM account_statements  where ispayment=1  and account NOT IN(21,22) and  is_profit=0 order by created_on desc;"
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

    gettransactionaccounts: (req,res) => {
         
        let condition=''
        
        let query = "SELECT * FROM accounts  where account_type_id  IN(1,2)"
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

               

                res.json({
                    status: 1,
                    data:rows,
                     
                })
            }
        })
    },
    gettransactionaccounts: (req,res) => {
         
        let condition=''
        
        let query = "SELECT * FROM accounts  where account_type_id  IN(1,2)"
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

               

                res.json({
                    status: 1,
                    data:rows,
                     
                })
            }
        })
    },

    PostNewExpense: (req,res) => {
        var today = new Date();

        let catgoryid=req.body.accountid
         // inserting  Account of Statements
         var acc_data = {
            "account"       : req.body.account,
            "type"         : "Expense",
            "amount"       :  req.body.amount,
            "created_on"   :  req.body.today_date,
            "description"  :  req.body.description,
            "from_id": 12,
            ispayment: 1,
            credit:req.body.amount,
            debit:0,
            types:'Expense Transaction',
            money_type:2,
            category:catgoryid
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
        let catgoryid=req.body.accountid
         // inserting  Account of Statements
         var acc_data = {
            "account"       : req.body.account,
            "type"         : "Income",
            "amount"       :  req.body.amount,
            "created_on"   :  req.body.today_date,
            "description"  :  req.body.description,
            "from_id": 12,
            ispayment: 1,
            credit:0,
            debit:req.body.amount,
            types:'Income Transaction',
            money_type:1,
            category:catgoryid
             
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