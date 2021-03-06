require("dotenv").config();

// Create a database config object from a file
var DBConfig =  {
    getConfig : function(){
        return {
            host: process.env.DBHOST,
            port: process.env.DBPORT,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            database: process.env.DBDATABASE
        };
    }
};

module.exports = DBConfig;