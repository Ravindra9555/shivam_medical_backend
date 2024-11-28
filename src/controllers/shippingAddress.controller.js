// import { AsyncHandler } from "../utils/AsyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { UserShippingAddress } from "../models/userShippingAddress.model.js";
// import { User } from "../models/user.model.js";
// const addAddress = AsyncHandler(async (req, res) => {
//   const {
//     userId,
//     fullName,
//     email,
//     address,
//     streetAddress,
//     landmarksAndApartments,
//     city,
//     state,
//     zipCode,
//   } = req.body;
//   // Check if all required fields are present|

//   console.log(req.body);
//   if (
//     !userId ||
//     !fullName ||
//     !email ||
//     !address ||
//     !city ||
//     !state ||
//     !zipCode
//   ) {
//     throw new ApiError(400, "All fields are required");
//   }
// //    check if user exits 
//   const userExists = await User.findById(userId);
//   if (!userExists) {
//     throw new ApiError(404, "User not found");
//   }

//   // Perform database operations here
//   const Savedaddress = await UserShippingAddress.create({
//     userId,
//     fullName,
//     email,
//     address,
//     streetAddress,
//     landmarksAndApartments,
//     city,
//     state,
//     zipCode,
//   });
//   if (!Savedaddress) {
//     throw new ApiError(500, "Failed to add address");
//   }

//   res
//     .status(201)
//     .json(new ApiResponse(201, "Address added successfully", Savedaddress));
// });
// const getAddress = AsyncHandler(async (req, res) => {
//   const { userId } = req.body;
//   if (!userId) {
//     throw new ApiError(400, "User ID is required");
//   }
//   const findAddress = await UserShippingAddress.findOne({ userId });
//   if (!findAddress) {
//     throw new ApiError(404, "No address found for this user");
//   }
//   res
//     .status(200)
//     .json(new ApiResponse(200, "Address fetched successfully", findAddress));
// });
// const updateAddress = AsyncHandler(async (req, res) => {
//   const {
//     userId,
//     fullName,
//     email,
//     address,
//     streetAddress,
//     landmarksAndApartments,
//     city,
//     state,
//     zipCode,
//   } = req.body;
//   if (!userId) {
//     throw new ApiError(400, "User ID is required");
//   }
//   const findAddress = await UserShippingAddress.findOneAndUpdate(
//     { userId },
//     {
//       fullName,
//       email,
//       address,
//       streetAddress,
//       landmarksAndApartments,
//       city,
//       state,
//       zipCode,
//     },
//     { new: true }
//   );
//   if (!findAddress) {
//     throw new ApiError(404, "No address found for this user");
//   }
//   res
//     .status(200)
//     .json(new ApiResponse(200, "Address updated successfully", findAddress));
// });
// const deleteAddress = AsyncHandler(async (req, res) => {
//   const { userId } = req.body;
//   if (!userId) {
//     throw new ApiError(400, "User ID is required");
//   }
//   const findAddress = await UserShippingAddress.findOneAndDelete({ userId });
//   if (!findAddress) {
//     throw new ApiError(404, "No address found for this user");
//   }
//   res.status(200).json(new ApiResponse(200, "Address deleted successfully"));
// });
// export { addAddress, getAddress, updateAddress, deleteAddress };

import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"; // Import the User model
import mongoose from "mongoose";
import {UserShippingAddress } from "../models/userShippingAddress.model.js"  
// Add address
const addAddress = AsyncHandler(async (req, res) => {
  const {
    userId, // This should be an ObjectId (or string representing an ObjectId)
    fullName,
    email,
    phone,
    address,
    streetAddress,
    landmarksAndApartments,
    city,
    state,
    zipCode,
  } = req.body;

  // Ensure userId is provided and it's a valid ObjectId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Valid userId is required");
  }

  // Ensure all required fields for address are provided
  if (
    !fullName ||
    !email ||
    !address ||
    !city ||
    !state ||
    !zipCode
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Create new UserShippingAddress document
  const savedAddress = await UserShippingAddress.create({
    userId,  // Associate address with the user
    fullName,
    email,
    phone,
    address,
    streetAddress,
    landmarksAndApartments,
    city,
    state,
    zipCode,
  });

  if (!savedAddress) {
    throw new ApiError(500, "Failed to add address");
  }

  // Update the User document to associate the new shipping address
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        shippingAddress: savedAddress._id, // Store the ObjectId of the saved address
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(500, "Failed to associate address with user");
  }

  res.status(201).json(new ApiResponse(201, "Address added and linked successfully", savedAddress));
});
// Get address
const getAddress = AsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Fetch the user and populate the shipping address
  const user = await User.findById(userId);

  if (!user || !user.shippingAddress) {
    throw new ApiError(404, "No address found for this user");
  }
  const userWithAddress = await User.findById(userId).populate("shippingAddress");
  res
    .status(200)
    .json(new ApiResponse(200, "Address fetched successfully", userWithAddress));
});

// Update address
const updateAddress = AsyncHandler(async (req, res) => {
  const {
    addressId,
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

  // Validate that userId and addressId are provided
  if (!userId || !addressId) {
    throw new ApiError(400, "User ID and Address ID are required");
  }

  // Check if the address exists and update it
  const updatedAddress = await UserShippingAddress.findByIdAndUpdate(
    addressId,  // Use addressId to find the document to update
    {
      userId,  // You can also update the userId if needed
      fullName,
      email,
      address,
      streetAddress,
      landmarksAndApartments,
      city,
      state,
      zipCode,
    },
    { new: true }  // Ensures that the updated document is returned
  );

  // If no address is found or updated
  if (!updatedAddress) {
    throw new ApiError(404, "Address not found or update failed");
  }

  res.status(200).json(new ApiResponse(200, "Address updated successfully", updatedAddress));
});


// Delete address
const deleteAddress = AsyncHandler(async (req, res) => {
  const { addressId } = req.body;

  if (!addressId) {
    throw new ApiError(400, "Address ID is required");
  }

  // Remove the shipping address directly from the User model
  const updatedUser = await UserShippingAddress.findByIdAndDelete(addressId);

  if (!updatedUser) {
    throw new ApiError(404, "No address found for this user");
  }

  res.status(200).json(new ApiResponse(200, "Address deleted successfully"));
});

export { addAddress, getAddress, updateAddress, deleteAddress };
