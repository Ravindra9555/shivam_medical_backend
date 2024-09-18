import { Router } from "express";
import { RegisterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router =  Router();
router.post("/register", upload.single("profilePic"), RegisterUser);


export default router;