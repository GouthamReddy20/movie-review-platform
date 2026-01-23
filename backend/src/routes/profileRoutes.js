// backend/src/routes/profileRoutes.js
const express = require("express");
const db = require("../config/db.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// GET /api/profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Get basic user info (based on your current users table)
    const { rows: userRows } = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (!userRows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    // ✅ Stats: watched removed (not available), use favorites + watchlist
    const { rows: statsRows } = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM reviews WHERE user_id = $1) AS "reviewsWritten",
        (SELECT COUNT(*) FROM watchlist WHERE user_id = $1) AS "watchlist",
        (SELECT COUNT(*) FROM favorites WHERE user_id = $1) AS "favorites"
      `,
      [userId]
    );

    const stats = statsRows[0];

    // ✅ Recent activity: Reviews + Watchlist
    const { rows: activityRows } = await db.query(
      `
      SELECT * FROM (
        SELECT 
          'review' AS type,
          CONCAT('Reviewed "', m.title, '" - ', r.rating, ' Stars') AS detail,
          r.created_at AS date
        FROM reviews r
        JOIN movies m ON r.movie_id = m.id
        WHERE r.user_id = $1

        UNION ALL

        SELECT 
          'watchlist' AS type,
          CONCAT('Added "', m.title, '" to Watchlist') AS detail,
          w.created_at AS date
        FROM watchlist w
        JOIN movies m ON w.movie_id = m.id
        WHERE w.user_id = $1
      ) activity
      ORDER BY date DESC
      LIMIT 10
      `,
      [userId]
    );

    res.json({
      user,
      stats,
      activity: activityRows,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
