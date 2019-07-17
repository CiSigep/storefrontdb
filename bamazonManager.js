var StoreDatabase = require("./StoreDatabase");
var inquirer = require("inquirer");
var Table = require("cli-table");

var storeDB = new StoreDatabase();

function menu() {
    inquirer.prompt([{
        message: "What would you like to do?",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "choice"
    }]).then(res => {
        switch (res.choice) {
            case "View Products for Sale":
                storeDB.getAllProducts(resultsView);
                break;
            case "View Low Inventory":
                storeDB.getProductsStockLessThan(5, resultsView);
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    });
}

function addToInventory() {
    var products = [];
    storeDB.getAllProducts(res => {
        res.forEach(element => {
            products.push(element.item_id + " " + element.product_name);
        });

        inquirer.prompt([{
            message: "Which item do you want to add inventory for?",
            type: "list",
            choices: products,
            name: "choice"
        },
        {
            message: "How much do you want to add?",
            name: "amount",
            validate: function (input) {
                if (!Number.isInteger(++input))
                    return "Your input must be an integer value."

                return true;
            }
        }
        ]).then(ans => {
            storeDB.getProductByID(parseInt(ans.choice.split(" ")[0]), result => {
                result.stock_quantity += parseInt(ans.amount);
                storeDB.updateProductAmount(result, ret => {
                    console.log("Amount Successfully Added.");
                    askContinue();
                });
            });
        });
    })
}

function addNewProduct() {
    inquirer.prompt([{
        message: "Enter the Product name: ",
        name: "product_name"
    },
    {
        message: "Enter the Department name: ",
        name: "department_name"
    },
    {
        message: "Enter the price: ",
        validate: function (input) {
            if (isNaN(input))
                return "Input must be a number.";

            return true;
        },
        name: "price"
    },
    {
        message: "Enter the quantity: ",
        validate: function (input) {
            if (!Number.isInteger(++input))
                return "Your input must be an integer value."

            return true;
        },
        name: "stock_quantity"
    }]).then(ans => {
        storeDB.getProductByNameAndDepartment(ans.product_name, ans.department_name, res => {
            if(res){
                console.log("Product already exists in that department.");
                askContinue();
                return;
            }

            storeDB.addNewProduct(ans, function() {
                console.log("Product added.");
                askContinue();
            })
        });
    })
}

function askContinue() {
    inquirer.prompt([
        {
            message: "Would you like to continue?",
            choices: ["Yes", "No"],
            type: "list",
            name: "choice"
        }
    ]).then(ans => {
        if (ans.choice === "Yes")
            menu();
        else {
            storeDB.close();
        }
    });
}

var resultsView = res => {
    var table = new Table({
        head: ["Product ID", "Name", "Department", "Price", "Stock"]
    });

    res.forEach(element => {
        table.push([element.item_id, element.product_name, element.department_name, element.price.toFixed(2), element.stock_quantity]);
    });

    console.log(table.toString());
    askContinue();
};
try {
    menu();
} catch (e) {
    console.error(e);
    storeDB.close();
}