/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// visit http://stackoverflow.com/questions/4840879/nodejs-how-to-get-the-servers-port
// to know why require('http') is being used eventhough express is using

var http        = require('http'),
    express     = require('express'),     
    mongoose    = require('mongoose'),
    app         = express(),
    server      = http.createServer(app),
    config      = require('./config'),
    router      = require('./router'),
    routes      = new(router)
    chat        = require('./chat');

var session = require("express-session")({
    secret: "my-secret",
    key : 'express.sid',
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");


// Use express-session middleware for express
app.use(session); 

//to remove the X-powered By header from the request
app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By");  
  next();
});
app.use(express.bodyParser());
app.use(express.cookieParser());
 
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');    
    if(req.method == 'OPTIONS'){
        res.end();
    }else{
        next();
    }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
//Init the express routes for this API
routes.initAllRoutes(app);

// listen on the port
server.listen(config.port, function(){  
  console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});


var io = require('socket.io').listen(server);

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session, {
    autoSave:true
})); 


chat.init(io);


process.on('uncaughtException', function(err) {
    console.log(err);
});