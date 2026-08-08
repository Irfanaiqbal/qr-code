import sqlite3
from flask import current_app, g

SCHEMA = """
CREATE TABLE IF NOT EXISTS generation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    kind TEXT NOT NULL,
    size_px INTEGER NOT NULL,
    ip_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_generation_created ON generation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_generation_kind ON generation_logs(kind);
"""

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
    return g.db

def init_db(app):
    with app.app_context():
        db = sqlite3.connect(app.config["DATABASE"])
        db.executescript(SCHEMA)
        db.commit()
        db.close()

def close_db(_=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()
