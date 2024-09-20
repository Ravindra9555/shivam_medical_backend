import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const userAuth = async (req, res, next) => {
  // Check for authorization token
  const authHeader = req.headers.authorization; // Fixed typo
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Access denied. No token provided"));
  }

  const token = authHeader.split(" ")[1];
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Ensure the user has the "user" role
    if (decoded.role !== "user") {
      return next(
        new ApiError(403, "Access denied. Only users can access this route")
      );
    }

    // Attach the user data to the request object
    req.user = decoded;

    // Find the user in the database
    const user = await User.findById(req.user.id); // Use findById
    if (!user || !user.isActive) {
      return next(new ApiError(404, "User not found or inactive"));
    }

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token has expired"));
    } else {
      return next(new ApiError(401, "Invalid token"));
    }
  }
};

export { userAuth };
