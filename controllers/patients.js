const pool = require("../db/connectdb").promise();
const bcrypt = require("bcryptjs");
exports.registerPatient = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
    gender,
    address,
  } = req.body;
  // Validate the input to ensure all required fields are present
  if (
    !first_name ||
    !last_name ||
    !email ||
    !password ||
    !phone ||
    !dob ||
    !gender ||
    !address
  ) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  try {
    const query = "SELECT * FROM patients WHERE email = ?";
    const [patient] = await pool.query(query, [email]);

    // Check if the patient already exists
    if (patient.length > 0) {
      return res
        .status(400)
        .json({ msg: "This user already exists! Please log in instead." });
    }

    // password hashing
    const hashPassword = await bcrypt.hash(password, 10);

    // inserting the new patient into the database
    const insertQuery =
      "INSERT INTO patients(first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES(?,?,?,?,?,?,?,?)";

    await pool.execute(insertQuery, [
      first_name,
      last_name,
      email,
      hashPassword,
      phone,
      dob,
      gender,
      address,
    ]);

    res.status(201).json({ msg: "User has been successfully registered." });
  } catch (error) {
    if (error) {
      res.status(500).json({
        msg: "Error occurred while trying to register user",
        status: "failed",
      });
      console.error(error); // for debugging purposes
    }
  }
};

//  login user

exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await pool.query(
      "SELECT * from patients WHERE email = ?",
      [email]
    );
    const patient = results[0];
    // console.log(patient)
    
    // checking if email exist on the database
    if (!patient) {
      return res
      .status(404)
      .json({ msg: "invalid email", status: "failed" });
  
    }
      // check if password matches the password on the database
      const passwordMatch = bcrypt.compare(patient.password_hash, password);

      if (!passwordMatch) {
        return res
          .status(404)
          .json({ msg: "incorrect password", status: "failed" });
      }

       //  create session
   req.session.patient = {
     user_id: patient.patient_id,
     name: `${patient.first_name} ${patient.last_name}`,
     email: patient.email,
   };

  //  return a response
   res.status(200).json({
     msg: "Login successful",
     status: "success",
   });
    


    
    
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "server error!" });
      console.error(error);
    }
  }
};

// get patient profile

exports.getProfile = async (req, res) => {
  const patient = req.session.patient;

  try {
    if (patient) {
      const userId = patient.user_id;

      const [results] = await pool.query(
        "SELECT * FROM patients WHERE patient_id = ?",
        [userId]
      );

      if (results.length == 0) {
        return res.status(404).json({ msg: "user not found" });
      }
      res.status(200).json({ data: results[0] });
    }
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "server error!" });
      console.error(error);
    }
  }
};

// update patient profile

exports.updateProfile = async (req, res) => {
  const userId = req.session.patient.user_id;
  try {
    const { first_name, last_name, phone, dob, gender, address } = req.body;
    await pool.execute(
      "UPDATE patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE patient_id = ?",
      [first_name, last_name, phone, dob, gender, address, userId]
    );
    res
      .status(201)
      .json({ msg: "Profile update successful!", status: "success" });
  } catch (error) {
    if (error) {
      res.status(500).json({ msg: "server error!" });
    }
  }
};

// log out patient

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        msg: "Error ocurred could not logout, Please try again",
        status: "failed",
      });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ msg: "Logout Successful!", status: "success" });
  });
};

exports.deletePatient = (req, res) => {
  const userId = req.session.patient.user_id;
  try {
    pool.execute("DELETE FROM patients WHERE patient_id = ?", [userId]);

    res
      .status(200)
      .json({
        msg: "Your account has been deleted successfully!",
        status: "success",
      });
  } catch (error) {
    res.status(500).json({ msg: "server error!", status: "failed" });
  }
};
