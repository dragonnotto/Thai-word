/* โหมดควิซปรนัย 4 ตัวเลือก: เลือกคำราชาศัพท์ให้ตรงกับคำสามัญ */
const QuizGame = {
  key: "quiz",
  title: "ควิซปรนัย",
  icon: "📝",
  desc: "เลือกคำราชาศัพท์ให้ถูกต้อง 4 ตัวเลือก",
  scored: true,

  start(words, api) {
    const area = api.area;
    let idx = 0;

    function buildOptions(w) {
      // เลือกตัวลวง 3 คำ เน้นหมวดเดียวกันก่อน เพื่อให้ท้าทาย
      const sameCat = VOCAB.filter(
        (o) => o.id !== w.id && o.category === w.category && o.royal !== w.royal
      );
      const others = VOCAB.filter((o) => o.id !== w.id && o.royal !== w.royal);
      const pool = Util.shuffle(sameCat.length >= 3 ? sameCat : others);
      const distractors = [];
      for (const o of pool) {
        if (distractors.length >= 3) break;
        if (!distractors.includes(o.royal) && o.royal !== w.royal) distractors.push(o.royal);
      }
      return Util.shuffle([w.royal, ...distractors]);
    }

    function renderQ() {
      const w = words[idx];
      api.setProgress(idx + 1, words.length);
      const opts = buildOptions(w);

      area.innerHTML = `
        <div class="question-prompt">
          <div class="q-label">คำราชาศัพท์ของคำว่า</div>
          <div class="q-word">${w.common}</div>
          <span class="q-category-badge">${CATEGORIES[w.category].icon} ${CATEGORIES[w.category].name}</span>
        </div>
        <div class="options-grid" id="opts"></div>
        <div id="qfeedback"></div>
      `;

      const grid = area.querySelector("#opts");
      opts.forEach((opt) => {
        const b = document.createElement("button");
        b.className = "option-btn";
        b.textContent = opt;
        b.onclick = () => answer(b, opt, w);
        grid.appendChild(b);
      });
    }

    function answer(btn, chosen, w) {
      const buttons = area.querySelectorAll(".option-btn");
      buttons.forEach((b) => {
        b.disabled = true;
        if (b.textContent === w.royal) b.classList.add("correct");
      });
      const ok = chosen === w.royal;
      if (ok) {
        api.markCorrect(w);
      } else {
        btn.classList.add("wrong");
        api.markWrong(w, chosen);
      }
      showFeedback(w, ok);
    }

    function showFeedback(w, ok) {
      const fb = area.querySelector("#qfeedback");
      fb.className = "feedback " + (ok ? "ok" : "no");
      fb.innerHTML = `
        <div>${ok ? "✅ ถูกต้อง!" : "❌ คำตอบที่ถูกคือ <b>" + w.royal + "</b>"}</div>
        <div style="margin-top:6px;font-size:0.9rem;opacity:0.85">${w.example.replace("{royal}", w.royal)}</div>
        <button class="speak-btn" id="q-speak">🔊 ฟังเสียง "${w.royal}"</button><br>
        <button class="btn btn-primary btn-sm next-btn" id="q-next">${idx + 1 >= words.length ? "ดูผลคะแนน" : "ข้อถัดไป →"}</button>
      `;
      fb.querySelector("#q-speak").onclick = () => Sound.speak(w.royal);
      fb.querySelector("#q-next").onclick = next;
    }

    function next() {
      idx++;
      if (idx >= words.length) api.finish();
      else renderQ();
    }

    renderQ();
  },
};
