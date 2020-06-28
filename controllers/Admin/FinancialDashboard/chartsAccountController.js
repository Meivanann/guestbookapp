
var connection = require('../../../config');


module.exports = {
    getAllAccountTypes: (req,res) => {
        let query = "SELECT * FROM account_types;"

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

    getAllAccounts: (req,res) => {
        let query = "SELECT * FROM accounts;"

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

    postNewAccount: (req,res) => {
        var today = new Date();
        let account_type_id = req.body.account_type_id;
        let account_name = req.body.account_name;

        console.log(req.body);
         // inserting  Account of Statements

         var account_data = {
            "account_type_id"       : shipper_code,
            "account_name"          : account_name,
            "created_on"            :  today
        }

        let acc__query = "INSERT INTO accounts SET ?"
        connection.query(acc__query, account_data, function (lgerr, lgres, fields) {
            if (lgerr) {
                console.log(lgerr)
            }else{
                console.log("Account   added successfully");
                
                res.json({
                    status:true,
                    message:'Account added sucessfully'
                })
            }
        });

    }

}