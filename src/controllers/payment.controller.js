import crypto from 'crypto';
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const successPayment = AsyncHandler(async (req, res) => {
  console.log(req.query);
  console.log(req.params);
  console.log(req.body);

  // Extract Razorpay payment details
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Validate Razorpay signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  // Handle post-payment logic, e.g., update order status
  // Example:
  // await Order.findByIdAndUpdate(req.params.orderId, {
  //   paymentStatus: "Success",
  //   razorpayPaymentId: razorpay_payment_id,
  // });

  res.status(200).json({ success: true, message: "Payment successful" });
});
export {successPayment}