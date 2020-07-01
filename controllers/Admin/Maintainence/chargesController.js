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
                let charge_query = "select B.id,A.destination_code, B.carton_rate, B.m3_rate, B.m3_min_rate, B.pallet_rate, B.p_rate, B.s_rate, B.m_rate, B.l_rate, B.xl_rate, B.pkt_rate, B.weight_min_rate, B.weight_rate, B.shipper_code FROM destination A ,charges B where A.destination_code=B.destination_code AND B.shipper_code= ? AND A.DELETED_BY='' ORDER BY A.destination_code"
                connection.query(charge_query, shipper_code, (charge_err,charge_rows) => {
                    if(err){
                      con
                    } else {
                        res.json({
                            status: 1,
                            data:charge_rows,
                            shipper_code:shipper_code,
                            shipper_name: rows[0].shipper_name
                        })
                    }
                })
            }
        })
    },
    update: (req,res) => {
        let today = new Date();
        let data = JSON.parse(req.body.update_charges);

        data.forEach(element => {
            console.log(element);
            var id = element.id;

            var charges_data = {
                "carton_rate"       :   element.carton_rate,
                "pkt_rate"          :   element.pkt_rate,
                "pallet_rate"       :   element.pallet_rate,
                "p_rate"            :   element.p_rate,
                "s_rate"            :   element.s_rate,
                "m_rate"            :   element.m_rate,
                "l_rate"            :   element.l_rate,
                "xl_rate"           :   element.xl_rate,
                "m3_rate"           :   element.m3_rate,
                "m3_min_rate"       :   element.m3_min_rate,
                "weight_min_rate"   :   element.weight_min_rate,
                "weight_rate"       :   element.weight_rate,
                "changed_on"        :   today,
                "changed_by"        :   req.params.id   
            }

            let update_query = "UPDATE charges SET ? where id = ?"
            let data = [charges_data, id];

            connection.query(update_query, data, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    
                }else{ 

                   //adding a log
                   var log_data = {
                    "status": "user - " + req.params.id + "updates shipper code" + req.body.shipper_code + " - " +  req.body.shipper_name 
                }
                    connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                        if (lgerr) {
                            console.log(lgerr)
                        }else{
                            console.log("log added successfully");
                        }
                    });
                }
            });

        });

        res.json({
            status:true,
            message:'charges Data Sucessfully updated'
        })

    }
}