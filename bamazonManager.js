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
        switch(res.choice){
            case "View Products for Sale":
                viewProducts();
            break;
        }
    });
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
        if(ans.choice === "Yes")
            menu();
        else {
            storeDB.close();
        }
    });
}

function viewProducts(){
    storeDB.getAllProducts(res => {
        var table = new Table({
            head: ["Product ID", "Name", "Department", "Price", "Stock"]
        });
    
        res.forEach(element => {
            table.push([element.item_id, element.product_name, element.department_name, element.price.toFixed(2), element.stock_quantity]);
        });
    
        console.log(table.toString());
        askContinue();
    });
}

menu();