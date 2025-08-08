-- =========================================================
--  🏗️ DATABASE SCHEMA DEFINITION
-- =========================================================
CREATE TABLE Departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) UNIQUE NOT NULL
);
SELECT * FROM Departments;

CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL CHECK (phone ~ '^\+92(3)[0-9]{9}$'),
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE,
    address VARCHAR(255),
    registration_date DATE DEFAULT CURRENT_DATE,
    department_id INT,
    user_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
SELECT * FROM Students;

CREATE TABLE Instructors (
    instructor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department_id INT,
    CONSTRAINT fk_department
    FOREIGN KEY (department_id)
    REFERENCES Departments(department_id)
    ON DELETE SET NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
SELECT * FROM Instructors;

CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    credit_hours INT NOT NULL,
    department_id INT NOT NULL,
    instructor_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
);
SELECT * FROM Courses;

CREATE TABLE Registrations (
    registration_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) CHECK (status IN ('approved', 'rejected', 'pending')),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    UNIQUE(student_id, course_id)
);
SELECT * FROM Registrations;

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'student', 'instructor'))
);
SELECT * FROM Users;












-- =========================================================
-- 🛠️ DATA MANIPULATION QUERIES (CRUD + JOINS + LOGIC)
-- =========================================================
INSERT INTO Users (
    username, email, password, role
) VALUES 
(
    'Rabia bibi',
    'rabia13@gmail.com',
    '@rabiA17',  
    'admin'
),
(
    'Ayesha Noor',
    'ayesha17@gmail.com',
    '@ayeshA13', 
    'student'
),
(
    'Ayza Sajad',
    'ayza11@gmail.com',
    '@ayzA11', 
    'student'
);
INSERT INTO Students (
    full_name, email, password, phone, gender, date_of_birth, address, department_id, user_id
) VALUES 
(
    'Ayza Sajad',
    'ayza11@gmail.com',
    '@ayzA11',
    '+923123456789',
    'Female',
    '2005-02-04',
    '123 Main Street, Lahore',
    1,
    2
),
(
    'Ayesha Noor',
    'ayesha17@gmail.com',
    '@ayeshA13',
    '+923009876543',
    'Female',
    '2004-10-04',
    '123 Main Street, Lahore',
    2,
    3
);
INSERT INTO Users (
    username, email, password, role
) VALUES 
(
    'Dr. Ahsan Raza',
    'ahsan@gmail.com',
    '@ahsaN19',  
    'instructor'
),
(
    'Prof. Naila Tariq',
    'naila17@gmail.com',
    '@nailA17', 
    'instructor'
);
INSERT INTO Instructors (
    full_name, email, password, phone, department_id, user_id
) VALUES 
(
    'Dr. Ahsan Raza',
    'ahsan@gmail.com',
    '@ahsaN19',
    '+923456789321',
    1,
    4
),
(
    'Prof. Naila Tariq',
	'naila17@gmail.com',
    '@nailA17',
    '+923987123645',
    2,
    5
);

INSERT INTO Registrations (student_id, course_id, status)
VALUES 
    (1, 3, 'approved'),
    (2, 2, 'pending'),
    (1, 1, 'rejected');

INSERT INTO Courses (
    course_name, course_code, credit_hours, department_id, instructor_id) 
VALUES 
   ('Database Systems', 'CS101', 3, 1, 1),
   ('Web Development' , 'CS102', 4, 1, 2), 
   ('Data Structures' , 'CS103', 3, 1, 1);

INSERT INTO Departments (department_name, department_code)
VALUES 
('Computer Science', 'CS01'),
('Information Technology', 'IT02'),
('Software Engineering', 'SE03'),
('Business Administration', 'BA04');

UPDATE Students 
SET phone = '+923987654321' 
WHERE student_id = 2;

DELETE FROM Registrations 
WHERE registration_id = 3;

SELECT department_id, COUNT(*) AS student_count
FROM Students
GROUP BY department_id;

SELECT 
    s.full_name, 
    c.course_name, 
    r.status, 
    r.registration_date
FROM Registrations r
JOIN Students s ON r.student_id = s.student_id
JOIN Courses c ON r.course_id = c.course_id;
