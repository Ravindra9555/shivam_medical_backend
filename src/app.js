import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiResponse } from "./utils/ApiResponse.js";
import { errorHandler } from "./middlewares/errorhandler.middleware.js";
import Razorpay from "razorpay";
const app = express();
app.use(express.static("dist"));

app.use(cors());
app.use(cookieParser());

app.use(
  express.json({
    limit: "20kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use(express.static("public"));

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEYID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// instance.orders.all().then(console.log).catch(console.error);

app.get("/", (req, res) => {
  res.json(new ApiResponse(200, "success", "Api is working fine "));
});

import userRoutes from "./routes/user.routes.js"; // Ensure this path is correct
import ContactUs from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js"; // Ensure this path is correct
import doctorMasterRoutes from "./routes/doctor.master.routes.js";
import AppointmentRoutes from "./routes/appointment.routes.js";
import ProductsRoutes from "./routes/product.routes.js";
import AIroutes  from "./routes/AI.routes.js";
import orderRoutes from "./routes/order.routes.js";
import Dashboard  from "./routes/dashbaord.js"
app.use("/v1/api/admin", adminRoutes);
app.use("/v1/api/users", userRoutes);
app.use("/v1/api/contact", ContactUs);
app.use("/v1/api/doctorMaster", doctorMasterRoutes);
app.use("/v1/api/appointment", AppointmentRoutes);
app.use("/v1/api/product", ProductsRoutes);
app.use("/v1/api/googleai", AIroutes);
app.use("/v1/api/order", orderRoutes);
app.use("/v1/api/dashbaord", Dashboard);


app.use(errorHandler);
export { app , instance};
