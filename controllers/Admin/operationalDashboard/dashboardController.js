var connection = require('../../../config');

module.exports = {
    index: (req,res) => {
        console.log(req.params.id);
        let query = "SELECT * FROM consignment where region = 'HQ' and status='created'	order by cn_datetime desc limit 4;SELECT * FROM consignment where  region='SOUTH' and status='assign to south' order by cn_datetime desc limit 4;SELECT * FROM consignment where  region='NORTH' and status='assign to north' order by cn_datetime desc limit 4;SELECT * FROM out_for_delivery where  status='Completed'	 order by datetime desc limit 4;SELECT * FROM out_for_delivery where  status='Close'	 order by datetime desc limit 4;SELECT * FROM out_for_delivery where  status='In-progress' order by datetime desc limit 20;SELECT * FROM consignment where  (status='created' or status='assign to south' or status='assign to north') and date(cn_datetime) < DATE(NOW() - INTERVAL 3 DAY) order by cn_datetime desc limit 3;"
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


