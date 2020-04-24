var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Port 3306
  port: 3306,

  // Your Username
  user: "root",

  // Your Password
  password: "M@rch201995",
  database: "bamazon",
});
connection.connect(function (err) {
  if (err) throw err;
  showItems();
});

function showItems() {
  var query = "SELECT * FROM bamazon.products";
  connection.query(query, function (err, res) {
    console.table(res);
    qAndA();
  });
}

function qAndA() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "whatToBuy",
        message:
          "Please select the ID number of the item you would like to purchase",
        choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
      {
        type: "input",
        name: "howMany",
        message: "How many of this item would you like to purchase?",
      },
    ])
    .then(function (response) {
      var query =
        "SELECT stock_quantity FROM products where id= '" +
        response.whatToBuy +
        "'";
      connection.query(query, function (err, res) {
        var dbResponse = res[0].stock_quantity;
        var requested = JSON.parse(response.howMany);
        if (request <= dbResponse) {
          var query =
            "UPDATE products SET stock_quantity = stock_quantity -" +
            requested +
            " WHERE id = '" +
            response.whatToBuy +
            "'";
          connection.query(query, function (err, res) {
            var query =
              "SELECT price FROM products where id = '" +
              response.whatToBuy +
              "'";
            connection.query(query, function (err, res) {
              var calculation = res[0].price * response.howMany;
              console.log("Your order total is $" + calculation.toFixed(2));
              quit();
            });
          });
        }
        function quit() {
          inquirer
            .prompt([
              {
                type: "list",
                name: "exitQuestion",
                message: "Would you like to place another order?",
                choices: ["Yes", "No"],
              },
            ])
            .then(function (response) {
              switch (response.exitQuestion) {
                case "Yes":
                  showItems();
                  break;
                case "No":
                  console.log("Thank you for shopping");
                  console.log("Goodbye");
                  process.exit();
                  break;
                default:
                  break;
              }
            });
        }
      });
    });
}
