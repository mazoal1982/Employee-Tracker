const inquirer = require("inquirer");
const mysql = require("mysql2");
const cfonts = require('cfonts');
require("dotenv").config()

// create a MySQL connection
const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.PW,
    database: "employeeTracker_db",

});

// connect to the databage
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    // start the application
    start();
});


// Function to start the application of CFONT
cfonts.say('SQL Employee Tracker', {
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    font: 'block',
    align: 'left',
    colors: ['blue'],
    env: 'node'
});

// Function to start Application
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit",
            ],

        })

        .then((answer) => {
            switch (answer.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;

                case "Update an employee role":
                    updateEmployeeRole();
                    break;

                case "Exit":
                    connection.end();
                    console.log("Goodbye!");
                    break;
            }
        });

}

// function to view all departments with employees and managers
function viewAllDepartments() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart the application
        start();
    });
}

// function to view all roles
function viewAllRoles(roleTitle) {
    // use a template literal to insert the role title into the query
    const query = `SELECT role.title, role.id, department.name, role.salary from role join department on role.department_id = department.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        // use console.log to display the result
        console.table(res);
        // restart the application
        start();
    });
}



// function to view all employee
function viewAllEmployees() {
    // Define the query to select employee details
    const query = `select * from employee`
    // Execute the query and handle the result
    connection.query(query, (err, res) => {
        if (err) throw err; // Throw an error if there is any
        console.table(res);
        // restart the application
        start();

    });
}

// function to add a department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Enter the name of the new department:",
        })
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO department (name) VALUES ("${answer.name}")`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database!`);
                // restart the application
                start();
                console.log(answer.name);

            });
        });
}

function addRole() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map(department => ({
            name: department.name,
            value: department.id
        }));
        inquirer
            .prompt([
                {

                    type: "input",
                    name: "title",
                    message: "Enter the title of the new role:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary of the new role:",
                },
                {

                    type: "list",
                    name: "department",
                    message: "Select the department for the new role:",
                    choices: departmentChoices
                },

            ])
            .then((answers) => {
                const department = res.find(
                    (department) => department.name === answers.department
                );
                const query = `INSERT INTO role (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${answers.department})`;
                connection.query(query, (err, res) => {
                        if (err) throw err;
                        console.log(
                            'Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!'
                        );
                        // restart the application
                        start();
                    }
                );
            });
    });
}


// Function to add an employee


function addEmployee() {
    // Retrieve list of role from the database
    connection.query("SELECT * FROM role", (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        const roleChoices = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        // Retrieve list of employees from the database to use as managers
        connection.query(
            'SELECT * FROM employee',
            (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const managerChoices = results.map(({ id, first_name, last_name }) => ({
                    name: first_name + " " + last_name,
                    value: id,
                }));
                // Prompt the user for employee information
                inquirer
                    .prompt([
                        {

                            type: "input",
                            name: "firstName",
                            message: "Enter the employee's first name:",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Enter the employee's last name:",
                        },

                        {
                            type: "list",
                            name: "roleId",
                            message: "Select the employee role:",
                            choices: roleChoices,
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Select the employee manager:",
                            choices: managerChoices
                        },
                    ])
                    .then((answers) => {
                        // Insert the employee into the database
                        const sql =
                            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.firstName}", "${answers.lastName}", ${answers.roleId}, ${answers.managerId})`;
                        connection.query(sql, (error, res) => {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            console.log("Employee added successfully");
                            start();
                        });
                    })

                    .catch((error) => {
                        sonsole.error(error);
                    }
                    );
            });
    });
}

// function to update an employee role
function updateEmployeeRole() {
    const queryEmployees =
        "SELECT employee.id, employee.first_name, employee. last_name, role.title FROM employee LEFT JOIN role ON employee. role_id = role.id";
    const queryRoles = "SELECT * FROM role";
    connection.query("SELECT * FROM employee", (err, resEmployees) => {
        if (err) throw err;
        let employeeChoices = resEmployees.map(({id, first_name, last_name})=> ({
            name: first_name + " " + last_name,
            value: id
        }))

        connection.query(queryRoles, (err, resRoles) => {
            if (err) throw err;
            let roleChoices = resRoles.map(({id, title})=> ({
                name: title,
                value: id
            }))
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to update:",
                        choices: employeeChoices
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select the new role to update:",
                        choices: roleChoices
                    },
                ]
                )
                .then((answers) => {
                    // Insert the employee into the database
                    const sql =
                        `UPDATE employee SET role_id = ${answers.role} WHERE id = ${answers.employee}`;
                    connection.query(sql, (error, res) => {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        console.log("Employee added successfully");
                        start();
                    });
                })

                .catch((error) => {
                    sonsole.error(error);
                }
                );
            })
        })
    }

