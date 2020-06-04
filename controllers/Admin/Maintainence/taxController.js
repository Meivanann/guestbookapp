var connection = require('../../../config');

module.exports = {
    index: (req,res) => {
        let query = "SELECT * FROM tax;"

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
    update: (req,res) => {
        let today = new Date();

        //updating destination table
        var tax_data = {
            'tax_name'         :  req.body.tax_name,
            'tax_percentage'   :  req.body.tax_percentage
        }
        let receiver_query = "UPDATE tax SET ? where id = ?"
        let data = [tax_data, req.body.tax_id];

        connection.query(receiver_query,data, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.json({
                    status:false,
                    message:'there are some error with query'
                })
            }else{
                console.log("Tax Data updated sucessfully")
                //adding a log
                var log_data = {
                    "status": "user - " + req.params.id + "update  the tax "
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
                    message:'Tax updated sucessfully'
                })
             }
        })
    }
}