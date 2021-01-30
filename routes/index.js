

module.exports = app => {




    //controller declartions
    var studentcontroller = require('../controllers/customerController');


    //api endpoints
    app.post('/createcustomer', studentcontroller.createCustomer);
    app.post('/customerlogin', studentcontroller.customerLogin);

    app.get('/customerdetails', studentcontroller.customerDetails);


}