const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../userauth/userauth");
const { isVerified } = require("../userauth/userauth");
const appointmentController = require("../controllers/appointments");
router.get("/", isVerified, appointmentController.getAppointments);
router.post("/booking", isAuthenticated, appointmentController.bookAppointment);
router.get('/appointment', isAuthenticated, appointmentController.getPatientsAppointment)
router.delete('/appointment', isAuthenticated, appointmentController.cancelAppointment)
router.patch('/update', isAuthenticated, appointmentController.updateAppointment);

module.exports = router;
