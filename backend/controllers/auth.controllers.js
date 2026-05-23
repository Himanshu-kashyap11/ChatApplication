import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// ----- Signup -----
export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check username
    const checkUserByUserName = await User.findOne({ userName });

    if (checkUserByUserName) {
      return res.status(400).json({
        message: "UserName Already Exist",
      });
    }

    // Check email
    const checkUserByEmail = await User.findOne({ email });

    if (checkUserByEmail) {
      return res.status(400).json({
        message: "Email Already Exist",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    // Remove password from response
    const userResponse = await User.findById(user._id).select("-password");

    return res.status(201).json(userResponse);

  } catch (error) {
    return res.status(500).json({
      message: `signup error ${error}`,
    });
  }
};

// ----- Login -----
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    // Generate token
    const token = genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    // Remove password
    const userResponse = await User.findById(user._id).select("-password");

    return res.status(200).json(userResponse);

  } catch (error) {
    return res.status(500).json({
      message: `login error ${error}`,
    });
  }
};

// ----- Logout -----
export const logOut = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({
      message: "Logout successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: `logout error ${error}`,
    });
  }
};