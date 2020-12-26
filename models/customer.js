 var q = require('q');
var passwordHash = require('password-hash');
//var mongoose = require('mongoose');
var counter=require('../schema/counterfunction')
var CustomerProfile=require('../schema/customer.js')
var db=require('../config')
var logger  = require('../log/logger');
module.exports = {
    addCustomer: async (req) => {
        var deferred = q.defer();

        let {mobile_number, amount,name, user_name, address, email, password } = req.body;

        var hashedPassword = passwordHash.generate(password)
      
        CustomerProfile.find({email:email},function(err,data)
            {
                if(err)
                {
                    deferred.resolve({status:0,message:"Error occured"})
                }
                else
                {
                   
                    if(data.length > 0)
                    {
                        
                        deferred.resolve({status:0,message:"Email already exist"})
                    }
                    else{
                        CustomerProfile.find({user_name:user_name},function(err,result)
                        {
                            if(err)
                            {
                                deferred.resolve({status:0,message:"Error Occured"})
                            }
                            else
                            {
                                if(result.length > 0)
                                {
                                    deferred.resolve({status:0,message:"Username Should be already useed"})
                                }
                                else
                                {
                                    counter.findOneAndUpdate({
                                          _id:"customer_id"
                                        },
                                        {
                                          $inc: {
                                            sequence_value: 1
                                          }
                                        },
                                        {
                                          new: true
                                        },
                                        (err, doc) => {
                                          if (err) {
                                            deferred.resolve({status:0,message:"Error occureed",err})
                                          } else {
                                              console.log(doc)
                                            let customerprofile = new CustomerProfile(
                                                {
                                                    name: name,
                                                    mobile_number:mobile_number,
                                                    amount:amount,
                                                    address: address,
                                                    email: email,
                                                    user_name: user_name,
                                                    
                                                    password: hashedPassword,
                                                     
                                                    customer_id:doc.sequence_value
                                                }
                                            )
                                            customerprofile.save(function (err, data) {
                                                if (err) {
                                                    console.log(err)
                                                }
                                                else {
                                                    deferred.resolve({ status: 1, message: "Inserted Successfully" })
                                                }
                                            })
                                          }
                                        })
                                    
                                   
                                }
                            }
                        })
                
                           

                    }
                    
                }
            })
      
        
        return deferred.promise;
    },


    customerLogin: async (req) => {
        

    var deferred = q.defer();
    let {username, password } = req.body;
    var password_login=password; //user enter password
         var actualpassword = ''
          console.log('username',username)
          if (username!=undefined || password!=undefined) {
            try {
            CustomerProfile.find({username:username},function(err,data)
            {
                if(err)
                {  
                    
                    logger.simple.info('error',err)
                    deferred.resolve({status:0,message:"Error occured",err})
                    
                }
                else
                { 
                    if(data.length > 0)
                    {
                        
                       actualpassword =passwordHash.verify
    
                        
                       logger.simple.info("Email already exist")
                        deferred.resolve({status:0,message:"Email already exist"})
                     
                    }
                    else{
                        logger.simple.error("Email already exist",data)
    
                    }
                    
                }
            })
        } catch (error) {
            // errorlogger.info(error)
             deferred.resolve(error)
             logger.simple.error(error)
         }
              
          }
          else
          {
            deferred.resolve({status:0,message:'please pass username and password'})
            logger.simple.warn("please pass username and password")
              
             // errorlogger.info("please pass username and password")
            }
    
   
     
      
        
        return deferred.promise;
    },
     
}

