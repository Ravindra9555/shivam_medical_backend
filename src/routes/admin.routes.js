  import { Router } from "express";
  import { LoginAdmin, GetAllAdminUsers, RegisterAdmin , makeAdminInactive, makeAdminActive, deleteAdmin} from "../controllers/admin.controller.js";
  import { verifyAdmin } from "../middlewares/admin.middlerware.js";
  import { upload } from "../middlewares/multer.middleware.js";
  const router  = Router();

  router.post("/register",upload.single("profilePic") ,RegisterAdmin);
  router.post("/login", LoginAdmin);
  router.get("/all", verifyAdmin, GetAllAdminUsers);
  router.post("/makeinactive", verifyAdmin, makeAdminInactive);
  router.post("/makeactive", verifyAdmin, makeAdminActive);
  router.post("/delete", verifyAdmin, deleteAdmin);

 export default router;
