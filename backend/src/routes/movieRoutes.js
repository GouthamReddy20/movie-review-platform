const express = require("express");
const router = express.Router();
const {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

const authenticateToken = require("../middleware/authMiddleware");
const db = require("../config/db");

// -------------------------
// Movie CRUD
// -------------------------
router.get("/", getMovies); // GET all movies
router.get("/:id", getMovieById); // GET movie by ID
router.post("/", authenticateToken, addMovie); // POST add movie (auth required)
router.put("/:id", authenticateToken, updateMovie); // PUT update movie (auth required)
router.delete("/:id", authenticateToken, deleteMovie); // DELETE movie (auth required)

// -------------------------
// Watchlist / Favorites
// -------------------------

// ✅ Add to favorites / watchlist (Postgres)
router.post("/:id/favorite", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.id;

    // Check if already exists
    const existing = await db.query(
      "SELECT id FROM favorites WHERE user_id = $1 AND movie_id = $2",
      [userId, movieId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Already in watchlist" });
    }

    await db.query(
      "INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2)",
      [userId, movieId]
    );

    res.json({ message: "Added to watchlist" });
  } catch (err) {
    console.error("❌ favorites add error:", err);
    res.status(500).json({ error: "Failed to add to watchlist", details: err.message });
  }
});

// ✅ Remove from favorites / watchlist (Postgres)
router.delete("/:id/favorite", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.id;

    const result = await db.query(
      "DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2",
      [userId, movieId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Not found in watchlist" });
    }

    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    console.error("❌ favorites delete error:", err);
    res.status(500).json({ error: "Failed to remove from watchlist", details: err.message });
  }
});

module.exports = router;
