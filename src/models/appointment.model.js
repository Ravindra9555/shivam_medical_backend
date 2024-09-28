import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
  doctorId: { type: Schema.Types.ObjectId, ref: "DoctorMaster", required: true },
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  comments: { type: String },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
