/* โหมดบัตรคำ: พลิกบัตรเพื่อทบทวนความหมาย (ไม่นับคะแนน) */
const FlashcardGame = {
  key: "flashcard",
  title: "บัตรคำทบทวน",
  icon: "🃏",
  desc: "พลิกบัตรดูคำราชาศัพท์ เหมาะกับการทบทวน",
  scored: false,

  start(words, api) {
    const area = api.area;
    let idx = 0;
    let flipped = false;

    function render() {
      const w = words[idx];
      api.setProgress(idx + 1, words.length);
      flipped = false;

      area.innerHTML = `
        <div class="flashcard" id="flashcard">
          <div class="flashcard-inner">
            <div class="flashcard-face flashcard-front">
              <div class="fc-small">คำสามัญ</div>
              <div class="fc-big">${w.common}</div>
              <span class="q-category-badge">${CATEGORIES[w.category].icon} ${CATEGORIES[w.category].name}</span>
              <div class="fc-flip-hint">👆 แตะเพื่อดูคำราชาศัพท์</div>
            </div>
            <div class="flashcard-face flashcard-back">
              <div class="fc-small">คำราชาศัพท์</div>
              <div class="fc-big">${w.royal}</div>
              <div class="fc-example">${w.example.replace("{royal}", w.royal)}</div>
            </div>
          </div>
        </div>
        <div style="text-align:center;margin-top:14px">
          <button class="speak-btn" id="fc-speak">🔊 ฟังเสียงคำราชาศัพท์</button>
        </div>
        <div class="flashcard-nav">
          <button class="btn btn-ghost" id="fc-prev">← ก่อนหน้า</button>
          <span class="fc-counter" id="fc-counter">${idx + 1} / ${words.length}</span>
          <button class="btn btn-primary" id="fc-next">${idx + 1 >= words.length ? "จบการทบทวน" : "ถัดไป →"}</button>
        </div>
      `;

      const card = area.querySelector("#flashcard");
      card.onclick = () => {
        flipped = !flipped;
        card.classList.toggle("flipped", flipped);
        if (flipped) Sound.speak(w.royal);
      };
      area.querySelector("#fc-speak").onclick = (e) => {
        e.stopPropagation();
        Sound.speak(w.royal);
      };
      area.querySelector("#fc-prev").onclick = () => {
        if (idx > 0) { idx--; render(); }
      };
      area.querySelector("#fc-next").onclick = () => {
        if (idx + 1 >= words.length) api.finish();
        else { idx++; render(); }
      };
    }

    render();
  },
};
