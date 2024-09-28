import mongoose, { Schema } from "mongoose";

const doctorMasterSchema = new Schema(
  {
    doctorId: {
      type: String, // Correct type declaration
      required: [true, "Doctor ID is required"], // Correct required syntax
      unique: true,
    },
    email: {
      type: String, // Correct type declaration
      required: [true, "Email is required"], // Correct required syntax
      unique: true,
    },
    name: {
      type: String, // Correct type declaration
      required: [true, "Name is required"], // Correct required syntax
    },
    specialization: {
      type: String, // Correct type declaration
      required: [true, "Specialization is required"], // Correct required syntax
    },
    profilePic: {
      type: String, // Correct type declaration
    },
    phone: {
      type: String, // Correct type declaration
      required: [true, "Phone is required"], // Correct required syntax
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Validate phone number length (10 digits)
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const DoctorMaster = mongoose.model("DoctorMaster", doctorMasterSchema);
