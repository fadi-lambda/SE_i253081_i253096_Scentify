"""
app.py — Flask API for Scentify Recommendation Engine

Exposes one endpoint: POST /recommend
Accepts quiz answers as JSON, returns ranked product recommendations.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from recommend_engine import load_products, recommend

app = Flask(__name__)
CORS(app)  # Allows your frontend (different domain/port) to call this API

# Load product data once when the server starts — not on every request
products = load_products("products.json")


@app.route("/recommend", methods=["POST"])
def get_recommendation():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON body received"}), 400

    required_fields = ["gender", "scent", "occasion", "intensity", "budget"]
    missing = [f for f in required_fields if f not in data]

    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        results = recommend(data, products, top_n=3)
        return jsonify({"recommendations": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Scentify recommendation API is running"}), 200


if __name__ == "__main__":
    app.run(debug=False, port=5000)