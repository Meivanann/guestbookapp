var connection = require('../../config');

module.exports = {
    
    getAllConsignments: (req,res) => { 
        console.log(req.params.id);
        let shipper_query = "SELECT * FROM shipping where user_id = ?;"
        let query = "SELECT * FROM consignment where is_approved != 1 and shipper_code = ?;"

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

    getAllApprovedConsignments: (req,res) => { 
        let shipper_query = "SELECT * FROM shipping where user_id = ?;"
        let query = "SELECT * FROM consignment where is_approved = 1 and shipper_code = ?;"

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


