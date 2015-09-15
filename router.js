/*
 * The router module that handles all the routes in the API
 */
var api_model       = require('./api_model');
var express     = require('express');   
 var fs = require('fs');   

function router(){
    this.init();
}

router.prototype = {
    init : function(){
       api_model.initiateMongooseModels(); 
    },
    initAllRoutes : function(app){
        app.use(express.static('../client'));
         
        app.all('/api/authenticate',api_model.authenticate);
        app.all('/api/me',api_model.me);
        
        app.post('/api/user',api_model.registerUser);
        app.get('/api/user',api_model.getUsers);
        
        app.post('/api/post',api_model.insertPost);
        
        
     }       
};


module.exports = router;
