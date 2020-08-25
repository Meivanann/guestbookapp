var connection = require('../../../config');
const { parse } = require('handlebars');
let commonFunction=require('../../commonFunction');
var moment=require('moment');

module.exports = {
    index: (req,res) => {
        let query = "SELECT * FROM credit_note;"

        connection.query(query, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                res.json({
                    status: -1,
                    message:' No results found'
                })
            } else {

                console.log(rows);
                res.json({
                    status: 1,
                    data:rows
                })
            }
        })
    },
    editCreditNote: async(req,res) => {
        let today=moment().format('YYYY-MM-DD') 
        let credit_id = req.body.creditid;
        let shippercode=req.body.shippercode;
        let creditdetails=req.body.credit_details;
        let totalamount=Math.abs(req.body.totalamount);
        let payment_due_date=req.body.payment_due_date
        let acc_bal = 0
        var credit_note_data = {
            "shipper_code"      : shippercode,
            "credit_date"       : today,
            "amount"            : totalamount,
            "status"            : "Unpaid",
            "payment_due_date"  : payment_due_date
        }
        
        let query = "select * from credit_note as c  where c.id="+credit_id+"";
        let data=await commonFunction.getQueryResults(query);
 if (data.length > 0) {

console.log('credit')
    let credit_note_query = "update  credit_note SET  ? where id="+credit_id+""
    connection.query(credit_note_query, credit_note_data, async function (crerr, crres, fields) {
        if (crerr) {
            console.log(crerr)
        }else{
           // console.log(crres.insertId);
            //credit_note_id = crres.insertId;
            console.log("Credit note added successfully");

            // adding the rows in credit note details table
            console.log("Credit successfully",creditdetails);
            Object.keys(creditdetails).forEach(function(key) {
                var row = creditdetails[key];
               
row.shipper_code=shippercode!=undefined?shippercode:''
row.credit_note_id=credit_id
                

            //     let credit_detail_query = "INSERT INTO credit_note_details SET ?"
            //     connection.query(credit_detail_query, credit_detail_data, function (crderr, crdres, fields) {
            //         if (crderr) {
            //             console.log(crderr)
            //         }else{
            //             console.log("Credit note details added successflly");
            //         }
            //     });
           
             });

             console.log('ssssssskksl')
             let credits = creditdetails.map((m) => Object.values(m))
for (let index = 0;index < creditdetails.length;index++) {
    const element = creditdetails[index];
console.log(element)
    let credit_note_query = "update  credit_note_details SET  amount='"+element.amount+"',description='"+element.description+"',credit_note_id ='"+element.credit_note_id+"',shipper_code='"+element.shipper_code+"' where id="+element.id+""
    let credit_notedata=await commonFunction.getQueryResults(credit_note_query)
    
}
            
            
           
           
             // connection.query(credit_note_query, [credits,'ss'], function (crerr, crres, fields) {
            //     if (crerr) {
            //         console.log(crerr)
            //     }else{
           
                    var inv_acc_data = {
                        "shipper_code" : shippercode,
                        "type"         : "Credit",
                        "amount"       :  totalamount,
                        "update_on"   :  today,
                        "description"  :  "Credit note"
                    }
                   // let acc_state_query = "update  shipper_acc_statements SET ? where shipper_code='"+shippercode+"' and type='Credit'and amount="+totalamount+" order by  id desc "
                   let acc_state_query = "update  shipper_acc_statements SET ? where shipper_code='"+shippercode+"' and type='Credit'and credit_no='"+credit_id+"' order by  id desc " 
                   connection.query(acc_state_query, inv_acc_data, async function (lgerr, lgres, fields) {
                        if (lgerr) {
                            console.log(lgerr)
                        }else{
                            console.log(lgres.insertId);
                            console.log(" Update Shipping account statement  added successfully");
                        }
                    });
                
                    // affecting the shipper account ovberall amount
                    let shipper_query = "select * from shipping where shipper_code = ?"
                    connection.query(shipper_query, shippercode, (err,shipper_rows) => {
                        if(err){
                            console.log(err);
                        }else{
                            shipper_details = shipper_rows[0];
                            acc_bal = shipper_details!=undefined && totalamount > 0?parseFloat(shipper_details.acc_bal) + parseFloat(totalamount):'';
                console.log
                            // updating the shipper account
                            let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                            var shipper_acc_update_data = {
                                "acc_bal"   :   acc_bal
                            }
                            let data111 = [shipper_acc_update_data ,shippercode];
                
                            connection.query(shipper_acc_update,data111, function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }else{
                                    console.log("Shipping updated Successfully")
                

                                    let newarray={}

                            creditdetails.forEach(element => {
                                newarray={
                                    type:'Income',
                                    account:20,
                                    amount:Math.abs(element.amount),
                                    description:' credit details from create credit note',
                                    debit:Math.abs(element.amount),
                                    credit:0,
                                    credit_no:credit_id,
                                    types:'Credit details',
                                    created_on:today,
                                    from_id:7
                                }

                                let updateQuery="update account_statements as c set ? where credit_detail_id="+element.id +""
                                connection.query(updateQuery, newarray,function (err,data) {

                                    console.log(updateQuery)
                                })
                            });

                            //var incomeobject={type:'Income',account:20,amount:total_amount,description:'credit note from credit note',debit:total_amount,credit:0,credit_no:credit_note_id,types:'Credit',created_on:today,from_id:6}
                            var accountReacivable={type:'Income',account:22,amount:totalamount,description:'credit note from credit note',debit:0,credit:totalamount,credit_no:credit_id,types:'Credit',created_on:today,from_id:6}
                            // var array=[...newarray,accountReacivable]
                            // let accountdetailsinvoice = array.map((m) => Object.values(m))
                            let acc_query = "update account_statements as c set ? where credit_no="+credit_id +" and from_id=6 "
                            connection.query(acc_query, accountReacivable, function (err, data) {
                                if (err) {
                                    console.log(err)
                                }else{
                                    console.log("account statement  added successfully");
                                }
                            });
                                    res.json({
                                        status:1,
                                        message:'Update Credit Note generated sucessfully'
                                    })
                                }
                            });
                        }
                    })


           // }
        

            
        }
    });

    
     
 }
        

      
    },
