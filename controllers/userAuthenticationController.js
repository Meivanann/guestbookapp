var Cryptr = require('cryptr');
var express=require("express");
var connection = require('../config');

cryptr = new Cryptr('myTotalySecretKey');
 

module.exports = { 
  register: (req,res) => {
    var today = new Date();
    var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "email":req.body.email,
        "username":req.body.username,
        "password":encryptedString,
        "position":req.body.position,
        "active":0,
        "created_at":today,
        "updated_at":today
    }

    console.log(users);
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
  
  login: (req,res) => {

    console.log("request");
    console.log(req.body);
    var username=req.body.username;
    var password=req.body.password;
   
    connection.query('SELECT * FROM users WHERE username = ?',[username], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       
        if(results.length >0){
            decryptedString = cryptr.decrypt(results[0].password);
            if(password==decryptedString){
              if(results[0].active === 1){
                req.session.userId = results[0].id;
                res.json({
                    id:results[0].id,
                    position:results[0].position,
                    status:true,
                    message:'successfully authenticated'
                })
              }else{
                res.json({
                  status:false,
                  message:"User is not activated by admin"
                 });
              }
            }else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
                 });
            }
          
        }
        else{
          res.json({
              status:false,    
            message:"Email does not exits"
          });
        }
      }
    });
  }
}

