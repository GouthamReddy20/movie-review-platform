// backend/src/controllers/movieController.js
const db = require("../config/db");

// ✅ Get all movies
exports.getMovies = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM movies ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ getMovies error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("SELECT * FROM movies WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ getMovieById error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add new movie
exports.addMovie = async (req, res) => {
  try {
    const { title, description, release_year } = req.body;

    if (!title || !description || !release_year) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await db.query(
      "INSERT INTO movies (title, description, release_year) VALUES ($1, $2, $3) RETURNING id",
      [title, description, release_year]
    );

    res.status(201).json({
      message: "Movie added successfully",
      movieId: result.rows[0].id,
    });
  } catch (err) {
    console.error("❌ addMovie error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update movie
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, release_year } = req.body;

    if (!title || !description || !release_year) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await db.query(
      "UPDATE movies SET title = $1, description = $2, release_year = $3 WHERE id = $4",
      [title, description, release_year, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ message: "Movie updated successfully" });
  } catch (err) {
    console.error("❌ updateMovie error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete movie
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("DELETE FROM movies WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("❌ deleteMovie error:", err);
    res.status(500).json({ error: err.message });
  }
};
