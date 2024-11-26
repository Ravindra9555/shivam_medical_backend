import { Router } from "express";
import { generateMedicalReport } from "../controllers/AI.controller.js";
const router = Router();
router.post("/generateMedicalReport", generateMedicalReport);
export default router;
