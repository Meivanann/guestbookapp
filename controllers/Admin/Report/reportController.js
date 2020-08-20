var connection = require('../../../config');
var commonFunction = require('../../commonFunction');
var _ = require('lodash')
module.exports = {


   
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

        let transactionQuery = " Select *,ad.type as accountype,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
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

        let transactionQuery = " Select *,ad.type as accountype ,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account inner join account_types as ad on ac.account_type_id=ad.id where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "'  and a.from_id NOT IN (6,7,8,9,10,11) " + condition + " group by a.id ";
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

                return day.debit - day.credit;

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

                return day.debit - day.credit;

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

        return day.debit - day.credit;

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


