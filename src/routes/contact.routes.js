import { Router } from "express";
import {
  contactUs,
  RejectQuery,
  ResolveQuery,
  GetAllContactUsMessage,
  PendingQuery,
} from "../controllers/contactus.controller.js";
 import { verifyAdmin } from "../middlewares/admin.middlerware.js";

const router = Router();

router.post("/contact", contactUs);
router.get("/all",verifyAdmin, GetAllContactUsMessage);
// Ensure these paths are correct
router.post("/resolve",verifyAdmin, ResolveQuery);
router.post("/reject",verifyAdmin, RejectQuery);
router.post("/pending",verifyAdmin, PendingQuery);


export default router;

// Ensure this path is correct
