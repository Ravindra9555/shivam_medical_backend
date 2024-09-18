import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import cloudinayUpload from "../utils/cloudnary.js";

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
    imgUrl = await cloudinayUpload(imgPath);
  }

  const newUser = new User({
    email: email,
    password: password,
    profilePic: imgUrl,
    name: name,
    role: role,
  });

  await newUser.save();
  res.json(new ApiResponse(201, "User registered successfully", newUser));
});
export { RegisterUser };
