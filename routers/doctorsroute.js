const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctors')
const userAuth = require('../userauth/userauth')
router.get('/', doctorsController.getDoctors)
router.patch('/update', userAuth.isVerified, doctorsController.updateProfile)
router.delete('/delete', userAuth.isVerified, doctorsController.deleteDoctor)


module.exports = router