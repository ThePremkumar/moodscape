import { useState, useEffect } from "react";
import { fetchMoods, deleteMood } from "../api";
import MoodCard from "./MoodCard";

export default function Timeline() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const data = await fetchMoods();
      setMoods(data);
    } catch (err) {
      console.error("Failed to load moods:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMood(id);
      setMoods((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete mood:", err);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="page-header">
          <h1>Your MoodScape Timeline</h1>
          <p>Loading your emotional journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" id="timeline-page">
      <div className="page-header">
        <h1>Your MoodScape Timeline</h1>
        <p>A mosaic of your emotional journey 🌌</p>
      </div>

      {moods.length === 0 ? (
        <div className="timeline-empty">
          <div className="empty-emoji">🌙</div>
          <p>No moods captured yet. Go create your first MoodScape!</p>
        </div>
      ) : (
        <div className="timeline">
          {moods.map((entry, index) => (
            <div key={entry.id} style={{ animationDelay: `${index * 80}ms` }}>
              <MoodCard entry={entry} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
