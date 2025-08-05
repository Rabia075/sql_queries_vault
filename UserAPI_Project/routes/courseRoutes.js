const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/verifyToken');
const verifyRoleAndOwnership = require('../middleware/verifyRoleAndOwnership');

// 🔐 Protected Routes (Admin only)
// ==============================

//GET all courses(Admin only)
router.get('/', verifyToken, verifyRoleAndOwnership(['admin']), courseController.getAllCourses);
//GET single_record by column filter(Admin only)
router.get('/filter', verifyToken, verifyRoleAndOwnership(['admin']), courseController.getColumnByFilter);
//Get single course by ID
router.get('/:id', verifyToken, verifyRoleAndOwnership(['admin']), courseController.getCourseById);
//Get specific column value by filter_column
router.get('/column/filter', verifyToken, verifyRoleAndOwnership(['admin']), courseController.getColumnByFilter);
//PUT update course by ID(Admin only)
router.put('/:id', verifyToken, verifyRoleAndOwnership(['admin']), courseController.updateCourse);
//DELETE course by ID(Admin only)
router.delete('/:id', verifyToken, verifyRoleAndOwnership(['admin']), courseController.deleteCourse);

// 🟢 Public Route
// ==============================

//Register new course (Open to all options)
router.post('/', courseController.createCourse);

module.exports = router;