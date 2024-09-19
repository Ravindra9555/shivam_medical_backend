import { Router } from "express";
import { LoginUser, RegisterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router =  Router();
router.post("/register", upload.single("profilePic"), RegisterUser);
router.post("/login", LoginUser);


export default router;