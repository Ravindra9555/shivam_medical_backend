 import Router from "express"
import { addAddress, deleteAddress, getAddress, updateAddress } from "../controllers/shippingAddress.controller.js";

 const router = new Router();
  router.post("/addAddress", addAddress);
  router.post("/getAddress",getAddress);
  router.post("/deleteAddress",deleteAddress);
  router.post("/updateAddress",updateAddress);
  export  default router;
