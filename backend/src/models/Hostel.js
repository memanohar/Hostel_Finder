const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    distanceKmFromCollege: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["girls", "boys", "coed"],
      required: true,
    },
    amenities: [{ type: String }], // e.g. ["wifi","meals","laundry","ac","study","security"]
    ratingAvg: { type: Number, default: 4.5 },
    ratingCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
