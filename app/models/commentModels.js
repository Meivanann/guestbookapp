var sql = require('../../config/database.config');
var tableConfig = require('../config/table_config');
var q = require('q');
var sql = require('../../config/database.config');
 
 
var commonFunction = require('../models/commonfunction');
var jwt = require('jsonwebtoken');
var config = require('../config/security');
 
var validation = require('../common/validation');
var moment = require('moment');
 
module.exports = {
  
    postComment: (req,res,next) => {
        var deferred = q.defer();
         
   
       var user_id=req.body.user_id;
       var descripation=req.body.descripation;
       var flim_id=req.body.flim_id
       var postCommentQuery="INSERT INTO " + tableConfig.COMMENTS + " (flim_id,user_id,descriptation,status) VALUES ('" + flim_id + "','" + user_id + "','" + descripation + "','0')";
        sql.query(postCommentQuery,function(error,data) {
            if(error)
            {
                deferred.resolve({"status":0,message:error})
            }
            else
            {
                deferred.resolve({"status":1,message:"Comment post Successfully"})
            }
            
        })
        return deferred.promise;
    },
    getPostComment: async (req,res,next) => {
        var deferred = q.defer();
        
        var flim_id=req.body.flim_id
        
        
           var getCommentQuery="select * from flims_comments where flim_id='"+flim_id+"' and status=0";
           var getcommentdata= await commonFunction.getQueryResults(getCommentQuery)
            
           if(getcommentdata.length>0)
           {
               deferred.resolve({"status":1,mssage:"Comment list Successfully",data:getcommentdata})
           }
           else
           {
               deferred.resolve({"status":0,message:"no data found"})
           }
        // });

        return deferred.promise;
    },

    

   
}
//  function generateinvoicenumber() {
//   // Math.random should be unique because of its seeding algorithm.
//   // Convert it to base 36 (numbers + letters), and grab the first 9 characters
//   // after the decimal.
//   return '_' + Math.random().toString(36).substr(2, 9);
// };
