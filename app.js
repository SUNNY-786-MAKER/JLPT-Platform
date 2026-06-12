// Main Application Logic for Nihongo Path

document.addEventListener("DOMContentLoaded", () => {
  const app = new NihongoApp();
  app.init();
});

class NihongoApp {
  constructor() {
    this.state = this.loadState();
    this.kakashi = new KakashiAssistant();
    this.activePage = "home";
    this.furiganaVisible = true;
    
    // Kanji Drawing State
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.drawCoords = [];
    this.activeKanji = null;
  }

  init() {
    this.setupRouter();
    this.setupGlobalEvents();
    this.updateDashboardStats();
  }

  generateFurigana(word, kana) {
    if (!/[々\u4e00-\u9fff]/.test(word)) {
      return word;
    }
    let start = 0;
    let endWord = word.length;
    let endKana = kana.length;
    while (start < endWord && start < endKana && word[start] === kana[start] && !/[々\u4e00-\u9fff]/.test(word[start])) {
      start++;
    }
    while (endWord > start && endKana > start && word[endWord - 1] === kana[endKana - 1] && !/[々\u4e00-\u9fff]/.test(word[endWord - 1])) {
      endWord--;
      endKana--;
    }
    const prefix = word.substring(0, start);
    const suffix = word.substring(endWord);
    const baseWord = word.substring(start, endWord);
    const baseKana = kana.substring(start, endKana);
    if (baseWord && baseKana) {
      return `${prefix}${baseWord}<rt>${baseKana}</rt>${suffix}`;
    }
    return word;
  }

  getStrippedRoot(word, kana) {
    if (!/[々\u4e00-\u9fff]/.test(word)) {
      return null;
    }
    let start = 0;
    let endWord = word.length;
    let endKana = kana.length;
    while (start < endWord && start < endKana && word[start] === kana[start] && !/[々\u4e00-\u9fff]/.test(word[start])) {
      start++;
    }
    while (endWord > start && endKana > start && word[endWord - 1] === kana[endKana - 1] && !/[々\u4e00-\u9fff]/.test(word[endWord - 1])) {
      endWord--;
      endKana--;
    }
    return {
      baseWord: word.substring(start, endWord),
      baseKana: kana.substring(start, endKana)
    };
  }

  initVocabFuriganaMap() {
    if (this.vocabFuriganaMap) return;
    this.vocabFuriganaMap = {};
    if (window.vocabDatabase) {
      window.vocabDatabase.forEach(v => {
        if (v.word && v.kana && v.word !== v.kana) {
          const furigana = this.generateFurigana(v.word, v.kana);
          if (furigana !== v.word) {
            this.vocabFuriganaMap[v.word] = furigana;
          }
          const rootInfo = this.getStrippedRoot(v.word, v.kana);
          if (rootInfo && rootInfo.baseWord && rootInfo.baseKana && rootInfo.baseWord !== rootInfo.baseKana) {
            this.vocabFuriganaMap[rootInfo.baseWord] = `${rootInfo.baseWord}<rt>${rootInfo.baseKana}</rt>`;
          }
        }
      });
    }
    this.sortedVocabWords = Object.keys(this.vocabFuriganaMap).sort((a, b) => b.length - a.length);
  }

