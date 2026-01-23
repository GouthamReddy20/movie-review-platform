// backend/src/controllers/reviewController.js
const db = require("../config/db");

// -------------------------
// Add Review
// -------------------------
exports.addReview = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { movie_id, rating, comment } = req.body;

    if (!movie_id || !rating) {
      return res.status(400).json({ error: "movie_id and rating are required" });
    }

    const result = await db.query(
      "INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id",
      [user_id, movie_id, rating, comment || null]
    );

    res.status(201).json({
      message: "Review added successfully",
      reviewId: result.rows[0].id,
    });
  } catch (err) {
    console.error("❌ addReview error:", err);
    res.status(500).json({ error: "Failed to add review", details: err.message });
  }
};

// -------------------------
// Get Reviews by Movie
// -------------------------
exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const result = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.movie_id = $1
       ORDER BY r.created_at DESC`,
      [movieId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ getReviewsByMovie error:", err);
    res.status(500).json({ error: "Failed to fetch reviews", details: err.message });
  }
};

// -------------------------
// Update Review
// -------------------------
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const result = await db.query(
      "UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3",
      [rating, comment || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review updated successfully" });
  } catch (err) {
    console.error("❌ updateReview error:", err);
    res.status(500).json({ error: "Failed to update review", details: err.message });
  }
};

// -------------------------
// Delete Review
// -------------------------
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("DELETE FROM reviews WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ deleteReview error:", err);
    res.status(500).json({ error: "Failed to delete review", details: err.message });
  }
};
