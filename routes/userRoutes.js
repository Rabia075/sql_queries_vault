const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const verifyRoleAndOwnership = require('../middleware/verifyRoleAndOwnership');

// ==============================
// 🔐 Protected Routes (Admin only)

//GET all users(Admin only)
router.get('/', verifyToken, verifyRoleAndOwnership(['admin']), userController.getAllUsers);
//GET user by ID(Admin only)
router.get('/id/:id', verifyToken, verifyRoleAndOwnership(['admin']), userController.getUserById);
//GET single_column's data based on another column(Admin only)
router.get('/column', verifyToken, verifyRoleAndOwnership(['admin']), userController.getColumnByColumn);
//GET single_user based on column filter(Admin only)
router.get('/filter', verifyToken, verifyRoleAndOwnership(['admin']), userController.getUserByColumn);
//PUT update user by ID(Admin only)
router.put('/:id', verifyToken, verifyRoleAndOwnership(['admin']), userController.updateUser);
//DELETE user by ID(Admin only)
router.delete('/:id', verifyToken, verifyRoleAndOwnership(['admin']), userController.deleteUser);

// ==============================
// 🟢 Public Route

//Register a new user (Open to all options)
router.post('/', userController.createUser);

module.exports = router;