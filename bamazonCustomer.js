var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    
    // Port 3306
    port: 3306,

    // Your Username
    user: "root",

    // Your Password
    password: "password",
    database: "bamazon"

});