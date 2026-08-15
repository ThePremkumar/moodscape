import { useState } from "react";
import { createMood } from "../api";

const MOODS = [
  { key: "happy", emoji: "😊", name: "Happy", desc: "Warm golden sunshine" },
  { key: "calm", emoji: "😌", name: "Calm", desc: "Tranquil ocean waves" },
  { key: "energetic", emoji: "⚡", name: "Energetic", desc: "Electric sparks of energy" },
  { key: "sad", emoji: "😢", name: "Sad", desc: "Gentle rain on a quiet evening" },
  { key: "anxious", emoji: "😰", name: "Anxious", desc: "Flickering embers seeking stillness" },
  { key: "creative", emoji: "🎨", name: "Creative", desc: "Aurora of imagination" },
];

const MOOD_GRADIENTS = {
  happy: "linear-gradient(135deg, #FFD93D, #FF6B6B, #FFA94D)",
  calm: "linear-gradient(135deg, #74B9FF, #A29BFE, #81ECEC)",
  energetic: "linear-gradient(135deg, #FD79A8, #FDCB6E, #E17055)",
  sad: "linear-gradient(135deg, #636E72, #2D3436, #6C5CE7)",
  anxious: "linear-gradient(135deg, #E17055, #D63031, #FDCB6E)",
  creative: "linear-gradient(135deg, #A29BFE, #FD79A8, #00CEC9)",
};

export default function MoodSelector({ onMoodCreated }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const entry = await createMood(selectedMood, note);
      onMoodCreated(entry);
      setSelectedMood(null);
      setNote("");
    } catch (err) {
      console.error("Failed to create mood:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="mood-selector-section">
      <div className="page-header">
        <h1>How are you feeling?</h1>
        <p>Select your mood and let it become art ✨</p>
      </div>

      <div className="mood-selector">
        {MOODS.map((mood, index) => (
          <button
            key={mood.key}
            id={`mood-${mood.key}`}
            className={`mood-option stagger-${index + 1} ${
              selectedMood === mood.key ? "selected" : ""
            }`}
            onClick={() => setSelectedMood(mood.key)}
          >
            <style>{`
              #mood-${mood.key}::before {
                background: ${MOOD_GRADIENTS[mood.key]};
              }
            `}</style>
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.name}</span>
            <span className="mood-desc">{mood.desc}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="note-section" style={{ animation: "cardSlideIn 400ms ease forwards" }}>
          <textarea
            id="mood-note-input"
            className="note-input"
            placeholder="Add a note about how you're feeling... (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>
      )}

      <button
        id="submit-mood-btn"
        className="submit-btn"
        onClick={handleSubmit}
        disabled={!selectedMood || isSubmitting}
      >
        {isSubmitting ? "Creating your MoodScape..." : "✨ Create MoodScape"}
      </button>
    </div>
  );
}
