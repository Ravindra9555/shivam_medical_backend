import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserShippingAddress } from "../models/userShippingAddress.model.js";
import { User } from "../models/user.model.js";
const addAddress = AsyncHandler(async (req, res) => {
  const {
    userId,
    fullName,
    email,
    address,
    streetAddress,
    landmarksAndApartments,
    city,
    state,
    zipCode,
  } = req.body;
  // Check if all required fields are present|

  console.log(req.body);
  if (
    !userId ||
    !fullName ||
    !email ||
    !address ||
    !city ||
    !state ||
    !zipCode
  ) {
    throw new ApiError(400, "All fields are required");
  }
//    check if user exits 
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Perform database operations here
  const Savedaddress = await UserShippingAddress.create({
    userId,
    fullName,
    email,
    address,
    streetAddress,
    landmarksAndApartments,
    city,
    state,
    zipCode,
  });
  if (!Savedaddress) {
    throw new ApiError(500, "Failed to add address");
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Address added successfully", Savedaddress));
});
const getAddress = AsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const findAddress = await UserShippingAddress.findOne({ userId });
  if (!findAddress) {
    throw new ApiError(404, "No address found for this user");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Address fetched successfully", findAddress));
});
const updateAddress = AsyncHandler(async (req, res) => {
  const {
    userId,
    fullName,
    email,
    address,
    streetAddress,
    landmarksAndApartments,
    city,
    state,
    zipCode,
  } = req.body;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const findAddress = await UserShippingAddress.findOneAndUpdate(
    { userId },
    {
      fullName,
      email,
      address,
      streetAddress,
      landmarksAndApartments,
      city,
      state,
      zipCode,
    },
    { new: true }
  );
  if (!findAddress) {
    throw new ApiError(404, "No address found for this user");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Address updated successfully", findAddress));
});
const deleteAddress = AsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const findAddress = await UserShippingAddress.findOneAndDelete({ userId });
  if (!findAddress) {
    throw new ApiError(404, "No address found for this user");
  }
  res.status(200).json(new ApiResponse(200, "Address deleted successfully"));
});
export { addAddress, getAddress, updateAddress, deleteAddress };
