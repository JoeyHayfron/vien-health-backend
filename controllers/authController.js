const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createandSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    _token: token,
    body: {
      user,
    },
  });
};

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      status: "failed",
      message: "please make sure all fields are filled",
    });
  }

  User.find({ email: email }, async (err, docs) => {
    if (docs == undefined || docs.length > 0) {
      return res.status(400).json({
        status: "failed",
        message: "User with this email already exists",
      });
    } else {
      var newUser = await User.create({
        name: name,
        email: email,
        password: password,
      });
      createandSendToken(newUser, 201, res);
    }
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (email == "" || password == "") {
    return res.status(400).json({
      status: "failed",
      message: "Please make sure enter email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "failed",
      message: "Incorrect email or password",
    });
  }

  createandSendToken(user, 200, res);
};
