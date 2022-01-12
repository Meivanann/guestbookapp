

module.exports = (app) => {
    const commentController = require('../controllers/commentController.js');
    const flimController = require('../controllers/flimController.js');
    const authController = require('../controllers/AuthController.js');
     
   
    app.post('/user_register', authController.Userregister);
    app.post('/user_login', authController.Userlogin);
    app.post('/add_flim', authController.vaildatetoken,flimController.addFlim);
    app.get('/getflimlist', authController.vaildatetoken, flimController.getFlimlist);
    app.post('/getflimlistByslugname',  authController.vaildatetoken, flimController.getFlimlistbySlugname);
    app.post('/add_comment', authController.vaildatetoken,  commentController.postcomment);
    app.post('/list_comment',  authController.vaildatetoken, commentController.getpostcomment);
    
};