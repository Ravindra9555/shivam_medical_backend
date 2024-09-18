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
export { RegisterUser };
