const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const verifyToken = require('../middleware/verifyToken');
const verifyRoleAndOwnership = require('../middleware/verifyRoleAndOwnership');

// ==============================
// 🔐 Protected Routes (Admin only)

//GET all instructors(Admin only)
router.get('/', verifyToken, verifyRoleAndOwnership(['admin']), instructorController.getAllInstructors);
//GET single_record by column filter(Admin only)
router.get('/filter/column', verifyToken, verifyRoleAndOwnership(['admin']), instructorController.getInstructorByColumn);
//GET single_column data by column filter(Admin only)
router.get('/filter/select', verifyToken, verifyRoleAndOwnership(['admin']), instructorController.getColumnByColumn);

// 🔐 Instructor can view own profile
router.get('/me', verifyToken, verifyRoleAndOwnership(['instructor']), instructorController.getMyProfile);
// 🔐 Instructor can update own profile
router.put('/me', verifyToken, verifyRoleAndOwnership(['instructor']), instructorController.updateMyProfile);
// 🔐 Instructor can view students registered in their own assigned courses only
router.get('/students/my-courses', verifyToken, verifyRoleAndOwnership(['instructor']), instructorController.getMyStudents);
// 🔐 Get courses assigned to this instructor
router.get('/my-courses', verifyToken, verifyRoleAndOwnership(['instructor']), instructorController.getMyCourses);
//GET instructor by ID(Admin only)
router.get('/:id', verifyToken, verifyRoleAndOwnership(['admin']), instructorController.getInstructorById);
//PUT update instructor by ID(Admin only)
router.put('/:id', verifyToken, verifyRoleAndOwnership(['admin']), instructorController.updateInstructor);
//DELETE instructor by ID(Admin only)
router.delete('/:id', verifyToken, verifyRoleAndOwnership(['admin']), instructorController.deleteInstructor);

// ==============================
// 🟢 Public Route

//Register new instructor (Open to all options)
router.post('/', instructorController.createInstructor);

module.exports = router;
