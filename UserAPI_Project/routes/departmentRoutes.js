const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const verifyToken = require('../middleware/verifyToken');
const verifyRoleAndOwnership = require('../middleware/verifyRoleAndOwnership.js');

// ==============================
// 🔐 Protected Routes (Admin only)

//GET all departments(Admin only)
router.get('/', verifyToken, verifyRoleAndOwnership(['admin']), departmentController.getAllDepartments);
//GET single_column data by column filter(Admin only)
router.get('/filter', verifyToken, verifyRoleAndOwnership(['admin']), departmentController.getColumnByFilter);
//GET single_record by column filter(Admin only)
router.get('/column/:column/:value', verifyToken, verifyRoleAndOwnership(['admin']), departmentController.getDepartmentsByColumn);
//GET department by ID(Admin only)
router.get('/:id', verifyToken, verifyRoleAndOwnership(['admin']), departmentController.getDepartmentById);
//PUT update department by ID(Admin only)
router.put('/:id', verifyToken, verifyRoleAndOwnership(['admin']), departmentController.updateDepartment);
//DELETE department by ID(Admin only)
router.delete('/:id', verifyToken, verifyRoleAndOwnership(['admin']), departmentController.deleteDepartment);

// ==============================
// 🟢 Public Route

//Register new department (Open to all options)
router.post('/', departmentController.createDepartment);

module.exports = router;



