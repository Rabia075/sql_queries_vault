const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const verifyToken = require('../middleware/verifyToken');
const verifyRoleAndOwnership = require('../middleware/verifyRoleAndOwnership');

// ==============================
// 🔐 Protected Routes (Admin only)

//GET all registrations(Admin only)
router.get('/', verifyToken, verifyRoleAndOwnership(['admin']), registrationController.getAllRegistrations);
//GET single_registration record by ID(Admin only)
router.get('/id/:id', verifyToken, verifyRoleAndOwnership(['admin']), registrationController.getRegistrationById);
//GET single_record by column filter(Admin only)
router.get('/filter', verifyToken, verifyRoleAndOwnership(['admin']), registrationController.getRegistrationByColumn);
//GET single_column data from column filter(Admin only)
router.get('/column', verifyToken, verifyRoleAndOwnership(['admin']), registrationController.getColumnByColumn);
//PUT update registration by ID(Admin only)
router.put('/:id', verifyToken, verifyRoleAndOwnership(['admin']), registrationController.updateRegistration);
//DELETE registration by ID(Admin only)
router.delete('/:id', verifyToken, verifyRoleAndOwnership(['admin']), registrationController.deleteRegistration);

// ==============================
// 🟢 Public Route

//Register new student for a course (Open to all options)
router.post('/', registrationController.createRegistration);

module.exports = router;