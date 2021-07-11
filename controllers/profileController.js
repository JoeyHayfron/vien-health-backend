const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.getProfile = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({
      status: "failed",
      message: "You are not authorized to view this data",
    });
    return;
  }

  if (token.split(" ")[0] != "Bearer") {
    res.status(401).json({
      status: "failed",
      message: "Invalid token",
    });
    return;
  }

  const userId = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(userId).select("-password");
  res.status(200).json({
    status: "success",
    body: {
      user,
    },
  });
};
