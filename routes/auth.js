import express from "express" ;
import jwt from "jsonwebtoken" ;
import bcrpyt from "bcrypt" ;
import User from "../models/User.js" ;
import auth from "../middleware/auth.js" ;

const router = express.Router();

/**
 * @route  POST /api/auth/login
 * @desc   Login user and return JWT token
 * @access Public
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );
    res
      .status(200)
      .json({ message: "Login Successful", token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route  GET /api/auth/verify-token
 * @desc   Verify JWT token
 * @access Private
 */
router.get("/verify-token", auth, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

/**
 * @route  GET /api/auth/dashboard
 * @desc   Get user dashboard
 * @access Private
 */

router.get("/dashboard", auth, (req, res) => {
  res.status(200).json({ message: "Dashboard", user: req.user });
});

/**
 * @route  POST /api/auth/signup
 * @desc   Register a new user
 * @access Public
 */
export default router;
