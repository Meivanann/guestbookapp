var sql = require('../../config/database.config');
var tableConfig = require('../config/table_config');
var q = require('q');
var sql = require('../../config/database.config');
 
var commonFunction = require('../models/commonfunction');
var moment = require('moment');
var multer = require('multer');
var Validator = require('jsonschema').Validator;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({
    storage: storage
}).any('flim_image');

 

module.exports = {
   
 
        addFlim: (req, res, next) => {
        var deferred = q.defer();
        console.log("body", req.body)
        upload(req, next, async function (err) {
console.log('req.files',req.file,req.files)
            if (err) {
                console.log(err)
                deferred.resolve({ status: 0, message: "Image error" })
            }
            else {

                var flim_photo_file = [];
                if (req.files != undefined) {
                
                                        for (var i = 0; i < req.files.length; i++) {
                                            file = req.files
                    
                                            if (req.files[i].fieldname == 'flim_image') {
                                                flim_photo_file.push(file[i].path.replace(/\\/g, '/'));
                                                console.log("file", flim_photo_file)
                                            }
                                            
                                        }
                    //                         if (req.files[i].fieldname == 'dispenary_file') {
                    //                             warmingletter.push(file[i].location);

                                        let flimname=req.body.flimname;
                                        let descripation=req.body.description;
                                        let relase_date=req.body.relase_date;
                                        let rating=req.body.rating;
                                        let ticket_price=req.body.ticket_price;
                                        let country=req.body.country;
                                        let genere=req.body.gener;
                                        let imagepath=flim_photo_file
                                        //  imagepath.forEach(element => {
                                        //     element=element.replace(/\\/g, '/')
                                        // });
                                        console.log('afterupdate',imagepath)

                    var saveFlim= "INSERT INTO " + tableConfig.FLIMS + " (flim_name,descripation,rating,relase_date,ticket_price,country,genre,flim_slug_name,image_path,status) VALUES ('" + flimname + "','" + descripation + "','" + rating + "','" + relase_date + "','" + ticket_price + "','" + country + "','" + genere + "','" + flimname + "','" + imagepath + "','0')";
                   sql.query(saveFlim,function(error,data) {
                       if(error)
                       { 
                        deferred.resolve({"status":0,message:error})
                       }
                       else
                       {
                           deferred.resolve({"status":1,message:"Added flim successfully"})

                       }
                   })
                    

                       }


                
                 
               

                
            }
        });
        return deferred.promise;
    },
  getflimDetails: async(req, res) => {
        var deferred = q.defer();
        var flimdetails="select * from  flims"
        var flimData=await commonFunction.getQueryResults(flimdetails);
        if(flimData.length>0)
        {
            let prefix=req.protocol+'//:'+req.header('host')+'/'
            flimData.forEach(element => {
                let imagearray=[]
                if(element.image_path!=undefined)
                {
                    console.log('element',element.image_path)
                     imagearray=element.image_path.split(',') 
                }
             
                element.imagelist=imagearray.length>0?imagearray.map(el => prefix  + el):[]
            });
            deferred.resolve({
                "status":1,message:"flim list successfully",data:flimData
            })
        }
        else
        {
            deferred.resolve({
                "status":0,message:"No data found",data:[]
            })
        }

      

        
        return deferred.promise;
    },
    getflimDetailsbySlugname:async(req, res) => {
        var deferred = q.defer();
        console.log('name',req)
        var flimslugname=req.query.flimslugname
     let prefix=req.protocol+'://'+req.header('host')+'/'
     var flimdetails="select * from  flims as f   where f.flim_slug_name='"+flimslugname+"' and f.status=0"
        var flimData=await commonFunction.getQueryResults(flimdetails);
        if(flimData.length>0)
        {
            let flimid=flimData[0].flim_id
        
            var CommentQuery="select * from flims_comments where flim_id="+flimid+" and status=0";
            var commentdata=await commonFunction.getQueryResults(CommentQuery)
            flimData[0].commentlist=commentdata.length>0?commentdata:[]
            flimData[0].imagelist=flimData[0].image_path.split(',').length>0?flimData[0].image_path.split(',').map(el => prefix  + el):[]
            deferred.resolve({
                "status":1,message:"flim list successfully",data:flimData
            })
        }
        else
        {
            deferred.resolve({
                "status":0,message:"No data found",data:[]
            })
        }

      

        
        return deferred.promise;
    },

    

   

   
}
