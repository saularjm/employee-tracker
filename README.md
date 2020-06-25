# Employee Tracker Database Management

## Table of Contents

- [Description](#Description) 
- [Installation](#Installation) 
- [Usage](#Usage)
- [Methods/Tech](#Methods/Tech)
- [Output](#Output)

## Description

- This project is a CLI application that connects with a SQL database
to keep track of employees and their information, such as their name,
title, and salary. 

## Installation

- Download repo and run "npm install" on command line to install dependencies.
- Run schema.sql in MYSQL Workbench to instantiate database.
- Update connection properties in index.js to your local settings.

## Usage

- Run "node index" on the command line and user will be presented with a menu
containing several user options, including:
    - Viewing employees, roles or departments
    - Adding an employee, role or department
    - Updating an employee's role
    - Exiting the application
- After using the arrow keys to select an option, follow the prompts to insert/view
the necessary information in the database.

## Methods/Tech

- This application was created using JavaScript ES6 and SQL and runs on node.js and MYSQL.
- Included node dependencies are:
    - inquirer - For command line user prompts
    - mysql - For interfacing with MYSQL databases
    - promise-mysql - For handling promises in conjuction with SQL queries
    - console.table - For formatting database results on command line

## Output

- Check out a video of the app's functionality here:
    - 

## Contributions

- Handling promises with MYSQL proved challenging, through Googling I was
able to locate the promise-mysql node package and it's GitHub repository
to help build this application.
- Check out the repo here:
    - https://github.com/CodeFoodPixels/node-promise-mysql 