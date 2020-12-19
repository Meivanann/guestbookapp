var customerModel = require('../models/customer'); 

module.exports = {
    createCustomer: (req,res) => {
         
customerModel.addCustomer(req).then(values=>
    {
            res.json(values)

        })


   
    
},
customerLogin: (req,res) => {
         
    customerModel.customerLogin(req).then(values=>
        {
                res.json(values)
    
        })

    }
}