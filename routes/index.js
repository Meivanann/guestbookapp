

module.exports = app => { 
    var fileUpload = require('express-fileupload');
    app.use(fileUpload());

    const redirectLogin = (req, res, next) => { 
        console.log(req.session.userId);
        if(!req.session.userId){
            res.json({ message: "Session Expired"})
        } else {
            next()
        }
    }

    //controller declartions
    var userAuthenticationController = require('../controllers/userAuthenticationController');
    var operationalDashboardController = require('./../controllers/Admin/operationalDashboard/dashboardController');
    var userApprovalController = require('./../controllers/Admin/userApprovalController');
    var consignmentController = require('./../controllers/Admin/operationalDashboard/consignmentController');
    var newConsignmentController = require('./../controllers/Admin/operationalDashboard/newConsignmentcontroller');
    var shippingController = require('./../controllers/Admin/Maintainence/shippinController');
    var trackingController = require('./../controllers/Admin/operationalDashboard/trackingController');
    var outforDelivery = require('./../controllers/Admin/operationalDashboard/outForDeliveryController');
    var manifest = require('./../controllers/Admin/operationalDashboard/manifestController');
    var destinationController = require('./../controllers/Admin/Maintainence/destinationController');
    var receiverController = require('./../controllers/Admin/Maintainence/receiverController');
    var chargesController = require('./../controllers/Admin/Maintainence/chargesController');
    var taxController =require('./../controllers/Admin/Maintainence/taxController');
    var dashboardController=require('./../controllers/Admin/operationalDashboard/dashboardController')
    //drivercontroller declaration
    var driverConsignmentController = require('./../controllers/Driver/ConsignmentController');
    var drivercontroller = require('./../controllers/Driver/driverController');

    //finance controllers declarations
    var invoiceController = require('./../controllers/Admin/FinancialDashboard/invoiceController');
    var creditNoteController = require('./../controllers/Admin/FinancialDashboard/creditNoteController');
    var debitNoteController = require('./../controllers/Admin/FinancialDashboard/debitNoteController');
    var accStatementController = require('./../controllers/Admin/FinancialDashboard/customerStatementController');
    var billController = require('../controllers/Admin/FinancialDashboard/billController');
    var transactionController = require('./../controllers/Admin/FinancialDashboard/TransactionController');
    var chartAccountController = require('./../controllers/Admin/FinancialDashboard/chartsAccountController');

    // Client Controller declarations
    var clinetNewCosignmentController = require('./../controllers/Client/NewConsignmentController');
    var clientConsignmentController = require('./../controllers/Client/consignmentController');
    var clientInvoiceController = require('./../controllers/Client/invoiceController');
    var bankreconcilationcontroller=require('../controllers/Admin/Report/Bankreconcilation');
    //report controller
    var reportController=require('./../controllers/Admin/Report/reportController');


    //login and register routes
    app.post('/register', userAuthenticationController.register);
    app.post('/login', userAuthenticationController.login);
    app.post('/api/:id/setpassword', userAuthenticationController.setPassword);
    app.post('/api/editbill', billController.editBill);
    //dashboard routes
    app.get('/api/:id/operationaldashboard', operationalDashboardController.index);
    app.get('/api/:id/getpodbill', operationalDashboardController.getPodBill);

    //userapproval
    app.get('/api/:id/user-activation', userApprovalController.index);
    app.post('/api/:id/user-activation/approval', userApprovalController.update);
    app.post('/api/:id/user-activation/destroy', userApprovalController.destroy);
    app.get('/api/:id/users', userApprovalController.getAllUsers);
    app.post('/api/:id/user/destroy', userApprovalController.deleteUser);
    app.post('/api/:id/user/add', userApprovalController.addUser);
    app.post('/api/:id/user/update', userApprovalController.updateUser);
    app.get('/api/:id/user/:user_id', userApprovalController.viewUser);

    //dashboard - Consignment Hq
    app.get('/api/:id/getallconsignments', consignmentController.getAllConsignments);
    app.get('/api/:id/getalltheconsignments', consignmentController.getAllTheConsignments);
    app.post('/api/:id/getconsignmenthq', consignmentController.pagnitiongetConsignmentHq);
    app.get('/api/:id/getconsignmenthq', consignmentController.getConsignmentHq);
    app.post('/api/:id/getconsignmentnorth', consignmentController.getConsignmentNorth);
    app.post('/api/:id/getconsignmentsouth', consignmentController.getConsignmentSouth);
    app.get('/api/:id/getconsignmentsforapproval', dashboardController.getAllConsignmentsForApproval);
    app.post('/api/:id/postconsignmenthq', consignmentController.postConsignmentHq);
    app.post('/api/:id/postconsignmentnorth', consignmentController.postConsignmentNorth);
    app.post('/api/:id/postconsignmentsouth', consignmentController.postConsignmentSouth);
    app.post('/api/:id/postconsignmentapproval', dashboardController.postConsignmentApproval);
    app.get('/api/:id/deleteconsignment/:cn_no', consignmentController.deleteConsignment);
    app.post('/api/deleteonlineconsignment', consignmentController.onlineDeleteConsignment);
    app.get('/api/:id/getlogs/:cn_no', consignmentController.getLogs);
    app.post('/api/:id/pushconsignmentback',consignmentController.postConsignmentBack);

    //new-Consignment Api's
    app.get('/api/:id/getshipperdata', newConsignmentController.getShipperDetails);
    app.get('/api/:id/getdestinationdetails/:shipper_code', newConsignmentController.getDestinationDetails);
    app.post('/api/:id/getchargedetails', newConsignmentController.getChargeDetails);
    app.post('/api/:id/postnewconsignment', newConsignmentController.postNewConsignment);
    app.post('/api/:id/updateconsignment', newConsignmentController.updateConsignment);
    app.post('/api/:id/checkconsignmentnote', newConsignmentController.checkConsignmentNote);
    app.post('/api/invoicepaymentlist', invoiceController.getpaymentlist);

    app.post('/api/exceltojson', bankreconcilationcontroller.exceldatatoJson);
    app.post('/api/savebankstament', bankreconcilationcontroller.savecsvdata);
    app.post('/api/getbankstatment', bankreconcilationcontroller.getbankstatement);
    app.post('/api/addingendingbalance', bankreconcilationcontroller.addendingbalance);
    app.post('/api/updateendingbalance', bankreconcilationcontroller.updateendingbalance);
    app.post('/api/bankstatuslist', bankreconcilationcontroller.getstatusbankstatement);
    app.post('/api/indexbankstatuslist', bankreconcilationcontroller.getindexlist);
    app.get('/api/templatefile', bankreconcilationcontroller.gettemplatefile);
    app.post('/api/bankhoverlist', bankreconcilationcontroller.getindexhoverlist);
    app.post('/api/updatematchedlist', bankreconcilationcontroller.updatematchedlist);
    app.post('/api/deletetransaction', bankreconcilationcontroller.deletetransactionlist);
    
    //tracking
    app.post('/api/:id/tracking', trackingController.index);
    app.post('/uploaduserimage', userAuthenticationController.userupload);
    //outforDelivery
    app.post('/api/:id/outfordelivery', outforDelivery.index);
    app.get('/api/:id/outfordeliverycompleted', outforDelivery.ofdCompleted);
    app.post('/api/:id/updateoutfordelivery',outforDelivery.upload);
    app.post('/api/:id/deletepod', outforDelivery.deletePod);

    //manifest
    app.post('/api/:id/driverofd', manifest.driverofd);
    app.post('/api/:id/manifestsearch', manifest.manifestSearch);
    app.post('/api/printdocument',outforDelivery.manifestdriverprint);

    //maintaninence - Add Shipper
    app.post('/api/:id/addShipper', shippingController.store);
    app.post('/api/:id/updateShipper', shippingController.update);
    app.get('/api/:id/deleteShipper/:shipping_id', shippingController.destroy);

    //maintainence - Destination
    app.get('/api/:id/getdestination', destinationController.index);
    app.get('/api/:id/getregion/:destination_code', destinationController.getRegion);
    app.post('/api/:id/adddestination', destinationController.store);
    app.post('/api/:id/updatedestination', destinationController.update);
    app.get('/api/:id/deletedestination/:destination_id', destinationController.destroy);
    app.get('/api/:id/getdestinationcodesofshipper/:shipper_code', destinationController.getDestinationShipperData);
    app.post('/api/:id/postdestinationcodesofshipper', destinationController.postDestinationShipperData);

    //maintanence - Receiver
    app.get('/api/:id/getreceiver', receiverController.index);
    app.post('/api/:id/addreceiver', receiverController.store);
    app.post('/api/:id/updatereceiver', receiverController.update);
    app.get('/api/:id/deletereceiver/:receiver_id', receiverController.destroy);

    // Maintaninence - charges
    app.get('/api/:id/getCharges/:shipper_code', chargesController.search);
    app.post('/api/:id/updateCharges', chargesController.update);

    //Maintainence - tax 
    app.get('/api/:id/gettax', taxController.index);
    app.post('/api/:id/updatetax', taxController.update);


    //driver - routes
    // Consignemnt
    app.get('/api/:id/getdrivers', driverConsignmentController.getDriverDetails);
    app.get('/api/:id/getdriverofd', driverConsignmentController.index);
    app.get('/api/:id/getdriverofdcompleted', driverConsignmentController.ofdCompleted);
    app.get('/api/:id/driver/getreceivercodes', drivercontroller.getReceiverCodes);
    app.get('/api/:id/driver/getreceiverconsignments/:receiver_code', drivercontroller.getReceiverConsignments);
    app.post('/api/driver/receiverconsignmentsstatusupdate', drivercontroller.updateConsigmentstatus);
    app.post('/api/driver/consigment_list', drivercontroller.getconsigmentlist);

    // financial Dasboard

    // Invoice
    app.get('/api/:id/getallinvoices', invoiceController.getAllInvoices);
    app.get('/api/:id/checkinvoice/:invoice_no', invoiceController.checkInvoice);
    app.post('/api/:id/getinvoice', invoiceController.getInvoices);
    app.post('/api/:id/previewinvoice', invoiceController.previewInvoice);
    app.post('/api/:id/consignmentpreviewinvoice', invoiceController.consignmentPreviewInvoice);
    app.post('/api/:id/generateinvoice', invoiceController.generateInvoice);
    app.post('/api/:id/deleteinvoice', invoiceController.deleteInvoice);
    app.post('/api/:id/consignmentgenerateinvoice', invoiceController.consignmentGenerateInvoice);
    app.post('/api/:id/recordpayment', invoiceController.recordPayment);

    // CreditNote
    app.get('/api/:id/getallcreditnotes', creditNoteController.index);
    app.get('/api/:id/getcreditnote/:shipper_code', creditNoteController.getCreditNote);
    app.get('/api/:id/getcreditnote/:shipper_code/:credit_note_id', creditNoteController.getCreditNoteDetails);
    app.post('/api/:id/createcreditnote', creditNoteController.store);
    app.post('/api/:id/creditnote/recordpayment', creditNoteController.recordPayment);
    app.post('/api/deletecreditnote', creditNoteController.deleteCreditNote);
    app.post('/api/editcreditnote', creditNoteController.editCreditNote);

    app.post('/api/creditpaymentlist', creditNoteController.getCreditNotepaymentlist);
    
    // DebitNote
    app.get('/api/:id/getalldebitnotes', debitNoteController.index);
    app.get('/api/:id/getdebitnote/:shipper_code', debitNoteController.getDebitNote);
    app.get('/api/:id/getdebitnote/:shipper_code/:debit_note_id', debitNoteController.getDebitNoteDetails);
    app.post('/api/:id/createdebitnote', debitNoteController.store);
    app.post('/api/:id/debitnote/recordpayment', debitNoteController.recordPayment);
    app.post('/api/deletedebitnote', debitNoteController.deletedebitNote);
    app.post('/api/editdebitnote', debitNoteController.editDebitNote);
    app.post('/api/debitpaymentlist', debitNoteController.getdebitNotepaymentlist);
    // Acoount-Statement
    app.post('/api/:id/getaccountstatement', accStatementController.getAccountStatement);
    app.post('/getimage', userAuthenticationController.getimageurl);
    // Expense
    app.get('/api/:id/getallvendors', billController.getAllVendors);
    app.get('/api/:id/deletevendor/:vendor_id', billController.destroyVendor);
    app.post('/api/:id/postnewvendor', billController.postNewVendor);
    app.post('/api/:id/updatevendor', billController.updateVendor);

    app.get('/api/:id/getallbills', billController.getAllBills);
    app.get('/api/:id/getbill/:vendor_id', billController.getBill);
    app.get('/api/:id/getbilldetails/:vendor_id/:bill_id', billController.getBillDetails);
    app.post('/api/:id/createbill', billController.createBill);
    app.post('/api/:id/bill/recordpayment', billController.recordPayment);
    app.post('/api/bill/deleteBill', billController.deleteBill);

    // expenswe - products and services
    app.get('/api/:id/getallvendorproducts', billController.getAllVendorProducts);
    app.get('/api/:id/deletevendorproduct/:vendor_product_id', billController.destroyVendorProduct);
    app.post('/api/:id/postnewvendorproduct', billController.postNewVendorProduct);
    app.post('/api/:id/updatevendorproduct', billController.updateVendorProduct);

    
    //reportt
    app.post('/api/billpaymentlist', billController.getbillpayment);
    app.post('/api/profitandloss', reportController.ProfitandLossreport);
    app.get('/api/paymentaccountlist', reportController.getpaymentaccount);
    app.post('/api/balancesheet', reportController.BalanceSheetreport);
    app.post('/api/generalledger', reportController.Generalledger);
    app.post('/api/incomebycutomer', reportController.Incomebycustomer);
    app.get('/api/accountslist', reportController.getallAccounts);
    app.get('/api/accountslisttransaction', reportController.getaccountstransaction);
    // transaction
    app.post('/api/:id/getalltransactions', transactionController.getAllTransactions);
    app.post('/api/:id/postexpense', transactionController.PostNewExpense);
    app.post('/api/:id/postincome', transactionController.PostNewIncome);
    app.post('/api/gettransactiondetails', transactionController.getTransactiondetails);
    app.post('/api/deletetransaction', transactionController.deleteTransaction);
    app.post('/api/edittransaction', transactionController.Edittransaction);
    app.post('/api/gettransactioncategory', chartAccountController.gettransactioncategory);
    // charts of accounts
    app.get('/api/:id/getallaccounttypes', chartAccountController.getAllAccountTypes);
    app.get('/api/:id/getallaccounts', chartAccountController.getAllAccounts);
    app.get('/api/:id/getaccounts/:category', chartAccountController.getAccounts);
    app.post('/api/:id/createaccount', chartAccountController.postNewAccount);
    app.post('/api/editaccount', chartAccountController.editAccount);
    app.get('/api/getaccounttransaction', transactionController.gettransactionaccounts);
    // client routes starts here
    
    app.post('/api/client/getconsigmentnorth', clientConsignmentController.getConsignmentNorth);
    app.post('/api/client/getconsigmentsouth', clientConsignmentController.getConsignmentSouth);
    app.post('/api/client/getconsigmenthq', clientConsignmentController.getConsignmenthq);
    app.post('/api/client/consigmentonroad', clientConsignmentController.getclientconsigmentroad);
    app.post('/api/client/consigmenttocheck', clientConsignmentController.getclientpodcheck);
    app.post('/api/client/podtobill', clientConsignmentController.getclientPodBill);
    // new consignment routes3
    app.get('/api/:id/generateconsignmentnumber', clinetNewCosignmentController.generateNeConsignmentNumber);
    app.post('/api/:id/client/postnewconsignment', clinetNewCosignmentController.postNewConsignmentClient);
    app.post('/api/:id/client/updateconsignment', clinetNewCosignmentController.updateConsignment);

    // Consignment routes
    app.get('/api/:id/client/getallconsignments', clientConsignmentController.getAllConsignments);
    app.get('/api/:id/client/getallapprovedconsignments', clientConsignmentController.getAllApprovedConsignments);


    // invoice routes
    app.get('/api/:id/client/getallinvoices', clientInvoiceController.getAllInvoices);


   

}