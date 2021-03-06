import os
from flask import send_from_directory

from .config import STATIC_FOLDER
from server import app

# Serve the React App at remaining URLs that aren't static files
@app.route("/")
@app.route("/<path:path>")
def serve(path="index.html"):
    if os.path.exists(os.path.join(STATIC_FOLDER, path)):
        return send_from_directory(STATIC_FOLDER, path)
    else:
        return send_from_directory(STATIC_FOLDER, "index.html")
