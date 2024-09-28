import { Router } from "express";
import { createAppointment, getAllAppointmentbyUserId, getAllAppointments, getAllAppointmentsByDate } from "../controllers/appointment.controller.js";

const router = Router();

router.post("/addAppointment",createAppointment);
router.get("/getAllAppointments",getAllAppointments);
router.get("/getAllAppointmentsById",getAllAppointmentbyUserId);
router.get("/getAllAppointmentsByDate",getAllAppointmentsByDate);
export default router;
