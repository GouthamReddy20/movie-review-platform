const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/contactController");
// Optimized route handling for better performance
// -------------------------
// Contact Form Submission
// -------------------------
router.post("/", submitContact);  // POST /api/contact

module.exports = router;
