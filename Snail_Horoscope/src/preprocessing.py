import cv2
import numpy as np

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    edges = cv2.Canny(gray, 50, 150) 
    contours, hierarchy = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        cv2.drawContours(img, [largest_contour], -1, (0, 255, 0), 3)
        second_largest_contour = sorted(contours, key=cv2.contourArea, reverse=True)[2] if len(contours) > 1 else None
        if second_largest_contour is not None: 
            print("Second largest contour found, drawing it in blue.")
            cv2.drawContours(img, [second_largest_contour], -1, (255, 0, 0), 3)
    else:
        print("No contours found.")
    cv2.imshow("Contours", img)
    return img, edges