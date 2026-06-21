/* โหมดเติมคำ: พิมพ์คำราชาศัพท์ลงในช่องว่างของประโยค */
const FillGame = {
  key: "fill",
  title: "เติมคำ",
  icon: "✍️",
  desc: "พิมพ์คำราชาศัพท์ลงในประโยค",
  scored: true,

  start(words, api) {
    const area = api.area;
    let idx = 0;

    // ตัดช่องว่างและอักขระที่ไม่ใช่ตัวอักษรไทยออกเพื่อเทียบคำตอบแบบยืดหยุ่น
    function normalize(s) {
      return (s || "").replace(/\s+/g, "").replace(/[.,!?"'()]/g, "").trim();
    }

    function isAccepted(input, w) {
      const n = normalize(input);
      if (!n) return false;
      const answers = [w.royal, ...(w.alt || [])].map(normalize);
      return answers.includes(n);
    }

    function renderQ() {
      const w = words[idx];
      api.setProgress(idx + 1, words.length);
      const sentence = w.example.replace("{royal}", '<span class="fill-blank">__________</span>');

      area.innerHTML = `
        <div class="question-prompt">
          <div class="q-label">เติมคำราชาศัพท์ของคำว่า</div>
          <div class="q-word">${w.common}</div>
          <div class="fill-sentence">${sentence}</div>
          <span class="q-category-badge">${CATEGORIES[w.category].icon} ${CATEGORIES[w.category].name}</span>
        </div>
        <input type="text" class="fill-input" id="fill-in" placeholder="พิมพ์คำราชาศัพท์ที่นี่..." autocomplete="off" />
        <button class="btn btn-primary btn-lg" id="fill-submit" style="margin-top:14px">ตรวจคำตอบ</button>
        <div id="fill-feedback"></div>
      `;

      const input = area.querySelector("#fill-in");
      input.focus();
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submit();
      });
      area.querySelector("#fill-submit").onclick = submit;

      function submit() {
        const val = input.value;
        if (!normalize(val)) {
          input.focus();
          return;
        }
        const ok = isAccepted(val, w);
        input.disabled = true;
        area.querySelector("#fill-submit").style.display = "none";
        if (ok) api.markCorrect(w);
        else api.markWrong(w, val);
        showFeedback(w, ok);
      }
    }

    function showFeedback(w, ok) {
      const fb = area.querySelector("#fill-feedback");
      fb.className = "feedback " + (ok ? "ok" : "no");
      const altText = (w.alt && w.alt.length) ? " (หรือ " + w.alt.join(", ") + ")" : "";
      fb.innerHTML = `
        <div>${ok ? "✅ ถูกต้อง!" : "❌ คำตอบที่ถูกคือ <b>" + w.royal + "</b>" + altText}</div>
        <button class="speak-btn" id="f-speak">🔊 ฟังเสียง "${w.royal}"</button><br>
        <button class="btn btn-primary btn-sm next-btn" id="f-next">${idx + 1 >= words.length ? "ดูผลคะแนน" : "ข้อถัดไป →"}</button>
      `;
      fb.querySelector("#f-speak").onclick = () => Sound.speak(w.royal);
      fb.querySelector("#f-next").onclick = next;
    }

    function next() {
      idx++;
      if (idx >= words.length) api.finish();
      else renderQ();
    }

    renderQ();
  },
};