  annotateSentence(sentence) {
    if (!sentence) return '';
    this.initVocabFuriganaMap();
    const parts = sentence.split(/(<\/?[^>]+>)/g);
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        let text = parts[i];
        const replacements = [];
        for (const word of this.sortedVocabWords) {
          if (text.includes(word)) {
            let index = text.indexOf(word);
            while (index !== -1) {
              const placeholder = `___TOKEN_${replacements.length}___`;
              replacements.push({
                placeholder: placeholder,
                html: this.vocabFuriganaMap[word]
              });
              text = text.substring(0, index) + placeholder + text.substring(index + word.length);
              index = text.indexOf(word);
            }
          }
        }
        for (const rep of replacements) {
          text = text.replace(rep.placeholder, rep.html);
        }
        parts[i] = text;
      }
    }
    return parts.join('');
  }

  rubyExample(text) {
    if (!text) return '';
    let annotated = text;
    if (!text.includes('<rt>')) {
      annotated = this.annotateSentence(text);
    }
    return annotated.replace(/([\u4e00-\u9fff\u3005\u3007]+)(<rt>[^<]*<\/rt>)/g, '<ruby>$1$2</ruby>');
  }

  conjugateSentenceToPast(sentence, translation) {
    if (!sentence) return null;
    
    let pastJp = sentence;
    let pastEn = translation || '';
    
    const rules = [
      { from: 'たいです。', to: 'たかったです。' },
      { from: 'たい。', to: 'たかった。' },
      { from: 'たいです', to: 'たかったです' },
      { from: 'たい', to: 'たかった' },
      { from: 'ます。', to: 'ました。' },
      { from: 'ます', to: 'ました' },
      { from: 'いいです。', to: 'よかったです。' },
      { from: 'いいです', to: 'よかったです' },
      { from: 'ないです。', to: 'なかったです。' },
      { from: 'ないです', to: 'なかったです' },
      { from: 'いい。', to: 'よかった。' },
      { from: 'いい', to: 'よかった' },
      { from: 'ある。', to: 'あった。' },
      { from: 'ある', to: 'あった' },
      { from: 'する。', to: 'した。' },
      { from: 'する', to: 'した' },
      { from: 'いる。', to: 'いた。' },
      { from: 'いる', to: 'いた' },
      { from: 'だ。', to: 'だった。' },
      { from: 'だ', to: 'だった' },
      { from: 'ない。', to: 'なかった。' },
      { from: 'ない', to: 'なかった' }
    ];
    
    let matched = false;
    for (const rule of rules) {
      if (pastJp.endsWith(rule.from)) {
        pastJp = pastJp.substring(0, pastJp.length - rule.from.length) + rule.to;
        matched = true;
        break;
      }
    }
    
    if (!matched) return null;
    
    const enRules = [
      { from: /\bwant to\b/g, to: 'wanted to' },
      { from: /\bwants to\b/g, to: 'wanted to' },
      { from: /\bcan\b/g, to: 'could' },
      { from: /\bis\b/g, to: 'was' },
      { from: /\bare\b/g, to: 'were' },
      { from: /\bam\b/g, to: 'was' },
      { from: /\bwill go\b/g, to: 'went' },
      { from: /\bgo\b/g, to: 'went' },
      { from: /\bgoes\b/g, to: 'went' },
      { from: /\bhad better\b/g, to: 'had better have' },
      { from: /\bit is better\b/g, to: 'it would have been better' },
      { from: /\bdecides to\b/g, to: 'decided to' },
      { from: /\bdecide to\b/g, to: 'decided to' },
      { from: /\bshould\b/g, to: 'should have' }
    ];
    
    for (const rule of enRules) {
      pastEn = pastEn.replace(rule.from, rule.to);
    }
    
    return {
      japanese: pastJp,
      translation: pastEn
    };
  }

  getTenseTable(pattern) {
    const clean = pattern.replace(/[～~]/g, '').trim();
    if (clean.endsWith('たい')) {
      const stem = clean.slice(0, -2);
      return {
        title: "たい-form (Desire) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Want to)", plain: `${stem}たい`, polite: `${stem}たいです` },
          { tense: "Present Negative (Don't want to)", plain: `${stem}たくない`, polite: `${stem}たくないです` },
          { tense: "Past Affirmative (Wanted to)", plain: `${stem}たかった`, polite: `${stem}たかったです` },
          { tense: "Past Negative (Didn't want to)", plain: `${stem}たくなかった`, polite: `${stem}たくなかったです` }
        ]
      };
    }
    if (clean.endsWith('ことができる') || clean.endsWith('ことができるです')) {
      const stem = clean.slice(0, -6);
      return {
        title: "ことができる (Ability) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Can)", plain: `${stem}ことができる`, polite: `${stem}ことができます` },
          { tense: "Present Negative (Cannot)", plain: `${stem}ことはできない / ことができない`, polite: `${stem}ことができません` },
          { tense: "Past Affirmative (Could)", plain: `${stem}ことができた`, polite: `${stem}ことができました` },
          { tense: "Past Negative (Could not)", plain: `${stem}ことができなかった`, polite: `${stem}ことができませんでした` }
        ]
      };
    }
    if (clean.endsWith('つもりだ') || clean.endsWith('つもり')) {
      const stem = clean.replace('だ', '');
      return {
        title: "つもり (Intention) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Intend to)", plain: `${stem}つもりだ`, polite: `${stem}つもりです` },
          { tense: "Present Negative (Do not intend to)", plain: `${stem}つもりはない`, polite: `${stem}つもりはありません` },
          { tense: "Past Affirmative (Intended to)", plain: `${stem}つもりだった`, polite: `${stem}つもりでした` },
          { tense: "Past Negative (Did not intend to)", plain: `${stem}つもりはなかった`, polite: `${stem}つもりはありませんでした` }
        ]
      };
    }
    if (clean.endsWith('ほうがいい')) {
      return {
        title: "ほうがいい (Recommendation) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Should)", plain: `～ほうがいい`, polite: `～ほうがいいです` },
          { tense: "Present Negative (Should not)", plain: `～ないほうがいい`, polite: `～ないほうがいいです` },
          { tense: "Past Affirmative (Should have)", plain: `～ほうがよかった`, polite: `～ほうがよかったです` },
          { tense: "Past Negative (Should not have)", plain: `～ないほうがよかった`, polite: `～ないほうがよかったです` }
        ]
      };
    }
    if (clean.endsWith('ことになる') || clean.endsWith('なる')) {
      const stem = clean.endsWith('ことになる') ? '～こと' : '～';
      return {
        title: "なる (Arrangement/Become) Conjugation Table",
        rows: [
          { tense: "Present Affirmative", plain: `${stem}になる`, polite: `${stem}になります` },
          { tense: "Present Negative", plain: `${stem}にならない`, polite: `${stem}になりません` },
          { tense: "Past Affirmative", plain: `${stem}になった`, polite: `${stem}になりました` },
          { tense: "Past Negative", plain: `${stem}にならなかった`, polite: `${stem}になりませんでした` }
        ]
      };
    }
    if (clean.endsWith('ことにする') || clean.endsWith('する')) {
      const stem = clean.endsWith('ことにする') ? '～こと' : '～';
      return {
        title: "する (Decision/Do) Conjugation Table",
        rows: [
          { tense: "Present Affirmative", plain: `${stem}にする`, polite: `${stem}にします` },
          { tense: "Present Negative", plain: `${stem}にしない`, polite: `${stem}にしません` },
          { tense: "Past Affirmative", plain: `${stem}にした`, polite: `${stem}にしました` },
          { tense: "Past Negative", plain: `${stem}にしなかった`, polite: `${stem}にしませんでした` }
        ]
      };
    }
    if (clean.endsWith('はずだ') || clean.endsWith('はず')) {
      const stem = clean.replace('だ', '');
      return {
        title: "はず (Expectation) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Expected to)", plain: `${stem}はずだ`, polite: `${stem}はずです` },
          { tense: "Present Negative (Not expected to)", plain: `${stem}はずがない`, polite: `${stem}はずがありません` },
          { tense: "Past Affirmative (Was expected to)", plain: `${stem}はずだった`, polite: `${stem}はずでした` },
          { tense: "Past Negative (Was not expected to)", plain: `${stem}はずではなかった`, polite: `${stem}はずではありませんでした` }
        ]
      };
    }
    if (clean.endsWith('ている') || clean.endsWith('ているです')) {
      const stem = clean.slice(0, -3);
      return {
        title: "ている (Continuous / State) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Is doing)", plain: `${stem}ている`, polite: `${stem}ています` },
          { tense: "Present Negative (Is not doing)", plain: `${stem}ていない`, polite: `${stem}ていません` },
          { tense: "Past Affirmative (Was doing)", plain: `${stem}ていた`, polite: `${stem}ていました` },
          { tense: "Past Negative (Was not doing)", plain: `${stem}ていなかった`, polite: `${stem}ていませんでした` }
        ]
      };
    }
    if (clean.endsWith('てみる')) {
      const stem = clean.slice(0, -3);
      return {
        title: "てみる (Try doing) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Try doing)", plain: `${stem}てみる`, polite: `${stem}てみます` },
          { tense: "Present Negative (Don't try doing)", plain: `${stem}てみない`, polite: `${stem}てみません` },
          { tense: "Past Affirmative (Tried doing)", plain: `${stem}てみた`, polite: `${stem}てみました` },
          { tense: "Past Negative (Didn't try doing)", plain: `${stem}てみなかった`, polite: `${stem}てみませんでした` }
        ]
      };
    }
    if (clean.endsWith('なければならない') || clean.endsWith('ねばならない')) {
      return {
        title: "なければならない (Necessity) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Must do)", plain: `～なければならない`, polite: `～なければなりません` },
          { tense: "Present Negative (Do not have to do)", plain: `～なくてもいい`, polite: `～なくてもいいです` },
          { tense: "Past Affirmative (Had to do)", plain: `～なければならなかった`, polite: `～なければなりませんでした` },
          { tense: "Past Negative (Did not have to do)", plain: `～なくてもよかった`, polite: `～なくてもよかったです` }
        ]
      };
    }
    if (clean.endsWith('てはいけない') || clean.endsWith('てはならない')) {
      return {
        title: "てはいけない (Prohibition) Conjugation Table",
        rows: [
          { tense: "Present Affirmative (Must not do)", plain: `～てはいけない`, polite: `～てはいけません` },
          { tense: "Present Negative (Do not have to avoid)", plain: `～てはいけないことはない`, polite: `～てはいけないことはないです` },
          { tense: "Past Affirmative (Was not allowed to)", plain: `～てはいけなかった`, polite: `～てはいけませんでした` },
          { tense: "Past Negative (Was allowed to / did not have to)", plain: `～てはいけなくなかった`, polite: `～てはいけなくなかったです` }
        ]
      };
    }
    if (clean.endsWith('やすい') || clean.endsWith('にくい') || clean.endsWith('いい') || clean.endsWith('ほしい')) {
      const stem = clean.slice(0, -1);
      return {
        title: "い-Adjective Ending Conjugation Table",
        rows: [
          { tense: "Present Affirmative", plain: `${clean}`, polite: `${clean}です` },
          { tense: "Present Negative", plain: `${stem}くない`, polite: `${stem}くないです` },
          { tense: "Past Affirmative", plain: `${stem}かった`, polite: `${stem}かったです` },
          { tense: "Past Negative", plain: `${stem}くなかった`, polite: `${stem}くなかったです` }
        ]
      };
    }
    return null;
  }

  loadState() {
    const saved = localStorage.getItem("nihongo_app_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure bookmarks structure is fully initialized for backward compatibility
      if (parsed.user) {
        if (!parsed.user.bookmarks) {
          parsed.user.bookmarks = { vocab: [], kanji: [], grammar: [] };
        } else {
          if (!parsed.user.bookmarks.vocab) parsed.user.bookmarks.vocab = [];
          if (!parsed.user.bookmarks.kanji) parsed.user.bookmarks.kanji = [];
          if (!parsed.user.bookmarks.grammar) parsed.user.bookmarks.grammar = [];
        }
      }
      // Verify streak
      this.checkStreak(parsed);
      return parsed;
    }
    return this.getInitialState();
  }

  getInitialState() {
    return {
      user: {
        username: "Guest Shinobi",
        level: 1,
        xp: 35,
        xpToNextLevel: 100,
        streak: 5,
        lastActiveDate: new Date().toDateString(),
        bookmarks: {
          vocab: [],
          kanji: [],
          grammar: []
        },
        badges: [
          { id: "b1", title: "First Steps", description: "Created an account", icon: "🌱", unlocked: true },
          { id: "b2", title: "Kanji Artist", description: "Practice drawing Kanji on the canvas", icon: "🎨", unlocked: false },
          { id: "b3", title: "Streak Starter", description: "Maintain a 5-day study streak", icon: "🔥", unlocked: true },
          { id: "b4", title: "Sensei's Favorite", description: "Complete a chat quiz with Kakashi", icon: "🥷", unlocked: false },
          { id: "b5", title: "Exam Ace", description: "Pass any JLPT mock test", icon: "🏆", unlocked: false }
        ],
        recentLessons: [
          { type: "Vocab", name: "日本語 (Japanese)", date: "Today" },
          { type: "Grammar", name: "～たい (Desire)", date: "Yesterday" }
        ],
        completedTests: []
      }
    };
  }

  saveState() {
    localStorage.setItem("nihongo_app_state", JSON.stringify(this.state));
  }

  checkStreak(state) {
    const today = new Date().toDateString();
    const lastActive = state.user.lastActiveDate;

    if (lastActive === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActive === yesterday.toDateString()) {
      // Streak maintained
      state.user.streak += 1;
      state.user.lastActiveDate = today;
    } else {
      // Streak broken (more than 1 day missed)
      // If lastActive was a few days ago, reset. Otherwise do not reset if it was today.
      state.user.streak = 1;
      state.user.lastActiveDate = today;
    }
  }

  addXP(amount, silent = false) {
    if (amount <= 0) return; // Skip zero-XP calls entirely

    this.state.user.xp += amount;
    
    // Level up check
    let leveledUp = false;
    while (this.state.user.xp >= this.state.user.xpToNextLevel) {
      this.state.user.xp -= this.state.user.xpToNextLevel;
      this.state.user.level += 1;
      this.state.user.xpToNextLevel = Math.round(this.state.user.xpToNextLevel * 1.5);
      leveledUp = true;
    }

    this.saveState();
    this.updateDashboardStats();

    if (leveledUp) {
      this.showNotification("🎉 LEVEL UP!", `You have reached Level ${this.state.user.level}! Keep going!`, "success");
    } else if (!silent) {
      this.showNotification("✨ XP Gained", `+${amount} XP Added to your progress`, "info");
    }
  }

  unlockBadge(badgeId) {
    const badge = this.state.user.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      this.saveState();
      this.showNotification("🏆 Achievement Unlocked!", `${badge.icon} ${badge.title} - ${badge.description}`, "success");
    }
  }

  showNotification(title, message, type = "info") {
    const container = document.getElementById("notification-container");
    if (!container) return;

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">${type === 'success' ? '🎉' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : '✨'}</div>
      <div class="notification-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }

  setupRouter() {
    document.querySelectorAll("[data-page]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        window.location.hash = page;
      });
    });

    const handleRoute = () => {
      const hash = window.location.hash.substring(1) || "home";
      this.navigateTo(hash);
    };

    window.addEventListener("hashchange", handleRoute);
    handleRoute();
  }

  navigateTo(page) {
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
      return;
    }
    this.activePage = page;
    this.renderPage(page);

    // Update active nav link
    document.querySelectorAll("[data-page]").forEach(link => {
      if (link.getAttribute("data-page") === page) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  setupGlobalEvents() {
    // Theme selector
    const themeSelector = document.getElementById("theme-selector");
    if (themeSelector) {
      const savedTheme = localStorage.getItem("nihongo-theme") || "dark";
      themeSelector.value = savedTheme;
      
      const applyTheme = (themeName) => {
        document.body.classList.remove("light-mode", "theme-light", "theme-sakura", "theme-stealth");
        
        if (themeName === "light") {
          document.body.classList.add("light-mode", "theme-light");
        } else if (themeName === "sakura") {
          document.body.classList.add("light-mode", "theme-sakura");
        } else if (themeName === "stealth") {
          document.body.classList.add("theme-stealth");
        }
        localStorage.setItem("nihongo-theme", themeName);
      };

      applyTheme(savedTheme);

      themeSelector.addEventListener("change", (e) => {
        applyTheme(e.target.value);
      });
    }

    // Furigana toggle global button
    const firiToggle = document.getElementById("global-furigana-toggle");
    if (firiToggle) {
      firiToggle.addEventListener("click", () => {
        this.furiganaVisible = !this.furiganaVisible;
        document.body.classList.toggle("hide-furigana", !this.furiganaVisible);
        firiToggle.classList.toggle("active", this.furiganaVisible);
        firiToggle.querySelector("span").textContent = this.furiganaVisible ? "あ ON" : "あ OFF";
      });
    }

    // Check if user is logged in
    this.updateUserSessionUI();
  }

  updateUserSessionUI() {
    const loginNav = document.querySelector('[data-page="login"]');
    const dashboardNav = document.querySelector('[data-page="dashboard"]');
    
    if (loginNav && dashboardNav) {
      if (this.state.user.username === "Guest Shinobi") {
        loginNav.style.display = "block";
      } else {
        loginNav.style.display = "none";
      }
    }
  }

  updateDashboardStats() {
    // Update simple header state or sidebar state
    const userXPText = document.getElementById("user-xp-display");
    if (userXPText) {
      userXPText.textContent = `Lvl ${this.state.user.level} (${this.state.user.xp}/${this.state.user.xpToNextLevel} XP)`;
    }
    
    const userStreakText = document.getElementById("user-streak-display");
    if (userStreakText) {
      userStreakText.textContent = `${this.state.user.streak} Days 🔥`;
    }
  }

  renderPage(page) {
    const container = document.getElementById("app-content");
    container.innerHTML = ""; // Clear current view
    window.scrollTo(0, 0);

    // Track page views in user progress
    if (page !== "home" && page !== "login") {
      this.addToRecentLessons(page);
    }

    switch (page) {
      case "home":
        this.renderHome(container);
        break;
      case "vocab":
        this.renderVocab(container);
        break;
      case "kanji":
        this.renderKanji(container);
        break;
      case "grammar":
        this.renderGrammar(container);
        break;
      case "reading":
        this.renderReading(container);
        break;
      case "practice":
        this.renderPracticeTests(container);
        break;
      case "dashboard":
        this.renderDashboard(container);
        break;
      case "login":
        this.renderLogin(container);
        break;
      case "kakashi":
        this.renderKakashi(container);
        break;
      default:
        this.renderHome(container);
    }
  }

  addToRecentLessons(page) {
    const names = {
      vocab: "Vocabulary Lists (N5-N2)",
      kanji: "Kanji Lab & Stroke Canvas",
      grammar: "Grammar Rules Library",
      reading: "Reading Passages Practice",
      practice: "JLPT Mock Exams",
      kakashi: "Kakashi AI Chat Lesson"
    };
    
    const existsIndex = this.state.user.recentLessons.findIndex(l => l.type === page);
    if (existsIndex !== -1) {
      this.state.user.recentLessons.splice(existsIndex, 1);
    }

    this.state.user.recentLessons.unshift({
      type: page,
      name: names[page] || "Study Lesson",
      date: "Just now"
    });

    if (this.state.user.recentLessons.length > 5) {
      this.state.user.recentLessons.pop();
    }
    this.saveState();
  }

  // HOMEPAGE RENDER
  renderHome(container) {
    container.innerHTML = `
      <section class="hero-section">
        <div class="hero-bg-accent"></div>
        <div class="hero-content">
          <span class="hero-tag">✨ Your Path to Japanese Fluency</span>
          <h1>Master the JLPT <br><span class="highlight-text">N5 to N2</span> Seamlessly</h1>
          <p>Learn Kanji, Vocabulary, Grammar, and Reading through interactive flashcards, writing canvas guides, and KAKASHI, your AI Japanese Shinobi tutor.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" id="hero-start-btn">Start Learning Free</button>
            <button class="btn btn-secondary" id="hero-kakashi-btn">🥷 Ask Kakashi AI</button>
          </div>
        </div>
        <div class="hero-image-pane">
          <div class="floating-kanji-card">日本語</div>
          <div class="hero-card-preview">
            <div class="preview-header">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <div class="preview-body">
              <div class="user-greeting">こんにちは, ${this.state.user.username}!</div>
              <div class="preview-stat-grid">
                <div class="stat-box">
                  <span class="value">${this.state.user.streak}</span>
                  <span class="label">Day Streak 🔥</span>
                </div>
                <div class="stat-box">
                  <span class="value">Lvl ${this.state.user.level}</span>
                  <span class="label">Rank: Ninja Scholar</span>
                </div>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${(this.state.user.xp / this.state.user.xpToNextLevel) * 100}%"></div>
              </div>
              <div class="progress-label">${this.state.user.xp} / ${this.state.user.xpToNextLevel} XP to Level ${this.state.user.level + 1}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section level-overview">
        <div class="section-header">
          <h2>JLPT Level Coverage</h2>
          <p>Choose a level and start practicing targeted lessons built specifically for JLPT exam structures.</p>
        </div>
        <div class="level-grid">
          <div class="level-card n5" data-level="N5">
            <span class="badge">Beginner</span>
            <h3>JLPT N5</h3>
            <p>Master basic phrases, Hiragana, Katakana, ~100 Kanji, and ~800 daily vocabulary words.</p>
            <div class="level-meta">100 Kanji • 800 Vocab • 40 Grammar</div>
            <button class="btn btn-level">Study N5</button>
          </div>
          <div class="level-card n4" data-level="N4">
            <span class="badge">Upper Beginner</span>
            <h3>JLPT N4</h3>
            <p>Understand basic conversations, travel Japanese, ~300 Kanji, and ~1500 vocabulary words.</p>
            <div class="level-meta">300 Kanji • 1,500 Vocab • 80 Grammar</div>
            <button class="btn btn-level">Study N4</button>
          </div>
          <div class="level-card n3" data-level="N3">
            <span class="badge">Intermediate</span>
            <h3>JLPT N3</h3>
            <p>Bridge the gap. Read everyday essays, grasp spoken materials, and learn ~650 Kanji.</p>
            <div class="level-meta">650 Kanji • 3,700 Vocab • 110 Grammar</div>
            <button class="btn btn-level">Study N3</button>
          </div>
          <div class="level-card n2" data-level="N2">
            <span class="badge">Upper Intermediate</span>
            <h3>JLPT N2</h3>
            <p>Understand business Japanese, news articles, write essays, and master ~1000 Kanji.</p>
            <div class="level-meta">1,000 Kanji • 6,000 Vocab • 150 Grammar</div>
            <button class="btn btn-level">Study N2</button>
          </div>
        </div>
      </section>

      <section class="section kakashi-showcase">
        <div class="showcase-content">
          <h2>Meet KAKASHI: Your AI Sensei 🥷</h2>
          <p>Kakashi is a customized Japanese Language Tutor. You can ask him grammar questions, paste text for sentence breakdowns, submit sentences to get them graded, or request a quick quiz.</p>
          <ul class="kakashi-perks">
            <li>✨ <strong>Grammar breakdowns:</strong> Get instant, simple comparisons between confusing particles.</li>
            <li>📝 <strong>Writing checker:</strong> Send a Japanese sentence and get corrections with grammatical reasons.</li>
            <li>🎯 <strong>Quiz generator:</strong> Test your skills with personalized dynamic multiple-choice cards.</li>
          </ul>
          <button class="btn btn-primary" id="meet-kakashi-btn">Start Chatting with Kakashi</button>
        </div>
        <div class="showcase-media">
          <img src="assets/kakashi.png" alt="Kakashi AI Sensei Avatar" class="kakashi-avatar-img">
          <div class="kakashi-bubble">
            <p>"Let me generate a quick N5 grammar quiz for you! Type 'give me a quiz' inside our chat!"</p>
          </div>
        </div>
      </section>

      <section class="section features-highlights">
        <div class="section-header">
          <h2>Core Interactive Features</h2>
          <p>Everything you need to study Japanese, fully organized in a gamified environment.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="icon">🎴</div>
            <h4>Interactive Cards</h4>
            <p>Study Japanese vocabulary and grammar with interactive flipping cards featuring Furigana toggle and bookmarking.</p>
          </div>
          <div class="feature-card">
            <div class="icon">✍️</div>
            <h4>Stroke Canvas Lab</h4>
            <p>Interactive canvas for drawing Kanji. Animate the stroke paths and practice writing on-screen with mouse or touch.</p>
          </div>
          <div class="feature-card">
            <div class="icon">📖</div>
            <h4>Interactive Passages</h4>
            <p>Read passages with vocabulary definitions appearing on hover. Test yourself with multiple choice comprehension checks.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🏆</div>
            <h4>Gamified Dashboard</h4>
            <p>Track your XP, levels, study streaks, and unlock custom achievement badges as you progress.</p>
          </div>
        </div>
      </section>

      <section class="section testimonials">
        <div class="section-header">
          <h2>Loved by Shinobi Learners</h2>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <p>"The Kakashi AI is incredible. I asked it to compare は vs が and it gave me a cleaner breakdown than any of my textbooks did!"</p>
            <div class="author">- Kenji S., N3 Candidate</div>
          </div>
          <div class="testimonial-card">
            <p>"The stroke order canvas is so addictive. Being able to practice drawing Kanji and seeing the guidelines is extremely helpful."</p>
            <div class="author">- Mei L., N5 Beginner</div>
          </div>
        </div>
      </section>
    `;

    // Button event listeners
    document.getElementById("hero-start-btn").addEventListener("click", () => this.navigateTo("dashboard"));
    document.getElementById("hero-kakashi-btn").addEventListener("click", () => this.navigateTo("kakashi"));
    document.getElementById("meet-kakashi-btn").addEventListener("click", () => this.navigateTo("kakashi"));

    document.querySelectorAll(".level-card, .btn-level").forEach(card => {
      card.addEventListener("click", (e) => {
        // Find closest level card
        const lvlCard = e.target.closest(".level-card");
        if (lvlCard) {
          const level = lvlCard.getAttribute("data-level");
          // Store selected level for direct filters on pages
          this.selectedLevelFilter = level;
          this.navigateTo("vocab");
        }
      });
    });
  }

  // VOCABULARY PAGE RENDER
  renderVocab(container) {
    const selectedLevel = this.selectedLevelFilter || "N5";
    this.selectedLevelFilter = null; // Clear filter after initial navigate

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Vocabulary Study</h1>
          <p>Learn vocabulary words organized by JLPT Level. Review with flashcards or test yourself.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" id="vocab-flashcards-mode-btn">🎴 Flashcard Slideshow</button>
          <button class="btn btn-secondary" id="vocab-quiz-mode-btn">📝 Take Vocab Quiz</button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="search-box">
          <input type="text" id="vocab-search" placeholder="Search by English, Japanese, or Romaji...">
        </div>
        <div class="level-tabs" id="vocab-level-tabs">
          <button class="tab-btn ${selectedLevel === 'N5' ? 'active' : ''}" data-lvl="N5">N5</button>
          <button class="tab-btn ${selectedLevel === 'N4' ? 'active' : ''}" data-lvl="N4">N4</button>
          <button class="tab-btn ${selectedLevel === 'N3' ? 'active' : ''}" data-lvl="N3">N3</button>
          <button class="tab-btn ${selectedLevel === 'N2' ? 'active' : ''}" data-lvl="N2">N2</button>
        </div>
        <div class="category-tabs" id="vocab-cat-tabs">
          <button class="cat-btn active" data-cat="all">All Words</button>
          <button class="cat-btn" data-cat="nouns">Nouns</button>
          <button class="cat-btn" data-cat="verbs">Verbs</button>
          <button class="cat-btn" data-cat="adjectives">Adjectives</button>
        </div>
      </div>

      <div class="vocab-grid" id="vocab-list-container">
        <!-- Rendered Dynamically -->
      </div>

      <!-- Flashcards Slide Modal -->
      <div class="modal-backdrop" id="vocab-flashcard-modal" style="display:none;">
        <div class="modal-card flashcard-slide-card">
          <button class="modal-close" id="flashcard-modal-close">&times;</button>
          <div class="flashcard-progress">Card <span id="fc-current">1</span> of <span id="fc-total">10</span></div>
          <div class="interactive-card-inner" id="fc-interactive-area">
            <!-- Rendered Dynamically -->
          </div>
          <div class="flashcard-actions">
            <button class="btn btn-secondary" id="fc-prev-btn">⬅️ Previous</button>
            <button class="btn btn-primary" id="fc-flip-btn">🔄 Flip Card</button>
            <button class="btn btn-success" id="fc-next-btn">Next Card ➡️</button>
          </div>
        </div>
      </div>

      <!-- Vocab Quiz Modal -->
      <div class="modal-backdrop" id="vocab-quiz-modal" style="display:none;">
        <div class="modal-card quiz-card">
          <button class="modal-close" id="vocab-quiz-close">&times;</button>
          <h3>Vocabulary Quiz</h3>
          <div class="quiz-question-box">
            <div class="quiz-progress-bar"><div class="quiz-progress-fill" id="vocab-qp-fill" style="width:0%"></div></div>
            <div class="quiz-question-text" id="vocab-quiz-question">Loading question...</div>
          </div>
          <div class="quiz-options-list" id="vocab-quiz-options">
            <!-- Buttons rendered here -->
          </div>
          <div class="quiz-feedback-box" id="vocab-quiz-feedback" style="display:none;">
            <!-- Feedback explanation -->
          </div>
          <div class="quiz-actions" style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button class="btn btn-primary" id="vocab-quiz-next-btn" style="display:none;">Next Question</button>
          </div>
        </div>
      </div>
    `;

    // Variables for vocab logic
    let currentLvl = selectedLevel;
    let currentCat = "all";
    let searchQuery = "";
    let currentLimit = 100;

    const renderVocabList = (resetLimit = true) => {
      if (resetLimit) currentLimit = 100;
      const containerList = document.getElementById("vocab-list-container");
      containerList.innerHTML = "";

      const filtered = window.vocabDatabase.filter(item => {
        const matchesLvl = item.level === currentLvl;
        const matchesCat = currentCat === "all" || item.category === currentCat;
        const matchesSearch = searchQuery === "" || 
          item.word.includes(searchQuery) || 
          item.kana.includes(searchQuery) || 
          item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.romaji.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesLvl && matchesCat && matchesSearch;
      });

      if (filtered.length === 0) {
        containerList.innerHTML = `
          <div class="empty-state">
            <p>No vocabulary words found matching the filters.</p>
          </div>
        `;
        return;
      }

      const displayed = filtered.slice(0, currentLimit);

      displayed.forEach(vocab => {
        const isBookmarked = this.state.user.bookmarks.vocab.includes(vocab.id);
        const card = document.createElement("div");
        card.className = "vocab-card";
        card.innerHTML = `
          <div class="vocab-card-header">
            <span class="vocab-badge">${vocab.category.toUpperCase()}</span>
            <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${vocab.id}">
              ${isBookmarked ? '★' : '☆'}
            </button>
          </div>
          <div class="vocab-card-body">
            <ruby class="jap-word">${vocab.word}<rt>${vocab.kana}</rt></ruby>
            <div class="romaji-text">${vocab.romaji}</div>
            <div class="meaning-text">${vocab.meaning}</div>
          </div>
          ${vocab.exampleFurigana ? `
          <div class="vocab-card-footer">
            <div class="example-box">
              <span class="lbl">Ex:</span>
              ${this.rubyExample(vocab.exampleFurigana)}
              <div class="example-translation">${vocab.exampleMeaning}</div>
            </div>
          </div>` : ''}
        `;

        // Bookmark Event
        card.querySelector(".bookmark-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleBookmark("vocab", vocab.id, e.currentTarget);
        });

        containerList.appendChild(card);
      });

      if (filtered.length > currentLimit) {
        const loadMoreRow = document.createElement("div");
        loadMoreRow.style.gridColumn = "1 / -1";
        loadMoreRow.style.textAlign = "center";
        loadMoreRow.style.padding = "20px";
        loadMoreRow.innerHTML = `
          <button class="btn btn-secondary" style="width: 100%; max-width: 300px;">
            Load More (${filtered.length - currentLimit} remaining)
          </button>
        `;
        loadMoreRow.querySelector("button").onclick = () => {
          currentLimit += 100;
          renderVocabList(false);
        };
        containerList.appendChild(loadMoreRow);
      }
    };

    // Filter Change events
    const searchInput = document.getElementById("vocab-search");
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderVocabList(true);
    });

    document.querySelectorAll("#vocab-level-tabs .tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll("#vocab-level-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        currentLvl = e.target.getAttribute("data-lvl");
        renderVocabList(true);
      });
    });

    document.querySelectorAll("#vocab-cat-tabs .cat-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll("#vocab-cat-tabs .cat-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        currentCat = e.target.getAttribute("data-cat");
        renderVocabList(true);
      });
    });

    // Init Render
    renderVocabList(true);

    // Flashcard slideshow logic
    const fcModal = document.getElementById("vocab-flashcard-modal");
    document.getElementById("vocab-flashcards-mode-btn").addEventListener("click", () => {
      // Collect current filtered list
      const itemsToSlide = window.vocabDatabase.filter(item => item.level === currentLvl && (currentCat === "all" || item.category === currentCat));
      if (itemsToSlide.length === 0) {
        alert("No flashcards to display in this category!");
        return;
      }

      fcModal.style.display = "flex";
      let currentIndex = 0;
      let isFlipped = false;

      const renderSlide = () => {
        const item = itemsToSlide[currentIndex];
        document.getElementById("fc-current").textContent = currentIndex + 1;
        document.getElementById("fc-total").textContent = itemsToSlide.length;

        const area = document.getElementById("fc-interactive-area");
        area.className = `interactive-card-inner ${isFlipped ? 'flipped' : ''}`;
        
        area.innerHTML = `
          <div class="card-front-face">
            <span class="level-label">${item.level} • ${item.category.toUpperCase()}</span>
            <ruby class="giant-word">${item.word}<rt>${item.kana}</rt></ruby>
            <p class="click-hint">Click to Reveal Meaning</p>
          </div>
          <div class="card-back-face">
            <span class="level-label">${item.level} • ${item.category.toUpperCase()}</span>
            <h2>${item.meaning}</h2>
            <p class="reading">Reading: <strong>${item.kana}</strong> (${item.romaji})</p>
            ${item.exampleFurigana || item.example ? `
            <div class="slide-example">
              <p class="jp-sentence">${this.rubyExample(item.exampleFurigana || item.example || '')}</p>
              <p class="en-sentence">${item.exampleMeaning}</p>
            </div>` : ''}
          </div>
        `;
      };

      renderSlide();

      // Flip click
      const area = document.getElementById("fc-interactive-area");
      area.onclick = () => {
        isFlipped = !isFlipped;
        area.classList.toggle("flipped", isFlipped);
      };
      
      document.getElementById("fc-flip-btn").onclick = () => {
        isFlipped = !isFlipped;
        area.classList.toggle("flipped", isFlipped);
      };

      document.getElementById("fc-next-btn").onclick = () => {
        if (currentIndex < itemsToSlide.length - 1) {
          currentIndex++;
          isFlipped = false;
          renderSlide();
          this.addXP(2, true); // XP for reading flashcards (silent – avoid notification spam)
        } else {
          this.showNotification("🎉 Review Finished!", "You have reached the end of the stack!", "success");
          fcModal.style.display = "none";
        }
      };

      document.getElementById("fc-prev-btn").onclick = () => {
        if (currentIndex > 0) {
          currentIndex--;
          isFlipped = false;
          renderSlide();
        }
      };
    });

    document.getElementById("flashcard-modal-close").addEventListener("click", () => {
      fcModal.style.display = "none";
    });

    // Quiz Mode Logic
    const quizModal = document.getElementById("vocab-quiz-modal");
    document.getElementById("vocab-quiz-mode-btn").addEventListener("click", () => {
      const pool = window.vocabDatabase.filter(item => item.level === currentLvl);
      if (pool.length < 3) {
        alert("Not enough vocabulary words in this level to generate a quiz. Choose a level with more entries.");
        return;
      }

      quizModal.style.display = "flex";
      let quizQuestions = [];
      let currentQIdx = 0;
      let score = 0;

      // Generate 5 random questions
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(5, shuffled.length));

      selected.forEach((item, idx) => {
        // Collect incorrect answers from other words
        const incorrectPool = pool.filter(p => p.id !== item.id);
        const incorrectOptions = incorrectPool.sort(() => 0.5 - Math.random()).slice(0, 3).map(p => p.meaning);
        
        // Put together options
        const options = [item.meaning, ...incorrectOptions].sort(() => 0.5 - Math.random());
        const correctIndex = options.indexOf(item.meaning);

        quizQuestions.push({
          question: `What is the meaning of the word: 「${item.word}」 (${item.kana})?`,
          options: options,
          correctIndex: correctIndex,
          explanation: `「${item.word}」 (${item.kana}) means "${item.meaning}".${item.example ? ' Example: ' + item.example : ''}`
        });
      });

      const showQuizQuestion = () => {
        const q = quizQuestions[currentQIdx];
        document.getElementById("vocab-qp-fill").style.width = `${((currentQIdx) / quizQuestions.length) * 100}%`;
        document.getElementById("vocab-quiz-question").textContent = `Question ${currentQIdx + 1}: ${q.question}`;
        
        const optionsContainer = document.getElementById("vocab-quiz-options");
        optionsContainer.innerHTML = "";

        q.options.forEach((opt, index) => {
          const btn = document.createElement("button");
          btn.className = "quiz-opt-btn";
          btn.textContent = opt;
          btn.onclick = () => selectOption(index);
          optionsContainer.appendChild(btn);
        });

        document.getElementById("vocab-quiz-feedback").style.display = "none";
        document.getElementById("vocab-quiz-next-btn").style.display = "none";
      };

      const selectOption = (selectedIdx) => {
        const q = quizQuestions[currentQIdx];
        const buttons = document.querySelectorAll(".quiz-opt-btn");
        buttons.forEach((btn, index) => {
          btn.disabled = true;
          if (index === q.correctIndex) {
            btn.classList.add("correct");
          } else if (index === selectedIdx) {
            btn.classList.add("incorrect");
          }
        });

        const feedback = document.getElementById("vocab-quiz-feedback");
        feedback.style.display = "block";
        
        if (selectedIdx === q.correctIndex) {
          score++;
          feedback.innerHTML = `<span class="correct-text">🎉 Correct!</span><p>${q.explanation}</p>`;
          this.addXP(5);
        } else {
          feedback.innerHTML = `<span class="incorrect-text">❌ Incorrect.</span><p>${q.explanation}</p>`;
        }

        document.getElementById("vocab-quiz-next-btn").style.display = "block";
      };

      document.getElementById("vocab-quiz-next-btn").onclick = () => {
        if (currentQIdx < quizQuestions.length - 1) {
          currentQIdx++;
          showQuizQuestion();
        } else {
          // Finished Quiz
          document.getElementById("vocab-qp-fill").style.width = "100%";
          document.getElementById("vocab-quiz-question").innerHTML = `Quiz Completed! <br><br>Your Score: <strong>${score} / ${quizQuestions.length}</strong>`;
          document.getElementById("vocab-quiz-options").innerHTML = `
            <div class="quiz-summary-box">
              <p>Great job practicing your vocabulary! You earned <strong>+${score * 10} XP</strong> extra bonus!</p>
              <button class="btn btn-primary" id="vocab-quiz-finish-close-btn">Done</button>
            </div>
          `;
          document.getElementById("vocab-quiz-feedback").style.display = "none";
          document.getElementById("vocab-quiz-next-btn").style.display = "none";
          
          if (score > 0) this.addXP(score * 10); // Bonus XP only when at least 1 correct
          this.unlockBadge("b5"); // Unlocks a badge

          document.getElementById("vocab-quiz-finish-close-btn").onclick = () => {
            quizModal.style.display = "none";
          };
        }
      };

      showQuizQuestion();
    });

    document.getElementById("vocab-quiz-close").addEventListener("click", () => {
      quizModal.style.display = "none";
    });
  }

  // KANJI PAGE RENDER
  renderKanji(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Kanji Drawing Lab</h1>
          <p>Learn Kanji strokes, meanings, readings, and practice drawing on the interactive grid.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" id="kanji-quiz-mode-btn">📝 Take Kanji Quiz</button>
        </div>
      </div>

      <div class="kanji-layout">
        <!-- Sidebar Selector / List -->
        <div class="kanji-sidebar">
          <div class="search-box" style="margin-bottom:15px;">
            <input type="text" id="kanji-search" placeholder="Search Kanji or reading...">
          </div>
          <div class="level-tabs" id="kanji-level-tabs" style="margin-bottom:15px; font-size:12px;">
            <button class="tab-btn active" data-lvl="N5">N5</button>
            <button class="tab-btn" data-lvl="N4">N4</button>
            <button class="tab-btn" data-lvl="N3">N3</button>
            <button class="tab-btn" data-lvl="N2">N2</button>
          </div>
          <div class="kanji-list-grid" id="kanji-list-container">
            <!-- Kanji lists render dynamically -->
          </div>
        </div>

        <!-- Kanji Canvas Area & Details -->
        <div class="kanji-workspace">
          <div class="kanji-details-card" id="kanji-details-pane">
            <div class="empty-state">
              <p>Select a Kanji character from the list on the left to start drawing and exploring details.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanji Quiz Modal -->
      <div class="modal-backdrop" id="kanji-quiz-modal" style="display:none;">
        <div class="modal-card quiz-card">
          <button class="modal-close" id="kanji-quiz-close">&times;</button>
          <h3>Kanji Quiz</h3>
          <div class="quiz-question-box">
            <div class="quiz-progress-bar"><div class="quiz-progress-fill" id="kanji-qp-fill" style="width:0%"></div></div>
            <div class="quiz-question-text" id="kanji-quiz-question">Loading question...</div>
          </div>
          <div class="quiz-options-list" id="kanji-quiz-options">
            <!-- Buttons rendered here -->
          </div>
          <div class="quiz-feedback-box" id="kanji-quiz-feedback" style="display:none;">
            <!-- Feedback explanation -->
          </div>
          <div class="quiz-actions" style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button class="btn btn-primary" id="kanji-quiz-next-btn" style="display:none;">Next Question</button>
          </div>
        </div>
      </div>
    `;

    let activeLvl = "N5";
    let searchVal = "";

    const renderKanjiList = () => {
      const grid = document.getElementById("kanji-list-container");
      grid.innerHTML = "";

      const filtered = window.kanjiDatabase.filter(k => {
        const matchesLvl = k.level === activeLvl;
        const matchesSearch = searchVal === "" || 
          k.character.includes(searchVal) || 
          k.meaning.toLowerCase().includes(searchVal.toLowerCase()) || 
          k.onyomi.toLowerCase().includes(searchVal.toLowerCase()) || 
          k.kunyomi.toLowerCase().includes(searchVal.toLowerCase());
        
        return matchesLvl && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; padding:20px;">No Kanji found.</div>`;
        return;
      }

      filtered.forEach((kanji, idx) => {
        const item = document.createElement("div");
        item.className = "kanji-list-item";
        item.innerHTML = `
          <div class="character">${kanji.character}</div>
          <div class="meaning">${kanji.meaning}</div>
        `;
        item.onclick = () => selectKanji(kanji);
        grid.appendChild(item);

        // Auto select first kanji
        if (idx === 0) selectKanji(kanji);
      });
    };
    const loadKanjiStrokePaths = async (kanji) => {
      if (kanji.svgPaths) return; // Already loaded

      // If database has strokePaths, use them (normalizing coordinates to 109x109 box)
      if (kanji.strokePaths && kanji.strokePaths.length > 0) {
        kanji.svgPaths = kanji.strokePaths.map(pathPoints => {
          if (pathPoints.length === 0) return "";
          const start = pathPoints[0];
          let d = `M ${start[0] * 1.09} ${start[1] * 1.09}`;
          for (let i = 1; i < pathPoints.length; i++) {
            d += ` L ${pathPoints[i][0] * 1.09} ${pathPoints[i][1] * 1.09}`;
          }
          return d;
        }).filter(d => d !== "");
        return;
      }

      // Fetch from KanjiVG GitHub
      try {
        const hex = kanji.character.codePointAt(0).toString(16).toLowerCase().padStart(5, '0');
        const response = await fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const svgText = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const paths = Array.from(doc.querySelectorAll("path")).map(p => p.getAttribute("d")).filter(Boolean);
        if (paths.length > 0) {
          kanji.svgPaths = paths;
        } else {
          kanji.svgPaths = [];
        }
      } catch (err) {
        console.warn("Failed to load KanjiVG stroke paths:", err);
        kanji.svgPaths = []; // Fallback to empty
      }
    };

    const selectKanji = async (kanji) => {
      this.activeKanji = kanji;
      if (this.stopStrokeAnimation) this.stopStrokeAnimation();
      await loadKanjiStrokePaths(kanji);
      const pane = document.getElementById("kanji-details-pane");
      const isBookmarked = this.state.user.bookmarks.kanji.includes(kanji.id);
      
      pane.innerHTML = `
        <div class="kanji-display-row">
          <div class="canvas-block">
            <div class="canvas-container">
              <canvas id="kanji-canvas" width="250" height="250"></canvas>
              <div class="canvas-grid-lines">
                <div class="line horizontal"></div>
                <div class="line vertical"></div>
              </div>
            </div>
            <div class="canvas-controls">
              <button class="btn btn-secondary btn-sm" id="canvas-clear-btn">🧹 Clear</button>
              <button class="btn btn-secondary btn-sm" id="canvas-animate-btn">▶️ Stroke Order</button>
              <button class="btn btn-success btn-sm" id="canvas-verify-btn">✔️ Verify</button>
            </div>
          </div>

          <div class="kanji-info-block">
            <div class="kanji-info-header">
              <div>
                <span class="kanji-label-tag">JLPT ${kanji.level}</span>
                <h2>${kanji.character}</h2>
              </div>
              <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" id="kanji-bookmark-btn">
                ${isBookmarked ? '★' : '☆'} Bookmark
              </button>
            </div>

            <div class="readings-grid">
              <div class="reading-row">
                <span class="label">Meaning:</span>
                <span class="val accent">${kanji.meaning}</span>
              </div>
              <div class="reading-row">
                <span class="label">Onyomi:</span>
                <span class="val">${kanji.onyomi}</span>
              </div>
              <div class="reading-row">
                <span class="label">Kunyomi:</span>
                <span class="val">${kanji.kunyomi}</span>
              </div>
              <div class="reading-row">
                <span class="label">Radicals:</span>
                <span class="val">${kanji.radicals}</span>
              </div>
              <div class="reading-row">
                <span class="label">Strokes:</span>
                <span class="val">${kanji.strokes} strokes</span>
              </div>
            </div>
          </div>
        </div>

        <div class="kanji-examples-section">
          <h3>Example Vocabulary</h3>
          <div class="kanji-examples-grid">
            ${kanji.examples.map(ex => `
              <div class="kanji-ex-card">
                <div class="ex-word">${ex.word}</div>
                <div class="ex-reading">Read: ${ex.reading}</div>
                <div class="ex-meaning">${ex.meaning}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      // Event listener for Kanji bookmark
      document.getElementById("kanji-bookmark-btn").onclick = (e) => {
        this.toggleBookmark("kanji", kanji.id, e.currentTarget);
      };

      // Set up Canvas drawing
      this.hasDrawn = false;       // Track if user has actually drawn anything
      this.drawnPointCount = 0;    // Track number of points drawn for meaningful stroke detection
      this.userStrokes = [];       // Track actual strokes drawn by the user
      this.currentStroke = null;
      this.initKanjiCanvas();

      // Trigger animations / clears
      document.getElementById("canvas-clear-btn").onclick = () => {
        this.hasDrawn = false;
        this.drawnPointCount = 0;
        this.stopStrokeAnimation();
        this.clearCanvas();
      };
      document.getElementById("canvas-animate-btn").onclick = () => {
        // Watching the animation doesn't count as drawing
        this.hasDrawn = false;
        this.drawnPointCount = 0;
        this.stopStrokeAnimation();
        this.animateStrokeOrder();
      };
      document.getElementById("canvas-verify-btn").onclick = () => {
        const paths = this.activeKanji.svgPaths;
        if (!paths || paths.length === 0) {
          // Fallback if no vector guidelines exist
          if (!this.hasDrawn || this.drawnPointCount < 3) {
            this.showNotification("✏️ Draw First!", "Please draw the kanji on the canvas before verifying.", "warning");
            return;
          }
          this.addXP(10);
          this.unlockBadge("b2");
          this.showNotification("🎯 Verified!", "Your kanji drawing has been verified! +10 XP", "success");
          this.clearCanvas();
          return;
        }

        const targetStrokesCount = paths.length;
        const userStrokesCount = this.userStrokes ? this.userStrokes.length : 0;

        if (userStrokesCount === 0) {
          this.showNotification("✏️ Draw First!", "Please draw the kanji on the canvas before verifying.", "warning");
          return;
        }

        if (userStrokesCount < targetStrokesCount) {
          this.showNotification("✏️ Missing Strokes", `You drew only ${userStrokesCount} of ${targetStrokesCount} strokes. Please complete all strokes in the correct order.`, "warning");
          return;
        }

        if (userStrokesCount > targetStrokesCount) {
          this.showNotification("✏️ Extra Strokes", `You drew ${userStrokesCount} strokes, but the Kanji only has ${targetStrokesCount} strokes. Please clear and try again.`, "warning");
          return;
        }

        // Verify each stroke in order
        const scale = 250 / 109;
        const maxAllowedDistance = 45; // Pixel distance tolerance

        for (let i = 0; i < targetStrokesCount; i++) {
          const pathD = paths[i];
          const userPoints = this.userStrokes[i];

          // Compute target start and end points using browser SVG element APIs
          const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          tempPath.setAttribute("d", pathD);
          const length = tempPath.getTotalLength();
          const targetStart = tempPath.getPointAtLength(0);
          const targetEnd = tempPath.getPointAtLength(length);

          const targetStartX = targetStart.x * scale;
          const targetStartY = targetStart.y * scale;
          const targetEndX = targetEnd.x * scale;
          const targetEndY = targetEnd.y * scale;

          // User points
          const userStartX = userPoints[0].x;
          const userStartY = userPoints[0].y;
          const userEndX = userPoints[userPoints.length - 1].x;
          const userEndY = userPoints[userPoints.length - 1].y;

          // Verify distance of start and end coordinates (validates order and direction)
          const startDist = Math.hypot(userStartX - targetStartX, userStartY - targetStartY);
          const endDist = Math.hypot(userEndX - targetEndX, userEndY - targetEndY);

          if (startDist > maxAllowedDistance || endDist > maxAllowedDistance) {
            this.showNotification("❌ Incorrect Stroke Order", `Stroke ${i + 1} was drawn incorrectly, in the wrong direction, or out of sequence. Follow the guide numbers.`, "warning");
            return;
          }
        }

        // All checks passed!
        this.addXP(10);
        this.unlockBadge("b2"); // Kanji Artist badge
        this.showNotification("🎯 Stroke Verified!", "Excellent practice! Your strokes look great and follow the correct order! +10 XP", "success");
        this.hasDrawn = false;
        this.drawnPointCount = 0;
        this.stopStrokeAnimation();
        this.clearCanvas();
      };
    };

    // Canvas Events
    this.initKanjiCanvas = () => {
      // Replace the canvas element with a clone to remove ALL previously-attached
      // event listeners (prevents listener accumulation when switching kanji).
      const oldCanvas = document.getElementById("kanji-canvas");
      if (!oldCanvas) return;
      const freshCanvas = oldCanvas.cloneNode(true);
      oldCanvas.parentNode.replaceChild(freshCanvas, oldCanvas);

      this.canvas = freshCanvas;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.lineWidth = 10;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";

      // Draw background guidelines of Kanji character
      this.drawKanjiGuidelines();

      // Drawing Event listeners (attached fresh – no accumulation)
      const startDrawing = (e) => {
        this.isDrawing = true;
        this.hasDrawn = true; // Mark that user has started drawing
        this.ctx.beginPath(); // Ensure the path starts fresh and doesn't connect to guidelines
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.currentStroke = [{ x, y }];
        
        this.draw(e);
      };

      const stopDrawing = () => {
        if (this.isDrawing && this.currentStroke && this.currentStroke.length >= 2) {
          if (!this.userStrokes) this.userStrokes = [];
          this.userStrokes.push(this.currentStroke);
        }
        this.isDrawing = false;
        this.currentStroke = null;
        this.ctx.beginPath();
      };

      this.canvas.addEventListener("mousedown", startDrawing);
      this.canvas.addEventListener("mousemove", (e) => {
        if (this.isDrawing) this.draw(e);
      });
      this.canvas.addEventListener("mouseup", stopDrawing);
      this.canvas.addEventListener("mouseleave", stopDrawing);

      // Touch Events for mobile support
      this.canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
      });

      this.canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
      });

      this.canvas.addEventListener("touchend", () => {
        this.canvas.dispatchEvent(new MouseEvent("mouseup", {}));
      });
    };

    this.draw = (e) => {
      if (!this.isDrawing || !this.canvas || !this.ctx) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.ctx.strokeStyle = "#ff4e50"; // Draw in coral accent color
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);

      // Increment stroke-point counter for meaningful draw detection
      this.drawnPointCount = (this.drawnPointCount || 0) + 1;
      
      // Push point to current user stroke
      if (this.currentStroke) {
        this.currentStroke.push({ x, y });
      }
    };

    this.stopStrokeAnimation = () => {
      if (this.strokeAnimationTimeout) {
        clearTimeout(this.strokeAnimationTimeout);
        this.strokeAnimationTimeout = null;
      }
      if (this.strokeSegmentTimeout) {
        clearTimeout(this.strokeSegmentTimeout);
        this.strokeSegmentTimeout = null;
      }
    };

    this.clearCanvas = () => {
      if (!this.canvas || !this.ctx) return;
      this.userStrokes = [];
      this.currentStroke = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawKanjiGuidelines();
    };

    this.drawKanjiGuidelines = () => {
      if (!this.canvas || !this.ctx || !this.activeKanji) return;
      
      this.ctx.save();
      
      const paths = this.activeKanji.svgPaths;
      if (paths && paths.length > 0) {
        // Draw the vector guidelines in background (faint blue/gray)
        this.ctx.save();
        this.ctx.scale(250 / 109, 250 / 109);
        this.ctx.strokeStyle = "rgba(37, 99, 235, 0.12)"; // Light blue guideline
        this.ctx.lineWidth = 6; // scaled to ~13.8px
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        
        paths.forEach(pathD => {
          this.ctx.stroke(new Path2D(pathD));
        });
        this.ctx.restore();

        // Draw numbers at the start of each path
        this.ctx.save();
        this.ctx.scale(250 / 109, 250 / 109);
        this.ctx.font = "bold 6px 'Outfit', sans-serif"; // scaled by ~2.3 = 13.8px
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        paths.forEach((pathD, idx) => {
          const match = pathD.match(/^[Mm]\s*(-?\d+\.?\d*)\s*[\s,]\s*(-?\d+\.?\d*)/);
          if (match) {
            const startX = parseFloat(match[1]);
            const startY = parseFloat(match[2]);

            // Draw the number text directly without any background circle
            this.ctx.fillStyle = "#2563eb"; // Royal blue for number text
            this.ctx.fillText(idx + 1, startX - 4, startY - 4);
          }
        });
        this.ctx.beginPath(); // Reset the path to ensure user drawings do not connect to the guidelines
        this.ctx.restore();
      } else {
        // Fallback to text guideline in background
        this.ctx.font = "160px 'Noto Sans JP', sans-serif";
        this.ctx.fillStyle = "rgba(100, 116, 139, 0.15)"; // Light grey guideline
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.activeKanji.character, this.canvas.width / 2, this.canvas.height / 2 + 10);
      }
      
      this.ctx.restore();
    };

    this.animateStrokeOrder = () => {
      if (!this.canvas || !this.ctx || !this.activeKanji) return;
      this.stopStrokeAnimation();
      
      // Reset drawn-state so watching the animation doesn't unlock Verify
      this.hasDrawn = false;
      this.drawnPointCount = 0;
      this.clearCanvas();

      const paths = this.activeKanji.svgPaths;
      if (!paths || paths.length === 0) return;

      let currentStrokeIdx = 0;
      
      const drawStrokeStep = () => {
        if (currentStrokeIdx >= paths.length) return;

        const pathD = paths[currentStrokeIdx];
        const path2d = new Path2D(pathD);

        // Create a temporary SVG path element to calculate the path length
        const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tempPath.setAttribute("d", pathD);
        const length = tempPath.getTotalLength();

        let startOffset = length;
        const speed = Math.max(1.5, length / 40); // Dynamic speed based on stroke length

        const animateSegment = () => {
          if (startOffset <= 0) {
            currentStrokeIdx++;
            // Pause between strokes
            this.strokeAnimationTimeout = setTimeout(drawStrokeStep, 350);
            return;
          }

          // Redraw guidelines first
          this.clearCanvas();
          
          // Draw previous completed strokes fully in dark blue
          this.ctx.save();
          this.ctx.scale(250 / 109, 250 / 109);
          this.ctx.strokeStyle = "#2563eb"; // Royal blue for completed strokes
          this.ctx.lineWidth = 7; // Thicker lines
          this.ctx.lineCap = "round";
          this.ctx.lineJoin = "round";
          for (let i = 0; i < currentStrokeIdx; i++) {
            this.ctx.stroke(new Path2D(paths[i]));
          }
          this.ctx.restore();

          // Draw the current stroke partially
          this.ctx.save();
          this.ctx.scale(250 / 109, 250 / 109);
          this.ctx.strokeStyle = "#2563eb"; // Royal blue
          this.ctx.lineWidth = 7; // Thicker lines
          this.ctx.lineCap = "round";
          this.ctx.lineJoin = "round";
          this.ctx.setLineDash([length, length]);
          this.ctx.lineDashOffset = startOffset;
          this.ctx.stroke(path2d);
          this.ctx.restore();

          startOffset -= speed;
          this.strokeSegmentTimeout = setTimeout(animateSegment, 16); // ~60fps
        };

        animateSegment();
      };

      drawStrokeStep();
    };

    // Sidebar listeners
    const searchInput = document.getElementById("kanji-search");
    searchInput.addEventListener("input", (e) => {
      searchVal = e.target.value;
      renderKanjiList();
    });

    document.querySelectorAll("#kanji-level-tabs .tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll("#kanji-level-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        activeLvl = e.target.getAttribute("data-lvl");
        renderKanjiList();
      });
    });

    // Render list
    renderKanjiList();

    // Kanji Quiz Mode
    const kQuizModal = document.getElementById("kanji-quiz-modal");
    document.getElementById("kanji-quiz-mode-btn").addEventListener("click", () => {
      const pool = window.kanjiDatabase.filter(k => k.level === activeLvl);
      if (pool.length < 2) {
        alert("Not enough kanji in this level for quiz selection.");
        return;
      }

      kQuizModal.style.display = "flex";
      let quizQuestions = [];
      let currentQIdx = 0;
      let score = 0;

      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      shuffled.forEach((k) => {
        // Option 1: Meaning quiz
        const wrongMeanings = pool.filter(p => p.id !== k.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(p => p.meaning);
        const options = [k.meaning, ...wrongMeanings].sort(() => 0.5 - Math.random());

        quizQuestions.push({
          question: `What is the meaning of the Kanji character: 「${k.character}」?`,
          options: options,
          correctIndex: options.indexOf(k.meaning),
          explanation: `The Kanji 「${k.character}」 means "${k.meaning}". Onyomi: ${k.onyomi}, Kunyomi: ${k.kunyomi}.`
        });
      });

      const showQuestion = () => {
        const q = quizQuestions[currentQIdx];
        document.getElementById("kanji-qp-fill").style.width = `${((currentQIdx) / quizQuestions.length) * 100}%`;
        document.getElementById("kanji-quiz-question").textContent = `Question ${currentQIdx + 1}: ${q.question}`;
        
        const optsContainer = document.getElementById("kanji-quiz-options");
        optsContainer.innerHTML = "";

        q.options.forEach((opt, idx) => {
          const btn = document.createElement("button");
          btn.className = "quiz-opt-btn";
          btn.textContent = opt;
          btn.onclick = () => selectOption(idx);
          optsContainer.appendChild(btn);
        });

        document.getElementById("kanji-quiz-feedback").style.display = "none";
        document.getElementById("kanji-quiz-next-btn").style.display = "none";
      };

      const selectOption = (idx) => {
        const q = quizQuestions[currentQIdx];
        const buttons = document.querySelectorAll(".quiz-opt-btn");
        buttons.forEach((btn, index) => {
          btn.disabled = true;
          if (index === q.correctIndex) btn.classList.add("correct");
          else if (index === idx) btn.classList.add("incorrect");
        });

        const feedback = document.getElementById("kanji-quiz-feedback");
        feedback.style.display = "block";

        if (idx === q.correctIndex) {
          score++;
          feedback.innerHTML = `<span class="correct-text">🎉 Correct!</span><p>${q.explanation}</p>`;
          this.addXP(6, true); // Silent – summary bonus shown at quiz end
        } else {
          feedback.innerHTML = `<span class="incorrect-text">❌ Incorrect.</span><p>${q.explanation}</p>`;
        }

        document.getElementById("kanji-quiz-next-btn").style.display = "block";
      };

      document.getElementById("kanji-quiz-next-btn").onclick = () => {
        if (currentQIdx < quizQuestions.length - 1) {
          currentQIdx++;
          showQuestion();
        } else {
          document.getElementById("kanji-qp-fill").style.width = "100%";
          document.getElementById("kanji-quiz-question").innerHTML = `Quiz Completed! <br><br>Score: <strong>${score} / ${quizQuestions.length}</strong>`;
          document.getElementById("kanji-quiz-options").innerHTML = `
            <div class="quiz-summary-box">
              <p>Excellent Kanji study session! You earned <strong>+${score * 10} XP</strong> bonus!</p>
              <button class="btn btn-primary" id="k-quiz-finish-close">Done</button>
            </div>
          `;
          document.getElementById("kanji-quiz-feedback").style.display = "none";
          document.getElementById("kanji-quiz-next-btn").style.display = "none";
          if (score > 0) this.addXP(score * 10); // Bonus XP only when at least 1 correct

          document.getElementById("k-quiz-finish-close").onclick = () => {
            kQuizModal.style.display = "none";
          };
        }
      };

      showQuestion();
    });

    document.getElementById("kanji-quiz-close").addEventListener("click", () => {
      kQuizModal.style.display = "none";
    });
  }

  renderGrammar(container) {
    const self = this;
    let activeLvl = "N5";
    let searchVal = "";

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Grammar Lessons</h1>
          <p>Study grammatical structures, sentence formations, and usage comparison cases.</p>
        </div>
      </div>

      <div class="filter-bar">
        <div class="search-box">
          <input type="text" id="grammar-search" placeholder="Search grammar rules (e.g. たい)...">
        </div>
        <div class="level-tabs" id="grammar-level-tabs">
          <button class="tab-btn active" data-lvl="N5">N5</button>
          <button class="tab-btn" data-lvl="N4">N4</button>
          <button class="tab-btn" data-lvl="N3">N3</button>
          <button class="tab-btn" data-lvl="N2">N2</button>
        </div>
        <div class="kana-tabs" id="kana-tabs">
          <button class="kana-tab-btn" data-kana="hiragana">Hiragana</button>
          <button class="kana-tab-btn" data-kana="katakana">Katakana</button>
        </div>
      </div>

      <div class="grammar-layout">
        <!-- List Panel -->
        <div class="grammar-list-panel" id="grammar-list-pane">
          <!-- Rendered dynamically -->
        </div>

        <!-- Detail View Panel -->
        <div class="grammar-detail-panel" id="grammar-detail-pane">
          <div class="empty-state">
            <p>Select a grammar pattern from the left side list to read the explanations, formations, and practice.</p>
          </div>
        </div>
      </div>

      <div class="kana-layout" id="kana-layout" style="display:none; margin-top:20px;">
        <div class="kana-list-panel" id="kana-list-pane">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    // --- Kana data containing Romaji mappings ---
    const hiraganaData = [
      { jp: "あ", romaji: "a" }, { jp: "い", romaji: "i" }, { jp: "う", romaji: "u" }, { jp: "え", romaji: "e" }, { jp: "お", romaji: "o" },
      { jp: "か", romaji: "ka" }, { jp: "き", romaji: "ki" }, { jp: "く", romaji: "ku" }, { jp: "け", romaji: "ke" }, { jp: "こ", romaji: "ko" },
      { jp: "さ", romaji: "sa" }, { jp: "し", romaji: "shi" }, { jp: "す", romaji: "su" }, { jp: "せ", romaji: "se" }, { jp: "そ", romaji: "so" },
      { jp: "た", romaji: "ta" }, { jp: "ち", romaji: "chi" }, { jp: "つ", romaji: "tsu" }, { jp: "て", romaji: "te" }, { jp: "と", romaji: "to" },
      { jp: "な", romaji: "na" }, { jp: "に", romaji: "ni" }, { jp: "ぬ", romaji: "nu" }, { jp: "ね", romaji: "ne" }, { jp: "の", romaji: "no" },
      { jp: "は", romaji: "ha" }, { jp: "ひ", romaji: "hi" }, { jp: "ふ", romaji: "fu" }, { jp: "へ", romaji: "he" }, { jp: "ほ", romaji: "ho" },
      { jp: "ま", romaji: "ma" }, { jp: "み", romaji: "mi" }, { jp: "む", romaji: "mu" }, { jp: "め", romaji: "me" }, { jp: "も", romaji: "mo" },
      { jp: "や", romaji: "ya" }, { jp: "ゆ", romaji: "yu" }, { jp: "よ", romaji: "yo" },
      { jp: "ら", romaji: "ra" }, { jp: "り", romaji: "ri" }, { jp: "る", romaji: "ru" }, { jp: "れ", romaji: "re" }, { jp: "ろ", romaji: "ro" },
      { jp: "わ", romaji: "wa" }, { jp: "を", romaji: "wo" }, { jp: "ん", romaji: "n" }
    ];

    const katakanaData = [
      { jp: "ア", romaji: "a" }, { jp: "イ", romaji: "i" }, { jp: "ウ", romaji: "u" }, { jp: "エ", romaji: "e" }, { jp: "オ", romaji: "o" },
      { jp: "カ", romaji: "ka" }, { jp: "キ", romaji: "ki" }, { jp: "ク", romaji: "ku" }, { jp: "ケ", romaji: "ke" }, { jp: "コ", romaji: "ko" },
      { jp: "サ", romaji: "sa" }, { jp: "シ", romaji: "shi" }, { jp: "ス", romaji: "su" }, { jp: "セ", romaji: "se" }, { jp: "ソ", romaji: "so" },
      { jp: "タ", romaji: "ta" }, { jp: "チ", romaji: "chi" }, { jp: "ツ", romaji: "tsu" }, { jp: "テ", romaji: "te" }, { jp: "ト", romaji: "to" },
      { jp: "ナ", romaji: "na" }, { jp: "ニ", romaji: "ni" }, { jp: "ヌ", romaji: "nu" }, { jp: "ネ", romaji: "ne" }, { jp: "ノ", romaji: "no" },
      { jp: "ハ", romaji: "ha" }, { jp: "ヒ", romaji: "hi" }, { jp: "フ", romaji: "fu" }, { jp: "ヘ", romaji: "he" }, { jp: "ホ", romaji: "ho" },
      { jp: "マ", romaji: "ma" }, { jp: "ミ", romaji: "mi" }, { jp: "ム", romaji: "mu" }, { jp: "メ", romaji: "me" }, { jp: "モ", romaji: "mo" },
      { jp: "ヤ", romaji: "ya" }, { jp: "ユ", romaji: "yu" }, { jp: "ヨ", romaji: "yo" },
      { jp: "ラ", romaji: "ra" }, { jp: "リ", romaji: "ri" }, { jp: "ル", romaji: "ru" }, { jp: "レ", romaji: "re" }, { jp: "ロ", romaji: "ro" },
      { jp: "ワ", romaji: "wa" }, { jp: "ヲ", romaji: "wo" }, { jp: "ン", romaji: "n" }
    ];

    // --- Rendering helpers for Kana ---
    function renderKanaList(type) {
      const pane = document.getElementById("kana-list-pane");
      pane.innerHTML = "";
      const list = type === "hiragana" ? hiraganaData : katakanaData;
      list.forEach(item => {
        const card = document.createElement("div");
        card.className = "kana-card";
        card.innerHTML = `
          <span class="kana-char">${item.jp}</span>
          <span class="kana-romaji">${item.romaji}</span>
        `;
        pane.appendChild(card);
      });
    }

    // Kana tab switching
    document.querySelectorAll("#kana-tabs .kana-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll("#kana-tabs .kana-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll("#grammar-level-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const type = e.target.getAttribute("data-kana");
        renderKanaList(type);
        // Hide grammar list/detail when viewing kana
        document.querySelector(".grammar-layout").style.display = "none";
        document.getElementById("kana-layout").style.display = "block";
      });
    });

    // Grammar tab switching (restore view)
    document.querySelectorAll("#grammar-level-tabs .tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll("#grammar-level-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll("#kana-tabs .kana-tab-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        activeLvl = e.target.getAttribute("data-lvl");
        renderGrammarList();
        // Show grammar layout, hide kana layout
        document.querySelector(".grammar-layout").style.display = "grid";
        document.getElementById("kana-layout").style.display = "none";
      });
    });

    // Preserve existing search functionality for grammar
    const searchInput = document.getElementById("grammar-search");
    searchInput.addEventListener("input", (e) => {
      searchVal = e.target.value;
      renderGrammarList();
    });

    // Initial render: grammar view
    document.querySelector(".grammar-layout").style.display = "grid";
    document.getElementById("kana-layout").style.display = "none";
    renderGrammarList();

    // --- Grammar rendering logic ---
    function renderGrammarList() {
      const pane = document.getElementById("grammar-list-pane");
      pane.innerHTML = "";
      const filtered = window.grammarDatabase.filter(g => {
        const lvlMatch = g.level === activeLvl;
        const searchMatch = searchVal === "" || g.pattern.toLowerCase().includes(searchVal.toLowerCase());
        return lvlMatch && searchMatch;
      });
      if (filtered.length === 0) {
        pane.innerHTML = `<div class="empty-state">No grammar rules found.</div>`;
        return;
      }
      filtered.forEach(g => {
        const item = document.createElement("div");
        item.className = "grammar-list-item";
        item.innerHTML = `
          <h4>${g.pattern}</h4>
          <p>${g.explanation ? g.explanation.substring(0, 45) + '...' : ''}</p>
        `;
        item.onclick = () => {
          try {
            renderGrammarDetail(g);
          } catch (err) {
            console.error("Error loading grammar detail:", err);
          }
        };
        pane.appendChild(item);
      });
    }

    function renderGrammarDetail(g) {
      const pane = document.getElementById("grammar-detail-pane");
      const isBookmarked = self.state.user.bookmarks.grammar && self.state.user.bookmarks.grammar.includes(g.id);

      // Helper: convert raw \n in formation strings to <br> for display
      const formatFormation = (text) => {
        if (!text) return '<span style="color:var(--text-secondary);">Not specified.</span>';
        return text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
      };

      // Helper: apply ruby markup to example furigana text
      const rubyExample = (text) => {
        return self.rubyExample(text);
      };

      pane.innerHTML = `
        <div class="grammar-detail-header">
          <h2>${g.pattern}</h2>
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" id="grammar-bookmark-btn">${isBookmarked ? '★' : '☆'}</button>
        </div>

        <!-- Explanation -->
        <div class="grammar-section-block">
          <h3>📖 Explanation</h3>
          <p>${g.explanation || '<em>No explanation provided.</em>'}</p>
        </div>

        <!-- Formation (Present / Past / Negative forms) -->
        <div class="grammar-section-block">
          <h3>🔧 Formation</h3>
          <div class="formation-box" style="background:var(--bg-tertiary); border-radius:12px; padding:14px 18px; border-left:3px solid var(--accent-indigo); font-family: var(--font-japanese); font-size:15px; line-height:2.0; white-space:pre-wrap;">
            ${formatFormation(g.formation)}
          </div>
        </div>

        <!-- Present & Past Formations Table -->
        ${(() => {
          const tableData = self.getTenseTable(g.pattern);
          if (!tableData) return '';
          return `
          <div class="grammar-section-block" style="margin-top:16px;">
            <h3>📊 Present &amp; Past Tense Formations</h3>
            <div style="overflow-x:auto; background:var(--bg-tertiary); border-radius:12px; padding:8px 12px; border:1px solid var(--border-color);">
              <table style="width:100%; border-collapse:collapse; text-align:left; font-size:14px;">
                <thead>
                  <tr style="border-bottom:1px solid var(--border-color); color:var(--text-secondary);">
                    <th style="padding:10px;">Tense / Form</th>
                    <th style="padding:10px;">Plain Form (Casual)</th>
                    <th style="padding:10px;">Polite Form (Formal)</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableData.rows.map(row => `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                      <td style="padding:10px; font-weight:600; color:var(--accent-indigo);">${row.tense}</td>
                      <td style="padding:10px; font-family:var(--font-japanese); font-size:16px;">${row.plain}</td>
                      <td style="padding:10px; font-family:var(--font-japanese); font-size:16px;">${row.polite}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          `;
        })()}

        <!-- Examples -->
        <div class="grammar-examples">
          <h3>✏️ Examples</h3>
          ${g.examples && g.examples.length > 0 ? g.examples.map(e => {
            const originalHTML = `
              <div class="example-item" style="margin-bottom:12px;">
                <span style="font-size:11px; background:rgba(99,102,241,0.15); color:var(--accent-indigo); padding:2px 8px; border-radius:10px; font-weight:700;">Present / Affirmative Form</span>
                <p class="jp font-japanese" style="font-size:18px; line-height:2.8; margin-top:6px; margin-bottom:4px;">${rubyExample(e.furigana || e.japanese || '')}</p>
                <p class="en" style="color:var(--text-secondary); font-size:14px; margin-bottom:6px;">${e.translation || ''}</p>
                ${e.breakdown ? `<p style="font-size:12px; color:var(--accent-indigo); margin-top:4px;">💡 ${e.breakdown}</p>` : ''}
              </div>
            `;
            
            const pastEx = self.conjugateSentenceToPast(e.furigana || e.japanese || '', e.translation || '');
            const pastHTML = pastEx ? `
              <div class="example-item" style="border-left: 2px dashed var(--success-color); padding-left: 12px; margin-top: 10px; margin-bottom: 20px; background: rgba(16,185,129,0.02);">
                <span style="font-size:11px; background:rgba(16,185,129,0.15); color:var(--success-color); padding:2px 8px; border-radius:10px; font-weight:700;">Past Form</span>
                <p class="jp font-japanese" style="font-size:18px; line-height:2.8; margin-top:6px; margin-bottom:4px;">${rubyExample(pastEx.japanese)}</p>
                <p class="en" style="color:var(--text-secondary); font-size:14px;">${pastEx.translation}</p>
              </div>
            ` : '';
            
            return originalHTML + pastHTML;
          }).join('') : '<p style="color:var(--text-secondary);">No examples available.</p>'}
        </div>

        <!-- Notes -->
        ${g.notes ? `
        <div class="grammar-section-block" style="background:rgba(16,185,129,0.06); border-radius:12px; padding:14px 18px; border-left:3px solid var(--success-color); margin-top:16px;">
          <h3 style="color:var(--success-color);">📝 Notes</h3>
          <p style="font-size:14px; line-height:1.7;">${g.notes}</p>
        </div>
        ` : ''}

        <!-- Common Mistakes -->
        ${g.commonMistakes && g.commonMistakes.explanation ? `
        <div class="grammar-section-block" style="background:rgba(239,68,68,0.05); border-radius:12px; padding:14px 18px; border-left:3px solid var(--danger-color); margin-top:16px;">
          <h3 style="color:var(--danger-color);">⚠️ Common Mistakes</h3>
          ${g.commonMistakes.incorrect ? `<p style="font-size:14px;"><span style="color:var(--danger-color); font-weight:700;">✗ Incorrect:</span> <span class="font-japanese">${g.commonMistakes.incorrect}</span></p>` : ''}
          ${g.commonMistakes.correct ? `<p style="font-size:14px; margin-top:6px;"><span style="color:var(--success-color); font-weight:700;">✓ Correct:</span> <span class="font-japanese">${g.commonMistakes.correct}</span></p>` : ''}
          ${g.commonMistakes.explanation ? `<p style="font-size:13px; color:var(--text-secondary); margin-top:8px;">${g.commonMistakes.explanation}</p>` : ''}
        </div>
        ` : ''}

        <!-- Comparison with similar grammar -->
        ${g.comparison && g.comparison.target ? `
        <div class="grammar-section-block" style="background:rgba(99,102,241,0.06); border-radius:12px; padding:14px 18px; border-left:3px solid var(--accent-indigo); margin-top:16px;">
          <h3 style="color:var(--accent-indigo);">🔀 Compare with: <span class="font-japanese">${g.comparison.target}</span></h3>
          <p style="font-size:14px; line-height:1.7;">${g.comparison.difference}</p>
        </div>
        ` : ''}
      `;

      const bookmarkBtn = document.getElementById("grammar-bookmark-btn");
      if (bookmarkBtn) {
        bookmarkBtn.onclick = (e) => {
          self.toggleBookmark("grammar", g.id, e.currentTarget);
        };
      }
    }
  }

  // READING COMPREHENSION PAGE RENDER
  renderReading(container) {
    const self = this;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Dynamic Reading Practice</h1>
          <p>Generate customized Japanese reading passages matching your JLPT level and study topic instantly.</p>
        </div>
      </div>
      <div id="reading-content-pane"></div>
    `;

    /**
     * Converts bare  KANJI<rt>reading</rt>  into  <ruby>KANJI<rt>reading</rt></ruby>
     * so furigana stacks ABOVE the kanji in all browsers.
     * Single-pass: ([^\s<>]+) captures the kanji, (<rt>...) captures the reading.
     */
    const applyRubyMarkup = (html) => {
      return html.replace(/([\u4e00-\u9fff\u3005\u3007]+)(<rt>[^<]*<\/rt>)/g, '<ruby>$1$2</ruby>');
    };


    const selectPassage = (pass) => {
      const pane = document.getElementById("reading-content-pane");

      pane.innerHTML = `
        <div class="passage-view-container">
          <div class="passage-header-block" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:15px; margin-bottom:20px;">
            <div>
              <span class="kanji-label-tag">JLPT ${pass.level} Reading</span>
              <h2 style="margin-top:5px;">${pass.title}</h2>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn btn-secondary" id="back-to-form-btn">⚡ New Passage</button>
            </div>
          </div>

          <div class="passage-body-row">
            <!-- Passage Text Content -->
            <div class="passage-text-card">
              <div class="passage-toggle-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <small>💡 Hover/click underlined words for English meanings!</small>
                <button class="control-btn" id="toggle-translation-btn" style="padding:5px 12px; font-size:12px; border-radius:12px;">📖 Show Translation</button>
              </div>

              <!-- Translation Panel (hidden by default) -->
              <div id="passage-translation-box" style="display:none; margin-bottom:20px; padding:15px; background:var(--bg-tertiary); border-radius:12px; border:1px solid var(--border-color); font-size:14px; line-height:1.6; color:var(--text-secondary);">
                <strong>English Translation:</strong>
                <p style="margin-top:5px; font-weight:500;">${pass.translation || "Translation not provided."}</p>
              </div>

              <div class="passage-content-box" id="reading-content-target"></div>
            </div>

            <!-- Comprehension Quiz -->
            <div class="passage-questions-pane">
              <h3>Comprehension Quiz</h3>
              <div id="reading-questions-container"></div>
            </div>
          </div>
        </div>
      `;

      document.getElementById("back-to-form-btn").onclick = () => renderGeneratorForm();

      // Translation toggle
      const transToggle = document.getElementById("toggle-translation-btn");
      const transBox = document.getElementById("passage-translation-box");
      transToggle.onclick = () => {
        const isHidden = transBox.style.display === "none";
        transBox.style.display = isHidden ? "block" : "none";
        transToggle.textContent = isHidden ? "📖 Hide Translation" : "📖 Show Translation";
      };

      // Inject passage content with correct furigana + hint tooltips
      const bodyBox = document.getElementById("reading-content-target");
      let formattedHTML = applyRubyMarkup(pass.content);

      if (pass.hints) {
        Object.keys(pass.hints).forEach(word => {
          const definition = pass.hints[word];
          // Only wrap plain text (not inside tags) to avoid breaking ruby markup
          formattedHTML = formattedHTML.replace(
            new RegExp(`(?<![\\w<])${word}(?![\\w>])`, 'g'),
            `<span class="reading-hint-word" data-hint="${definition}">${word}</span>`
          );
        });
      }

      bodyBox.innerHTML = formattedHTML;

      // Render comprehension questions
      const questionsBin = document.getElementById("reading-questions-container");
      questionsBin.innerHTML = "";

      if (pass.questions && pass.questions.length > 0) {
        pass.questions.forEach((q, qIdx) => {
          const qBlock = document.createElement("div");
          qBlock.className = "passage-q-block";
          qBlock.innerHTML = `
            <p class="question-text"><strong>Q${qIdx + 1}:</strong> ${q.question}</p>
            <div class="options-stack">
              ${q.options.map((opt, optIdx) => `
                <button class="passage-opt-btn" data-q="${qIdx}" data-opt="${optIdx}">${opt}</button>
              `).join("")}
            </div>
            <div class="passage-q-feedback" id="q-feedback-${qIdx}" style="display:none;"></div>
          `;

          qBlock.querySelectorAll(".passage-opt-btn").forEach(btn => {
            btn.onclick = (e) => {
              const sQIdx = parseInt(e.target.getAttribute("data-q"));
              const sOptIdx = parseInt(e.target.getAttribute("data-opt"));
              qBlock.querySelectorAll(".passage-opt-btn").forEach(b => b.disabled = true);

              const feedback = document.getElementById(`q-feedback-${sQIdx}`);
              feedback.style.display = "block";

              if (sOptIdx === q.answerIndex) {
                e.target.classList.add("correct");
                feedback.className = "passage-q-feedback success";
                feedback.innerHTML = `🎉 <strong>Correct!</strong><br>${q.explanation}`;
                self.addXP(20);
              } else {
                e.target.classList.add("incorrect");
                qBlock.querySelector(`[data-opt="${q.answerIndex}"]`).classList.add("correct");
                feedback.className = "passage-q-feedback error";
                feedback.innerHTML = `❌ <strong>Incorrect.</strong><br>${q.explanation}`;
              }
            };
          });

          questionsBin.appendChild(qBlock);
        });
      } else {
        questionsBin.innerHTML = `<div class="empty-state">No comprehension questions for this passage.</div>`;
      }
    };

    const renderGeneratorForm = () => {
      const pane = document.getElementById("reading-content-pane");

      pane.innerHTML = `
        <div class="generator-container" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:30px; border-radius:24px;">
          <div style="margin-bottom:25px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">
            <h2 style="display:flex; align-items:center; gap:10px;">✨ Dynamic Reading Generator</h2>
            <p style="color:var(--text-secondary); font-size:14px; margin-top:5px;">
              Select your JLPT level and study topic. Our procedural engine will compile a custom reading passage with interactive furigana, vocabulary hints, comprehension questions, and XP rewards.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:30px;">
            <!-- Level Selector -->
            <div class="form-group">
              <label style="display:block; font-weight:700; font-size:14px; margin-bottom:8px;">JLPT Difficulty Level</label>
              <div id="gen-level-selector" style="display:flex; gap:10px;">
                <button class="btn btn-secondary gen-lvl-btn active-mode-btn" data-lvl="N5" style="padding:10px 20px; flex:1;">N5</button>
                <button class="btn btn-secondary gen-lvl-btn" data-lvl="N4" style="padding:10px 20px; flex:1;">N4</button>
                <button class="btn btn-secondary gen-lvl-btn" data-lvl="N3" style="padding:10px 20px; flex:1;">N3</button>
                <button class="btn btn-secondary gen-lvl-btn" data-lvl="N2" style="padding:10px 20px; flex:1;">N2</button>
              </div>
            </div>

            <!-- Topic Selector -->
            <div class="form-group">
              <label for="gen-topic-selector" style="display:block; font-weight:700; font-size:14px; margin-bottom:8px;">Reading Scenario / Topic</label>
              <select id="gen-topic-selector" style="width:100%; padding:12px 15px; border-radius:12px; background:var(--bg-tertiary); border:1px solid var(--border-color); color:var(--text-primary); outline:none; font-weight:600; cursor:pointer;">
                <option value="daily">🏡 Daily Life (日常)</option>
                <option value="travel">✈️ Travel &amp; Direction (旅行)</option>
                <option value="dining">🍜 Food &amp; Dining (食事)</option>
                <option value="shopping">🛒 Shopping &amp; Services (買い物)</option>
                <option value="hobbies">🎨 Hobbies &amp; Recreation (趣味)</option>
                <option value="weather">☀ Weather &amp; Seasons (天気)</option>
                <option value="anime">🐱 Anime &amp; Manga (アニメ)</option>
                <option value="movies">🎬 Movies &amp; Cinema (映画)</option>
                <option value="series">📺 TV Series &amp; Dramas (ドラマ)</option>
              </select>
            </div>
          </div>

          <div style="margin-top:35px; border-top:1px solid var(--border-color); padding-top:25px; display:flex; justify-content:center;">
            <button class="btn btn-primary" id="trigger-generation-btn" style="padding:15px 50px; font-size:16px; border-radius:30px; font-weight:700; width:100%; max-width:400px;">
              Generate Reading Passage ⚡
            </button>
          </div>
        </div>
      `;

      // Level button selection
      let selectedLevel = "N5";
      document.querySelectorAll(".gen-lvl-btn").forEach(btn => {
        btn.onclick = (e) => {
          document.querySelectorAll(".gen-lvl-btn").forEach(b => b.classList.remove("active-mode-btn"));
          e.target.classList.add("active-mode-btn");
          selectedLevel = e.target.getAttribute("data-lvl");
        };
      });

      // Generate button
      document.getElementById("trigger-generation-btn").onclick = async () => {
        const topic = document.getElementById("gen-topic-selector").value;

        pane.innerHTML = `
          <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:350px; text-align:center;">
            <div style="font-size:50px; margin-bottom:20px; animation: spin 1s linear infinite;">🥷</div>
            <h3>Kakashi is writing your reading passage...</h3>
            <p style="color:var(--text-secondary); margin-top:8px; font-size:14px;">Synthesizing templates and vocabulary for ${selectedLevel}...</p>
          </div>
        `;

        try {
          await new Promise(resolve => setTimeout(resolve, 700));
          const generated = window.JapaneseReadingGenerator.generateProceduralPassage(
            selectedLevel, topic, null, null
          );
          generated.id = "gen_" + Date.now();
          generated.level = selectedLevel;
          selectPassage(generated);
        } catch (err) {
          console.error(err);
          pane.innerHTML = `
            <div style="text-align:center; padding:40px; border:1px solid var(--border-color); border-radius:24px; background:rgba(239,68,68,0.05);">
              <span style="font-size:40px;">⚠️</span>
              <h3 style="margin-top:15px; color:var(--danger-color);">Generation Failed</h3>
              <p style="color:var(--text-secondary); margin-top:8px; font-size:14px;">An error occurred during passage synthesis.</p>
              <button class="btn btn-primary" id="retry-form-btn" style="margin-top:20px;">Back to Settings</button>
            </div>
          `;
          document.getElementById("retry-form-btn").onclick = () => renderGeneratorForm();
        }
      };
    };

    renderGeneratorForm();
  }

  // PRACTICE TEST PAGE RENDER
  renderPracticeTests(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>JLPT Practice Tests</h1>
          <p>Evaluate your skills under simulated test conditions. Select a mini mock exam to begin.</p>
        </div>
      </div>

      <div class="test-selection-panel" id="test-selector-screen">
        <div class="test-card-box">
          <h3>JLPT N5 Practice Test</h3>
          <p>4 questions covering N5 Kanji, grammar endings, particle placement, and basic vocabulary.</p>
          <div class="test-meta">⏳ Limit: 5 mins • XP Reward: +30 XP</div>
          <button class="btn btn-primary start-test-btn" data-lvl="N5">Start N5 Test</button>
        </div>
        <div class="test-card-box">
          <h3>JLPT N4 Practice Test</h3>
          <p>3 questions testing ability clauses, dictionary form adapters, and kanji combinations.</p>
          <div class="test-meta">⏳ Limit: 5 mins • XP Reward: +30 XP</div>
          <button class="btn btn-primary start-test-btn" data-lvl="N4">Start N4 Test</button>
        </div>
        <div class="test-card-box">
          <h3>JLPT N3 Practice Test</h3>
          <p>2 intermediate questions regarding external arrangements, passives, and compound readings.</p>
          <div class="test-meta">⏳ Limit: 5 mins • XP Reward: +30 XP</div>
          <button class="btn btn-primary start-test-btn" data-lvl="N3">Start N3 Test</button>
        </div>
        <div class="test-card-box">
          <h3>JLPT N2 Practice Test</h3>
          <p>2 advanced questions covering continuous progressive trends and complex character pronunciations.</p>
          <div class="test-meta">⏳ Limit: 5 mins • XP Reward: +40 XP</div>
          <button class="btn btn-primary start-test-btn" data-lvl="N2">Start N2 Test</button>
        </div>
      </div>

      <div class="test-runner-panel" id="test-runner-screen" style="display:none;">
        <div class="test-runner-header">
          <h2 id="active-test-title">JLPT N5 Test</h2>
          <div class="test-timer" id="test-countdown">05:00</div>
        </div>
        <div class="test-progress-strip">
          <div class="fill" id="test-bar-fill" style="width:0%;"></div>
        </div>

        <div class="test-q-wrapper" id="test-q-pane">
          <!-- Active Question Rendered -->
        </div>

        <div class="test-runner-footer">
          <button class="btn btn-secondary" id="test-prev-q">Previous Question</button>
          <button class="btn btn-success" id="test-next-q">Next Question</button>
        </div>
      </div>

      <div class="test-results-panel" id="test-results-screen" style="display:none;">
        <!-- Scores Rendered here -->
      </div>
    `;

    let activeLvl = "N5";
    let questions = [];
    let currentQIdx = 0;
    let answers = {}; // { qIdx: selectedOptIdx }
    let timerInterval = null;
    let secondsLeft = 300;

    const startTest = (lvl) => {
      activeLvl = lvl;
      questions = window.mockTestsDatabase[lvl];
      currentQIdx = 0;
      answers = {};
      secondsLeft = 300;

      document.getElementById("test-selector-screen").style.display = "none";
      document.getElementById("test-runner-screen").style.display = "block";
      document.getElementById("test-results-screen").style.display = "none";
      document.getElementById("active-test-title").textContent = `JLPT ${lvl} Mini Mock Exam`;

      // Start Timer
      clearInterval(timerInterval);
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        secondsLeft--;
        updateTimerDisplay();
        if (secondsLeft <= 0) {
          clearInterval(timerInterval);
          finishTest();
        }
      }, 1000);

      renderQuestion();
    };

    const updateTimerDisplay = () => {
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      document.getElementById("test-countdown").textContent = 
        `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    };

    const renderQuestion = () => {
      const q = questions[currentQIdx];
      const pane = document.getElementById("test-q-pane");
      
      document.getElementById("test-bar-fill").style.width = `${((currentQIdx + 1) / questions.length) * 100}%`;
      document.getElementById("test-prev-q").disabled = currentQIdx === 0;
      document.getElementById("test-next-q").textContent = currentQIdx === questions.length - 1 ? "Finish & Submit" : "Next Question";

      pane.innerHTML = `
        <div class="exam-question-box">
          <div class="ex-q-num">Question ${currentQIdx + 1} of ${questions.length}</div>
          <div class="ex-q-text">${q.question}</div>
          <div class="ex-options-grid">
            ${q.options.map((opt, idx) => `
              <label class="ex-option-row ${answers[currentQIdx] === idx ? 'checked' : ''}">
                <input type="radio" name="exam-opt" value="${idx}" ${answers[currentQIdx] === idx ? 'checked' : ''}>
                <span class="bullet">${String.fromCharCode(65 + idx)}</span>
                <span class="text">${opt}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `;

      // Radio Selection Events
      pane.querySelectorAll('input[type="radio"]').forEach(rad => {
        rad.addEventListener("change", (e) => {
          const selectedIdx = parseInt(e.target.value);
          answers[currentQIdx] = selectedIdx;
          renderQuestion(); // Re-render to update selected visuals
        });
      });
    };

    const finishTest = () => {
      clearInterval(timerInterval);
      
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.answerIndex) {
          correctCount++;
        }
      });

      const scorePct = Math.round((correctCount / questions.length) * 100);
      const passed = scorePct >= 60;
      const xpWon = passed ? 30 : 10;

      this.addXP(xpWon);
      if (passed) {
        this.unlockBadge("b5"); // Exam Ace badge
        this.state.user.completedTests.push(activeLvl);
        this.saveState();
      }

      document.getElementById("test-runner-screen").style.display = "none";
      const resultsPane = document.getElementById("test-results-screen");
      resultsPane.style.display = "block";

      resultsPane.innerHTML = `
        <div class="test-results-card">
          <div class="result-badge ${passed ? 'passed' : 'failed'}">${passed ? 'PASSED' : 'TRY AGAIN'}</div>
          <h2>JLPT ${activeLvl} Practice Test Report</h2>
          <div class="score-grid">
            <div class="score-circle">
              <span class="pct">${scorePct}%</span>
              <span class="fraction">${correctCount} / ${questions.length} Correct</span>
            </div>
            <div class="meta-stats">
              <p>📍 Required: <strong>60%</strong> to Pass</p>
              <p>✨ Rewards Unlocked: <strong>+${xpWon} XP</strong></p>
              <p>🥷 Kakashi says: <em>"${passed ? 'Excellent focus, shinobi! You have mastered the fundamentals of this level. Onward to your next challenge!' : 'Do not lose heart! Every mistake is a step closer to mastery. Review your incorrect answers and try again.'}"</em></p>
            </div>
          </div>

          <div class="wrong-answers-review">
            <h3>Questions Review</h3>
            ${questions.map((q, idx) => {
              const userAns = answers[idx];
              const isCorrect = userAns === q.answerIndex;
              return `
                <div class="review-item-row ${isCorrect ? 'correct' : 'incorrect'}">
                  <p class="review-q"><strong>Q${idx + 1}:</strong> ${q.question}</p>
                  <p class="answer-status">
                    Your Answer: <strong>${userAns !== undefined ? q.options[userAns] : 'Not Answered'}</strong> 
                    ${isCorrect ? '✔️' : `(Correct: <strong>${q.options[q.answerIndex]}</strong>)`}
                  </p>
                  <p class="review-explanation">💡 ${q.explanation}</p>
                </div>
              `;
            }).join("")}
          </div>

          <div style="text-align:center; margin-top:30px;">
            <button class="btn btn-primary" id="test-results-back-btn">Return to Tests</button>
          </div>
        </div>
      `;

      document.getElementById("test-results-back-btn").onclick = () => {
        document.getElementById("test-results-screen").style.display = "none";
        document.getElementById("test-selector-screen").style.display = "flex";
      };
    };

    // Runner Actions listeners
    document.getElementById("test-prev-q").onclick = () => {
      if (currentQIdx > 0) {
        currentQIdx--;
        renderQuestion();
      }
    };

    document.getElementById("test-next-q").onclick = () => {
      if (currentQIdx < questions.length - 1) {
        currentQIdx++;
        renderQuestion();
      } else {
        if (confirm("Are you sure you want to submit your answers and complete the exam?")) {
          finishTest();
        }
      }
    };

    document.querySelectorAll(".start-test-btn").forEach(btn => {
      btn.onclick = (e) => {
        const lvl = e.target.getAttribute("data-lvl");
        startTest(lvl);
      };
    });
  }

  // USER DASHBOARD PAGE RENDER
  renderDashboard(container) {
    // Generate recent activity logs HTML
    const recentActHTML = this.state.user.recentLessons.map(log => `
      <div class="activity-row-item">
        <div class="act-icon">${log.type === 'vocab' ? '🎴' : log.type === 'kanji' ? '✍️' : log.type === 'grammar' ? '📚' : '📖'}</div>
        <div class="act-info">
          <h4>${log.name}</h4>
          <span>Category: ${log.type.toUpperCase()}</span>
        </div>
        <div class="act-date">${log.date}</div>
      </div>
    `).join("");

    // Generate Badges List
    const badgesHTML = this.state.user.badges.map(b => `
      <div class="badge-item-box ${b.unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-emoj">${b.unlocked ? b.icon : '🔒'}</div>
        <h4>${b.title}</h4>
        <p>${b.description}</p>
      </div>
    `).join("");

    // Calculate dynamic personalized recommendations based on level
    let recHTML = `
      <div class="rec-card" onclick="window.location.hash='#kanji'">
        <h4>✍️ Practice Kanji Drawing</h4>
        <p>Improve your memory by tracing and verifying N5 Kanji stroke orders on the canvas laboratory.</p>
      </div>
      <div class="rec-card" onclick="window.location.hash='#kakashi'">
        <h4>🥷 Chat with Kakashi AI</h4>
        <p>Ask Kakashi to test you with a quick grammar quiz, or get feedback on a sentence with "correct: [sentence]".</p>
      </div>
    `;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Track your XP points, levels, continuous study streaks, and unlock achievement badges.</p>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Top Stats row -->
        <div class="dash-stat-row">
          <div class="dash-stat-card streak">
            <div class="icon">🔥</div>
            <div class="stats">
              <span class="value">${this.state.user.streak} Days</span>
              <span class="label">Daily study streak! Keep the flame burning.</span>
            </div>
          </div>
          <div class="dash-stat-card level">
            <div class="icon">🥷</div>
            <div class="stats">
              <span class="value">Level ${this.state.user.level}</span>
              <span class="label">Ninja Scholar Rank</span>
            </div>
          </div>
          <div class="dash-stat-card total-xp">
            <div class="icon">✨</div>
            <div class="stats">
              <span class="value">${this.state.user.xp} / ${this.state.user.xpToNextLevel} XP</span>
              <span class="label">Progress to Level ${this.state.user.level + 1}</span>
            </div>
          </div>
        </div>

        <!-- Left Column: XP Progress and Charts -->
        <div class="dash-left">
          <div class="dash-block">
            <h3>XP Progress Ring</h3>
            <div style="display:flex; justify-content:center; align-items:center; padding:30px 0;">
              <svg width="180" height="180" viewBox="0 0 180 180" class="xp-ring-svg">
                <circle cx="90" cy="90" r="70" class="ring-bg"></circle>
                <circle cx="90" cy="90" r="70" class="ring-fill" 
                  style="stroke-dashoffset: ${440 - (440 * (this.state.user.xp / this.state.user.xpToNextLevel))};">
                </circle>
                <text x="90" y="85" class="ring-lvl">Lvl ${this.state.user.level}</text>
                <text x="90" y="110" class="ring-xp">${this.state.user.xp} / ${this.state.user.xpToNextLevel} XP</text>
              </svg>
            </div>
          </div>

          <div class="dash-block">
            <h3>Weekly Study Summary</h3>
            <div class="weekly-chart-container">
              <div class="bar-col">
                <div class="bar" style="height: 40%"></div>
                <div class="day-lbl">Mon</div>
              </div>
              <div class="bar-col">
                <div class="bar" style="height: 70%"></div>
                <div class="day-lbl">Tue</div>
              </div>
              <div class="bar-col">
                <div class="bar" style="height: 10%"></div>
                <div class="day-lbl">Wed</div>
              </div>
              <div class="bar-col">
                <div class="bar" style="height: 90%"></div>
                <div class="day-lbl">Thu</div>
              </div>
              <div class="bar-col">
                <div class="bar" style="height: 55%"></div>
                <div class="day-lbl">Fri</div>
              </div>
              <div class="bar-col">
                <div class="bar" style="height: 0%"></div>
                <div class="day-lbl">Sat</div>
              </div>
              <div class="bar-col">
                <div class="bar" style="height: 0%"></div>
                <div class="day-lbl">Sun</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Recent activity and achievements -->
        <div class="dash-right">
          <div class="dash-block">
            <h3>Personalized Recommendations</h3>
            <div class="recs-stack">
              ${recHTML}
            </div>
          </div>

          <div class="dash-block">
            <h3>Recently Studied Lessons</h3>
            <div class="activity-list">
              ${recentActHTML || '<div class="empty-state">No recent study sessions logged.</div>'}
            </div>
          </div>
        </div>

        <!-- Badges Area bottom -->
        <div class="dash-bottom-badges dash-block" style="grid-column: 1 / -1;">
          <h3>Ninja Achievements & Badges</h3>
          <div class="badges-flex">
            ${badgesHTML}
          </div>
        </div>
      </div>
    `;
  }

  // LOGIN / SIGNUP PAGE RENDER
  renderLogin(container) {
    container.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-card">
          <div class="auth-tabs">
            <button class="tab active" id="auth-tab-login">Login</button>
            <button class="tab" id="auth-tab-signup">Sign Up</button>
          </div>

          <!-- Login Form -->
          <form id="auth-login-form" class="auth-form">
            <h2>Welcome Back, Shinobi!</h2>
            <p>Log in to load your personalized Japanese study streak and bookmarked vocabulary.</p>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="login-email" placeholder="example@ninjapath.com" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="login-password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Log In</button>
          </form>

          <!-- Signup Form -->
          <form id="auth-signup-form" class="auth-form" style="display:none;">
            <h2>Start Your Learning Path</h2>
            <p>Create a profile to sync statistics, bookmarks, streaks, and interact with Kakashi AI.</p>
            <div class="form-group">
              <label>Username</label>
              <input type="text" id="signup-user" placeholder="JapLearner99" required>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="signup-email" placeholder="example@ninjapath.com" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="signup-password" placeholder="Minimum 6 characters" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Create Account</button>
          </form>

          <div class="auth-footer-demo">
            <p>💡 <em>Demo Note: You can sign up with any mock credentials to instantly create a custom profile!</em></p>
          </div>
        </div>
      </div>
    `;

    const tabLogin = document.getElementById("auth-tab-login");
    const tabSignup = document.getElementById("auth-tab-signup");
    const formLogin = document.getElementById("auth-login-form");
    const formSignup = document.getElementById("auth-signup-form");

    tabLogin.onclick = () => {
      tabLogin.classList.add("active");
      tabSignup.classList.remove("active");
      formLogin.style.display = "block";
      formSignup.style.display = "none";
    };

    tabSignup.onclick = () => {
      tabSignup.classList.add("active");
      tabLogin.classList.remove("active");
      formSignup.style.display = "block";
      formLogin.style.display = "none";
    };

    // Form Submits
    formLogin.onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;

      if (email && pass) {
        this.state.user.username = email.split("@")[0]; // Simple mockup username
        this.state.user.xp = 35; // Preset values
        this.saveState();
        this.updateUserSessionUI();
        this.updateDashboardStats();
        this.showNotification("🔑 Login Successful", `Welcome back, ${this.state.user.username}!`, "success");
        this.navigateTo("dashboard");
      }
    };

    formSignup.onsubmit = (e) => {
      e.preventDefault();
      const user = document.getElementById("signup-user").value;
      const email = document.getElementById("signup-email").value;
      const pass = document.getElementById("signup-password").value;

      if (user && email && pass) {
        // Reset/Create new profile
        this.state = this.getInitialState();
        this.state.user.username = user;
        this.state.user.xp = 10;
        this.saveState();
        this.updateUserSessionUI();
        this.updateDashboardStats();
        this.showNotification("🌱 Registration Completed", "Your Shinobi learning path starts now! +10 XP", "success");
        this.navigateTo("dashboard");
      }
    };
  }

  // KAKASHI AI PAGE RENDER
  renderKakashi(container) {
    container.innerHTML = `
      <div class="kakashi-container">
        <!-- Sidebar Panel for Quick options -->
        <div class="kakashi-chat-sidebar">
          <div class="tutor-header">
            <img src="assets/kakashi.png" alt="Kakashi Avatar" class="tutor-img">
            <h3>Kakashi Sensei</h3>
            <span>Friendly AI Tutor</span>
          </div>

          <div class="chat-chips-area">
            <h4>Quick Prompt Chips</h4>
            <button class="chip-prompt" data-prompt="Explain particle は vs が">は vs が Difference</button>
            <button class="chip-prompt" data-prompt="Explain particle に vs で">に vs で Difference</button>
            <button class="chip-prompt" data-prompt="How do I use grammar: ～たい">Want to... (たい form)</button>
            <button class="chip-prompt" data-prompt="Give me a study plan for JLPT N5">N5 Study Plan</button>
            <button class="chip-prompt" data-prompt="Give me a quiz">📝 Generate a Quiz</button>
            <button class="chip-prompt" data-prompt="correct: 私は日本語を勉強が好きです。">🔍 Correct my writing</button>
            <button class="chip-prompt" data-prompt="breakdown: 日本に行きたいです。">🔎 Sentence Breakdown</button>
          </div>

          <button class="btn btn-secondary btn-block" id="chat-clear-history-btn" style="margin-top:20px;">🧹 Clear Chat History</button>
        </div>

        <!-- Chat logs view -->
        <div class="kakashi-chat-main">
          <div class="chat-messages-scroll" id="chat-msg-scroll-bin">
            <!-- Messages render dynamically -->
          </div>

          <div class="chat-input-bar">
            <input type="text" id="chat-user-input" placeholder="Ask Kakashi about Japanese grammar, vocabulary, writing rules...">
            <button class="btn btn-primary" id="chat-send-btn">Send</button>
          </div>
        </div>
      </div>
    `;

    const chatBin = document.getElementById("chat-msg-scroll-bin");
    const input = document.getElementById("chat-user-input");
    const sendBtn = document.getElementById("chat-send-btn");

    const renderChatLogs = () => {
      chatBin.innerHTML = "";
      this.kakashi.chatHistory.forEach((msg, idx) => {
        const item = document.createElement("div");
        item.className = `chat-bubble-row ${msg.sender === 'user' ? 'user-side' : 'bot-side'}`;

        let textHTML = msg.text
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold markdown
          .replace(/\*(.*?)\*/g, "<em>$1</em>") // italics markdown
          .replace(/### (.*?)\n/g, "<h3>$1</h3>") // h3 markdown
          .replace(/#### (.*?)\n/g, "<h4>$1</h4>") // h4 markdown
          .replace(/`([^`]+)`/g, "<code>$1</code>") // inline code markdown
          .replace(/\n/g, "<br>"); // newlines

        let interactiveHTML = "";
        // If the message has interactive quiz options
        if (msg.isQuiz && msg.quizOptions) {
          interactiveHTML = `
            <div class="chat-quiz-options-bin">
              ${msg.quizOptions.map((opt, optIdx) => `
                <button class="chat-quiz-btn" data-msg-idx="${idx}" data-opt-idx="${optIdx}">${opt}</button>
              `).join("")}
            </div>
          `;
        }

        item.innerHTML = `
          <img src="${msg.sender === 'user' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=user' : this.kakashi.botAvatar}" class="chat-avatar">
          <div class="bubble-content-block">
            <div class="bubble-content">
              ${textHTML}
              ${interactiveHTML}
            </div>
            <span class="timestamp">${msg.timestamp}</span>
          </div>
        `;

        // Interactive quiz buttons listeners
        item.querySelectorAll(".chat-quiz-btn").forEach(btn => {
          btn.onclick = (e) => {
            const optIdx = parseInt(e.target.getAttribute("data-opt-idx"));
            
            // Lock other buttons
            e.target.closest(".chat-quiz-options-bin").querySelectorAll("button").forEach(b => b.disabled = true);
            
            // Submit to Kakashi
            const result = this.kakashi.submitQuizAnswer(optIdx);
            
            // Add bot reply to chat history
            this.kakashi.addMessage("bot", result.text);
            
            // Add rewards
            if (result.xpGained) {
              this.addXP(result.xpGained);
              this.unlockBadge("b4"); // Kakashi Friend badge
            }

            renderChatLogs();
          };
        });

        chatBin.appendChild(item);
      });
      chatBin.scrollTop = chatBin.scrollHeight;
    };

    const submitUserMessage = (textVal) => {
      if (!textVal.trim()) return;

      // Add user message
      this.kakashi.addMessage("user", textVal);
      renderChatLogs();

      // Show Kakashi typing placeholder
      const typingBubble = document.createElement("div");
      typingBubble.className = "chat-bubble-row bot-side typing-placeholder";
      typingBubble.innerHTML = `
        <img src="${this.kakashi.botAvatar}" class="chat-avatar">
        <div class="bubble-content-block">
          <div class="bubble-content">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      `;
      chatBin.appendChild(typingBubble);
      chatBin.scrollTop = chatBin.scrollHeight;

      // Simulate network delay
      setTimeout(() => {
        typingBubble.remove();
        const response = this.kakashi.generateResponse(textVal);
        
        // Add bot message
        this.kakashi.addMessage("bot", response.text, {
          isQuiz: response.isQuiz || false,
          quizOptions: response.quizOptions || null
        });

        if (response.xpGained) {
          this.addXP(response.xpGained);
        }

        renderChatLogs();
      }, 1000);
    };

    // Send Button click
    sendBtn.onclick = () => {
      submitUserMessage(input.value);
      input.value = "";
    };

    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        submitUserMessage(input.value);
        input.value = "";
      }
    };

    // Chat Chips prompts
    document.querySelectorAll(".chip-prompt").forEach(btn => {
      btn.onclick = () => {
        submitUserMessage(btn.getAttribute("data-prompt"));
      };
    });

    // Clear history
    document.getElementById("chat-clear-history-btn").onclick = () => {
      this.kakashi.clearHistory();
      renderChatLogs();
      this.showNotification("🧹 Chat History Cleared", "Your conversation logs with Kakashi have been reset.", "info");
    };

    renderChatLogs();
  }

  // BOOKMARK MANAGEMENT
  toggleBookmark(type, itemId, buttonElement) {
    const list = this.state.user.bookmarks[type];
    const index = list.indexOf(itemId);

    if (index === -1) {
      list.push(itemId);
      buttonElement.classList.add("active");
      buttonElement.textContent = buttonElement.textContent.replace('☆', '★');
      this.showNotification("⭐ Bookmark Added", "Item saved to bookmarks library.", "info");
    } else {
      list.splice(index, 1);
      buttonElement.classList.remove("active");
      buttonElement.textContent = buttonElement.textContent.replace('★', '☆');
      this.showNotification("🗑️ Bookmark Removed", "Item removed from bookmarks library.", "info");
    }
    this.saveState();
  }
}
