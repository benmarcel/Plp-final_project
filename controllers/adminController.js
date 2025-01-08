const pool = require("../db/connectdb").promise();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// add admin
exports.registerAdmin = async (req, res) => {
  const { userName, password, role } = req.body;
  // Validate the input to ensure all required fields are present
  if (!userName | !password | !role) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  try {
    const query = "SELECT * FROM admin WHERE username = ?";
    const [admin] = await pool.query(query, [userName]);

    // Check if the admin already exists
    if (admin.length > 0) {
      return res
        .status(400)
        .json({ msg: "This user already exists! Please log in instead." });
    }

    // password hashing
    const hashPassword = await bcrypt.hash(password, 10);

    // inserting the new patient into the database
    const insertQuery =
      "INSERT INTO admin(username, password_hash, role) VALUES(?,?,?)";

    await pool.execute(insertQuery, [userName, hashPassword, role]);

    res.status(201).json({ msg: "User has been successfully registered." });
  } catch (error) {
    if (error) {
      res.status(500).json({
        msg: "Error occurred while trying to register admin",
        status: "failed",
      });
      console.error(error); // for debugging purposes
    }
  }
};

// admin login
exports.adminLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const [results] = await pool.query(
      "SELECT * from admin WHERE username = ?",
      [userName]
    );
    const admin = results[0];

    if (!admin) {
      return res
        .status(404)
        .json({ msg: "invalid Username", status: "failed" });
    }
    // check if password matches the password on the database
    const passwordMatch = bcrypt.compare(admin.password_hash, password);

    if (!passwordMatch) {
      return res
        .status(404)
        .json({ msg: "incorrect password", status: "failed" });
    }

    //  creating a JWT
    const token = jwt.sign(
      { user_id: admin.admin_id },
      process.env.SESSION_SECRET,
      { expiresIn: "1h" }
    );
    req.session.admin = {
      username: userName,
      token: token,
    };
    //  return a response
    res.status(200).json({
      msg: "Login successful",
      status: "success",
      token: token,
    });
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "server error!" });
      console.error(error);
    }
  }
};

// get all patients
exports.getAllPatient = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM patients");
    const patients = results;
    if (!patients) {
      return res.status(404).json({ msg: "No patients found" });
    }
    res.status(200).json({ data: patients });
  } catch (error) {
    if (error) {
      console.log(error.message);
    }
  }
};

// get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM doctors");
    const doctors = results;
    res.status(200).json({ data: doctors });
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "Server error!" });
      console.log(error);
    }
  }
};

// add a new doctor to db
exports.addDoctor = async (req, res) => {
  try {
    const { first_name, last_name, specialization, email, schedule, phone } =
      req.body;
    const [results] = await pool.query(
      "SELECT * FROM doctors WHERE email = ?",
      [email]
    );
    const result = results[0]
    if (result) {
      return res.status(400).json({ msg: "Doctor already exists" });
    }

    await pool.execute(
      "INSERT INTO doctors(first_name, last_name, specialization, email, schedule, phone) VALUES(?, ?, ?, ?, ?, ?)",
      [first_name, last_name, specialization, email, schedule, phone]
    );
    res
      .status(201)
      .json({ msg: "Doctor added successfully!", status: "success" });
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "Server error!" });
      console.log(error);
    }
  }
};
