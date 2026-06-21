/* ============ ตัวควบคุมหลักของแอป ============ */

// ---------- ยูทิลิตี้ ----------
const Util = {
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
};

// ---------- รายการโหมดเกม ----------
const GAMES = [QuizGame, MatchingGame, FillGame, FlashcardGame];
const GAME_BY_KEY = {};
GAMES.forEach((g) => (GAME_BY_KEY[g.key] = g));

// ---------- จัดการสถิติด้วย localStorage ----------
const STORAGE_KEY = "thaiRoyalGameStats_v1";
const Stats = {
  data: { gamesPlayed: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, byMode: {} },
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.data = Object.assign(this.data, JSON.parse(raw));
    } catch (e) {}
  },
  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); } catch (e) {}
  },
  record(modeKey, score, correct, total) {
    this.data.gamesPlayed++;
    this.data.totalCorrect += correct;
    this.data.totalQuestions += total;
    if (score > this.data.bestScore) this.data.bestScore = score;
    const m = this.data.byMode[modeKey] || { played: 0, best: 0 };
    m.played++;
    if (score > m.best) m.best = score;
    this.data.byMode[modeKey] = m;
    this.save();
  },
  reset() {
    this.data = { gamesPlayed: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, byMode: {} };
    this.save();
  },
};

// ---------- สถานะการตั้งค่าและเซสชัน ----------
const setup = { mode: null, category: "all", level: "all", count: 10 };
let session = null;

// ---------- การนำทางหน้าจอ ----------
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById("screen-" + id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- หน้าเมนูหลัก ----------
function renderHome() {
  const grid = document.getElementById("mode-grid");
  grid.innerHTML = "";
  GAMES.forEach((g) => {
    const card = document.createElement("div");
    card.className = "mode-card";
    card.innerHTML = `
      <span class="mode-icon">${g.icon}</span>
      <div class="mode-name">${g.title}</div>
      <div class="mode-desc">${g.desc}</div>
    `;
    card.onclick = () => openSetup(g.key);
    grid.appendChild(card);
  });
  renderHomeStats();
}

function renderHomeStats() {
  const d = Stats.data;
  const acc = d.totalQuestions ? Math.round((d.totalCorrect / d.totalQuestions) * 100) : 0;
  const row = document.getElementById("stats-row");
  row.innerHTML = `
    <div class="stat-card"><div class="stat-num">${d.gamesPlayed}</div><div class="stat-label">เล่นไปแล้ว (ครั้ง)</div></div>
    <div class="stat-card"><div class="stat-num">${acc}%</div><div class="stat-label">ความแม่นยำ</div></div>
    <div class="stat-card"><div class="stat-num">${d.bestScore}</div><div class="stat-label">คะแนนสูงสุด</div></div>
    <div class="stat-card"><div class="stat-num">${VOCAB.length}</div><div class="stat-label">คำศัพท์ทั้งหมด</div></div>
  `;
}

// ---------- หน้าตั้งค่า ----------
function openSetup(modeKey) {
  setup.mode = modeKey;
  const g = GAME_BY_KEY[modeKey];
  document.getElementById("setup-title").textContent = `${g.icon} ${g.title} — ตั้งค่า`;

  // สร้างชิปหมวดหมู่
  const catWrap = document.getElementById("category-chips");
  catWrap.innerHTML = `<button class="chip active" data-cat="all">ทุกหมวด</button>`;
  Object.keys(CATEGORIES).forEach((key) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.dataset.cat = key;
    b.textContent = `${CATEGORIES[key].icon} ${CATEGORIES[key].name}`;
    catWrap.appendChild(b);
  });

  setup.category = "all";
  setup.level = "all";
  setup.count = 10;
  bindChipGroup(catWrap, "cat", (v) => { setup.category = v; updateAvailable(); });
  bindChipGroup(document.getElementById("level-chips"), "level", (v) => { setup.level = v; updateAvailable(); });
  bindChipGroup(document.getElementById("count-chips"), "count", (v) => { setup.count = parseInt(v, 10); updateAvailable(); });

  // ตั้งค่า default active ให้ตรงกับ setup
  setActiveChip(document.getElementById("level-chips"), "level", "all");
  setActiveChip(document.getElementById("count-chips"), "count", "10");

  updateAvailable();
  showScreen("setup");
}

