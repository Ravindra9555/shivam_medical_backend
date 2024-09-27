import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { cloudinayUpload } from "../utils/cloudnary.js";

// Register Admin
const RegisterAdmin = AsyncHandler(async (req, res) => {
  const { name, email, password, role, profilePic } = req.body;
  //  console.log(req.body)
  // Check for required fields
  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if admin with the same email already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new ApiError(400, "Admin with the same email already exists");
  }

  // Handle profile picture upload (if any)
  const ImgPath = req.file?.path;
  let imgUrl = "";
  if (ImgPath) {
    const uploadResponse = await cloudinayUpload(ImgPath);
    imgUrl = uploadResponse.url;
  }

  // Create new admin
  const newAdmin = await Admin.create({
    name,
    email,
    password,
    role,
    profilePic: imgUrl,
  });

  if (!newAdmin) {
    throw new ApiError(500, "Admin not created");
  }

  // Return the newly created admin, excluding the password field
  const createdAdmin = await Admin.findById(newAdmin._id).select("-password");
  
  res.status(201).json(new ApiResponse(201, "Admin created successfully", createdAdmin));
});

// Login Admin
const LoginAdmin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for required fields
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Find admin by email
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // Check if password is correct
  const isPasswordValid = await admin.isPasswordMatched(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // Generate access and refresh tokens
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  // Exclude the password from the returned admin data
  const loggedInAdmin = await Admin.findById(admin._id).select("-password");

  res.status(200).json(new ApiResponse(200, "Admin login successful", {
    accessToken,
    refreshToken,
    admin: loggedInAdmin,
  }));
});

// Get all Admin users
const GetAllAdminUsers = AsyncHandler(async (req, res) => {
  const admins = await Admin.find({});
  res.status(200).json(new ApiResponse(200, "All Admins", admins));
});

// Make admin inactive
const makeAdminInactive = AsyncHandler(async (req, res) => {
  const { id } = req.body;

  // Check if ID is provided
  const isAdmin = await Admin.findById(id);
  if (!isAdmin) {
      throw new ApiError(404, "Admin not found");
  }
  isAdmin.isActive = false;
  await isAdmin.save();
  res.status(200).json(new ApiResponse(200, "Admin made inactive successfully", isAdmin));
});

// Make admin active
const makeAdminActive = AsyncHandler(async (req, res) => {
  const { id } = req.body;

  // Check if ID is provided
  const isAdmin = await Admin.findById(id);
  if (!isAdmin) {
      throw new ApiError(404, "Admin not found");
  }
  isAdmin.isActive = true;
  await isAdmin.save();
  res.status(200).json(new ApiResponse(200, "Admin made active successfully", isAdmin)); // Corrected message
});

 // delete the admin
 const deleteAdmin = AsyncHandler(async (req, res) => {
    const { id } = req.body;
    // Check if ID is provided
    const isAdmin = await Admin.findById(id);
    if (!isAdmin) {
      throw new ApiError(404, "Admin not found");
    }
  
    // Use findByIdAndDelete to remove the admin
    await Admin.findByIdAndDelete(id);
  
    res.status(200).json(new ApiResponse(200, "Admin deleted successfully", isAdmin));
  });

  
  
export { RegisterAdmin, LoginAdmin, GetAllAdminUsers , makeAdminInactive,makeAdminActive,deleteAdmin};
