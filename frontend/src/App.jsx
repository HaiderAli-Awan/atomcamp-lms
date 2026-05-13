import { useState, useRef, useEffect } from "react";

const COLORS = {
  bg: "#06101E", surface: "#0C1B2E", card: "#102236",
  border: "#1B3A58", accent: "#00C8FF", accent2: "#FF6B35",
  success: "#00E59B", warning: "#FFD166",
  text: "#D9EEF8", muted: "#5E8EAA", dim: "#305572"
};

const S = {
  app: { fontFamily: "'Plus Jakarta Sans', sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.text },
  card: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "1.5rem" },
  btn: (variant = "primary") => ({
    padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", border: "none",
    background: variant === "primary" ? COLORS.accent : variant === "ghost" ? "transparent" : COLORS.card,
    color: variant === "primary" ? "#06101E" : COLORS.text,
    border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none",
    transition: "opacity .2s", display: "inline-flex", alignItems: "center", gap: 8
  }),
  badge: (color = COLORS.accent) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: `${color}20`, color, letterSpacing: ".5px", textTransform: "uppercase"
  }),
  input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
    background: COLORS.surface, color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box" },
};

const COURSES = [
  { id: "ai-bootcamp", title: "AI Bootcamp", subtitle: "Machine Learning & Deep Learning", duration: "3 Months", price: "PKR 75,000", level: "Advanced", tag: "STEM Background", icon: "🤖", skills: ["ML", "Deep Learning", "LLMs", "Computer Vision", "GenAI"], color: COLORS.accent, start: "June 9, 2026" },
  { id: "data-analytics", title: "Data Analytics Bootcamp", subtitle: "Excel · Power BI · SQL · Python", duration: "3 Months", price: "PKR 50,000", level: "Beginner", tag: "Any Background", icon: "📊", skills: ["Excel", "Power BI", "SQL", "Python", "Automation"], color: COLORS.success, start: "June 18, 2026" },
  { id: "automation-ai", title: "Automation with AI", subtitle: "AI Tools & Workflow Automation", duration: "6 Weeks", price: "PKR 30,000", level: "Intermediate", tag: "Professionals", icon: "⚡", skills: ["n8n", "Make.com", "AI Tools", "No-Code"], color: COLORS.warning, start: "May 4, 2026" },
  { id: "agentic-ai", title: "Agentic AI Bootcamp", subtitle: "Build AI Agents & Pipelines", duration: "2 Months", price: "PKR 50,000", level: "Advanced", tag: "Technical", icon: "🧠", skills: ["LangChain", "AutoGPT", "CrewAI", "RAG"], color: "#A78BFA", start: "May 9, 2026" },
  { id: "ai-teens", title: "AI for Teens", subtitle: "AI & Python for young learners", duration: "2 Months", price: "PKR 30,000", level: "Beginner", tag: "Ages 13–18", icon: "🚀", skills: ["Python Basics", "AI Concepts", "Mini Projects"], color: COLORS.accent2, start: "June 26, 2026" },
];

const QUESTIONS = [
  { id: 1, q: "What is your educational or professional background?", opts: [{ v: "stem", l: "STEM — Engineering, CS, or Sciences" }, { v: "business", l: "Business, Finance, or Social Sciences" }, { v: "teen", l: "Still in school (under 18)" }, { v: "other", l: "Other or diverse background" }] },
  { id: 2, q: "How familiar are you with programming or coding?", opts: [{ v: "none", l: "Never written a line of code" }, { v: "basic", l: "I know the basics" }, { v: "intermediate", l: "Comfortable with Python or similar" }, { v: "advanced", l: "Experienced software developer" }] },
  { id: 3, q: "What is your primary goal right now?", opts: [{ v: "job", l: "Land a data or AI job" }, { v: "automate", l: "Automate my current work" }, { v: "build", l: "Build AI products or a startup" }, { v: "explore", l: "Explore AI out of curiosity" }] },
  { id: 4, q: "How many hours per week can you commit to learning?", opts: [{ v: "low", l: "Less than 5 hours" }, { v: "medium", l: "5 to 10 hours" }, { v: "high", l: "10 to 20 hours" }, { v: "fulltime", l: "Full-time commitment (20+ hrs)" }] },
  { id: 5, q: "Which domain excites you the most?", opts: [{ v: "ml", l: "Machine Learning & AI Research" }, { v: "bi", l: "Business Intelligence & Analytics" }, { v: "automation", l: "Automation & Productivity" }, { v: "agents", l: "AI Agents & LLM Applications" }] },
];

