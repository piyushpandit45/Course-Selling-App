import Contact from "../models/contact.model.js"; // ✅ Fixed: Use default import
import { z } from "zod";

// Zod schema for contact validation
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

// ================= CREATE CONTACT =================
export const createContact = async (req, res) => {
  try {
    const validateData = contactSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        errors: validateData.error.issues.map(err => err.message),
      });
    }

    const { name, email, message } = validateData.data;

    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    return res.status(201).json({
      message: "Contact form submitted successfully",
      contact: newContact,
    });

  } catch (error) {
    console.log("error in contact submission:", error.message);
    return res.status(500).json({ errors: "error in submitting contact form" });
  }
};

// ================= GET ALL CONTACTS (FOR ADMIN) =================
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
