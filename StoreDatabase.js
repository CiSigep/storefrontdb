var mysql = require("mysql");
var DBConfig = require("./DBConfig");

var StoreDatabase = function() {
    this.connection = mysql.createConnection(DBConfig.getConfig());

    this.connection.connect(err => {
        if(err) throw err;
    });

    this.getAllProducts = function(callback) {
        this.connection.query("SELECT * FROM products", (err,res) => {
            if(err) throw err;

            callback(res);
        });
    }

    this.close = function() {this.connection.end();}

}

module.exports = StoreDatabase;