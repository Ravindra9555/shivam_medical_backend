import Router from "express";
import { createOrder } from "../controllers/order.controller.js";

const router = new Router();

router.post("/createOrder", createOrder);
router.get("/getOrders");
router.get("/getOrder/:orderId");
router.post("/updateOrder/:orderId");


export default router;
