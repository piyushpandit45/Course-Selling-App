import express from "express";
import { createContact, getContacts } from "../controllers/contact.controller.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();

router.post("/create", createContact);
router.get("/contacts", adminMiddleware, getContacts);

export default router;
