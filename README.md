# Shamil - Portfolio Architecture

Welcome to **Portfolio v2** - a fully self-hosted, minimal techno-themed personal portfolio and productivity hub built by Shamil.

Unlike a standard static portfolio, this project functions like a modular operating system. It features a suite of built-in frontend web applications, a floating AI assistant, and a dedicated Node.js Express backend API to securely handle analytics, dynamic chat, and anonymous message ingestion.

## 🚀 Key Architectural Features

### The Frontend (Vanilla HTML / CSS / JS)
No heavy frameworks. Built cleanly for speed, accessibility, and high performance.
* **Streamlined UI/UX**: "Minimal Techno" aesthetics, dynamic dark/light mode toggles, fade-in intersection observers, and a global robust CSS variable system.
* **The Main Frame (`index.html`)**: Dynamic scroll-spy navigation, an immersive project showcase (featuring hardware and computer vision applications), and an anonymous transmission pipeline.
* **The Tools Hub (`tools.html`)**: A centralized application launcher containing:
  * 📝 Quick Notes (Local Storage)
  * 🌤 Weather Engine
  * 📊 Habit & Streak Tracker
  * ⚡ Reaction Time Test
  * 📚 Useful Sites / Bookmarks
* **Focus Framework (`focus.html`)**: A distraction-free module with a fully customizable Pomodoro timer engine and World Clock sync.
* **Keyboard Warrior (`typing.html`)**: A dynamic WPM/Accuracy engine with modes for generating random tech words or rendering famous quotes.
* **AI Chat Widget**: A persistent floating terminal window living across all pages that hooks into the backend for context-aware Q&A about my skills and projects.

### The Backend (Node.js / Express)
Designed specifically for high-mobility serverless/container deployment (like Render Web Services).
* **Zero-DB State Storage**: Uses local JSON flat-file storage (`data/` logic) to bypass the need for external SQL/NoSQL databases, making bootstrapping instantaneous.
* **`/api/messages`**: Secure ingestion and retrieval of anonymous messaging directly from the frontend.
* **`/api/analytics`**: Lightweight, middleware-level tracking of unique IP hits, User-Agents, and page view dominance tracking.
* **`/api/chat` Proxy**: Securely wraps OpenAi's ChatGPT 3.5 API. If no API key is provided, the proxy natively degrades into a robust hard-coded fallback matrix designed exclusively to answer questions about my background, skills, and projects flawlessly.

---

## 🛠 Tech Stack
* **Language/Core:** HTML5, CSS3, JavaScript (ES6+), Node.js, Express.js
* **Design Systems:** CSS Variables, Flexbox/Grid layouts, Intersection Observers
* **Tooling:** Dotenv, CORS
* **AI:** OpenAI API

---

## ⚙️ How to Deploy & Run Locally

### 1. Launch the Backend
The backend runs on port 3001 and is essential for the Chatbot, Analytics, and Contact forms.
```bash
# Navigate to the backend directory
cd backend

# Install dependencies (Express, Cors, Dotenv)
npm install

# (Optional) Create a .env file and add keys:
# ADMIN_KEY=my_secure_password
# OPENAI_API_KEY=sk-...

# Spin up the server
node server.js
```
*The server will automatically generate the `/data/` flat files on boot.*

### 2. Connect the Frontend
The frontend uses standard Vanilla Javascript `fetch` to talk to the backend.
1. Open `script.js` in your editor.
2. At the top of the file, ensure the `API_URL` variable is pointing to your active backend (either `http://localhost:3001` for local development, or your live Render URL like `https://portfolio-backend.onrender.com`).

### 3. Launch the Frontend
Because it's vanilla Code:
* **Locally:** You can simply launch `index.html` via Live Server in VSCode or double click the file.
* **Production:** Deploy directly to **Vercel** with zero configuration required.

---

## 👨‍💻 About the Developer
I am Shamil, a Computer Science undergraduate focused heavily on software development, large systems, and practical integrations (like LLMs, Arch Linux automation, and facial recognition architecture). 

You can reach me securely through the anonymous transmission frame at the bottom of the landing page, or clone this project and build your own system!

> **"Simplicity is the ultimate sophistication in both design and life."**
