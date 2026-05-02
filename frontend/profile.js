// profile.js
// Improved API handling and error management
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast " + type;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showToast("Logged out successfully!", "success");
  setTimeout(() => { window.location.href = "login.html"; }, 1000);
});

async function loadProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Failed to load profile", "error");
      return;
    }

    const user = data.user;
    const stats = data.stats;
    const activity = data.activity || [];

    // Header initials
    const initials = user.name
      ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
      : "U";
    document.getElementById("headerProfilePic").textContent = initials;

    // Profile name
    document.querySelector(".username").textContent = user.name || "User";
    document.querySelector(".user-tagline").textContent = user.email || "";

    // Stats
    document.getElementById("statWatched").textContent = stats.favorites || 0; // using favorites instead of watched
    document.getElementById("statReviews").textContent = stats.reviewsWritten || 0;
    document.getElementById("statWatchlist").textContent = stats.watchlist || 0;

    // About
    document.getElementById("profileAbout").textContent =
      "Welcome to your MovieReview profile 🎬";

    // Activity
    const activityList = document.getElementById("activityList");
    activityList.innerHTML = "";

    if (!activity.length) {
      activityList.innerHTML = "<li>No recent activity found.</li>";
    } else {
      activity.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.detail;
        activityList.appendChild(li);
      });
    }

  } catch (err) {
    console.error(err);
    showToast("Server not reachable ❌", "error");
  }
}

window.addEventListener("DOMContentLoaded", loadProfile);
