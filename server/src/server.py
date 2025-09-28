import core
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin   

app = Flask(__name__)
CORS(app)

@app.route('/favicon.ico')
def favicon():
    # You can return an empty response or a small, transparent image
    return "", 204  # Returns an empty response with a No Content status

@app.route("/api")
def students():
    return jsonify(core.list_students())

@app.route("/api/student/<sid>")
def student_exists(sid):
    return jsonify(core.get_student(sid))

@app.route("/api/plan", methods=["GET"])
def api_plan():
    sid = request.args.get("sid")
    major = request.args.get("major")
    return jsonify(core.four_year_plan(sid, major))

@app.route("/api/switch", methods=["GET"])
def api_switch():
    sid = request.args.get("sid")
    new_major = request.args.get("new_major")
    return jsonify(core.switch_major(sid, new_major))

@app.route("/api/clubs", methods=["GET"])
def api_clubs():
    sid = request.args.get("sid")
    category = request.args.get("category")
    return jsonify(core.suggest_clubs(sid, category))

@app.route("/api/repo", methods=["POST"])
def api_repo():
    sid = request.form["sid"]
    url = request.form["url"]
    return jsonify(core.add_repo(sid, url))

if __name__ == "__main__":
    app.run(debug=True, port=8000)