CREATE TABLE Departments (
    department_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_name VARCHAR2(100) NOT NULL,
    department_code VARCHAR2(20) UNIQUE NOT NULL
);
CREATE TABLE Students (
    student_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    phone VARCHAR2(20),
    gender VARCHAR2(10),
    date_of_birth DATE,
    address VARCHAR2(255),
    registration_date DATE DEFAULT CURRENT_DATE
);
CREATE TABLE Instructors (
    instructor_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    phone VARCHAR2(20),
    department_id NUMBER,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);
CREATE TABLE Courses (
    course_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_name VARCHAR2(100) NOT NULL,
    course_code VARCHAR2(20) UNIQUE NOT NULL,
    credit_hours NUMBER NOT NULL,
    department_id NUMBER,
    CONSTRAINT fk_course_dept FOREIGN KEY (department_id)
    REFERENCES Departments(department_id)
);
CREATE TABLE Registrations (
    registration_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id NUMBER NOT NULL,
    course_id NUMBER NOT NULL,
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR2(20),  --approved,rejected,pending
    CONSTRAINT fk_registration_student FOREIGN KEY (student_id)
    REFERENCES Students(student_id),
    CONSTRAINT fk_registration_course FOREIGN KEY (course_id)
    REFERENCES Courses(course_id)
);
CREATE TABLE Users (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    user_role VARCHAR2(20) NOT NULL CHECK (user_role IN ('admin', 'student', 'instructor')),
    student_id NUMBER,
    instructor_id NUMBER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_student FOREIGN KEY (student_id) REFERENCES Students(student_id),
    CONSTRAINT fk_user_instructor FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
);