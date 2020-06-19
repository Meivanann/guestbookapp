var connection = require('../../../config');


module.exports = {
    getAccountStatement: (req,res) => {
        let shipper_code = req.body.shipper_code;
        let type = req.body.type;

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
                    res.json({
                        status: 1,
                        data:rows
                    })
                }
            })
        }
    },
}