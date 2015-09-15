/*
 * The configuration file to be used to have deployment settings 
 * and other common settigs for the api
 */

var config = {
    port: 3010,
    mongodb: 'mongodb://localhost/random',    
    mailsettings: {
        smtp: {
            user: "robina_calpine@yahoo.com",
            password: "123Calpine*",
            host: "smtp.mail.yahoo.com",
            ssl: true,
        },
        mailfrom: "Admin omniscient <robina_calpine@yahoo.com>",
    },
    schema: {
        Admin: {
            fields: {
                name: String,
                email: {type: String, required: true, unique: true, lowercase: true, trim: true},
                password : String                
            },
            collection: 'admins'
        },
        OnlineUsers : {
            fields : {
                socket : String,
                name : String,
                interests : [{type : String}],
                available :  {type : Boolean, default : true}
            },
            collection : 'onlineusers'
        },
        Users : {
            fields: {               
                email : {type: String, required: true, unique: true, lowercase: true, trim: true},
                password : String,               
                name    : String,
                firstname : String,
                middlename : String,
                lastname : String,
                token : String,
                active : {type : Boolean, default : true},
                registered_date :{type: Date, default: Date.now},
            },
            collection : 'users'
                
        },
         
    }
};

// Object which will be available to external callers
module.exports = config;
