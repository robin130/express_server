/*
 * The model functions that will do all kind of interactions to mongodb
 * It requires mongodb and mongoose
 */
var mongoose = require("mongoose"),
        config = require('./config'),
        jwt    = require("jsonwebtoken");
process.env.JWT_SECRET = 'secret_pingyou';
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}       
function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

var api = {
    models: {},
    init: function() {
        mongoose.connect(config.mongodb ? config.mongodb : "mongodb://localhost/pingme");
        return this;
    },
    initiateMongooseModels: function() {
        for (var i in config.schema) {
            if (config.schema[i].collection)
                this.models[i] = mongoose.model(i, new mongoose.Schema(config.schema[i].fields), config.schema[i].collection);
            else
                this.models[i] = mongoose.model(i, new mongoose.Schema(config.schema[i].fields));
        }
    },
    getMongooseModels: function() {
        return this.models;
    },
    authenticate : function(req,res){
        var data = !isEmptyObject(req.body)?req.body : (!isEmptyObject(req.params)?req.params : req.query);            
        var check = {};
        if(data.email && data.email != '')
            check.email = data.email;
        else if(data.username && data.username != '')
            check.username = data.username;
        
        if((check.username || check.email) && data.password && data.password != '' ){
            api.models.Users.findOne({email : data.email, password : data.password},{},function(err,user){
                if(err){
                    res.json({error : err});
                }else{
                    if(user){
                        res.json({success : user});
                    }else{
                        res.json({error : 'Invalid login details!'})
                    }
                }
            });
        }else {
            res.json({error : 'Email/Username and password are required!'});
        }        
    },
    registerUser : function(req,res){
        var data = !isEmptyObject(req.body)?req.body : (!isEmptyObject(req.params)?req.params : req.query);        
        api.models.Users.findOne(data,{},function(err,user){
            if(err){
                res.json({'error':err});                
            }
            else{
                if(user){
                    res.json({'error':'User already exists!'});                    
                }else{                    
                    new api.models.Users(data).save(function(err,user){
                        if(err){
                            res.json({'error':err});                            
                        }
                        else{
                            user.token = jwt.sign(user, process.env.JWT_SECRET);
                            user.save(function(err,doc){
                               res.json({success : doc}); 
                            });                                                        
                        }
                    });
                }
                
            }
        });        
    },
    me : function(req,res){
        if(req.token){
            api.models.Users.findOne({token: req.token}, function(err, user) {
                if (err) {
                    res.json({error : err});
                } else {
                    res.json({success : user});
                    console.log('this is just to check if im alive after user gets the response;');
                }
            }); 
        }else{
            res.json({error: 'Not authorized!'})
        }              
        
    },
    getUsers : function(req,res){        
        var data = !isEmptyObject(req.body)?req.body : (!isEmptyObject(req.params)?req.params : req.query);        
        if(data.email || data.username || data._id){
            api.models.Users.findOne(data,{},function(err,doc){
                if(err){
                    res.json({error : err});
                    res.end();
                }else{
                    res.json({success : doc});
                    res.end();
                }
            });            
        }else{
            api.models.Users.find({},{},function(err,docs){
                if(err){
                    res.json({error : err});
                    res.end();
                }else{
                    res.json({success : docs});
                    res.end();
                }                
            });
        }
    },
    insertPost : function(req,res){
        var params = !isEmptyObject(req.body)?req.body : (!isEmptyObject(req.params)?req.params : req.query);
        new api.models.Posts(params).save(function(err,doc){
            if(err)
                res.json({error : err});
            res.json(doc);
        });
    },

};
api.init();
// Functions which will be available to external callers
module.exports = api;
