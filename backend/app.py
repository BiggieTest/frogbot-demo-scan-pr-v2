from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/")
def index():
    return jsonify({"service": "frogbot-demo", "version": "0.1.0"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
