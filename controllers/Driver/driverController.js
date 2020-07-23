var connection = require('../../config');

module.exports = {
    getReceiverCodes: (req,res) => {
        console.log(req.params.id);
        let driver_id = req.params.id, driver_name;
        let driver_query = "select * from users where id=?;"
        connection.query(driver_query,driver_id, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
               console.log("no user found");
            } else {
                console.log("results found");
                driver_name = rows[0].firstname;

                let query = "SELECT distinct r.*  FROM out_for_delivery o, consignment c, shipping r where o.status = 'In-progress' and o.driver_name = ? and o.cn_no = c.cn_no and c.receiver_code = r.shipper_code order by datetime desc;"
                connection.query(query,driver_name, (err,rows) => {
                     if(err){
                         console.log(err);
                     } else if (rows.length == 0 ){
                        res.json({
                            status: 2,
                            message:"No results found"
                        })
                     } else {
                         console.log("results found");
                         res.json({
                             status: true,
                             data:rows
                         })
                     }
                     
                 })
            }
        });
    },

    getReceiverConsignments: (req,res) => {
        console.log(req.params.id);
        let driver_id = req.params.id, driver_name;
        let receiver_code = req.params.receiver_code;
        let driver_query = "select * from users where id=?;"
        connection.query(driver_query,driver_id, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
               console.log("no user found");
            } else {
                console.log("results found");
                driver_name = rows[0].firstname;

                let query = "SELECT  c.receiver_code, o.*  FROM out_for_delivery o, consignment c where c.receiver_code = ? and o.driver_name = ? and o.cn_no = c.cn_no order by o.datetime desc;"
                let data = [ receiver_code, driver_name];
                connection.query(query,data, (err,rows) => {
                     if(err){
                         console.log(err);
                     } else if (rows.length == 0 ){
                        res.json({
                            status: 2,
                            message:"No results found"
                        })
                     } else {
                         console.log("results found");
                         res.json({
                             status: true,
                             data:rows
                         })
                     }
                     
                 })
            }
        });
    }
}