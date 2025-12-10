import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({
      email,
      password,
      role: role || "driver",
      name,
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};