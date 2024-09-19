import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin"] },
    isActive: { type: Boolean, default: true },
    profilePic: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving the admin
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;  // 'this' refers to the document instance
  this.password = await bcrypt.hash(this.password, 10);  // Hash password with bcrypt
});

// Method to compare entered password with the stored hashed password
adminSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token
adminSchema.methods.generateAccessToken = function () {
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// Generate refresh token
adminSchema.methods.generateRefreshToken = function () {
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const Admin = mongoose.model("Admin", adminSchema);
