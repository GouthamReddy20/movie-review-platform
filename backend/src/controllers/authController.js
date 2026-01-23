// backend/src/controllers/authController.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // ✅ Check if user exists
    const existingUsers = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUsers.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ DB error (register):", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // ✅ Get user
    const result = await db.query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ DB error (login):", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const userResults = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResults.rows[0];

    // NOTE: your reviews table uses "comment", not "review"
    const reviews = await db.query(
      `SELECT r.comment, r.rating, m.title AS movie_title
       FROM reviews r
       JOIN movies m ON r.movie_id = m.id
       WHERE r.user_id = $1`,
      [userId]
    );

    const favorites = await db.query(
      `SELECT m.title, m.poster
       FROM favorites f
       JOIN movies m ON f.movie_id = m.id
       WHERE f.user_id = $1`,
      [userId]
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      reviews: reviews.rows,
      favorites: favorites.rows,
    });
  } catch (err) {
    console.error("❌ DB error (getDashboard):", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
