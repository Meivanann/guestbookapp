var connection = require('../../config');

module.exports = {
    index: (req,res) => {
        let query = "select id,firstname,lastname,email,username,position from users where active = 0"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are sopme error with query'
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

    update: (req,res) => {
        let user_id = req.body.id;

        let query = "update users set active = ? where id= ?";

        let data = [1, user_id];

        connection.query(query, data, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some errors with query'
                })
            } else {
                res.json({
                    status: 1,
                    message: 'User Approved Successfully'
                })
            }
        })

    },

    destroy: (req,res) => {
        let user_id = req.body.id;

        let query = "delete from users where id = ?";

        connection.query(query, user_id, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some errors with query'
                })
            } else {
                res.json({
                    status: 1,
                    message: 'User Rejected Successfully'
                })
            }
        })

    },

    getAllUsers: (req,res) => {
        let query = "select id,firstname,lastname,email,username,position from users where active = 1"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are sopme error with query'
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

    
    deleteUser: (req,res) => {
        let user_id = req.body.id;

        let query = "delete from users where id = ?";

        connection.query(query, user_id, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some errors with query'
                })
            } else {
                res.json({
                    status: 1,
                    message: 'User Deleted Successfully'
                })
            }
        })

    },


    addUser: (req,res) => {
        let admin_id = req.params.id;
        var today = new Date();
        var encryptedString = cryptr.encrypt(req.body.password);
        var users={
            "firstname":req.body.firstname,
            "lastname":req.body.lastname,
            "email":req.body.email,
            "username":req.body.username,
            "password":encryptedString,
            "position":req.body.position,
            "active":1,
            "created_at":today,
            "updated_at":today
        }
    
        connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
          if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
          }else{
              res.json({
                status:true,
                data:results,
                message:'user registered sucessfully'
            })
          }
        });

    },

    updateUser: (req,res) => {
        let user_id = req.body.id;
        var today = new Date();
        var encryptedString = cryptr.encrypt(req.body.password);
        var users={
            "firstname":req.body.firstname,
            "lastname":req.body.lastname,
            "email":req.body.email,
            "username":req.body.username,
            "password":encryptedString,
            "position":req.body.position,
            "active":1,
            "updated_at":today
        }

        let data1 = [users ,user_id ]
    
        connection.query('UPDATE user SET ? where id = ?',data1, function (error, results, fields) {
          if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
          }else{
              res.json({
                status:true,
                message:'user Updated sucessfully'
            })
          }
        });

    },
}


