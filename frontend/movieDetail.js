// movieDetails.js

// -------------------
// Elements
// -------------------
const backdrop = document.getElementById("backdrop");
const poster = document.getElementById("poster");
const titleEl = document.querySelector(".title");
const taglineEl = document.querySelector(".tagline");
const overviewEl = document.querySelector(".overview");
const runtimeEl = document.querySelector(".runtime");
const releaseEl = document.querySelector(".release-date");
const ratingEl = document.querySelector(".rating");
const genresEl = document.querySelector(".genres");
const watchlistBtn = document.getElementById("watchlistBtn");
const toast = document.getElementById("toast");
const reviewForm = document.getElementById("reviewForm");
const reviewInput = document.getElementById("reviewInput");
const reviewsContainer = document.getElementById("reviewsContainer");

// -------------------
// Config
// -------------------
const movieData = JSON.parse(sessionStorage.getItem("selectedMovie") || localStorage.getItem("selectedMovie"));
const token = localStorage.getItem("token");

// ✅ must load from config.js
// config.js must define API_BASE
console.log("✅ API_BASE in movieDetails.js:", API_BASE);

// -------------------
// Toast
// -------------------
function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

// -------------------
// Render movie details
// -------------------
function renderMovieDetails(data) {
  backdrop.src = data.backdrop || "";
  poster.src = data.poster || "";
  titleEl.textContent = data.title || "";
  taglineEl.textContent = data.tagline || "";
  overviewEl.textContent = data.overview || "No overview available";
  runtimeEl.textContent = `⏱ ${data.runtime || "N/A"} min`;
  releaseEl.textContent = `📅 ${data.release_date || "N/A"}`;
  ratingEl.textContent = `⭐ ${data.vote_average || "N/A"}`;
  genresEl.innerHTML = (data.genres || []).map(g => `<span>${g}</span>`).join(" ");
}

// -------------------
// Load TMDB movie details (FULL)
// -------------------
async function loadMovieDetails(movieId) {
  try {
    const res = await fetch(`${API_BASE}/tmdb/movie/${movieId}`);
    if (!res.ok) throw new Error("Failed to fetch movie details");
    const data = await res.json();

    // Merge with stored movieData info
    renderMovieDetails({
      ...movieData,
      ...data,
    });

  } catch (err) {
    console.error(err);
    showToast("Failed to load movie details", "error");
  }
}

// -------------------
// Watchlist toggle
// -------------------
async function toggleWatchlist() {
  if (!token) return showToast("Login required", "error");

  try {
    const res = await fetch(`${API_BASE}/movies/${movieData.id}/favorite`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Added to Watchlist!", "success");
      return;
    }

    // already exists → remove
    if (res.status === 400 && data.message === "Already in watchlist") {
      const removeRes = await fetch(`${API_BASE}/movies/${movieData.id}/favorite`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const removeData = await removeRes.json();
      if (removeRes.ok) showToast("Removed from Watchlist", "success");
      else showToast(removeData.error || "Failed to remove", "error");
      return;
    }

    showToast(data.error || "Failed to update Watchlist", "error");
  } catch (err) {
    console.error(err);
    showToast("Failed to update Watchlist", "error");
  }
}

watchlistBtn?.addEventListener("click", toggleWatchlist);

// -------------------
// Load reviews
// -------------------
async function loadReviews() {
  try {
    const res = await fetch(`${API_BASE}/reviews/${movieData.id}`);
    const reviews = await res.json();

    if (!Array.isArray(reviews)) {
      reviewsContainer.innerHTML = "<p>No reviews found.</p>";
      return;
    }

    reviewsContainer.innerHTML = reviews.map(r => `
      <div class="review-card">
        <strong>${r.user_name || "User"}</strong>: ${r.comment || ""} ⭐ ${r.rating || 0}
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
    reviewsContainer.innerHTML = "<p>Failed to load reviews.</p>";
  }
}

// -------------------
// Add review
// -------------------
reviewForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const content = reviewInput.value.trim();
  if (!content) return;

  if (!token) return showToast("Login required", "error");

  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        movie_id: movieData.id,
        rating: 5,
        comment: content
      })
    });

    const data = await res.json();

    if (res.ok) {
      reviewInput.value = "";
      showToast("Review added!", "success");
      loadReviews();
    } else {
      showToast(data.error || "Failed to add review", "error");
    }

  } catch (err) {
    console.error(err);
    showToast("Failed to add review", "error");
  }
});

// -------------------
// Initialize
// -------------------
if (movieData && movieData.id) {
  renderMovieDetails(movieData);
  loadMovieDetails(movieData.id); // ✅ fetch full details from TMDB route
  loadReviews();
} else {
  showToast("No movie selected!", "error");
}
