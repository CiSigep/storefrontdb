var StoreDatabase = require("./StoreDatabase");

var storeDB = new StoreDatabase();

storeDB.getAllProducts(res => {
    console.log(res);
    storeDB.close();
});