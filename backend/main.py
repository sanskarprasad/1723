import os
from flask import Flask, request, render_template, jsonify
from PIL import Image
import easyocr
import re
import google.generativeai as genai

# Configure Gemini API key
genai.configure(api_key="YOUR_API_KEY")  # Replace with your actual API key

# Initialize Flask app
app = Flask(__name__)

# Route: Home (Upload and Extract Text)
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if "image" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        # Save the uploaded file
        file = request.files["image"]
        temp_path = "uploaded_image.jpg"
        file.save(temp_path)

        try:
            # Load image and extract text
            reader = easyocr.Reader(["en"])
            result = reader.readtext(temp_path)
            extracted_text = "\n".join([item[1] for item in result])

            # Regex: Extract medicine names and dosages
            pattern = r"(?:Tab|Tal|Adv):?\s*([\w-]+)\s*([\d/]+)?"
            matches = re.findall(pattern, extracted_text)
            medicines = [{"name": m[0].strip(), "dosage": m[1].strip() if m[1] else "No dosage provided"} for m in matches]

            # Use Gemini model
            prompt = f"""
            Extract the following information from the doctor's prescription:
            1. List the drugs and their dosages.
            2. Identify the potential disease based on symptoms.
            3. Suggest home remedies or further medical action.
            Text: {extracted_text}
            """
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)

            # Prepare response
            return jsonify({
                "extracted_text": extracted_text,
                "medicines": medicines,
                "gemini_response": response.text
            })

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    return render_template("index.html")

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
