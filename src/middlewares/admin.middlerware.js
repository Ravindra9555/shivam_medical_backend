import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";

const verifyAdmin = async (req, res, next) => {
  // Check authorization token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Ensure the decoded role is "admin"
    if (decoded.role !== "admin") {
      return next(new ApiError(403, "Access denied. Admins only."));
    }

    // Attach the admin data to the request object
    req.admin = decoded;

    // Check if the admin exists in the database and is active
    const admin = await Admin.findById(req.admin.id);
    if (!admin || !admin.isActive) {
      return next(new ApiError(403, "Access denied. Admin is inactive."));
    }

    // Continue to the next middleware or route
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid token."));
  }
};

export { verifyAdmin };
