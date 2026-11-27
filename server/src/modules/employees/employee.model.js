import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    // Auth hashes with bcryptjs before saving; this model does not hash again.
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    phone: { type: String, required: true, trim: true },
    // Request validation checks dates in YYYY-MM-DD format.
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    joinDate: { type: String, default: null },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["employee", "admin"],
      default: "employee",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "active", "rejected", "disabled"],
      default: "pending",
    },
    // Private file metadata; the API supplies an authorized image URL separately.
    profilePhoto: {
      type: { storageKey: String, mimeType: String, sizeBytes: Number },
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Auth can read the hash with Employee.findOne(...).select('+passwordHash').
// After selecting it, Auth must return only public fields in its response.
export const Employee = mongoose.model("Employee", employeeSchema);
