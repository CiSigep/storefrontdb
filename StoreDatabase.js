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

    this.updateProductAmount = function(item, callback) {
        this.connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [item.stock_quantity, item.item_id], err => {
            if(err) throw err;

            callback();
        });
    }

    this.close = function() {this.connection.end();}

}

module.exports = StoreDatabase;