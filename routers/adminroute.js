const express = require("express");
const router = express.Router();
const userAuth = require('../userauth/userauth')
const adminController = require('../controllers/adminController')


router.post('/register', adminController.registerAdmin)
router.post('/login', adminController.adminLogin)
router.post('/doctor', userAuth.isVerified, adminController.addDoctor);
router.get('/patients', userAuth.isVerified, adminController.getAllPatient);

module.exports = router;