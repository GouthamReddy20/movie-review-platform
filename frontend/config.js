// config.js (Final working)

// ✅ Automatically switch backend based on environment
let BASE_URL = "http://localhost:5000";

if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
  // ✅ deployed environment
  BASE_URL = "https://movie-review-platform-ni74.onrender.com";
}

const API_BASE = `${BASE_URL}/api`;

console.log("✅ BASE_URL:", BASE_URL);
console.log("✅ API_BASE:", API_BASE);
