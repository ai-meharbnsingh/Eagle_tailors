"""
Eagle Tailors OCR Service
Free OCR service using PaddleOCR for Hindi and English text extraction
"""

from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
import cv2
import numpy as np
from PIL import Image
import io
import re
import os

app = Flask(__name__)

# Initialize PaddleOCR (Hindi + English)
# Use CPU by default (set use_gpu=True if GPU available)
ocr = PaddleOCR(lang='en', use_angle_cls=True, use_gpu=False)

def preprocess_image(image_bytes):
    """
    Preprocess image for better OCR results
    Handles rotation, brightness, contrast, denoising
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # Denoise
    denoised = cv2.fastNlMeansDenoising(thresh, None, 10, 7, 21)

    # Sharpen
    kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
    sharpened = cv2.filter2D(denoised, -1, kernel)

    return sharpened

def sanitize_measurement(text):
    """
    Convert tailor shorthand to decimal numbers
    37½ -> 37.5
    37-2 -> 37.5
    37¼ -> 37.25
    """
    conversions = {
        r'(\d+)\s*½': r'\1.5',
        r'(\d+)\s*[/-]\s*2': r'\1.5',
        r'(\d+)\s*¼': r'\1.25',
        r'(\d+)\s*[/-]\s*4': r'\1.25',
        r'(\d+)\s*¾': r'\1.75',
        r'(\d+)\s*[/-]\s*34': r'\1.75',
    }

    result = text
    for pattern, replacement in conversions.items():
        result = re.sub(pattern, replacement, result)

    return result

def extract_phone_numbers(text):
    """Extract phone numbers from text"""
    phone_pattern = r'\b(?:\+?91[-.\s]?)?[6-9]\d{9}\b'
    phones = re.findall(phone_pattern, text)
    return [re.sub(r'[-.\s]', '', p) for p in phones]

def extract_dates(text):
    """Extract dates from text"""
    date_patterns = [
        r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',  # DD/MM/YYYY or DD-MM-YYYY
        r'\b\d{2,4}[/-]\d{1,2}[/-]\d{1,2}\b',  # YYYY/MM/DD
    ]

    dates = []
    for pattern in date_patterns:
        dates.extend(re.findall(pattern, text))

    return dates

def extract_amounts(text):
    """Extract monetary amounts from text"""
    amount_pattern = r'₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)'
    amounts = re.findall(amount_pattern, text)
    return [float(a.replace(',', '')) for a in amounts]

def calculate_confidence(result):
    """Calculate average confidence score"""
    if not result or len(result) == 0:
        return 0

    confidences = [line[1][1] for line in result[0] if len(line) > 1]
    if not confidences:
        return 0

    return sum(confidences) / len(confidences) * 100

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'OCR Service is running',
        'service': 'Eagle Tailors OCR',
        'engine': 'PaddleOCR'
    })

@app.route('/extract', methods=['POST'])
def extract_text():
    """
    Extract text from bill image
    Expects: multipart/form-data with 'image' file
    Returns: JSON with extracted text and structured data
    """
    try:
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400

        image_file = request.files['image']

        # Read image bytes
        image_bytes = image_file.read()

        # Preprocess image
        processed_img = preprocess_image(image_bytes)

        # Run OCR
        result = ocr.ocr(processed_img, cls=True)

        if not result or len(result) == 0 or not result[0]:
            return jsonify({
                'success': True,
                'data': {
                    'raw_text': '',
                    'lines': [],
                    'confidence': 0,
                    'phone_numbers': [],
                    'dates': [],
                    'amounts': [],
                    'message': 'No text detected in image'
                }
            })

        # Extract text lines
        lines = []
        full_text = ''

        for line in result[0]:
            if len(line) < 2:
                continue

            text = line[1][0]
            confidence = line[1][1] * 100

            # Sanitize measurements
            sanitized_text = sanitize_measurement(text)

            lines.append({
                'text': sanitized_text,
                'original': text,
                'confidence': round(confidence, 2),
                'bbox': line[0]
            })

            full_text += sanitized_text + ' '

        # Extract structured data
        phone_numbers = extract_phone_numbers(full_text)
        dates = extract_dates(full_text)
        amounts = extract_amounts(full_text)

        # Calculate overall confidence
        avg_confidence = calculate_confidence(result)

        return jsonify({
            'success': True,
            'data': {
                'raw_text': full_text.strip(),
                'lines': lines,
                'confidence': round(avg_confidence, 2),
                'phone_numbers': phone_numbers,
                'dates': dates,
                'amounts': amounts,
                'total_lines': len(lines)
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/extract-measurements', methods=['POST'])
def extract_measurements():
    """
    Extract measurements from bill image
    More focused on finding measurement-like patterns
    """
    try:
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400

        image_file = request.files['image']
        image_bytes = image_file.read()

        # Preprocess and run OCR
        processed_img = preprocess_image(image_bytes)
        result = ocr.ocr(processed_img, cls=True)

        if not result or len(result) == 0 or not result[0]:
            return jsonify({
                'success': True,
                'data': {
                    'measurements': {},
                    'unknown_values': [],
                    'confidence': 0
                }
            })

        # Extract and parse measurements
        measurements = {}
        unknown_values = []

        measurement_pattern = r'([A-Z]+)\s*[:=]?\s*(\d+(?:[.½¼¾/-]\d*)?)'

        for line in result[0]:
            if len(line) < 2:
                continue

            text = line[1][0]
            confidence = line[1][1] * 100

            # Find measurement patterns
            matches = re.findall(measurement_pattern, text, re.IGNORECASE)

            for code, value in matches:
                sanitized_value = sanitize_measurement(value)
                measurements[code.upper()] = {
                    'value': sanitized_value,
                    'confidence': round(confidence, 2)
                }

            # Collect values that don't match pattern
            if not matches and len(text.strip()) > 0:
                unknown_values.append({
                    'text': text,
                    'confidence': round(confidence, 2)
                })

        avg_confidence = calculate_confidence(result)

        return jsonify({
            'success': True,
            'data': {
                'measurements': measurements,
                'unknown_values': unknown_values,
                'confidence': round(avg_confidence, 2)
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("""
    ╔═══════════════════════════════════════════════════════════════╗
    ║                                                               ║
    ║   🦅  EAGLE TAILORS OCR SERVICE                              ║
    ║      Free OCR using PaddleOCR                                ║
    ║                                                               ║
    ║   Service running on: http://localhost:5000                  ║
    ║   Engine: PaddleOCR (Hindi + English)                        ║
    ║   GPU: Disabled (using CPU)                                  ║
    ║                                                               ║
    ║   Endpoints:                                                  ║
    ║   • /health - Health check                                    ║
    ║   • /extract - Extract all text                              ║
    ║   • /extract-measurements - Extract measurements             ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
    """)

    app.run(host='0.0.0.0', port=5000, debug=True)