//24AUGBACKUP
//     editCreditNote: async(req,res) => {
//         let today=moment().format() 
//         let credit_id = req.body.creditid;
//         let shippercode=req.body.shippercode;
//         let creditdetails=req.body.credit_details;
//         let totalamount=req.body.totalamount;
//         let payment_due_date=req.body.payment_due_date
//         let acc_bal = 0
//         var credit_note_data = {
//             "shipper_code"      : shippercode,
//             "credit_date"       : today,
//             "amount"            : totalamount,
//             "status"            : "Unpaid",
//             "payment_due_date"  : payment_due_date
//         }
        
//         let query = "select * from credit_note as c  where c.id="+credit_id+"";
//         let data=await commonFunction.getQueryResults(query);
//  if (data.length > 0) {

// console.log('credit')
//     let credit_note_query = "update  credit_note SET  ? where id="+credit_id+""
//     connection.query(credit_note_query, credit_note_data, async function (crerr, crres, fields) {
//         if (crerr) {
//             console.log(crerr)
//         }else{
//            // console.log(crres.insertId);
//             //credit_note_id = crres.insertId;
//             console.log("Credit note added successfully");

//             // adding the rows in credit note details table
//             console.log("Credit successfully",creditdetails);
//             Object.keys(creditdetails).forEach(function(key) {
//                 var row = creditdetails[key];
               
// row.shipper_code=shippercode!=undefined?shippercode:''
// row.credit_note_id=credit_id
                

//             //     let credit_detail_query = "INSERT INTO credit_note_details SET ?"
//             //     connection.query(credit_detail_query, credit_detail_data, function (crderr, crdres, fields) {
//             //         if (crderr) {
//             //             console.log(crderr)
//             //         }else{
//             //             console.log("Credit note details added successflly");
//             //         }
//             //     });
           
//              });

//              console.log('ssssssskksl')
//              let credits = creditdetails.map((m) => Object.values(m))
// for (let index = 0;index < creditdetails.length;index++) {
//     const element = creditdetails[index];
// console.log(element)
//     let credit_note_query = "update  credit_note_details SET  amount='"+element.amount+"',description='"+element.description+"',credit_note_id ='"+element.credit_note_id+"',shipper_code='"+element.shipper_code+"' where credit_note_id="+credit_id+""
//     let credit_notedata=await commonFunction.getQueryResults(credit_note_query)
    
// }
            
            
           
           
//              // connection.query(credit_note_query, [credits,'ss'], function (crerr, crres, fields) {
//             //     if (crerr) {
//             //         console.log(crerr)
//             //     }else{
           