const LESSONS = [
  { title: "Introduction to Machine Learning", duration: "45 min", done: true, type: "video" },
  { title: "Python for Data Science", duration: "60 min", done: true, type: "lab" },
  { title: "Supervised Learning Fundamentals", duration: "50 min", done: false, type: "video" },
  { title: "Model Evaluation & Metrics", duration: "40 min", done: false, type: "quiz" },
  { title: "Neural Networks Basics", duration: "70 min", done: false, type: "video" },
  { title: "Deep Learning with PyTorch", duration: "90 min", done: false, type: "lab" },
];

const STUDENTS = [
  { name: "Ayesha Raza", progress: 87, score: 92, trend: "up", risk: "low", course: "AI Bootcamp", lastActive: "2h ago" },
  { name: "Bilal Khan", progress: 34, score: 58, trend: "down", risk: "high", course: "Data Analytics", lastActive: "3d ago" },
  { name: "Sara Ahmed", progress: 72, score: 79, trend: "up", risk: "low", course: "Agentic AI", lastActive: "1h ago" },
  { name: "Usman Tariq", progress: 48, score: 61, trend: "flat", risk: "medium", course: "AI Bootcamp", lastActive: "1d ago" },
  { name: "Fatima Malik", progress: 93, score: 97, trend: "up", risk: "low", course: "Data Analytics", lastActive: "30m ago" },
  { name: "Hassan Ali", progress: 21, score: 44, trend: "down", risk: "high", course: "Automation AI", lastActive: "5d ago" },
];

// ==================== MODIFIED callClaude (uses backend proxy) ====================
async function callClaude(messages, system = "") {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system }),
  });
  if (!res.ok) throw new Error("API request failed");
  const data = await res.json();
  return data.content;
}
// =================================================================================

