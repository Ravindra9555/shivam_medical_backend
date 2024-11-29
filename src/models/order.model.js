import mongoose, { Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserShippingAddress",
      required: true,
    },
    address: { type: Object },

    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        type : { type: String, required: true },
        discount: { type: Number, required: true },
        mrp: { type: Number, required: true },

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
