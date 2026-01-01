const Hostel = require("../models/Hostel");
const RoomType = require("../models/RoomType");

// GET /api/hostels?city=Hyderabad&gender=girls&amenity=wifi&minPrice=4000&maxPrice=8000&sharing=double&sort=priceLow
exports.listHostels = async (req, res) => {
  try {
    const {
      city,
      gender,
      amenity,
      minPrice,
      maxPrice,
      sharing,
      sort,
    } = req.query;

    const hostelQuery = {};
    if (city) hostelQuery.city = city;
    if (gender && gender !== "any") hostelQuery.gender = gender;
    if (amenity) hostelQuery.amenities = amenity;
    hostelQuery.isActive = true;

    // For now, fetch hostels and room types separately, then combine in Node side.
    const hostels = await Hostel.find(hostelQuery).lean();

    const hostelIds = hostels.map((h) => h._id);
    const roomQuery = { hostelId: { $in: hostelIds } };
    if (sharing && sharing !== "any") roomQuery.sharing = sharing;

    const rooms = await RoomType.find(roomQuery).lean();

    // Combine rooms with hostels and also apply price filter/sort
    const byHostel = {};
    rooms.forEach((r) => {
      if (!byHostel[r.hostelId]) byHostel[r.hostelId] = [];
      byHostel[r.hostelId].push(r);
    });

    let result = hostels
      .map((h) => {
        const rList = byHostel[h._id] || [];
        if (!rList.length) return null;

        const prices = rList.map((r) => r.pricePerMonth);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        return {
          id: h._id,
          name: h.name,
          city: h.city,
          area: h.area,
          gender: h.gender,
          distanceKm: h.distanceKmFromCollege,
          amenities: h.amenities,
          rating: h.ratingAvg,
          tag: h.tags?.[0] || "",
          minPrice: min,
          maxPrice: max,
        };
      })
      .filter(Boolean);

    // Apply price filters on combined data
    const minP = parseInt(minPrice || "0", 10);
    const maxP = parseInt(maxPrice || "0", 10);
    if (minP) result = result.filter((h) => h.minPrice >= minP);
    if (maxP) result = result.filter((h) => h.maxPrice <= maxP);

    // Sort
    if (sort === "priceLow") {
      result.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sort === "priceHigh") {
      result.sort((a, b) => b.minPrice - a.minPrice);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "distance") {
      result.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json(result);
  } catch (err) {
    console.error("listHostels error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/hostels.controller.js
exports.getHostelById = async (req, res) => {
  try {
    const hostelId = req.params.id;
    const hostel = await Hostel.findById(hostelId).lean();
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    res.json({
      id: hostel._id,
      name: hostel.name,
      city: hostel.city,
      area: hostel.area,
      gender: hostel.gender,
      distanceKm: hostel.distanceKmFromCollege,
      amenities: hostel.amenities,
      rating: hostel.ratingAvg
      // later you can also attach room types
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
