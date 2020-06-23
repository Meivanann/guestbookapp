var connection = require('../../../config');


module.exports = {
    getAllExpenses: (req,res) => {
        let query = "SELECT * FROM account_statements where type='Expense';"

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

    postExpense: (req, res) => {
        
        let description = req.body.description;
        var o_acc_data = {
            "type"         : "Expense",
            "description"  : description,
            "amount"       : req.body.amount,
            "account"      :  "Cash",
            "created_on"   :  today 
        }
        let o_acc_state_query = "INSERT INTO account_statements SET ?"
        connection.query(o_acc_state_query, o_acc_data, function (lgerr, lgres, fields) {
            if (lgerr) {
                console.log(lgerr)
            }else{
                res.json({
                    status:true,
                    message:'Expense Added Successfully'
                })
            }
        });
    }
}