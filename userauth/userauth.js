const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isAuthenticated = (req, res, next) => {
  if (req.session.patient) {
    return next();
  } else {
    res.status(401).json({ msg: "Please login" });

    console.log(res.msg);
  }
};


exports.isVerified = (req, res, next) => {
  const token = req.session.admin.token;
  if (token) {
    
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ msg: "User is unauthorized" });
      } else {
      return  next()
      }
    });
  }
};