function bindChipGroup(wrap, attr, cb) {
  wrap.querySelectorAll(".chip").forEach((chip) => {
    chip.onclick = () => {
      wrap.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      Sound.click();
      cb(chip.dataset[attr]);
    };
  });
}
function setActiveChip(wrap, attr, val) {
  wrap.querySelectorAll(".chip").forEach((c) =>
    c.classList.toggle("active", c.dataset[attr] === val)
  );
}

function getFilteredWords() {
  return VOCAB.filter((w) => {
    if (setup.category !== "all" && w.category !== setup.category) return false;
    if (setup.level !== "all" && w.level !== parseInt(setup.level, 10)) return false;
    return true;
  });
}

function updateAvailable() {
  const n = getFilteredWords().length;
  const el = document.getElementById("setup-available");
  const want = setup.count === 0 ? n : Math.min(setup.count, n);
  el.textContent = `มีคำที่ตรงเงื่อนไข ${n} คำ — จะเล่น ${want} ข้อ`;
  document.getElementById("btn-start-game").disabled = n === 0;
}

// ---------- เริ่มเกม ----------
function startGame() {
  let pool = getFilteredWords();
  if (pool.length === 0) return;
  pool = Util.shuffle(pool);
  if (setup.count > 0) pool = pool.slice(0, setup.count);

  const game = GAME_BY_KEY[setup.mode];
  session = {
    mode: setup.mode,
    scored: game.scored,
    words: pool,
    score: 0,
    combo: 0,
    maxCombo: 0,
    answers: [],
    total: pool.length,
    startTime: Date.now(),
  };

  showScreen("game");
  document.getElementById("meta-combo").textContent = "";
  updateMeta();
  startTimer();

  const api = buildApi();
  game.start(pool, api);
}

// ---------- API ที่ส่งให้โมดูลเกม ----------
function buildApi() {
  return {
    area: document.getElementById("game-area"),
    setProgress(cur, total) {
      document.getElementById("meta-progress").textContent = `ข้อ ${cur}/${total}`;
      const pct = total ? (cur / total) * 100 : 0;
      document.getElementById("progress-fill").style.width = pct + "%";
    },
    markCorrect(word) {
      session.combo++;
      if (session.combo > session.maxCombo) session.maxCombo = session.combo;
      // คะแนนพื้นฐาน 10 + โบนัสตามระดับ + โบนัสคอมโบ
      const base = 10 + (word.level - 1) * 5;
      const bonus = Math.min(session.combo - 1, 5) * 2;
      session.score += base + bonus;
      session.answers.push({ word, correct: true });
      Sound.correct();
      updateMeta();
      flashCombo();
    },
    markWrong(word, userAnswer) {
      session.combo = 0;
      session.answers.push({ word, correct: false, userAnswer });
      Sound.wrong();
      updateMeta();
    },
    finish() { finishGame(); },
  };
}

function flashCombo() {
  if (session.combo >= 2) {
    const el = document.getElementById("meta-combo");
    el.textContent = `🔥 คอมโบ x${session.combo}`;
    el.style.transform = "scale(1.25)";
    setTimeout(() => (el.style.transform = "scale(1)"), 180);
  } else {
    document.getElementById("meta-combo").textContent = "";
  }
}

function updateMeta() {
  document.getElementById("meta-score").textContent = `⭐ ${session.score}`;
}

