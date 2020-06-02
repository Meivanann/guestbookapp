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

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to PSA Application ." });
    });

    //login and register routes
    app.post('/register', userAuthenticationController.register);
    app.post('/login', userAuthenticationController.login);

    //dashboard routes
    app.get('/api/:id/operationaldashboard', operationalDashboardController.index);

    //userapproval
    app.get('/api/:id/user-activation', userApprovalController.index);
    app.post('/api/:id/user-activation/approval', userApprovalController.update);
    app.post('/api/:id/user-activation/destroy', userApprovalController.destroy);

    //dashboard - Consignment Hq
    app.get('/api/:id/getconsignmenthq', consignmentController.getConsignmentHq);
    app.get('/api/:id/getconsignmentnorth', consignmentController.getConsignmentNorth);
    app.get('/api/:id/getconsignmentsouth', consignmentController.getConsignmentSouth);
    app.post('/api/:id/postconsignmenthq', consignmentController.postConsignmentHq);
    app.post('/api/:id/postconsignmentnorth', consignmentController.postConsignmentNorth);
    app.post('/api/:id/postconsignmentsouth', consignmentController.postConsignmentSouth);

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

    //maintaninence - Add Shipper
    app.post('/api/:id/addShipper', shippingController.store);
    app.post('/api/:id/updateShipper', shippingController.update);

    //manifest
    app.post('/api/:id/driverofd', manifest.driverofd);
    app.post('/api/:id/manifestsearch', manifest.manifestSearch);


    //maintainence - Destination
    app.get('/api/:id/getdestination', destinationController.index);
    app.post('/api/:id/adddestination', destinationController.store);
    app.post('/api/:id/updatedestination', destinationController.update);
}