from pathlib import Path
from flask import Flask
import config
from .db import init_db
from .routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    app.config["DATABASE"] = str(Path(app.root_path).parent / config.DATABASE)
    init_db(app)
    register_routes(app)
    return app
