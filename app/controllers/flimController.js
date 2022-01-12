var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
 
const flimModels = require('../models/flimModels');
module.exports = {
 
    addFlim: (req, res) => {

        flimModels.addFlim(req).then(results => {
            res.json(results);
        });
    },

    getFlimlist: (req, res) => {

        flimModels.getflimDetails(req, res).then(results => {
            res.json(results);
        });

    },

    getFlimlistbySlugname: (req, res) => {

        
                flimModels.getflimDetailsbySlugname(req).then(results => {
                    res.json(results);
                });

            

       
    },

    

   

    
}

