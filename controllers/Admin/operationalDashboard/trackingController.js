var connection = require('../../../config');

module.exports = {
    index: (req,res) => {
        console.log(req.params.id);
        let cn_no = req.params.cn_no;
        let query = "select * from tracking where cn_no = ?;"
       connection.query(query,cn_no, (err,rows) => {
            if(err){
                console.log(err);
                res.json({
                    status: false,
                    message:'Some Error in Query'
                })
            } else if (rows.length == 0 ){
                console.log("no results found");
                res.json({
                    status: 0,
                    message:'No Results Found'
                })
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


