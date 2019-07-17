var mysql = require("mysql");
var DBConfig = require("./DBConfig");

var StoreDatabase = function () {
    this.connection = mysql.createConnection(DBConfig.getConfig());

    this.connection.connect(err => {
        if (err) throw err;
    });

    this.getAllProducts = function (callback) {
        this.connection.query("SELECT * FROM products", (err, res) => {
            if (err) throw err;

            callback(res);
        });
    }

    this.getProductByID = function (id, callback) {
        this.connection.query("SELECT * FROM products WHERE ?", { item_id: id }, (err, res) => {
            if (err) throw err;

            callback(res[0]);
        });
    }

    this.getProductByNameAndDepartment = function(name, department, callback) {
        this.connection.query("SELECT * FROM products WHERE product_name = ? AND department_name = ?", [name, department], (err, res) => {
            if (err) throw err;

            callback(res[0]);
        });
    }

    this.getProductsStockLessThan = function (value, callback) {
        this.connection.query("SELECT * FROM products WHERE stock_quantity < ?", [value], (err, res) => {
            if (err) throw err;

            callback(res);
        });
    }

    this.addNewProduct = function(product, callback) {
        this.connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)", [product.product_name, product.department_name, product.price, product.stock_quantity], err => {
            if(err) throw err;

            callback();
        });
    }

    this.updateProductAmount = function (item, callback) {
        this.connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [item.stock_quantity, item.item_id], err => {
            if (err) throw err;

            callback();
        });
    }

    this.close = function () { this.connection.end(); }

}

module.exports = StoreDatabase;