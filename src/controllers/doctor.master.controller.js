 import { DoctorMaster } from "../models/doctor.master.model.js";
 import { ApiError } from "../utils/ApiError.js";
 import { ApiResponse } from "../utils/ApiResponse.js";
 import { AsyncHandler } from "../utils/AsyncHandler.js";
 import { cloudinayUpload } from "../utils/cloudnary.js";

 const generateDoctorId = (name) => {
   
   const initials = name.split(0,2);
   // Generate a random 4-digit number
   const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
   // Combine the prefix, initials, and random number to form the ID
   return `${initials}-${randomNum}`;
 };
 
 const addDoctor = AsyncHandler(async (req, res) => {

   const { name, specialization, email,phone} = req.body;

//    console.log(req.body); // Log the incoming body to debug
//    console.log(req.file); // Log the incoming file to debug
 
 
   // Check for required fields
   if (!name || !specialization || !email || !phone) {
     throw new ApiError(400, "All fields are required");
   }
 
   // Check if email already exists
   const existingDoctor = await DoctorMaster.findOne({ email });
   if (existingDoctor) {
     throw new ApiError(400, "Email already exists");
   }
 
   // Handle profile picture upload (if any)
   let imageUrl = "";
   if (req.file?.path) {
     try {
       const uploadResponse = await cloudinayUpload(req.file.path);
       imageUrl = uploadResponse.url;
     } catch (error) {
       throw new ApiError(500, "Error uploading profile picture");
     }
   }
 
   // Generate a readable and memorable doctor ID
   const doctorId = generateDoctorId(name);
 
   // Create new doctor
   const newDoctor = new DoctorMaster({
     doctorId,
     name,
     specialization,
     email,
     phone,
     profilePic: imageUrl,
   });
 
   // Save the new doctor to the database
   await newDoctor.save();
 
   // Return success response
   return res.status(201).json(new ApiResponse(201,  "Doctor added successfully", newDoctor));
 });
 
   const getAllDoctors =  AsyncHandler(async(req, res)=>{
    // get all Doctor 
     const allDoctor = await DoctorMaster.find({});
      if(!allDoctor){
        throw new ApiError(404, "no docotor found");

      }
 
     res.status(200).json( new ApiResponse(200, "here is total doctor", allDoctor));

   })

   const deleteDoctor = AsyncHandler(async (req, res) => {
     const { id } = req.body;
     if (!id) {
       throw new ApiError(400, "Id is required");
     }
     const doctor = await DoctorMaster.findByIdAndDelete(id);
     if (!doctor) {
       throw new ApiError(404, "Doctor not found");
     }
     return res.status(200).json(new ApiResponse(200, "Doctor deleted successfully",null));
   });
  
   const makeDocotorActive = AsyncHandler(async(req, res)=>{
     const { id } = req.body;
     if (!id) {
       throw new ApiError(400, "Id is required");
     }
    //  const doctor = await DoctorMaster.findByIdAndUpdate(id, { isActive: true }, { new: true });
     const doctor = await DoctorMaster.findById(id);

     if (!doctor) {
       throw new ApiError(404, "Doctor not found");
     }
     let message;
      if(doctor.isActive) {
         doctor.isActive = false;
         message = "Doctor made inactive successfully";
      }
      else{
        doctor.isActive = true;
        message = "Doctor made active successfully";
      }
      const activeDoctor = await doctor.save({new: true});
      res.status(200).json(new ApiResponse(200,message, activeDoctor));
   })
   

 export {addDoctor, getAllDoctors, deleteDoctor, makeDocotorActive};
