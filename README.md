# 🚀 Tech Stack

- **Backend:** Node.js (Express.js)
- **Database:** TursoDB (SQLite-based cloud DB)
- **Authentication:** JWT (HTTP-only cookies)
- **Frontend:** (To be integrated - React or Vanilla JS)
- **Security:** bcrypt, JWT
- **Other:** REST API architecture

# ⚙️ Setup Instructions

## 1. Clone repository
```bash
git clone https://github.com/LamprosKoukoulis/CookBook/
cd CookBook
```

---

## 2. Install dependencies
```bash
npm install
```

---

## 3. Create environment file

Create a `.env` file:

```env
PORT=3000

JWT_SECRET=your_super_secret_key

TURSO_DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_auth_token
```

---

## 4. Run server

```bash
node server.js
```

or with nodemon:

```bash
npx nodemon server.js
```

---

# 🔐 Authentication Flow

1. User logs in
2. Server generates JWT token
3. Token stored in **HTTP-only cookie**
4. Automatically persists across refresh
5. Middleware validates user session

---

# 🧠 Adaptive Learning Logic

The system dynamically adjusts learning paths:

- Based on quiz scores
- Based on time spent per module
- Based on completion rates

Future enhancements:
- AI-based recommendation engine
- Personalized difficulty scaling

---

# 🏆 Hall of Fame System

Users are ranked based on:

- Total study time
- Engagement with modules
- Activity frequency

Displayed on homepage as leaderboard.

---
# 🎯 Project Goals

This project aims to simulate a **real-world Learning Management System (LMS)** with:

- 📚 Structured learning modules
- 🧪 Interactive quizzes
- 📊 User progress tracking
- ⏱️ Session/time tracking
- 🧠 Adaptive learning logic
- 🏆 Gamification (Hall of Fame)

---

# 🧩 Core Features

## 👤 User System
- Registration / Login
- Secure authentication (JWT cookies)
- Semester-based classification

## 📖 Learning System
- Courses → Modules → Lessons
- Educational content per module
- Difficulty levels per topic

## 🧪 Quiz System
- Multiple questions per module
- Instant scoring
- Answer tracking per user

## 📊 Progress Tracking
- Completion percentage per module
- Score history
- Last accessed modules

## 🧠 Adaptive Learning
- Performance-based recommendations:
  - < 60% → revision required
  - 60–80% → normal progression
  - > 80% → advanced content unlocked

## ⏱️ Session Tracking
- Time spent per module
- Activity logging

## 🏆 Hall of Fame
- Ranking based on total study time
- Leaderboard of most active learners

---
