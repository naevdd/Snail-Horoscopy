from preprocessing import preprocess_image
from spiral_detect import detect_spiral_ratio

if __name__ == "__main__":
    import sys
    if len(sys.argv) <2:
        print("Usage: python main.py <image_path>")
        sys.exit(1)
        
    image_path = sys.argv[1]
    _, edges = preprocess_image(image_path)
    b, golden_b, difference = detect_spiral_ratio(edges)
    
    print(f"Spiral Ratio: {b}")
    print(f"Golden Ratio: {golden_b}")