//                     var inv_acc_data = {
//                         "shipper_code" : shippercode,
//                         "type"         : "Credit",
//                         "amount"       :  totalamount,
//                         "update_on"   :  today,
//                         "description"  :  "Credit note"
//                     }
//                     let acc_state_query = "update  shipper_acc_statements SET ? where shipper_code='"+shippercode+"' and type='Credit'and amount="+totalamount+" order by  id desc "
//                     connection.query(acc_state_query, inv_acc_data, async function (lgerr, lgres, fields) {
//                         if (lgerr) {
//                             console.log(lgerr)
//                         }else{
//                             console.log(lgres.insertId);
//                             console.log(" Update Shipping account statement  added successfully");
//                         }
//                     });
                
//                     // affecting the shipper account ovberall amount
//                     let shipper_query = "select * from shipping where shipper_code = ?"
//                     connection.query(shipper_query, shippercode, (err,shipper_rows) => {
//                         if(err){
//                             console.log(err);
//                         }else{
//                             shipper_details = shipper_rows[0];
//                             acc_bal = shipper_details!=undefined && totalamount > 0?parseFloat(shipper_details.acc_bal) + parseFloat(totalamount):'';
//                 console.log
//                             // updating the shipper account
//                             let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
//                             var shipper_acc_update_data = {
//                                 "acc_bal"   :   acc_bal
//                             }
//                             let data111 = [shipper_acc_update_data ,shippercode];
                
//                             connection.query(shipper_acc_update,data111, function (error, results, fields) {
//                                 if (error) {
//                                     console.log(error);
//                                 }else{
//                                     console.log("Shipping updated Successfully")
                
//                                     res.json({
//                                         status:1,
//                                         message:'Update Credit Note generated sucessfully'
//                                     })
//                                 }
//                             });
//                         }
//                     })


//            // }
        

            
//         }
//     });

    
     
