var connection = require('../../../config');

module.exports = {
    driverofd: (req,res) => {
        let query = "select o.*,(c.carton_size + c.m3_size + c.m3_min_size + c.weight_min_size + c.weight_size + c.pallet_size +  c.p_size + c.s_size + c.m_size + c.l_size + c.xl_size + c.pkt_size + c.other_charges) as quantity FROM out_for_delivery o join consignment c on c.cn_no = o.cn_no where o.driver_name = ? and date(o.datetime) BETWEEN ? and ? and o.status = 'In-progress' order by o.receiver_name"
        let data = [req.body.driver, req.body.start_date, req.body.end_date];
       connection.query(query,data, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
                res.json({
                    status: 2,
                    message: "No Results Found"
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

    manifestSearch: (req,res) => {
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let status = req.body.status;
        let shipper_code = req.body.shipper_code;
        let destination_code = req.body.destination_code;
        let city = req.body.city;
        let driver_name = req.body.driver_name;
        let stat, shipper, destination, city1, city2, driver;

        if(status === "Open"){
            stat = "and consignment.status != 'Close'";
        }else if(status === "Close"){
            stat ="and consignment.status = 'Close'";
        }else{
            stat ="";
        }

        if(!shipper_code){
            shipper = "";
        }else{
            shipper = "and consignment.shipper_code = '" + shipper_code +"'";
        }

        if(!destination_code){
            destination = "";
        }else{
            destination = "and consignment.destination_code = '" + destination_code +"'";
        }

        if(!city){
            city1=""; city2="";
        }else{
            city1 = "inner join shipping on shipping.shipper_code = consignment.shipper_code";
            city2 = "and shipping.city like '%" + city + "%'";
        }

        if(!driver_name){
            driver = '';
        }else{
            driver = "and consignment.driver_name = '" + driver_name +"'";
        }

        let query = "select * from consignment " + city1 + " where date(cn_datetime) >= '" + start_date + "' and date(cn_datetime) <= '" + end_date +"' " + stat + " " + shipper + " " + destination + " " + city2 + " " + driver +" order by shipper_name";
        connection.query(query, (err,rows) => {
            if(err){
                console.log(err);
            } else if (rows.length == 0 ){
               console.log("no results found");
               res.json({
                status: 0,
                data:"No data found"
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
}


