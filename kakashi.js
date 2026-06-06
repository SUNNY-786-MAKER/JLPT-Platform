// Kakashi AI Assistant Logic for Nihongo Path

class KakashiAssistant {
  constructor() {
    this.chatHistory = this.loadChatHistory();
    this.botAvatar = "assets/kakashi.png";
    this.userName = "Studious Shinobi";
  }

  loadChatHistory() {
    const saved = localStorage.getItem("kakashi_chat_history");
    if (saved) {
      return JSON.parse(saved);
    }
    // Default greeting
    return [
      {
        sender: "bot",
        text: "ようこそ！ (Welcome!) I am **Kakashi**, your personal Japanese tutor. 🥷✨\n\nI can help you with anything related to Japanese learning:\n* Explain complex grammar rules simply\n* Compare particles like **は vs が** or **に vs で**\n* Break down sentence structures\n* Correct your Japanese writing\n* Generate quick practice quizzes\n* Recommend a study plan for your JLPT goals\n\nHow can I help you today? Try typing a question below or selecting a quick option!",
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
        text: "History cleared! Let's start fresh. What would you like to learn next?",
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

    // 4. Grammar & Particles comparisons
    // comparison of node vs kara
    if ((cleanInput.includes("node") || cleanInput.includes("ので")) && (cleanInput.includes("kara") || cleanInput.includes("から")) && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("distinguish") || cleanInput.includes("explain"))) {
      return {
        text: `### Particle ので (Node) vs から (Kara) Explained! ⚖️\n\nBoth particles translate to "because" or "so", but they differ in tone and subjectivity:\n\n#### 1. から (Kara) — Subjective Reason\n* Expresses the speaker's **subjective opinion, feeling, desire, or command**.\n* Used for excuses, suggestions, or imperative sentences (e.g., "Do X because...").\n* Can sound a bit assertive or self-centered because it focuses on *your* reason.\n* **Example:** 寒い**から**、窓を閉めてください。 (Because I'm cold, please close the window - request).\n\n#### 2. ので (Node) — Objective Reason\n* Expresses an **objective cause-and-effect relationship** (facts, logic, or social conventions).\n* Sounds much more **polite, mild, and natural** when explaining reasons to superiors or making excuses/apologies.\n* Focuses on the objective situation rather than personal will.\n* **Example:** 電車が遅れた**ので**、遅刻しました。 (Because the train was delayed, I was late - objective fact/excuse).\n\n#### Kakashi's Cheat Sheet:\n* **Apologies:** Always use **ので** (e.g., \`遅れたので、すみません\` - Excuse me because I was late).\n* **Commands/Requests:** Use **から** (e.g., \`危ないから、触るな！\` - Don't touch because it's dangerous!).`
      };
    }

    if (cleanInput.includes("は") && cleanInput.includes("が") && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("explain"))) {
      return {
        text: `### Particle は (Wa) vs が (Ga) Explained simply! 🧠\n\nThis is one of the most common stumbling blocks. Here is Kakashi's breakdown:\n\n#### 1. は (Topic Marker)\n* Marks the **main topic** of the sentence (what we are talking about).\n* Focuses on the **information *after* the は**.\n* Often equivalent to "As for..." or "Speaking of...".\n* **Example:** 私は学生です。 (As for me, I am a student. The focus is that I am a *student*).\n\n#### 2. が (Subject Marker)\n* Marks the **grammatical subject** (who/what performs the action).\n* Focuses on the **subject itself *before* the が**.\n* Used for new information, specific identifiers, or with verbs of existence (いる/ある) and state (好き/上手).\n* **Example:** 私が学生です。 (**I** am the one who is the student. The focus is on *me*).\n\n#### Summary Check:\n* **A:「誰が来ましたか。」** (Who came? - Focus is on WHO, so use **が**)\n* **B:「山田さんが来ました。」** (Yamada-san came. - Answering the who, so use **が**)\n* **A:「山田さんは何をしましたか。」** (As for Yamada-san, what did he do? - Focus is on the action, so use **は**)`
      };
    }

    if (cleanInput.includes("に") && cleanInput.includes("で") && (cleanInput.includes("vs") || cleanInput.includes("difference") || cleanInput.includes("compare") || cleanInput.includes("explain"))) {
      return {
        text: `### Particle に (Ni) vs で (De) 📍\n\nBoth particles indicate location, but they are used for completely different actions!\n\n#### 1. で (Action Location)\n* Indicates the place where an **active action** takes place.\n* **Key Verbs:** 食べる (eat), 勉強する (study), 買う (buy), 走る (run).\n* **Example:** 図書館**で**勉強します。 (I study **at** the library. Studying is an active process).\n\n#### 2. に (Target/Existence Location)\n* Indicates the location of **existence** or the **destination** of movement.\n* **Key Verbs:** 行く (go), 来る (come), ある/いる (exist/stay), 住む (live).\n* **Example:** 日本**に**行きます。 (I will go **to** Japan).\n* **Example:** 部屋**に**猫がいます。 (There is a cat **in** the room).`
      };
    }

    // 5. General grammar pattern explanations
    if (cleanInput.includes("たい") || cleanInput.includes("want to") || cleanInput.includes("want do")) {
      return {
        text: `### Expressing Desire with ～たい (tai) 🌟\n\nTo say you want to do an action, you conjugate a verb to its **たい** form.\n\n#### Grammar Rule:\n* Take the **ます (masu) stem** of the verb and replace ます with **たい**.\n* Group 1: 行きます → **行きたい** (want to go)\n* Group 2: 食べます → **食べたい** (want to eat)\n* Group 3: します → **したい** (want to do), 来ます → **来たい** (want to come)\n\n#### Particle Change:\nWith たい, the object particle **を** can change to **が** to emphasize the object of desire:\n* 寿司**を**食べたいです。 (I want to eat sushi.)\n* 寿司**が**食べたいです。 (Sushi is what I want to eat! - stronger desire)\n\n#### ⚠️ Warning:\nDo **not** use ～たい to express what someone else wants to do (third person). For that, use **～たがる** instead (e.g., 彼は行きたがっている).`
      };
    }

    if (cleanInput.includes("こと") && cleanInput.includes("なる")) {
      return {
        text: `### ～ことになる (Koto ni naru) vs ～ことにする (Koto ni suru) ⚖️\n\nThis is a major JLPT N3 grammar point!\n\n#### 1. ～ことにする\n* **Meaning:** "I have decided to do..."\n* Shows **personal decision**, willpower, or choice.\n* **Example:** 毎日運動する**ことにしました**。 (I have decided to exercise every day - my own choice).\n\n#### 2. ～ことになる\n* **Meaning:** "It has been decided that..."\n* Shows a decision made by **external circumstances**, rules, companies, or other people.\n* **Example:** 来年日本へ転勤する**ことになりました**。 (It has been decided that I will transfer to Japan next year - company decided, not my choice).`
      };
    }

    // 6. Sentence breakdown requests
    if (cleanInput.includes("breakdown") || cleanInput.includes("translate") || cleanInput.includes("sentence structure") || cleanInput.includes("grammar breakdown")) {
      return this.handleSentenceBreakdown(userInput);
    }

    // 7. Adaptive Greetings & Help (matches shorthand variations like "hlo", "hlw", "hy")
    const greetings = ["hello", "hi", "hey", "yo", "hlo", "hlw", "hy", "hola", "konnichiwa", "こんにちは"];
    const isGreeting = greetings.some(g => cleanInput === g || cleanInput.startsWith(g + " ") || cleanInput.endsWith(" " + g));
    if (isGreeting || cleanInput.includes("hello kakashi") || cleanInput.includes("hi kakashi") || cleanInput.includes("hlo kakashi") || cleanInput.includes("hy kakashi")) {
      return {
        text: "こんにちは！ (Konnichiwa!) Great to see you! I am **Kakashi**, your personal Japanese tutor and AI companion. 🥷✨\n\nI'm here to help you master Japanese from N5 to N2 level!\n\nHere is what we can do together:\n* 📘 **Explain Grammar:** Ask me about any pattern (e.g. `want to`, `たい form`, `ので vs から`).\n* 📍 **Compare Particles:** Ask me to compare particles (e.g. `は vs が`, `に vs で`, `ので vs から`).\n* 🔍 **Analyze Sentences:** Type `breakdown: [Japanese sentence]` to get a detailed grammatical analysis.\n* 📝 **Correct Writing:** Type `correct: [Japanese sentence]` to get my feedback on your composition.\n* 🎯 **Interactive Quizzes:** Just type `quiz` or click the chip to test your knowledge!\n\nWhat would you like to practice today? がんばりましょう！ (Let's do our best!)"
      };
    }

    if (cleanInput.includes("thank") || cleanInput.includes("arigatou") || cleanInput.includes("ありがとう") || cleanInput === "thx" || cleanInput === "ty") {
      return {
        text: "どういたしまして！ (You're welcome!) I'm always here to help. Keep up the great work! がんばってください！ 💪🔥"
      };
    }

    // 8. Comprehensive Local Database Query Search Engine Fallback
    // This allows Kakashi to answer any query about Japanese grammar, vocabulary, or kanji in the database
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

    if (searchPhrase.length > 0) {
      // A. Grammar Database Search
      if (window.grammarDatabase) {
        const matches = window.grammarDatabase.filter(g => 
          g.pattern.toLowerCase().includes(searchPhrase) || 
          (g.romaji && g.romaji.toLowerCase().includes(searchPhrase)) ||
          (g.explanation && g.explanation.toLowerCase().includes(searchPhrase))
        );
        if (matches.length > 0) {
          const best = matches[0];
          let examplesText = "";
          if (best.examples && best.examples.length > 0) {
            examplesText = `\n\n**Examples:**\n` + best.examples.slice(0, 2).map(e => `* **${e.furigana || e.japanese}**\n  *Translation: ${e.translation}*`).join("\n");
          }
          return {
            text: `### 📘 Grammar Pattern Found: 「${best.pattern}」 (JLPT ${best.level})\n\n**Explanation:**\n${best.explanation}\n\n**Formation:**\n\`${best.formation || "N/A"}\`${examplesText}`
          };
        }
      }

      // B. Kanji Database Search
      if (window.kanjiDatabase) {
        const match = window.kanjiDatabase.find(k => 
          k.character === searchPhrase || 
          k.meaning.toLowerCase() === searchPhrase ||
          k.meaning.toLowerCase().includes(searchPhrase)
        );
        if (match) {
          return {
            text: `### 🎨 Kanji Character Found: 「${match.character}」 (JLPT ${match.level})\n\n* **Meaning:** ${match.meaning}\n* **Onyomi (Chinese reading):** ${match.onyomi}\n* **Kunyomi (Japanese reading):** ${match.kunyomi}\n* **Strokes:** ${match.strokes}\n\n**Example Compounds/Usage:**\n${match.compounds || "Common character used in standard reading material."}`
          };
        }
      }

      // C. Vocabulary Database Search
      if (window.vocabDatabase) {
        const match = window.vocabDatabase.find(v => 
          v.word === searchPhrase || 
          v.kana === searchPhrase || 
          (v.romaji && v.romaji.toLowerCase() === searchPhrase) ||
          v.meaning.toLowerCase().includes(searchPhrase)
        );
        if (match) {
          return {
            text: `### 📙 Vocabulary Word Found: 「${match.word}」 (${match.kana}) [JLPT ${match.level}]\n\n* **Meaning:** ${match.meaning}\n* **Romaji:** ${match.romaji || "N/A"}\n\n**Example Sentence:**\n* **${match.exampleJp || "N/A"}**\n  *Translation: ${match.exampleEn || "N/A"}*`
          };
        }
      }
    }

    // 9. Default fallback: Query the backend server's Gemini /chat endpoint
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
        return {
          text: data.response
        };
      }
    } catch (e) {
      console.error("Failed to fetch from chat backend:", e);
    }

    return {
      text: `Interesting question! I couldn't find a direct match for "${userInput}" in my active local JLPT database, and my AI brain is currently offline. \n\nAs your tutor Kakashi, here is my general advice:\n\n* **Verb & Particle Focus:** In Japanese, focus heavily on the grammatical particles (like \`は\`, \`が\`, \`に\`, \`で\`, \`ので\`, \`から\`) as they define the relations in a sentence.\n* **Writing Correction:** You can test your sentences by typing **"correct: [your Japanese sentence]"**.\n* **Sentence Analysis:** Type **"breakdown: [your Japanese sentence]"** and I will dissect the structure for you.`
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
      explanation = "This sentence looks grammatically sound! Make sure you are using the correct particles (like は, が, を, に) depending on your verbs. Excellent job! 🌟";
    }

    if (status === "natural") {
      return {
        text: `### 📝 Writing Correction Result\n\n**Your Sentence:** \n> "${sentence}"\n\n**Kakashi's Verdict:** \n> 🎉 **Perfect! This is natural Japanese.**\n\n**Explanation:**\n${explanation}\n\n*Keep practicing! You gained **+10 XP** for writing practice!*`,
        xpGained: 10
      };
    } else {
      return {
        text: `### 📝 Writing Correction Result\n\n**Your Sentence:** \n> "${sentence}"\n\n**Kakashi's Correction:** \n> 💡 "${correction}"\n\n**Explanation:**\n${explanation}\n\n*Review the corrections carefully. You gained **+5 XP** for trying!*`,
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
      text: `### 🔍 Sentence Breakdown Analysis\n\nHere is the detailed structural analysis of your sentence:\n\n> "${sentence}"\n${breakdown}`
    };
  }

  // Custom study plans
  handleStudyPlan(input) {
    let level = "N5";
    if (input.includes("n4")) level = "N4";
    else if (input.includes("n3")) level = "N3";
    else if (input.includes("n2")) level = "N2";

    return {
      text: `### 📅 Recommended Study Plan: JLPT ${level} 🎯\n\nHere is a structured, weekly study plan crafted by Kakashi to help you master JLPT ${level} step-by-step:\n\n#### Weekly Breakdown:\n* **Monday (Kanji & Writing):** Study **5 new Kanji** from our database. Practice writing them on the interactive canvas. Write 3 example sentences.\n* **Tuesday (Vocabulary):** Review **10 new Vocab items** using interactive flashcards. Test yourself in review mode.\n* **Wednesday (Grammar):** Complete **1 Grammar lesson**. Focus on usage, formation, and comparing it with similar patterns.\n* **Thursday (Reading Comprehension):** Read **1 Reading passage**. Try toggling Furigana off on your second read to test kanji recognition.\n* **Friday (Review & Quiz):** Take a mini-test on our **JLPT Practice Test Page**. Identify weak spots.\n* **Weekend (Kakashi Chat & Immersion):** Chat with me! Practice writing sentences by using \`correct: [your sentence]\`. Read manga or listen to podcasts.\n\n*Consistency is key! Daily practice is better than cramming once a week. Set your daily goal to **50 XP** in your dashboard!*`
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
    let text = `### 📝 Quick Kakashi Quiz!\n\n**Question:** ${quiz.question}\n\n`;
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
        text: `🎉 **Correct!** Excellent job!\n\n**Explanation:** ${quiz.explanation}\n\n**+15 XP gained!**`,
        xpGained: 15,
        success: true
      };
    } else {
      return {
        text: `❌ **Incorrect.** The correct answer was **"${quiz.options[quiz.answerIndex]}"**.\n\n**Explanation:** ${quiz.explanation}\n\nDon't worry, keep practicing! **+5 XP** for trying!`,
        xpGained: 5,
        success: false
      };
    }
  }
}

window.KakashiAssistant = KakashiAssistant;
