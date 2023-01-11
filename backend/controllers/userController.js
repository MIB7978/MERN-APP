const asynchandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const registeruser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!email || !name || !password) {
      res.status(400);
      throw new Error("please Enter all the crderntial fileds");
    }
    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error("user already exist ");
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: await generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.log(error);
  }
};

const authuser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: await generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

const alluser = asynchandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          // { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const user = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.json(user);
});

module.exports = { registeruser, authuser, alluser };
