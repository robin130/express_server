/*
 * The model functions that will do all kind of interactions to mongodb
 * It requires mongodb and mongoose
 */
var mongoose = require("mongoose"),
        config = require('./config'),
        _und = require('underscore'),
        random = require('./random');      

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}       

function User(){   
}

Array.prototype.getObjectIndex = function (object) {
    for (var i = 0; i < this.length; i++) {
        if (_und.isEqual(this[i],object)) {
            return i;
        }
    }
} 

var chat = {
    io : '',
    onlineUsers : [],
    activeChats : [],
    onlineSockets : {},
    init: function(io) {        
        chat.io = io;
         
        io.on('connection', function (socket) {                                     
            socket.emit('connected', {totalOnlineUsers : random.totalOnline(), me : 2233131 });
            chat.handleOtherSocketEvents(socket);                      
        });
       
    },
    handleOtherSocketEvents : function(socket){
        var user = '';        
        socket.on('randomFetch', function (options) {
          console.log(options);  
          random.newUser({socket : socket, interests : options.interests ? _und.pluck(options,'text') : []});
          random.fetchRandomUser(options,function(user){
              setTimeout(function(){socket.emit('matchFound',{userid : user._id})},1000);
          });          
        });
        socket.on('chat', function (data) { 
            
            
        });
        socket.on('error', function (err,sec) {
          console.log('erro=>'+err);          
        });
        socket.on('disconnect', function () { 
           random.removeUser({socket : socket});              
           chat.io.sockets.emit('disconnected')    
           console.log(random.totalOnline());
        });
    },  
     

};
 
// Functions which will be available to external callers
module.exports = chat;


