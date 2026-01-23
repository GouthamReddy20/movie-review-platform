// backend/src/controllers/contactController.js
const db = require("../config/db");

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Insert into Supabase Postgres
    await db.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    return res.status(200).json({ message: "Message sent successfully ✅" });
  } catch (err) {
    console.error("❌ Contact Insert Error:", err);
    return res.status(500).json({
      error: "Failed to save message to database",
      details: err.message,
    });
  }
};
