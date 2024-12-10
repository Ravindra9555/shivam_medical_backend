import Router from "express";
import { createOrder, deleteOrder, getAllOrder, getAllOrderByuserId, setlePayment, verifypayment, getOrderById } from "../controllers/order.controller.js";

const router = new Router();

router.post("/createOrder", createOrder);
router.post("/verifyPayment", verifypayment);
router.post("/getorderbyid",getAllOrderByuserId);
router.get("/getallorder", getAllOrder);
router.post("/deleteorder", deleteOrder);
router.post("/setlePayment", setlePayment);
router.post("/getOrderbyOrderId", getOrderById);


export default router;
