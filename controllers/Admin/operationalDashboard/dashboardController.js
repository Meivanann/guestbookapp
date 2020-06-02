var connection = require('../../../config');

module.exports = {
    index: (req,res) => {
        console.log(req.params.id);
        let query = "SELECT * FROM consignment where region = 'HQ' or region='SOUTH' or region='NORTH' and status='created'	or status='assign to south' or status='assign to north' order by cn_datetime desc; select * from out_for_delivery where status != 'Close' order by datetime desc ;"
       connection.query(query, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
               console.log("no results found");
            } else {
                console.log("results found");
           
                res.json({
                    status: 1,
                    data:rows
                })
            }
            
        })
       
    },
}


