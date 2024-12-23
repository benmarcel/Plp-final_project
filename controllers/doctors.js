const pool = require("../db/connectdb").promise();

exports.getDoctors = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM doctors");
    const doctors = results;
    if (!doctors) {
      return res.status(500).json({ msg: "Error retrieving doctors" });
    }
    res.status(200).json({ data: doctors });
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "Server error !" });
      console.log(error);
    }
  }
};

exports.updateProfile = async (req, res) => {
  const { doctorID } = req.body;
  try {
    const {
      doctor_id,
      first_name,
      last_name,
      specialization,
      email,
      schedule,
      phone,
    } = req.body;
    const query =
      "UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, schedule = ?, phone = ? WHERE doctor_id = ?";
    await pool.execute(query, [
      first_name,
      last_name,
      specialization,
      email,
      schedule,
      phone,
      doctor_id,
    ]);

    res.status(200).json({ msg: "profile has been updated successfully" });
  } catch (error) {
    if (error) {
      res.status(500).send("Server error!");
      console.log(error);
    }
  }
};

exports.deleteDoctor = async (req, res) => {
  const { doctorID, email } = req.body;

  try {
    const [results] = await pool.query(
      "SELECT * from doctors WHERE email = ?",
      [email]
    );
    if(!results){
      return res.status(404).json({msg:'Invalid id! please check id and try again'})
    }
    
    await pool.execute("DELETE FROM doctors WHERE doctor_id = ?", [doctorID]);

    res.status(200).json({msg:'Doctor deleted successfully!'})
  } catch (error) {
    if (error) {
      res.status(500).send("Server error!");
      console.log(error);
    }
  }
};
