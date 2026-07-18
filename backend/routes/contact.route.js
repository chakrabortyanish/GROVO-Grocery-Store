import express from "express";

import {
  createContact,
  getAllContacts,
  getSingleContact,
  updateStatus,
  replyToContact,
  deleteContact,
} from "../controllers/contact.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { adminAuth } from "../middleware/admin.middleware.js";

const contactRouter = express.Router();

// Customer
contactRouter.post("/", verifyToken, createContact);

// Admin

contactRouter.get("/admin", adminAuth, getAllContacts);

contactRouter.get("/admin/:id", adminAuth, getSingleContact);

contactRouter.patch("/admin/:id/status", adminAuth, updateStatus);

contactRouter.post("/admin/:id/reply", adminAuth, replyToContact);

contactRouter.delete("/admin/:id", adminAuth, deleteContact);

export default contactRouter;
