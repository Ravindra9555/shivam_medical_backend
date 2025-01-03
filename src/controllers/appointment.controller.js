import { Appointment } from "../models/appointment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const createAppointment = AsyncHandler(async (req, res) => {
  const { doctorId, patientId, date, time, comments } = req.body;

  // Validate required fields
  if (!doctorId || !patientId || !date || !time) {
    throw new ApiError(400, "All fields are required");
  }

  // Create the appointment
  const appointment = await Appointment.create({
    doctorId,
    patientId,
    date,
    time,
    comments,
  });

  if (!appointment) {
    throw new ApiError(500, "Error creating appointment");
  }

  // Respond with the created appointment
  res
    .status(201)
    .json(new ApiResponse(201, "Appointment Booked Successfully", appointment));
});

const getAllAppointments = AsyncHandler(async (req, res) => {
  // Fetch all appointments with populated doctor and patient details
  const appointments = await Appointment.find()
    .populate("doctorId", "name email specialization")
    .populate("patientId", "name email");

  if (!appointments || appointments.length === 0) {
    throw new ApiError(404, "No appointments found");
  }

  // Respond with all appointments
  res.status(200).json(new ApiResponse(200, "All Appointments", appointments));
});

// Get all appointments by user ID
const getAllAppointmentbyUserId = AsyncHandler(async (req, res) => {
  const { id } = req.body;

  // Check if ID is provided
  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  // Fetch appointments for the given patient ID
  const appointments = await Appointment.find({ patientId: id })
    .populate("doctorId", "name email specialization")
    .populate("patientId", "name email");

  // Check if any appointments were found
  if (!appointments || appointments.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No appointments found for this user", []));
  }

  // Return the appointments including status
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Appointments fetched successfully", appointments)
    );
});

// Get all appointments with a specific date for admin
const getAllAppointmentsByDate = AsyncHandler(async (req, res) => {
  const { date } = req.body;
  // console.log(req.body);
  // Check if date is provided
  if (!date) {
    throw new ApiError(400, "Date is required");
  }

  // Create a new Date object from the provided date string
  const startDate = new Date(date);
  if (isNaN(startDate.getTime())) {
    throw new ApiError(
      400,
      "Invalid date format. Please provide a valid date."
    );
  }

  // Set endDate to the start of the next day
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);

  // Fetch appointments for the given date range (all day)
  const appointments = await Appointment.find({
    date: { $gte: startDate, $lt: endDate },
  })
    .populate("doctorId", "name email specialization")
    .populate("patientId", "name email");

  // Check if any appointments were found
  if (!appointments || appointments.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No appointments found for this date", []));
  }

  // Return the appointments including status
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Appointments fetched successfully", appointments)
    );
});

const ChangeAppointmentStausCompleted = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(400, "Id is required");
  }
  const updatedAppointment =  await Appointment.findByIdAndUpdate(
    id,
    { status: "completed" },
    { new: true }
  );
  if (!updatedAppointment) {
    throw new ApiError(404, "Appointment not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Appointment status changed to active",
        updatedAppointment
      )
    );
});
 const ChangeAppointmentStausActive = AsyncHandler(async(req, res)=>{
     const { id}= req.body;
     if (!id) {
       throw new ApiError(400, "Id is required");
     }
     const updatedAppointment = await Appointment.findByIdAndUpdate(
       id,
       { status: "pending" },
       { new: true }
     );
     if (!updatedAppointment) {
       throw new ApiError(404, "Appointment not found");
     }
       res.status(200).json(new ApiResponse( 200, "Reschedule Appointment", updatedAppointment))
 });
   
    const rejectAppointment = AsyncHandler( async (req, res) => {
        const { id } = req.body;
        if (!id) {
          throw new ApiError(400, "Id is required");
        }
        const updatedAppointment = await Appointment.findByIdAndUpdate(
          id,
          { status: "rejected" },
          { new: true }
        );
        if (!updatedAppointment) {
          throw new ApiError(404, "Appointment not found");
        }
        res
         .status(200)
         .json(
            new ApiResponse(
              200,
              "Appointment status changed to rejected",
              updatedAppointment
            )
          );
      });
      const DeleteAppointment = AsyncHandler(async (req, res) => {
        const { id } = req.body;
        if (!id) {
          throw new ApiError(400, "Id is required");
        }
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
          throw new ApiError(404, "Appointment not found");
        }
        res.status(200).json(new ApiResponse(200, "Appointment deleted", deletedAppointment));
      });

export {
  getAllAppointments,
  createAppointment,
  getAllAppointmentbyUserId,
  getAllAppointmentsByDate,
  ChangeAppointmentStausCompleted,
  ChangeAppointmentStausActive,
  rejectAppointment,
  DeleteAppointment,
};
