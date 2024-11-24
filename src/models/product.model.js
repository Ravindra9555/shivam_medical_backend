import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,

    },
    image: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0
    },
    category: {                                         
      type: String,
      required: true,
    },
    priceAfterDiscount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export const Product = mongoose.model("Product", productSchema);
