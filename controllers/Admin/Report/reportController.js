var connection = require('../../../config');
var commonFunction = require('../../commonFunction');
var _ = require('lodash')
module.exports = {

    ProfitandLossreport: async (req, res) => {
        let { start_date, end_date, report_type } = req.body
        let accountObject = {};
        let accountNameObject = {}
        let consignmentObject = {};
        let billObject = {};
        var bill = [];
        let incomes = [];
        let expense = []
        let expenseObject = {}

        var finalResponse = [];
        let accounttypeQuery = "Select *,at.id as accountypeid,at.name as accounttypename,a.id as accountid,a.account_name as accountname from accounts as a left join account_types as at on at.id=a.account_type_id ";

        let accountdata = await commonFunction.getQueryResults(accounttypeQuery);

        accountdata.forEach(element => {
            accountObject[element.accountypeid] = element.accounttypename;
            accountNameObject[element.accountid] = element.accountname
        });
        //consigmentQuery
        let consignmentQuery = "Select * from consignment as c where cn_datetime >= '" + start_date + "' AND cn_datetime  <= '" + end_date + "' and status = 'Close'  and is_approved = 1 "
        let consignmentData = await commonFunction.getQueryResults(consignmentQuery);

        //billdetailsQuery
        let billDetailsQuery = "Select * from bill as b inner join  bill_details as bd on b.id=bd.bill_id inner join accounts as ac on ac.id=bd.expense_category where b.bill_date >= '" + start_date + "' AND b.bill_date  <= '" + end_date + "' and b.isdelete = 0 ";
        let billDetailsdata = await commonFunction.getQueryResults(billDetailsQuery);

        let transactionQuery = " Select *,a.account as account_id from  account_statements as a left join accounts as ac on ac.id=a.account  where a.created_on >= '" + start_date + "' AND a.created_on  <= '" + end_date + "' group by a.id ";
        let transactionData = await commonFunction.getQueryResults(transactionQuery);
        // consignmentData.forEach(element => {

        //     if(consignmentObject[element.account_type_id]==undefined)

        //     {

        //         consignmentObject[element.account_type_id]=[];
        //     }


        // });

        transactionData.forEach(element => {
            if (element.type == 'Income') {
                incomes.push(element)
            }
            if (element.type == 'Expense') {
                expense.push(element)
            }
        });



        billDetailsdata.forEach(item => {
            item.account_id = item.expense_category;
        });
        // accountdata.forEach(item1 => {
        //     billDetailsdata.forEach(item2 => {


        //   });
        // });


        console.log('cost', transactionQuery)


        if (billDetailsdata.length > 0) {
            var billdetails =
                _(billDetailsdata)
                    .groupBy('account_id')
                    .map((objs, key) => ({
                        'account_id': key,
                        'account_type_id': _.get(objs[0], 'account_type_id'),
                        'account_type_name': accountObject[_.get(objs[0], 'account_type_id')],
                        'account_id_name': accountNameObject[key],
                        'total': _.sumBy(objs, function (day) {

                            return day.debit - day.credit;

                        })
                    }))
                    .value();



            billdetails.forEach(element => {

                if (billObject[element.account_type_id] == undefined) {

                    billObject[element.account_type_id] = [];
                }
                billObject[element.account_type_id].push(element)


            });

        }



        expense.forEach(element => {

            if (expenseObject[element.account_type_id] == undefined) {

                expenseObject[element.account_type_id] = [];
            }
            expenseObject[element.account_type_id].push(element)


        });

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

        if (consignmentData.length > 0) {
            var consigmentdetails =
                _(consignmentData)
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
        }


        let incomearray = [];
        let Costofgoodsarray = [];
        let operatingexpensearray = []
        incomearray.push(...consigmentdetails, ...transactiondetails);
        var carray = billDetailsdata.length == 0 ? '' : billObject[24];
        var oarray = billDetailsdata.length == 0 ? '' : billObject[25];
        var cexpensearray = expense.length > 0 ? expenseObject[25] : '';
        var oexpensearray = expense.length > 0 ? expenseObject[25] : '';
        Costofgoodsarray.push(...carray, ...cexpensearray);
        operatingexpensearray.push(...oarray, ...oexpensearray);
        var income = {
            header: 'Income', totalvalue: _.sumBy(consigmentdetails, 'total'),
            values: incomearray
        }
        var operatingexpense = {
            header: 'Operating expense', totalvalue: _.sumBy(billObject[24], 'total'),
            values: operatingexpensearray
        }
        var Costofgoods = {
            header: 'Cost of  goods sold', totalvalue: _.sumBy(billObject[25], 'total'),
            values: Costofgoodsarray
        }
        finalResponse.push(income, operatingexpense, Costofgoods);
        var grossprofit = (income.totalvalue - Costofgoods.totalvalue);
        var netprofit = (grossprofit - operatingexpense.totalvalue)
        res.json({ status: 1, message: 'Profit and loss report list', transactiondetails, incomes, grossprofit, netprofit, finalResponse, transactionData, consigmentdetails, billDetailsdata })



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


