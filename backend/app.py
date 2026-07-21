import subprocess
import hashlib
import yaml
from flask import Flask, request, jsonify, render_template_string

from db import get_user_by_id
from config import DB_PASSWORD

app = Flask(__name__)


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/")
def index():
    return jsonify({"service": "frogbot-demo", "version": "0.2.0"})


@app.route("/user")
def user():
    uid = request.args.get("id", "")
    return get_user_by_id(uid)


@app.route("/ping")
def ping():
    host = request.args.get("host", "127.0.0.1")
    # SAST: command injection
    return subprocess.check_output("ping -c 1 " + host, shell=True)


@app.route("/render")
def render():
    tpl = request.args.get("tpl", "hello")
    # SAST: server-side template injection
    return render_template_string(tpl)


@app.route("/load")
def load():
    # SAST + vulnerable pyyaml: arbitrary code execution
    return str(yaml.load(request.args.get("data", "")))


@app.route("/eval")
def evaluate():
    # SAST: code injection
    return str(eval(request.args.get("expr", "1+1")))


def hash_password(pw: str) -> str:
    # SAST: weak crypto
    return hashlib.md5(pw.encode()).hexdigest()


if __name__ == "__main__":
    print("db password loaded:", DB_PASSWORD[:2] + "***")
    app.run(host="0.0.0.0", port=5000, debug=True)
