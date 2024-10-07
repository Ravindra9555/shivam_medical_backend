import { Router } from "express";
import { LoginUser, RegisterUser ,UpdateUser, resetLink, changePassword, getAlluser, deleteUser, makeUserInactive, makeUserActive, SearchUser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
 import  {userAuth}  from "../middlewares/userAuth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middlerware.js";
const router =  Router();

router.post("/register", upload.single("profilePic"), RegisterUser);
router.post("/update", upload.single("profilePic"), UpdateUser);
router.post("/login", LoginUser);
router.post("/resetlink", resetLink);
router.post("/changepassword", changePassword);
router.get("/alluser", verifyAdmin, getAlluser);
router.post("/searchuser", SearchUser);
router.post("/deleteUser", verifyAdmin, deleteUser);
router.post("/userinactive", verifyAdmin, makeUserInactive);
router.post("/useractive", verifyAdmin, makeUserActive);


export default router;
