// Kakashi AI Assistant Logic for Nihongo Path

class KakashiAssistant {
  constructor() {
    this.chatHistory = this.loadChatHistory();
    this.botAvatar = "assets/kakashi.png";
    this.userName = "Studious Shinobi";
  }

  loadChatHistory() {
    // Clear chat history on page reload/refresh
    localStorage.removeItem("kakashi_chat_history");
    return [
      {
        sender: "bot",
        text: "Yo! I am **Kakashi**, the famous Copy Ninja of the Leaf, and your personal Japanese tutor. 🥷✨ I am here to help you master Japanese from JLPT N5 to N2!\n\nHere is how I can assist you:\n* Explain complex grammar rules simply\n* Compare particles like **は vs が** or **に vs で**\n* Break down sentence structures\n* Correct your Japanese writing\n* Generate quick practice quizzes\n* Recommend a study plan for your JLPT goals\n\nHow can I help you today? Try typing a question below or selecting a quick option!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      }
    ];
  }

  saveChatHistory() {
    localStorage.setItem("kakashi_chat_history", JSON.stringify(this.chatHistory));
  }

  clearHistory() {
    this.chatHistory = [
      {
        sender: "bot",
        text: "Yo! I am **Kakashi**, the famous Copy Ninja of the Leaf, and your personal Japanese tutor. 🥷✨ I am here to help you master Japanese from JLPT N5 to N2!\n\nHere is how I can assist you:\n* Explain complex grammar rules simply\n* Compare particles like **は vs が** or **に vs で**\n* Break down sentence structures\n* Correct your Japanese writing\n* Generate quick practice quizzes\n* Recommend a study plan for your JLPT goals\n\nHow can I help you today? Try typing a question below or selecting a quick option!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      }
    ];
    this.saveChatHistory();
  }

  addMessage(sender, text, extra = null) {
    const message = {
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...extra
    };
    this.chatHistory.push(message);
    this.saveChatHistory();
    return message;
  }

  // AI Response Generation based on Keywords, Sentence Parsing, or Quizzes
  async generateResponse(userInput) {
    // Normalize input (strip punctuation like ? ! . and lowercase)
    const cleanInput = userInput.replace(/[?!\.,\s]+/g, " ").trim().toLowerCase();
    const input = userInput.trim().toLowerCase();
    
    // 1. Check for Quiz requests
    if (cleanInput.includes("quiz") || cleanInput.includes("テスト") || cleanInput.includes("クイズ") || cleanInput.includes("practice question")) {
      return this.handleQuizRequest();
    }

    // 2. Check for Writing Correction
    if (input.startsWith("correct:") || input.startsWith("correct this:") || input.startsWith("添削:") || cleanInput.includes("correct my sentence")) {
      return this.handleWritingCorrection(userInput);
    }

    // 3. Check for Study Plan
    if (cleanInput.includes("study plan") || cleanInput.includes("schedule") || cleanInput.includes("how to study") || cleanInput.includes("勉強計画")) {
      return this.handleStudyPlan(cleanInput);
    }

    // 4. Check for JLPT Exam Guides
    if (cleanInput.includes("jlpt") || cleanInput.includes("passing score") || cleanInput.includes("pass mark") || cleanInput.includes("exam points") || cleanInput.includes("exam format") || cleanInput.includes("exam structure") || cleanInput.includes("timing")) {
      return this.handleJLPTGuide(cleanInput);
    }

    // 5. Check for Verb Conjugations
    if (cleanInput.includes("conjugat") || cleanInput.includes("verb group") || cleanInput.includes("te form") || cleanInput.includes("te-form") || cleanInput.includes("masu form") || cleanInput.includes("masu-form") || cleanInput.includes("past tense") || cleanInput.includes("dictionary form") || cleanInput.includes("passive") || cleanInput.includes("causative")) {
      return this.handleVerbConjugation(cleanInput);
    }

    // 6. Particle Comparisons (wa vs ga, ni vs de, node vs kara, to vs ya, ni vs e, de vs de, ga vs wo)
    const particleResponse = this.handleParticleComparisons(cleanInput);
    if (particleResponse) {
      return particleResponse;
    }

    // 7. General grammar pattern explanations
    if (cleanInput.includes("たい") || cleanInput.includes("want to") || cleanInput.includes("want do")) {
      return {
        text: `### Expressing Desire with ～たい (tai) 🌟\n\nTo say you want to do an action, you conjugate a verb to its **たい** form.\n\n#### Grammar Rule:\n* Take the **ます (masu) stem** of the verb and replace ます with **たい**.\n* Group 1: 行きます \u2192 **行きたい** (want to go)\n* Group 2: 食べます \u2192 **食べたい** (want to eat)\n* Group 3: します \u2192 **したい** (want to do), 来ます \u2192 **来たい** (want to come)\n\n#### Particle Change:\nWith たい, the object particle **を** can change to **が** to emphasize the object of desire:\n* 寿司**を**食べたいです。 (I want to eat sushi.)\n* 寿司**が**食べたいです。 (Sushi is what I want to eat! - stronger desire)\n\n#### \u26a0\ufe0f Warning:\nDo **not** use ～たい to express what someone else wants to do (third person). For that, use **～たがる** instead (e.g., 彼は行きたがっている).`
      };
    }

    if (cleanInput.includes("こと") && cleanInput.includes("なる")) {
      return {
        text: `### ～ことになる (Koto ni naru) vs ～ことにする (Koto ni suru) \u2696\ufe0f\n\nThis is a major JLPT N3 grammar point!\n\n#### 1. ～ことにする\n* **Meaning:** "I have decided to do..."\n* Shows **personal decision**, willpower, or choice.\n* **Example:** 毎日運動する**ことにしました**。 (I have decided to exercise every day - my own choice).\n\n#### 2. ～ことになる\n* **Meaning:** "It has been decided that..."\n* Shows a decision made by **external circumstances**, rules, companies, or other people.\n* **Example:** 来年日本へ転勤する**ことになりました**。 (It has been decided that I will transfer to Japan next year - company decided, not my choice).`
      };
    }

    // 8. Sentence breakdown requests
    if (cleanInput.includes("breakdown") || cleanInput.includes("translate") || cleanInput.includes("sentence structure") || cleanInput.includes("grammar breakdown")) {
      return this.handleSentenceBreakdown(userInput);
    }

    // 9. Adaptive Greetings & Help (matches shorthand variations like "hlo", "hlw", "hy")
    const greetings = ["hello", "hi", "hey", "yo", "hlo", "hlw", "hy", "hola", "konnichiwa", "こんにちは"];
    const isGreeting = greetings.some(g => cleanInput === g || cleanInput.startsWith(g + " ") || cleanInput.endsWith(" " + g));
    if (isGreeting || cleanInput.includes("hello kakashi") || cleanInput.includes("hi kakashi") || cleanInput.includes("hlo kakashi") || cleanInput.includes("hy kakashi")) {
      return {
        text: "こんにちは！ (Konnichiwa!) Great to see you! I am **Kakashi**, the famous Copy Ninja of the Leaf, and your personal Japanese tutor. \ud83e\udd77\u2728 I am here to help you master Japanese from N5 to N2 level!\n\nHere is what we can do together:\n* \ud83d\udcd8 **Explain Grammar:** Ask me about any pattern (e.g. `want to`, `たい form`, `ので vs から`).\n* \ud83d\udccd **Compare Particles:** Ask me to compare particles (e.g. `は vs が`, `に vs で`, `と vs や`).\n* \ud83d\udd0d **Analyze Sentences:** Type `breakdown: [Japanese sentence]` to get a detailed grammatical analysis.\n* \ud83d\udcdd **Correct Writing:** Type `correct: [Japanese sentence]` to get my feedback on your composition.\n* \ud83c\udfaf **Interactive Quizzes:** Just type `quiz` or click the chip to test your knowledge!\n* \ud83d\udcc5 **JLPT Guides:** Ask about `JLPT N3 format` or `N5 passing marks` for details.\n\nWhat would you like to practice today? がんばりましょう！ (Let's do our best!)"
      };
    }

    if (cleanInput.includes("thank") || cleanInput.includes("arigatou") || cleanInput.includes("ありがとう") || cleanInput === "thx" || cleanInput === "ty") {
      return {
        text: "どういたしまして！ (You're welcome!) I'm always here to help. Keep up the great work! がんばってください！ \ud83d\udcaa\ud83d\udd25"
      };
    }

    // 10. Direct Local Database Query Search (Saves Gemini quota)
    const directSearchMatch = this.searchLocalScrolls(cleanInput);
    if (directSearchMatch) {
      return directSearchMatch;
    }

    // 11. Live Gemini API Call with Auto-Fallback on Rate-Limit/Offline status
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput })
      });
      if (response.ok) {
        const data = await response.json();
        // Check if backend returned a rate limit exception message inside 200 OK
        if (data.response.includes("Oops! My brain had a little hiccup") || 
            data.response.includes("quota limit") || 
            data.response.includes("API key or quota issue") ||
            data.response.includes("ResourceExhausted") ||
            data.response.includes("Resource exhausted")) {
          return this.runOfflineFallbackSearch(userInput, "Rate Limit Exceeded (15/min)");
        }
        return {
          text: data.response
        };
      } else {
        return this.runOfflineFallbackSearch(userInput, `Server Status ${response.status}`);
      }
    } catch (e) {
      console.error("Failed to fetch from chat backend:", e);
      return this.runOfflineFallbackSearch(userInput, "Network Offline");
    }
  }

  // Broad Fuzzy Search Fallback for Offline / Rate-Limited States
  runOfflineFallbackSearch(userInput, reason) {
    const cleanInput = userInput.replace(/[?!\.,\s]+/g, " ").trim().toLowerCase();
    
    // Attempt local database search
    const localMatch = this.searchLocalScrolls(cleanInput);
    
    const prefix = `\u26a0\ufe0f **Copy Ninja Offline Scrolls activated!**\n*(Reason: ${reason})*\n\nI couldn't reach my live AI brain, but don't worry! I've searched my internal database scrolls for your query. Here is what I found:\n\n`;

    if (localMatch) {
      return {
        text: prefix + localMatch.text
      };
    }

    // If no direct database match, do a fuzzy word matching
    const keywords = cleanInput.split(" ").filter(w => 
      w.length > 2 && 
      !["what", "explain", "meaning", "difference", "between", "tell", "about", "how", "use", "please", "the", "and", "kakashi", "japanese", "grammar"].includes(w)
    );

    if (keywords.length > 0) {
      let foundGrammar = [];
      let foundKanji = [];
      let foundVocab = [];

      if (window.grammarDatabase) {
        foundGrammar = window.grammarDatabase.filter(g => 
          keywords.some(k => g.pattern.toLowerCase().includes(k) || g.explanation.toLowerCase().includes(k))
        ).slice(0, 2);
      }
      if (window.kanjiDatabase) {
        foundKanji = window.kanjiDatabase.filter(k => 
          keywords.some(kw => k.meaning.toLowerCase().includes(kw))
        ).slice(0, 2);
      }
      if (window.vocabDatabase) {
        foundVocab = window.vocabDatabase.filter(v => 
          keywords.some(kw => v.meaning.toLowerCase().includes(kw) || (v.romaji && v.romaji.toLowerCase().includes(kw)))
        ).slice(0, 2);
      }

      if (foundGrammar.length > 0 || foundKanji.length > 0 || foundVocab.length > 0) {
        let text = prefix + `I found these related topics in my offline scrolls:\n\n`;
        
        if (foundGrammar.length > 0) {
          text += `**\ud83d\udcd8 Grammar Patterns:**\n`;
          foundGrammar.forEach(g => {
            text += `* **${g.pattern}** (JLPT ${g.level}): ${g.explanation.substring(0, 80)}...\n`;
          });
          text += `\n`;
        }

        if (foundKanji.length > 0) {
          text += `**\ud83c\udfa8 Kanji:**\n`;
          foundKanji.forEach(k => {
            text += `* **${k.character}** (JLPT ${k.level}): meaning "${k.meaning}" (Onyomi: ${k.onyomi}, Kunyomi: ${k.kunyomi})\n`;
          });
          text += `\n`;
        }

        if (foundVocab.length > 0) {
          text += `**\ud83d\udcca Vocabulary:**\n`;
          foundVocab.forEach(v => {
            text += `* **${v.word}** (${v.kana}) - *${v.meaning}*\n`;
          });
          text += `\n`;
        }

        text += `Type any of these specific patterns or words (e.g. \`${foundGrammar[0]?.pattern || foundVocab[0]?.word || ''}\`) and I will retrieve their full detailed scroll card!`;
        return { text };
      }
    }

    // Ultimate fallback if nothing is found
    return {
      text: `Interesting question! I couldn't find a direct match for "${userInput}" in my active local JLPT database scrolls, and my AI brain is currently offline.\n\nAs your tutor Kakashi, here is how you can use my offline features:\n* Type **\`quiz\`** to test your knowledge with interactive cards.\n* Type **\`correct: [your sentence]\`** to practice writing and get instant corrections.\n* Compare particles by asking: **\`は vs が\`**, **\`に vs で\`**, **\`ので vs から\`**, **\`と vs や\`**, or **\`に vs へ\`**.\n* Look up verb conjugations by typing **\`conjugation\`**.\n* Check JLPT criteria by typing **\`JLPT N3\`** or **\`JLPT N5 exam points\`**.\n\nKeep studying! がんばってください！ \ud83d\udcaa\ud83d\udd25`
    };
  }

  // Local Dictionary and Database Query search engine
  searchLocalScrolls(cleanInput) {
    let searchPhrase = cleanInput
      .replace(/what is the meaning of/g, "")
      .replace(/what is the difference between/g, "")
      .replace(/what is/g, "")
      .replace(/explain/g, "")
      .replace(/tell me about/g, "")
      .replace(/meaning of/g, "")
      .replace(/how to use/g, "")
      .replace(/definition of/g, "")
      .replace(/please/g, "")
      .replace(/kakashi/g, "")
      .replace(/query/g, "")
      .trim();

    if (searchPhrase.length === 0) return null;

    // Detect level-specific grammar listing queries, e.g. "n3 grammar"
    const levelGrammarMatch = searchPhrase.match(/^(n5|n4|n3|n2)\s+grammar$/i);
    if (levelGrammarMatch && window.grammarDatabase) {
      const targetLvl = levelGrammarMatch[1].toUpperCase();
      const levelPatterns = window.grammarDatabase.filter(g => g.level === targetLvl);
      if (levelPatterns.length > 0) {
        // Grab 5 representative patterns
        const samplePatterns = levelPatterns.slice(0, 5);
        let listText = `### \ud83d\udcd8 Popular JLPT ${targetLvl} Grammar Patterns\n\nHere are some essential grammar rules for level **${targetLvl}**:\n\n`;
        samplePatterns.forEach((p, idx) => {
          listText += `${idx + 1}. **${p.pattern}**\n   *Meaning:* ${p.explanation}\n   *Formation:* \`${p.formation}\`\n\n`;
        });
        listText += `*Type the name of any pattern (e.g. \`${samplePatterns[0].pattern}\`) to see a complete explanation with example sentences!*`;
        return { text: listText };
      }
    }

    // A. Grammar Database Search
    if (window.grammarDatabase) {
      const matches = window.grammarDatabase.filter(g => 
        g.pattern.toLowerCase() === searchPhrase || 
        g.pattern.replace(/[～~]/g, "").toLowerCase() === searchPhrase ||
        (g.romaji && g.romaji.toLowerCase() === searchPhrase)
      );

      // Try broader check if no exact pattern match
      const subMatches = matches.length > 0 ? matches : window.grammarDatabase.filter(g => 
        g.pattern.toLowerCase().includes(searchPhrase) || 
        (g.romaji && g.romaji.toLowerCase().includes(searchPhrase)) ||
        (g.explanation && g.explanation.toLowerCase().includes(searchPhrase))
      );

      if (subMatches.length > 0) {
        const best = subMatches[0];
        let examplesText = "";
        if (best.examples && best.examples.length > 0) {
          examplesText = `\n\n**Examples:**\n` + best.examples.slice(0, 2).map(e => `* **<ruby>${e.furigana || e.japanese}</ruby>**\n  *Translation: ${e.translation}*\n  *Breakdown: ${e.breakdown || "N/A"}*`).join("\n");
        }
        
        let otherMatchesNotice = "";
        if (subMatches.length > 1) {
          const others = subMatches.slice(1, 4).map(o => `\`${o.pattern}\``).join(", ");
          otherMatchesNotice = `\n\n*(Other related patterns: ${others})*`;
        }

        return {
          text: `### \ud83d\udcd8 Grammar Pattern: 「${best.pattern}」 (JLPT ${best.level})\n\n**Explanation:**\n${best.explanation}\n\n**Formation:**\n\`${best.formation || "N/A"}\`${examplesText}${otherMatchesNotice}`
        };
      }
    }

    // B. Kanji Database Search
    if (window.kanjiDatabase) {
      const match = window.kanjiDatabase.find(k => 
        k.character === searchPhrase || 
        k.meaning.toLowerCase() === searchPhrase ||
        k.meaning.toLowerCase().split(", ").includes(searchPhrase)
      );

      // Try broader check
      const fuzzyKanjiMatch = match || window.kanjiDatabase.find(k =>
        k.meaning.toLowerCase().includes(searchPhrase)
      );

      if (fuzzyKanjiMatch) {
        let compoundsText = "";
        if (fuzzyKanjiMatch.examples && fuzzyKanjiMatch.examples.length > 0) {
          compoundsText = `\n\n**Example Compounds:**\n` + fuzzyKanjiMatch.examples.map(ex => `* **${ex.word}** (${ex.reading}) - *${ex.meaning}*`).join("\n");
        } else if (fuzzyKanjiMatch.compounds) {
          compoundsText = `\n\n**Example Compounds:**\n${fuzzyKanjiMatch.compounds}`;
        }
        return {
          text: `### \ud83c\udfa8 Kanji Character: 「${fuzzyKanjiMatch.character}」 (JLPT ${fuzzyKanjiMatch.level})\n\n* **Meaning:** ${fuzzyKanjiMatch.meaning}\n* **Onyomi (Chinese reading):** ${fuzzyKanjiMatch.onyomi}\n* **Kunyomi (Japanese reading):** ${fuzzyKanjiMatch.kunyomi}\n* **Strokes:** ${fuzzyKanjiMatch.strokes}\n* **Radicals:** ${fuzzyKanjiMatch.radicals || "N/A"}${compoundsText}`
        };
      }
    }

    // C. Vocabulary Database Search
    if (window.vocabDatabase) {
      const match = window.vocabDatabase.find(v => 
        v.word === searchPhrase || 
        v.kana === searchPhrase || 
        (v.romaji && v.romaji.toLowerCase() === searchPhrase)
      );

      // Try broader check
      const fuzzyVocabMatch = match || window.vocabDatabase.find(v =>
        v.meaning.toLowerCase() === searchPhrase ||
        v.meaning.toLowerCase().split(", ").includes(searchPhrase) ||
        v.meaning.toLowerCase().includes(searchPhrase)
      );

      if (fuzzyVocabMatch) {
        let exampleText = "";
        if (fuzzyVocabMatch.example || fuzzyVocabMatch.exampleFurigana) {
          const jpStr = fuzzyVocabMatch.exampleFurigana ? `<ruby>${fuzzyVocabMatch.exampleFurigana}</ruby>` : fuzzyVocabMatch.example;
          exampleText = `\n\n**Example Sentence:**\n* **${jpStr}**\n  *Translation: ${fuzzyVocabMatch.exampleMeaning || "N/A"}*`;
        }
        return {
          text: `### \ud83d\udcca Vocabulary Word: 「${fuzzyVocabMatch.word}」 (${fuzzyVocabMatch.kana}) [JLPT ${fuzzyVocabMatch.level}]\n\n* **Meaning:** ${fuzzyVocabMatch.meaning}\n* **Romaji:** ${fuzzyVocabMatch.romaji || "N/A"}\n* **Category:** ${fuzzyVocabMatch.category || "N/A"}${exampleText}`
        };
      }
    }

    return null;
  }

  // Particles Comparison Explanations
  handleParticleComparisons(cleanInput) {
    // 1. ので (node) vs から (kara)
    if ((cleanInput.includes("node") || cleanInput.includes("ので")) && (cleanInput.includes("kara") || cleanInput.includes("から")) && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("explain"))) {
      return {
        text: `### Particle ので (Node) vs から (Kara) Explained! \u2696\ufe0f\n\nBoth particles translate to "because" or "so", but they differ in tone and subjectivity:\n\n#### 1. から (Kara) \u2014 Subjective Reason\n* Expresses the speaker's **subjective opinion, feeling, desire, or command**.\n* Used for excuses, suggestions, or imperative sentences (e.g., "Do X because...").\n* Can sound a bit assertive or self-centered because it focuses on *your* reason.\n* **Example:** 寒い**から**、窓を閉めてください。 (Because I'm cold, please close the window - request).\n\n#### 2. ので (Node) \u2014 Objective Reason\n* Expresses an **objective cause-and-effect relationship** (facts, logic, or social conventions).\n* Sounds much more **polite, mild, and natural** when explaining reasons to superiors or making excuses/apologies.\n* Focuses on the objective situation rather than personal will.\n* **Example:** 電車が遅れた**ので**、遅刻しました。 (Because the train was delayed, I was late - objective fact/excuse).\n\n#### Kakashi's Cheat Sheet:\n* **Apologies:** Always use **ので** (e.g., \`遅れたので、すみません\` - Excuse me because I was late).\n* **Commands/Requests:** Use **から** (e.g., \`危ないから、触るな！\` - Don't touch because it's dangerous!).`
      };
    }

    // 2. は (wa) vs が (ga)
    if (cleanInput.includes("は") && cleanInput.includes("が") && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("explain") || cleanInput.includes("wa vs ga"))) {
      return {
        text: `### Particle は (Wa) vs が (Ga) Explained simply! \ud83e\udde0\n\nThis is one of the most common stumbling blocks. Here is Kakashi's breakdown:\n\n#### 1. は (Topic Marker)\n* Marks the **main topic** of the sentence (what we are talking about).\n* Focuses on the **information *after* the は**.\n* Often equivalent to "As for..." or "Speaking of...".\n* **Example:** 私は学生です。 (As for me, I am a student. The focus is that I am a *student*).\n\n#### 2. が (Subject Marker)\n* Marks the **grammatical subject** (who/what performs the action).\n* Focuses on the **subject itself *before* the が**.\n* Used for new information, specific identifiers, or with verbs of existence (いる/ある) and state (好き/上手).\n* **Example:** 私が学生です。 (**I** am the one who is the student. The focus is on *me*).\n\n#### Summary Check:\n* **A:「誰が来ましたか。」** (Who came? - Focus is on WHO, so use **が**)\n* **B:「山田さんが来ました。」** (Yamada-san came. - Answering the who, so use **が**)\n* **A:「山田さんは何をしましたか。」** (As for Yamada-san, what did he do? - Focus is on the action, so use **は**)`
      };
    }

    // 3. に (ni) vs で (de)
    if (cleanInput.includes("に") && cleanInput.includes("で") && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("explain") || cleanInput.includes("ni vs de"))) {
      return {
        text: `### Particle に (Ni) vs で (De) \ud83d\udccd\n\nBoth particles indicate location, but they are used for completely different actions!\n\n#### 1. で (Action Location)\n* Indicates the place where an **active action** takes place.\n* **Key Verbs:** 食べる (eat), 勉強する (study), 買う (buy), 走る (run).\n* **Example:** 図書館**で**勉強します。 (I study **at** the library. Studying is an active process).\n\n#### 2. に (Target/Existence Location)\n* Indicates the location of **existence** or the **destination** of movement.\n* **Key Verbs:** 行く (go), 来る (come), ある/いる (exist/stay), 住む (live).\n* **Example:** 日本**に**行きます。 (I will go **to** Japan).\n* **Example:** 部屋**に**猫がいます。 (There is a cat **in** the room).`
      };
    }

    // 4. と (to) vs や (ya)
    if (cleanInput.includes("と") && cleanInput.includes("や") && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("explain") || cleanInput.includes("to vs ya"))) {
      return {
        text: `### Particle と (To) vs や (Ya) \u2696\ufe0f\n\nBoth particles connect nouns to mean "and", but they have a massive difference in coverage:\n\n#### 1. と (To) \u2014 Exhaustive List\n* Lists **every single item** in a group. There are no other elements.\n* **Meaning:** "A and B (and that is all)."\n* **Example:** りんごとバナナを買いました。 (I bought apples and bananas - only these two things).\n\n#### 2. や (Ya) \u2014 Non-Exhaustive List\n* Lists **examples** of things in a group. Other elements of the same kind exist but are omitted.\n* **Meaning:** "A and B (among other things/such as)."\n* **Example:** りんごやバナナを買いました。 (I bought apples, bananas, and other things of that type).\n\n#### Summary Check:\n* If you are packing a bag and list exactly what's inside, use **と**.\n* If you list some representative items in your bag, use **や** (often followed by \`など\` (etc) at the end of the list).`
      };
    }

    // 5. に (ni) vs へ (e)
    if (cleanInput.includes("に") && cleanInput.includes("へ") && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("explain") || cleanInput.includes("ni vs e") || cleanInput.includes("ni vs he"))) {
      return {
        text: `### Particle に (Ni) vs へ (E) \ud83d\udeeb\n\nBoth particles can mark destinations for movement verbs like 行く (go), 帰る (return), or 来る (come), but their focus differs:\n\n#### 1. に (Ni) \u2014 Focus on the Destination Point\n* Focuses on the **final destination** or target point of arrival.\n* It is concrete and emphasizes arriving at that specific point.\n* **Example:** 東京**に**行きます。 (I will go **to** Tokyo - emphasizes Tokyo as the final arrival destination).\n\n#### 2. へ (E - written as 'he') \u2014 Focus on the Direction\n* Focuses on the **path, direction, or journey** heading towards the destination.\n* It is more abstract and emphasizes the movement towards that direction rather than arrival.\n* **Example:** 東京**へ**行きます。 (I will head **towards** Tokyo - emphasizes the direction of travel).\n\n#### Kakashi's Note:\n* You can almost always replace **へ** with **に** in modern Japanese, but you *cannot* replace all instances of **に** with **へ** (for example, time markers like \`五時に\` or targets of existence like \`部屋に\`).`
      };
    }

    // 6. で (location) vs で (instrument/means)
    if (cleanInput.includes("de") && cleanInput.includes("particle") && (cleanInput.includes("mean") || cleanInput.includes("use") || cleanInput.includes("role") || cleanInput.includes("twice"))) {
      return {
        text: `### The Multiple Roles of Particle で (De) \ud83d\udee0\ufe0f\n\nParticle **で** is one of the most versatile tools in Japanese! Here are its two primary usages:\n\n#### 1. Location of Action\n* Marks the place where an **action is actively performed**.\n* **Example:** カフェ**で**本を読みました。 (I read a book **at** the café).\n\n#### 2. Means / Method / Tool\n* Marks the **instrument, medium, or method** used to perform an action.\n* Translated as: "by", "with", "using", or "in".\n* **Example (Vehicle):** バス**で**学校に行きます。 (I go to school **by** bus).\n* **Example (Tool):** 箸**で**寿司を食べます。 (I eat sushi **with** chopsticks).\n* **Example (Language):** 日本語**で**話してください。 (Please speak **in** Japanese).`
      };
    }

    // 7. が (ga) vs を (wo) in state/desire
    if (cleanInput.includes("が") && cleanInput.includes("を") && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("explain") || cleanInput.includes("ga vs wo") || cleanInput.includes("ga vs o"))) {
      return {
        text: `### Particle が (Ga) vs を (Wo/O) with Ability & Desire \u2696\ufe0f\n\nFor standard action verbs, **を** marks the object and **が** marks the subject. However, when dealing with **desire (~たい)** or **ability (potential form / 上手 / 好き)**, rules shift:\n\n#### 1. With Desire (たい Form)\n* Both are grammatically correct, but they change focus:\n* 水**を**飲みたいです。 (Focus is on the **action** of drinking - natural, casual).\n* 水**が**飲みたいです。 (Focus is on **water** itself as the object of desire - standard, strong).\n\n#### 2. With Ability / Potential Form (～る/～られる)\n* Historically, the potential form is a state, which requires **が**:\n* 日本語**が**話せます。 (I can speak Japanese - standard textbook form).\n* Modern Japanese colloquial speech often uses **を**:\n* 日本語**を**話せます。 (I can speak Japanese - very common in youth language, though frowned upon in strict exams).\n\n#### 3. With Adjectives of State (好き / 嫌い / 欲しい)\n* These are adjectives in Japanese, so you **must** use **が** (never を):\n* 猫**が**好きです。 (I like cats - Correct).\n* 猫**を**好きです。 (Incorrect!).`
      };
    }

    return null;
  }

  // Verb Conjugation Helper Cheat Sheets
  handleVerbConjugation(cleanInput) {
    let responseText = `### \ud83d\udcd8 Japanese Verb Conjugation Guide \ud83d\udee0\ufe0f\n\nJapanese verbs are divided into **three groups**. Knowing which group a verb belongs to is the key to conjugating it correctly!\n\n`;

    if (cleanInput.includes("te") || cleanInput.includes("te-form")) {
      responseText += `#### \ud83d\udcaa The Te-Form (～て) Cheat Sheet\nUsed for linking clauses, making requests (~てください), or describing ongoing actions (~ている).\n\n* **Group 1 (Godan Verbs):** Conjugate based on the final syllable of dictionary form:\n  * **う (u), つ (tsu), る (ru)** \u2192 Replace with **って (tte)**\n    * *会う (to meet)* \u2192 会って\n    * *待つ (to wait)* \u2192 待って\n    * *取る (to take)* \u2192 取って\n  * **む (mu), ぶ (bu), ぬ (nu)** \u2192 Replace with **んで (nde)**\n    * *読む (to read)* \u2192 読んで\n    * *遊ぶ (to play)* \u2192 遊んで\n    * *死ぬ (to die)* \u2192 死んで\n  * **く (ku)** \u2192 Replace with **いて (ite)**\n    * *書く (to write)* \u2192 書いて *(Exception: 行く \u2192 行って)*\n  * **ぐ (gu)** \u2192 Replace with **いで (ide)**\n    * *泳ぐ (to swim)* \u2192 泳いで\n  * **す (su)** \u2192 Replace with **して (shite)**\n    * *話す (to speak)* \u2192 話して\n\n* **Group 2 (Ichidan Verbs - end in iru/eru):**\n  * Drop the final **る (ru)** and add **て (te)**:\n    * *食べる (to eat)* \u2192 食べて\n    * *見る (to see)* \u2192 見て\n\n* **Group 3 (Irregular Verbs):**\n  * *する (to do)* \u2192 **して**\n  * *来る (to come)* \u2192 **来て (kite)**`;
    } else if (cleanInput.includes("masu") || cleanInput.includes("masu-form")) {
      responseText += `#### \ud83d\udcbc The Masu-Form (Polite Form) Cheat Sheet\nUsed for polite daily conversations.\n\n* **Group 1 (Godan Verbs):** Change the final vowel from the **-u** row to the **-i** row, then add **ます**:\n  * *書く (kaku)* \u2192 書**き**ます (kakimasu)\n  * *話す (hanasu)* \u2192 話**し**ます (hanashimasu)\n  * *遊ぶ (asobu)* \u2192 遊**び**ます (asobimasu)\n\n* **Group 2 (Ichidan Verbs):** Drop the final **る** and add **ます**:\n  * *食べる (taberu)* \u2192 食べます (tabemasu)\n  * *見る (miru)* \u2192 見ます (mimasu)\n\n* **Group 3 (Irregular Verbs):**\n  * *する (to do)* \u2192 **します**\n  * *来る (to come)* \u2192 **来ます (kimasu)**`;
    } else {
      // General overview
      responseText += `#### \ud83d\udd11 Identifying Verb Groups:\n* **Group 2 (Ichidan):** Verbs ending in **る** preceded by an **i** or **e** sound (e.g. *taberu*, *miru*, *neru*).\n* **Group 3 (Irregular):** Strictly **する** (to do) and **来る** (to come).\n* **Group 1 (Godan):** All other verbs (including those ending in *u*, *tsu*, *ru* without *i/e* preceding it, like *kau*, *matsu*, *tsukuru*).\n\n*Want to study conjugations? Try asking me:*\n* *"How to conjugate the **te-form**?"*\n* *"Explain the polite **masu-form**!"*`;
    }

    return { text: responseText };
  }

  // JLPT Level Information and Guidelines
  handleJLPTGuide(cleanInput) {
    let level = null;
    if (cleanInput.includes("n5")) level = "N5";
    else if (cleanInput.includes("n4")) level = "N4";
    else if (cleanInput.includes("n3")) level = "N3";
    else if (cleanInput.includes("n2")) level = "N2";

    if (level) {
      const details = {
        "N5": {
          passing: "80 / 180 points",
          sections: "* Language Knowledge (Vocab/Grammar) & Reading: Min **38 / 120** points\n* Listening: Min **19 / 60** points",
          timing: "* Vocabulary: 20 minutes\n* Grammar & Reading: 40 minutes\n* Listening: 30 minutes",
          goals: "* Kanji: ~100 characters\n* Vocabulary: ~800 words\n* Grammar patterns: ~40 basic elements",
          focus: "Focus heavily on Hiragana/Katakana speed, basic particle markers (は, が, を, に, で), and verb conjugations (masu, te, dictionary forms)."
        },
        "N4": {
          passing: "90 / 180 points",
          sections: "* Language Knowledge (Vocab/Grammar) & Reading: Min **38 / 120** points\n* Listening: Min **19 / 60** points",
          timing: "* Vocabulary: 25 minutes\n* Grammar & Reading: 55 minutes\n* Listening: 35 minutes",
          goals: "* Kanji: ~300 characters\n* Vocabulary: ~1,500 words\n* Grammar patterns: ~80 elements",
          focus: "Focus on casual/plain form speech, conditional forms (~tara, ~ba, ~to), relative clauses, and basic listening comprehension."
        },
        "N3": {
          passing: "95 / 180 points",
          sections: "* Language Knowledge (Vocabulary): Min **19 / 60** points\n* Language Knowledge (Grammar) & Reading: Min **19 / 60** points\n* Listening: Min **19 / 60** points",
          timing: "* Vocabulary: 30 minutes\n* Grammar & Reading: 70 minutes\n* Listening: 40 minutes",
          goals: "* Kanji: ~650 characters\n* Vocabulary: ~3,700 words\n* Grammar patterns: ~110 elements",
          focus: "This is the bridge to intermediate. Focus on formal vs informal registers, reading longer paragraphs quickly, and specialized structures (e.g. ことになる, わけがない)."
        },
        "N2": {
          passing: "90 / 180 points",
          sections: "* Language Knowledge (Vocab/Grammar): Min **19 / 60** points\n* Reading: Min **19 / 60** points\n* Listening: Min **19 / 60** points",
          timing: "* Language Knowledge & Reading: 105 minutes (combined)\n* Listening: 50 minutes",
          goals: "* Kanji: ~1,000 characters\n* Vocabulary: ~6,000 words\n* Grammar patterns: ~150 elements",
          focus: "Requires understanding abstract articles, newspaper columns, business terms, and rapid reading comprehension. Listening tracks are fast-paced with multiple speakers."
        }
      }[level];

      return {
        text: `### \ud83c\udfc6 JLPT ${level} Exam Specifications & Passing Metrics\n\nHere are the official requirements to clear the **JLPT ${level}** exam:\n\n* **Total Score:** 180 points maximum\n* **Required Overall Pass Mark:** **${details.passing}**\n* **Sectional Passing Limits (Must pass each section to pass the exam):**\n${details.sections}\n\n* **Test Section Timings:**\n${details.timing}\n\n* **Approximate Study Scope Targets:**\n${details.goals}\n\n* **Kakashi's Study Strategy Advice:**\n> "${details.focus}"\n\n*Ganbatte! You can search details for another level by typing ` + "`JLPT N3`" + ` or similar!*`
      };
    }

    // General guide if no specific level is requested
    return {
      text: `### \ud83c\udfc6 JLPT Exam Structure & Guide (N5 - N2)\n\nThe Japanese Language Proficiency Test (JLPT) consists of 5 levels (N5 being easiest, N1 hardest). This portal covers **N5, N4, N3, and N2**.\n\n#### Passing Criteria Overview:\nTo pass any JLPT level, you must achieve two things:\n1. Meet the **overall passing score**.\n2. Meet the **minimum sectional cutoffs** for each section (if you fail a single section, you fail the entire test, even if your total score is perfect!).\n\n#### Quick Level Pass Marks:\n* **JLPT N5:** 80 / 180 points (Section minimums: 38/120 for Vocab+Grammar+Reading, 19/60 for Listening).\n* **JLPT N4:** 90 / 180 points (Section minimums: 38/120 for Vocab+Grammar+Reading, 19/60 for Listening).\n* **JLPT N3:** 95 / 180 points (Section minimums: 19/60 for Vocab, 19/60 for Grammar+Reading, 19/60 for Listening).\n* **JLPT N2:** 90 / 180 points (Section minimums: 19/60 for Vocab+Grammar, 19/60 for Reading, 19/60 for Listening).\n\n*Ask me about a specific level (e.g. type **\`JLPT N3\`** or **\`JLPT N5 exam format\`**) to see complete details and exam time limits!*`
    };
  }

  // Dynamic Writing Correction
  handleWritingCorrection(userInput) {
    let sentence = "";
    if (userInput.toLowerCase().startsWith("correct this:")) {
      sentence = userInput.substring(13).trim();
    } else if (userInput.toLowerCase().startsWith("correct:")) {
      sentence = userInput.substring(8).trim();
    } else if (userInput.startsWith("添削:")) {
      sentence = userInput.substring(3).trim();
    } else {
      sentence = userInput.replace(/correct my sentence/gi, "").replace(/correct/gi, "").replace(/[:\-\s]+/g, "").trim();
    }

    if (!sentence) {
      return {
        text: "Please provide a sentence for me to correct! Format it like this:\n`correct: 私は日本語が勉強します。`"
      };
    }

    let correction = "";
    let explanation = "";
    let status = "corrected"; // "natural" or "corrected"

    // Simple parser for demonstration
    if (sentence.includes("日本語が勉強します") || sentence.includes("日本語を勉強が好き")) {
      correction = "私は日本語**の**勉強がとても好きです。 (or: 日本語**を勉強するの**が好きです。)";
      explanation = "1. 「勉強します」 is a verb. If you want to say 'like studying', you must nominalize it using **～すること** or **～するの**.\n2. Alternatively, convert the verb into the noun 「勉強」 and use the particle **の** -> 「日本語の勉強」 (study of Japanese).";
    } else if (sentence.includes("日本に行きたい") && sentence.includes("欲しい")) {
      correction = "日本に行きたいです。 (Not 行きたい欲しい)";
      explanation = "To say 'want to go', use the verb stem + **たい**. Do not combine it with **欲しい** (hoshii), which is strictly for wanting physical objects (e.g. 車が欲しい).";
    } else if (sentence.includes("明日、友達に会いました")) {
      correction = "明日、友達に**会います**。 (or 会う予定です)";
      explanation = "「明日」 (tomorrow) indicates the future, but 「会いました」 is past tense. You must use the present/future form 「会います」.";
    } else if (sentence.includes("猫がいます") || sentence.includes("猫があります")) {
      if (sentence.includes("猫があります")) {
        correction = "部屋に猫が**います**。";
        explanation = "Use **います** (iru) for animate objects (people, animals) and **あります** (aru) for inanimate objects (books, buildings, plants).";
      } else {
        status = "natural";
        correction = sentence;
        explanation = "This sentence is perfectly correct! **猫がいます** (there is a cat) correctly uses the existence verb **いる** for animals.";
      }
    } else {
      // Default general correction rule-based feedback
      status = "natural";
      correction = sentence;
      explanation = "This sentence looks grammatically sound! Make sure you are using the correct particles (like は, が, を, に) depending on your verbs. Excellent job! \ud83c\udf1f";
    }

    if (status === "natural") {
      return {
        text: `### \ud83d\udcdd Writing Correction Result\n\n**Your Sentence:** \n> "${sentence}"\n\n**Kakashi's Verdict:** \n> \ud83c\udf89 **Perfect! This is natural Japanese.**\n\n**Explanation:**\n${explanation}\n\n*Keep practicing! You gained **+10 XP** for writing practice!*`,
        xpGained: 10
      };
    } else {
      return {
        text: `### \ud83d\udcdd Writing Correction Result\n\n**Your Sentence:** \n> "${sentence}"\n\n**Kakashi's Correction:** \n> \ud83d\udca1 "${correction}"\n\n**Explanation:**\n${explanation}\n\n*Review the corrections carefully. You gained **+5 XP** for trying!*`,
        xpGained: 5
      };
    }
  }

  // Dynamic Sentence Breakdown
  handleSentenceBreakdown(userInput) {
    let sentence = userInput.replace(/breakdown/gi, "").replace(/translate/gi, "").replace(/sentence structure/gi, "").replace(/[:\-\s]+/g, "").trim();
    if (!sentence) {
      sentence = "日本語を勉強することが好きです。";
    }

    let breakdown = "";
    if (sentence.includes("日本語") && sentence.includes("勉強") && sentence.includes("好き")) {
      breakdown = `
1. **日本語 (にほんご - Nihongo)**: Japanese language [Noun]
2. **を (o)**: Object marker particle
3. **勉強すること (べんきょうすること - benkyou suru koto)**: The act of studying.
   * *勉強する* (to study) + *こと* (nominalizer) turns the verb into a noun phrase.
4. **が (ga)**: Subject marker particle, links to verbs/adjectives of state (like 好き).
5. **好きです (すきです - suki desu)**: To like [Na-adjective + Copula].
\n**Translation:** "I like studying Japanese."`;
    } else if (sentence.includes("日本") && sentence.includes("行きたい")) {
      breakdown = `
1. **日本 (にほん - Nihon)**: Japan [Noun]
2. **に (ni)**: Destination marker particle (to)
3. **行きたい (いきたい - ikitai)**: Want to go.
   * *行く* (to go) conjugated to *たい* form (expresses desire).
4. **です (desu)**: Polite copula (is/am/are).
\n**Translation:** "I want to go to Japan."`;
    } else {
      breakdown = `
1. **${sentence.substring(0, 3)}...**: Let's identify the core blocks:
2. Check the **particles**:
   * **は/が** identifies the topic/subject.
   * **を** highlights the receiver of the action.
   * **に/で** specifies target destinations or action sites.
3. Check the **verb** at the end of the sentence to understand the action.
\nType a common sentence like \`breakdown: 日本に行きたいです\` for a full breakdown!`;
    }

    return {
      text: `### \ud83d\udd0d Sentence Breakdown Analysis\n\nHere is the detailed structural analysis of your sentence:\n\n> "${sentence}"\n${breakdown}`
    };
  }

  // Custom study plans
  handleStudyPlan(input) {
    let level = "N5";
    if (input.includes("n4")) level = "N4";
    else if (input.includes("n3")) level = "N3";
    else if (input.includes("n2")) level = "N2";

    return {
      text: `### \ud83d\udcc5 Recommended Study Plan: JLPT ${level} \ud83c\udfaf\n\nHere is a structured, weekly study plan crafted by Kakashi to help you master JLPT ${level} step-by-step:\n\n#### Weekly Breakdown:\n* **Monday (Kanji & Writing):** Study **5 new Kanji** from our database. Practice writing them on the interactive canvas. Write 3 example sentences.\n* **Tuesday (Vocabulary):** Review **10 new Vocab items** using interactive flashcards. Test yourself in review mode.\n* **Wednesday (Grammar):** Complete **1 Grammar lesson**. Focus on usage, formation, and comparing it with similar patterns.\n* **Thursday (Reading Comprehension):** Read **1 Reading passage**. Try toggling Furigana off on your second read to test kanji recognition.\n* **Friday (Review & Quiz):** Take a mini-test on our **JLPT Practice Test Page**. Identify weak spots.\n* **Weekend (Kakashi Chat & Immersion):** Chat with me! Practice writing sentences by using \`correct: [your sentence]\`. Read manga or listen to podcasts.\n\n*Consistency is key! Daily practice is better than cramming once a week. Set your daily goal to **50 XP** in your dashboard!*`
    };
  }

  // Chat Quiz Generator
  handleQuizRequest() {
    // Generate a random quiz question
    const questions = [
      {
        question: "What is the meaning of the kanji 「日」?",
        options: ["Water", "Day/Sun", "Book", "Car"],
        answerIndex: 1,
        explanation: "日 (nichi/hi) represents day, sun, or Japan."
      },
      {
        question: "Complete the sentence: 「本を＿＿＿＿＿ことができます。」 (I can read books.)",
        options: ["読む", "読みます", "読んで", "読んだ"],
        answerIndex: 0,
        explanation: "Grammar rule: Verb [Dictionary Form] + ことができる. The dictionary form of read is 読む."
      },
      {
        question: "Which particle is used to mark the destination of a movement verb like 行く (to go)?",
        options: ["を", "が", "に", "で"],
        answerIndex: 2,
        explanation: "に (ni) or へ (e) is used to mark direction or destination of movement."
      }
    ];

    const randomIndex = Math.floor(Math.random() * questions.length);
    const quiz = questions[randomIndex];

    // Store the active quiz in Kakashi's context
    this.activeQuiz = quiz;

    // Build buttons HTML inside the message content using custom interactive buttons
    let text = `### \ud83d\udcdd Quick Kakashi Quiz!\n\n**Question:** ${quiz.question}\n\n`;
    quiz.options.forEach((opt, idx) => {
      text += `${idx + 1}. **${opt}**\n`;
    });
    text += `\n*Select your answer by clicking one of the options below!*`;

    return {
      text: text,
      isQuiz: true,
      quizOptions: quiz.options,
      correctIndex: quiz.answerIndex,
      explanation: quiz.explanation
    };
  }

  submitQuizAnswer(idx) {
    if (!this.activeQuiz) {
      return { text: "No active quiz is currently running. Say 'give me a quiz' to start!" };
    }

    const quiz = this.activeQuiz;
    this.activeQuiz = null; // Clear active quiz

    const isCorrect = idx === quiz.answerIndex;
    if (isCorrect) {
      return {
        text: `\ud83c\udf89 **Correct!** Excellent job!\n\n**Explanation:** ${quiz.explanation}\n\n**+15 XP gained!**`,
        xpGained: 15,
        success: true
      };
    } else {
      return {
        text: `\u274c **Incorrect.** The correct answer was **"${quiz.options[quiz.answerIndex]}"**.\n\n**Explanation:** ${quiz.explanation}\n\nDon't worry, keep practicing! **+5 XP** for trying!`,
        xpGained: 5,
        success: false
      };
    }
  }
}

window.KakashiAssistant = KakashiAssistant;
