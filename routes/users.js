import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import Article from "../models/Article.js";

const router = express.Router();

/**
 * @route  POST /api/users
 * @desc   Register a new user
 * @access Public
 */
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, including one letter and one number.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists.",
      });
    }

    const user = new User(req.body);
    await user.save();
    res.send(user).status(201);
  } catch (err) {
    res.send(err).status(400);
  }
});

/**
 * @route  GET /api/users/:id
 * @desc   Get user profile and their articles by user ID
 * @access Private
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const articles = await Article.find({ author: userId }).populate(
      "author",
      "name"
    );

    res.status(200).json({ user, articles });
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @route  PUT /api/users/:id
 * @desc   Update user profile by user ID
 * @access Private
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId != req.user.userId)
      return res.status(401).json({ message: "Unauthorized" });

    const { name, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
