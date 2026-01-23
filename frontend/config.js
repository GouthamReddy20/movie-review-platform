// frontend/config.js (FINAL FIXED)

// Default Local
let BASE_URL = "http://localhost:5000";

// If hosted (not localhost), use Render backend
if (
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  BASE_URL = "https://movie-review-backend-ul0y.onrender.com";
}

const API_BASE = `${BASE_URL}/api`;

console.log("✅ BASE_URL:", BASE_URL);
console.log("✅ API_BASE:", API_BASE);
