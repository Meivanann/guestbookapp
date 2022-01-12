var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var validation = require('../common/validation');
 
const commentModels = require('../models/commentModels');

module.exports = {

    getpostcomment: (req,res) => { 
        commentModels.getPostComment(req,res).then(results => {
            res.json(results);
        });

    },

        postcomment: (req, res) => {
            commentModels.postComment(req,res).then(results => {
                res.json(results);
            });
        },

       
 
}

