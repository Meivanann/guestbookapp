var connection = require('../../config');

module.exports = {
    index: (req,res) => {
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

                let query = "select * from out_for_delivery where status = 'In-progress'  and  driver_name = ? order by datetime desc;"
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
                             status: 1,
                             data:rows
                         })
                     }
                     
                 })
            }  
        })
       
    },

    ofdCompleted: (req,res) => {
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

                let query = "select * from out_for_delivery where status = 'Completed'  and  driver_name = ? order by datetime desc;"
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
                             status: 1,
                             data:rows
                         })
                     }
                     
                 })
            }  
        })
    }
}