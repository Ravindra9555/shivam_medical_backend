import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import {User } from "../models/user.model.js";
const createOrder = AsyncHandler(async (req, res) => {
  try {
    console.log("Request body received:", req.body); // Log request payload
    const { userId, addressId, products } = req.body;

    // Step 1: Validate required fields
    if (!userId || !addressId || !products || products.length === 0) {
      console.error("Validation failed: Missing fields");
      throw new ApiError(
        400,
        "All fields are required and products cannot be empty"
      );
    }
    // Step 2: Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      throw new ApiError(404, "User not found");
    }

    // Step 3: Fetch address details from the database
    const address =  user.shippingAddresses[0] || {};
    if (!address) {
      console.error("Address not found");
      throw new ApiError(404, "Address not found");
    }

    // Step 4: Validate product details
    console.log("Validation passed");

    // Step 2: Fetch product details from the database
    const productDetails = await Promise.all(
      products.map(async (item) => {
        console.log(`Fetching details for productId: ${item.productId}`);
        const product = await Product.findById(item.productId);
        if (!product) {
          console.error(`Product not found: ${item.productId}`);
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

    console.log("Product details fetched:", productDetails);

    // Step 3: Calculate total amount
    const totalAmount = productDetails.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    console.log("Total amount calculated:", totalAmount);

    // Step 4: Create the order
    const order = new Order({
      user: userId,
      address: address,
      shippingAddress: addressId, // Match field names properly
      products: productDetails,
      totalPrice: totalAmount,
    });

    await order.save();
    console.log("Order created successfully:", order);

    res
      .status(200)
      .json(new ApiResponse(200, "Order created successfully", order));
  } catch (error) {
    console.error("Error during order creation:", error.message); // Log the actual error
    throw new ApiError(500, error.message || "Error creating order");
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
  const getAllOrder =AsyncHandler(async(req, res)=>{
     const {pageNo} = req.query ;
      if(!pageNo) {
        throw new ApiError(400, "Page number is required");
      }
    try {
        const limit = 10;
        const skip  = (pageNo - 1)*limit;
        const totalCount = await Order.countDocuments({});
        const pageSize = Math.ceil(totalCount / limit); // Use Math.ceil   
           const orders = await Order.find().skip(skip).limit(limit);
        res.status(200).json(new ApiResponse(200, "All Orders", {orders, pageSize, pageNo,  totalCount}));
    } catch (error) {
       throw new ApiError( 500, "Error processing data")
    }
      
  });
  const deleteOrder = AsyncHandler(async(req, res)=>{
    const { orderId } = req.body;
    if(!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    try {
      const order = await Order.findByIdAndDelete(orderId);
      if(!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(new ApiResponse(200, "Order deleted successfully", order));
    } catch (error) {
      res.status(500).json({ message: "Error deleting order", error });
    }
  })
export { createOrder, getAllOrderByuserId, getAllOrder, deleteOrder };
