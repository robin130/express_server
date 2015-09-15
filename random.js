/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var _und = require('underscore'),   
    api = require('./api_model');
  

function user(user){
    this.socket = user.socket ? user.socket : '';
    this.name   = user.name ? user.name : 'Random User';
    this.interests = user.interests ? user.interests : [];
    this.available = true;
}

function random() {
    this.onlineUsers = [];
    
}

Array.prototype.match = function(arr){
    var match_count = 0;
    for(var i =0;i<arr.length;i++){
             
    }
};

random.prototype = {
    newUser : function(options){        
        var userdata = new user(options);         
        this.onlineUsers.push(userdata);
        
    },
    removeUser : function(user){
        if(this.onlineUsers.length){
            this.onlineUsers = _und.reject(this.onlineUsers,function(item){ return item.socket == user.socket})
        }else{
            throw Exception('No users online');
        }
    },
    totalOnline : function(){
        return this.onlineUsers.length;
    },
    fetchRandomUser : function(option,callback){
        _und.filter(this.onlineUsers,function(item){
            return item.interests.indexOf();
        });
    }
};
// Functions which will be available to external callers
module.exports = new random();
