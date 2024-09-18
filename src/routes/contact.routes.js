import { Router } from "express";
import { contactUs, RejectQuery, ResolveQuery } from "../controllers/contactus.controller.js";
const router = Router();

router.post("/contact", contactUs);
router.post("/resolve", ResolveQuery);
router.post("/reject", RejectQuery);

export default router;

// Ensure this path is correct
