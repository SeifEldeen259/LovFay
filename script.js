/* ========================================================================== 
   EDIT ONLY THIS CONFIGURATION SECTION
   ========================================================================== */
const CONFIG = {
  music: "music/Ramy Sabry - Kelma _ رامي صبري - كلمه(MP3_160K).mp3",
  finalLetter: `My love,\n\nEvery little moment with you becomes a memory I want to keep forever. Thank you for making ordinary days feel special, simply by being in them.\n\nHere is to all the beautiful places still waiting for us—and every small laugh between them.\n\nWith all my heart, always.`,
  memories: [
    { title: "Study dates", message: "Even the quiet moments feel special with you.", image: "images/photo_10_2026-08-06_11-20-21.jpg", story: "Some of my favorite memories are the simplest ones: sitting beside you, sharing a table, and feeling completely at home." },
    { title: "Coffee & conversations", message: "You, me, and a little pause from the world.", image: "images/photo_13_2026-08-06_11-20-21.jpg", story: "Every conversation with you has a way of becoming the best part of my day. I could stay here with you forever." },
    { title: "Your everyday magic", message: "You make ordinary days look beautiful.", image: "images/photo_17_2026-08-06_11-20-21.jpg", story: "There is something so lovely about seeing you just being you. It is a reminder that my favorite place is anywhere you are." },
    { title: "Us", message: "One photo, a thousand reasons to smile.", image: "images/photo_35_2026-08-06_11-20-22.jpg", story: "This is us: imperfect, real, and my favorite kind of happy. Thank you for letting me share this story with you." },
    { title: "Our people, our moments", message: "Love is even sweeter when it is shared.", image: "images/photo_40_2026-08-06_11-20-22.jpg", story: "The best memories are never only about where we were. They are about who was there, and every smile we got to share." },
    { title: "My favorite view", message: "And somehow, I still fall for you more.", image: "images/photo_45_2026-08-06_11-20-22.jpg", story: "No matter how many memories we make, I will always want one more with you. This is only the beginning of our beautiful story." }
  ]
};

