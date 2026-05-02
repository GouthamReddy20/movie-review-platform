# 🎬 Movie Review Platform

## 📌 Overview

This project is a full-stack movie review web application that allows users to explore movies, view details, and share reviews. It integrates with the TMDB API to fetch real-time movie data and uses Supabase for backend services including authentication and database management.

The platform provides a seamless experience for users to discover trending movies, view detailed information, and interact with the system through reviews and authentication features.

---

## 🚀 Features

### 🔐 User Authentication

* Secure user signup and login using Supabase authentication
* Session management for logged-in users

### 🎥 Browse Movies

* Fetch movies dynamically using TMDB API
* View trending and popular movies

### 📄 Movie Details

* Detailed movie pages with:

  * Title, description, rating
  * Release date and poster
  * Cast and additional info (if implemented)

### ⭐ Reviews System

* Users can add reviews for movies
* View reviews submitted by other users

### 📱 Responsive UI

* Fully responsive design for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend

* Html
* JavaScript
* CSS

### Backend / Database

* Supabase (PostgreSQL, Authentication, APIs)

### APIs

* TMDB API (for movie data)

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/GouthamReddy20/movie-review-platform-supabase.git
```

### 2️⃣ Install Dependencies

Navigate to frontend folder:

```bash
cd frontend
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the frontend folder and add:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### 4️⃣ Run the Project

Start frontend:

```bash
npm run dev
```

Backend is handled by Supabase (no separate server required)

---

## 📸 Screenshots

### 🏠 Home Page

<img width="356" height="201" alt="image" src="https://github.com/user-attachments/assets/7cef566d-fe97-499a-bfb4-9e04b982afda" />


### 🎬 User Profile Page

<img width="344" height="209" alt="image" src="https://github.com/user-attachments/assets/b0ab82bc-b38b-43cc-928d-4064e2b24364" />


### ⭐ Reviews Section

<img width="347" height="209" alt="image" src="https://github.com/user-attachments/assets/5025a14c-506f-4834-955f-b67c77b6667c" />


---

## 🧠 Project Highlights

* Built a **full-stack application** using modern technologies
* Integrated **third-party API (TMDB)** for dynamic data
* Implemented **authentication and database using Supabase**
* Designed **responsive UI for better user experience**

---

## 📦 Folder Structure

```
movie-review-platform/
│
├── frontend/
├── backend/
├── screenshots/
└── README.md
```

---

## 🔮 Future Improvements

* Enhancing the UI
* BUilding the Mobile Based Application

---

## 👨‍💻 Author

**C S Goutham Reddy**
