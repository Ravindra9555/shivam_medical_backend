import { Router } from "express";
import { getAdminDashboard } from "../controllers/Dashboard.js";

const router = Router();

router.get("/admindashboard", getAdminDashboard);
export default router;