/* ========================================================================== 
   APPLICATION — no edits needed below this line
   ========================================================================== */
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const elements = {
    screens: [...document.querySelectorAll(".screen")], loading: $("#loading-screen"), welcome: $("#welcome-screen"), question: $("#question-screen"), gallery: $("#gallery-screen"), final: $("#final-screen"),
    start: $("#start-button"), no: $("#no-button"), yes: $("#yes-button"), questionActions: $("#question-actions"), questionCard: $(".question-card"), questionMessage: $("#question-message"),
    audio: $("#background-music"), musicToggle: $("#music-toggle"), musicLabel: $("#music-label"), particles: $("#particles"), hearts: $("#hearts"), toast: $("#toast"), celebration: $("#celebration"), heartLogo: $("#heart-logo"),
    card: $("#memory-card"), counter: $("#memory-counter"), memoryTitle: $("#memory-title"), memoryMessage: $("#memory-message"), memoryImage: $("#memory-image"), storyTitle: $("#story-title"), memoryStory: $("#memory-story"), flip: $("#flip-button"), flipBack: $("#flip-back-button"), previous: $("#previous-button"), next: $("#next-button"),
    letterText: $("#letter-text"), always: $("#always-button")
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const playfulMessages = ["Nice try 😏", "That option is unavailable.", "Mission failed 😂", "You really thought that would work?", "Absolutely not ❤️"];
  let memoryIndex = 0;
  let yesAttempts = 0;
  let logoTaps = 0;
  let lastPhotoTap = 0;
  let longPressTimer;
  let lastYesEscape = 0;

  const random = (min, max) => Math.random() * (max - min) + min;
  const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  function showScreen(screen) {
    elements.screens.forEach((item) => item.classList.toggle("is-hidden", item !== screen));
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
  }

  function createAtmosphere() {
    const particleCount = window.innerWidth >= 768 ? 34 : 22;
    const heartCount = window.innerWidth >= 768 ? 12 : 8;
    for (let i = 0; i < particleCount; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.cssText = `left:${random(3, 97)}%;top:${random(3, 97)}%;--size:${random(1, 3.2).toFixed(1)}px;--opacity:${random(.3, .9).toFixed(2)};--duration:${random(2.8, 6.8).toFixed(1)}s;--delay:-${random(0, 6).toFixed(1)}s`;
      elements.particles.append(particle);
    }
    if (reducedMotion) return;
    for (let i = 0; i < heartCount; i += 1) {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = i % 3 ? "♥" : "♡";
      heart.style.cssText = `--left:${random(1, 97)}%;--size:${random(.7, 1.5).toFixed(2)}rem;--opacity:${random(.18, .62).toFixed(2)};--duration:${random(12, 22).toFixed(1)}s;--delay:-${random(0, 20).toFixed(1)}s;--drift:${random(-70, 70).toFixed(0)}px`;
      elements.hearts.append(heart);
    }
  }

  function setMusicState(isPlaying) {
    elements.musicToggle.classList.toggle("is-playing", isPlaying);
    elements.musicToggle.setAttribute("aria-pressed", String(isPlaying));
    elements.musicToggle.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
    elements.musicLabel.textContent = isPlaying ? "Pause" : "Music";
  }

  async function toggleMusic() {
    if (!elements.audio.src) elements.audio.src = CONFIG.music;
    if (elements.audio.paused) {
      try { await elements.audio.play(); setMusicState(true); }
      catch { elements.musicLabel.textContent = "Add music"; }
    } else { elements.audio.pause(); }
  }

  function escapeYesButton(event) {
    event.preventDefault();
    lastYesEscape = Date.now();
    yesAttempts += 1;
    const actions = elements.questionActions.getBoundingClientRect();
    const button = elements.yes.getBoundingClientRect();
    const x = random(4, Math.max(5, actions.width - button.width - 4));
    const y = random(4, Math.max(5, actions.height - button.height - 4));
    elements.yes.classList.add("is-escaping");
    elements.yes.style.left = `${x}px`;
    elements.yes.style.top = `${y}px`;
    elements.yes.style.transform = `rotate(${random(-9, 9)}deg)`;
    elements.questionMessage.textContent = yesAttempts >= 6 ? "You'll have to keep me forever ❤️" : playfulMessages[(yesAttempts - 1) % playfulMessages.length];
    if (yesAttempts >= 3) {
      elements.questionCard.classList.remove("is-shaking");
      void elements.questionCard.offsetWidth;
      elements.questionCard.classList.add("is-shaking");
    }
  }

  async function acceptNo() {
    elements.no.disabled = true;
    elements.questionMessage.textContent = "I knew you would say no 😁";
    await delay(reducedMotion ? 1 : 1250);
    memoryIndex = 0;
    renderMemory();
    showScreen(elements.gallery);
  }

  function renderMemory(direction = 1) {
    const memory = CONFIG.memories[memoryIndex];
    if (!memory) return;
    elements.card.classList.remove("is-flipped", "is-changing");
    elements.memoryTitle.textContent = memory.title;
    elements.memoryMessage.textContent = memory.message;
    elements.memoryImage.src = memory.image;
    elements.memoryImage.alt = memory.title;
    elements.storyTitle.textContent = memory.title;
    elements.memoryStory.textContent = memory.story;
    elements.counter.textContent = `Memory ${memoryIndex + 1} of ${CONFIG.memories.length}`;
    elements.previous.disabled = memoryIndex === 0;
    elements.next.querySelector("span").textContent = memoryIndex === CONFIG.memories.length - 1 ? "One Last Thing..." : "Next";
    elements.card.style.setProperty("--slide", `${direction * 24}px`);
    void elements.card.offsetWidth;
    elements.card.classList.add("is-changing");
  }

  function moveMemory(direction) {
    if (memoryIndex === CONFIG.memories.length - 1 && direction > 0) return openFinalLetter();
    const nextIndex = Math.max(0, Math.min(CONFIG.memories.length - 1, memoryIndex + direction));
    if (nextIndex === memoryIndex) return;
    memoryIndex = nextIndex;
    renderMemory(direction);
  }

  async function openFinalLetter() {
    showScreen(elements.final);
    elements.final.classList.remove("is-celebrating");
    await delay(reducedMotion ? 1 : 230);
    elements.final.classList.add("is-open");
    typeLetter(CONFIG.finalLetter);
  }

  async function typeLetter(text) {
    elements.letterText.textContent = "";
    if (reducedMotion) { elements.letterText.textContent = text; return; }
    for (const character of text) {
      elements.letterText.textContent += character;
      await delay(character === "\n" ? 45 : 12);
    }
  }

  function createBurst(x, y, count = 14) {
    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement("span");
      heart.className = "burst-heart";
      heart.textContent = i % 3 ? "♥" : "✦";
      heart.style.cssText = `--x:${x}px;--y:${y}px;--size:${random(.75, 1.55).toFixed(2)}rem;--tx:${random(-90, 90).toFixed(0)}px;--ty:${random(-120, -25).toFixed(0)}px`;
      document.body.append(heart);
      heart.addEventListener("animationend", () => heart.remove(), { once: true });
    }
  }

  function celebrate() {
    elements.final.classList.add("is-celebrating");
    createBurst(window.innerWidth / 2, window.innerHeight * .55, 30);
    const colors = ["#ffd4d7", "#f0bd78", "#ffffff", "#e85b7a"];
    for (let i = 0; i < 90; i += 1) {
      const confetti = document.createElement("span");
      confetti.className = "confetti";
      confetti.style.cssText = `--left:${random(0, 100)}%;--width:${random(4, 8).toFixed(0)}px;--height:${random(7, 14).toFixed(0)}px;--color:${colors[i % colors.length]};--duration:${random(2, 4.7).toFixed(2)}s;--delay:${random(0, .8).toFixed(2)}s;--drift:${random(-180, 180).toFixed(0)}px`;
      elements.celebration.append(confetti);
      confetti.addEventListener("animationend", () => confetti.remove(), { once: true });
    }
  }

  function setupGestures() {
    let startX = 0;
    elements.card.addEventListener("pointerdown", (event) => { startX = event.clientX; });
    elements.card.addEventListener("pointerup", (event) => {
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 45) moveMemory(distance < 0 ? 1 : -1);
    });
    elements.memoryImage.addEventListener("pointerup", (event) => {
      const now = Date.now();
      if (now - lastPhotoTap < 280) elements.memoryImage.classList.toggle("is-zoomed");
      lastPhotoTap = now;
      event.stopPropagation();
    });
  }

  function setupEasterEggs() {
    elements.heartLogo.addEventListener("click", () => {
      logoTaps += 1;
      if (logoTaps === 5) { showToast("You found the secret ❤️"); logoTaps = 0; }
    });
    document.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button, .memory-photo")) return;
      longPressTimer = window.setTimeout(() => createBurst(event.clientX, event.clientY, 10), 550);
    });
    ["pointerup", "pointercancel", "pointermove"].forEach((name) => document.addEventListener(name, () => window.clearTimeout(longPressTimer)));
  }

  function initialize() {
    createAtmosphere();
    elements.musicToggle.addEventListener("click", toggleMusic);
    elements.audio.addEventListener("play", () => setMusicState(true));
    elements.audio.addEventListener("pause", () => setMusicState(false));
    elements.start.addEventListener("click", () => showScreen(elements.question));
    elements.yes.addEventListener("pointerdown", escapeYesButton);
    elements.yes.addEventListener("click", (event) => {
      if (Date.now() - lastYesEscape > 350) escapeYesButton(event);
    });
    elements.no.addEventListener("click", acceptNo);
    elements.flip.addEventListener("click", () => elements.card.classList.add("is-flipped"));
    elements.flipBack.addEventListener("click", () => elements.card.classList.remove("is-flipped"));
    elements.previous.addEventListener("click", () => moveMemory(-1));
    elements.next.addEventListener("click", () => moveMemory(1));
    elements.always.addEventListener("click", celebrate);
    setupGestures();
    setupEasterEggs();
    window.setTimeout(() => showScreen(elements.welcome), reducedMotion ? 80 : 2600);
  }

  initialize();
})();
