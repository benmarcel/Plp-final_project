const pool = require("../db/connectdb").promise();

exports.getAllPatients = async (req, res) => {
  try {
    [results] = await pool.query("SELECT * FROM patients");
    patients = results;
    res.status(200).json({ data: patients });
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "Server error!" });
    }
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    [results] = await pool.query("SELECT * FROM doctors");
    doctors = results;
    res.status(200).json({ data: doctors });
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "Server error!" });
      console.log(error);
    }
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const { first_name, last_name, specialization, email, schedule, phone } =
      req.body;
    [results] = await pool.query("SELECT * FROM doctors WHERE email = ?", [
      email,
    ]);
    if (results.length > 0) {
      return res.status(400).json({ msg: "Doctor already exists" });
    }

    await pool.execute(
      "INSERT INTO doctors(first_name, last_name, specialization, email, schedule, phone) VALUES(?, ?, ?, ?, ?, ?)",
      [first_name, last_name, specialization, email, schedule, phone]
    );
    res.status(201).json({msg:'Doctor added successfully!'})
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "Server error!" });
      console.log(error);
    }
  }
};
