var connection = require('../../../config');

module.exports = {
    search: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let query = "SELECT * FROM shipping where shipper_code = ?;"

        connection.query(query, shipper_code, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                res.json({
                    status: -1,
                    message:'Shipper code not found. Please enter a valid shipper code.'
                })
            } else {

                //fetching data from charges table
                let charge_query = "select A.DESTINATION_CODE, B.CARTON_RATE, B.M3_RATE, B.P_RATE, B.S_RATE, B.M_RATE, B.B_RATE, B.XL_RATE, B.PKT_RATE, B.ID, B.SHIPPER_CODE FROM destination A LEFT JOIN charges B ON A.DESTINATION_CODE=B.DESTINATION_CODE AND B.SHIPPER_CODE=? WHERE A.DELETED_BY='' ORDER BY A.DESTINATION_CODE"
                connection.query(charge_query, shipper_code, (charge_err,charge_rows) => {
                    if(err){
                        res.json({
                            status:false,
                            message: 'there are some error with query'
                        })
                    } else {
                        res.json({
                            status: 1,
                            data:charge_rows
                        })
                    }
                })
            }
        })
    },
}