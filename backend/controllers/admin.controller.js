import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Admin } from "../models/admin.model.js";
import UserSession from "../models/UserSession.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const adminSchema = z.object({
    firstName: z.string().min(3, { message: "firstName must be atleast 3 char long" }),
    lastName: z.string().min(3, { message: "lastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "password must be atleast 6 char long" }),
  });

  const validatedData = adminSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ error: validatedData.error.issues.map((err) => err.message).join(", ") });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Signup succeedded", newAdmin });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(500).json({ error: "Error in signup" });
  }
};

export const login = async (req, res) => {
  const { email, password, deviceId } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET_PASSWORD, // ✅ Fixed: Use same secret as user
      { expiresIn: "7d" }
    );

    // Device session management for admin
    try {
      // Clean all existing sessions for this admin
      await UserSession.cleanUserSessions(admin._id);
      
      // Create new session
      await UserSession.create({
        userId: admin._id,
        deviceId: deviceId || 'admin-device',
        token: token
      });
    } catch (sessionError) {
      console.log("Admin session management error:", sessionError.message);
      // Continue with login even if session management fails
    }

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("token", token, cookieOptions); // ✅ Fixed: Use "token" like user
    res.status(200).json({ 
      message: "Login successful", 
      user: admin, // ✅ Fixed: Send as "user" for frontend compatibility
      token,
      role: "admin" // ✅ Added: Explicit role for frontend
    });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ error: "Error in login" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    // Remove session from database
    if (token) {
      try {
        await UserSession.removeSession(token);
      } catch (sessionError) {
        console.log("Admin session removal error:", sessionError.message);
        // Continue with logout even if session removal fails
      }
    }
    
    res.clearCookie("token"); // ✅ Fixed: Clear "token" like user
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout", error);
    res.status(500).json({ error: "Error in logout" });
  }
};