// ─── WELCOME VIEW ────────────────────────────────────────────────────────────
function WelcomeView({ onStart, onInstructor }) {
  const stats = [
    { n: "10,000+", l: "Learners Trained" }, { n: "80%", l: "Job Placement" },
    { n: "70+", l: "Corporate Clients" }, { n: "45%", l: "Women Participation" }
  ];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: "#06101E", fontSize: 16 }}>ac</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18 }}>atomcamp</span>
          <span style={S.badge(COLORS.accent)}>Smart LMS</span>
        </div>
        <button style={S.btn("ghost")} onClick={onInstructor}>Instructor Dashboard →</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ ...S.badge(COLORS.accent2), marginBottom: 16, fontSize: 12 }}>🏆 Powered by Adaptive AI</div>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", fontWeight: 800, margin: "0 0 1rem", lineHeight: 1.15 }}>
          Your Learning Journey,<br />
          <span style={{ color: COLORS.accent }}>Personalized by AI</span>
        </h1>
        <p style={{ color: COLORS.muted, fontSize: "1.1rem", maxWidth: 520, margin: "0 auto 2rem", lineHeight: 1.7 }}>
          atomcamp's Smart LMS analyzes your background, goals, and learning pace to build a unique path — from first lesson to career launch.
        </p>
        <button style={{ ...S.btn("primary"), fontSize: 16, padding: "14px 36px", borderRadius: 12 }} onClick={onStart}>
          Start Your AI Assessment →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: "2.5rem" }}>
        {stats.map(s => (
          <div key={s.n} style={{ ...S.card, textAlign: "center", padding: "1.25rem 1rem" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: COLORS.accent }}>{s.n}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { icon: "🎯", t: "AI Skill Assessment", d: "5-question diagnostic that maps your knowledge and goals to the perfect course." },
          { icon: "🧭", t: "Adaptive Learning Path", d: "Your curriculum adjusts in real-time based on your quiz scores and progress velocity." },
          { icon: "🤖", t: "AI Study Assistant", d: "AtomBot — an always-on tutor that explains concepts, reviews code, and keeps you motivated." },
        ].map(f => (
          <div key={f.t} style={S.card}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.t}</div>
            <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{f.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ASSESSMENT VIEW ─────────────────────────────────────────────────────────
function AssessmentView({ onDone }) {
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const q = QUESTIONS[qi];
  const pct = Math.round((qi / QUESTIONS.length) * 100);

  const pick = (v) => {
    setSelected(v);
    const a = { ...answers, [q.id]: v };
    setAnswers(a);
    setTimeout(() => {
      setSelected(null);
      if (qi < QUESTIONS.length - 1) setQi(qi + 1);
      else onDone(a);
    }, 350);
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.5rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: "#06101E", fontSize: 16 }}>ac</div>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>AI Assessment</span>
        <span style={{ ...S.badge(COLORS.muted), marginLeft: "auto" }}>Question {qi + 1} of {QUESTIONS.length}</span>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>
          <span>Progress</span><span>{pct}%</span>
        </div>
        <div style={{ height: 4, background: COLORS.border, borderRadius: 4 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: COLORS.accent, borderRadius: 4, transition: "width .4s" }} />
        </div>
      </div>

      <div style={{ ...S.card, marginBottom: "1.5rem" }}>
        <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 10 }}>QUESTION {qi + 1}</div>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>{q.q}</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.opts.map(o => (
          <button key={o.v} onClick={() => pick(o.v)} style={{
            padding: "1rem 1.25rem", borderRadius: 12, border: `1px solid ${selected === o.v ? COLORS.accent : COLORS.border}`,
            background: selected === o.v ? `${COLORS.accent}15` : COLORS.card, color: COLORS.text,
            fontSize: 15, textAlign: "left", cursor: "pointer", transition: "all .2s", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${selected === o.v ? COLORS.accent : COLORS.border}`, flexShrink: 0, background: selected === o.v ? COLORS.accent : "transparent" }} />
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ANALYZING VIEW ───────────────────────────────────────────────────────────
function AnalyzingView() {
  const [step, setStep] = useState(0);
  const steps = ["Parsing your learning profile…", "Mapping to course pathways…", "Calculating skill alignment…", "Generating personalized recommendations…"];
  useEffect(() => { const t = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 900); return () => clearInterval(t); }, []);
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", border: `3px solid ${COLORS.border}`, borderTop: `3px solid ${COLORS.accent}`, margin: "0 auto 2rem", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, marginBottom: 12 }}>AI is analyzing your profile</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: i <= step ? `${COLORS.accent}10` : COLORS.card, border: `1px solid ${i <= step ? `${COLORS.accent}40` : COLORS.border}`, transition: "all .4s" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: i <= step ? COLORS.accent : COLORS.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#06101E", fontWeight: 700, flexShrink: 0 }}>{i < step ? "✓" : i === step ? "…" : ""}</div>
            <span style={{ fontSize: 13, color: i <= step ? COLORS.text : COLORS.muted }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
function ProfileView({ profile, onEnroll, onBack }) {
  const primary = COURSES.find(c => c.id === profile?.primary_course) || COURSES[0];
  const secondary = COURSES.find(c => c.id === profile?.secondary_course) || COURSES[1];
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <button style={{ ...S.btn("ghost"), marginBottom: "1.5rem", fontSize: 13 }} onClick={onBack}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "2rem" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${COLORS.accent}20`, border: `2px solid ${COLORS.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🎓</div>
        <div>
          <div style={S.badge(COLORS.accent2)}>Your AI Profile</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, margin: "4px 0 0", fontSize: "1.6rem" }}>
            {profile?.learner_type || "Career Explorer"} · <span style={{ color: COLORS.accent }}>{profile?.skill_level || "Intermediate"}</span>
          </h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { l: "Match Score", v: `${profile?.match_score || 88}%`, c: COLORS.success },
          { l: "Learning Velocity", v: profile?.learning_velocity || "Moderate", c: COLORS.accent },
          { l: "Predicted Outcome", v: "Job-Ready in 3mo", c: COLORS.accent2 },
        ].map(s => (
          <div key={s.l} style={{ ...S.card, padding: "1rem" }}>
            <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 4 }}>{s.l.toUpperCase()}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.4rem", color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.card, marginBottom: "1.5rem", borderLeft: `3px solid ${COLORS.accent}`, borderRadius: "0 16px 16px 0" }}>
        <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 6 }}>AI INSIGHT</div>
        <p style={{ margin: 0, lineHeight: 1.7 }}>{profile?.motivational_insight || "Your background and goals align strongly with a career in AI. Consistent practice will be your greatest advantage."}</p>
      </div>

      <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Your Recommended Learning Path</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: "1.5rem" }}>
        {[{ c: primary, label: "PRIMARY", match: profile?.match_score || 88 }, { c: secondary, label: "NEXT STEP", match: 74 }].map(({ c, label, match }) => (
          <div key={c.id} style={{ ...S.card, borderColor: label === "PRIMARY" ? `${c.color}60` : COLORS.border }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={S.badge(label === "PRIMARY" ? c.color : COLORS.muted)}>{label}</span>
              <span style={{ fontSize: 12, color: COLORS.muted }}>{match}% match</span>
            </div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 10 }}>{c.duration} · {c.price}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {c.skills.slice(0, 3).map(s => <span key={s} style={{ ...S.badge(COLORS.dim), fontSize: 10 }}>{s}</span>)}
            </div>
            {label === "PRIMARY" && <button style={{ ...S.btn("primary"), width: "100%", marginTop: 14, justifyContent: "center" }} onClick={() => onEnroll(c)}>Enroll & Start Learning →</button>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={S.card}>
          <div style={{ color: COLORS.success, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>✦ YOUR STRENGTHS</div>
          {(profile?.strengths || ["Analytical thinking", "Career clarity", "Domain curiosity"]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
              <span style={{ color: COLORS.success }}>✓</span> {s}
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ color: COLORS.accent2, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>▲ GROWTH AREAS</div>
          {(profile?.growth_areas || ["Technical depth", "Portfolio projects"]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
              <span style={{ color: COLORS.accent2 }}>→</span> {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ profile, activeCourse, onOpenCourse, onBack }) {
  const c = activeCourse || COURSES[0];
  const modules = [
    { title: "Python & ML Foundations", lessons: 8, done: 5, status: "in-progress" },
    { title: "Supervised Learning", lessons: 6, done: 0, status: "locked" },
    { title: "Deep Learning", lessons: 10, done: 0, status: "locked" },
    { title: "LLMs & GenAI", lessons: 8, done: 0, status: "locked" },
  ];
  const weekData = [40, 65, 55, 80, 70, 90, 85];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: "#06101E", fontSize: 16 }}>ac</div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>Student Dashboard</div>
            <div style={{ color: COLORS.muted, fontSize: 12 }}>{profile?.learner_type || "Career Explorer"}</div>
          </div>
        </div>
        <button style={S.btn("ghost")} onClick={onBack}>← Profile</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
            {[{ l: "Course Progress", v: "35%", sub: "14/40 lessons", c: COLORS.accent }, { l: "Avg Quiz Score", v: "78%", sub: "+12% this week", c: COLORS.success }, { l: "Streak", v: "7 Days", sub: "Keep it up!", c: COLORS.warning }].map(s => (
              <div key={s.l} style={{ ...S.card, padding: "1rem" }}>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>{s.l.toUpperCase()}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.6rem", color: s.c, margin: "4px 0 2px" }}>{s.v}</div>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ ...S.card, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.icon} {c.title}</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{c.duration} · Starts {c.start}</div>
              </div>
              <button style={S.btn("primary")} onClick={onOpenCourse}>Continue Learning →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {modules.map((m, i) => {
                const pct = m.lessons > 0 ? Math.round((m.done / m.lessons) * 100) : 0;
                return (
                  <div key={m.title} style={{ padding: "12px 14px", borderRadius: 10, background: COLORS.surface, border: `1px solid ${m.status === "in-progress" ? `${COLORS.accent}40` : COLORS.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        <span style={{ color: m.status === "locked" ? COLORS.muted : COLORS.text }}>{i + 1}. {m.title}</span>
                        {m.status === "in-progress" && <span style={{ ...S.badge(COLORS.accent), marginLeft: 8, fontSize: 9 }}>IN PROGRESS</span>}
                        {m.status === "locked" && <span style={{ ...S.badge(COLORS.dim), marginLeft: 8, fontSize: 9 }}>LOCKED</span>}
                      </div>
                      <span style={{ fontSize: 12, color: COLORS.muted }}>{m.done}/{m.lessons}</span>
                    </div>
                    <div style={{ height: 3, background: COLORS.border, borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: m.status === "in-progress" ? COLORS.accent : COLORS.border, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 13 }}>WEEKLY ACTIVITY</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
              {weekData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", height: `${v}%`, background: i === 6 ? COLORS.accent : `${COLORS.accent}40`, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                  <div style={{ fontSize: 9, color: COLORS.muted }}>{days[i]}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>AI STUDY INSIGHTS</div>
            {[
              { icon: "💡", text: "You learn best in the evenings — schedule deep work then." },
              { icon: "⚠️", text: "Quiz scores dip in supervised learning topics — revisit Week 3." },
              { icon: "🚀", text: "At your pace, you'll finish 2 weeks ahead of schedule." },
            ].map(i => (
              <div key={i.text} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 14 }}>{i.icon}</span>
                <span style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>{i.text}</span>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>SKILL RADAR</div>
            {[{ s: "Python", v: 70 }, { s: "Statistics", v: 55 }, { s: "ML Theory", v: 40 }, { s: "Data Viz", v: 80 }].map(x => (
              <div key={x.s} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: COLORS.muted }}>{x.s}</span><span style={{ color: COLORS.accent }}>{x.v}%</span>
                </div>
                <div style={{ height: 3, background: COLORS.border, borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${x.v}%`, background: `linear-gradient(90deg,${COLORS.accent},${COLORS.success})`, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COURSE VIEW ─────────────────────────────────────────────────────────────
function CourseView({ activeCourse, onBack }) {
  const c = activeCourse || COURSES[0];
  const [selLesson, setSelLesson] = useState(2);
  const [chat, setChat] = useState([
    { role: "assistant", content: `Hi! I'm AtomBot 🤖 — your AI study assistant for **${c.title}**. Ask me anything about this lesson, concepts, or your code. I'm here to help!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chat]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput(""); setLoading(true);
    const msgs = [...chat, { role: "user", content: msg }];
    setChat(msgs);
    try {
      const reply = await callClaude(
        msgs.map(m => ({ role: m.role, content: m.content })),
        `You are AtomBot, the AI Study Assistant inside atomcamp's ${c.title} course. Help students understand AI, ML, and data science concepts clearly. Be concise, encouraging, and use Pakistani tech industry examples when relevant. Keep responses under 120 words unless asked for more detail.`
      );
      setChat([...msgs, { role: "assistant", content: reply }]);
    } catch { setChat([...msgs, { role: "assistant", content: "Connection issue — please try again!" }]); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem", height: "calc(100vh - 40px)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
        <button style={{ ...S.btn("ghost"), padding: "6px 12px", fontSize: 12 }} onClick={onBack}>← Dashboard</button>
        <span style={{ fontWeight: 700 }}>{c.icon} {c.title}</span>
        <span style={{ ...S.badge(c.color), marginLeft: 4 }}>{c.level}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 320px", gap: 14, flex: 1, minHeight: 0 }}>
        <div style={{ ...S.card, padding: "1rem", overflowY: "auto" }}>
          <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, marginBottom: 10 }}>MODULE 1: FOUNDATIONS</div>
          {LESSONS.map((l, i) => (
            <div key={i} onClick={() => setSelLesson(i)} style={{
              padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 6,
              background: selLesson === i ? `${COLORS.accent}15` : "transparent",
              border: `1px solid ${selLesson === i ? `${COLORS.accent}40` : "transparent"}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: l.done ? COLORS.success : selLesson === i ? COLORS.accent : COLORS.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#06101E", fontWeight: 700, flexShrink: 0 }}>{l.done ? "✓" : i + 1}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: l.done ? COLORS.muted : COLORS.text, lineHeight: 1.3 }}>{l.title}</div>
                  <div style={{ fontSize: 10, color: COLORS.dim }}>{l.duration} · {l.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...S.card, overflowY: "auto" }}>
          <div style={{ marginBottom: 16 }}>
            <span style={S.badge(COURSES[0].color)}>{LESSONS[selLesson]?.type?.toUpperCase()}</span>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, margin: "8px 0 4px", fontSize: "1.4rem" }}>{LESSONS[selLesson]?.title}</h2>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>{LESSONS[selLesson]?.duration} · Module 1</div>
          </div>
          <div style={{ background: COLORS.surface, borderRadius: 12, padding: "3rem", textAlign: "center", marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>▶</div>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>Video Lesson Player</div>
            <div style={{ color: COLORS.dim, fontSize: 11, marginTop: 4 }}>{LESSONS[selLesson]?.duration}</div>
          </div>
          <div style={{ padding: "1rem", background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>LESSON OVERVIEW</div>
            <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              In this lesson, you'll understand the core concepts behind <strong style={{ color: COLORS.text }}>{LESSONS[selLesson]?.title}</strong>. We'll walk through theory with practical Python examples, building intuition before diving into implementation. By the end, you'll be able to apply these techniques to real datasets.
            </p>
          </div>
        </div>

        <div style={{ ...S.card, display: "flex", flexDirection: "column", padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${COLORS.accent}20`, border: `1px solid ${COLORS.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>AtomBot</div>
              <div style={{ fontSize: 10, color: COLORS.success }}>● Online · Powered by Claude AI</div>
            </div>
          </div>

          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12, minHeight: 0, maxHeight: 400 }}>
            {chat.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8 }}>
                {m.role === "assistant" && <div style={{ width: 24, height: 24, borderRadius: 6, background: `${COLORS.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🤖</div>}
                <div style={{ maxWidth: "82%", padding: "8px 10px", borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: m.role === "user" ? `${COLORS.accent}20` : COLORS.surface, border: `1px solid ${m.role === "user" ? `${COLORS.accent}30` : COLORS.border}`, fontSize: 12, lineHeight: 1.6 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: `${COLORS.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🤖</div>
                <div style={{ padding: "8px 12px", borderRadius: "12px 12px 12px 4px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, fontSize: 12 }}>
                  <span style={{ color: COLORS.muted }}>Thinking…</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask AtomBot anything…" style={{ ...S.input, flex: 1 }} />
            <button onClick={send} disabled={loading} style={{ ...S.btn("primary"), padding: "10px 14px", flexShrink: 0 }}>→</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
            {["Explain this concept", "Show me Python code", "I'm confused about…"].map(t => (
              <button key={t} onClick={() => { setInput(t); }} style={{ ...S.btn("ghost"), padding: "4px 8px", fontSize: 10, borderRadius: 6 }}>{t}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INSTRUCTOR VIEW ──────────────────────────────────────────────────────────
function InstructorView({ onBack }) {
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const riskColors = { low: COLORS.success, medium: COLORS.warning, high: COLORS.accent2 };
  const atRisk = STUDENTS.filter(s => s.risk !== "low");

  const getInsight = async () => {
    setLoadingInsight(true);
    const summary = STUDENTS.map(s => `${s.name}: ${s.progress}% progress, ${s.score}% score, ${s.risk} risk, last active ${s.lastActive}`).join("\n");
    try {
      const reply = await callClaude([{
        role: "user",
        content: `You are an AI learning analytics engine for atomcamp. Here is the current class data:\n${summary}\n\nProvide a concise 3-point action plan for the instructor (under 100 words total). Focus on at-risk students and intervention strategies. Be specific and actionable.`
      }]);
      setAiInsight(reply);
    } catch { setAiInsight("Unable to generate insight. Please try again."); }
    setLoadingInsight(false);
  };

  const avgProgress = Math.round(STUDENTS.reduce((a, s) => a + s.progress, 0) / STUDENTS.length);
  const avgScore = Math.round(STUDENTS.reduce((a, s) => a + s.score, 0) / STUDENTS.length);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.accent2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: "#06101E", fontSize: 16 }}>ac</div>
            <div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>Instructor Dashboard</div>
              <div style={{ color: COLORS.muted, fontSize: 12 }}>AI Bootcamp — Cohort Spring 2026</div>
            </div>
          </div>
        </div>
        <button style={S.btn("ghost")} onClick={onBack}>← Home</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: "1.5rem" }}>
        {[{ l: "Enrolled", v: STUDENTS.length, c: COLORS.accent }, { l: "Avg Progress", v: `${avgProgress}%`, c: COLORS.success }, { l: "Avg Score", v: `${avgScore}%`, c: COLORS.warning }, { l: "At Risk", v: atRisk.length, c: COLORS.accent2 }].map(s => (
          <div key={s.l} style={{ ...S.card, padding: "1rem", borderTop: `3px solid ${s.c}` }}>
            <div style={{ color: COLORS.muted, fontSize: 11 }}>{s.l.toUpperCase()}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 14 }}>Student Progress Overview</div>
          {STUDENTS.map(s => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: riskColors[s.risk] }} />
                  <span>{s.name}</span>
                </div>
                <span style={{ color: COLORS.muted }}>{s.progress}%</span>
              </div>
              <div style={{ height: 4, background: COLORS.border, borderRadius: 4 }}>
                <div style={{ height: "100%", width: `${s.progress}%`, background: s.progress > 70 ? COLORS.success : s.progress > 40 ? COLORS.warning : COLORS.accent2, borderRadius: 4, transition: "width .5s" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 14 }}>⚠ At-Risk Students</div>
          {atRisk.map(s => (
            <div key={s.name} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 8, background: COLORS.surface, border: `1px solid ${s.risk === "high" ? `${COLORS.accent2}40` : `${COLORS.warning}40`}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>{s.course} · Last seen {s.lastActive}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={S.badge(riskColors[s.risk])}>{s.risk} risk</span>
                  <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Score: {s.score}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...S.card, borderColor: `${COLORS.accent}40` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700 }}>🤖 AI Class Intelligence</div>
            <div style={{ color: COLORS.muted, fontSize: 12 }}>Powered by Claude — real-time intervention recommendations</div>
          </div>
          <button style={S.btn("primary")} onClick={getInsight} disabled={loadingInsight}>
            {loadingInsight ? "Analyzing…" : "Generate AI Insight"}
          </button>
        </div>
        {aiInsight ? (
          <div style={{ background: COLORS.surface, borderRadius: 10, padding: "1rem", border: `1px solid ${COLORS.border}`, fontSize: 13, lineHeight: 1.8, color: COLORS.text, whiteSpace: "pre-wrap" }}>
            {aiInsight}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "1.5rem", color: COLORS.muted, fontSize: 13, background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
            Click "Generate AI Insight" to get real-time intervention strategies for your class
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("welcome");
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);

  const handleAssessmentDone = async (ans) => {
    setAnswers(ans);
    setView("analyzing");
    try {
      const prompt = `You are an expert learning advisor for atomcamp, a Pakistani AI/Data Science education platform.

Learner assessment answers:
- Background: ${ans[1]}
- Programming level: ${ans[2]}
- Career goal: ${ans[3]}
- Weekly hours: ${ans[4]}
- Domain interest: ${ans[5]}

Available courses: ai-bootcamp (STEM/advanced), data-analytics (any background/beginner), automation-ai (professionals/intermediate), agentic-ai (technical/advanced), ai-teens (age 13-18/beginner)

Respond ONLY with valid JSON (no backticks, no preamble):
{"skill_level":"Beginner|Intermediate|Advanced","learner_type":"2-3 word label","primary_course":"course-id","secondary_course":"course-id","match_score":92,"strengths":["s1","s2","s3"],"growth_areas":["a1","a2"],"learning_velocity":"Fast|Moderate|Steady","motivational_insight":"2 personalized sentences","predicted_outcome":"short phrase","risk_flags":["r1","r2"]}`;

      const text = await callClaude([{ role: "user", content: prompt }]);
      const clean = text.replace(/```json|```/g, "").trim();
      setProfile(JSON.parse(clean));
    } catch {
      setProfile({ skill_level: "Intermediate", learner_type: "Career Explorer", primary_course: ans[1] === "stem" ? "ai-bootcamp" : "data-analytics", secondary_course: "automation-ai", match_score: 88, strengths: ["Goal clarity", "Domain curiosity", "Motivation"], growth_areas: ["Technical depth", "Project portfolio"], learning_velocity: "Moderate", motivational_insight: "Your background and drive put you in an excellent position. Consistent daily practice will accelerate your growth faster than you expect.", predicted_outcome: "Job-ready AI practitioner", risk_flags: ["Consistency", "Network building"] });
    }
    setView("profile");
  };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap" rel="stylesheet" />
      {view === "welcome" && <WelcomeView onStart={() => setView("assessment")} onInstructor={() => setView("instructor")} />}
      {view === "assessment" && <AssessmentView onDone={handleAssessmentDone} />}
      {view === "analyzing" && <AnalyzingView />}
      {view === "profile" && <ProfileView profile={profile} onEnroll={(c) => { setActiveCourse(c); setView("dashboard"); }} onBack={() => setView("welcome")} />}
      {view === "dashboard" && <DashboardView profile={profile} activeCourse={activeCourse} onOpenCourse={() => setView("course")} onBack={() => setView("profile")} />}
      {view === "course" && <CourseView activeCourse={activeCourse} onBack={() => setView("dashboard")} />}
      {view === "instructor" && <InstructorView onBack={() => setView("welcome")} />}
    </div>
  );
}