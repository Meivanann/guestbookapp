var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var validation = require('../common/validation');
var authModels = require('../models/authModels');
 
var commonConfig = require('../config/common_config');
module.exports = {
    vaildatetoken: (req, res,next) => {

        

        authModels.validateToken(req,next).then(results => {
            res.json(results);
        });

},
    Userregister: (req, res) => {
        validation.validateRegister(req).then((validationResults) => {
            if (validationResults.length == 0) {
                authModels.Userregister(req).then(results => {
                    res.json(results);
                });
            } else {
                res.json({ status: 0, message: validationResults[0].msg })
            }
        });
    },

    Userlogin: (req, res) => {
        validation.validateLogin(req).then((validationResults) => {
            if (validationResults.length == 0) {
                authModels.Userlogin(req).then(results => {
                    res.json(results);
                });
            } else {
                res.json({
                    status: 0,
                    message: validationResults[0].msg
                });
            }
        });
    },
    
 

     
 
}

