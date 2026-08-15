"""
MoodScape - FastAPI Backend
A mood-based generative art journal API
"""

import random
import uuid
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data.palettes import PALETTES
from data.quotes import QUOTES

# ── App Setup ──────────────────────────────────────────────────────────────────

app = FastAPI(
    title="MoodScape API",
    description="A mood-based generative art journal - turn your emotions into art",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-Memory Storage ─────────────────────────────────────────────────────────

mood_entries: list[dict] = []

# ── Pydantic Models ───────────────────────────────────────────────────────────


class MoodCreate(BaseModel):
    mood: str
    note: Optional[str] = ""


class MoodEntry(BaseModel):
    id: str
    mood: str
    note: str
    quote: dict
    palette: dict
    created_at: str


# ── Endpoints ─────────────────────────────────────────────────────────────────


@app.get("/")
def root():
    return {
        "app": "MoodScape API",
        "version": "1.0.0",
        "message": "Welcome to MoodScape - turn your emotions into art ✨",
    }


@app.get("/api/moods", response_model=list[MoodEntry])
def get_moods():
    """Get all mood entries, newest first."""
    return sorted(mood_entries, key=lambda x: x["created_at"], reverse=True)


@app.post("/api/moods", response_model=MoodEntry, status_code=201)
def create_mood(mood_data: MoodCreate):
    """Create a new mood entry with auto-generated quote and palette."""
    mood_key = mood_data.mood.lower()

    if mood_key not in PALETTES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mood '{mood_data.mood}'. Valid moods: {list(PALETTES.keys())}",
        )

    # Pick a random quote for this mood
    quote = random.choice(QUOTES[mood_key])
    palette = PALETTES[mood_key]

    # Generate a unique gradient rotation for visual variety
    rotation = random.randint(0, 360)
    palette_with_rotation = {
        **palette,
        "rotation": rotation,
        "bg_gradient": f"linear-gradient({rotation}deg, {palette['gradient'][0]} 0%, {palette['gradient'][1]} 50%, {palette['gradient'][2]} 100%)",
    }

    entry = {
        "id": str(uuid.uuid4()),
        "mood": mood_key,
        "note": mood_data.note or "",
        "quote": quote,
        "palette": palette_with_rotation,
        "created_at": datetime.now().isoformat(),
    }

    mood_entries.append(entry)
    return entry


@app.delete("/api/moods/{mood_id}")
def delete_mood(mood_id: str):
    """Delete a mood entry by ID."""
    global mood_entries
    original_len = len(mood_entries)
    mood_entries = [e for e in mood_entries if e["id"] != mood_id]

    if len(mood_entries) == original_len:
        raise HTTPException(status_code=404, detail="Mood entry not found")

    return {"message": "Mood entry deleted", "id": mood_id}


@app.get("/api/moods/analytics")
def get_analytics():
    """Get mood distribution analytics."""
    distribution = {}
    for mood_key in PALETTES:
        count = sum(1 for e in mood_entries if e["mood"] == mood_key)
        distribution[mood_key] = {
            "count": count,
            "emoji": PALETTES[mood_key]["emoji"],
            "name": PALETTES[mood_key]["name"],
            "color": PALETTES[mood_key]["primary"],
        }

    total = len(mood_entries)
    return {
        "total_entries": total,
        "distribution": distribution,
        "most_frequent": max(distribution, key=lambda k: distribution[k]["count"]) if total > 0 else None,
    }


@app.get("/api/quotes/{mood}")
def get_quote(mood: str):
    """Get a random quote for a specific mood."""
    mood_key = mood.lower()
    if mood_key not in QUOTES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mood '{mood}'. Valid moods: {list(QUOTES.keys())}",
        )
    return random.choice(QUOTES[mood_key])


@app.get("/api/palettes")
def get_all_palettes():
    """Get all available mood palettes."""
    return PALETTES


@app.get("/api/palettes/{mood}")
def get_palette(mood: str):
    """Get the color palette for a specific mood."""
    mood_key = mood.lower()
    if mood_key not in PALETTES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mood '{mood}'. Valid moods: {list(PALETTES.keys())}",
        )
    return PALETTES[mood_key]
