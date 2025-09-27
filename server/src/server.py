import core
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def students():
    return jsonify(core.list_students())

@app.route("/plan", methods=["GET"])
def api_plan():
    sid = request.args.get("sid")
    major = request.args.get("major")
    return jsonify(core.four_year_plan(sid, major))

@app.route("/switch", methods=["GET"])
def api_switch():
    sid = request.args.get("sid")
    new_major = request.args.get("new_major")
    return jsonify(core.switch_major(sid, new_major))

@app.route("/clubs", methods=["GET"])
def api_clubs():
    sid = request.args.get("sid")
    category = request.args.get("category")
    return jsonify(core.suggest_clubs(sid, category))

@app.route("/repo", methods=["POST"])
def api_repo():
    sid = request.form["sid"]
    url = request.form["url"]
    return jsonify(core.add_repo(sid, url))

if __name__ == "__main__":
    app.run(debug=True, port=8000)