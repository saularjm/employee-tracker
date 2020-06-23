const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const sqlProm = require("promise-mysql");

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

const connection = mysql.createConnection(connProps);

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  init();  
});

const init = function() {
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
                connection.end();
                break;
        }
    });
};

const viewEmps = function() {
    connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id", function(err,res) {
        if (err) throw err;

        cTable(res);
    })
    init();
}

const viewRoles = function() {
    connection.query("SELECT * FROM role", function(err,res) {
        if (err) throw err;

        cTable(res);
    })
    init();
}

const viewDepts = function() {
    connection.query("SELECT * FROM department", function(err,res) {
        if (err) throw err;

        cTable(res);
    })
    init();
}

const addEmp = function() {
    let rolesArr = [];
    let mansArr = [];

    // https://github.com/CodeFoodPixels/node-promise-mysql
    sqlProm.createConnection(connProps).then(con => {
        return Promise.all([
            con.query("SELECT * FROM role"),
            con.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS emp FROM employee")
        ])
    }).then(([roles, mans]) => {
        for (let i=0; i < roles.length; i++){
            rolesArr.push(roles[i].title);
        }

        for (let i=0; i < roles.length; i++){
            mansArr.push(mans[i].emp);
        }

        return Promise.all([roles, mans]);
    }).then(([roles, mans]) => {
        
        mansArr.unshift('None');
    
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
                type: "input",
                message: "Who is the employee's manager?",
                choices: mansArr
            }
        ]).then(res => {
            let roleID;
            let manID = null;

            for (let i=0; i < roles.length; i++){
                if (res.role === roles[i].title){
                    roleID = roles[i].id;
                }
            }

            for (let i=0; i < mans.length; i++){
                if (res.manager === mans[i].emp){
                    manID = mans[i].id;
                }
            }
            connection.query("INSERT INTO employee SET ?", 
                {
                    first_name: res.firstName, 
                    last_name: res.lastName, 
                    role_id: roleID,
                    manager_id: manID
                }, function(err,res) {
                    if (err) throw err;

                    init();
                })
        })
    })
}

const addRole = function() {
    let deptArr = [];

    sqlProm.createConnection(connProps).then((con) => {

        return con.query("SELECT * FROM department");

    }).then(depts => {
        
        for (i=0; i < depts.length; i++){
            deptArr.push(depts[i].name);
        }

        return depts;
    }).then(dept => {
        
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

            let deptID;

            for (let i=0; i < dept.length; i++){
                if (res.dept == dept[i].name){
                    deptID = dept[i].id;
                }
            }

            connection.query("INSERT INTO role SET ?",
                {
                    title: res.title,
                    salary: res.salary,
                    department_id: deptID
                }, function(err,res) {
                    if (err) throw err;

                    init();
                })
        })
    })
}

const addDept = function() {
    inquirer.prompt(
        {
            name: "dept",
            type: "input",
            message: "What is the name of the department?"
        }
    ).then(res => {
        connection.query("INSERT INTO departments SET ?",
            {
                name: res.dept
            }, function(err,res) {
                if (err) throw err;

                init();
            })
    })
}

const updateRole = function() {
    
}