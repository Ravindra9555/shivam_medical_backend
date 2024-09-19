import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { cloudinayUpload } from "../utils/cloudnary.js";

const RegisterUser = AsyncHandler(async (req, res) => {
  const { email, password, profilePic, name, role } = req.body;
  if (!email || !password || !name || !role) {
    throw new ApiError(400, "All fields are required");
  }
  // Perform database operations here
  const user = await User.findOne({ email: email });
  if (user) {
    throw new ApiError(400, "Email already exists");
  }
  const imgPath = req.file?.path;
  let imgUrl;
  if (imgPath) {
    const urlReseult = await cloudinayUpload(imgPath);
    imgUrl = urlReseult?.url;
  }

  const newUser = new User({
    email: email,
    password: password,
    profilePic: imgUrl,
    name: name,
    role: role,
  });

  const registeredUser = await newUser.save();
  // check  user is created or not
  if (!registeredUser) {
    throw new ApiError(500, "Failed to register user");
  }
  const createdUser = await User.findById(registeredUser._id).select(
    "-password -isActive"
  );

  // Return the response with user data  with status 201 (Created)  and success message
  res.json(new ApiResponse(201, "User registered successfully", createdUser));
});

// Login User
const LoginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
   // Compare the provided password with the hashed password in the database
   const isPasswordValid = await user.isPasswordMatched(password);
   if (!isPasswordValid) {
     throw new ApiError(401, "Invalid Password");
   }
 
  const access_token = user.generateAccessToken();
  const refresh_token = user.generateRefreshToken();
  const logedInuser = await User.findById(user._id).select("-password");

  res.status(200).json(
    new ApiResponse(
      200,
      "User logged in successfully",
      { access_token, refresh_token, user: logedInuser }
    )
  );
  
});

export { RegisterUser, LoginUser };
