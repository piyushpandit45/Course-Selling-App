import Course from "../models/course.model.js"; // ✅ Fixed: Use default import
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/purchase.model.js";


// CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Course image is required" });
    }

    const image = req.files.image;
    const allowedFormat = ["image/png", "image/jpeg"];

    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({
        error: "Only PNG and JPG images are allowed",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(
      image.tempFilePath
    );

    const course = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      // Add extended course details (with fallbacks)
      courseOverview: req.body.courseOverview || "",
      syllabus: req.body.syllabus || "",
      duration: req.body.duration || "",
      benefits: req.body.benefits || "",
      eligibility: req.body.eligibility || "",
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Update basic fields
    const { title, description, price, courseOverview, syllabus, duration, benefits, eligibility } = req.body;
    
    const updateData = {
      title: title || course.title,
      description: description || course.description,
      price: price || course.price,
      courseOverview: courseOverview || course.courseOverview,
      syllabus: syllabus || course.syllabus,
      duration: duration || course.duration,
      benefits: benefits || course.benefits,
      eligibility: eligibility || course.eligibility
    };

    // Handle image update if new image is provided
    if (req.files && req.files.image) {
      const image = req.files.image;
      const allowedFormat = ["image/png", "image/jpeg"];

      if (!allowedFormat.includes(image.mimetype)) {
        return res.status(400).json({
          error: "Only PNG and JPG images are allowed",
        });
      }

      const uploadResult = await cloudinary.uploader.upload(
        image.tempFilePath
      );

      updateData.image = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET SINGLE COURSE
export const courseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ course });
  } catch (error) {
    console.error("Course detail error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const buyCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ error: "Course already purchased" });
    }
    const newPurchase = await new Purchase({ userId, courseId }).save();
    res.status(201).json({
      message: "Course purchased successfully",
      purchase: newPurchase,
    });
  } catch (error) {
    console.error("Buy course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


