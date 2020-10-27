var connection = require('../../../config');
var commonFunction = require('../../commonFunction');
var _ = require('lodash');
var moment=require('moment')
module.exports = {

    getaccountstransaction: async (req, res) => {
         
        var paymentaccountQuery="SELECT *,a.id as account_id,a.account_name as account_name,ac.name as accounttypename  FROM accounts as a inner join account_types as ac on ac.id=a.account_type_id where ac.id not in (3,6,12,13,15) group by a.id";
        var paymentaccountData=await commonFunction.getQueryResults(paymentaccountQuery);

console.log(paymentaccountQuery) 
        if(paymentaccountData.length > 0 )
        {


            var data = _(paymentaccountData)
            .groupBy('account_type_id')
            .map((objs, key) => ({
                  
                'account_type_id':key,
                'account_type_name': _.get(objs[0], 'accounttypename') ? _.get(objs[0], 'accounttypename') : '',
 
                'values':objs  
            }))
            .value();
            
            res.json({status:1,message:' account list',data})
            
        }
        else
        {

            res.json({status:0,message:'No  account list'})
            
        }


    },
    Incomebycustomer: async (req, res) => {
        let { start_date, end_date } = req.body
        let accountObject = {};
        let accountNameObject = {}
        let consignmentObject = {};
        let billObject = {};
        var bill = [];
        let incomes = [];
        let expense = []
        let incomepaymentObject=[];
        let expensepaymentObject=[];
        let expenseObject = {}
        let costofgoodsexpense=[];
        let operatingexpensetransaction=[];
        let costofgoodsexpensepayment=[];
        let operatingexpensepayment=[]
        var paymentdetails;

var condition=''

let reponse=[]
         
        var finalResponse = [];
        let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

        accountdata.forEach(element => {
            accountObject[element.accountypeid] = element.accounttypename;
            accountNameObject[element.accountid] = element.accountname
        });
 

let balancpaid={}

let paidobject={}
         
        let unpaidincomequery = "SELECT *,ac.shipper_code as shipper FROM  account_statements as ac  left join shipping as c on c.shipper_code=ac.shipper_code WHERE ac.account=20 and DATE_FORMAT(ac.created_on, '%Y-%m-%d')>= '" + start_date + "' AND DATE_FORMAT(ac.created_on, '%Y-%m-%d')  <= '" + end_date + "'  and ac.ispayment=0  and ac.from_id!=8 ";
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let unpaidincomedata = await commonFunction.getQueryResults(unpaidincomequery);
        
console.log(unpaidincomequery);
        let paidincomequery = "SELECT *,ac.shipper_code as shipper FROM  account_statements as ac  left join shipping as c on c.shipper_code=ac.shipper_code WHERE ac.account=20 and DATE_FORMAT(ac.created_on, '%Y-%m-%d') >= '" + start_date + "' AND DATE_FORMAT(ac.created_on, '%Y-%m-%d')  <= '" + end_date + "'  and ac.ispayment!=0 ";
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let paidincomedata = await commonFunction.getQueryResults(paidincomequery);

        let creditquery = "SELECT *,ac.shipper_code as shipper FROM  account_statements as ac  WHERE ac.account=20 and DATE_FORMAT(ac.created_on, '%Y-%m-%d') >= '" + start_date + "' AND DATE_FORMAT(ac.created_on, '%Y-%m-%d')  <= '" + end_date + "'  and ac.ispayment=0  and ac.from_id=8";
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let creditdata = await commonFunction.getQueryResults(creditquery);
        let uncreditquery = "SELECT *,ac.shipper_code as shipper FROM  account_statements as ac  WHERE ac.account=20 and DATE_FORMAT(ac.created_on, '%Y-%m-%d') >= '" + start_date + "' AND DATE_FORMAT(ac.created_on, '%Y-%m-%d')  <= '" + end_date + "'  and ac.ispayment=0  and ac.from_id=8";
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let uncreditdata = await commonFunction.getQueryResults(uncreditquery);
        
console.log(creditquery);
    if (unpaidincomedata.length > 0 ||paidincomedata.length > 0 ) {
      
        creditdata.forEach(element => {
            element.debit=0
            element.credit=element.amount
    
});
uncreditdata.forEach(element => {
    element.debit=element.amount
    element.credit=0

});
console.log(paidincomedata.length);
paidincomedata.push(...creditdata);
unpaidincomedata.push(...uncreditdata);
console.log('combined',paidincomedata.length);

        paidincomedata.forEach(element => {
            balancpaid[element.shipper]= (balancpaid[element.shipper]? balancpaid[element.shipper] : 0 ) + Number(element.amount)
            paidobject[element.shipper]=balancpaid[element.shipper]
        });
        reponse.push(...unpaidincomedata,...paidincomedata)
        
        var unpaid=_(unpaidincomedata)
        .groupBy('shipper')
        .map((objs, key) => ({
            'shipper_code': key,
            'shipper_name': _.get(objs[0], 'shipper_name'),
            'totalinvoice':  _.sumBy(objs, function (day) {
 
                return day.debit-day.credit//Math.abs(Number(day.credit)-Number(day.debit));
         
            }),

            
 
             
        }))


        var paid=_(paidincomedata)
        .groupBy('shipper')
        .map((objs, key) => ({
            'shipper_code': key,
            'shipper_name': _.get(objs[0], 'shipper_name'),
            'totalpaid': _.sumBy(objs, function (day) {
 
                return Math.abs(Number(day.credit)-Number(day.debit)) ;
         
            }),

            
 
             
        }))

var meragearray=[...unpaid,...paid]

var meragegrouping=_(meragearray)
.groupBy('shipper_code')
.map((objs, key) => ({
    'shipper_code': key,
    'shipper_name': _.get(objs[0], 'shipper_name'),
    'totalpaid':paidobject[key]?paidobject[key]:0,
    'totalinvoice':_.get(objs[0],'totalinvoice')!=undefined?_.get(objs[0],'totalinvoice'):0
}))




res.json({ status: 1, message: 'Income list successfully',paidobject,meragearray,unpaidincomedata,paid,unpaid,meragegrouping})

    }
         else

         {

            res.json({ status: 0, message: 'No data found' })
        }

       



    },

    agedpayables: async (req, res) => {
        let { start_date, end_date } = req.body
        let accountObject = {};
        let accountNameObject = {}
        let consignmentObject = {};
        let billObject = {};
        var bill = [];
        let incomes = [];
        let expense = []
        let incomepaymentObject=[];
        let expensepaymentObject=[];
        let expenseObject = {}
        let costofgoodsexpense=[];
        let operatingexpensetransaction=[];
        let costofgoodsexpensepayment=[];
        let operatingexpensepayment=[]
        var paymentdetails;
       

var condition=''

let reponse=[]
         
        var finalResponse = [];
        let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

        accountdata.forEach(element => {
            accountObject[element.accountypeid] = element.accounttypename;
            accountNameObject[element.accountid] = element.accountname
        });
 

let balancpaid={}

let paidobject={}
let restructure=[]
let vendorobject={};

var unpaidbillarray=[]
         let vendorquery="select * from vendors as v "
         let vendordata=await commonFunction.getQueryResults(vendorquery)
        
        if (vendordata.length > 0) {
            vendordata.forEach(element => {
                vendorobject[element.id]=element.name
            });
        }
         let unpaidincomequery = `SELECT id,vendor_id,
         SUM(IF(DATEDIFF(CURDATE(), payment_due_date )<=0, amount-amount_paid, 0)) as notyetdue,
             SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 1 AND 30, amount-amount_paid, 0)) AS age1to30,
             SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 31 AND 60, amount-amount_paid, 0)) AS age31to60,
             SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 61 AND 90, amount-amount_paid, 0)) AS age61to90,
             SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) > 90, amount-amount_paid, 0)) AS agegt90,
              (amount-amount_paid) AS totalBalance
         FROM psa_staging.bill   
         where isdelete=0 and bill_date<='`+end_date+`'
         
         GROUP BY id  
          `; //unpayment list of bill details
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let unpaidincomedata = await commonFunction.getQueryResults(unpaidincomequery);
        
console.log(unpaidincomequery);

if (unpaidincomedata.length > 0) {

    unpaidincomedata.forEach(element => {
        element.notyetdue=Math.abs(element.notyetdue);
        element.age1to30=Math.abs(element.age1to30);
        element.age31to60=Math.abs(element.age31to60);
        element.age61to90=Math.abs(element.age61to90);
        element.agegt90=Math.abs(element.agegt90);
     
 });

    var meragegrouping=_(unpaidincomedata)
    .groupBy('vendor_id')
    .map((objs, key) => ({
        'vendor_id': key,
        'vendor_name': vendorobject[key],
        'Notyetoverdueyet': _.sumBy(objs, function (day) {
 
            return Math.abs(day.notyetdue) ;
     
        }),
        'LessequalOverdue30days': _.sumBy(objs, function (day) {
 
            return Math.abs(day.age1to30) ;
     
        }),
        'UntilOverdue60days': _.sumBy(objs, function (day) {
 
            return Math.abs(day.age31to60) ;
     
        }),
        'UntilOverdue90days': _.sumBy(objs, function (day) {
 
            return Math.abs(day.age61to90) ;
     
        }),
        'GreaterOverdue90days': _.sumBy(objs, function (day) {
 
            return Math.abs(day.agegt90) ;
     
        }),


    }))
    


   res.json({status:1,message:'Aged payables list',meragegrouping,unpaidincomedata}) 
}
 
      //  let paidincomequery = "SELECT *,ac.vendor_id as vendor_id FROM  account_statements as ac  left join vendors as c on c.id=ac.vendor_id WHERE DATE_FORMAT(ac.created_on, '%Y-%m-%d') >= '" + start_date + "' AND DATE_FORMAT(ac.created_on, '%Y-%m-%d')  <= '" + end_date + "'  and ac.ispayment!=0 and ac.from_id=5"; //payment list of bill
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
       
        
        else
        {

                 
 
     

            res.json({ status: 0, message: 'No data found' })
        
        }
       



    },

    agedRecivables: async (req, res) => {
        let { start_date, end_date } = req.body
        let accountObject = {};
        let accountNameObject = {}
        let consignmentObject = {};
        let billObject = {};
        var bill = [];
        let incomes = [];
        let expense = []
        let incomepaymentObject=[];
        let expensepaymentObject=[];
        let expenseObject = {}
        let costofgoodsexpense=[];
        let operatingexpensetransaction=[];
        let costofgoodsexpensepayment=[];
        let operatingexpensepayment=[]
        var paymentdetails;
       

var condition=''

let reponse=[]
         
        var finalResponse = [];
        let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

        accountdata.forEach(element => {
            accountObject[element.accountypeid] = element.accounttypename;
            accountNameObject[element.accountid] = element.accountname
        });
 

let balancpaid={}

let paidobject={}
let restructure=[]
let vendorobject={};

var unpaidbillarray=[]
         let vendorquery="select * from vendors as v "
         let vendordata=await commonFunction.getQueryResults(vendorquery)
        
        if (vendordata.length > 0) {
            vendordata.forEach(element => {
                vendorobject[element.id]=element.name
            });
        }
         let invoiceQuery = ` SELECT id,invoice_no,shipper_code,
         SUM(IF(DATEDIFF(CURDATE(), payment_due_date )<=0, inv_total_amount-amount_paid, 0)) as notyetdue,
             SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 1 AND 30, inv_total_amount-amount_paid, 0)) AS age1to30,
             SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 31 AND 60, inv_total_amount-amount_paid, 0)) AS age31to60,
             SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 61 AND 90, inv_total_amount-amount_paid, 0)) AS age61to90,
             SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) > 90, inv_total_amount-amount_paid, 0)) AS agegt90,
              (inv_total_amount-amount_paid) AS totalBalance
         FROM invoice   
         where  invoice_date<='`+end_date+`'
         
         GROUP BY invoice_no   
          `; //unpayment list of bill details
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let invoiceData = await commonFunction.getQueryResults(invoiceQuery);
        


     
        
        let creditQuery = `SELECT id as creditid,shipper_code,
        SUM(IF(DATEDIFF(CURDATE(), payment_due_date )<=0, amount-amount_paid, 0)) as notyetdue,
            SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 1 AND 30, amount-amount_paid, 0)) AS age1to30,
            SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 31 AND 60, amount-amount_paid, 0)) AS age31to60,
            SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 61 AND 90, amount-amount_paid, 0)) AS age61to90,
            SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) > 90, amount-amount_paid, 0)) AS agegt90,
             (amount-amount_paid) AS totalBalance
        FROM credit_note   
        where  DATE_FORMAT(credit_date,'%Y-%m-%d')<=DATE_FORMAT('`+end_date+`','%Y-%m-%d')
        
        GROUP BY id     
          `; //unpayment list of bill details
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let creditData = await commonFunction.getQueryResults(creditQuery);
        


        let debitQuery = `SELECT id as debitid,shipper_code,
        SUM(IF(DATEDIFF(CURDATE(), payment_due_date )<=0, amount-amount_paid, 0)) as notyetdue,
            SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 1 AND 30, amount-amount_paid, 0)) AS age1to30,
            SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 31 AND 60, amount-amount_paid, 0)) AS age31to60,
            SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) BETWEEN 61 AND 90, amount-amount_paid, 0)) AS age61to90,
            SUM(IF(DATEDIFF(CURDATE(), payment_due_date ) > 90, amount-amount_paid, 0)) AS agegt90,
             (amount-amount_paid) AS totalBalance
        FROM debit_note   
        where  DATE_FORMAT(debit_date,'%Y-%m-%d')<=DATE_FORMAT('`+end_date+`','%Y-%m-%d')
        
        GROUP BY id  
          `; //unpayment list of bill details
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let debitData = await commonFunction.getQueryResults(debitQuery);
        




if (invoiceData.length > 0 || creditData.length > 0 || debitData.length > 0) {
   
   
   var response=[]

   response.push(...invoiceData,...creditData,...debitData)


   response.forEach(element => {
       element.notyetdue=Math.abs(element.notyetdue);
       element.age1to30=Math.abs(element.age1to30);
       element.age31to60=Math.abs(element.age31to60);
       element.age61to90=Math.abs(element.age61to90);
       element.agegt90=Math.abs(element.agegt90);
    
});
    var meragegrouping=_(response)
    .groupBy('shipper_code')
    .map((objs, key) => ({
        'shipper_code': key,
         
        'Notyetoverdueyet': _.sumBy(objs, function (day) {
 
            return Math.abs(day.notyetdue) ;
     
        }),
        'LessequalOverdue30days': _.sumBy(objs, function (day) {
 
            return Math.abs(day.age1to30) ;
     
        }),
        'UntilOverdue60days': _.sumBy(objs, function (day) {
 
            return Math.abs(day.age31to60) ;
     
        }),
        'UntilOverdue90days': _.sumBy(objs, function (day) {
 
            return Math.abs(day.age61to90) ;
     
        }),
        'GreaterOverdue90days': _.sumBy(objs, function (day) {
 
            return Math.abs(day.agegt90) ;
     
        })
        // 'GreaterOverdue90dayscount': _.filter(objs, function (day) {
 
        //     if(day.agegt90 > 0)
        //     {
        //         return day
        //     }
     
        // }).length,


    }))
    


   res.json({status:1,message:'Aged recivables list',meragegrouping,response}) 
}
 
      //  let paidincomequery = "SELECT *,ac.vendor_id as vendor_id FROM  account_statements as ac  left join vendors as c on c.id=ac.vendor_id WHERE DATE_FORMAT(ac.created_on, '%Y-%m-%d') >= '" + start_date + "' AND DATE_FORMAT(ac.created_on, '%Y-%m-%d')  <= '" + end_date + "'  and ac.ispayment!=0 and ac.from_id=5"; //payment list of bill
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
       
        
        else
        {

                 
 
     

            res.json({ status: 0, message: 'No data found' })
        
        }
       



    },

    Purchasebyvendor: async (req, res) => {
        let { start_date, end_date } = req.body
        let accountObject = {};
        let accountNameObject = {}
        let consignmentObject = {};
        let billObject = {};
        var bill = [];
        let incomes = [];
        let expense = []
        let incomepaymentObject=[];
        let expensepaymentObject=[];
        let expenseObject = {}
        let costofgoodsexpense=[];
        let operatingexpensetransaction=[];
        let costofgoodsexpensepayment=[];
        let operatingexpensepayment=[]
        var paymentdetails;

var condition=''

let reponse=[]
         
        var finalResponse = [];
        let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

        accountdata.forEach(element => {
            accountObject[element.accountypeid] = element.accounttypename;
            accountNameObject[element.accountid] = element.accountname
        });
 

let balancpaid={}

let paidobject={}
let restructure=[]
let vendorobject={};

var unpaidbillarray=[]
         let vendorquery="select * from vendors as v "
         let vendordata=await commonFunction.getQueryResults(vendorquery)
        
        if (vendordata.length > 0) {
            vendordata.forEach(element => {
                vendorobject[element.id]=element.name
            });
        }
         let unpaidincomequery = "SELECT *,ad.type as acctype,a.account_name as account_name ,a.id as account_id,ac.vendor_id as vendor_id FROM  account_statements as ac  left join vendors as c on c.id=ac.vendor_id left join accounts as a on a.id=ac.account inner join  account_types  as ad on a.account_type_id=ad.id WHERE  DATE_FORMAT(ac.created_on, '%Y-%m-%d')>= '" + start_date + "' AND DATE_FORMAT(ac.created_on, '%Y-%m-%d')  <= '" + end_date + "'  and ac.ispayment=0  and ac.from_id=3  "; //unpayment list of bill details
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let unpaidincomedata = await commonFunction.getQueryResults(unpaidincomequery);
        
console.log(unpaidincomequery);

let paidincomequery = "select *,at.type as acctype,a.account_name as account_name ,a.id as account_id, bd.expense_category as expenseaccount,p.bill_id as paymentbillid,at.type as acctype,b.id as billid,bd.item_name,bd.total_amount as itemamount,bd.id as billdetailsid,p.amount as paymentamount,b.amount as totalbillamount  from bill  as b inner join bill_details as bd on b.id=bd.bill_id inner join payments as p on p.bill_id=b.id left join accounts as a on a.id=bd.expense_category inner join account_types as at on a.account_type_id=at.id where p.type=2  and DATE_FORMAT(p.paymentdate,'%Y-%m-%d') >= DATE('"+start_date+"')  and DATE_FORMAT(p.paymentdate,'%Y-%m-%d') <= DATE('"+end_date+"') and  p.account not in (20,22,21) and bd.isdelete=0 and b.isdelete=0 group by bd.id,p.id"; //payment list of bill
      //  let paidincomequery = "SELECT *,ac.vendor_id as vendor_id FROM  account_statements as ac  left join vendors as c on c.id=ac.vendor_id WHERE DATE_FORMAT(ac.created_on, '%Y-%m-%d') >= '" + start_date + "' AND DATE_FORMAT(ac.created_on, '%Y-%m-%d')  <= '" + end_date + "'  and ac.ispayment!=0 and ac.from_id=5"; //payment list of bill
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
       
        let paidincomedata = await commonFunction.getQueryResults(paidincomequery);

                 console.log('paid',paidincomequery)
 
    if (unpaidincomedata.length > 0 ||paidincomedata.length > 0 ) {
      
         
// console.log(paidincomedata.length);
// paidincomedata.push(...creditdata);
// unpaidincomedata.push(...uncreditdata);
console.log('combined',paidincomedata.length);

unpaidincomedata.forEach(element => {
    if (element.vendor_id!=undefined&&element.vendor_id!='') {
    if (element.acctype=='Expenses') {
        unpaidbillarray.push(element)
    }
    if (element.acctype=='Assets') {
        unpaidbillarray.push(element) 
    }

}
});

        paidincomedata.forEach(element => {
            if (element.vendor_id!=undefined&&element.vendor_id!='') {
                if (element.acctype=='Expenses') {
                    restructure.push(element)
                }
                if (element.acctype=='Assets') {
                    restructure.push(element) 
                }
            }
             
            
        });



        var seperateunpaid=
        _(unpaidbillarray)
        .groupBy('acctype')
        .map((objs, key) => ({
            'acctype': key,
             
            'values':   objs 
 
             
        }))
        var sepearttypepaid=_(restructure)
        .groupBy('acctype')
        .map((objs, key) => ({
            'acctype': key,
             
            'values':   objs 
 
             
        }))
        Object.keys(sepearttypepaid).forEach(function (item) {
             var val=sepearttypepaid[item]
             _.forEach(val, function(value, key,arr) { 

                if (value.billid==value.paymentbillid && value.vendor_id!=undefined && value.vendor_id!='') {
                  var values=Number(value.itemamount/value.totalbillamount * value.paymentamount) //Number((value.itemamount/value.totalbillamount )* value.paymentamount).toFixed(2)
                    
                    value.amountvalue=Number(values).toFixed(2)
                    console.log('value',parseFloat(values));
    
                    balancpaid[value.vendor_id]= (balancpaid[value.vendor_id]? balancpaid[value.vendor_id] : 0 ) + Number(values) 
                paidobject[value.vendor_id]=Number(balancpaid[value.vendor_id]).toFixed(2)
                }
                // value.amountvalue=
              });
    
          
        });
var paidarray=[];
var unpaidarray=[]
         // reponse.push(...unpaidincomedata,...paidincomedata)
        

         let newMappedunpaid = [seperateunpaid.reduce(function(acc, curr) {
            
            unpaidarray.push (... _(curr.values)
             .groupBy('vendor_id')
             .map((objs, key) => ({
                 'vendor_id': key,
                 acctype:_.get(objs[0], 'acctype'),
                 'accountname':_.get(objs[0], 'account_name'),
                 account:_.get(objs[0], 'account_id'),
                 'vendor_name':  vendorobject[key]?vendorobject[key]:'',
                 'allpurchase':  _.sumBy(objs, function (day) {
      
                      return day.amount;
              
                 }),
     
                 
      
                  
             })))
             //return acc;
           }, {})];

         let newMappedpaid = [sepearttypepaid.reduce(function(acc, curr) {
            
           paidarray.push (... _(curr.values)
            .groupBy('vendor_id')
            .map((objs, key) => ({
                'vendor_id': key,
                acctype:_.get(objs[0], 'acctype'),
                'accountname':_.get(objs[0], 'account_name'),
                account:_.get(objs[0], 'account_id'),
                'vendor_name':  vendorobject[key]?vendorobject[key]:'',
                'paidpurchase':  _.sumBy(objs, function (day) {
     
                     return     Number(day.amountvalue)//Math.abs(Number(day.credit)-Number(day.debit));
             
                }),
    
                
     
                 
            })))
            //return acc;
          }, {})];
        // var unpaid=_(unpaidincomedata)
        // .groupBy('vendor_id')
        // .map((objs, key) => ({
        //     'vendor_id': key,
        //     acctype:_.get(objs[0], 'acctype'),
        //     'accountname':_.get(objs[0], 'account_name'),
        //     account:_.get(objs[0], 'account_id'),
        //     'vendor_name':  vendorobject[key]?vendorobject[key]:'',
        //     'totalbill':  _.sumBy(objs, function (day) {
 
        //         return day.itemamount//Math.abs(Number(day.credit)-Number(day.debit));
         
        //     }),

            
 
             
        // }))


        // var paid=_(restructure)
        // .groupBy('vendor_id')
        // .map((objs, key) => ({
        //     'vendor_id': key,
        //     acctype:_.get(objs[0], 'acctype'),
        //     'accountname':_.get(objs[0], 'account_name'),
        //     account:_.get(objs[0], 'account_id'),
        //     'vendor_name':  vendorobject[key]?vendorobject[key]:'',
        //     'totalpaid': _.sumBy(objs, function (day) {
 
        //         return Number(day.amountvalue) ;
         
        //     }),

            
 
             
        // }))

        unpaidarray.forEach(element => {
            element.paidpurchase=0
        });

        paidarray.forEach(element => {
            element.allpurchase=0
        });


        let vendormerage=[]
var meragearray=[...unpaidarray,...paidarray]


var sepearttypemerage=_(meragearray)
        .groupBy('acctype')
        .map((objs, key) => ({
            'acctype': key,
             
            'values':   objs 
 
             
        }))

        var meragegroupingarray=[]
 let meragegroupping= [sepearttypemerage.reduce(function(acc, curr) {
        meragegroupingarray.push(..._(curr.values)
.groupBy('vendor_id')
.map((objs, key) => ({
    'vendor_id': key,
    acctype:_.get(objs[0], 'acctype'),
            'accountname':_.get(objs[0], 'account_name'),
            account:_.get(objs[0], 'account_id'),
            'vendor_name':  vendorobject[_.get(objs[0], 'vendor_id')]?vendorobject[_.get(objs[0], 'vendor_id')]:'',
    'paidpurchase':_.sumBy(objs, function (day) {
 
                 return Number(day.paidpurchase) ;
         
             }),
    'allpurchase':_.sumBy(objs, function (day) {
 
                return Number(day.allpurchase) ;
         
             })
})))
}, {})];


// var sepertetype=_(meragegrouping)
// .groupBy('acctype')
// .map((objs, key) => ({
//     'acctype': key,
//      values:objs
// }))


res.json({ status: 1, message: 'Purchase vendor list successfully',meragegroupingarray,sepearttypemerage })

    }
         else

         {

            res.json({ status: 0, message: 'No data found' })
        }

       



    },


    

    //sep17backup
//     Incomebycustomer: async (req, res) => {
//         let { start_date, end_date } = req.body
//         let accountObject = {};
//         let accountNameObject = {}
//         let consignmentObject = {};
//         let billObject = {};
//         var bill = [];
//         let incomes = [];
//         let expense = []
//         let incomepaymentObject=[];
//         let expensepaymentObject=[];
//         let expenseObject = {}
//         let costofgoodsexpense=[];
//         let operatingexpensetransaction=[];
//         let costofgoodsexpensepayment=[];
//         let operatingexpensepayment=[]
//         var paymentdetails;

// var condition=''

// let reponse=[]
         
//         var finalResponse = [];
//         let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

//         let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

//         accountdata.forEach(element => {
//             accountObject[element.accountypeid] = element.accounttypename;
//             accountNameObject[element.accountid] = element.accountname
//         });
 

// let balancpaid={}

// let paidobject={}
         
//         let unpaidincomequery = "SELECT *,inv.shipper_code as shipper FROM invoice as inv left join account_statements as ac on inv.invoice_no=ac.invoice_number WHERE ac.account=20 and inv.invoice_date >= '" + start_date + "' AND inv.invoice_date  <= '" + end_date + "'  and inv.status='UnPaid'  group by inv.invoice_no ";
//         //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
//         let unpaidincomedata = await commonFunction.getQueryResults(unpaidincomequery);
        

//         let paidincomequery = "SELECT *,inv.shipper_code as shipper FROM invoice as inv left join account_statements as ac on inv.invoice_no=ac.invoice_number WHERE ac.account=20 and ac.created_on >= '" + start_date + "' AND ac.created_on  <= '" + end_date + "'  and inv.status!='Unpaid'  group by inv.invoice_no ";
//         //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
//         let paidincomedata = await commonFunction.getQueryResults(paidincomequery);

         
//     if (unpaidincomedata.length > 0 ||paidincomedata.length > 0 ) {
      


//         paidincomedata.forEach(element => {
//             balancpaid[element.shipper]= (balancpaid[element.shipper]? balancpaid[element.shipper] : 0 ) + Number(element.amount_paid)
//             paidobject[element.shipper]=balancpaid[element.shipper]
//         });
//         reponse.push(...unpaidincomedata,...paidincomedata)
        
//         var unpaid=_(unpaidincomedata)
//         .groupBy('shipper')
//         .map((objs, key) => ({
//             'shipper_code': key,
//             'shipper_name': _.get(objs[0], 'shipper_name'),
//             'totalinvoice':  _.sumBy(objs, function (day) {
 
//                 return Number(day.inv_total_amount) ;
         
//             }),

            
 
             
//         }))


//         var paid=_(paidincomedata)
//         .groupBy('shipper')
//         .map((objs, key) => ({
//             'shipper_code': key,
//             'shipper_name': _.get(objs[0], 'shipper_name'),
//             'totalpaid': _.sumBy(objs, function (day) {
 
//                 return day.amount_paid ;
         
//             }),

            
 
             
//         }))

// var meragearray=[...unpaid,...paid]

// var meragegrouping=_(meragearray)
// .groupBy('shipper_code')
// .map((objs, key) => ({
//     'shipper_code': key,
//     'shipper_name': _.get(objs[0], 'shipper_name'),
//     'totalpaid':paidobject[key]?paidobject[key]:0,
//     'totalinvoice':_.get(objs[0],'totalinvoice')!=undefined?_.get(objs[0],'totalinvoice'):0
// }))




// res.json({ status: 1, message: 'Income list successfully',paidincomedata,meragearray,unpaidincomedata,paid,unpaid,meragegrouping})

//     }
//          else

//          {

//             res.json({ status: 0, message: 'No data found' })
//         }

       



//     },

    getallAccounts: async (req, res) => {
         
       
        let accounttypeQuery = "Select *  from accounts as a   ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

         
 
if (accountdata.length > 0 ) {
    res.json({status:1,message:'Accounts list',accountdata})
}

else
{
    res.json({status:0,message:'No accounts found'})
}



         
    }, 
   
    getpaymentaccount: async (req, res) => {
         
        var paymentaccountQuery="SELECT *,a.id as account_id,a.account_name as account_name  FROM accounts as a inner join account_types as ac on ac.id=a.account_type_id where a.account_type_id=1 group by a.id";
        var paymentaccountData=await commonFunction.getQueryResults(paymentaccountQuery);

console.log(paymentaccountQuery) 
        if(paymentaccountData.length > 0 )
        {

            let data=paymentaccountData
            res.json({status:1,message:'payment account list',data})
            
        }
        else
        {

            res.json({status:0,message:'No payment account list'})
            
        }


    },

    
  
    Generalledger: async (req, res) => {
        let { start_date, end_date, report_type,account_id } = req.body
        let accountObject = {};
        let categoryObject={};
        let accountNameObject = {}
        let consignmentObject = {};
        let billObject = {};
        var bill = [];
        let incomes = [];
        let expense = []
        let incomepaymentObject=[];
        let expensepaymentObject=[];
        let expenseObject = {}
        let costofgoodsexpense=[];
        let operatingexpensetransaction=[];
        let costofgoodsexpensepayment=[];
        let operatingexpensepayment=[]
        var paymentdetails;
        let filter=req.body.filterid
console.log(req.body)
var condition=''
var account_condition=''
var filter_condition=''
if (filter!=undefined && filter!='') {
    filter_condition="and(( a.shipper_code='"+filter+"') or (vendor_id='"+filter+"') and a.vendor_id!='')"
}

if (account_id!=undefined && account_id!='') {
    account_condition="and a.account='"+account_id+"'"
}
var closingbalanceObject={}
        if(report_type==2)
        {
            condition=" and a.ispayment=1"
        }
        var finalResponse = [];
        let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

        accountdata.forEach(element => {
            accountObject[element.accountypeid] = element.accounttypename;
            accountNameObject[element.accountid] = element.accountname
        });
        //paymentQuery
        // let paymentQuery = "Select *,p.account as account_id from payments as p left join accounts as a on p.account=a.id  inner join account_types as at on at.id=a.account_type_id where p.created_date >= '" + start_date + "' AND p.created_date  <= '" + end_date + "' group by p.id"
        // let paymentData = await commonFunction.getQueryResults(paymentQuery);

        var opeingbalanceObject={}
        var finalreponse=[];

        var  opeingbalance="select *,sum(a.debit-a.credit) as balance   from account_statements as a where     DATE_FORMAT(a.created_on, '%Y-%m-%d')  <  DATE_FORMAT('" + start_date + "','%Y-%m-%d')  " + condition + " "+account_condition+" "+filter_condition+" group by a.account";
        var openingtotalbalance=await commonFunction.getQueryResults(opeingbalance);
    //     if(is_reconcile==1)
    //     {
    //        opeingbalance="select *    from importedbanklist as c where c.client_id=" +client_id+ " and c.bankid=" +bank_id+ "  and c.status=0  and  is_bank_reconcile=1 DATE_FORMAT(date, '%Y-%m-%d')  <  DATE_FORMAT('" + from_date + "','%Y-%m-%d') group by c.id  ";
    //    }
    openingtotalbalance.forEach(element => {
        opeingbalanceObject[element.account]=element.balance
    });
    var lastclosingbalance={}
    
console.log(opeingbalance)
let defaultclosingbalance=[];
let changedlistclosingbalance=[];
var  closingbalance="select *,sum(a.debit-a.credit) as balance,sum(a.debit) as totaldebit,sum(a.credit) as totalcredit from account_statements as a where a.from_id!=12 and DATE_FORMAT(a.created_on, '%Y-%m-%d')  >=  DATE_FORMAT('" + start_date + "','%Y-%m-%d') and   DATE_FORMAT(a.created_on, '%Y-%m-%d')  <=  DATE_FORMAT('" + end_date + "','%Y-%m-%d') " + condition + "  "+account_condition+" "+filter_condition+" group by a.account"
//var  closingbalance="select *,sum(a.debit-a.credit) as balance,sum(a.debit) as totaldebit,sum(a.credit) as totalcredit from account_statements as a where     DATE_FORMAT(a.created_on, '%Y-%m-%d')  <=  DATE_FORMAT('" + end_date + "','%Y-%m-%d') " + condition + "  "+account_condition+" group by a.account"
  
 var closingtotalbalance=await commonFunction.getQueryResults(closingbalance);


 var transactionclosingbalance="select *,a.type as actype from account_statements as a where a.from_id=12 and DATE_FORMAT(a.created_on, '%Y-%m-%d')  >=  DATE_FORMAT('" + start_date + "','%Y-%m-%d') and   DATE_FORMAT(a.created_on, '%Y-%m-%d')  <=  DATE_FORMAT('" + end_date + "','%Y-%m-%d') " + condition + "  "+account_condition+" "+filter_condition+" group by a.account"
 var transactionclosingdata=await commonFunction.getQueryResults(transactionclosingbalance)
 
 
 let deafultlistObject={}
 let changedlistobject={}
if (transactionclosingdata.length > 0) {
    

    console.log('prank goes wrong')
    transactionclosingdata.forEach(element => {
           if (element.actype=='Income') {
               element.account=element.category!=undefined && element.category > 0 ?element.category:element.account
            //    element.credit=element.amount
            //    element.debit=0
           }
           if (element.actype=='Expenses') {
            element.account=element.category!=undefined && element.category > 0 ?element.category:element.account
            // element.credit=0
            // element.debit=element.amount
        }
    
        defaultclosingbalance.push(element)
       }); 
    
    
       transactionclosingdata.forEach(element => {
         
             
         //    element.credit=element.amount
         //    element.debit=0
         
         
         element.account=element.account
         // element.credit=0
         // element.debit=element.amount
     
    
     
    }); 
    
       //console.log('prank goes wrong',defaultlist)
    
       transactionclosingdata.forEach(element => {
        if (element.actype=='Income') {
            element.credit=0
            element.debit=element.amount
        }
        if (element.actype=='Expenses') {
         element.credit=element.amount
         element.debit=0
     }
    
     changedlistclosingbalance.push(element)
    });

    //console.log('name',changedlistclosingbalance);
    
    defaultclosingbalance.forEach(element => {
        deafultlistObject[element.account]=
    {
    totalbalance:'',
    totaldebit: _.sumBy(defaultclosingbalance, function (day) {
 
        return Number(day.debit);
 
    }),
    totalcredit:_.sumBy(defaultclosingbalance, function (day) {
 
        return Number(day.credit);
 
    }),
}
});
console.log('defaultobject',deafultlistObject)
changedlistclosingbalance.forEach(element => {
    changedlistobject[element.account]=
{
totalbalance:'',
totaldebit: _.sumBy(changedlistclosingbalance, function (day) {

    return Number(day.debit);

}),
totalcredit:_.sumBy(changedlistclosingbalance, function (day) {

    return Number(day.credit);

}),
}
});
console.log('change',changedlistobject)



    }
 

   
 closingtotalbalance.forEach(element => {
    closingbalanceObject[element.account]=
    {
    totalbalance:element.balance!=undefined?element.balance:'',
    totaldebit:element.totaldebit!=undefined?element.totaldebit:0,
    totalcredit:element.totalcredit!=undefined?element.totalcredit:0
}
});
console.log('object',changedlistobject,deafultlistObject);
Object.assign(closingbalanceObject, changedlistobject)
Object.assign(closingbalanceObject, deafultlistObject)
//closingbalanceObject ={...changedlistobject,...deafultlistObject};
//closingbalanceObject=deafultlistObject
let defaultlist=[]
let changedlist=[]
var transactionlist="Select *,a.type as actype,a.created_on as accdate,ad.type as accountype,a.account as account_id,a.id as accountstatmentid from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.from_id=12 and  a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  " + condition + " "+account_condition+"  "+filter_condition+" group by a.id order by a.created_on "
var transactionitems=await commonFunction.getQueryResults(transactionlist);


if (transactionitems.length > 0) {
    

console.log('prank goes wrong')
    transactionitems.forEach(element => {
       if (element.actype=='Income') {
           element.account=element.category!=undefined && element.category > 0 ?element.category:element.account
        //    element.credit=element.amount
        //    element.debit=0
       }
       if (element.actype=='Expenses') {
        element.account=element.category!=undefined && element.category > 0 ?element.category:element.account
        // element.credit=0
        // element.debit=element.amount
    }

    defaultlist.push(element)
   }); 

   var removed=removeduplicates(defaultlist)

   transactionitems.forEach(element => {
     
         
     //    element.credit=element.amount
     //    element.debit=0
     
     
     element.account=element.account
     // element.credit=0
     // element.debit=element.amount
 

 
}); 

   //console.log('prank goes wrong',defaultlist)

   transactionitems.forEach(element => {
    if (element.actype=='Income') {
        element.credit=0
        element.debit=element.amount
    }
    if (element.actype=='Expenses') {
     element.credit=element.amount
     element.debit=0
 }

 changedlist.push(element)
});
}
//console.log('prank goes change',changedlist)

        // //billdetailsQuery
        // let billDetailsQuery = "Select * from bill as b inner join  bill_details as bd on b.id=bd.bill_id inner join accounts as ac on ac.id=bd.expense_category where b.bill_date >= '" + start_date + "' AND b.bill_date  <= '" + end_date + "' and b.isdelete = 0 ";
        // let billDetailsdata = await commonFunction.getQueryResults(billDetailsQuery);
        
        
        let transactionQuery = " Select *,a.created_on as accdate,ad.type as accountype,a.account as account_id,a.id as accountstatmentid from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.from_id!=12 and  a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  " + condition + " "+account_condition+"  "+filter_condition+" group by a.id order by a.created_on ";
        
        //recent let transactionQuery = " Select *,a.created_on as accdate,ad.type as accountype,a.account as account_id,a.id as accountstatmentid from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where DATE_FORMAT(a.created_on,'%Y-%m-%d') >=  DATE('" + start_date + "') AND DATE_FORMAT(a.created_on,'%Y-%m-%d')  <= DATE('" + end_date + "')  " + condition + " "+account_condition+" "+filter_condition+" group by a.id order by a.created_on ";
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let transactionData = await commonFunction.getQueryResults(transactionQuery);
     
        
        console.log(transactionQuery)
        // var costoofgoodsdetails = _(costofgoodsexpense)
        //     .groupBy('account_id')
        //     .map((objs, key) => ({
        //         'account_id': key,
        //         'account_type_id': _.get(objs[0], 'account_type_id'),
        //         'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
        //         'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
        //         'total': _.sumBy(objs, function (day) {

        //             return day.debit - day.credit;

        //         })
        //     }))


        var final=[]
    
 var categorybalance={}
 transactionData.push(...removed,...changedlist)
        transactionData.forEach(element => {

         
             if(categoryObject[element.account]==undefined)
             {
                categoryObject[element.account]=[];
            }

            
           


             


 //categorybalance[element.account]=categorybalance[element.account]-(element.debit-element.credit)

 
         categoryObject[element.account].push({
             date:moment(element.accdate).format('YYYY-MM-DD'),
             id:element.accountstatmentid,
             accountname:accountNameObject[element.account],
             account:element.account,
             debit:Number(element.debit),
             credit:Number(element.credit),
             balance:0,
             invoiceno:element.invoice_no,
             bill_no:element.bill_no,
             credit_no:element.credit_no,
             credit_detail_no:element.credit_no,
             debit_detail_no:element.debit_detail_id,
             bill_detail_no:element.bill_detail_id,
             type:element.types,
            descripation:element.description,
             accountype:element.accountype

         })

        

    });



 


    Object.keys(categoryObject).forEach(function(key) {
        var val = categoryObject[key];


        categorybalance[key]=opeingbalanceObject[key]?opeingbalanceObject[key]:0


        val.forEach(element => {
            
            // if(element.debit!=undefined)
            // {

                 
                
            //}

            console.log('before',element.accountype)
             
            if(element.accountype=='Liabilities & Credit Cards')
            {
                console.log('sls')
                categorybalance[key]=categorybalance[key] + (element.credit)-(element.debit)
            }
            if(element.accountype=='Assets')
            {
            categorybalance[key]=categorybalance[key] + (element.debit)-(element.credit)
        }
        if(element.accountype=='Expenses')
        {
        categorybalance[key]=categorybalance[key] + (element.debit)-(element.credit)
    }

        if(element.accountype=='Income')
        {
        categorybalance[key]=categorybalance[key] + (element.credit)-(element.debit)
    }

    if(element.accountype=='Equity')
    {
    categorybalance[key]=categorybalance[key] + (element.credit)-(element.debit)
}
            element.balance=categorybalance[key]


        });
         
      });


      console.clear();
      console.log('closingbalanceObject',closingbalanceObject);
    Object.keys(categoryObject).forEach(function(key) {
        var val = categoryObject[key];


         

        if (val.length > 0) {
            val.forEach(element => {
            
                // if(element.debit!=undefined)
                // {
    
                    lastclosingbalance[element.account]=element.balance!=undefined&&element.balance!=''?element.balance:0
                    if (closingbalanceObject[element.account]!=undefined && closingbalanceObject[element.account]!='') {
                        closingbalanceObject[element.account].totalbalance=element.balance!=undefined&&element.balance!=''?element.balance:0
                    }
                    
                    
                //}
    
                 
                 
                 
                 
    
    
            });
        }

       
         
      });

console.log('ssss',lastclosingbalance,'s',closingbalanceObject)

    //   Object.keys(categoryObject).forEach(function(key) {
    //     var val = categoryObject[key];


         


    //     val.forEach(element => {
            
    //          element.balance=categorybalance[element.acc]

    //     });
         
    //   });



    accountdata.forEach(element => {
        finalResponse.push({
            type:element.type,
            account_name: accountNameObject[element.accountid],
            accounttype:accountObject[element.account_type_id],
            startingbalance:opeingbalanceObject[element.accountid]?opeingbalanceObject[element.accountid]:0,
            data:categoryObject[element.accountid]?categoryObject[element.accountid]:[],
            total_and_ending_balance:closingbalanceObject[element.accountid]?closingbalanceObject[element.accountid]:'',
            //balancechange:Number((opeingbalanceObject[element.accountid]!=undefined?opeingbalanceObject[element.accountid]:0)-(closingbalanceObject[element.accountid].totalbalance!=undefined?closingbalanceObject[element.accountid].totalbalance:0))
        })

    

var s=closingbalanceObject[element.accountid]
        console.log('name')
    });
    var duplicateremoved=new Set(finalResponse)
    var removed=[...duplicateremoved]

        

        
        res.json({ status: 1, message: 'general ledger',closingbalanceObject,data:removed,openingtotalbalance,opeingbalanceObject,categorybalance })



    },
    ProfitandLossreport: async (req, res) => {
        let { start_date, end_date, report_type } = req.body
        let accountObject = {};
        let accountNameObject = {}
        let consignmentObject = {};
        let billObject = {};
        var bill = [];
        let incomes = [];
        let expense = []
        let incomepaymentObject=[];
        let expensepaymentObject=[];
        let expenseObject = {}
        let costofgoodsexpense=[];
        let operatingexpensetransaction=[];
        let costofgoodsexpensepayment=[];
        let operatingexpensepayment=[]
        var paymentdetails;

var condition=''
        if(report_type==2)
        {
            condition=" and a.ispayment=1"
        }
        var finalResponse = [];
        let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

        accountdata.forEach(element => {
            accountObject[element.accountypeid] = element.accounttypename;
            accountNameObject[element.accountid] = element.accountname
        });
        //paymentQuery
        // let paymentQuery = "Select *,p.account as account_id from payments as p left join accounts as a on p.account=a.id  inner join account_types as at on at.id=a.account_type_id where p.created_date >= '" + start_date + "' AND p.created_date  <= '" + end_date + "' group by p.id"
        // let paymentData = await commonFunction.getQueryResults(paymentQuery);




        // //billdetailsQuery
        // let billDetailsQuery = "Select * from bill as b inner join  bill_details as bd on b.id=bd.bill_id inner join accounts as ac on ac.id=bd.expense_category where b.bill_date >= '" + start_date + "' AND b.bill_date  <= '" + end_date + "' and b.isdelete = 0 ";
        // let billDetailsdata = await commonFunction.getQueryResults(billDetailsQuery);
        let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where DATE_FORMAT(a.created_on,'%Y-%m-%d') >=DATE('" + start_date + "') AND DATE_FORMAT(a.created_on,'%Y-%m-%d') <=DATE('" + end_date + "')  " + condition + " group by a.id ";
        //let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let transactionData = await commonFunction.getQueryResults(transactionQuery);
        // paymentData.forEach(element => {

        //     if(element.type=='Income')

        //     {

        //         incomepaymentObject.push(element)
        //     }
        //     if(element.type=='Expense')

        //     {
        //         // if (expensepaymentObject[element.account_type_id==undefined]) {
        //         //     expensepaymentObject[element.account_type_id]=[];
        //         // }


        //         expensepaymentObject.push(element)
        //     }



        // });

        // expensepaymentObject.forEach(element => {
        //     if (element.account_type_id == 24) {
    
        //         operatingexpensepayment.push(element)
        //     }
        //     if (element.account_type_id == 25) {
        //         costofgoodsexpensepayment.push(element)
        //     }
           
        // });



        transactionData.forEach(element => {
            if (element.accountype =='Income') {
                incomes.push(element)
            }
            if (element.accountype =='Expenses') {
                expense.push(element)
            }
        });



        // billDetailsdata.forEach(item => {
        //     item.account_id = item.expense_category;
        // });
        // accountdata.forEach(item1 => {
        //     billDetailsdata.forEach(item2 => {


        //   });
        // });


        //console.log('cost', paymentQuery)


        // if (billDetailsdata.length > 0) {
        //     var billdetails =
        //         _(billDetailsdata)
        //             .groupBy('account_id')
        //             .map((objs, key) => ({
        //                 'account_id': key,
        //                 'account_type_id': _.get(objs[0], 'account_type_id'),
        //                 'account_type_name': accountObject[_.get(objs[0], 'account_type_id')],
        //                 'account_id_name': accountNameObject[key],
        //                 'total': _.sumBy(objs, function (day) {

        //                     return day.debit - day.credit;

        //                 })
        //             }))
        //             .value();



        //     billdetails.forEach(element => {

        //         if (billObject[element.account_type_id] == undefined) {

        //             billObject[element.account_type_id] = [];
        //         }
        //         billObject[element.account_type_id].push(element)


        //     });

        // }



        // expense.forEach(element => {

        //     if (expenseObject[element.account_type_id] == undefined) {

        //         expenseObject[element.account_type_id] = [];
        //     }
        //     expenseObject[element.account_type_id].push(element)



        // });



        

        expense.forEach(element => {

                if (element.account_type_id == 24) {
    
                    operatingexpensetransaction.push(element)
                }
                if (element.account_type_id == 25) {
                    costofgoodsexpense.push(element)
                }
               
    
    
            });


         
            

             
            // var costoofgoodspaymentdetails = _(costofgoodsexpensepayment)
            // .groupBy('account_id')
            // .map((objs, key) => ({
            //     'account_id': key,
            //     'account_type_id': _.get(objs[0], 'account_type_id'),
            //     'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            //     'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            //     'total': _.sumBy(objs, function (day) {

            //         return day.debit - day.credit;

            //     })
            // }))
            // .value();

            // var operationexpensepaymentdetails = _(operatingexpensepayment)
            // .groupBy('account_id')
            // .map((objs, key) => ({
            //     'account_id': key,
            //     'account_type_id': _.get(objs[0], 'account_type_id'),
            //     'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            //     'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            //     'total': _.sumBy(objs, function (day ,n) {

            //         return day.debit - day.credit;

            //     })
            // }))
            // .value();
            var costoofgoodsdetails = _(costofgoodsexpense)
            .groupBy('account_id')
            .map((objs, key) => ({
                'account_id': key,
                'account_type_id': _.get(objs[0], 'account_type_id'),
                'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
                'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
                'total': _.sumBy(objs, function (day) {

                    return day.debit - day.credit;

                })
            }))
            .value();

            var operationexpensedetails = _(operatingexpensetransaction)
            .groupBy('account_id')
            .map((objs, key) => ({
                'account_id': key,
                'account_type_id': _.get(objs[0], 'account_type_id'),
                'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
                'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
                'total': _.sumBy(objs, function (day) {

                    return day.debit - day.credit;

                })
            }))
            .value();
        var transactiondetails = _(incomes)
            .groupBy('account_id')
            .map((objs, key) => ({
                'account_id': key,
                'account_type_id': _.get(objs[0], 'account_type_id'),
                'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
                'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
                'total': _.sumBy(objs, function (day) {

                    return day.credit - day.debit;

                })
            }))
            .value();

        // if (paymentData.length > 0) {
        //     paymentdetails =
        //         _(incomepaymentObject)
        //             .groupBy('account_id')
        //             .map((objs, key) => ({
        //                 'account_id': key,
        //                 'account_type_id': _.get(objs[0], 'account_type_id'),
        //                 'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
        //                 'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
        //                 'total': _.sumBy(objs, function (day) {

        //                     return day.credit - day.debit;

        //                 })
        //             }))
        //             .value();
        // }


        let incomearray = [];
        let Costofgoodsarray = [];
        let operatingexpensearray = []

         
        let income2=transactionData.length > 0?transactiondetails: '';
      console.log( 'type',typeof(paymentdetails))
        incomearray.push(...income2);
        // var carray = billDetailsdata.length == 0 ? '' : billObject[24];
        // var oarray = billDetailsdata.length == 0 ? '' : billObject[25];
        var cexpensearray = costoofgoodsdetails.length > 0 ? costoofgoodsdetails : '';
        var oexpensearray = operationexpensedetails.length > 0 ? operationexpensedetails : '';

        // var cparray= paymentData.length > 0  &&  costofgoodsexpensepayment.length  > 0? costoofgoodspaymentdetails : '';
        // var oparray=paymentData.length > 0 &&  operationexpensepaymentdetails.length  > 0 ? operationexpensepaymentdetails : '';
        Costofgoodsarray.push(...cexpensearray);
        operatingexpensearray.push(...oexpensearray);
        var income = {
            header: 'Income', totalvalue: _.sumBy(incomearray, 'total'),
            values: incomearray
        }
        var operatingexpense = {
            header: 'Operating expense', totalvalue: _.sumBy(operatingexpensearray, 'total'),
            values: operatingexpensearray
        }
        var Costofgoods = {
            header: 'Cost of  goods sold', totalvalue: _.sumBy(Costofgoodsarray, 'total'),
            values: Costofgoodsarray
        }
        finalResponse.push(income, operatingexpense, Costofgoods);
       
        var grossprofit = (income.totalvalue - Costofgoods.totalvalue);
        var grossprofitpercentage=grossprofit!=undefined&&grossprofit!=0?Math.round((grossprofit/income.totalvalue) * 100 ) + '%':0 + '%'
        var netprofit = (grossprofit - operatingexpense.totalvalue)
        var netprofitpercentage=netprofit!=undefined&&netprofit!=0?Math.round((netprofit/income.totalvalue) * 100) + '%':0 + '%'
        res.json({ status: 1, message: 'Profit and loss report list',transactionData, netprofitpercentage,grossprofitpercentage, grossprofit, netprofit, finalResponse })



    },


    BalanceSheetreport: async (req, res) => {
        let { start_date, end_date, report_type } = req.body
        let accountObject = {};
        let accountNameObject = {}
        let consignmentObject = {};
        let billObject = {};
        var bill = [];
        let incomes = [];
        let expense = [];
        let othercurrentasset=[];

        let longtermassets=[];
        let longtermlibalities=[];
        let incomepaymentObject=[];
        let liabality={};

        let expenseObject = {}
        let currentlibalityarray=[];
        let othercurrentassetvalues=[];
        let longtermassetsvalues=[];
        let longtermlibalitiesvalues=[]
        var paymentdetails;
        let equailtyreatined=[];
        let equalitybusinnes=[];
        let equalityObject={};
        var assetsObject={}
        var finalResponse = [];
        var condition=''
        if(report_type==2)
        {
            condition=" and a.ispayment=1"
        }
        let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

        accountdata.forEach(element => {
            accountObject[element.accountypeid] = element.accounttypename;
            accountNameObject[element.accountid] = element.accountname
        });
        //paymentQuery
        // let paymentQuery = "Select *,p.account as account_id from payments as p left join accounts as a on p.account=a.id  inner join account_types as at on at.id=a.account_type_id where p.created_date >= '" + start_date + "' AND p.created_date  <= '" + end_date + "' group by p.id"
        // let paymentData = await commonFunction.getQueryResults(paymentQuery);




        // //billdetailsQuery
        // let billDetailsQuery = "Select * from bill as b inner join  bill_details as bd on b.id=bd.bill_id inner join accounts as ac on ac.id=bd.expense_category where b.bill_date >= '" + start_date + "' AND b.bill_date  <= '" + end_date + "' and b.isdelete = 0 ";
        // let billDetailsdata = await commonFunction.getQueryResults(billDetailsQuery);
        let transactionQuery = " Select *,ad.type as accountype ,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'   " + condition + "   group by a.id "
        //let transactionQuery = " Select *,ad.type as accountype ,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
        let transactionData = await commonFunction.getQueryResults(transactionQuery);
        // paymentData.forEach(element => {

        //     if(element.type=='Income')

        //     {

        //         incomepaymentObject.push(element)
        //     }
        //     if(element.type=='Expense')

        //     {
        //         // if (expensepaymentObject[element.account_type_id==undefined]) {
        //         //     expensepaymentObject[element.account_type_id]=[];
        //         // }


        //         expensepaymentObject.push(element)
        //     }



        // });

        // expensepaymentObject.forEach(element => {
        //     if (element.account_type_id == 24) {
    
        //         operatingexpensepayment.push(element)
        //     }
        //     if (element.account_type_id == 25) {
        //         costofgoodsexpensepayment.push(element)
        //     }
           
        // });



        transactionData.forEach(element => {
            if (element.accountype =='Assets') {
                if(element.account_type_id ==1 || element.account_type_id ==2) { 
                    incomes.push(element)
                }
                if(element.account_type_id ==3 || element.account_type_id ==4 || element.account_type_id ==7 || element.account_type_id ==8) { 
                    othercurrentasset.push(element)
                }

                if(element.account_type_id ==5 || element.account_type_id ==9 || element.account_type_id ==6) { 
                    longtermassets.push(element)
                }

                
            }
            if (element.accountype =='Liabilities & Credit Cards') {
                if(element.account_type_id !=11 || element.account_type_id !=18) { 
                    expense.push(element)
                }

                if(element.account_type_id==11 || element.account_type_id==18) { 
                    longtermlibalities.push(element)
                }
                
            }


            if (element.accountype =='Equity') {
                

                if(element.account_type_id==31) { 
                    equailtyreatined.push(element)
                }

                if(element.account_type_id==30) { 
                    equalitybusinnes.push(element)
                }
                
            }
        });



        var longtermlibalitiesdetails=_(longtermlibalities)
        .groupBy('account_id')
        .map((objs, key) => ({
            'account_id': key,
            'account_type_id': _.get(objs[0], 'account_type_id'),
            'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            'total': _.sumBy(objs, function (day) {

                return day.debit - day.credit;

            })
        }))
        var othercurrentassetdetails= _(othercurrentasset)
        .groupBy('account_id')
        .map((objs, key) => ({
            'account_id': key,
            'account_type_id': _.get(objs[0], 'account_type_id'),
            'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            'total': _.sumBy(objs, function (day) {

                return day.debit - day.credit;

            })
        }))


        var longtermassetdetails= _(longtermassets)
        .groupBy('account_id')
        .map((objs, key) => ({
            'account_id': key,
            'account_type_id': _.get(objs[0], 'account_type_id'),
            'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            'total': _.sumBy(objs, function (day) {

                return day.debit - day.credit;

            })
        }))



        var equalityretaineddetails= _(equailtyreatined)
        .groupBy('account_id')
        .map((objs, key) => ({
            'account_id': key,
            'account_type_id': _.get(objs[0], 'account_type_id'),
            'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            'total': _.sumBy(objs, function (day) {

                return day.credit - day.debit;

            })
        }))

        var equalitybusinessdetails= _(equalitybusinnes)
        .groupBy('account_id')
        .map((objs, key) => ({
            'account_id': key,
            'account_type_id': _.get(objs[0], 'account_type_id'),
            'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            'total': _.sumBy(objs, function (day) {

                return day.credit - day.debit;;

            })
        }))
        // billDetailsdata.forEach(item => {
        //     item.account_id = item.expense_category;
        // });
        // accountdata.forEach(item1 => {
        //     billDetailsdata.forEach(item2 => {


        //   });
        // });


        //console.log('cost', paymentQuery)


        // if (billDetailsdata.length > 0) {
        //     var billdetails =
        //         _(billDetailsdata)
        //             .groupBy('account_id')
        //             .map((objs, key) => ({
        //                 'account_id': key,
        //                 'account_type_id': _.get(objs[0], 'account_type_id'),
        //                 'account_type_name': accountObject[_.get(objs[0], 'account_type_id')],
        //                 'account_id_name': accountNameObject[key],
        //                 'total': _.sumBy(objs, function (day) {

        //                     return day.debit - day.credit;

        //                 })
        //             }))
        //             .value();

