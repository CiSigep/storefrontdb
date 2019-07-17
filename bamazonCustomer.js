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
            validate: function(input) {
                if(!Number.isInteger(++input))
                    return "Your input must be an integer value."

                return true;
            }
        }
    ]).then(ans => {
        attemptPurchase(ans.choice, ans.amount);
    });
}

function attemptPurchase(id, amount) {
    storeDB.getProductByID(id, item => {

        if(item.stock_quantity < amount){
            console.log("Insufficient Quantity!");
            askContinueShopping();
        }
        else {
            item.stock_quantity -= amount;
            storeDB.updateProductAmount(item, function() {
                var purchaseTotal = item.price * amount;
                total += purchaseTotal;
                console.log("Your total for this purchase is: " + purchaseTotal.toFixed(2));
                askContinueShopping();
            });
        }
    });
}

function askContinueShopping() {
    inquirer.prompt([
        {
            message: "Would you like to continue shopping?",
            choices: ["Yes", "No"],
            type: "list",
            name: "choice"
        }
    ]).then(ans => {
        if(ans.choice === "Yes")
            shop();
        else {
            storeDB.close();
            console.log("Your total for this session is: " + total.toFixed(2));
        }
    });
}

storeDB.getAllProducts(res => {
    var table = new Table({
        head: ["Product ID", "Name", "Department", "Price", "Stock"]
    });
    items = res;

    res.forEach(element => {
        table.push([element.item_id, element.product_name, element.department_name, element.price.toFixed(2), element.stock_quantity]);
        ids.push(element.item_id);
    });

    console.log(table.toString());
    shop();
});

