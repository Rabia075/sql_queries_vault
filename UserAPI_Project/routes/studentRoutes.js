const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const registrationController = require('../controllers/registrationController');
const verifyToken = require('../middleware/verifyToken');
const verifyRoleAndOwnership = require('../middleware/verifyRoleAndOwnership');

// ==============================
// 🔐 Protected Routes (Admin only)

//GET all students(Admin only)
router.get('/', verifyToken, verifyRoleAndOwnership(['admin']), studentController.getAllStudents);
//GET single_record by column filter(Admin only)
router.get('/by-column', verifyToken, verifyRoleAndOwnership(['admin']), studentController.getStudentByColumn);
//GET single_column data by column filter(Admin only)
router.get('/column/:column', verifyToken, verifyRoleAndOwnership(['admin']), studentController.getStudentColumnByColumn);
//Student sees own profile →  /me 
router.get(
  '/me',
  verifyToken,
  verifyRoleAndOwnership(['student']),

  studentController.seeOwnProfile
);
//Get logged-in student’s own courses
router.get(
  '/me/courses',
  verifyToken,
  verifyRoleAndOwnership(['student']),
   registrationController.getCoursesForLoggedInStudent
);
//Student updates own profile →  /me 
router.put('/me', verifyToken, verifyRoleAndOwnership(['student']), studentController.updateOwnProfile);
 //GET student by ID(Admin only)
router.get('/:id', verifyToken, verifyRoleAndOwnership(['admin']), studentController.getStudentById);
//PUT update student by ID(Admin only)
router.put('/:id', verifyToken, verifyRoleAndOwnership(['admin']), studentController.updateStudent);
//DELETE student by ID(Admin only)
router.delete('/:id', verifyToken, verifyRoleAndOwnership(['admin']), studentController.deleteStudent);

// ==============================
// 🟢 Public Route

//Register new student (Open to all — optional to protect)
router.post('/', studentController.createStudent);

module.exports = router;
