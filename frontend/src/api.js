// MoodScape API Client

const API_BASE = "http://localhost:8000/api";

export async function fetchMoods() {
  const res = await fetch(`${API_BASE}/moods`);
  if (!res.ok) throw new Error("Failed to fetch moods");
  return res.json();
}

export async function createMood(mood, note = "") {
  const res = await fetch(`${API_BASE}/moods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood, note }),
  });
  if (!res.ok) throw new Error("Failed to create mood");
  return res.json();
}

export async function deleteMood(id) {
  const res = await fetch(`${API_BASE}/moods/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete mood");
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/moods/analytics`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function fetchQuote(mood) {
  const res = await fetch(`${API_BASE}/quotes/${mood}`);
  if (!res.ok) throw new Error("Failed to fetch quote");
  return res.json();
}

export async function fetchPalettes() {
  const res = await fetch(`${API_BASE}/palettes`);
  if (!res.ok) throw new Error("Failed to fetch palettes");
  return res.json();
}
