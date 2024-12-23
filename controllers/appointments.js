const pool = require("../db/connectdb").promise();

exports.bookAppointment = async (req, res) => {
  const patient_id = req.session.patient.user_id;
  const { doctor_id, appointment_date, appointment_time } = req.body;
  try {
    const [results] = await pool.query(
      "SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?",
      [doctor_id, appointment_date, appointment_time]
    );

    if (results.length > 0) {
      return res.status(200).json({
        msg: "Sorry doctor has already been scheduled for that time, please pick another time and date. ",
        status: "failed",
      });
    }
    await pool.execute(
      "INSERT INTO appointments(patient_id, doctor_id, appointment_date, appointment_time, status) VALUES(?,?,?,?, 'scheduled')",
      [patient_id, doctor_id, appointment_date, appointment_time]
    );
    res
      .status(200)
      .json({ msg: "Appointment booked successfully!", status: "successful" });
  } catch (error) {
    if (error) {
      res
        .status(500)
        .json({ msg: "Error occurred while trying to book an appointment" });
      console.log(error); // for debugging purposes
    }
  }
};

// admin only viewing the list of appointments
exports.getAppointments = async (req, res) => {
  try {
    const query = `SELECT a.appointment_date, a.appointment_time, a.status, p.first_name AS patient_f_name, p.last_name AS patient_l_name, 
    d.first_name AS doctor_f_name, d.last_name AS doctor_l_name FROM appointments a JOIN patients p ON a.patient_id = p.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id
        WHERE a.appointment_date > NOW() ORDER BY a.appointment_date ASC`;
    const [appointments] = await pool.query(query);
    res.status(200).json({ data: appointments });
  } catch (error) {}
};

// patient can view his or current appointments
exports.getPatientsAppointment = async (req, res) => {
  const userId = req.session.patient.user_id;
  try {
    const query = `SELECT a.appointment_id, a.appointment_date, a.appointment_time, d.first_name AS doctor_f_name, d.last_name AS doctor_l_name FROM appointments a JOIN doctors d ON a.doctor_id = d.doctor_id
        WHERE  TIMESTAMP(a.appointment_date, a.appointment_time) >= NOW() AND a.patient_id = ? AND status NOT IN ('canceled') ORDER BY a.appointment_date ASC`;

    const [appointments] = await pool.query(query, [userId]);

    res.status(200).json({ data: appointments });
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "Server Error" });
      console.log(error);
    }
  }
};

// reschedule appointment
exports.updateAppointment = async (req, res) => {
 
  const { appointment_date, appointment_time, appointment_id } = req.body;
  try {
    
    await pool.execute(
      "UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE appointment_id = ?",
      [appointment_date, appointment_time, appointment_id]
    );

    res
      .status(200)
      .json({ msg: "appointment has been rescheduled successfully!", status:"success" });
  } catch (error) {
    if (error) {
      res
        .status(500)
        .json({ msg: "Error occurred while trying to book an appointment", status:'failed' });
      console.log(error); // for debugging purposes
    }
  }
};

exports.cancelAppointment = async (req, res) => {
  const { appointment_id } = req.body;
  try {
    await pool.execute(
      "UPDATE appointments SET status = 'canceled' WHERE appointment_id = ?",
      [appointment_id]
    );

    res
      .status(200)
      .json({ msg: "Appointment cancelled successfully!", status: "success" });
  } catch (error) {
    if (error) {
      res
        .status(500)
        .json({
          msg: "Error occurred while trying to cancel appointment",
          status: "failed",
        });
      console.log(error); // for debugging purposes
    }
  }
};
