var sql = require('../../config/database.config');
var tableConfig = require('../config/table_config');
var q = require('q');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

 
 
var commonFunction = require('../models/commonfunction');
var jwt = require('jsonwebtoken');
var config = require('../config/security');
 
var moment = require('moment');

module.exports = {
    validateToken(req,next) {
        //get token from request header
        var deferred = q.defer();
        const authHeader = req.headers["authorization"]
        const token = authHeader!=undefined?authHeader.split(" ")[1]:null
        //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
        if (token == null) deferred.resolve({ status: 0, message: "Token is not present" });
        jwt.verify(token,'supersecret', (err, user) => {
        if (err) { 
            deferred.resolve({ status: 0, message: "Failed to verify token" });
         }
         else {
         req.user = user
         next() //proceed to the next action in the calling function
         }
        }) //end of jwt.verify()
        return deferred.promise;
        },
    Userregister: (req) => {
        var deferred = q.defer();
        var email = req.body.email;
        var name = req.body.name;
        var password=req.body.password
        var checkEmailQuery = "SELECT user_id FROM " + tableConfig.USERS + " WHERE email = '" + email + "'";
        sql.query(checkEmailQuery, async function (err, userDetails) {
            if (err) {
                console.log(err);
                deferred.resolve({ status: 0, message: 'User registration failed' });
            } else if (userDetails.length == 0) {

                
             
                    var hashpassword = bcrypt.hashSync(password, salt);

                    var save_user = "INSERT INTO " + tableConfig.USERS + " (user_name,email,password,status) VALUES ('" + name + "','" + email + "','" + hashpassword + "','0')";
                    sql.query(save_user, async function (err, insertResults) {
                        if (err) {
                            console.log(err);
                            deferred.resolve({ status: 0, message: 'User registration failed' });
                        } else if (insertResults) {
                             

                            // companyID =  companyID.padStart(5, "0");
                            // var empID = company_code + '-'+ companyID;

                            deferred.resolve({ status: 1, message: 'User registration done' });
 
                        }
                    });
                 
            } else {
                deferred.resolve({ status: 0, message: 'Email ID already exists' });
            }
        });
        return deferred.promise;
    },

     
     
    Userlogin: (req) => {
        var deferred = q.defer();
        var email = req.body.email;
        var password = req.body.password;
        
  
        
        var query = "SELECT user_id,password,email FROM " + tableConfig.USERS + " WHERE email ='" + email + "' AND status='0'";
        sql.query(query, async function (err, userMasterData) {
            if (err) {
                console.log('login error..', err);
                deferred.resolve({ status: 0, message: 'Login Failed' });
            } else {
                if (userMasterData.length > 0) {
                    var comporepassword=bcrypt.compareSync(password, userMasterData[0].password);
                    if (comporepassword==true) {
                        var token = jwt.sign({ id: userMasterData[0].user_id }, config.secret, {
                            expiresIn: 86400 //expires in 24 hours
                        });
                        deferred.resolve({"status":1,message:"Logged In successfully",userMasterData,token:token})

                         
                        

                       
                    }
                    else {
                        deferred.resolve({
                            status: 0,
                            message: "Incorrect Password"
                        })
                    }
                }
                else {
                    deferred.resolve({
                        status: 0,
                        message: "User does not Exist"
                    })
                }
            }
        });
        return deferred.promise;
    },
   
 

 
 
    
  
    
}
