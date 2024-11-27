import mongoose, { Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserShippingAddress",
      required: true,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
   
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    trackingNumber: { type: String },
    paymentDetails: { type: Object, default: null },
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order", orderSchema);
