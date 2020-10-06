var connection = require('../../../config');
var commonFunction = require('../../commonFunction');
var _ = require('lodash');
var moment=require('moment')
var multer = require('multer');
var fileUpload = require('express-fileupload');
var csvtojsonV2 = require("csvtojson");
var Validator = require('jsonschema').Validator;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, __basedir + '/uploads/')
  },
  filename: (req, file, cb) => {
      console.log(file);
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
  });
   var uploads = multer({
       storage: storage  
     }).single('file');
//const createCsvWriter = require('csv-writer').createObjectCsvWriter;
//const { data } = require('pdfkit/js/reference');
module.exports = {


     exceldatatoJson: (req, res) => {
       // var deferred = q.defer();
        var v = new Validator();
        var datetimeformat = /^[0-9]{4}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[1-2][0-9]|3[0-1])\s+(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/gm;
        //var timeformat=/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/       
        var employeeSchema = {
            "id": "/attendenceDetails",
            "type": "object",
            "properties": {
                "date": { "type": "string" },
                "debit": { "type": "string" },
                "credit": { "type": "string" },
                "descripation": { "type": "string" }
                 

            },

            "required": ["date", "debit", "credit", "descripation"]
        };

        var rows=[];
        var errors=[]


            console.log("workbook", req.files.file.mimetype)
             
                if (!req.files) {

                    res.json({ status: 0, message: "Please choose file" });
                } else {
let files=req.files.file
let extension=req.files.file.mimetype;
let filename=req.files.file.name
let filenames=filename.split('.');
console.log(filenames[0]);
if (extension=='text/csv') {
    if (req.body.account != undefined && req.body.account != '') {

        var account = req.body.account;
        let today=moment().valueOf()
        files.mv("./uploads/users/"+today+'-'+filenames[0]+".csv", async function(err,data) {
            if (err)
              return res.status(500).send(err);
             // var filePath = COMMONURL.localurl+ ':' + COMMONURL.SERVERPORT + '/users/' +today+'-'+username+'.jpg'
             var path='./uploads/users/' +today+'-'+filenames[0]+'.csv'
              console.log('path,',path)
            //  var updateQuery="update users set imageurl='"+path+"' where id="+login_id+"";
            //   connection.query(updateQuery,function(err,rows)
            //   {
                // if(err)
                // {
                //   console.log(err)
                // }
                // else
                // {
                    //var workbook = __dirname + "/uploads/statment_list.csv";

                    const jsonArray = await csvtojsonV2().fromFile(path);
                    if (jsonArray.length > 0) {
                        // total_number_of_employees_given = data.length;


                        jsonArray.forEach((d, index) => {
                            var ValidatorResult = v.validate(d, employeeSchema);
                            if (ValidatorResult.errors.length > 0) {
                                rows.push(index + 1);
                            }
                            errors = errors.concat(ValidatorResult.errors);
                        });

                        if (errors.length==0) {
                            res.json({ status: 1, message: "data", jsonArray });
                        }
                        else
                        {
                            res.json({ status: 0, message: "validationerror", errors });
                        }
                       

                    } else {
                        res.json({ status: 0, message: "No data to import" });
                    }
             // var filePath = COMMONURL.localurl+ ':' + COMMONURL.SERVERPORT + '/users/' +today+'-'+username+'.jpg';
        //res.json({status:1,message:'File uploaded!',filePath,path});

      //}
// })
          });
         
       

        // var first_sheet_name = workbook.SheetNames[0];
        // var worksheet = workbook.Sheets[first_sheet_name];
        // var data = XLSX.utils.sheet_to_json(worksheet);
        // var errors = [];
        // var duplicate_payee = [];
        //   var total_number_of_employees_given = 0;
        var rows = [];
        
    } else {
        res.json({ status: 0, message: "Please enter client_id" });
    }
}
else
{
    res.json({ status: 0, message: "Please choose file type csv" });
}
                   
                }
            //}
       // });
        
    },
    
    savecsvdata: async(req, res) => {
        // var deferred = q.defer();
          let data=req.body.data
          let accountid=req.body.account
        let bankstatment=[];
        let account_statements=[]
        let selectedquery="select * from bank_statement";
        let selecteddata=await commonFunction.getQueryResults(selectedquery)

    if (selecteddata.length > 0 &&   data.length > 0) {
        console.log('correct')
        selecteddata.forEach(row => {

            data.forEach(element => {
console.log('firstcondition',moment(element.date).format("YYYY-MM-DD"),moment(row.date).format("YYYY-MM-DD"))
                if (row.debit!=element.debit && row.credit!=element.credit&&row.descripation!=element.descripation && moment(row.date).format("YYYY-MM-DD")!=moment(element.date).format("YYYY-MM-DD")) {
                    bankstatment.push({ 
                        descripation:element.descripation,
                        debit:element.debit!=undefined?element.debit:0,
                        credit:element.credit!=undefined?element.credit:0,
                        transactionid:12,
                        account:accountid!=undefined?accountid:0,
                        createddate:element.date!=undefined?moment(element.date).format('YYYY-MM-DD'):''
                    })
                    account_statements.push
                    ({ 
                        descripation:element.descripation,
                        debit:element.debit!=undefined?element.debit:0,
                        credit:element.credit!=undefined?element.credit:0,
                        transactionid:12,
                        account:accountid!=undefined?accountid:0,
                        amount:element.credit!=undefined&&element.credit>0&&element.credit!='' ?element.credit:0 ||element.debit!=undefined&&element.debit>0&&element.debit!=''?element.debit:0,
                        type:element.credit!=undefined?'Income':'Expenses',  
                        createddate:element.date!=undefined?moment(element.date).format('YYYY-MM-DD'):'',
                        money_type:element.credit!=undefined?2:1,  
                        category:element.credit!=undefined?53:89,
                        isUpoad:1,
                        ispayment: 1
                    })
                   
                }
               
            
            
            });   
        });
        console.log(account_statements,bankstatment)
        let banking = bankstatment.map((m) => Object.values(m))
            var insterquery="insert into bank_statement(descripation,debit,credit,transactionid,account,date)values ?"
            connection.query(insterquery,[banking],function(err,data) {
                if (err) {
                    console.log(err)
                }
                else
                {
                 
                    if(data.insertId > 0)
                    {
                        let accountstatements = account_statements.map((m) => Object.values(m))
                        var accountquery="insert into account_statements(description,debit,credit,from_id,account,amount,type,created_on,money_type,category,isUpoad,ispayment)values ?"
                        connection.query(accountquery,[accountstatements],function(error,row) {
                            if (error) {
                               console.log(error) 
                            }
                            else
                            {
                                res.json({status:1,message:'Saved successfully'})
                            }
                            
                        })
                    
                    }

                }

            })
                   
    }
    if (selecteddata.length == 0 &&   data.length > 0) {
        console.log('wrong')
        data.forEach(element => {
            // var object={
            //     descripation:element.descripation,
            //     debit:element.debit!=undefined?element.debit:0,
            //     credit:element.credit!=undefined?element.credit:0,
            //     transactionid:12,
            //     account:accountid!=undefined?accountid:0,
            //     amount:element.credit!=undefined?element.credit:0 ||element.debit!=undefined?element.debit:0,
            //     type:element.credit!=undefined?'Income':'Expenses',  
            //     createddate:element.date!=undefined?moment(date).format('YYYY-MM-DD'):'',
            //     money_type:element.credit!=undefined?2:1,  
            //     category:0,
            //     isUpoad:1

            // }
            bankstatment.push({ 
                descripation:element.descripation,
                debit:element.debit!=undefined?element.debit:0,
                credit:element.credit!=undefined?element.credit:0,
                transactionid:12,
                account:accountid!=undefined?accountid:0,
                createddate:element.date!=undefined?moment(element.date).format('YYYY-MM-DD'):''
            })
            account_statements.push
            ({ 
                descripation:element.descripation,
                debit:element.debit!=undefined?element.debit:0,
                credit:element.credit!=undefined?element.credit:0,
                transactionid:12,
                account:accountid!=undefined?accountid:0,
                amount:element.credit!=undefined&&element.credit>0&&element.credit!='' ?element.credit:0 ||element.debit!=undefined&&element.debit>0&&element.debit!=''?element.debit:0,
                type:element.credit!=undefined&&element.credit>0&&element.credit!=''?'Income':'Expenses',  
                createddate:element.date!=undefined?moment(element.date).format('YYYY-MM-DD'):'',
                money_type:element.credit!=undefined?2:1,  
                category:element.credit!=undefined?53:89,
                isUpoad:1

            })
          });
          let banking = bankstatment.map((m) => Object.values(m))
          var insterquery="insert into bank_statement(descripation,debit,credit,transactionid,account,date)values ?"
          connection.query(insterquery,[banking],function(err,data) {
              if (err) {
                  console.log(err)
              }
              else
              {
               
                  if(data.insertId > 0)
                  {
                      let accountstatements = account_statements.map((m) => Object.values(m))
                      var accountquery="insert into account_statements(description,debit,credit,from_id,account,amount,type,created_on,money_type,category,isUpoad)values ?"
                      connection.query(accountquery,[accountstatements],function(error,row) {
                          if (error) {
                             console.log(error) 
                          }
                          else
                          {
                            res.json({status:1,message:'Saved successfully'})
                          }
                          
                      })
                  
                  }

              }

          })
               
    }
    if(account_statements.length==0 && bankstatment.length ==0)
    {
        res.json({status:0,message:'All bank statment are alreaday exist'})
    } 

         
             //}
        // });
         
     },

     getbankstatement: async(req, res) => {
        // var deferred = q.defer();
        var startdate=req.body.startdate;
        var endate=req.body.endate
        var account=req.body.account
        //var statmentquery="select * from  accountreconaltionlist as ac where ac.date ?";
        var query="select * from account_statements as cd where cd.account in ('"+account+"') and cd.created_on >= '"+startdate+"' and cd.created_on <= '"+endate+"' ";
        
          //var query="select * from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id where c.account_type_id in (1,2,8)";
          var data=await commonFunction.getQueryResults(query)
 
 
            if (data.length>0) {
                res.json({status:1,message:"Bank statment list successfully",data})
            }
            else
            {
                res.json({status:0,message:"No data found"})
            } 
                 
        // });
         
     },
     addendingbalance: async(req, res) => {
        //var deferred = q.defer();


        var date=req.body.date;
        var amount=req.body.amount;
        var account=req.body.account;
          var query="insert into accountreconaltionlist(account,date,amount)values('"+account+"','"+date+"','"+amount+"')";
        var data=await commonFunction.getQueryResults(query)
 
 
            if (data.insertId>0) {


                res.json({status:1,message:"Account reconaltionlist statment successfully"})
            }
            else
            {
                res.json({status:0,message:"No data found"})
            } 
                 
        // });
         
     },
 

    


    
}