//  }
        

      
//     },

    deleteCreditNote: async(req,res) => {
        let credit_id = req.body.creditid;
        let query = "DELETE credit_note FROM credit_note LEFT JOIN  credit_note_details ON credit_note.id = credit_note_details.credit_note_id  WHERE credit_note.id=" + credit_id + "";
        let data=await commonFunction.getQueryResults(query);
console.log(query)
  

let querys = "DELETE from  account_statements   WHERE account_statements.credit_no=" + credit_id + "";
        let datas=await commonFunction.getQueryResults(querys);

        let creditquerys = "DELETE from  shipper_acc_statements   WHERE shipper_acc_statements.credit_no=" + credit_id + "";
        let creditdatas=await commonFunction.getQueryResults(creditquerys);
        res.json({status:1,message:'Delete credit note successfully' })

      
    },
    getCreditNote: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let query = "select * from credit_note where shipper_code = ?;"

        connection.query(query, shipper_code, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];
                        res.json({
                            status: -1,
                            message:' No results found',
                            shipper: shipper_details,
                        })
                    }
                });
             
            } else {
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];
                        res.json({
                            status:true,
                            data: rows,
                            shipper: shipper_details,
                        })
                    }
                });
            }
        })
    },
    
    getCreditNoteDetails: (req,res) => {
        let shipper_code = req.params.shipper_code;
        let credit_note_id = req.params.credit_note_id;
        let query = "select * from credit_note where id = ?;"

        connection.query(query, credit_note_id, (err,rows) => {
            if(err){
                res.json({
                    status:false,
                    message: 'there are some error with query'
                })
            } else if (rows.length == 0 ){
                let shipper_query = "select * from shipping where shipper_code = ?"
                connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                        shipper_details = shipper_rows[0];
                        res.json({
                            status: -1,
                            message:' No results found',
                            shipper: shipper_details,
                        })
                    }
                });
             
            } else {

                // fetching credit note details
                let credit_detail_query = "select * from credit_note_details where credit_note_id = ?"
                connection.query(credit_detail_query, credit_note_id, (err,credit_detail_rows) => {
                    if(err){
                        console.log(err);
                    }else{
                       // fetching the shipper details
                        let shipper_query = "select * from shipping where shipper_code = ?"
                        connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
                            if(err){
                                console.log(err);
                            }else{
                                shipper_details = shipper_rows[0];
                                res.json({
                                    status:true,
                                    shipper: shipper_details,
                                    credit_note_details: credit_detail_rows,
                                    credit_note:rows
                                })
                            }
                        });
                    }
                });

                
            }
        })
    },

    store: (req,res) => {
        var today = new Date();
        let shipper_code = req.body.shipper_code;
        let total_amount = Math.abs(req.body.amount);
        let data = JSON.parse(req.body.items);
        let acc_bal = 0, credit_note_id;

        console.log(req.body);

        // adding row in credit note table
        var credit_note_data = {
            "shipper_code"      : shipper_code,
            "credit_date"       : today,
            "amount"            : total_amount,
            "status"            : "Unpaid",
            "payment_due_date"  : req.body.payment_due_date
        }
        let credit_note_query = "INSERT INTO credit_note SET ?"
        connection.query(credit_note_query, credit_note_data, function (crerr, crres, fields) {
            if (crerr) {
                console.log(crerr)
            }else{
                console.log(crres.insertId);
                credit_note_id = crres.insertId;
                console.log("Credit note added successfully");

                let newobject={}
                // adding the rows in credit note details table
                Object.keys(data).forEach(function(key) {
                    var row = data[key];
                    console.log(row);

                    var credit_detail_data = {
                        "credit_note_id"    :   credit_note_id,
                        "shipper_code"      :   shipper_code,
                        "amount"            :   row.amount,
                        "description"       :   row.description
                    }

                    let credit_detail_query = "INSERT INTO credit_note_details SET ?"
                    connection.query(credit_detail_query, credit_detail_data, function (crderr, crdres, fields) {
                        if (crderr) {
                            console.log(crderr)
                        }else{
                            console.log("Credit note details added successflly");


                            //let newarray=[]

                            // data.forEach(element => {
                            //     newarray.push({
                            //         type:'Income',
                            //         account:20,
                            //         amount:element.amount,
                            //         description:' credit details from create credit note',
                            //         debit:total_amount,
                            //         credit:0,
                            //         credit_no:credit_note_id,
                            //         types:'Credit details',
                            //         created_on:today,
                            //         from_id:7
                            //     })
                            // });
                          
                            //var incomeobject={type:'Income',account:20,amount:total_amount,description:'credit note from credit note',debit:total_amount,credit:0,credit_no:credit_note_id,types:'Credit',created_on:today,from_id:6}
                            
                           

                            newObject={
                                type:'Income',
                                account:20,
                                amount:Math.abs(row.amount),
                                description:' credit details from create credit note',
                                debit:Math.abs(row.amount),
                                credit:0,
                                credit_no:credit_note_id,
                                types:'Credit details',
                                created_on:today,
                                from_id:7,
                                credit_detail_id:crdres.insertId
                            }
                          
                            let account_statementsquery="insert into account_statements SET ?";
                            connection.query(account_statementsquery,newObject, function (err, data) {
                            console.log(err)

                            })

                        }
                    });
                });
                var accountReacivable={type:'Income',account:22,amount:total_amount,description:'credit note from credit note',debit:0,credit:total_amount,credit_no:credit_note_id,types:'Credit',created_on:today,from_id:6}
                var array=[accountReacivable]
                let accountdetailsinvoice = array.map((m) => Object.values(m))
                let acc_query = "INSERT INTO account_statements(type,account,amount,description,debit,credit,credit_no,types,created_on,from_id) values ? "
connection.query(acc_query, [accountdetailsinvoice], function (err, data) {
if (err) {
    console.log(err)
}else{
    console.log("account statement  added successfully");

    var inv_acc_data = {
        "shipper_code" : shipper_code,
        "type"         : "Credit",
        "amount"       :  total_amount,
        "created_on"   :  today,
        "description"  :  "Credit note",
        credit_no :credit_note_id
    }
    let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
    connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
        if (lgerr) {
            console.log(lgerr)
        }else{
            console.log(lgres.insertId);
            console.log("Shippin account statement  added successfully");
        }
    });
}
});
                
            }
        });

      

         // inserting  Account of Statements
        

        // affecting the shipper account ovberall amount
        let shipper_query = "select * from shipping where shipper_code = ?"
        connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
            if(err){
                console.log(err);
            }else{
                shipper_details = shipper_rows[0];
                acc_bal = parseFloat(shipper_details.acc_bal) + parseFloat(total_amount);

                // updating the shipper account
                let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                var shipper_acc_update_data = {
                    "acc_bal"   :   acc_bal
                }
                let data111 = [shipper_acc_update_data ,shipper_code];

                connection.query(shipper_acc_update,data111, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }else{
                        console.log("Shipping updated Successfully")


                        
                       
                        res.json({
                            status:true,
                            message:'Credit Note generated sucessfully'
                        })
                    }
                });
            }
        })

    },

    //24augbackup
    // store: (req,res) => {
    //     var today = new Date();
    //     let shipper_code = req.body.shipper_code;
    //     let total_amount = req.body.amount;
    //     let data = JSON.parse(req.body.items);
    //     let acc_bal = 0, credit_note_id;

    //     console.log(req.body);

    //     // adding row in credit note table
    //     var credit_note_data = {
    //         "shipper_code"      : shipper_code,
    //         "credit_date"       : today,
    //         "amount"            : total_amount,
    //         "status"            : "Unpaid",
    //         "payment_due_date"  : req.body.payment_due_date
    //     }
    //     let credit_note_query = "INSERT INTO credit_note SET ?"
    //     connection.query(credit_note_query, credit_note_data, function (crerr, crres, fields) {
    //         if (crerr) {
    //             console.log(crerr)
    //         }else{
    //             console.log(crres.insertId);
    //             credit_note_id = crres.insertId;
    //             console.log("Credit note added successfully");

    //             // adding the rows in credit note details table
    //             Object.keys(data).forEach(function(key) {
    //                 var row = data[key];
    //                 console.log(row);

    //                 var credit_detail_data = {
    //                     "credit_note_id"    :   credit_note_id,
    //                     "shipper_code"      :   shipper_code,
    //                     "amount"            :   row.amount,
    //                     "description"       :   row.description
    //                 }

    //                 let credit_detail_query = "INSERT INTO credit_note_details SET ?"
    //                 connection.query(credit_detail_query, credit_detail_data, function (crderr, crdres, fields) {
    //                     if (crderr) {
    //                         console.log(crderr)
    //                     }else{
    //                         let newarray=[]

    //                         data.forEach(element => {
    //                             newarray.push({
    //                                 type:'Income',
    //                                 account:20,
    //                                 amount:element.amount,
    //                                 description:' credit details from create credit note',
    //                                 debit:total_amount,
    //                                 credit:0,
    //                                 credit_no:credit_note_id,
    //                                 types:'Credit details',
    //                                 created_on:today,
    //                                 from_id:7
    //                             })
    //                         });
    //                         //var incomeobject={type:'Income',account:20,amount:total_amount,description:'credit note from credit note',debit:total_amount,credit:0,credit_no:credit_note_id,types:'Credit',created_on:today,from_id:6}
    //                         var accountReacivable={type:'Income',account:22,amount:total_amount,description:'credit note from credit note',debit:0,credit:total_amount,credit_no:credit_note_id,types:'Credit',created_on:today,from_id:6}
    //                         var array=[...newarray,accountReacivable]
    //                         let accountdetailsinvoice = array.map((m) => Object.values(m))
    //                         let acc_query = "INSERT INTO account_statements(type,account,amount,description,debit,credit,credit_no,types,created_on,from_id) values ? "
    //                         connection.query(acc_query, [accountdetailsinvoice], function (err, data) {
    //                             if (err) {
    //                                 console.log(err)
    //                             }else{
    //                                 console.log("account statement  added successfully");
    //                             }
    //                         });
    //                         console.log("Credit note details added successflly");
    //                     }
    //                 });
    //             });

                
    //         }
    //     });

    //      // inserting  Account of Statements
    //      var inv_acc_data = {
    //         "shipper_code" : shipper_code,
    //         "type"         : "Credit",
    //         "amount"       :  total_amount,
    //         "created_on"   :  today,
    //         "description"  :  "Credit note"
    //     }
    //     let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
    //     connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
    //         if (lgerr) {
    //             console.log(lgerr)
    //         }else{
    //             console.log(lgres.insertId);
    //             console.log("Shippin account statement  added successfully");
    //         }
    //     });

    //     // affecting the shipper account ovberall amount
    //     let shipper_query = "select * from shipping where shipper_code = ?"
    //     connection.query(shipper_query, shipper_code, (err,shipper_rows) => {
    //         if(err){
    //             console.log(err);
    //         }else{
    //             shipper_details = shipper_rows[0];
    //             acc_bal = parseFloat(shipper_details.acc_bal) + parseFloat(total_amount);

    //             // updating the shipper account
    //             let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
    //             var shipper_acc_update_data = {
    //                 "acc_bal"   :   acc_bal
    //             }
    //             let data111 = [shipper_acc_update_data ,shipper_code];

    //             connection.query(shipper_acc_update,data111, function (error, results, fields) {
    //                 if (error) {
    //                     console.log(error);
    //                 }else{
    //                     console.log("Shipping updated Successfully")

    //                     res.json({
    //                         status:true,
    //                         message:'Credit Note generated sucessfully'
    //                     })
    //                 }
    //             });
    //         }
    //     })

    // },



    recordPayment: (req,res) => {
        let today = new Date();
        let credit_note_id = req.body.id;
        let amount_paid = req.body.amount_paid;
        let payment_method = req.body.payment_method;
        let total_amount = req.body.total_amount;
        let shipper_code = req.body.shipper_code;
        let acc_bal =0, amt = 0;

        // Fetching and updating the credit note table
        connection.query("select * from credit_note where id = ?",credit_note_id, function (error, results, fields) {
            if (error) {
                console.log(error);
            }else{
                amt =  parseFloat(results[0].amount) -  parseFloat(results[0].amount_paid);
                if(amt === parseFloat(amount_paid) )
                {
                    var credit_note_data = {
                        "amount_paid"       :   parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   today,
                        "status"            :   "Paid"
                    }
                }else{
                    var credit_note_data = {
                        "amount_paid"       :   parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
                        "payment_method"    :   payment_method,
                        "paid_on"           :   today,
                        "status"            :   "Partially Paid"
                    }
                }

                let query = "UPDATE credit_note SET ? where id = ?";
                let data1 = [credit_note_data ,credit_note_id];

                connection.query(query,data1, function (uperr, upress, fields) {
                    if (uperr) {
                        console.log(uperr);
                    }else{

                        // updating the shipper account
                        let shipper_query = "select * from shipping where shipper_code = ?"
                        connection.query(shipper_query, shipper_code, (shipper_err,shipper_rows) => {
                            if(shipper_err){
                                console.log(shipper_err);
                            }else{
                                acc_bal = parseFloat(shipper_rows[0].acc_bal) - parseFloat(amount_paid); 
                                let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
                                var shipper_acc_update_data = {
                                    "acc_bal"   :   acc_bal
                                }
                                let data111 = [shipper_acc_update_data ,shipper_code];

                                connection.query(shipper_acc_update,data111, function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                    }else{
                                        console.log("Shipping updated Successfully")
                                    }
                                });

                            }
                        });
                    }
                });

                  // inserting  Account of Statements
                  var inv_acc_data = {
                    "shipper_code" : shipper_code,
                    "type"         : "Payment",
                    "invoice_no"   :  credit_note_id,
                    "description"  :  "Payment for Credit note  " + credit_note_id,
                    "amount"       :  amount_paid,
                    "created_on"   :  today,
                    credit_no :credit_note_id
                }
                
                let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
                connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
                    if (lgerr) {
                        console.log(lgerr)
                    }else{
                        console.log("Shippin account statement  added successfully");
                    }
                });

                
                var o_acc_data = {
                    "type"         : "Income",
                    "description"  :  "Payment for credit note " + credit_note_id,
                    "amount"       :  amount_paid,
                    "account"      :  req.body.account,
                    "created_on"   :  today 
                }
                let o_acc_state_query = "INSERT INTO account_statements SET ?"
                connection.query(o_acc_state_query, o_acc_data, function (lgerr, lgres, fields) {
                    if (lgerr) {
                        console.log(lgerr)
                    }else{
                        console.log("Shippin account statement  added successfully");
                    }
                });


                console.log(results);
                //creating a log
                var log_data = {
                    "user_id"   : req.params.id,
                    "status": " has recorded th payment for crednit Note number " + credit_note_id 
                }
                connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
                    if (lgerr) {
                    console.log(lgerr)
                    }else{
                        console.log("log added successfully");
                    }
                });

                res.json({
                    status:true,
                    message:'Credit Note Updated sucessfully'
                })
            }
        });
    }

