import { Router } from "express";
import { RegisterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();
router.post("/register", upload.single("profilePic"), (req, res, next) => {
    console.log("Route hit");
    next();
  }, RegisterUser);

export default router;