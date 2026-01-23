// backend/src/config/db.js
require("dotenv").config();
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL missing in .env");
  process.exit(1);
}

// ✅ Supabase Postgres Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

// ✅ Test connection on startup
pool.query("SELECT NOW()")
  .then(() => console.log("✅ Connected to Supabase Postgres database!"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

module.exports = pool;

