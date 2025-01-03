import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DoctorMaster } from "../models/doctor.master.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Appointment } from "../models/appointment.model.js";

const getAdminDashboard = AsyncHandler(async (req, res) => {
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Count total users
  const totalUsers = await User.countDocuments();
  const totalDoctors = await DoctorMaster.countDocuments();
  const availableDoctors = await DoctorMaster.find({ isActive: true }).countDocuments();

  // Count today's appointments
  const todaysAppointments = await Appointment.find({
    date: { $gte: today },
  }).countDocuments();

  // Count today's orders
  const todaysOrders = await Order.find({
    createdAt: { $gte: today },
  }).countDocuments();

  // Return last 10 orders
  const lastOrders = await Order.find().sort({ createdAt: -1 }).limit(10);


 // Return last 10 appointments
const lastAppointments = await Appointment.find()
.populate("doctorId", "name")
.populate("patientId", "name")
.sort({ createdAt: -1 })
.limit(10);

// Return last 10 users
const lastUsers = await User.find()
  .select("-password -shippingAddresses -refreshToken")
  .sort({ createdAt: -1 })
  .limit(10);

  // Return last 7 days' orders count with date
  const last7DaysOrders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Sort by date
  ]);
  const data = {
    totalUsers,
    totalDoctors,
    availableDoctors,
    todaysAppointments,
    todaysOrders,
    lastOrders,
    lastAppointments,
    lastUsers,
    last7DaysOrders,
  };
  // Send response
  res.status(200).json(new ApiResponse(200, "Dashboard Data", data));
});

export { getAdminDashboard };
