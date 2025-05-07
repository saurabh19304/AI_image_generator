# AI_image_generator

AI Image Generator with Hugging Face API :-
This project is an AI-powered image generation web application that allows users to input a text prompt and generate high-quality images using various Hugging Face diffusion models. The application includes a clean UI with light/dark themes, model selection, aspect ratio control, and advanced features such as custom error alerts, loading spinners, and result downloading.


✨ Built with: Vanilla JavaScript, HTML, CSS, Hugging Face Inference API

🚀 Features
🔍 Text-to-Image Generation using Hugging Face inference models

🎨 Multiple Model Support — choose from a list of diffusion models

🔢 Image Count Selector — generate multiple images at once

📐 Aspect Ratio Options — customize the width-to-height ratio

🎲 Prompt Suggestions — click-to-generate random prompts

🌗 Dark/Light Theme Toggle — theme preference saved across sessions

⏳ Loading Spinners while images are being fetched

🧾 Styled Error Alerts for unavailable models (custom alerts)

📥 One-click Image Download

📱 Fully Responsive Design for desktop and mobile users


🧠 How It Works
User enters a prompt (e.g., "A fantasy dragon flying over snowy mountains").

Chooses:

AI Model (e.g., stabilityai/stable-diffusion)

Number of images to generate

Aspect ratio (1:1, 4:3, 16:9, etc.)

On form submission:

A loading card is shown for each image

A POST request is sent to Hugging Face's inference API with the input prompt and model

The image blob is returned and displayed in the UI

The image is downloadable directly from the preview

If a model is unavailable:

A custom alert box is shown suggesting the user to try a different model


📂 Folder Structure
pgsql
Copy
Edit
/project-root
  ├── index.html
  ├── style.css
  ├── script.js
  ├── alert.js (Custom styled alert box)
  └── README.md

  
🔐 API Key Protection (Important)
For development, your Hugging Face API key is required to be stored in script.js.

--> PLEASE REPLACE YOUR HUGGING FACE API KEY WITH THE PROMPT your_huggingface_API AT API_KEY.
(As I can not share my API key publicly)

⚠️ Rate Limits & API Key Info
The Hugging Face Inference API has rate limits:

Free accounts: 30 requests/month

To continue using the app after hitting limits:

Upgrade to a paid Hugging Face plan

Generate a new key from another Hugging Face account

Or host your own model using transformers locally


📸 Preview
Here’s how the app looks: https://saurabh19304.github.io/AI_image_generator/


📌 Setup Instructions
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/ai-image-generator.git
cd ai-image-generator
Open index.html in any browser.

Replace your Hugging Face API key in script.js:

js
Copy
Edit
const API_KEY = 'your_huggingface_key_here';


🎯 Future Improvements
Add drag-and-drop image preview area

Enable saving prompt history

Connect to a backend for safer API handling


Add login system to track usage

🙋‍♂️ About Me
I created this project as a part of my learning journey, writing most of the code manually. It was a valuable experience combining real-time coding, UI design, and integrating external APIs. Some parts of the code involved trial and error and learning on the go — I plan to revisit and document those areas for better understanding.

📬 Feedback
If you have suggestions, improvements, or want to collaborate, feel free to open an issue.

