import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import MoodSelector from "./components/MoodSelector";
import MoodCard from "./components/MoodCard";
import Timeline from "./components/Timeline";
import Analytics from "./components/Analytics";

function CreatePage() {
  const [lastEntry, setLastEntry] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleMoodCreated = (entry) => {
    setLastEntry(entry);
    setToast("MoodScape created! ✨");

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="app-container">
      <MoodSelector onMoodCreated={handleMoodCreated} />

      {lastEntry && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "1rem", textAlign: "center", color: "var(--text-secondary)" }}>
            Your Latest MoodScape
          </h2>
          <div style={{ maxWidth: "420px", margin: "0 auto" }}>
            <MoodCard
              entry={lastEntry}
              onDelete={() => setLastEntry(null)}
            />
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              className="submit-btn"
              style={{ maxWidth: "280px", margin: "0 auto", background: "var(--surface)", boxShadow: "none", border: "1px solid var(--border)" }}
              onClick={() => navigate("/timeline")}
            >
              📜 View Full Timeline
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast success" id="success-toast">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CreatePage />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}
