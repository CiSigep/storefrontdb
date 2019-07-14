DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INTEGER(100) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50),
	price FLOAT(7,2),
	stock_quantity INTEGER(6),
    
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Double Sided Tape", "Office", 3.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Bacon", "Groceries", 2.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Soda", "Groceries", 4.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Video Game", "Electronics", 60.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Video Game Console", "Electronics", 250.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Shampoo", "Personal care", 5.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Milk", "Groceries", 3.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Glue", "Crafts", 1.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Smartphone", "Electronics", 500.00, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("Laptop", "Electronics", 800.00, 100);

SELECT * FROM products;