sql


📘 **Learning & Development Timeline**

1. **🧱 Phase 1:**
# Online Student Registration System (db_Design)

A relational database schema designed to manage academic operations such as student enrollments, course registrations, department classifications, and instructor assignments within an educational institution.

## Tables Included
- Students
- Courses
- Departments
- Registrations
- Instructors
- Users (for login system)

## Features
- Referential integrity with foreign keys
- `CHECK`, `UNIQUE`, `NOT NULL`, `PRIMARY KEY` constraints
- Example queries: `SELECT`, `JOIN`, `INSERT`, `UPDATE`, `DELETE`

## Tools Used
- PostgreSQL 16
- pgAdmin 4
- GitHub for version control

## Sample Queries
-- Count of students in each department
SELECT department_id, COUNT(*) AS student_count
FROM Students
GROUP BY department_id;
-- List of registered students with their course and registration details
SELECT 
    s.full_name,
    c.course_name,
    r.status,
    r.registration_date
FROM Registrations r
JOIN Students s ON r.student_id = s.student_id
JOIN Courses c ON r.course_id = c.course_id;





2. **🧪 Phase 2:**
## User Registration API

A backend project for learning and development, focused on building robust and modular API endpoints using modern technologies.

### Technologies Used
- Node.js with Express.js for server-side logic  
- PostgreSQL for relational database management  
- JavaScript for API scripting  
- Postman for testing and validation

### Key Features
- User registration with strong password validation and encryption  
- Modular controller-based structure for clean, maintainable code  
- Secure password storage using bcrypt  
- Readable and scalable routing system  
- Database connectivity configured via a centralized file

### Project Structure

USERREGISTRATION_API/
│
├── config/
│   └── db.js                   // PostgreSQL DB config
│
├── controllers/
│   └── userController.js      // User logic
│
├── routes/
│   └── userRoutes.js          // User routes
│
├── utils/
│   └── passwordValidator.js   // Password rules
│
├── userRegistrationAPI.js     // Main Express API file
├── package.json               // Project info
└── package-lock.json          // Dependency lock

### Purpose
Designed as a personal backend learning hub — allowing experimentation with SQL queries, encryption techniques, API building, and secure user data handling.

### Future Plans
The project will be extended to include complete APIs for all database tables used in the system.  
This includes modules for managing courses, students, instructors, departments, registrations, and more — all following the same modular and professional approach demonstrated here.





3. **🚀 Phase 3:**
Student Registration System – APIs collection 

Built for scalable backend development using Node.js, Express, and PostgreSQL.  
Demonstrates modular architecture, strong data validation, and practical database operations through a RESTful API design.

### Technologies Used
- Node.js with Express – for building RESTful APIs  
- PostgreSQL – relational database for data persistence  
- JavaScript – for all scripting and backend logic  
- Postman – for testing and debugging endpoints  
- bcrypt – for password encryption  
- Custom Validators – for strong password, email format, input validation

### Project Structure

USERAPI_PROJECT/
├── config/
│   └── db.js                 // Database connection setup
│
├── controllers/
│   ├── userController.js         // User logic
│   ├── registrationController.js // Registration logic
│   ├── studentController.js      // Student logic
│   ├── courseController.js       // Course logic
│   ├── instructorController.js   // Instructor logic
│   └── departmentController.js   // Department logic
│
├── routes/
│   ├── userRoutes.js
│   ├── registrationRoutes.js
│   ├── studentRoutes.js
│   ├── courseRoutes.js
│   ├── instructorRoutes.js
│   └── departmentRoutes.js
│
├── utils/
│   └── passwordValidator.js   // Custom password rules
│
├── registrationAPI.js         // Main API entry file
├── package.json               // Project dependencies
└── package-lock.json          // Dependency lock file

#### Core Features
User & Auth
- User registration with:
  - Strong password rules (8+ characters, uppercase, lowercase, digit, special character)  
  - Email format validation  
  - Password encryption using bcrypt  
  - Duplicate email check

- Retrieve:
  - All users  
  - A user by ID  
  - Users by role/username filters  
  - A specific column by another column (e.g., get username where role = 'admin')

- Update/Delete:
  - With existence check before performing action

#### Course / Student / Instructor / Department APIs
- Fully modular CRUD for each table
- Retrieve:
  - All records  
  - Record by ID  
  - Filtered by any column  
  - One column's value by another column

- Business logic rules like:
  - `course.credit_hour <= 6`  
  - No duplicate registration (student_id + course_id pair)  
  - Pre-check if record exists before UPDATE or DELETE
    
### Future Roadmap
- Add login API using JWT (JSON Web Token)  
- Implement authentication middleware  
- Introduce role-based access control:
  - Only admins allowed to update/delete  
  - Regular users restricted to read-only  
- Add logging and activity tracking for all API hits  

### Testing
All routes are tested using Postman with request examples for each CRUD operation.

### Purpose
Developed as a backend practice and portfolio piece.  
