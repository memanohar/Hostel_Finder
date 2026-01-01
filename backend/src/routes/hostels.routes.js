const express = require("express");
const router = express.Router();
const hostelsController = require("../controllers/hostels.controller");

// Public list endpoint for hostel-list.html
router.get("/", hostelsController.listHostels);
// routes/hostels.routes.js
router.get("/:id", hostelsController.getHostelById);

module.exports = router;
