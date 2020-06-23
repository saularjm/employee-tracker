const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  init();  
});

const init = function() {
    inquirer
    .prompt({
      type: "list",
      name: "startMenu",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all roles",
        "View all departments",
        "Add employee",
        "Add department",
        "Add role",
        "Update employee role"
      ]
    })
    .then(function(ans) {
      //console.log(answer);
      
      switch (ans.startMenu) {
        case "View all employees":
          viewEmps();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "View all departments":
          viewDepts();
          break;

        case "Add employee":
          addEmp();
          break;

        case "Add department":
          addDept();
          break;

        case "Add role":
          addRole();
          break;

        case "Update employee role":
          updateRole();
          break;
      }
    });
};
