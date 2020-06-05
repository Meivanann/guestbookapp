var connection = require('../../../config');

module.exports = {
    index: (req,res) => {
        let query = "SELECT * FROM receiver where deleted_by = '';"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                res.json({
                    status: -1,
                    message:' No results found'
                })
            } else {
                res.json({
                    status: 1,
                    data:rows
                })
            }
        })
    },

    store: (req,res) => {

        console.log(req.body.receiver_code);
        console.log(req.body.receiver_name);
        let today = new Date();
   
        let validationQuery = "SELECT * FROM receiver where receiver_code = ? or receiver_name = ?;"
        let validationData = [req.body.receiver_code, req.body.receiver_name];
        connection.query(validationQuery, validationData, (err,rows) => { 
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with validation query'
                })
            } else if (rows.length == 0 ){
                
                //adding a record in destination table
                var receiver_data = {
                    'receiver_code'    :  req.body.receiver_code,
                    'receiver_name'    :  req.body.receiver_name,
                    'created_on'          :  today,
                    'created_by'          :  req.params.id,
                    'deleted_by'          :  '',
                }
                connection.query('INSERT INTO receiver SET ?', receiver_data, (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Receiver record added sucessfully");
                    }
                })

                 //adding a log
                 var log_data = {
                    "status": "user - " + req.params.id + "created Receiver -  name" + req.body.receiver_name + " - " +  req.body.receiver_code
                }
                connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                    if (lgerr) {
                    console.log(lgerr)
                    }else{
                        console.log("log added successfully");
                    }
                });

                res.json({
                    status:true,
                    message:'Receiver  Added sucessfully'
                })


            }else{
                res.json({
                    status:2,
                    message: 'Receiver name / code Already exists'
                })
            }
        })
    },

    update: (req,res) => {
        let today = new Date();

        //updating destination table
        var receiver_data = {
            'receiver_code'         :  req.body.receiver_code,
            'receiver_name'         :  req.body.receiver_name,
            'changed_on'            :  today,
            'changed_by'            :  req.params.id,
        }
        let receiver_query = "UPDATE receiver SET ? where receiver_code = ?"
        let data = [receiver_data, req.body.receiver_code];

        connection.query(receiver_query,data, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.json({
                    status:false,
                    message:'there are some error with query'
                })
            }else{
                console.log("Receiver table updated sucessfully")
             }
        })

        

        //adding a log
        var log_data = {
            "status": "user - " + req.params.id + "update receiver -  name" + req.body.receiver_name + " - " +  req.body.receiver_code 
        }
        connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
            if (lgerr) {
            console.log(lgerr)
            }else{
                console.log("log added successfully");
            }
        });

        res.json({
            status:true,
            message:'Receiver  updated sucessfully'
        })
    },
    destroy: (req,res) => {
        let receiver_code, receiver_name;
        let query = "SELECT * FROM receiver where id = ?;"
        let receiver_id = req.params.receiver_id;
        connection.query(query,receiver_id, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                res.json({
                    status: 2,
                    message:' Data Doest exist'
                })
            } else {
                receiver_code = rows[0].receiver_code;
                receiver_name = rows[0].receiver_name;

                let delete_query = "delete from receiver where id=?;"
                connection.query(delete_query, receiver_id, (err,rows) => {
                    if(err){
                        res.json({
                            status:false,
                            message: 'there are some errors with query'
                        })
                    } else {
                        res.json({
                            status: true,
                            message: 'Receiving Record Deleted Successfully'
                        })
                    }
                })
            }
        })
    }
}