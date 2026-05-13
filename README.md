# Atomcamp Smart LMS – Features & Functionality

## Overview 
Atomcamp Smart LMS is a full‑stack web application that uses **Claude AI** to personalise the learning experience. It assesses a learner’s background, goals, and commitment level, then recommends the most suitable courses, provides an AI study assistant (AtomBot), and gives instructors real‑time analytics and intervention suggestions.

---
## Live Demo : https://atomcamp-lms.vercel.app/
## Core Features

### 1. AI Skill Assessment
- **5 adaptive questions** covering:
  - Educational/professional background
  - Programming familiarity
  - Primary goal (job, automation, product building, exploration)
  - Weekly available study hours
  - Preferred domain (ML, BI, automation, AI agents)
- Answers are sent to Claude AI, which generates a personalised learner profile (JSON).

### 2. Personalised Course Recommendations
- Based on the assessment, Claude recommends:
  - **Primary course** (best match)
  - **Secondary course** (next step)
- Output includes:
  - Skill level (Beginner/Intermediate/Advanced)
  - Learner type label (e.g., “Career Explorer”)
  - Match score (%)
  - Strengths & growth areas
  - Learning velocity (Fast/Moderate/Steady)
  - Motivational insight (personalised sentence)
- Fallback logic (mock profile) works if the API call fails.

### 3. Student Dashboard
After enrolling in a course, students see:
- **Progress overview**: course completion %, average quiz score, current streak.
- **Module list**: shows locked/in‑progress status, lesson counts.
- **Weekly activity chart**: visualises study patterns.
- **AI study insights** (static examples, but can be extended with real data):
  - Best learning time recommendation
  - Weak topic reminders
  - Pace prediction
- **Skill radar**: Python, Statistics, ML Theory, Data Viz (progress bars).

### 4. AtomBot – AI Study Assistant
- Embedded chat inside each course.
- Students can ask any conceptual, coding, or debugging question.
- Claude is prompted to:
  - Be concise and encouraging
  - Use Pakistani tech industry examples
  - Keep responses under 120 words (unless more detail is requested)
- Chat history is maintained during the session.
- Pre‑filled example buttons for common queries.

### 5. Instructor Dashboard
- Mock student data (6 students) with:
  - Name, progress %, average score, risk level (low/medium/high), last active timestamp.
- **Key metrics**: enrolled count, average progress, average score, number at‑risk.
- **At‑risk student list** – highlighted with colours and detailed info.
- **AI Class Intelligence** button:
  - Sends the current class summary to Claude.
  - Returns a 3‑point actionable intervention plan (under 100 words) focused on at‑risk students.
- Helps instructors proactively support struggling learners.

---

## Technical Functionality (Backend & AI)

### Claude API Proxy
- All requests to Anthropic go through a **backend proxy** (Express locally, serverless function on Vercel).
- The frontend **never** sees the API key – it only calls `/api/claude`.
- The proxy adds the required headers (`x-api-key`, `anthropic-version`) and the model name.

### Environment Variables
- `ANTHROPIC_API_KEY` – required for both local development and production (Vercel).

### State Management (React)
- Simple `useState` for views (`welcome`, `assessment`, `analyzing`, `profile`, `dashboard`, `course`, `instructor`).
- Assessment answers stored in an object.
- Generated profile and selected course persist until the user navigates away.

### Mock Data (for demonstration)
- `COURSES` – 5 pre‑defined bootcamps with icons, duration, price, skills.
- `LESSONS` – 6 lessons in Module 1 (some marked done).
- `STUDENTS` – 6 learner records for the instructor dashboard.

> **Note:** The actual AI calls are live. The mock data is only for frontend structure when API fails or for demo mode.

---

## User Flow

1. **Welcome Page** → click “Start Your AI Assessment”.
2. **5‑question Assessment** → answers are saved locally.
3. **Analyzing View** → animated loading while Claude generates a profile.
4. **Profile View** → shows recommended courses, strengths, growth areas → click “Enroll & Start Learning”.
5. **Student Dashboard** → see progress, continue learning.
6. **Course View** → watch lessons, chat with AtomBot.
7. **Instructor Dashboard** (accessible from welcome page) → view student analytics and generate AI insights.

---

## Deployment Readiness
- **Frontend**: React + Vite – builds static files.
- **Backend**: Works locally with Express; on Vercel it becomes a serverless function (`api/claude.js`).
- **Environment variables** are injected securely on Vercel.
- **Vercel configuration** (`vercel.json`) ensures proper routing and builds.

---

## Complete Setup Guide 
## Atomcamp Smart LMS – Setup Instructions

A full‑stack AI learning platform with personalised course recommendations, an AI study assistant (AtomBot), and instructor analytics.

---

## 📦 Prerequisites

- **Node.js** 18+ (includes npm)
- **Anthropic API key** – [Get one here](https://console.anthropic.com/)
- **Git** (optional, for cloning)

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/HaiderAli-Awan/atomcamp-lms.git
cd atomcamp-lms
```

### 2. Install frontend dependencies
```bash
cd frontend
npm install
```

### 3. Set up the backend (local proxy)
From the project root, create a `backend` folder:
```bash
cd ..
mkdir backend
cd backend
npm init -y
npm install express cors dotenv
npm install -D nodemon
```

Create `backend/server.js`:
```javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.post("/api/claude", async (req, res) => {
  const { messages, system } = req.body;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages,
      system: system || "",
    }),
  });
  const data = await response.json();
  res.json({ content: data.content[0].text });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend on port ${PORT}`));
```

Create `backend/.env`:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3001
```

### 4. Run the app

**Terminal 1 – Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> The frontend proxies `/api` requests to `http://localhost:3001` (already configured in `vite.config.js`).

---


## 🔧 Environment Variables

| Variable             | Purpose                          | Required |
|----------------------|----------------------------------|----------|
| `ANTHROPIC_API_KEY`  | Claude API key for AI features   | ✅ Yes   |
| `PORT` (local only)  | Backend port (default 3001)      | ❌ No    |

---

## 📁 Project Structure (for Vercel deployment)

```
atomcamp-lms/
├── frontend/           # React + Vite app
│   ├── src/App.jsx     # All views and logic
│   └── ...
├── api/claude.js       # Serverless backend
├── vercel.json
└── README.md
```

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| `fetch failed` or API errors | Check that `ANTHROPIC_API_KEY` is correct and the backend is running. |
| Frontend can’t reach backend | Ensure backend runs on port 3001 and Vite proxy is active. |
| Vercel build fails | Verify `vercel.json` paths and that `frontend/dist` exists after `npm run build`. |
| `src refspec main does not match any` | Run `git add . && git commit -m "message"` before pushing. |

---


