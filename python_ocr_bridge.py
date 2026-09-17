# import cv2
# import numpy as np
# import pytesseract
# import sys
# import json
# from PIL import Image

# # Tesseract installation path
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# def preprocess_and_ocr(image_path):
#     try:
#         # Load image
#         image = cv2.imread(image_path)
#         if image is None:
#             return {"success": False, "error": "Could not load image"}
        
#         # Convert to grayscale
#         gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
#         # Enlarge image (4x scaling)
#         gray = cv2.resize(gray, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)
        
#         # Remove some noise
#         gray = cv2.GaussianBlur(gray, (3, 3), 0)
        
#         # Convert to black/white using OTSU
#         threshold_value, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
#         # OCR configuration (exact same as working version)
#         config = "--oem 3 --psm 7 -c tessedit_char_whitelist=0123456789"
#         raw_text = pytesseract.image_to_string(binary, config=config)
        
#         # Extract digits
#         digits = "".join(char for char in raw_text if char.isdigit())
        
#         return {
#             "success": True,
#             "raw_text": raw_text,
#             "digits": digits,
#             "length": len(digits)
#         }
        
#     except Exception as e:
#         return {"success": False, "error": str(e)}

# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print('{"success": false, "error": "Usage: python script.py <image_path>"}')
#         sys.exit(1)
    
#     image_path = sys.argv[1]
#     result = preprocess_and_ocr(image_path)
    
#     # Output JSON for Node.js to parse
#     print(json.dumps(result))



import sys
import json
import cv2
import numpy as np
import pytesseract

# If Tesseract isn't on PATH, uncomment:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def preprocess_captcha(image_path):
    """
    Preprocessing tailored to the GTPL Saathi CAPTCHA:
    - GIF with gray gradient background
    - Dark, italic, serif-ish characters
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")

    # Upscale 4x — the original CAPTCHA is tiny
    img = cv2.resize(img, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Invert: text is darker than background → make text white on black
    # (Tesseract prefers dark text on light bg, so we'll invert back after)
    # Actually skip invert; instead use Otsu on a slightly blurred version
    
    # Strong blur to smooth the anti-aliasing on italic edges
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Otsu threshold (works well on bimodal gray/white CAPTCHAs)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Morphological open to remove speckles
    kernel = np.ones((2, 2), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

    cv2.imwrite('captcha_preprocessed.png', thresh)
    return thresh


def ocr_with_config(image, psm):
    config = (
        f'--oem 3 --psm {psm} '
        '-c tessedit_char_whitelist='
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    )
    text = pytesseract.image_to_string(image, config=config)
    return ''.join(c for c in text if c.isalnum())


def solve(image_path):
    try:
        processed = preprocess_captcha(image_path)

        # Try multiple PSM modes and pick the most common result
        # PSM 7 = single line, PSM 8 = single word, PSM 13 = raw line
        candidates = []
        for psm in (7, 8, 13):
            try:
                t = ocr_with_config(processed, psm)
                if t:
                    candidates.append(t)
            except Exception:
                pass

        if not candidates:
            return {
                'success': False,
                'error': 'All OCR modes returned empty',
                'raw_text': '', 'digits': '', 'captcha': '', 'length': 0
            }

        # Voting: pick the most frequent result (ties → longest)
        from collections import Counter
        counts = Counter(candidates)
        best = max(counts.items(), key=lambda kv: (kv[1], len(kv[0])))[0]

        return {
            'success': True,
            'raw_text': ' | '.join(candidates),
            'digits': best,
            'captcha': best,
            'length': len(best)
        }

    except Exception as e:
        return {
            'success': False, 'error': str(e),
            'raw_text': '', 'digits': '', 'captcha': '', 'length': 0
        }


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'No image path provided'}))
        sys.exit(1)
    print(json.dumps(solve(sys.argv[1])))