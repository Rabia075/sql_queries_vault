-- 1. Departments Table
CREATE TABLE Departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) UNIQUE NOT NULL
);

-- 2. Students Table
CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) CHECK (phone ~ '^\+92(3|1)[0-9]{9}$'),
    gender VARCHAR(10),
    date_of_birth DATE,
    address VARCHAR(255),
    registration_date DATE DEFAULT CURRENT_DATE,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    CHECK (gender IN ('Male', 'Female', 'Other'))
);

-- 3. Instructors Table
CREATE TABLE Instructors (
    instructor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

-- 4. Courses Table
CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    credit_hours INT NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

-- 5. Registrations Table
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

-- 6. Users Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'student', 'instructor'))
);






INSERT INTO Students (
    full_name, email, phone, gender, date_of_birth, address, department_id
) VALUES (
    'Rabia bibi',
    'rabia11@gmail.com',
    '+923987654321',
    'Female',
    '2004-10-04',
    '123 Main Street, Lahore',
    1
),
(
    'Ayesha noor',
    'ayesha17@gmail.com',
    '+923111122223',
    'Female',
    '2005-02-04',
    '123 Main Street, Lahore',
    2
);
SELECT * FROM Students;


INSERT INTO Departments (department_name, department_code)
VALUES 
('Computer Science', 'CS01'),
('Information Technology', 'IT02'),
('Software Engineering', 'SE03'),
('Business Administration', 'BA04');


UPDATE Students 
SET phone = '+923009876543' 
WHERE student_id = 4;


INSERT INTO Registrations (student_id, course_id, status)
VALUES 
    (3, 1, 'approved'),
    (4, 2, 'pending'),
    (3, 3, 'rejected');
SELECT * FROM Registrations;


INSERT INTO Courses (course_name, course_code, credit_hours, department_id)
VALUES 
    ('Database Systems', 'CS101', 3, 1),
    ('Web Development' , 'CS102', 4, 1),
    ('Data Structures' , 'CS103', 3, 1);
SELECT * FROM Courses;


DELETE FROM Registrations 
WHERE registration_id = 6;


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