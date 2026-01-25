import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import Purchase from "../models/purchase.model.js";
import Course from "../models/course.model.js";

// Zod schema (only for signup)
const userSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const validateData = userSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        errors: validateData.error.issues.map(err => err.message),
      });
    }

    const { firstname, lastname, email, password } = validateData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    console.log("error in signup:", error.message);
    return res.status(500).json({ error: "error in creating user" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    // ✅ JWT token (correct way)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_PASSWORD,
      { expiresIn: "7d" }
    );
    const cookieOptions = {
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    res.cookie("token", token, cookieOptions  );
    return res.status(200).json({
      message: "Login successful",
      user,
      token,
      role: "user" // ✅ Added: Explicit role for frontend
    });

  } catch (error) {
    console.log("error in login user:", error.message);
    return res.status(500).json({
      error: "error in login user",
    });
  }
};



// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log("error in logout:", error.message);
    return res.status(500).json({
      error: "error in logout",
    });
  }
};



export const Purchases = async (req, res) => {
  try {
    const userId = req.userId;

    const purchases = await Purchase.find({ userId });

    const purchasedCourseIds = purchases.map(
      (purchase) => purchase.courseId
    );

    const courses = await Course.find({
      _id: { $in: purchasedCourseIds },
    });

    res.status(200).json({
      success: true,
      purchases,
      courses,
    });
  } catch (error) {
    console.error("Fetch purchases error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
