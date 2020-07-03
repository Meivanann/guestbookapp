const dashboardController = require('./../controllers/Admin/operationalDashboard/dashboardController');
const ConsignmentController = require('./../controllers/Driver/ConsignmentController');

module.exports = app => { 

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
    
    //drivercontroller declaration
    var driverConsignmentController = require('./../controllers/Driver/ConsignmentController');

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

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to PSA Application ." });
    });

    //login and register routes
    app.post('/register', userAuthenticationController.register);
    app.post('/login', userAuthenticationController.login);

    //dashboard routes
    app.get('/api/:id/operationaldashboard', operationalDashboardController.index);
    app.get('/api/:id/getpodbill', operationalDashboardController.getPodBill);

    //userapproval
    app.get('/api/:id/user-activation', userApprovalController.index);
    app.post('/api/:id/user-activation/approval', userApprovalController.update);
    app.post('/api/:id/user-activation/destroy', userApprovalController.destroy);
    app.get('/api/:id/users', userApprovalController.getAllUsers);
    app.post('/api/:id/user/destroy', userApprovalController.deleteUser);

    //dashboard - Consignment Hq
    app.get('/api/:id/getallconsignments', consignmentController.getAllConsignments);
    app.get('/api/:id/getalltheconsignments', consignmentController.getAllTheConsignments);
    app.get('/api/:id/getconsignmenthq', consignmentController.getConsignmentHq);
    app.get('/api/:id/getconsignmentnorth', consignmentController.getConsignmentNorth);
    app.get('/api/:id/getconsignmentsouth', consignmentController.getConsignmentSouth);
    app.get('/api/:id/getconsignmentsforapproval', dashboardController.getAllConsignmentsForApproval);
    app.post('/api/:id/postconsignmenthq', consignmentController.postConsignmentHq);
    app.post('/api/:id/postconsignmentnorth', consignmentController.postConsignmentNorth);
    app.post('/api/:id/postconsignmentsouth', consignmentController.postConsignmentSouth);
    app.post('/api/:id/postconsignmentapproval', dashboardController.postConsignmentApproval);
    app.get('/api/:id/deleteconsignment/:cn_no', consignmentController.deleteConsignment);

    //new-Consignment Api's
    app.get('/api/:id/getshipperdata', newConsignmentController.getShipperDetails);
    app.get('/api/:id/getdestinationdetails/:shipper_code', newConsignmentController.getDestinationDetails);
    app.post('/api/:id/getchargedetails', newConsignmentController.getChargeDetails);
    app.post('/api/:id/postnewconsignment', newConsignmentController.postNewConsignment);
    app.post('/api/:id/updateconsignment', newConsignmentController.updateConsignment);
    app.get('/api/:id/checkconsignmentnote/:cn_no', newConsignmentController.checkConsignmentNote);

    //tracking
    app.get('/api/:id/tracking/:cn_no', trackingController.index);

    //outforDelivery
    app.get('/api/:id/outfordelivery', outforDelivery.index);
    app.get('/api/:id/outfordeliverycompleted', outforDelivery.ofdCompleted);
    app.post('/api/:id/updateoutfordelivery',outforDelivery.upload);

    //manifest
    app.post('/api/:id/driverofd', manifest.driverofd);
    app.post('/api/:id/manifestsearch', manifest.manifestSearch);

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


    // financial Dasboard

    // Invoice
    app.get('/api/:id/getallinvoices', invoiceController.getAllInvoices);
    app.get('/api/:id/checkinvoice/:invoice_no', invoiceController.checkInvoice);
    app.post('/api/:id/getinvoice', invoiceController.getInvoices);
    app.post('/api/:id/previewinvoice', invoiceController.previewInvoice);
    app.post('/api/:id/consignmentpreviewinvoice', invoiceController.consignmentPreviewInvoice);
    app.post('/api/:id/generateinvoice', invoiceController.generateInvoice);
    app.post('/api/:id/consignmentgenerateinvoice', invoiceController.consignmentGenerateInvoice);
    app.post('/api/:id/recordpayment', invoiceController.recordPayment);

    // CreditNote
    app.get('/api/:id/getallcreditnotes', creditNoteController.index);
    app.get('/api/:id/getcreditnote/:shipper_code', creditNoteController.getCreditNote);
    app.get('/api/:id/getcreditnote/:shipper_code/:credit_note_id', creditNoteController.getCreditNoteDetails);
    app.post('/api/:id/createcreditnote', creditNoteController.store);
    app.post('/api/:id/creditnote/recordpayment', creditNoteController.recordPayment);

    // DebitNote
    app.get('/api/:id/getalldebitnotes', debitNoteController.index);
    app.get('/api/:id/getdebitnote/:shipper_code', debitNoteController.getDebitNote);
    app.get('/api/:id/getdebitnote/:shipper_code/:debit_note_id', debitNoteController.getDebitNoteDetails);
    app.post('/api/:id/createdebitnote', debitNoteController.store);
    app.post('/api/:id/debitnote/recordpayment', debitNoteController.recordPayment);

    // Acoount-Statement
    app.post('/api/:id/getaccountstatement', accStatementController.getAccountStatement);

    // Expense
    app.get('/api/:id/getallvendors', billController.getAllVendors);
    app.get('/api/:id/deletevendor', billController.destroyVendor);
    app.post('/api/:id/postnewvendor', billController.postNewVendor);
    app.post('/api/:id/updatevendor', billController.updateVendor);

    app.get('/api/:id/getallbills', billController.getAllBills);
    app.get('/api/:id/getbill/:vendor_id', billController.getBill);
    app.get('/api/:id/getbilldetails/:vendor_id/:bill_id', billController.getBillDetails);
    app.post('/api/:id/createbill', billController.createBill);
    // app.post('/api/:id/creditnote/recordpayment', creditNoteController.recordPayment);


    // transaction
    app.get('/api/:id/getalltransactions', transactionController.getAllTransactions);
    app.post('/api/:id/postexpense', transactionController.PostNewExpense);
    app.post('/api/:id/postincome', transactionController.PostNewIncome);

    // charts of accounts
    app.get('/api/:id/getallaccounttypes', chartAccountController.getAllAccountTypes);
    app.get('/api/:id/getallaccounts', chartAccountController.getAllAccounts);
    app.post('/api/:id/createaccount', chartAccountController.postNewAccount);

    // client routes starts here
    
    // new consignment routes
    app.post('/api/:id/client/postnewconsignment', clinetNewCosignmentController.postNewConsignmentClient);
    app.post('/api/:id/client/updateconsignment', clinetNewCosignmentController.updateConsignment);

    // Consignment routes
    app.get('/api/:id/client/getallconsignments', clientConsignmentController.getAllConsignments);
    app.get('/api/:id/client/getallapprovedconsignments', clientConsignmentController.getAllApprovedConsignments);

    // invoice routes
    app.get('/api/:id/client/getallinvoices', clientInvoiceController.getAllInvoices);

}