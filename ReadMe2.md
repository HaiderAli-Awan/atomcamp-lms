Here is a **clean, setup‑focused README** that explains how to get the project running locally and deploy it to Vercel.

```markdown
# atomcamp Smart LMS – Setup Instructions

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

## ☁️ Deploy to Vercel

### 1. Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/HaiderAli-Awan/atomcamp-lms.git
git push -u origin main
```

### 2. Add serverless function
Create `api/claude.js` in the project root (same logic as `backend/server.js` but using Vercel’s `handler`).  
*(See the full file in the repository.)*

### 3. Add `vercel.json` in the project root
```json
{
  "functions": { "api/*.js": { "runtime": "nodejs18.x" } },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/frontend/$1" }
  ],
  "builds": [
    { "src": "frontend/**", "use": "@vercel/static-build" },
    { "src": "api/**", "use": "@vercel/node" }
  ],
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist"
}
```

### 4. Deploy on Vercel
- Go to [vercel.com](https://vercel.com) → **Add New → Project** → Import your GitHub repo.
- Add environment variable: `ANTHROPIC_API_KEY` (your key).
- Click **Deploy**.

Your app will be live at `https://atomcamp-lms.vercel.app`

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

## 📄 License

MIT © [Haider Ali Awan](https://github.com/HaiderAli-Awan)
```

This README focuses solely on **setup and deployment** – no extra feature descriptions. It’s ready to be copied into your `README.md` file.
