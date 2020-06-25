-- Random data to seed employee_trackerDB

-- Use employee database created in schema.sql
USE employee_trackerDB;

-- Insert different department names
INSERT INTO department (name)
VALUES 
    ("Management"),
    ("Sales"),
    ("Legal"),
    ("Engineering");

-- Insert different roles with corresponding data
INSERT INTO role (title, salary, department_id)
VALUES 
    ("Manager", 200000, 1),
    ("Salesperson", 100000, 2),
    ("Lawyer", 150000, 3),
    ("Developer", 120000, 4);

-- Insert employees with corresponding data
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Moira", "Rose", 1, NULL),
    ("Johnny", "Rose", 2, NULL),
    ("David", "Rose", 3, NULL);