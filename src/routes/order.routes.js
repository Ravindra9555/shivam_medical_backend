import Router from "express";
import { createOrder, deleteOrder, getAllOrder, getAllOrderByuserId } from "../controllers/order.controller.js";

const router = new Router();

router.post("/createOrder", createOrder);
router.post("/getorderbyid",getAllOrderByuserId);
router.get("/getallorder", getAllOrder);
router.post("/deleteorder", deleteOrder);


export default router;
