var connection = require('../../config');

module.exports = {
    
    getAllInvoices: (req,res) => { 
        let shipper_query = "SELECT * FROM shipping where user_id = ?;"
        let query = "SELECT * FROM invoice where shipper_code = ? order by invoice_date desc;"

        connection.query(shipper_query, req.params.id, (err,results) => {
            if(err){
                console.log(err);
            } else {
                connection.query(query, results[0].shipper_code, (err,rows) => {
                    if(err){
                        console.log(err);
                        res.json({
                            status:false,
                            message:'there are some error with query'
                            })
                    } else if (rows.length == 0 ){
                        res.json({
                            status:false,
                            message:"No results found"
                           });
                    } else {
                        res.json({
                            status: true,
                            data:rows
                        })
                    }
                    
                })
            }
            
        })
    },
}