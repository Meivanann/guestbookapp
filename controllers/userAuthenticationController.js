var Cryptr = require('cryptr');
var express=require("express");
var connection = require('../config');
var fileUpload = require('express-fileupload');
var multer = require('multer');
var moment=require('moment')
var COMMONURL=require('../common.json')
cryptr = new Cryptr('myTotalySecretKey');
 

module.exports = { 
  getimageurl: (req,res) => {

    // console.log("request");
    console.log(req.body);
    var login_id=req.body.login_id;
     
   
    connection.query('SELECT * FROM users WHERE id = ?',[login_id], function (error, results, fields) {
      if (error) {
        console.log (error)
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       
         

                let imagesfolder=results[0].imageurl
                var filePath = COMMONURL.SERVERURL+ ':' + COMMONURL.SERVERPORT + '/'+imagesfolder;
                
                //req.session.userId = results[0].id;
                res.json({
                     status:1,
                    filePath,
                    message:'image fetched successfully'
                })
              } 
            })
  },
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

    // console.log(users);
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        console.log(error)
        res.json({
            status:false,
            message:'there are some error with query',
            error:error
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

    // console.log("request");
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
                let imagesfolder=results[0].imageurl
                var filePath = COMMONURL.SERVERURL+ ':' + COMMONURL.SERVERPORT + '/'+imagesfolder;
                // var filePath = COMMONURL.SERVERURL+ ':' + COMMONURL.SERVERPORT + '/'+imagesfolder;
                res.json({
                    id:results[0].id,
                    position:results[0].position,
                    name:results[0].firstname + ' ' + results[0].lastname, 
                    status:true,
                    filePath,
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
  },


  userupload: (req,res) => {
 
    console.log('ree',req.body) 
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    else
    {
      let login_id=req.body.login_id      
    let sampleFile = req.files.avatar;

    let today=moment().valueOf()
    var checkingQuery="select * from users where id ="+login_id+"";
      connection.query(checkingQuery,function (err,data) {
        
        if(err)
        {
          console.log(err)
        }
        else
        {
          if (data.length > 0) {

            let username=data[0].username;
             // Use the mv() method to place the file somewhere on your server
            sampleFile.mv("./uploads/users/"+today+'-'+username+".jpg", function(err,data) {
              if (err)
                return res.status(500).send(err);
               // var filePath = COMMONURL.localurl+ ':' + COMMONURL.SERVERPORT + '/users/' +today+'-'+username+'.jpg'
                var path='/users/' +today+'-'+username+'.jpg'
                var updateQuery="update users set imageurl='"+path+"' where id="+login_id+"";
                connection.query(updateQuery,function(err,rows)
                {
                  if(err)
                  {
                    console.log(err)
                  }
                  else
                  {
                var filePath = COMMONURL.SERVERURL+ ':' + COMMONURL.SERVERPORT + '/users/' +today+'-'+username+'.jpg';
          res.json({message:'File uploaded!',filePath,path});

        }
            })
            });
            
          }
        }

      })
   
   
 
  }  
    
 

},




  setPassword: (req,res) => {
    var today = new Date();
    console.log(req.params);
    console.log(req.body);
    var id=req.params.id;
    var old_password = req.body.old_password;
    var new_password = req.body.new_password;
   
    connection.query('SELECT * FROM users WHERE id = ?',id, function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       console.log(results);
        if(results.length >0){
            decryptedString = cryptr.decrypt(results[0].password);
            if(old_password===decryptedString){
              var encryptedString = cryptr.encrypt(req.body.new_password);
              var users={
                "password":encryptedString,
                "updated_at":today
              }
    
              let data1 = [users ,id ]
          
              connection.query('UPDATE users SET ? where id = ?',data1, function (error, results, fields) {
                if (error) {
                    console.log(error);
                }else{
                    console.log(results)
                    res.json({
                      status:true,
                      message:"Password changed succesfully"
                  })
                }
              });
            }else{
                res.json({
                  status:false,
                  message:"old password is wrong"
                 });
            }
          
        }
        else{
          res.json({
              status:false,    
            message:"user id does not exits"
          });
        }
      }
    });
  }
}

