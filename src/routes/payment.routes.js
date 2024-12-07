import { Router } from "express";
import { successPayment } from "../controllers/payment.controller.js";

const router  = new Router();

router.post('/success/:id', successPayment)

export default  router;