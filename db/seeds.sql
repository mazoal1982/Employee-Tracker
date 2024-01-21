INSERT INTO department (name)
VALUES ("Web Development"),
       ("Data Science"),
       ("HR"),
       ("Design"),
       ("Management");

INSERT INTO role (title, salary, department_id)
VALUES ("JavaScript Developer",200000.01, 1),
       ("Data Science Engineer",200000.01, 2),
       ("HR Person",200000.01, 3),
       ("UX/UI Designer",200000.01, 4),
       ("Game Design",200000.01, 4 ),
       ("Cloud Development",200000.01, 2),
       ("Product Manager",300000.01, 5);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 7, NULL),
       ("Michael", "Willis", 1, 1),
       ("Jane","Roe", 2, 1),
       ("Frank","Bank", 3, NULL),
       ("Timmy","Jimmy", 4, 1),
       ("Sarah","Bear", 5, 1 ),
       ("Michelle","Miguel", 6, 1);
       