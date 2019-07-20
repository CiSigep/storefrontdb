var StoreDatabase = require("./StoreDatabase");
var inquirer = require("inquirer");
var Table = require("cli-table");

var storeDB = new StoreDatabase();
var items;
var ids = [];
var total = 0;

function shop() {
    inquirer.prompt([
        {
            message: "What would you like?",
            choices: ids,
            type: "list",
            name: "choice"
        },
        {
            message: "How much would you like?",
            name: "amount",
            validate: function (input) {
                var intVal = parseInt(input);
                if (!Number.isInteger(+input) || intVal < 0)
                    return "Your input must be a postive integer value."

                return true;
            }
        }
    ]).then(ans => {
        attemptPurchase(parseInt(ans.choice.split(" ")[0]), ans.amount);
    });
}

// Attempts a purchase by the user
function attemptPurchase(id, amount) {
    storeDB.getProductByID(id, item => {
        // Not enough of the item in question.
        if (item.stock_quantity < amount) {
            console.log("Insufficient Quantity!");
            askContinueShopping();
        }
        else {
            var purchaseTotal = item.price * amount;
            item.stock_quantity -= amount;
            item.product_sales += purchaseTotal; // Add to the products sales.
            storeDB.updateProduct(item, function () {
                total += purchaseTotal;
                console.log("Your total for this purchase is: " + purchaseTotal.toFixed(2));
                askContinueShopping();
            });
        }
    });
}

// Asks the user if they wish to continue shopping
function askContinueShopping() {
    inquirer.prompt([
        {
            message: "Would you like to continue shopping?",
            choices: ["Yes", "No"],
            type: "list",
            name: "choice"
        }
    ]).then(ans => {
        if (ans.choice === "Yes")
            shop();
        else {
            storeDB.close();
            console.log("Your total for this session is: " + total.toFixed(2));
        }
    });
}

storeDB.connect(function(){
    // Get all of our products
    storeDB.getAllProducts(res => {
        // Set up a table for displaying the elements
        var table = new Table({
            head: ["Product ID", "Name", "Department", "Price", "Stock"]
        });
        items = res;

        // Add each element to the table.
        res.forEach(element => {
            table.push([element.item_id, element.product_name, element.department_name, element.price.toFixed(2), element.stock_quantity]);
            ids.push(element.item_id + " " + element.product_name);
        });

        console.log(table.toString());
        shop();
    });
});
