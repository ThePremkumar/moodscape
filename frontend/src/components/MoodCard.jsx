export default function MoodCard({ entry, onDelete }) {
  const { id, mood, note, quote, palette, created_at } = entry;

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mood-card" id={`mood-card-${id}`}>
      <div
        className="mood-card-gradient"
        style={{ background: palette.bg_gradient }}
      >
        <button
          className="mood-card-delete"
          onClick={() => onDelete(id)}
          title="Delete entry"
          aria-label="Delete mood entry"
        >
          ✕
        </button>

        <div className="mood-card-content">
          <div className="mood-card-header">
            <div className="mood-card-mood">
              <span className="card-emoji">{palette.emoji}</span>
              <span className="card-mood-name">{palette.name}</span>
            </div>
            <span className="mood-card-time">{formatTime(created_at)}</span>
          </div>

          <div className="mood-card-quote">
            <p>"{quote.text}"</p>
            <span className="quote-author">- {quote.author}</span>
          </div>

          {note && <p className="mood-card-note">{note}</p>}
        </div>
      </div>
    </div>
  );
}
