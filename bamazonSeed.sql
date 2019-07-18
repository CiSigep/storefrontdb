DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE departments(
	department_id INTEGER(100) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_costs FLOAT(20,2),
    
    PRIMARY KEY (department_id)
);

CREATE TABLE products(
	item_id INTEGER(100) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_id INTEGER(100),
	price FLOAT(10,2),
	stock_quantity INTEGER(6) DEFAULT 0,
    product_sales float(20,2) DEFAULT 0.00,
    
    PRIMARY KEY(item_id),
    FOREIGN KEY(department_id) REFERENCES departments(department_id)
);

INSERT INTO departments(department_name, over_head_costs) VALUES ("Office", 10000.00);
INSERT INTO departments(department_name, over_head_costs) VALUES ("Groceries", 12000.00);
INSERT INTO departments(department_name, over_head_costs) VALUES ("Electronics", 15000.00);
INSERT INTO departments(department_name, over_head_costs) VALUES ("Personal Care", 8000.00);
INSERT INTO departments(department_name, over_head_costs) VALUES ("Crafts", 5000.00);


INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Double Sided Tape", 1, 3.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Bacon", 2, 2.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Soda", 2, 4.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Video Game", 3, 60.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Video Game Console", 3, 250.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Shampoo", 4, 5.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Milk", 2, 3.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Glue", 5, 1.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Smartphone", 3, 500.00, 100);
INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Laptop", 3, 800.00, 100);

INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ("Camera", 3, "100.00", 3);

SELECT item_id, product_name, department_name, price, stock_quantity FROM products LEFT JOIN departments ON products.department_id = departments.department_id;