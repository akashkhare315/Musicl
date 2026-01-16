const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config"); // adjust path if needed
// const { publishToqueue } = require("../broker/rabbit.js");
const { publishToQueue } = require("../broker/rabbit.js");

async function register(req, res) {
  try {
    const {
      email,
      fullname: { firstName, lastName },
      password,
    } = req.body;

    // ✅ check user exists
    const isUserExists = await userModel.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user
    const user = await userModel.create({
      email,
      fullname: { firstName, lastName },
      password: hashedPassword,
    });

    // ✅ generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function googleAuthcallback(req, res) {
  const user = req.user;

  const isUserAlreadyExists = await userModel.findOne({
    //   $or: [{ email: user.emails[0].value }, { googleId: user.id }],
    $or: [
      { email: user.emails && user.emails[0] ? user.emails[0].value : null },
      { googleId: user.id },
    ],
  });

  if (isUserAlreadyExists) {
    const token = jwt.sign(
      {
        id: isUserAlreadyExists._id,
        email: isUserAlreadyExists.email,
      },
      config.JWT_SECRET,
      { expiresIn: "2d" }
    );
    res.cookie("token", token);
    return res.status(200).json({
      message: "user logged in successfully",
      user: {
        id: isUserAlreadyExists.id,
        email: isUserAlreadyExists.email,
        fullname: isUserAlreadyExists.fullname,
        role: isUserAlreadyExists.role,
      },
    });
  }

  const newUser = await userModel.create({
    email: user.emails[0].value,
    googleId: user.id,
    fullname: {
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    },
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" }
  );
  // await publishToqueue("user_created", {
  //   id: newUser_id,
  //   email: newUser.email,
  //   fullname: newUser.fullname,
  //   role: newUser.role,
  // });

  await publishToQueue("user_created", {
    id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname,
    role: newUser.role,
  });

  res.cookie("token", token);
  return res.status(201).json({
    message: "user created successfully",
    user: {
      id: newUser._id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role,
    },
  });

  console.log(user);
  res.send("Google authentication successful");
}

module.exports = { register, googleAuthcallback };