//aug24backup
    // recordPayment: (req,res) => {
    //     let today = new Date();
    //     let credit_note_id = req.body.id;
    //     let amount_paid = req.body.amount_paid;
    //     let payment_method = req.body.payment_method;
    //     let total_amount = req.body.total_amount;
    //     let shipper_code = req.body.shipper_code;
    //     let acc_bal =0, amt = 0;

    //     // Fetching and updating the credit note table
    //     connection.query("select * from credit_note where id = ?",credit_note_id, function (error, results, fields) {
    //         if (error) {
    //             console.log(error);
    //         }else{
    //             amt =  parseFloat(results[0].amount) -  parseFloat(results[0].amount_paid);
    //             if(amt === parseFloat(amount_paid) )
    //             {
    //                 var credit_note_data = {
    //                     "amount_paid"       :   parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
    //                     "payment_method"    :   payment_method,
    //                     "paid_on"           :   today,
    //                     "status"            :   "Paid"
    //                 }
    //             }else{
    //                 var credit_note_data = {
    //                     "amount_paid"       :   parseFloat(results[0].amount_paid) + parseFloat(amount_paid),
    //                     "payment_method"    :   payment_method,
    //                     "paid_on"           :   today,
    //                     "status"            :   "Partially Paid"
    //                 }
    //             }

    //             let query = "UPDATE credit_note SET ? where id = ?";
    //             let data1 = [credit_note_data ,credit_note_id];

    //             connection.query(query,data1, function (uperr, upress, fields) {
    //                 if (uperr) {
    //                     console.log(uperr);
    //                 }else{

    //                     // updating the shipper account
    //                     let shipper_query = "select * from shipping where shipper_code = ?"
    //                     connection.query(shipper_query, shipper_code, (shipper_err,shipper_rows) => {
    //                         if(shipper_err){
    //                             console.log(shipper_err);
    //                         }else{
    //                             acc_bal = parseFloat(shipper_rows[0].acc_bal) - parseFloat(amount_paid); 
    //                             let shipper_acc_update = "UPDATE shipping SET ? where shipper_code = ?";
    //                             var shipper_acc_update_data = {
    //                                 "acc_bal"   :   acc_bal
    //                             }
    //                             let data111 = [shipper_acc_update_data ,shipper_code];

    //                             connection.query(shipper_acc_update,data111, function (error, results, fields) {
    //                                 if (error) {
    //                                     console.log(error);
    //                                 }else{
    //                                     console.log("Shipping updated Successfully")
    //                                 }
    //                             });

    //                         }
    //                     });
    //                 }
    //             });

    //               // inserting  Account of Statements
    //               var inv_acc_data = {
    //                 "shipper_code" : shipper_code,
    //                 "type"         : "Payment",
    //                 "invoice_no"   :  credit_note_id,
    //                 "description"  :  "Payment for Credit note  " + credit_note_id,
    //                 "amount"       :  amount_paid,
    //                 "created_on"   :  today
    //             }
                
    //             let acc_state_query = "INSERT INTO shipper_acc_statements SET ?"
    //             connection.query(acc_state_query, inv_acc_data, function (lgerr, lgres, fields) {
    //                 if (lgerr) {
    //                     console.log(lgerr)
    //                 }else{
    //                     console.log("Shippin account statement  added successfully");
    //                 }
    //             });

                
    //             var o_acc_data = {
    //                 "type"         : "Income",
    //                 "description"  :  "Payment for credit note " + credit_note_id,
    //                 "amount"       :  amount_paid,
    //                 "account"      :  req.body.account,
    //                 "created_on"   :  today 
    //             }
    //             let o_acc_state_query = "INSERT INTO account_statements SET ?"
    //             connection.query(o_acc_state_query, o_acc_data, function (lgerr, lgres, fields) {
    //                 if (lgerr) {
    //                     console.log(lgerr)
    //                 }else{
    //                     console.log("Shippin account statement  added successfully");
    //                 }
    //             });


    //             console.log(results);
    //             //creating a log
    //             var log_data = {
    //                 "user_id"   : req.params.id,
    //                 "status": " has recorded th payment for crednit Note number " + credit_note_id 
    //             }
    //             connection.query('INSERT INTO log SET ?',log_data, function (lgerr, lgres, fields) {
    //                 if (lgerr) {
    //                 console.log(lgerr)
    //                 }else{
    //                     console.log("log added successfully");
    //                 }
    //             });

    //             res.json({
    //                 status:true,
    //                 message:'Credit Note Updated sucessfully'
    //             })
    //         }
    //     });
    // }

}