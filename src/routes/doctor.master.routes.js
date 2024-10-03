 import { Router } from "express";
 import { addDoctor ,getAllDoctors, deleteDoctor , makeDocotorActive, getActiveDoctors } from "../controllers/doctor.master.controller.js";
 import { upload } from "../middlewares/multer.middleware.js";
 const router= Router();
 
 router.post('/addDoctor',upload.single("profilePic"), addDoctor);
 router.get('/getAllDoctors', getAllDoctors);
 router.get('/getAllDoctorsActive', getActiveDoctors);
 router.post('/deleteDoctor',deleteDoctor);
 router.post('/makeDoctorActive', makeDocotorActive);

 export default router;
