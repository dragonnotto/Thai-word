/* โหมดจับคู่คำ: คลิกคำสามัญ แล้วคลิกคำราชาศัพท์ที่ตรงกัน */
const MatchingGame = {
  key: "matching",
  title: "จับคู่คำ",
  icon: "🔗",
  desc: "จับคู่คำสามัญกับคำราชาศัพท์",
  scored: true,

  start(words, api) {
    const area = api.area;
    // เล่นเป็นชุดละ 5 คู่ เพื่อไม่ให้กระดานยาวเกินไป
    const PER_ROUND = 5;
    const rounds = [];
    for (let i = 0; i < words.length; i += PER_ROUND) {
      rounds.push(words.slice(i, i + PER_ROUND));
    }
    let roundIdx = 0;

    function renderRound() {
      const set = rounds[roundIdx];
      api.setProgress(roundIdx + 1, rounds.length);

      const lefts = set.map((w) => ({ id: w.id, text: w.common, word: w }));
      const rights = Util.shuffle(set.map((w) => ({ id: w.id, text: w.royal })));

      area.innerHTML = `
        <div class="question-prompt" style="padding:14px">
          <div class="q-label">คลิกเลือกคำทางซ้าย แล้วจับคู่กับคำราชาศัพท์ทางขวา</div>
          <div style="font-size:0.85rem;color:#7a6a52;margin-top:4px">ชุดที่ ${roundIdx + 1} / ${rounds.length}</div>
        </div>
        <div class="match-wrap">
          <div class="match-col"><h3>คำสามัญ</h3><div id="col-left"></div></div>
          <div class="match-col"><h3>คำราชาศัพท์</h3><div id="col-right"></div></div>
        </div>
        <div id="match-feedback"></div>
      `;

      const colLeft = area.querySelector("#col-left");
      const colRight = area.querySelector("#col-right");

      lefts.forEach((it) => {
        const el = document.createElement("div");
        el.className = "match-item";
        el.textContent = it.text;
        el.dataset.id = it.id;
        el.dataset.side = "left";
        el.onclick = () => pick(el);
        colLeft.appendChild(el);
      });
      rights.forEach((it) => {
        const el = document.createElement("div");
        el.className = "match-item";
        el.textContent = it.text;
        el.dataset.id = it.id;
        el.dataset.side = "right";
        el.onclick = () => pick(el);
        colRight.appendChild(el);
      });

      let selectedLeft = null;
      let matchedCount = 0;
      const wordById = {};
      set.forEach((w) => (wordById[w.id] = w));

      function pick(el) {
        if (el.classList.contains("matched")) return;
        Sound.click();

        if (el.dataset.side === "left") {
          if (selectedLeft) selectedLeft.classList.remove("selected");
          selectedLeft = el;
          el.classList.add("selected");
          return;
        }
        // คลิกฝั่งขวา
        if (!selectedLeft) return;
        const w = wordById[selectedLeft.dataset.id];
        if (el.dataset.id === selectedLeft.dataset.id) {
          // ถูกต้อง
          selectedLeft.classList.remove("selected");
          selectedLeft.classList.add("matched");
          el.classList.add("matched");
          api.markCorrect(w);
          selectedLeft = null;
          matchedCount++;
          if (matchedCount === set.length) roundDone();
        } else {
          // ผิด
          el.classList.add("miss");
          selectedLeft.classList.add("miss");
          const wrongWord = w;
          api.markWrong(wrongWord, el.textContent);
          setTimeout(() => {
            el.classList.remove("miss");
            if (selectedLeft) {
              selectedLeft.classList.remove("miss", "selected");
              selectedLeft = null;
            }
          }, 450);
        }
      }

      function roundDone() {
        const fb = area.querySelector("#match-feedback");
        fb.className = "feedback ok";
        fb.innerHTML = `
          <div>🎉 จับคู่ครบชุดนี้แล้ว!</div>
          <button class="btn btn-primary btn-sm next-btn" id="m-next">${
            roundIdx + 1 >= rounds.length ? "ดูผลคะแนน" : "ชุดถัดไป →"
          }</button>
        `;
        fb.querySelector("#m-next").onclick = () => {
          roundIdx++;
          if (roundIdx >= rounds.length) api.finish();
          else renderRound();
        };
      }
    }

    renderRound();
  },
};
