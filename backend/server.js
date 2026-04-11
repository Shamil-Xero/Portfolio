/* ============================================================
   Portfolio Backend — server.js
   Express API: Messages, Analytics, AI Chatbot proxy
   Uses JSON file storage (no native dependencies needed)
   ============================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// --- JSON File Store ---
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadJSON(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return []; }
}

function saveJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// --- Routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// --- Anonymous Messages ---
app.post('/api/messages', (req, res) => {
  const { message } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 chars)' });
  }
  const messages = loadJSON('messages.json');
  const entry = { id: Date.now(), message: message.trim(), created_at: new Date().toISOString() };
  messages.unshift(entry);
  saveJSON('messages.json', messages.slice(0, 500)); // Keep last 500
  res.status(201).json({ id: entry.id, success: true });
});

app.get('/api/messages', (req, res) => {
  if (req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json(loadJSON('messages.json').slice(0, 100));
});

// --- Visitor Analytics ---
app.post('/api/analytics/pageview', (req, res) => {
  const { page } = req.body;
  const views = loadJSON('pageviews.json');
  views.unshift({
    page: page || '/',
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
    user_agent: req.headers['user-agent'] || '',
    created_at: new Date().toISOString()
  });
  saveJSON('pageviews.json', views.slice(0, 5000));
  res.json({ success: true });
});

app.get('/api/analytics', (req, res) => {
  if (req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const views = loadJSON('pageviews.json');
  const uniqueIPs = new Set(views.map(v => v.ip));
  const byPage = {};
  views.forEach(v => { byPage[v.page] = (byPage[v.page] || 0) + 1; });

  res.json({
    totalViews: views.length,
    uniqueVisitors: uniqueIPs.size,
    byPage: Object.entries(byPage).map(([page, count]) => ({ page, views: count })).sort((a, b) => b.views - a.views),
    recent: views.slice(0, 20)
  });
});

// --- Leaderboard ---
app.post('/api/leaderboard', (req, res) => {
  const { name, score, game } = req.body;
  if (!name || score === undefined || !game) {
    return res.status(400).json({ error: 'name, score, and game are required' });
  }
  const board = loadJSON('leaderboard.json');
  board.push({ name: name.slice(0, 50), score: parseInt(score), game: game.slice(0, 50), created_at: new Date().toISOString() });
  board.sort((a, b) => b.score - a.score);
  saveJSON('leaderboard.json', board.slice(0, 200));
  res.status(201).json({ success: true });
});

app.get('/api/leaderboard/:game', (req, res) => {
  const board = loadJSON('leaderboard.json').filter(e => e.game === req.params.game);
  res.json(board.slice(0, 10));
});

// --- AI Chatbot ---
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const lm = message.toLowerCase();
    let reply = "I'm Shamil's AI assistant! Ask me about his skills, projects, or interests.";
    if (lm.includes('skill') || lm.includes('tech') || lm.includes('stack')) {
      reply = "Shamil is a CS undergraduate focusing on Software Engineering, Data Structures, and Systems. He works with C, Java, PHP, Python, JS, and Arch Linux.";
    } else if (lm.includes('project')) {
      reply = "Shamil's notable projects include ClassSnap (a facial recognition attendance tracker), a custom physical MacroPad, Phone Automations, and custom Windows Shortcuts!";
    } else if (lm.includes('contact') || lm.includes('reach')) {
      reply = "You can send Shamil an anonymous message right here on the portfolio!";
    } else if (lm.includes('hobby') || lm.includes('interest') || lm.includes('fun') || lm.includes('llm') || lm.includes('linux')) {
      reply = "Shamil's deeply interested in Large Language Models (LLMs), AI, open-source tech, and configuring Linux environments like Arch Linux + Hyprland.";
    } else if (lm.includes('hello') || lm.includes('hi') || lm.includes('hey')) {
      reply = "Hey there! 👋 Ask me about Shamil's skills, projects, or his system setups!";
    }
    return res.json({ reply });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an AI assistant on Shamil\'s portfolio. Answer about Shamil — a CS undergraduate in India focusing on software development, systems, and practical implementations. Skills: C, Java, PHP, Python, JS, System Design, Arch Linux. Interests: LLMs, AI. Notable Projects: ClassSnap (Facial Recognition), MacroPad, Phone Automations, Windows Shortcuts. Keep responses concise, structured, and friendly.' },
          { role: 'user', content: message }
        ],
        max_tokens: 200
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "Sorry, couldn't process that." });
  } catch {
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`✓ Portfolio API running on port ${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
});
