// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const sqlProm = require("promise-mysql");

// Connection properties for MySql
const connProps = {
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "employee_trackerDB"
};

// Create database connection
const connection = mysql.createConnection(connProps);

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  // Run main menu
  init();  
});

// Function for main menu
const init = function() {
    // Prompt user with all options
    inquirer.prompt({
        name: "startMenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View all roles",
            "View all departments",
            "Add employee",
            "Add role",
            "Add department",
            "Update employee role",
            "Exit"
        ]
    })
    .then(ans => { 
        // Switch to handle user choice, each option calls particular function
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

            case "Add role":
                addRole();
                break;

            case "Add department":
                addDept();
                break;

            case "Update employee role":
                updateRole();
                break;

            case "Exit":
                // Disconnect from DB
                connection.end();
                break;
        }
    });
};

// Functions ----------------------------------------------------------------
// View all employees
const viewEmps = function() {

    // MySql query for all employee info
    connection.query("SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC", function(err,res) {
        if (err) throw err;
        
        // Output result in table
        console.log("\n");
        console.table(res);
    })
    // Main menu
    init();
}

// View all roles
const viewRoles = function() {

    // MySql query for all roles info
    connection.query("SELECT * FROM role", function(err,res) {
        if (err) throw err;

        // Output result in table
        console.log("\n");
        console.table(res);
    })
    // Main menu
    init();
}

// View all departments
const viewDepts = function() {

    // MySql query for all department info
    connection.query("SELECT * FROM department", function(err,res) {
        if (err) throw err;

        // Output result in table
        console.log("\n");
        console.table(res);
    })
    // Main menu
    init();
}

// Add employee
const addEmp = function() {

    // Arrays to hold role and manager options
    let rolesArr = [];
    let mansArr = [];

    // Connect to database to return promise
    sqlProm.createConnection(connProps).then(con => {

        // Returns arrays as promise
        return Promise.all([
            con.query("SELECT * FROM role"),
            con.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS emp FROM employee")
        ])
    }).then(([roles, mans]) => {

        // Push array of roles from DB promise to rolesArr
        for (let i=0; i < roles.length; i++){
            rolesArr.push(roles[i].title);
        }

        // Push array of possible managers from DB promise to mansArr
        for (let i=0; i < mans.length; i++){
            mansArr.push(mans[i].emp);
        }

        // Returns arrays as promise
        return Promise.all([roles, mans]);
    }).then(([roles, mans]) => {
        
        // Add option for no manager in mansArr
        mansArr.unshift("None");
    
        // Prompt for info about new employee
        // Use passed in arrays as choices for role and manager
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: rolesArr
            },
            {
                name: "manager",
                type: "list",
                message: "Who is the employee's manager?",
                choices: mansArr
            }
        ]).then(res => {

            // Variables to match IDs in DB
            let roleID;
            let manID = null;

            // Set appropriate roleID based on user input
            for (let i=0; i < roles.length; i++) {
                if (res.role === roles[i].title) {
                    roleID = roles[i].id;
                }
            }

            // Set appropriate managerID based on user input
            for (let i=0; i < mans.length; i++) {
                if (res.manager === mans[i].emp) {
                    manID = mans[i].id;
                }
            }

            // DB query to insert new employee using user input
            connection.query("INSERT INTO employee SET ?", 
                {
                    first_name: res.firstName, 
                    last_name: res.lastName, 
                    role_id: roleID,
                    manager_id: manID
                }, function(err,res) {
                    if (err) throw err;

                    // Main menu
                    init();
                })
        })
    })
}

// Add role
const addRole = function() {

    // Array for department options
    let deptArr = [];

    // Connect to database to return promise
    sqlProm.createConnection(connProps).then(con => {

        // DB query to return department info
        return con.query("SELECT * FROM department");

    }).then(depts => {
        
        // Push department info from DB into deptArr
        for (let i=0; i < depts.length; i++) {
            deptArr.push(depts[i].name);
        }

        return depts;
    }).then(depts => {
        
        // Prompt user for new role info
        // Use passed in array for department choices
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the role title?"
            },
            {
                name: "salary",
                type: "number",
                message: "What is the salary for this role?"
            },
            {   
                name: "dept",
                type: "list",
                message: "Which department is this role under?",
                choices: deptArr
            }
        ]).then(res => {

            // Variable to match ID in DB
            let deptID;

            // Set appropriate departmentID based on user input
            for (let i=0; i < depts.length; i++) {
                if (res.dept === depts[i].name) {
                    deptID = depts[i].id;
                }
            }

            // DB query to insert new role from user input
            connection.query("INSERT INTO role SET ?",
                {
                    title: res.title,
                    salary: res.salary,
                    department_id: deptID
                }, function(err,res) {
                    if (err) throw err;

                    // Main menu
                    init();
                })
        })
    })
}

// Add department
const addDept = function() {

    // Prompt user for new department info
    inquirer.prompt(
        {
            name: "dept",
            type: "input",
            message: "What is the name of the department?"
        }
    ).then(res => {

        // DB query to insert user input
        connection.query("INSERT INTO departments SET ?",
            {
                name: res.dept
            }, function(err,res) {
                if (err) throw err;

                // Main menu
                init();
            })
    })
}

// Update employee role
const updateRole = function() {

    // Arrays for employee and role options
    let empArr = [];
    let roleArr = [];

    // Connect to database to return promise
    sqlProm.createConnection(connProps).then(con => {
        
        // Returns arrays as promise
        return Promise.all([
            con.query("SELECT * FROM role"), 
            con.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS emp FROM employee")
        ]);
    }).then(([roles, emps]) => {

        // Push DB roles into roleArr
        for (let i=0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        // Push DB employees into empArr
        for (let i=0; i < emps.length; i++) {
            empArr.push(emps[i].emp);
        }

        // Returns arrays as promise
        return Promise.all([roles, emps]);
    }).then(([roles, emps]) => {

        // Prompt user for info to update
        // Use passed in arrays as choices for employee and new role
        inquirer.prompt([
            {
                name: "emp",
                type: "list",
                message: "Which employee would you like to update?",
                choices: empArr
            }, {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArr
            }
        ]).then(res => {

            // Variables to match DB IDs
            let roleID;
            let empID;

            // Set appropriate roleID based on user input
            for (let i=0; i < roles.length; i++) {
                if (res.role === roles[i].title) {
                    roleID = roles[i].id;
                }
            }

            // Set appropriate employeeID based on user input
            for (let i=0; i < emps.length; i++) {
                if (res.emp === emps[i].emp) {
                    empID = emps[i].id;
                }                
            }
              
            // DB query to update employee role
            connection.query("UPDATE employee SET ? WHERE employee.id = ?",
                [
                    {role_id: roleID},
                    empID
                ], function(err, res) {
                if(err) return err;

                // Main menu
                init();
            })
        })
    })
}