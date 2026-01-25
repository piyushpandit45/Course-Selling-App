import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      public_id: String,
      url: String,
    },
    // Extended course details (optional for backward compatibility)
    courseOverview: {
      type: String,
      default: "",
    },
    syllabus: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },
    benefits: {
      type: String,
      default: "",
    },
    eligibility: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);

export default Course;