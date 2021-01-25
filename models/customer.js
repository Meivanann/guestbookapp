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

        let {mobile_number,name, user_name, address, email, password } = req.body;

        var hashedPassword = passwordHash.generate(password)
      
        CustomerProfile.find({email:email},function(err,data)
            {
                if(err)
                {
                    logger.error.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:"+err)
                    deferred.resolve({status:0,message:"Error occured"})
                }
                else
                {
                   
                    if(data.length > 0)
                    {
                        
                       // logger.simple.warn("Email already exist")
                       logger.success.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:Email already exist")
                        deferred.resolve({status:0,message:"Email already exist"})
                    }
                    else{
                        CustomerProfile.find({user_name:user_name},function(err,result)
                        {
                            if(err)
                            {
                                logger.error.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:"+err)
                                deferred.resolve({status:0,message:"Error Occured"})
                            }
                            else
                            {
                                if(result.length > 0)
                                {
                                    logger.success.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:Username Should be already useed")
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
                                            logger.error.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:"+err)
                                            deferred.resolve({status:0,message:"Error occureed",err})
                                          } else {
                                              console.log(doc)
                                            let customerprofile = new CustomerProfile(
                                                {
                                                    name: name,
                                                    mobile_number:mobile_number,
                                                     
                                                    address: address,
                                                    email: email,
                                                    user_name: user_name,
                                                    
                                                    password: hashedPassword,
                                                     
                                                    customer_id:doc.sequence_value
                                                }
                                            )
                                            customerprofile.save(function (err, data) {
                                                if (err) {
                                                    logger.error.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:"+err)
                                                    console.log(err)
                                                }
                                                else {
                                                    logger.success.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:Inserted Successfully")
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
            CustomerProfile.find({user_name:username},function(err,data)
            {

               
                if(err)
                {  

                    
                   // logger.simple.info('error',err)
                   logger.error.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:"+err)
                    deferred.resolve({status:0,message:"Error occured",err})
                    
                }
                else
                { 
                    console.log('sss',data)
                    if(data.length > 0)
                    {
                      
                       actualpassword =passwordHash.verify(password_login,data[0].password)
    
                        if(actualpassword==true)
                        {
                            logger.success.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:login successfully")
                            deferred.resolve({status:1,message:"login successfully",username:username})
                        }
                        if(actualpassword==false)
                        {
                            logger.success.warn('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:Incorrect password")
                            deferred.resolve({status:0,message:"Incorrect password"})
                        }
                     
                    }
                    else{
                        logger.success.warn('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:User is not found")
                      deferred.resolve({status:0,message:"User is not found "})
                    }
                    
                }
            })
        } catch (error) {
            // errorlogger.info(error)
             deferred.resolve(error)
             logger.error.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:"+err)
             //logger.simple.error(error)
         }
              
          }
          else
          {
            logger.success.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:please pass username and password")
            deferred.resolve({status:0,message:'please pass username and password'})
           // logger.simple.warn("please pass username and password")
              
             // errorlogger.info("please pass username and password")
            }
    
   
     
      
        
        return deferred.promise;
    },
    customerDetails: async (req) => {
        

        var deferred = q.defer();
       
                try {
                CustomerProfile.find(function(err,data)
                {
    
                   
                    if(err)
                    {  
    
                        
                       // logger.simple.info('error',err)
                       logger.error.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:"+err)
                        deferred.resolve({status:0,message:"Error occured",err})
                        
                    }
                    else
                    { 
  
                        if(data.length > 0)
                        {
                          
                            deferred.resolve({status:1,message:"User list fetch Successfully",data})
                         
                        }
                        else{
                            logger.success.warn('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:No data found")
                          deferred.resolve({status:0,message:"No data found "})
                        }
                        
                    }
                })
            } catch (error) {
                // errorlogger.info(error)
                 deferred.resolve(error)
                 logger.error.info('method:'+req.method+",endpoint:" +req.originalUrl + ",statusmessage:"+err)
                 //logger.simple.error(error)
             }
                  
           
       
         
          
            
            return deferred.promise;
        },
}

