import mongoose, { Schema } from "mongoose";
const contactSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Validate phone number length (10 digits)
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Optional: convert email to lowercase
      trim: true, // Optional: remove any leading/trailing spaces
      validate: {
        validator: function (v) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v); // Basic email validation
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "resolved", "rejected"],
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
