import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import  {addproduct,getAllProducts, getAllProductsIsListed, searchproduct, unlistProduct, deleteproduct, updateProduct, getProductByCategoryAndType, getProductDetailsById}  from "../controllers/product.controller.js"

const router = Router();

router.post("/addproduct", upload.single('image'), addproduct);
router.post("/allproducts" ,getAllProducts);
router.post("/allproductsListed" ,getAllProductsIsListed);
router.get("/search/:searchkey" ,searchproduct);
router.post("/unlistproduct", unlistProduct);
router.post("/deleteproduct", deleteproduct);
router.post("/updateproduct", upload.single('image'), updateProduct);
router.get("/filterproduct", getProductByCategoryAndType);
router.get("/getproductDetailsById", getProductDetailsById);


export default router;
