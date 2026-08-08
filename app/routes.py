import hashlib
import hmac
import time
from collections import defaultdict, deque
from flask import render_template, request, redirect, url_for, session, jsonify, current_app
from .db import get_db, close_db

_rate = defaultdict(deque)

def _rate_ok(ip):
    now = time.time()
    q = _rate[ip]
    while q and q[0] < now - 60:
        q.popleft()
    if len(q) >= 40:
        return False
    q.append(now)
    return True

def register_routes(app):
    app.teardown_appcontext(close_db)

    # Read configuration from the actual Flask app while routes are
    # being registered. Do NOT use current_app here.
    admin_path = app.config["ADMIN_PATH"]


    @app.get("/")
    def home():
        return render_template("index.html")

    @app.post("/api/log-generation")
    def log_generation():
        if not _rate_ok(request.remote_addr or "unknown"):
            return jsonify(ok=False, error="Too many requests."), 429

        data = request.get_json(silent=True) or {}
        kind = str(data.get("kind", "")).strip().lower()
        try:
            size_px = int(data.get("size_px", 1000))
        except (TypeError, ValueError):
            size_px = 1000

        allowed = {"website", "text", "email", "phone", "sms", "wifi", "contact", "whatsapp"}
        if kind not in allowed:
            return jsonify(ok=False, error="Invalid QR type."), 400
        if size_px not in {512, 800, 1000, 1200, 1600, 2000}:
            return jsonify(ok=False, error="Invalid size."), 400

        raw_ip = request.remote_addr or "unknown"
        ip_hash = hmac.new(
            current_app.config["IP_HASH_SECRET"].encode(),
            raw_ip.encode(),
            hashlib.sha256
        ).hexdigest()

        db = get_db()
        db.execute(
            "INSERT INTO generation_logs(kind,size_px,ip_hash) VALUES(?,?,?)",
            (kind, size_px, ip_hash)
        )
        db.commit()
        return jsonify(ok=True)

    @app.get("/" + admin_path)
    def admin_login():
        if session.get("admin_ok"):
            return redirect(url_for("admin_dashboard"))
        return render_template("admin_login.html")

    @app.post("/" + admin_path + "/login")
    def admin_login_post():
        username = request.form.get("username", "")
        password = request.form.get("password", "")
        if (
            hmac.compare_digest(username, current_app.config["ADMIN_USERNAME"])
            and hmac.compare_digest(password, current_app.config["ADMIN_PASSWORD"])
        ):
            session.clear()
            session["admin_ok"] = True
            session.permanent = True
            return redirect(url_for("admin_dashboard"))
        time.sleep(0.25)
        return render_template("admin_login.html", error="Invalid credentials."), 401

    @app.get("/" + admin_path + "/dashboard")
    def admin_dashboard():
        if not session.get("admin_ok"):
            return redirect(url_for("admin_login"))

        db = get_db()
        total = db.execute("SELECT COUNT(*) AS n FROM generation_logs").fetchone()["n"]
        today = db.execute(
            "SELECT COUNT(*) AS n FROM generation_logs WHERE date(created_at,'localtime') = date('now','localtime')"
        ).fetchone()["n"]
        unique_today = db.execute(
            "SELECT COUNT(DISTINCT ip_hash) AS n FROM generation_logs "
            "WHERE date(created_at,'localtime') = date('now','localtime')"
        ).fetchone()["n"]

        daily_rows = db.execute("""
            SELECT date(created_at,'localtime') day, COUNT(*) count
            FROM generation_logs
            WHERE created_at >= datetime('now','-29 days')
            GROUP BY day ORDER BY day
        """).fetchall()

        kind_rows = db.execute("""
            SELECT kind, COUNT(*) count
            FROM generation_logs GROUP BY kind ORDER BY count DESC
        """).fetchall()

        latest = db.execute("""
            SELECT id, created_at, kind, size_px, substr(ip_hash,1,12) ip_key
            FROM generation_logs ORDER BY id DESC LIMIT 40
        """).fetchall()

        return render_template(
            "admin_dashboard.html",
            total=total,
            today=today,
            unique_today=unique_today,
            daily=[dict(r) for r in daily_rows],
            kinds=[dict(r) for r in kind_rows],
            latest=[dict(r) for r in latest],
        )

    @app.post("/" + admin_path + "/logout")
    def admin_logout():
        session.clear()
        return redirect(url_for("admin_login"))
