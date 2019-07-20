var mysql = require("mysql");
var DBConfig = require("./DBConfig");


var SELECT_PRODUCT_QUERY_BASE = "SELECT item_id, product_name, department_name, price, stock_quantity, product_sales FROM products LEFT JOIN departments ON products.department_id = departments.department_id";

var StoreDatabase = function () {
    this.connection = mysql.createConnection(DBConfig.getConfig());

    this.connect = function(callback){
        // Create our connection
        this.connection.connect(err => {
            if (err) throw err;

            callback();
        });
    }
    
    // Gets all the products found in the database.
    this.getAllProducts = function (callback) {
        this.connection.query(SELECT_PRODUCT_QUERY_BASE, (err, res) => {
            if (err) throw err;

            callback(res);
        });
    }

    // Gets a singular product by its ID
    this.getProductByID = function (id, callback) {
        this.connection.query(SELECT_PRODUCT_QUERY_BASE + " WHERE ?", { item_id: id }, (err, res) => {
            if (err) throw err;

            callback(res[0]);
        });
    }

    // Gets a product by its name and department
    this.getProductByNameAndDepartment = function(name, department, callback) {
        this.connection.query(SELECT_PRODUCT_QUERY_BASE + " WHERE product_name = ? AND department_name = ?", [name, department], (err, res) => {
            if (err) throw err;

            callback(res[0]);
        });
    }

    // Gets products who have less than the given values amount
    this.getProductsStockLessThan = function (value, callback) {
        this.connection.query(SELECT_PRODUCT_QUERY_BASE + " WHERE stock_quantity < ?", [value], (err, res) => {
            if (err) throw err;

            callback(res);
        });
    }

    // Adds a new product
    this.addNewProduct = function(product, callback) {
        this.connection.query("INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES (?,?,?,?)", [product.product_name, product.department_id, product.price, product.stock_quantity], err => {
            if(err) throw err;

            callback();
        });
    }

    // Updates an Existing product
    this.updateProduct = function (item, callback) {
        this.connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [item.stock_quantity, item.product_sales, item.item_id], err => {
            if (err) throw err;

            callback();
        });
    }

    // Gets a department by its name
    this.getDepartmentByName = function(name, callback) {
        this.connection.query("SELECT * FROM departments WHERE ?", { department_name: name }, (err, res) => {
            if (err) throw err;

            callback(res[0]);
        });
    }
    
    // Gets Sales for all departments
    this.getProductSales = function(callback) {
        this.connection.query("SELECT departments.department_id, department_name, SUM(IFNULL(products.product_sales, 0)) AS product_sales, over_head_costs, (SUM(IFNULL(products.product_sales, 0)) - over_head_costs) AS total_profit " +
        "FROM departments LEFT JOIN products ON departments.department_id = products.department_id GROUP BY departments.department_id", (err, res) => {
            if(err) throw err;

            callback(res);
        });
    };

    // Creates a new department
    this.createDepartment = function(department, callback) {
        this.connection.query("INSERT INTO departments(department_name, over_head_costs) VALUES (?,?)", [department.department_name, department.over_head_costs], err => {
            if(err) throw err;

            callback();
        });
    };

    // Closes the database connection
    this.close = function () { this.connection.end(); }

}

module.exports = StoreDatabase;