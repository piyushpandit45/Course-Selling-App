import express from "express";
import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  courseDetails,
  buyCourse,
  verifyBuyCoursePassword,
} from "../controllers/course.controller.js";

const router = express.Router();

router.post("/create",  adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);
router.get("/courses", getCourses);
router.get("/:courseId", courseDetails);
router.post("/verify-buy-password/:courseId", userMiddleware, verifyBuyCoursePassword);
router.post("/buy/:courseId", userMiddleware, buyCourse);

export default router;
