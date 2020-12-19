var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Counter=require('./counterfunction') 
 var moment=require("moment")
var owner_details = new Schema({
    name:{type:String},
   
    email:{type:String},
    user_name:{type:String},
    owner_id:{type:String},
   
    address:{type:String},
     
    mobile_number:{type:String},
    
    password:{type:String},
     
    created_date:{type:Date,default:Date.now},
    status:{type: Number, default: 0} // status: 0 — Active ,1 -Deactive
})





module.exports = mongoose.model('owner', owner_details); 