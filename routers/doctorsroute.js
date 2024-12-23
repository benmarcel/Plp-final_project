const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctors')
router.get('/', doctorsController.getDoctors)
router.get('/:id', doctorsController.updateProfile)



module.exports = router