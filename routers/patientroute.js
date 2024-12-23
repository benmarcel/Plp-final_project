const express = require("express")
const router = express.Router()
const {isAuthenticated} = require('../userauth/userauth');
const patientController = require('../controllers/patients')

router.post('/register', patientController.registerPatient)

router.post('/login', patientController.loginPatient)

router.get('/logout', patientController.logout)

router.get('/profile', isAuthenticated, patientController.getProfile)

router.patch('/profile/update', isAuthenticated, patientController.updateProfile)

router.delete('/delete', isAuthenticated, patientController.deletePatient)

module.exports = router;