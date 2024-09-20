import { Router } from "express";
import { LoginUser, RegisterUser , resetLink, changePassword, getAlluser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
 import  {userAuth}  from "../middlewares/userAuth.middleware.js";
const router =  Router();

router.post("/register", upload.single("profilePic"), RegisterUser);
router.post("/login", LoginUser);
router.post("/resetlink", resetLink);
router.post("/changepassword", changePassword);
router.get("/alluser",userAuth, getAlluser);


export default router;
