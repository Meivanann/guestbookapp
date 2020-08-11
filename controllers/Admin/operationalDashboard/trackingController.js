var connection = require('../../../config');

module.exports = {
    index: (req,res) => {
         
        let {id,cn_no}=req.body
        // let cn_no = req.params.cn_no;
        let query = "select * from tracking where cn_no = '" +cn_no+"' "
       connection.query(query, (err,rows) => {
           console.log(query)
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
                console.log("results found",rows);
                let ofd_query  = "select o.*, c.quantity from out_for_delivery o,consignment c where o.cn_no = c.cn_no and o.cn_no = ?;"
                connection.query(ofd_query,cn_no, (err,ofdrows) => {
                    if(err){
                        console.log(err);
                        res.json({
                            status: false,
                            message:'Some Error in Query'
                        })
                    } else if (rows.length == 0 ){
                        console.log("no ofd results found");
                        res.json({
                            status: 1,
                            data:rows,
                            attachment:null
                        })
                    } else {
                        console.log("Ofd results found");
                        res.json({
                            status: 1,
                            data:rows,
                            attachment: ofdrows[0]
                        })
                    }
                })
            }
            
        })
       
    },
}


