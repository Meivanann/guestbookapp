var connection = require('../../../config');
var commonFunction = require('../../commonFunction');
var _ = require('lodash');
var moment=require('moment')
var multer = require('multer');
var COMMONURL=require('../../../common.json')
var fileUpload = require('express-fileupload');
var csvtojsonV2 = require("csvtojson");
const { end } = require('pdfkit');
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
console.log(req.files);
if (extension=='text/csv' || extension=='application/octet-stream' ) {
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
        console.log('correct',data);

        const result = data.filter(f =>

           
            !selecteddata.some(d =>moment(d.date).format("YYYY-MM-DD")==moment(f.date,'DD-MM-YYYY').format('YYYY-MM-DD')&& d.descripation==f.descripation&&d.credit==f.credit&&d.debit==f.debit)
          );

          console.log('acctualresult',result);

          result.forEach(element => {

            bankstatment.push({ 
                                        descripation:element.descripation,
                                        debit:element.debit!=undefined?element.debit:0,
                                        credit:element.credit!=undefined?element.credit:0,
                                        transactionid:12,
                                        account:accountid!=undefined?accountid:0,
                                        createddate:element.date!=undefined?moment(element.date,'DD-MM-YYYY').format('YYYY-MM-DD'):''
                                    })
                //              
            account_statements.push
                                ({ 
                                    descripation:element.descripation,
                                    debit:element.debit!=undefined?element.debit:0,
                                    credit:element.credit!=undefined?element.credit:0,
                                    transactionid:12,
                                    account:accountid!=undefined?accountid:0,
                                    amount:element.credit!=undefined&&element.credit>0&&element.credit!='' ?element.credit:0 ||element.debit!=undefined&&element.debit>0&&element.debit!=''?element.debit:0,
                                    type:element.credit!=undefined &&element.credit>0&&element.credit!=''?'Income':'Expenses',  
                                    createddate:element.date!=undefined?moment(element.date,'DD-MM-YYYY').format('YYYY-MM-DD'):'',
                                    money_type:element.credit!=undefined&&element.credit>0&&element.credit!=''?2:1,  
                                    category:element.credit!=undefined&&element.credit>0&&element.credit!=''?53:89,
                                    isUpoad:1,
                                    ispayment: 1
                                })
                               
          });
//         selecteddata.forEach(row => {

//             data.forEach(element => {
// console.log('firstcondition',element.date,moment(element.date,'DD-MM-YYYY').format('YYYY-MM-DD'),moment(row.date).format("YYYY-MM-DD"))
// var elementdate=moment(element.date,'DD-MM-YYYY').format('YYYY-MM-DD')
//                 if (row.debit!=element.debit && row.credit!=element.credit&&row.descripation!=element.descripation && moment(row.date).format("YYYY-MM-DD")!=elementdate) {
//                     console.log('correct',element);
//                     bankstatment.push({ 
//                         descripation:element.descripation,
//                         debit:element.debit!=undefined?element.debit:0,
//                         credit:element.credit!=undefined?element.credit:0,
//                         transactionid:12,
//                         account:accountid!=undefined?accountid:0,
//                         createddate:element.date!=undefined?moment(element.date,'DD-MM-YYYY').format('YYYY-MM-DD'):''
//                     })
//                     account_statements.push
//                     ({ 
//                         descripation:element.descripation,
//                         debit:element.debit!=undefined?element.debit:0,
//                         credit:element.credit!=undefined?element.credit:0,
//                         transactionid:12,
//                         account:accountid!=undefined?accountid:0,
//                         amount:element.credit!=undefined&&element.credit>0&&element.credit!='' ?element.credit:0 ||element.debit!=undefined&&element.debit>0&&element.debit!=''?element.debit:0,
//                         type:element.credit!=undefined?'Income':'Expenses',  
//                         createddate:element.date!=undefined?moment(element.date,'DD-MM-YYYY').format('YYYY-MM-DD'):'',
//                         money_type:element.credit!=undefined?2:1,  
//                         category:element.credit!=undefined?53:89,
//                         isUpoad:1,
//                         ispayment: 1
//                     })
                   
//                 }
               
            
            
//             });   
//         });
        var duplicateremovedbankstatment=new Set(bankstatment)
        var duplicationaccountstatment=new Set(account_statements)
        var removedbankstatment=[...duplicateremovedbankstatment];
        var removeaccountstatment=[...duplicationaccountstatment];

        console.log(account_statements,result)
        let banking = removedbankstatment.map((m) => Object.values(m))
            var insterquery="insert into bank_statement(descripation,debit,credit,transactionid,account,date)values ?"
            connection.query(insterquery,[banking],function(err,data) {
                if (err) {
                    console.log(err)
                }
                else
                {
                 
                    if(data.insertId > 0)
                    {
                        let accountstatements = removeaccountstatment.map((m) => Object.values(m))
                        var accountquery="insert into account_statements(description,debit,credit,from_id,account,amount,type,created_on,money_type,category,isUpoad,ispayment)values ?"
                        connection.query(accountquery,[accountstatements],function(error,row) {
                            if (error) {
                               console.log(error) 
                            }
                            else
                            {
                                console.log('future',row);
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
                createddate:element.date!=undefined?moment(element.date,'DD-MM-YYYY').format('YYYY-MM-DD'):''
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
                createddate:element.date!=undefined?moment(element.date,'DD-MM-YYYY').format('YYYY-MM-DD'):'',
                money_type:element.credit!=undefined?2:1,  
                category:element.credit!=undefined?53:89,
                isUpoad:1,
                ispayment: 1

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
                      var accountquery="insert into account_statements(description,debit,credit,from_id,account,amount,type,created_on,money_type,category,isUpoad,ispayment)values ?"
                      connection.query(accountquery,[accountstatements],function(error,row) {
                          if (error) {
                             console.log(error) 
                          }
                          else
                          {console.clear();
                              console.log('result',row);
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
        var statmentbalance=0;
        var paymentbalance=0
        var statementObject={}
        var paymentObject={}

        let condition=''
        let vendorcondition=''
        let condition_value = '';
          let  condition_from = '';
          let condition_to =  '';
         let  condition_string = ''
         var search=req.body.search
         var sortby=req.body.sortby;
var searchbar=req.body.searchbar
var searchcondition=''
         var sortcondition='order by cd.created_on desc'
var order=req.body.order
            if(sortby!=undefined && sortby!='' && order!=undefined && order!='')
            {
                sortcondition ="ORDER BY cd.created_on " + order + "";
            }
            if(searchbar!=undefined && searchbar!='')
            {
                searchcondition ="and (cd.description like '%"+searchbar+"%')";
            }
        if(search != undefined)
        {
            condition_value = '';
                    condition_from = '';
                    condition_to =  '';
            if(search.date != undefined)
            {
                condition_from = search.date.from;
                condition_to =  search.date.to;
                if(condition_string != undefined)
                {
                condition_string=condition_string + "and  DATE_FORMAT(cd.created_on,'%Y-%m-%d')  >= DATE('" + condition_from + "') AND DATE_FORMAT(cd.created_on,'%Y-%m-%d') <= DATE('" + condition_to + "')";
                 } 
                 if(search.date.from != ''&&search.date.to!= '' )
                 {
                condition=condition+condition_string
               // vendorcondition=vendorcondition+condition_string
                } 
            } 

            if(search.types != undefined)
            {
                                        //0--debit and 1--credit
            
                condition_value=search.types
                if(condition_string != undefined && search.types != ''&& search.types.includes(0)==true )
                {
                condition_string= " and cd.credit=0";
                 } 
                 if(condition_string != undefined && search.types != ''&& search.types.includes(1)==true )
                 {
                 condition_string= " and cd.debit=0";
                  } 

                  if(condition_string != undefined && search.types != ''&& search.types.includes(1)==true && search.types.includes(0)==true )
                 {
                 condition_string= condition+"";
                  } 
                 if(search.types != '' )
                {
                condition=condition+ condition_string
                //vendorcondition=vendorcondition+ condition_string
               }
            }
            
             if(search.status != undefined)
             {
                                    //0--unmatch,1--matched items
                 condition_value=search.status
                 if(condition_string != undefined && search.types != '' && search.status.includes(0)==true)
                 {
                 condition_string= " and cd.isbankreconcile!=1";
                  } 
                  if(condition_string != undefined && search.types != '' && search.status.includes(1)==true)
                 {
                 condition_string= " and cd.isbankreconcile=1";
                  } 
                  if(condition_string != undefined && search.types != '' && search.status.includes(1)==true&& search.status.includes(0)==true)
                 {
                 condition_string= condition+"";
                  } 
                  if(search.status != '' )
                 {
                 condition=condition+ condition_string
                 //vendorcondition=vendorcondition+ condition_string
                }
                }
        }

        var statmentQuery="select *,SUM(cd.amount) AS totalamount from accountreconaltionlist as cd where cd.account in ('"+account+"') and cd.date >= '"+startdate+"' and cd.date <= '"+endate+"' ";
        var statmentdata=await commonFunction.getQueryResults(statmentQuery);
         if (statmentdata.length >0) {
            statmentdata.forEach(element => {
                statementObject[element.account]=element.totalamount
             });
         }

var startingbalance=0
var changepaymentlist=[]
         var paymentquery="select *,c.account_name as accountname from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id and cd.isUpoad!=1   and DATE_FORMAT(cd.created_on,'%Y-%m-%d')>=DATE( '"+startdate+"') and DATE_FORMAT(cd.created_on,'%Y-%m-%d') <= DATE('"+endate+"') and cd.account='"+account+"'  group by cd.id"
         var paymentdata=await commonFunction.getQueryResults(paymentquery);
         console.log(paymentquery); 

        //  var transactionpaymentlist="Select *,cd.type as actype,cd.created_on as accdate,ad.type as accountype,cd.account as account_id,cd.id as accountstatmentid from  account_statements as cd left join accounts as ac on ac.id=cd.account inner join account_types as ad on ac.account_type_id=ad.id where cd.from_id=12 and   DATE_FORMAT(cd.created_on,'%Y-%m-%d')>=DATE( '"+startdate+"') and DATE_FORMAT(cd.created_on,'%Y-%m-%d') <= DATE('"+endate+"') "+condition+"  "+searchcondition+"  group by cd.id  "+sortcondition+"   "
        //  var transactionpaymentitems=await commonFunction.getQueryResults(transactionpaymentlist);
         
         
        //  if (transactionpaymentitems.length > 0) {
             
         
        //  console.log('prank goes wrong')
              
         
        //  transactionpaymentitems.forEach(element => {
              
                  
        //       //    element.credit=element.amount
        //       //    element.debit=0
              
              
              
        //       // element.credit=0
        //       // element.debit=element.amount
          
        //       if (element.actype=='Income') {
        //          element.credit=0
        //          element.debit=element.amount
        //      }
        //      if (element.actype=='Expenses') {
        //       element.credit=element.amount
        //       element.debit=0
        //   }
         
        //   changepaymentlist.push(element)
          
        //  }); 
         
        //     //console.log('prank goes wrong',defaultlist)
         
             
        //  }
         if (paymentdata.length >0) {
//paymentdata.push(...changepaymentlist)
            

var totalpaymentbalance=_.sumBy(paymentdata, function (day) {
 
    return day.debit - day.credit;

});
            paymentdata.forEach(element => {
                paymentObject[element.account]=totalpaymentbalance
              });
          }
          paymentbalance=paymentObject[account]?paymentObject[account]:0
          statmentbalance=statementObject[account]?statementObject[account]:0
          startingbalance=paymentObject[account]?paymentObject[account]:0
          var difference=paymentbalance-statmentbalance
          //var statmentquery="select * from  accountreconaltionlist as ac where ac.date ?";
       console.log('cons',condition);
        var query="select * from account_statements as cd where  cd.account in ('"+account+"') and DATE_FORMAT(cd.created_on,'%Y-%m-%d')>=DATE( '"+startdate+"') and DATE_FORMAT(cd.created_on,'%Y-%m-%d') <= DATE('"+endate+"') "+condition+"  "+searchcondition+" "+sortcondition+" ";
        console.log('query',query);
          //var query="select * from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id where c.account_type_id in (1,2,8)";
          var data=await commonFunction.getQueryResults(query)

          let defaultlist=[]
let changedlist=[]
//var transactionlist="Select *,cd.type as actype,cd.created_on as accdate,ad.type as accountype,cd.account as account_id,cd.id as accountstatmentid from  account_statements as cd left join accounts as ac on ac.id=cd.account inner join account_types as ad on ac.account_type_id=ad.id where cd.from_id=12 and   DATE_FORMAT(cd.created_on,'%Y-%m-%d')>=DATE( '"+startdate+"') and DATE_FORMAT(cd.created_on,'%Y-%m-%d') <= DATE('"+endate+"') "+condition+"  "+searchcondition+"  group by cd.id  "+sortcondition+"   "
//var transactionitems=await commonFunction.getQueryResults(transactionlist);


// if (transactionitems.length > 0) {
    

// console.log('prank goes wrong')
     

//    transactionitems.forEach(element => {
     
         
//      //    element.credit=element.amount
//      //    element.debit=0
     
     
     
//      // element.credit=0
//      // element.debit=element.amount
 
//      if (element.actype=='Income') {
//         element.credit=0
//         element.debit=element.amount
//     }
//     if (element.actype=='Expenses') {
//      element.credit=element.amount
//      element.debit=0
//  }

//  changedlist.push(element)
 
// }); 

//    //console.log('prank goes wrong',defaultlist)

    
// }
 if (data.length > 0) {
    data.push(...changedlist)
    data.forEach(element => {
          startingbalance= Number(startingbalance + Number((element.debit))-Number((element.credit)))
          element.balance=startingbalance
      });
     
 }
             
                res.json({status:1,message:"Bank statment list successfully",statmentbalance,paymentbalance,difference,data})
             
            
                 
        // });
         
     },
     updatematchedlist: async(req, res) => {
        // var deferred = q.defer();
        var transactionid=req.body.transactionid;
         var isMatch=req.body.match ///0--it for unmatched items 1-- it for matched items
        var selectedquery="select * from account_statements as c where id='"+transactionid+"'";
        var selecteddata=await commonFunction.getQueryResults(selectedquery)

        if (selecteddata.length > 0) {
            var selecteditems=selecteddata[0]
            var updateQuery="update account_statements as c set c.isbankreconcile=1 where c.id='"+transactionid+"' ";
            var insterQuery="insert into accountmatchlist(descripation,debit,credit,date,transactionid) values('"+selecteditems.description+"','"+selecteditems.debit+"','"+selecteditems.credit+"','"+selecteditems.created_on+"','"+transactionid+"')"
            if(isMatch==0) {
                updateQuery="update account_statements as c set c.isbankreconcile=0 where c.id='"+transactionid+"' "
                insterQuery="update accountmatchlist as c set c.isdelete=1 where c.transactionid='"+transactionid+"' ";
            }

        console.log('query',updateQuery,insterQuery);
            var updatedata=await commonFunction.getQueryResults(updateQuery)
if (updatedata.affectedRows >0 ) {
    var insterdata=await commonFunction.getQueryResults(insterQuery)
    
    res.json({status:1,message:"Update successfully"})
}
else
{
    res.json({status:0,message:"No updation done "})
}

            
        }
        else
        {
            res.json({status:0,message:"No data found "})
        }
                
             
            
                 
        // });
         
     },

       gettemplatefile: async(req, res) => {
        // var deferred = q.defer();
        var path='';
          
            
             var path='./uploads/wave.csv'
              console.log('path,',path)
             
                        
             var filePath = COMMONURL.STAGINGURL+ ':' + COMMONURL.SERVERPORT + '/wave.csv';
        res.json({status:1,message:'File list!',filePath,path});

      //}
// })
         
         
       
         
                 
        // });
         
     },

     getstatusbankstatement: async(req, res) => {
        // var deferred = q.defer();
        var startdate=req.body.startdate;
        var endate=req.body.endate
        var account=req.body.account
        

        var startdateObject={};
var enddateObject={};


console.log('duplicate');


var paymentquery="select *,min(DATE_FORMAT(cd.created_on,'%Y-%m-%d')) as mindate from account_statements as cd where cd.account in ('"+account+"') group by cd.account order by cd.created_on asc ";
        var paymentdata=await commonFunction.getQueryResults(paymentquery)
        var datequery="select * from accountreconaltionlist as cd where cd.account in ('"+account+"') order by cd.date asc ";
     var endquerydata=await commonFunction.getQueryResults(datequery)
        var startdates=''
        var endates=''
     console.log(paymentquery);
      if (paymentdata.length >0 ) {

        paymentdata.forEach(element => {
              
            startdateObject[element.account]=element.mindate
          });
          startdates=startdateObject[account]
          endates=endquerydata[0].date
          console.log('ms');
          var prevousdate=''

          var startdate=[];
          var enddate=[]
          var finalstatmentbalance={};
          var finalpaymentbalance={};
          var differencebalance={};
          var finalresponse=[]
          var systembalance=0
          for (let index = 0; index < endquerydata.length; index++) {
              const el = endquerydata[index];
              
          
           
            // if (index==0) {
                var intialenddate=index==0?el.date:''

            console.log('cns',intialenddate);
                //enddates=index==0?el.date:''
                prevousdate=el.date
                 
            // }
            
             
        if (index>0) {
           var value=endquerydata[index-1].date
                startdates=moment(value).add(1,'days').format('YYYY-MM-DD');
                endates=el.date
        }
                
        console.log('startdate',startdates,endates);
           //console.log('correct',startdates);
           var endingbalanceQuery="select *,sum(c.amount) as total from accountreconaltionlist as c where  DATE_FORMAT(c.date,'%Y-%m-%d')>=DATE('" + startdates + "') and DATE_FORMAT(c.date,'%Y-%m-%d')<=DATE('" + endates+ "') and  c.account='"+account+"'  and c.isdelete=0 group by c.account" //it is statment balance query from start to end date
    var endingbalanceData=await commonFunction.getQueryResults(endingbalanceQuery)
console.log('endingblancequery',endingbalanceQuery);
    
    if (endingbalanceData.length >0) {

    finalstatmentbalance[el.account]=endingbalanceData[0].total
    
    startdate.push(...endingbalanceData)
    }
    var startingbalanceQuery="select *,c.account_name as accountname,sum(cd.debit-cd.credit) as total from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id where c.account_type_id in (1,2,8) and  DATE_FORMAT(cd.created_on,'%Y-%m-%d')>=DATE('" + startdates + "') and DATE_FORMAT(cd.created_on,'%Y-%m-%d')<=DATE('" + endates + "')and  cd.account ='"+account+"' and cd.isUpoad!=1 and cd.created_on!=''  group by cd.account"
    var startingbalanceData=await commonFunction.getQueryResults(startingbalanceQuery)
    if (startingbalanceData.length > 0) {
        finalpaymentbalance[el.account]=startingbalanceData[0].total
        enddate.push(...startingbalanceData)
        systembalance=startingbalanceData[0].total
    }
    if (startingbalanceData.length==0) {
        finalpaymentbalance= {}
    }
    if (endingbalanceData.length==0) {
        finalstatmentbalance= {}
    }

    console.log('paymentquery',startingbalanceQuery,finalpaymentbalance);
            //}

            var duplicateQuery="select c.*,COUNT(c.description),COUNT(c.created_on),COUNT(c.debit),COUNT(c.credit) from account_statements  as c    where  c.account='"+account+"'   and c.ispayment=1 and DATE_FORMAT(c.created_on,'%Y-%m-%d')>=DATE('" + startdates + "') and  DATE_FORMAT(c.created_on,'%Y-%m-%d')<=DATE('" + endates + "')  GROUP by c.description  having count(c.description) > 1 and count(c.created_on) > 1  and count(c.debit) > 1 and count(c.credit) > 1 ;";
var duplicatedata=await commonFunction.getQueryResults(duplicateQuery)        
         console.log('duplicatwquery',duplicateQuery);  
finalresponse.push({
                startingdate:startdates,
                endingdate:endates,
                account:account,
                statmentbalance:finalstatmentbalance[el.account]!=undefined?finalstatmentbalance[el.account]:0,
                systembalance:finalpaymentbalance[el.account]!=undefined?finalpaymentbalance[el.account]:0,
                isduplicate:duplicatedata.length>0?true:false
            })

             
          
      }
    }
console.log('result',enddate,startdate);
      console.log(startdateObject);
      
      var lastdate=startdateObject[account]?startdateObject[account]:''
        //var statmentquery="select * from  accountreconaltionlist as ac where ac.date ?";
        var query="select * from accountreconaltionlist as cd where cd.account in ('"+account+"') order by cd.date asc ";
        
          //var query="select * from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id where c.account_type_id in (1,2,8)";
          var data=await commonFunction.getQueryResults(query)
 
 
            if (data.length>0) {
            

                data.forEach(element => {
                    element.lastdate=lastdate
                });
                res.json({status:1,message:" bank statment  status list successfully",data,lastdate,finalresponse,enddate,startdate})
            }
            else
            {
                res.json({status:0,message:"No data found"})
            } 
                 
        // });
         
     },

     getindexlist: async(req, res) => {
        // var deferred = q.defer();
       let accountids=[]
var startdateObject={};
var enddateObject={};
var lastidObject={}

        var paymentquery="select *,min(DATE_FORMAT(cd.created_on,'%Y-%m-%d')) as mindate from account_statements as cd  where  cd.isUpoad!=1  group by cd.account order by cd.created_on asc ";
        var paymentdata=await commonFunction.getQueryResults(paymentquery)
      var enddatequery="select *,max(DATE_FORMAT(c.date,'%Y-%m-%d')) as maxdate from accountreconaltionlist as c where c.isdelete=0  group by c.account"
      var enddata=await commonFunction.getQueryResults(enddatequery)  
      console.log('end',enddatequery);


      var lastmaxdatequery="SELECT * FROM psa_staging.accountreconaltionlist as c INNER JOIN (SELECT id as iss,account, MAX(date) as TopDate from psa_staging.accountreconaltionlist group by account ) as a on a.TopDate=c.date and c.account=a.account"
     var lastmaxdata=await commonFunction.getQueryResults(lastmaxdatequery)
      
     if (lastmaxdata.length >0 ) {
        lastmaxdata.forEach(element => {
             lastidObject[element.account]=element.id
         });
     }
     if (paymentdata.length>0) {
           paymentdata.forEach(element => {
            startdateObject[element.account]=element.mindate 
           });
       }
       if (enddata.length>0) {
        enddata.forEach(element => {
         enddateObject[element.account]=element.maxdate 
        });
    }


    var datebalanceQuery=`SELECT s.id,s.account, Max(s.date) Max_Date,(SELECT t.date 
     FROM accountreconaltionlist t 
    where s.account=t.account
     ORDER BY date DESC 
     LIMIT 1,1) seconddate
    FROM  accountreconaltionlist s
    
    GROUP BY account
    order by id,date desc`
    var dateData=await commonFunction.getQueryResults(datebalanceQuery)



     
    let startingObject={};
    let endingObject={}

    if (dateData.length > 0) {
        dateData.forEach(element => {
            startingObject[element.account]={ 
                startdate:element.seconddate!=undefined?element.seconddate:element.Max_Date,
                endate:element.Max_Date,
                id:lastidObject[element.account]?lastidObject[element.account]:0
            }
        });
    }
        let amountObject={}
         
       let repsonse=[];
        //var statmentquery="select * from  accountreconaltionlist as ac where ac.date ?";
        var query="select *,c.account_name as accountname,sum(cd.debit-cd.credit) as total from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id where c.account_type_id in (1,2,8) and cd.isUpoad!=1 and cd.created_on!='' group by cd.account"
        console.log(query);
          //var query="select * from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id where c.account_type_id in (1,2,8)";
          var data=await commonFunction.getQueryResults(query)
 
 
            if (data.length>0) {

                data.forEach(element => {
                    amountObject[element.account]=element.total
                    accountids.push({account:element.account})
                    });
                data.forEach(element => {
                    repsonse.push({
account:element.account,
accountname:element.accountname,
total:amountObject[element.account]?amountObject[element.account]:0
                    })
                });

                var startdate=[];
                var enddate=[]
                var finalstatmentbalance={};
                var finalpaymentbalance={};
                var differencebalance={};
for (let index = 0; index < accountids.length; index++) {
    const element = accountids[index];
    var endingbalanceQuery="select *,sum(c.amount) as total from accountreconaltionlist as c where  DATE_FORMAT(c.date,'%Y-%m-%d')>=DATE('" + startdateObject[element.account] + "') and DATE_FORMAT(c.date,'%Y-%m-%d')<=DATE('" + enddateObject[element.account]+ "') and  c.account='"+element.account+"'  and c.isdelete=0 group by c.account" //it is statment balance query from start to end date
    var endingbalanceData=await commonFunction.getQueryResults(endingbalanceQuery)
console.log('endingblancequery',endingbalanceQuery);
    
    if (endingbalanceData.length >0) {

    finalstatmentbalance[element.account]=endingbalanceData[0].total
    
    startdate.push(...endingbalanceData)
    }
    var startingbalanceQuery="select *,c.account_name as accountname,sum(cd.debit-cd.credit) as total from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id where c.account_type_id in (1,2,8) and  DATE_FORMAT(c.created_on,'%Y-%m-%d')<=DATE('" + startdateObject[element.account] + "') and DATE_FORMAT(c.created_on,'%Y-%m-%d')<=DATE('" + enddateObject[element.account] + "')and  cd.account ='"+element.account+"' and cd.created_on!='' and cd.isUpoad!=1   group by cd.account"
    var startingbalanceData=await commonFunction.getQueryResults(startingbalanceQuery)
    if (startingbalanceData.length >0) {
        finalpaymentbalance[element.account]=startingbalanceData[0].total
        enddate.push(...startingbalanceData)
    }


    differencebalance[element.account]= (finalstatmentbalance[element.account]?finalstatmentbalance[element.account]:0)-(finalpaymentbalance[element.account]?finalpaymentbalance[element.account]:0)
    
}

                 
                res.json({status:1,message:" bank index   list successfully",repsonse,startdate,enddate,enddateObject,startdateObject,differencebalance,startingObject})
            }
            else
            {
                res.json({status:0,message:"No data found"})
            } 
                 
        // });
         
     },

     deletetransactionlist: async(req, res) => {
        // var deferred = q.defer();
       
    
var transactionid=req.body.transactionid;
var checkingQuery="select * from account_statements as cd where cd.id  in ("+transactionid.join(',')+")";
var checkingData=await commonFunction.getQueryResults(checkingQuery);

if (checkingData.length>0) {
    var checkdata=checkingData
     for (let index = 0; index < checkingData.length; index++) {
         const element = checkingData[index];
         var deletetransactionlist="delete account_statements from account_statements where id="+element.id+""
         var deleteddata=await commonFunction.getQueryResults(deletetransactionlist)
     
     var updateQuery="update bank_statement as b set b.isdelete=1 where b.date='"+element.created_on+"' and b.descripation='"+element.description+"' and b.debit='"+element.debit+"' and b.credit='"+element.credit+"' and b.transactionid=12 and b.account='"+element.account+"'"
     console.log('updatequery',updateQuery);
     var updatedata=await commonFunction.getQueryResults(updateQuery)
     }
       
   // });
    
res.json({status:1,message:" Deleted transaction successfully"})
}
                //res.json({status:1,message:" bank index   list successfully",repsonse,startdate,enddate,enddateObject,startdateObject,differencebalance})
                        
        // });
         
     },

     edittransactionlist: async(req, res) => {
        // var deferred = q.defer();
       
    
var transactionid=req.body.transactionid;
var amount=req.body.amount
var descripation=req.body.descripation

var checkingQuery="select * from account_statements as cd where cd.id="+transactionid+"";
var checkingData=await commonFunction.getQueryResults(checkingQuery);
console.log(checkingQuery);
if (checkingData.length>0) {
    console.log('re');
    var checkdata=checkingData[0]
var condition=''

    if (checkdata.debit!=undefined&& checkdata.debit>0) {
        condition=",a.debit='"+amount+"'"
    }
    if (checkdata.credit!=undefined&& checkdata.credit>0) {
        condition=",a.credit='"+amount+"'"
    }
    var edittransactionlist="update account_statements as a set a.amount='"+amount+"',a.description='"+descripation+"' "+condition+" where id="+transactionid+""
    var editdata=await commonFunction.getQueryResults(edittransactionlist)

var updateQuery="update bank_statement as a set a.descripation='"+descripation+"' "+condition+" where a.date='"+checkdata.created_on+"' and a.descripation='"+checkdata.description+"' and a.debit='"+checkdata.debit+"' and a.credit='"+checkdata.credit+"' and a.transactionid=12 and a.account='"+checkdata.account+"'"
console.log('edit',updateQuery);
var updatedata=await commonFunction.getQueryResults(updateQuery)
res.json({status:1,message:" edit  transaction successfully"})
}
                //res.json({status:1,message:" bank index   list successfully",repsonse,startdate,enddate,enddateObject,startdateObject,differencebalance})
                        
        // });
         
     },

     getindexhoverlist: async(req, res) => {
        // var deferred = q.defer();
       
        var startdate=req.body.startdate;
        var endate=req.body.endate
        var account=req.body.account
        var statmentbalance=0;
        var paymentbalance=0
        var statementObject={}
        var paymentObject={}
        var statmentQuery="select *,SUM(cd.amount) AS totalamount from accountreconaltionlist as cd where cd.account in ('"+account+"') and cd.date >= '"+startdate+"' and cd.date <= '"+endate+"' ";
        var statmentdata=await commonFunction.getQueryResults(statmentQuery);
         if (statmentdata.length >0) {
            statmentdata.forEach(element => {
                statementObject[element.account]=element.totalamount
             });
         }


         var paymentquery="select *,c.account_name as accountname,sum(cd.debit-cd.credit) as total from  accounts  as c  inner join account_statements as cd  on c.id=cd.account  inner join account_types as ad on ad.id=c.account_type_id  and cd.account in ('"+ account+"') and (DATE_FORMAT(cd.created_on,'%Y-%m-%d') >= DATE('" + startdate + "') and DATE_FORMAT(cd.created_on,'%Y-%m-%d') <= DATE('" + endate + "') ) and cd.isUpoad!=1  group by cd.account"
         var paymentdata=await commonFunction.getQueryResults(paymentquery);
         console.log(paymentquery); 
         if (paymentdata.length >0) {
            paymentdata.forEach(element => {
                paymentObject[element.account]=element.total
              });
          }
          paymentbalance=paymentObject[account]?paymentObject[account]:0
          statmentbalance=statementObject[account]?statementObject[account]:0
        //var statmentquery="select * from  accountreconaltionlist as ac where ac.date ?";
       console.log(paymentObject);
        var difference=statmentbalance!=undefined && paymentbalance!=undefined? statmentbalance-paymentbalance:0
 
 
            
                res.json({status:1,message:"Bank  hover statment list successfully",statmentbalance,paymentbalance,difference})
             
           
              
        // });
         
     },
     addendingbalance: async(req, res) => {
        //var deferred = q.defer();


        var date=req.body.date;
        var amount=req.body.amount;
        var account=req.body.account;
        var checkingQuery="select * from accountreconaltionlist where account='"+account+"'and date='"+date+"'";
        var checkingdata=await commonFunction.getQueryResults(checkingQuery) 
        if(checkingdata.length==0)
        {
        
        var query="insert into accountreconaltionlist(account,date,amount)values('"+account+"','"+date+"','"+amount+"')";
        var data=await commonFunction.getQueryResults(query)
 
 
            if (data.insertId>0) {


                res.json({status:1,message:"Account reconaltionlist statment successfully"})
            }

        }
            else if(checkingdata.length > 0)
            {
                var query="update accountreconaltionlist set amount='"+amount+"'where account ='"+account+"' and date='"+date+"' limit 1";
                var data=await commonFunction.getQueryResults(query)
                if (data.affectedRows>0) {


                    res.json({status:1,message:"Account reconaltionlist updated  statment successfully"})
                }
            } 
                 
        // });
         
     },
     updateendingbalance: async(req, res) => {
        //var deferred = q.defer();


        var date=req.body.date;
        var amount=req.body.amount;
       // var account=req.body.account;
        var bankid=req.body.bankid;

var condition=''
        if (date!=''&&date!=undefined) {
            condition=",date ='"+date+"'"
        }
          var query="update  accountreconaltionlist set amount='"+amount+"' "+condition+" where id='"+bankid+"'";
        var data=await commonFunction.getQueryResults(query)
 
 
            if (data.affectedRows>0) {


                res.json({status:1,message:" update Account reconaltionlist statment successfully"})
            }
            else
            {
                res.json({status:0,message:"No data found"})
            } 
                 
        // });
         
     },
 

    


    
}


