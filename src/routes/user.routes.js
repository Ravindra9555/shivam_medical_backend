import { Router } from "express";
import {
  LoginUser,
  RegisterUser,
  UpdateUser,
  resetLink,
  changePassword,
  getAlluser,
  deleteUser,
  makeUserInactive,
  makeUserActive,
  SearchUser,
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middlerware.js";
const router = Router();

router.post("/register", upload.single("profilePic"), RegisterUser);
router.post("/update", upload.single("profilePic"), UpdateUser);
router.post("/login", LoginUser);
router.post("/resetlink", resetLink);
router.post("/changepassword", changePassword);
router.get("/alluser", getAlluser);
router.post("/searchuser", SearchUser);
router.post("/deleteUser", verifyAdmin, deleteUser);
router.post("/userinactive", verifyAdmin, makeUserInactive);
router.post("/useractive", verifyAdmin, makeUserActive);
router.post("/addAddress", addAddress);
router.post("/getAddress", getAddress);
router.post("/deleteAddress", deleteAddress);
router.post("/updateAddress", updateAddress);

export default router;
