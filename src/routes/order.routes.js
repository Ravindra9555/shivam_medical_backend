import Router from "express";
import { createOrder, getAllOrderByuserId } from "../controllers/order.controller.js";

const router = new Router();

router.post("/createOrder", createOrder);
router.post("/getorderbyid",getAllOrderByuserId);
router.get("/getOrder/:orderId");
router.post("/updateOrder/:orderId");


export default router;
