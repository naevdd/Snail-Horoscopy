import cv2
import numpy as np
from scipy.optimize import curve_fit

def log_spiral(t, a, b):
    return a * np.exp(b * t)

def detect_spiral_ratio(edges):
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_contour = max(contours, key=cv2.contourArea)
    points = np.squeeze(largest_contour)
    cx, cy=np.mean(points, axis=0)
    x,y=points[:, 0] - cx, points[:, 1] - cy
    t = np.arctan2(y, x)
    params,_= curve_fit(log_spiral, t, np.sqrt(x**2 + y**2), p0=[1, 0.1])
    a,b=params
    phi=(1+ np.sqrt(5)) / 2
    golden_b=np.log(phi) / (np.pi/2)
    return b, golden_b, abs(a - golden_b)