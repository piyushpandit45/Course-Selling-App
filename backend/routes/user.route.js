import express from "express";
import { signup, login, logout, Purchases } from "../controllers/user.controller.js";
import Purchase from "../models/purchase.model.js";
import userMiddleware from "../middlewares/user.mid.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/purchases", userMiddleware, Purchases);

export default router;
