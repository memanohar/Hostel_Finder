const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "owner", "admin"],
      default: "student",
    },
    phone: { type: String },
    college: { type: String }, // mainly for students
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