// ---------- จับเวลา ----------
let timerInterval = null;
function startTimer() {
  clearInterval(timerInterval);
  const el = document.getElementById("meta-timer");
  timerInterval = setInterval(() => {
    const s = Math.floor((Date.now() - session.startTime) / 1000);
    el.textContent = `⏱ ${s}s`;
  }, 500);
}
function stopTimer() { clearInterval(timerInterval); }

// ---------- จบเกม / สรุปผล ----------
function finishGame() {
  stopTimer();
  const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
  const correct = session.answers.filter((a) => a.correct).length;
  const total = session.scored ? session.answers.length : session.total;

  if (session.scored && total > 0) {
    Stats.record(session.mode, session.score, correct, total);
  } else {
    // โหมดทบทวน นับเป็นการเล่น 1 ครั้งแต่ไม่กระทบความแม่นยำ
    Stats.data.gamesPlayed++;
    Stats.save();
  }

  Sound.win();
  renderResult(correct, total, elapsed);
  showScreen("result");
}

function renderResult(correct, total, elapsed) {
  const scored = session.scored;
  const pct = total ? Math.round((correct / total) * 100) : 100;

  let emoji = "🎉", title = "ทบทวนครบแล้ว!";
  if (scored) {
    if (pct >= 90) { emoji = "🏆"; title = "ยอดเยี่ยมมาก!"; }
    else if (pct >= 70) { emoji = "🎉"; title = "เก่งมาก!"; }
    else if (pct >= 50) { emoji = "👍"; title = "ทำได้ดี ลองอีกครั้งนะ"; }
    else { emoji = "💪"; title = "ฝึกต่อไป สู้ ๆ!"; }
  }

  document.getElementById("result-emoji").textContent = emoji;
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-score").textContent = scored ? `⭐ ${session.score} คะแนน` : "📚 ทบทวนเสร็จสิ้น";

  let detail = `ใช้เวลา ${elapsed} วินาที`;
  if (scored) {
    detail = `ตอบถูก ${correct}/${total} ข้อ (${pct}%) · คอมโบสูงสุด x${session.maxCombo} · ⏱ ${elapsed}s`;
  }
  document.getElementById("result-detail").textContent = detail;

  // รายการทบทวนคำตอบ
  const review = document.getElementById("result-review");
  if (scored && session.answers.length) {
    let html = `<h3 class="section-title" style="margin-top:0">📋 ทบทวนคำตอบ</h3>`;
    session.answers.forEach((a) => {
      const cls = a.correct ? "ok" : "no";
      html += `
        <div class="review-item ${cls}">
          <span><span class="rv-mark">${a.correct ? "✓" : "✗"}</span> ${a.word.common}</span>
          <span class="rv-ans">${a.word.royal}</span>
        </div>`;
    });
    review.innerHTML = html;
  } else {
    review.innerHTML = "";
  }
}

// ---------- ปุ่มควบคุมส่วนกลาง ----------
function bindGlobalControls() {
  document.querySelectorAll("[data-go]").forEach((b) => {
    b.onclick = () => {
      stopTimer();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      const target = b.dataset.go;
      if (target === "home") renderHome();
      showScreen(target);
    };
  });

  document.getElementById("btn-start-game").onclick = startGame;
  document.getElementById("btn-replay").onclick = () => openSetup(session.mode);

  document.getElementById("btn-reset-stats").onclick = () => {
    if (confirm("ต้องการล้างสถิติทั้งหมดใช่หรือไม่?")) {
      Stats.reset();
      renderHomeStats();
    }
  };

  const soundBtn = document.getElementById("btn-sound-toggle");
  soundBtn.onclick = () => {
    const on = !Sound.isEnabled();
    Sound.setEnabled(on);
    soundBtn.textContent = on ? "🔊 เสียง: เปิด" : "🔇 เสียง: ปิด";
  };
}

// ---------- เริ่มต้นแอป ----------
function init() {
  Stats.load();
  bindGlobalControls();
  renderHome();
  showScreen("home");
}
document.addEventListener("DOMContentLoaded", init);
