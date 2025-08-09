from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import math
from scipy.optimize import curve_fit
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def log_spiral(theta, a, b):
    return a * np.exp(b * theta)
@app.route("/api/horoscope", methods=["POST"])
def get_horoscope():
    file = request.files['image']
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    deviation = calculate_spiral_deviation(image) 

    import requests, os
    n8n_res = requests.post(
        "https://mwkaneki.app.n8n.cloud/webhook-test/d15fdb73-b762-478e-b513-694c98d60339",
        json={
            "contents": [{
                "parts": [{"text": f"The snail spiral deviation is {deviation:.2f}%."}]
            }]
        }
    )

    if n8n_res.status_code != 200:
        return jsonify({"error": "Failed to get horoscope from n8n"}), 500

    n8n_data = n8n_res.json()
    horoscope = n8n_data.get("output")  
    return jsonify({
        "ratio": deviation,
        "horoscope": horoscope or "No horoscope generated"
    })
    
def calculate_spiral_deviation(image):
    orig = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 50, 150)

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_shell = np.array([5, 30, 50])
    upper_shell = np.array([25, 200, 255])
    mask_shell = cv2.inRange(hsv, lower_shell, upper_shell)
    mask_shell = cv2.morphologyEx(mask_shell, cv2.MORPH_CLOSE, np.ones((5,5), np.uint8))
    masked_edges = cv2.bitwise_and(edges, edges, mask=mask_shell)

    contours, _ = cv2.findContours(mask_shell, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        raise ValueError("No shell detected.")
    shell_contour = max(contours, key=cv2.contourArea)
    (xc, yc), radius = cv2.minEnclosingCircle(shell_contour)
    cx, cy = int(xc), int(yc)

    contours_edges, _ = cv2.findContours(masked_edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    points = [p[0] for cnt in contours_edges for p in cnt]

    r_vals, theta_vals = [], []
    for x, y in points:
        dx, dy = x - cx, y - cy
        r = math.sqrt(dx**2 + dy**2)
        theta = math.atan2(dy, dx)
        if theta < 0:
            theta += 2 * math.pi
        r_vals.append(r)
        theta_vals.append(theta + 2 * math.pi * (r // (radius/3)))

    r_vals = np.array(r_vals)
    theta_vals = np.array(theta_vals)
    popt, _ = curve_fit(log_spiral, theta_vals, r_vals, p0=(radius/5, 0.1))
    a_fit, b_fit = popt

    golden_b = math.log((1 + math.sqrt(5)) / 2) / (math.pi / 2)
    deviation = abs((b_fit - golden_b) / golden_b) * 100
    return deviation

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Render's port if set, else 5000
    app.run(host="0.0.0.0", port=port)
