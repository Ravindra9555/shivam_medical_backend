import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

const createOrder = AsyncHandler(async (req, res) => {
    try {
      console.log("Request body received:", req.body); // Log request payload
      const { userId, addressId, products } = req.body;
  
      // Step 1: Validate required fields
      if (!userId || !addressId || !products || products.length === 0) {
        console.error("Validation failed: Missing fields");
        throw new ApiError(400, "All fields are required and products cannot be empty");
      }
  
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
      const orders = await Order.find({ user: userId })
        .populate("user","-password ") // Populate user fields if needed
        // .populate("shippingAddress") // Populate the shipping address
        // .populate("products.productId", "name price image"); // Populate product details
  
      // Respond with the fetched orders
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error });
    }
  });
  export {
    createOrder, getAllOrderByuserId
  }