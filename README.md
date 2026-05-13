# Atomcamp Smart LMS – Features & Functionality

## Overview
Atomcamp Smart LMS is a full‑stack web application that uses **Claude AI** to personalise the learning experience. It assesses a learner’s background, goals, and commitment level, then recommends the most suitable courses, provides an AI study assistant (AtomBot), and gives instructors real‑time analytics and intervention suggestions.

---

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

## Future Enhancements (Suggestions)
- Real database (PostgreSQL/MongoDB) for user accounts, progress persistence, and chat history.
- Authentication (login/register for students and instructors).
- Live video player integration (YouTube/Vimeo).
- Real student analytics (not mock data) using a backend.
- More detailed skill radar based on actual quiz results.

---


