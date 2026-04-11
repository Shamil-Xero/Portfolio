/* ============================================================
   PORTFOLIO v2 — script.js
   All interactive features. Uses null-checks so features
   only init when their elements exist on the page.
   ============================================================ */

// Backend API URL — update this after deploying to Render
const API_URL = 'https://portfolio-770t.onrender.com';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. THEME TOGGLE (dark default, light optional)
     ========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  /* ==========================================================
     2. MOBILE MENU
     ========================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.textContent = '☰';
      });
    });
  }

  /* ==========================================================
     3. NAVBAR SCROLL EFFECT
     ========================================================== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ==========================================================
     4. ACTIVE NAV HIGHLIGHT
     ========================================================== */
  const sections = document.querySelectorAll('.section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
    });
    navAnchors.forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        a.classList.toggle('active', href === '#' + current);
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  /* ==========================================================
     5. FADE-IN ON SCROLL
     ========================================================== */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObs.observe(el));

  /* ==========================================================
     6. WORLD CLOCK
     ========================================================== */
  const clockDisplay = document.getElementById('clockDisplay');
  const clockDate = document.getElementById('clockDate');
  const worldClockList = document.getElementById('worldClockList');

  const worldZones = [
    { city: 'New York', tz: 'America/New_York' },
    { city: 'London', tz: 'Europe/London' },
    { city: 'Tokyo', tz: 'Asia/Tokyo' },
    { city: 'Dubai', tz: 'Asia/Dubai' },
    { city: 'Sydney', tz: 'Australia/Sydney' },
  ];

  if (clockDisplay && clockDate) {
    function updateClock() {
      const now = new Date();
      clockDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
      clockDate.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (worldClockList) {
        worldClockList.innerHTML = worldZones.map(z => {
          const t = now.toLocaleTimeString('en-US', { timeZone: z.tz, hour12: false, hour: '2-digit', minute: '2-digit' });
          return `<div class="world-clock-item"><span class="wc-city">${z.city}</span><span class="wc-time">${t}</span></div>`;
        }).join('');
      }
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ==========================================================
     7. POMODORO TIMER
     ========================================================== */
  const pomoDisplay = document.getElementById('pomoDisplay');
  const pomoStart = document.getElementById('pomoStart');
  const pomoPause = document.getElementById('pomoPause');
  const pomoReset = document.getElementById('pomoReset');
  const pomoSessionsEl = document.getElementById('pomoSessions');
  const pomoFocusEl = document.getElementById('pomoFocusTime');

  if (pomoDisplay && pomoStart && pomoPause && pomoReset) {
    let pomoTime = 25 * 60, pomoInterval = null, pomoRunning = false;
    let pomoSessions = parseInt(localStorage.getItem('pomo-sessions') || '0');
    let pomoFocusTotal = parseInt(localStorage.getItem('pomo-focus') || '0');

    function updatePomoStats() {
      if (pomoSessionsEl) pomoSessionsEl.textContent = pomoSessions;
      if (pomoFocusEl) pomoFocusEl.textContent = pomoFocusTotal + 'm';
    }
    updatePomoStats();

    function fmtTime(s) {
      return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
    }

    function updatePomo() { pomoDisplay.textContent = fmtTime(pomoTime); }

    pomoStart.addEventListener('click', () => {
      if (pomoRunning) return;
      pomoRunning = true;
      pomoInterval = setInterval(() => {
        if (pomoTime > 0) { pomoTime--; updatePomo(); }
        else {
          clearInterval(pomoInterval);
          pomoRunning = false;
          pomoSessions++;
          pomoFocusTotal += 25;
          localStorage.setItem('pomo-sessions', pomoSessions);
          localStorage.setItem('pomo-focus', pomoFocusTotal);
          updatePomoStats();
          pomoDisplay.textContent = '🎉 Done!';
        }
      }, 1000);
    });

    pomoPause.addEventListener('click', () => { clearInterval(pomoInterval); pomoRunning = false; });
    pomoReset.addEventListener('click', () => {
      clearInterval(pomoInterval); pomoRunning = false;
      pomoTime = 25 * 60; updatePomo();
    });
  }

  /* ==========================================================
     8. QUICK NOTES
     ========================================================== */
  const notesArea = document.getElementById('notesArea');
  const notesSave = document.getElementById('notesSave');
  const notesClear = document.getElementById('notesClear');
  const notesStatus = document.getElementById('notesStatus');

  if (notesArea && notesSave && notesClear && notesStatus) {
    const saved = localStorage.getItem('portfolio-notes');
    if (saved) notesArea.value = saved;

    notesSave.addEventListener('click', () => {
      localStorage.setItem('portfolio-notes', notesArea.value);
      notesStatus.textContent = '✓ Saved';
      setTimeout(() => notesStatus.textContent = '', 2000);
    });

    notesClear.addEventListener('click', () => {
      notesArea.value = '';
      localStorage.removeItem('portfolio-notes');
      notesStatus.textContent = 'Cleared';
      setTimeout(() => notesStatus.textContent = '', 2000);
    });
  }

  /* ==========================================================
     9. TODO LIST
     ========================================================== */
  const todoInput = document.getElementById('todoInput');
  const todoAdd = document.getElementById('todoAdd');
  const todoList = document.getElementById('todoList');

  if (todoInput && todoAdd && todoList) {
    let tasks = JSON.parse(localStorage.getItem('portfolio-tasks') || '[]');

    function saveTasks() { localStorage.setItem('portfolio-tasks', JSON.stringify(tasks)); }

    function renderTasks() {
      todoList.innerHTML = '';
      tasks.forEach((t, i) => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (t.completed ? ' completed' : '');
        const txt = document.createElement('span');
        txt.className = 'todo-text';
        txt.textContent = t.text;
        txt.addEventListener('click', () => { tasks[i].completed = !tasks[i].completed; saveTasks(); renderTasks(); });
        const del = document.createElement('button');
        del.className = 'todo-delete';
        del.textContent = '✕';
        del.addEventListener('click', () => { tasks.splice(i, 1); saveTasks(); renderTasks(); });
        li.append(txt, del);
        todoList.appendChild(li);
      });
    }

    function addTask() {
      const text = todoInput.value.trim();
      if (!text) return;
      tasks.push({ text, completed: false });
      todoInput.value = '';
      saveTasks(); renderTasks();
    }

    todoAdd.addEventListener('click', addTask);
    todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
    renderTasks();
  }

  /* ==========================================================
     10. WEATHER
     ========================================================== */
  const weatherInput = document.getElementById('weatherInput');
  const weatherSearch = document.getElementById('weatherSearch');
  const weatherDisplay = document.getElementById('weatherDisplay');

  if (weatherInput && weatherSearch && weatherDisplay) {
    async function fetchWeather() {
      const city = weatherInput.value.trim();
      if (!city) return;
      weatherDisplay.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">Loading...</p>';
      try {
        const r = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const d = await r.json();
        const cur = d.current_condition[0];
        weatherDisplay.innerHTML = `
          <div class="weather-temp">${cur.temp_C}°C</div>
          <div class="weather-desc">${cur.weatherDesc[0].value}</div>
          <div class="weather-details">
            <span>💧 ${cur.humidity}%</span>
            <span>💨 ${cur.windspeedKmph} km/h</span>
            <span>👁️ ${cur.visibility} km</span>
          </div>
        `;
      } catch {
        weatherDisplay.innerHTML = '<p style="color:var(--secondary);font-size:0.85rem;">Could not fetch weather. Try another city.</p>';
      }
    }
    weatherSearch.addEventListener('click', fetchWeather);
    weatherInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchWeather(); });
  }

  /* ==========================================================
     11. HABIT TRACKER
     ========================================================== */
  const habitInput = document.getElementById('habitInput');
  const habitAdd = document.getElementById('habitAdd');
  const habitList = document.getElementById('habitList');

  if (habitInput && habitAdd && habitList) {
    let habits = JSON.parse(localStorage.getItem('portfolio-habits') || '[]');
    const today = new Date().toDateString();

    function saveHabits() { localStorage.setItem('portfolio-habits', JSON.stringify(habits)); }

    function renderHabits() {
      habitList.innerHTML = '';
      habits.forEach((h, i) => {
        const doneToday = h.dates && h.dates.includes(today);
        const streak = h.streak || 0;
        const div = document.createElement('div');
        div.className = 'habit-item';
        div.innerHTML = `
          <div class="habit-check ${doneToday ? 'done' : ''}" data-i="${i}">${doneToday ? '✓' : ''}</div>
          <span style="flex:1">${h.name}</span>
          <span class="habit-streak">🔥 ${streak}</span>
          <button class="todo-delete" data-del="${i}">✕</button>
        `;
        habitList.appendChild(div);
      });

      habitList.querySelectorAll('.habit-check').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.i);
          if (!habits[idx].dates) habits[idx].dates = [];
          if (habits[idx].dates.includes(today)) {
            habits[idx].dates = habits[idx].dates.filter(d => d !== today);
            habits[idx].streak = Math.max(0, (habits[idx].streak||1) - 1);
          } else {
            habits[idx].dates.push(today);
            habits[idx].streak = (habits[idx].streak || 0) + 1;
          }
          saveHabits(); renderHabits();
        });
      });

      habitList.querySelectorAll('[data-del]').forEach(el => {
        el.addEventListener('click', () => {
          habits.splice(parseInt(el.dataset.del), 1);
          saveHabits(); renderHabits();
        });
      });
    }

    function addHabit() {
      const name = habitInput.value.trim();
      if (!name) return;
      habits.push({ name, dates: [], streak: 0 });
      habitInput.value = '';
      saveHabits(); renderHabits();
    }

    habitAdd.addEventListener('click', addHabit);
    habitInput.addEventListener('keydown', e => { if (e.key === 'Enter') addHabit(); });
    renderHabits();
  }

  /* ==========================================================
     12. TYPING SPEED TEST
     ========================================================== */
  const typingArea = document.getElementById('typingArea');
  const typingInput = document.getElementById('typingInput');
  const typingWPM = document.getElementById('typingWPM');
  const typingAcc = document.getElementById('typingAcc');
  const typingTimeEl = document.getElementById('typingTime');
  const typingReset = document.getElementById('typingReset');

  const typingSentences = [
    "the quick brown fox jumps over the lazy dog near the riverbank",
    "a journey of a thousand miles begins with a single step forward",
    "programming is the art of telling another human what one wants the computer to do",
    "the best way to predict the future is to invent it yourself today",
    "every expert was once a beginner who never gave up on their dreams",
    "code is like humor when you have to explain it then it is bad",
    "simplicity is the ultimate sophistication in both design and life",
  ];

  if (typingArea && typingInput) {
    let typingText = '', typingStart = null, typingDone = false;

    function initTyping() {
      typingText = typingSentences[Math.floor(Math.random() * typingSentences.length)];
      typingDone = false;
      typingStart = null;
      typingInput.value = '';
      typingInput.disabled = false;
      typingArea.innerHTML = typingText.split('').map((c, i) =>
        `<span class="${i === 0 ? 'current' : 'pending'}" data-i="${i}">${c}</span>`
      ).join('');
      if (typingWPM) typingWPM.textContent = '0';
      if (typingAcc) typingAcc.textContent = '100';
      if (typingTimeEl) typingTimeEl.textContent = '0';
    }

    initTyping();

    typingInput.addEventListener('input', () => {
      if (typingDone) return;
      if (!typingStart) typingStart = Date.now();
      const val = typingInput.value;
      const chars = typingArea.querySelectorAll('span');

      let correct = 0;
      chars.forEach((span, i) => {
        span.className = '';
        if (i < val.length) {
          if (val[i] === typingText[i]) { span.className = 'correct'; correct++; }
          else span.className = 'incorrect';
        } else if (i === val.length) {
          span.className = 'current';
        } else {
          span.className = 'pending';
        }
      });

      const elapsed = (Date.now() - typingStart) / 1000;
      const words = val.trim().split(/\s+/).length;
      const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
      const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;

      if (typingWPM) typingWPM.textContent = wpm;
      if (typingAcc) typingAcc.textContent = acc;
      if (typingTimeEl) typingTimeEl.textContent = Math.round(elapsed);

      if (val.length >= typingText.length) {
        typingDone = true;
        typingInput.disabled = true;
      }
    });

    if (typingReset) typingReset.addEventListener('click', initTyping);
  }

  /* ==========================================================
     13. REACTION TEST
     ========================================================== */
  const reactionBox = document.getElementById('reactionBox');
  const reactionBest = document.getElementById('reactionBest');

  if (reactionBox) {
    let rxState = 'idle', rxTimeout = null, rxStart = 0;
    let rxBestTime = parseInt(localStorage.getItem('reaction-best') || '0');
    if (rxBestTime && reactionBest) reactionBest.textContent = `Best: ${rxBestTime}ms`;

    reactionBox.addEventListener('click', () => {
      if (rxState === 'idle' || rxState === 'result') {
        rxState = 'waiting';
        reactionBox.className = 'reaction-box waiting';
        reactionBox.textContent = 'Wait for green...';
        rxTimeout = setTimeout(() => {
          rxState = 'ready';
          reactionBox.className = 'reaction-box ready';
          reactionBox.textContent = 'CLICK NOW!';
          rxStart = Date.now();
        }, 1500 + Math.random() * 3000);
      } else if (rxState === 'waiting') {
        clearTimeout(rxTimeout);
        rxState = 'result';
        reactionBox.className = 'reaction-box result';
        reactionBox.textContent = 'Too early! Click to retry.';
      } else if (rxState === 'ready') {
        const time = Date.now() - rxStart;
        rxState = 'result';
        reactionBox.className = 'reaction-box result';
        reactionBox.textContent = `${time}ms — Click to retry`;
        if (!rxBestTime || time < rxBestTime) {
          rxBestTime = time;
          localStorage.setItem('reaction-best', rxBestTime);
        }
        if (reactionBest) reactionBest.textContent = `Best: ${rxBestTime}ms`;
      }
    });
  }

  /* ==========================================================
     14. QUOTES (categories + save)
     ========================================================== */
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const quoteBtn = document.getElementById('quoteBtn');
  const quoteSave = document.getElementById('quoteSave');
  const quoteCategory = document.getElementById('quoteCategory');
  const savedQuotesEl = document.getElementById('savedQuotes');

  const allQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", cat: "motivation" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", cat: "tech" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson", cat: "tech" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", cat: "wisdom" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck", cat: "tech" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs", cat: "tech" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", cat: "tech" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", cat: "motivation" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", cat: "wisdom" },
    { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", cat: "wisdom" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", cat: "motivation" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", cat: "tech" },
  ];

  let currentQuote = null;

  if (quoteText && quoteAuthor && quoteBtn) {
    function showQuote() {
      const cat = quoteCategory ? quoteCategory.value : 'all';
      const filtered = cat === 'all' ? allQuotes : allQuotes.filter(q => q.cat === cat);
      const q = filtered[Math.floor(Math.random() * filtered.length)];
      currentQuote = q;
      quoteText.textContent = `"${q.text}"`;
      quoteAuthor.textContent = `— ${q.author}`;
    }
    quoteBtn.addEventListener('click', showQuote);
    showQuote();

    if (quoteSave && savedQuotesEl) {
      let savedQuotes = JSON.parse(localStorage.getItem('saved-quotes') || '[]');

      function renderSavedQuotes() {
        savedQuotesEl.innerHTML = savedQuotes.map((q, i) =>
          `<div style="font-size:0.78rem;color:var(--text-muted);padding:4px 0;border-bottom:1px solid var(--border);">
            "${q.text}" — ${q.author}
            <button onclick="removeSavedQuote(${i})" style="background:none;border:none;color:var(--secondary);cursor:pointer;font-size:0.7rem;margin-left:4px;">✕</button>
          </div>`
        ).join('');
      }

      window.removeSavedQuote = function(i) {
        savedQuotes.splice(i, 1);
        localStorage.setItem('saved-quotes', JSON.stringify(savedQuotes));
        renderSavedQuotes();
      };

      quoteSave.addEventListener('click', () => {
        if (currentQuote && !savedQuotes.find(q => q.text === currentQuote.text)) {
          savedQuotes.push(currentQuote);
          localStorage.setItem('saved-quotes', JSON.stringify(savedQuotes));
          renderSavedQuotes();
        }
      });
      renderSavedQuotes();
    }
  }

  /* ==========================================================
     15. CLICK CHALLENGE
     ========================================================== */
  const clickScore = document.getElementById('clickScore');
  const clickerBtn = document.getElementById('clickerBtn');
  const clickerReset = document.getElementById('clickerReset');
  const clickerBestEl = document.getElementById('clickerBest');

  if (clickScore && clickerBtn && clickerReset) {
    let score = 0;
    let best = parseInt(localStorage.getItem('clicker-best') || '0');
    if (clickerBestEl) clickerBestEl.textContent = best;

    clickerBtn.addEventListener('click', () => {
      score++;
      clickScore.textContent = score;
      clickScore.style.transform = 'scale(1.2)';
      setTimeout(() => clickScore.style.transform = 'scale(1)', 120);
      if (score > best) {
        best = score;
        localStorage.setItem('clicker-best', best);
        if (clickerBestEl) clickerBestEl.textContent = best;
      }
    });

    clickerReset.addEventListener('click', () => {
      score = 0;
      clickScore.textContent = score;
    });
  }

  /* ==========================================================
     16. MINI QUIZ
     ========================================================== */
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizScore = document.getElementById('quizScore');
  const quizNext = document.getElementById('quizNext');

  const quizData = [
    { q: "What does CSS stand for?", opts: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"], ans: 0 },
    { q: "Which language runs in a web browser?", opts: ["Java", "C", "Python", "JavaScript"], ans: 3 },
    { q: "What does HTML stand for?", opts: ["Hyper Text Markup Language", "Hot Mail", "How To Make Lasagna", "Hyper Tool Multi Language"], ans: 0 },
    { q: "What year was JavaScript created?", opts: ["1990", "1995", "2000", "2005"], ans: 1 },
    { q: "What does API stand for?", opts: ["Application Program Interface", "Advanced Programming Interface", "Applied Protocol Integration", "App Programming Input"], ans: 0 },
    { q: "Which company developed React?", opts: ["Google", "Microsoft", "Meta (Facebook)", "Apple"], ans: 2 },
    { q: "What symbol is used for comments in Python?", opts: ["//", "#", "/*", "--"], ans: 1 },
    { q: "Git is a ___?", opts: ["Programming language", "Version control system", "Database", "Web server"], ans: 1 },
  ];

  if (quizQuestion && quizOptions && quizNext) {
    let qIdx = 0, qCorrect = 0, qTotal = 0, qAnswered = false;

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    shuffleArray(quizData);

    function showQuestion() {
      if (qIdx >= quizData.length) qIdx = 0;
      qAnswered = false;
      const q = quizData[qIdx];
      quizQuestion.textContent = q.q;
      quizOptions.innerHTML = q.opts.map((o, i) =>
        `<div class="quiz-option" data-i="${i}">${o}</div>`
      ).join('');

      quizOptions.querySelectorAll('.quiz-option').forEach(el => {
        el.addEventListener('click', () => {
          if (qAnswered) return;
          qAnswered = true;
          qTotal++;
          const chosen = parseInt(el.dataset.i);
          const correct = quizData[qIdx].ans;
          el.classList.add(chosen === correct ? 'correct' : 'wrong');
          if (chosen === correct) qCorrect++;
          else quizOptions.querySelector(`[data-i="${correct}"]`).classList.add('correct');
          quizOptions.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));
          if (quizScore) quizScore.textContent = `Score: ${qCorrect}/${qTotal}`;
        });
      });
    }

    showQuestion();
    quizNext.addEventListener('click', () => { qIdx++; showQuestion(); });
  }

  /* ==========================================================
     17. RANDOM FACTS
     ========================================================== */
  const factText = document.getElementById('factText');
  const factBtn = document.getElementById('factBtn');

  const facts = [
    "Honey never spoils. Archaeologists have found 3000-year-old honey that was still edible.",
    "A group of flamingos is called a 'flamboyance'.",
    "The first computer programmer was Ada Lovelace in the 1840s.",
    "Octopuses have three hearts and blue blood.",
    "The first website ever made is still online at info.cern.ch.",
    "JavaScript was created in just 10 days by Brendan Eich in 1995.",
    "A day on Venus is longer than a year on Venus.",
    "The average person walks about 100,000 miles in their lifetime.",
    "There are more possible iterations of a game of chess than atoms in the observable universe.",
    "The first computer bug was an actual bug — a moth — found in a Harvard computer in 1947.",
    "Bananas are berries, but strawberries are not.",
    "The heart of a shrimp is located in its head.",
  ];

  if (factText && factBtn) {
    function showFact() {
      factText.textContent = facts[Math.floor(Math.random() * facts.length)];
    }
    factBtn.addEventListener('click', showFact);
    showFact();
  }

  /* ==========================================================
     18. ANONYMOUS MESSAGE
     ========================================================== */
  const anonMessage = document.getElementById('anonMessage');
  const anonSend = document.getElementById('anonSend');
  const anonStatus = document.getElementById('anonStatus');
  const anonFormWrap = document.getElementById('anonFormWrap');
  const anonSuccess = document.getElementById('anonSuccess');
  const anonAnother = document.getElementById('anonAnother');

  if (anonSend && anonMessage) {
    anonSend.addEventListener('click', async () => {
      const msg = anonMessage.value.trim();
      if (!msg) { anonStatus.textContent = 'Please write a message first.'; return; }
      anonStatus.textContent = 'Transmitting...';
      anonSend.disabled = true;

      try {
        const res = await fetch(API_URL + '/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        if (res.ok) {
          anonFormWrap.style.display = 'none';
          anonSuccess.style.display = 'block';
        } else {
          throw new Error('Failed');
        }
      } catch {
        // Fallback: save locally if backend is not available
        let localMsgs = JSON.parse(localStorage.getItem('anon-messages') || '[]');
        localMsgs.push({ message: msg, date: new Date().toISOString() });
        localStorage.setItem('anon-messages', JSON.stringify(localMsgs));
        anonFormWrap.style.display = 'none';
        anonSuccess.style.display = 'block';
      }
    });

    if (anonAnother) {
      anonAnother.addEventListener('click', () => {
        anonMessage.value = '';
        anonSend.disabled = false;
        anonStatus.textContent = '';
        anonFormWrap.style.display = 'block';
        anonSuccess.style.display = 'none';
      });
    }
  }

  /* ==========================================================
     19. VISITOR ANALYTICS (simple page view counter)
     ========================================================== */
  try {
    fetch(API_URL + '/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: window.location.pathname })
    }).catch(() => {});
  } catch {}

  /* ==========================================================
     20. AI CHATBOT
     ========================================================== */
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
      if (chatWindow.classList.contains('open')) {
        chatInput.focus();
        chatToggle.textContent = '✕';
      } else {
        chatToggle.textContent = '🤖';
      }
    });

    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('open');
      chatToggle.textContent = '🤖';
    });

    async function sendChatMessage() {
      const msg = chatInput.value.trim();
      if (!msg) return;

      // Add user message
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-message user';
      userDiv.textContent = msg;
      chatBody.appendChild(userDiv);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;

      // Add loading bot message
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-message bot';
      botDiv.textContent = 'Thinking...';
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;

      try {
        const res = await fetch(API_URL + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        botDiv.textContent = data.reply || 'Sorry, I encountered an error.';
      } catch (err) {
        botDiv.textContent = 'Could not connect to the server.';
      }
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    chatSend.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

});