var currentlibiatydetails=_(expense)
.groupBy('account_id')
.map((objs, key) => ({
    'account_id': key,
    'account_type_id': _.get(objs[0], 'account_type_id'),
    'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
    'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
    'total': _.sumBy(objs, function (day) {

        return day.credit - day.debit;

    })
}))
        //     billdetails.forEach(element => {

        //         if (billObject[element.account_type_id] == undefined) {

        //             billObject[element.account_type_id] = [];
        //         }
        //         billObject[element.account_type_id].push(element)


        //     });

        // }



        // expense.forEach(element => {

        //     if (expenseObject[element.account_type_id] == undefined) {

        //         expenseObject[element.account_type_id] = [];
        //     }
        //     expenseObject[element.account_type_id].push(element)



        // });



        

        // expense.forEach(element => {

        //         if (element.account_type_id == 24) {
    
        //             operatingexpensetransaction.push(element)
        //         }
        //         if (element.account_type_id == 25) {
        //             costofgoodsexpense.push(element)
        //         }
               
    
    
        //     });


         
            

             
            // var costoofgoodspaymentdetails = _(costofgoodsexpensepayment)
            // .groupBy('account_id')
            // .map((objs, key) => ({
            //     'account_id': key,
            //     'account_type_id': _.get(objs[0], 'account_type_id'),
            //     'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            //     'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            //     'total': _.sumBy(objs, function (day) {

            //         return day.debit - day.credit;

            //     })
            // }))
            // .value();

            // var operationexpensepaymentdetails = _(operatingexpensepayment)
            // .groupBy('account_id')
            // .map((objs, key) => ({
            //     'account_id': key,
            //     'account_type_id': _.get(objs[0], 'account_type_id'),
            //     'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            //     'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            //     'total': _.sumBy(objs, function (day ,n) {

            //         return day.debit - day.credit;

            //     })
            // }))
            // .value();
            // var costoofgoodsdetails = _(costofgoodsexpense)
            // .groupBy('account_id')
            // .map((objs, key) => ({
            //     'account_id': key,
            //     'account_type_id': _.get(objs[0], 'account_type_id'),
            //     'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            //     'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            //     'total': _.sumBy(objs, function (day) {

            //         return day.debit - day.credit;

            //     })
            // }))
            // .value();

            // var operationexpensedetails = _(operatingexpensetransaction)
            // .groupBy('account_id')
            // .map((objs, key) => ({
            //     'account_id': key,
            //     'account_type_id': _.get(objs[0], 'account_type_id'),
            //     'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
            //     'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
            //     'total': _.sumBy(objs, function (day) {

            //         return day.debit - day.credit;

            //     })
            // }))
            // .value();
        var transactiondetails = _(incomes)
            .groupBy('account_id')
            .map((objs, key) => ({
                'account_id': key,
                'account_type_id': _.get(objs[0], 'account_type_id'),
                'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
                'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
                'total': _.sumBy(objs, function (day) {

                    return day.debit - day.credit;

                })
            }))
            .value();

        // if (paymentData.length > 0) {
        //     paymentdetails =
        //         _(incomepaymentObject)
        //             .groupBy('account_id')
        //             .map((objs, key) => ({
        //                 'account_id': key,
        //                 'account_type_id': _.get(objs[0], 'account_type_id'),
        //                 'account_type_name': accountObject[_.get(objs[0], 'account_type_id')] ? accountObject[_.get(objs[0], 'account_type_id')] : '',
        //                 'account_id_name': accountNameObject[key] ? accountNameObject[key] : '',
        //                 'total': _.sumBy(objs, function (day) {

        //                     return day.credit - day.debit;

        //                 })
        //             }))
        //             .value();
        // }


        let incomearray = [];
         
        let equalitybusinessvalues = []

        let equalityreatinedvalues = []
        let income2=transactionData.length > 0?transactiondetails: '';
        let othercurrentassetsarrays=othercurrentassetdetails//othercurrentassetdetails.length > 0?othercurrentassetdetails: ''
        let longtermassetsubdetails=longtermassetdetails;
        let longtermlibalitiessubdetails=longtermlibalitiesdetails
        let equalitysretainedubdetails=equalityretaineddetails;

        let equalitysbusinnesdubdetails=equalitybusinessdetails;
        othercurrentassetvalues.push(...othercurrentassetsarrays);   
        longtermlibalitiesvalues.push(...longtermlibalitiessubdetails)
        longtermassetsvalues.push(...longtermassetsubdetails);
        equalityreatinedvalues.push(...equalitysretainedubdetails);
        equalitybusinessvalues.push(...equalitysbusinnesdubdetails);
    
        incomearray.push(...income2);
        // var carray = billDetailsdata.length == 0 ? '' : billObject[24];
        // var oarray = billDetailsdata.length == 0 ? '' : billObject[25];
         

        // var cparray= paymentData.length > 0  &&  costofgoodsexpensepayment.length  > 0? costoofgoodspaymentdetails : '';
        // var oparray=paymentData.length > 0 &&  operationexpensepaymentdetails.length  > 0 ? operationexpensepaymentdetails : '';
        currentlibalityarray.push(...currentlibiatydetails);
       // operatingexpensearray.push(...oexpensearray);
        var income = {
            header: 'Cash and Bank', totalvalue: _.sumBy(incomearray, 'total'),
            values: incomearray
        }

        var othercurrentassetss = {
            header: 'Other current assets', totalvalue: _.sumBy(othercurrentassetvalues,'total'),
            values: othercurrentassetvalues
        }
        // var operatingexpense = {
        //     header: 'Operating expense', totalvalue: _.sumBy(operatingexpensearray, 'total'),
        //     values: operatingexpensearray
        // }

        var equalityretainedetail={
            header: 'Retained Equality', totalvalue: _.sumBy(equalityreatinedvalues,'total'),
            values: equalityreatinedvalues
        }
        var equalitybusinessdetail={
            header: 'Business Owner Contribution and Drawing', totalvalue: _.sumBy(equalitybusinessvalues,'total'),
            values: equalitybusinessvalues
        }
        var longttermassetsObject = {
            header: 'Long term assets', totalvalue: _.sumBy(longtermassetsvalues, 'total'),
            values: longtermassetsvalues
        }
        
        var currentlibality={
            header: 'Current liablities', totalvalue: _.sumBy(currentlibalityarray, 'total'),
            values: currentlibalityarray
        }

        var longtermlibality={
            header: 'long term liablities', totalvalue: _.sumBy(longtermlibalitiesvalues, 'total'),
            values: longtermlibalitiesvalues
        }
        // equalityObject={
        //     header: 'Equality', totalvalue: _.sumBy(longtermlibalitiesvalues, 'total'),
        //     values: [equalityretainedetail,equalitybusinessdetail]
        // }

        

        var totalassetvalue = income.totalvalue + othercurrentassetss.totalvalue + longttermassetsObject.totalvalue
        var totallibalityvalue = currentlibality.totalvalue+longtermlibality.totalvalue
        var equalitytotalvalue = equalitybusinessdetail.totalvalue + equalityretainedetail.totalvalue
        var cashhandvalue=income.totalvalue!=undefined?income.totalvalue:0;
        var toberecivedtotal=othercurrentassetss.totalvalue!=undefined?othercurrentassetss.totalvalue:0
        var topaidout=currentlibality.totalvalue!=undefined?currentlibality.totalvalue:0


        var sumofvalues=(cashhandvalue + toberecivedtotal)-topaidout
       console.log('libvalue',currentlibality.totalvalue);
        assetsObject={header: 'Assets', totalvalue: totalassetvalue,
       values: [income,othercurrentassetss,longttermassetsObject]}
        liabality={ header: 'Liabilities & Credit Cards', totalvalue:totallibalityvalue ,
       
        values: [currentlibality,longtermlibality]}
        
        equalityObject={header: 'Equality', totalvalue: equalitytotalvalue,
       
       values: [equalitybusinessdetail,equalityretainedetail]}
        finalResponse.push(assetsObject,liabality,equalityObject);
       
        // var grossprofit = (income.totalvalue - Costofgoods.totalvalue);
        // var grossprofitpercentage=Math.round((grossprofit/income.totalvalue) * 100 ) + '%'
        // var netprofit = (grossprofit - operatingexpense.totalvalue)
        // var netprofitpercentage=Math.round((netprofit/income.totalvalue) * 100) + '%'
        res.json({ status: 1, message: 'Balance sheet report list',sumofvalues,cashhandvalue,toberecivedtotal,topaidout,othercurrentassetvalues,transactionData,  finalResponse })



    },

    getAllApprovedConsignments: (req, res) => {
        let shipper_query = "SELECT * FROM shipping where user_id = ?;"
        let query = "SELECT * FROM consignment where is_approved = 1 and shipper_code = ?;"

        connection.query(shipper_query, req.params.id, (err, results) => {
            if (err) {
                console.log(err);

            } else {
                connection.query(query, results[0].shipper_code, (err, rows) => {
                    if (err) {
                        console.log(err);
                        res.json({
                            status: false,
                            message: 'there are some error with query'
                        })
                    } else if (rows.length == 0) {
                        res.json({
                            status: false,
                            message: "No results found"
                        });
                    } else {
                        // this.uploadconsignments();
                        res.json({
                            status: true,
                            data: rows
                        })
                    }

                })
            }

        })
    }
}

function removeduplicates(data)
{
    return [...new Set(data)]
}

