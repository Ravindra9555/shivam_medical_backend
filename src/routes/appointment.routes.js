import { Router } from "express";
import { createAppointment, getAllAppointmentbyUserId, getAllAppointments, getAllAppointmentsByDate ,ChangeAppointmentStausCompleted, ChangeAppointmentStausActive, rejectAppointment, DeleteAppointment} from "../controllers/appointment.controller.js";

const router = Router();

router.post("/addAppointment",createAppointment);
router.get("/getAllAppointments",getAllAppointments);
router.post("/getAllAppointmentsById",getAllAppointmentbyUserId);
router.post("/getAllAppointmentsByDate",getAllAppointmentsByDate);
router.post("/deleteAppointment", DeleteAppointment);
router.post("/rejectAppointment", rejectAppointment);
router.post("/changeAppointmentStatusComplete", ChangeAppointmentStausCompleted);
router.post("/changeAppointmentStatusactive", ChangeAppointmentStausActive);
export default router;
