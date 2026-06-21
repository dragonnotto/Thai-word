/*
 * โมดูลเสียง: เสียงประกอบ (ถูก/ผิด) ด้วย Web Audio API
 * และการอ่านออกเสียงภาษาไทยด้วย SpeechSynthesis (Text-to-Speech)
 */
const Sound = (() => {
  let enabled = true;
  let ctx = null;

  function ensureCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        ctx = null;
      }
    }
    // บางเบราว์เซอร์ pause context จนกว่าจะมี user gesture
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // เล่นโน้ตชุดหนึ่ง (ความถี่ Hz, เวลาเริ่ม, ระยะเวลา)
  function tone(freqs, dur = 0.12, type = "sine") {
    const ac = ensureCtx();
    if (!ac) return;
    let t = ac.currentTime;
    freqs.forEach((f) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur;
    });
  }

  function correct() {
    if (!enabled) return;
    tone([659.25, 783.99, 1046.5], 0.11, "triangle"); // E5-G5-C6 ขึ้น
  }
  function wrong() {
    if (!enabled) return;
    tone([311.13, 233.08], 0.18, "sawtooth"); // ลง ดูเศร้า
  }
  function win() {
    if (!enabled) return;
    tone([523.25, 659.25, 783.99, 1046.5], 0.14, "triangle");
  }
  function click() {
    if (!enabled) return;
    tone([440], 0.05, "sine");
  }

  // อ่านออกเสียงภาษาไทย
  let thaiVoice = null;
  function pickVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    thaiVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("th")) || null;
  }
  if (window.speechSynthesis) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text) {
    if (!enabled || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "th-TH";
    if (thaiVoice) u.voice = thaiVoice;
    u.rate = 0.9;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }

  function setEnabled(v) {
    enabled = v;
    if (!v && window.speechSynthesis) window.speechSynthesis.cancel();
  }
  function isEnabled() { return enabled; }

  return { correct, wrong, win, click, speak, setEnabled, isEnabled };
})();
