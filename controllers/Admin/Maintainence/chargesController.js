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
                    status: 2,
                    message:'Shipper code not found. Please enter a valid shipper code.'
                })
            } else {

                //fetching data from charges table
                let charge_query = "select A.destination_code, B.carton_rate, B.m3_rate, B.m3_min_rate, B.pallet_rate, B.s_rate, B.m_rate, B.l_rate, B.xl_rate, B.pkt_rate, B.weight_min_rate, B.weight_rate, B.id, B.shipper_code FROM destination A LEFT JOIN charges B ON A.destination_code=B.destination_code AND B.shipper_code=? WHERE A.DELETED_BY='' ORDER BY A.destination_code"
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
    update: (req,res) => {
        console.log(req.body.update_charges);
        // let arr = req.body.update_charges
        
        // arr.forEach(element => {
        //     console.log(element);
        // });
        res.json({
            status:false,
            message: 'there are some error with query'
        })
    }
}