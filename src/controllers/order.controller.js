import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { instance } from "../app.js";
import crypto from "crypto";
import mongoose from "mongoose";
const createOrder = AsyncHandler(async (req, res) => {
  try {
    console.log("Request body received:", req.body); // Log request payload
    const { userId, addressId, products } = req.body;

    // Step 1: Validate required fields
    if (!userId || !addressId || !products || products.length === 0) {
      // console.error("Validation failed: Missing fields");
      throw new ApiError(
        400,
        "All fields are required and products cannot be empty"
      );
    }
    // Step 2: Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      // console.error("User not found");
      throw new ApiError(404, "User not found");
    }

    // Step 3: Fetch address details from the database
    const address = user.shippingAddresses[0] || {};
    if (!address) {
      // console.error("Address not found");
      throw new ApiError(404, "Address not found");
    }

    // Step 4: Validate product details
    // console.log("Validation passed");

    // Step 5: Fetch product details from the database
    const productDetails = await Promise.all(
      products.map(async (item) => {
        // console.log(`Fetching details for productId: ${item.productId}`);
        const product = await Product.findById(item.productId);
        if (!product) {
          // console.error(`Product not found: ${item.productId}`);
          throw new ApiError(404, `Product not found: ${item.productId}`);
        }
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
          image: product.image,
          discount: product.discount,
          mrp: product.mrp,
          type: product.type,
          category: product.category,
        };
      })
    );

    // console.log("Product details fetched:", productDetails);

    // Step 6: Calculate total amount
    const totalAmount = productDetails.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    // console.log("Total amount calculated:", totalAmount);

    // Step 7: Create the order
    const order = new Order({
      user: userId,
      address: address,
      shippingAddress: addressId, // Match field names properly
      products: productDetails,
      totalPrice: totalAmount,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();
    // console.log("Order created successfully:", order);

    const razorpayOrder = await instance.orders.create({
      amount: totalAmount.toFixed(2) * 100,
      currency: "INR",
      receipt: `order-${order._id}`,
      notes: {
        order_id: order._id.toString(),
      },
      payment_capture: 1,
    });

    res.status(200).json(
      new ApiResponse(200, "Order created successfully", {
        order,
        razorpayOrder,
      })
    );
  } catch (error) {
    // console.error("Error during order creation:", error.message); 
    throw new ApiError(500, error.message || "Error creating order");
  }
});

const setlePayment = AsyncHandler(async(req, res)=>{
  const { orderId}  = req.body;
  if(!orderId){
    throw new ApiError(500, "Please send a valid order details");
  }
  // find order by id
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  // check if order is pending
  if (order.paymentStatus!== "pending") {
    throw new ApiError(400, "Order is already settled");
  }
  
  const razorpayOrder = await instance.orders.create({
    amount: order.totalPrice.toFixed(2) * 100,
    currency: "INR",
    receipt: `order-${order._id}`,
    notes: {
      order_id: order._id.toString(),
    },
    payment_capture: 1,
  });

  res.status(200).json(
    new ApiResponse(200, "Order created successfully", {
      order,
      razorpayOrder,
    })
  );
 
})
//  payment verifuication
const verifypayment = AsyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
    req.body;
  // check if present or not
  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature ||
    !orderId
  ) {
    throw new ApiError(500, "Please send a valid order details");
  }
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  // Check if the signature matches
  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(400, "Invalid Signature");
  }
  // check if order id matches
  if (expectedSignature === razorpaySignature) {
    // update oder status
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "success",
      status: "processing",
      paymentDetails:{
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      }
    });

    res.status(200).json(new ApiResponse(200, "payment succesfull", {}));
  } else {
    res.status(400).json(new ApiResponse(400, "Payment failed", {}));
  }
});
 
const getAllOrderByuserId = AsyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Validate if userId is present
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Fetpoch all orders for the specified user
    const orders = await Order.find({ user: userId });
    // Respond with the fetched orders
    res
      .status(200)
      .json(new ApiResponse(200, "Orders Fetched Succesfully", orders));
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});
const getAllOrder = AsyncHandler(async (req, res) => {
  const { pageNo } = req.query;
  if (!pageNo) {
    throw new ApiError(400, "Page number is required");
  }
  try {
    const limit = 10;
    const skip = (pageNo - 1) * limit;
    const totalCount = await Order.countDocuments({});
    const pageSize = Math.ceil(totalCount / limit); // Use Math.ceil
    const orders = await Order.find().skip(skip).limit(limit);
    res.status(200).json(
      new ApiResponse(200, "All Orders", {
        orders,
        pageSize,
        pageNo,
        totalCount,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error processing data");
  }
});
const deleteOrder = AsyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Order deleted successfully", order));
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
});
const getOrderById = AsyncHandler(async (req, res) => {
  const { orderId } = req.body;
  
  // Validate orderId
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Please send a valid order ID");
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json(new ApiResponse(200, "Order fetched successfully", order));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiResponse(500, error.message || "Something Went Wrong"));
  }
});

export {
  createOrder,
  getAllOrderByuserId,
  getAllOrder,
  deleteOrder,
  verifypayment,
  setlePayment,
  getOrderById
};
