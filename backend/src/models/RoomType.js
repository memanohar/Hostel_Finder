const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    label: { type: String, required: true }, // "2-sharing · Non-AC"
    sharing: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true,
    },
    ac: { type: Boolean, default: false },
    pricePerMonth: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    totalBeds: { type: Number, required: true },
    occupiedBeds: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["available", "waitlist"],
      default: "available",
    },
    meta: {
      floor: String,
      notes: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomType", roomTypeSchema);
