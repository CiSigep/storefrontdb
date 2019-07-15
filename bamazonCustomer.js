var StoreDatabase = require("./StoreDatabase");
var inquirer = require("inquirer");
var Table = require("easy-table");

var storeDB = new StoreDatabase();
var items;
var ids = [];

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
    var item = items.find(ele => {return id === ele.item_id});

    if(item.stock_quantity < amount){
        console.log("Insufficient Quantity!");
        askContinueShopping();
    }
    else {
        item.stock_quantity -= amount;
        storeDB.updateProductAmount(item, function() {
            console.log("Your total for this purchase is: " + (item.price * amount).toFixed(2));
            askContinueShopping();
        });
    }
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
        else
            storeDB.close();
    })
}

storeDB.getAllProducts(res => {
    var table = new Table();
    items = res;

    res.forEach(element => {
        ids.push(element.item_id);
        table.cell("Product ID", element.item_id);
        table.cell("Name", element.product_name);
        table.cell("Department", element.department_name);
        table.cell("Price", element.price.toFixed(2));
        table.cell("Stock", element.stock_quantity);
        table.newRow();
    });

    console.log(table.toString());
    shop();
});

