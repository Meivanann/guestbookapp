var connection = require('../../config');
var commonFunction = require('../commonFunction');
var _ = require('lodash');
module.exports = {
    getReceiverCodes: (req, res) => {
        console.log(req.params.id);
        let driver_id = req.params.id, driver_name;
        let driver_query = "select * from users where id=?;"
        connection.query(driver_query, driver_id, (err, rows) => {
            if (err) {
                console.log(err);
            } else if (rows.length == 0) {
                console.log("no user found");
            } else {
                console.log("results found");
                driver_name = rows[0].firstname;

                let query = "SELECT distinct r.*,c.receiver_code  FROM out_for_delivery o, consignment c, shipping r where o.status = 'In-progress' and o.driver_name = ? and o.cn_no = c.cn_no and c.receiver_code = r.shipper_code order by datetime desc;"
                connection.query(query, driver_name, (err, rows) => {
                    if (err) {
                        console.log(err);
                    } else if (rows.length == 0) {
                        res.json({
                            status: 2,
                            message: "No results found"
                        })
                    } else {
                        console.log("results found");
                        res.json({
                            status: true,
                            data: rows
                        })
                    }

                })
            }
        });
    },
    updateConsigmentstatus: async (req, res) => {
        let { cnnos, isdone, login_id, descripation } = req.body
        console.log(req.body)
        let message = descripation
        let driver_query = "select * from users where id=" + login_id + "";
        let data = await commonFunction.getQueryResults(driver_query)
        let ids = cnnos.join("','")
        console.log(ids)
        if (cnnos.length > 0) {
            console.log('correct')
        if (data.length > 0) {
            if (isdone == 1) // clicking done button
            {

                let updatedoneQuery = "update out_for_delivery set is_done=1 where cn_no in('" + ids + "') ";
                console.log('son', updatedoneQuery)
                let updatedoneDate = await commonFunction.getQueryResults(updatedoneQuery);
                if (updatedoneDate.affectedRows > 0) {
                    res.json({ status: 1, message: "Done successfully" })
                }
                else {
                    res.json({ status: 2, message: "No updation done" })
                }


            }
            else if (isdone == 2)  // click on failure button
            {
                var checkingquery = "SELECT * FROM consignment where cn_no in ('" + ids + "')";
                var checkingdata = await commonFunction.getQueryResults(checkingquery)
                 
                let destination_codeobject={}
                let regionObject={};
                let cnoObject={};
                let primaryObject={};
                checkingdata.forEach(element => {
                    
                    destination_codeobject[element.cn_no]=element.destination_code
                    regionObject[element.destination_code]=element.region
                    cnoObject[element.destination_code]=element.cn_no
                    // primaryObject[element.destination_code]
                });
                console.log(cnoObject)
                 

                let status = ''
                //pushback functioality 
               // var deletedoneQuery = "delete  from out_for_delivery   where cn_no in( '" + ids + "')";
               // let updatedoneQuery = "update consignment set status=?  where cn_no in( '" + ids + "')";
               let updatedoneQuery = "update consignment set status=?  where cn_no = ?";
               var deletedoneQuery = "delete  from out_for_delivery   where cn_no =? ";
                let trackingQuery = "insert tracking(cn_no,descripation)values ? ";
                let query = "SELECT * FROM consignment where cn_no = ? "
                let regionQuery = "SELECT * FROM region WHERE destination_code =? ;"

                let sql = connection
                sql.beginTransaction(function (err) {
                    console.log(cnnos)
                    cnnos.forEach((id,i) => {

                    sql.query(query, [id], function (err, data) {
                       
                        if (err) {
                            return sql.rollback(function () {
                                console.log(err)
                            });
                        }
                        else {
                            console.log('querys',query,i)

                            let destination_code = [];
                            let destinationcode=data[0].destination_code
                            data.forEach(element => {
                                destination_code.push(destination_codeobject[element.cn_no])
                            });
                            
                            // destination_code.forEach(re => {

                            sql.query(regionQuery, [destinationcode], function (err, regiondatas) {
                                if (err) {
                                    return sql.rollback(function () {
                                        console.log(err)
                                    });
                                }
                                else {
                                    let updatas = []
                                    let object = {}
                                    
                                    console.log('destination_code',destinationcode,i)
                                    
                                    if(regiondatas.length > 0)
                                    {
                                    let regiondata = regiondatas.length > 0 ? regiondatas : [];
                                     
                                    if(regiondata[0].region === "SOUTH"  && data[0].region != "SOUTH"){
                                        console.clear()
                                        
                                        status = "assign to south";
                                    }else if (regiondata[0].region === "NORTH"  && data[0].region != "NORTH"){
                                        status = "assign to north";
                                    }else {
                                       
                                        status = "assign to hq";
                                    }
                                //     if(regiondatas.length > 0 )
                                //     {                                          //getKeyByValue function is used for get key throug it values
                                //         regiondatas.forEach(element => {
                                //         console.log('element',element.region)
                                //         let region =regiondata.length > 0 &&element.region!=undefined? element.region : ''
                                //         console.log('region',region)
                                //         // data.forEach(elements => {
                                //             if (region === "SOUTH" && regionObject[element.destination_code] != "SOUTH") {
                                //                 status = "assign to south";
                                //                 object = { con_no: getKeyByValue(destination_codeobject,element.destination_code), status: status }
                                //             } else if (region === "NORTH" && regionObject[element.destination_code] != "NORTH") {
                                //                 status = "assign to north";
                                //                 object = { con_no: getKeyByValue(destination_codeobject,element.destination_code), status: status }
                                //             } else if (region=='' && regionObject[element.destination_code]== '' ) {
                                //                 console.log('smsm' )
                                //                 status = "assign to hq";
                                //                 object = { con_no: getKeyByValue(destination_codeobject,element.destination_code), status: status }
                                //             }
                                //             updatas.push(object)


                                //        // });
                                //     });
                                // }
                                    console.log(updatas)
                                     
                                    // var consigmentQuery = "INSERT INTO consignment (cn_no ,status ) VALUES "
                                    // _.forEach(updatas, function (ref, index, arr) {
                                        
                                    //     var cn_no = (ref.con_no) ? ref.con_no : ''
                                    //     var status = (ref.status) ? ref.status : '';
                                    //     consigmentQuery = consigmentQuery + "('" + cn_no + "','" + status + "'),"
                                         
                                    // })
                                   
                                    // consigmentQuery = consigmentQuery.substring(0, consigmentQuery.length - 1);
                                    // var query = consigmentQuery +  " ON DUPLICATE KEY UPDATE status=VALUES(status)"
                                    console.log('ss',status,id)
                                    sql.query(updatedoneQuery,[status,data[0].cn_no], function (err, updatedconsigndata) {
                                        if (err) {
                                            return sql.rollback(function () {
                                                 
                                            });
                                        }
                                        else {

                                            sql.query(deletedoneQuery,[ids], function (err, deletedata) {
                                                if (err) {
                                                    return sql.rollback(function () {
                                                        console.log(err)
                                                    });
                                                }
                                                else {

                                                    let tracking = []
                                                    cnnos.forEach(element => {
                                                            tracking.push({
                                                            cnno: element,
                                                            message: message
                                                        })
                                                    });
                                                    let trackinglist = tracking.map((m) => Object.values(m))
                                                    sql.query(trackingQuery,[trackinglist], function (err, data) {
                                                        if (err) {
                                                            return sql.rollback(function () {
                                                                console.log(err)
                                                            });
                                                        }
                                                        else {

                                                            sql.commit(function (err) {
                                                                if (err) {
                                                                    return sql.rollback(function () {
                                                                        console.log(err)
                                                                    });
                                                                }

                                                            });
                                                            


                                                        }
                                                    });
                                                }

                                            });



                                        }
                                    });
                                }
                            }
                            })
                       // })

                            


                        }

                    });
                });
                res.json({ status: 1, message: 'Failed successsfully' })

                })
            }
        }
    

        else {
            res.json({ status: 2, message: "No results found" })
        }
    }
    else
    {
        res.json({ status: 2, message: "please send the cnno" })
    }  


    },

    getReceiverConsignments: (req, res) => {
        console.log(req.params.id);
        let driver_id = req.params.id, driver_name;
        let receiver_code = req.params.receiver_code;
        let driver_query = "select * from users where id=?;"
        connection.query(driver_query, driver_id, (err, rows) => {
            if (err) {
                console.log(err);
            } else if (rows.length == 0) {
                console.log("no user found");
            } else {
                console.log("results found");
                driver_name = rows[0].firstname;

                let query = "SELECT  c.receiver_code, o.*  FROM out_for_delivery o, consignment c where c.receiver_code = ? and o.driver_name = ? and o.cn_no = c.cn_no  and o.is_done=0 order by o.datetime desc;"
                let data = [receiver_code, driver_name];
                connection.query(query, data, (err, rows) => {
                    if (err) {
                        console.log(err);
                    } else if (rows.length == 0) {
                        res.json({
                            status: 2,
                            message: "No results found"
                        })
                    } else {
                        console.log("results found");
                        res.json({
                            status: true,
                            data: rows
                        })
                    }

                })
            }
        });
    }
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }