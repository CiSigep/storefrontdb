var StoreDatabase = require("./StoreDatabase");
var inquirer = require("inquirer");
var Table = require("cli-table");

var storeDB = new StoreDatabase();

function menu() {
    inquirer.prompt([{
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department"],
        type: "list",
        name: "choice"
    }]).then(ans => {
        if(ans.choice === "View Product Sales by Department")
            viewProductSales();
        else
            createDepartment();
    });
}

function askContinue(){
    inquirer.prompt([{
        message: "Would you like to continue?",
        type: "list",
        choices: ["Yes", "No"],
        name: "choice"
    }]).then(ans => {
        if(ans.choice === "Yes")
            menu();
        else
            storeDB.close();
    });
}

function viewProductSales(){
    // Get department sales figures and display them to the user
    storeDB.getProductSales(res => {
        var table = new Table({
            head: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"]
        });

        res.forEach(element => {
            table.push([element.department_id, element.department_name, element.over_head_costs.toFixed(2), element.product_sales.toFixed(2), element.total_profit.toFixed(2)]);
        });

        console.log(table.toString());
        askContinue();
    });
}

function createDepartment(){
    // Ask user for the new department information
    inquirer.prompt([{
        message: "Enter the department's name: ",
        name: "department_name"
    },
    {
        message: "Enter the overhead costs for the department: ",
        name: "over_head_costs",
        validate: function (input) {
            if (isNaN(input) || parseFloat(input) < 0)
                return "Input must be a positive number.";

            return true;
        }
    }]).then(ans => {
        storeDB.createDepartment(ans, function() {
            console.log("Department created.");
            askContinue();
        });
    });
}

storeDB.connect(menu);
