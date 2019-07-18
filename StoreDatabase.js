var mysql = require("mysql");
var DBConfig = require("./DBConfig");

var SELECT_PRODUCT_QUERY_BASE = "SELECT item_id, product_name, department_name, price, stock_quantity, product_sales FROM products LEFT JOIN departments ON products.department_id = departments.department_id";

var StoreDatabase = function () {
    this.connection = mysql.createConnection(DBConfig.getConfig());

    this.connection.connect(err => {
        if (err) throw err;
    });

    this.getAllProducts = function (callback) {
        this.connection.query(SELECT_PRODUCT_QUERY_BASE, (err, res) => {
            if (err) throw err;

            callback(res);
        });
    }

    this.getProductByID = function (id, callback) {
        this.connection.query(SELECT_PRODUCT_QUERY_BASE + " WHERE ?", { item_id: id }, (err, res) => {
            if (err) throw err;

            callback(res[0]);
        });
    }

    this.getProductByNameAndDepartment = function(name, department, callback) {
        this.connection.query(SELECT_PRODUCT_QUERY_BASE + " WHERE product_name = ? AND department_name = ?", [name, department], (err, res) => {
            if (err) throw err;

            callback(res[0]);
        });
    }

    this.getProductsStockLessThan = function (value, callback) {
        this.connection.query(SELECT_PRODUCT_QUERY_BASE + " WHERE stock_quantity < ?", [value], (err, res) => {
            if (err) throw err;

            callback(res);
        });
    }

    this.addNewProduct = function(product, callback) {
        this.connection.query("INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES (?,?,?,?)", [product.product_name, product.department_id, product.price, product.stock_quantity], err => {
            if(err) throw err;

            callback();
        });
    }

    this.updateProduct = function (item, callback) {
        this.connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [item.stock_quantity, item.product_sales, item.item_id], err => {
            if (err) throw err;

            callback();
        });
    }

    this.getDepartmentByName = function(name, callback) {
        this.connection.query("SELECT * FROM departments WHERE ?", { department_name: name }, (err, res) => {
            if (err) throw err;

            callback(res[0]);
        });
    }

    this.close = function () { this.connection.end(); }

}

module.exports = StoreDatabase;