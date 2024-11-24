import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import  {addproduct,getAllProducts, getAllProductsIsListed, searchproduct}  from "../controllers/product.controller.js"

const router = Router();

router.post("/addproduct", upload.single('image'), addproduct);

router.post("/allproducts" ,getAllProducts);
router.post("/allproductsListed" ,getAllProductsIsListed);
router.get("/search/:searchkey" ,searchproduct);


// router.get("/allproductsForweb");
// router.post("/updateproduct", upload);
// router.post("/deleteproduct", upload);
// router.get("/searchproduct");
// router.get("/getproductbyid");
// router.get("/getproductBycategory");
// router.get("/getproductByType");
// router.post("/unlistProduct");

export default router;
