var q = require('q');
module.exports = {

    validateRegister: (req) => {
        var deferred = q.defer();

        req.checkBody('name', 'Please enter name').notEmpty();
        
        req.checkBody('email', 'Please enter email').notEmpty();
        req.checkBody('email', 'Please enter email').isEmail();
        req.checkBody('password', 'Please enter password').notEmpty();

        if (!req.validationErrors()) {
            deferred.resolve([]);
        } else {
            deferred.resolve(req.validationErrors());
        }
        return deferred.promise;
    },
   

    validateLogin: (req, isForgotPassword = false) => {
        var deferred = q.defer();
         
            req.checkBody('password', 'Please enter password').notEmpty();
        
        req.checkBody('email', 'Please enter email').notEmpty();
        if (!req.validationErrors()) {
            deferred.resolve([]);
        } else {
            deferred.resolve(req.validationErrors());
        }
        return deferred.promise;
    },

   

   

    
     

   
   


    

    


   
}
