import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { cloudinayUpload } from "../utils/cloudnary.js";
import { sendResetLink } from "../utils/send.email.js";
import jwt from "jsonwebtoken";
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
  console.log(req.body);
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
  } // Generate tokens
  const access_token = user.generateAccessToken();
  const refresh_token = user.generateRefreshToken();

  // Assign the refresh token to the user and save it
  user.refreshToken = refresh_token;
  await user.save();

  // Remove sensitive fields from the user object
  const sanitizedUser = await User.findById(user._id).select("-password");

  // Respond with tokens and user data
  res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      access_token,
      refresh_token,
      user: sanitizedUser,
    })
  );
});

//  controller for  reset  link

const resetLink = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  // find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  try {
    // generate reset link
    const resetToken = user.generateAccessToken();

    // save reset token to refresh token
    user.refreshToken = resetToken;
    await user.save();

    // Generate reset link and send it to user email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    // send email with reset link
    await sendResetLink(email, resetUrl);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Reset link sent to your email , Please check your email !"
        )
      );
    // send reset link to user email
  } catch (error) {
    console.error(`Error sending reset link: ${error.message}`);
    throw new ApiError(500, "Failed to send reset link");
  }
});

const changePassword = AsyncHandler(async (req, res) => {
  const { password, resetToken } = req.body;
  console.log(req.body);
  // Check if email and resetToken are provided
  if (!password || !resetToken) {
    throw new ApiError(400, "Password and resetToken are required");
  }
  // Decode the user information using the reset token (use separate secret)
  let decodedUser;
  try {
    decodedUser = jwt.verify(resetToken, process.env.ACCESS_TOKEN_SECRET); // Use a separate secret for reset tokens
  } catch (error) {
    throw new ApiError(400, "Invalid or expired resetToken");
  }
  const email = decodedUser.email;
  // Find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //  check for same refresh token
  if (user.refreshToken !== resetToken) {
    throw new ApiError(400, "Invalid or expired resetToken");
  }

  // Change the password and save it
  user.password = password;
  user.refreshToken = "";
  await user.save();

  // Return success response

  res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", null));
});

const getAlluser = AsyncHandler(async (req, res) => {
  const AllUser = await User.find();
  if (!AllUser) {
    throw new ApiError(404, " No User Found ");
  }
  res.status(200).json(new ApiResponse(200, "All User", AllUser));
});

const makeUserInactive = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.isActive = false;
  const inactiveUser = await user.save(
    { new: true } // Return the updated document
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, "User made inactive successfully", inactiveUser)
    );
});

const makeUserActive = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.isActive = true;
  const activeUser = await user.save(
    { new: true } // Return the updated document
  );
  res
    .status(200)
    .json(new ApiResponse(200, "User made active successfully", activeUser));
});

const deleteUser = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    throw new ApiError(404, "User not found");
  }
  const user = await User.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, "User deleted successfully", null));
});
export { RegisterUser, LoginUser, resetLink, changePassword, getAlluser,makeUserActive, makeUserInactive ,deleteUser };
