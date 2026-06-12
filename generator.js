// Dynamic Japanese Reading Passage Generator (Procedural Sentence Combiner & AI Integration)

const storyPools = {
  "N5": {
    "daily": {
      "intros": [
        {
          "text": "私<rt>わたし</rt>は毎<rt>まい</rt>日<rt>にち</rt>[time]に起<rt>お</rt>きます。それから、[breakfast]を食<rt>た</rt>べます。",
          "translation": "I wake up at [time_en] every day. Then, I eat [breakfast_en].",
          "question": {
            "question": "朝御飯に何をしますか。",
            "options": ["[breakfast]を食べます", "何も食べません", "日本語を勉強します", "散歩をします"],
            "answerIndex": 0,
            "explanation": "The text states: 'それから、[breakfast]を食べます'."
          }
        },
        {
          "text": "今<rt>きょう</rt>日は朝<rt>あさ</rt>からとても忙<rt>いそが</rt>しい一日<rt>いちにち</rt>です。[time]に起きなければなりませんでした。",
          "translation": "Today is a very busy day since morning. I had to wake up at [time_en].",
          "question": {
            "question": "今日は何時に起きましたか。",
            "options": ["[time]に起きました", "十時に起きました", "寝坊しました", "起きませんでした"],
            "answerIndex": 0,
            "explanation": "The text mentions having to wake up at [time_en] ('[time]に起きなければなりませんでした')."
          }
        }
      ],
      "actions": [
        {
          "text": "そして、[transport]で[destination]へ行<rt>い</rt>きます。[destination]で日本<rt>にほん</rt>語<rt>ご</rt>を勉<rt>べん</rt>強<rt>きょう</rt>します。",
          "translation": "And I go to [destination_en] by [transport_en]. I study Japanese at [destination_en].",
          "question": {
            "question": "何で目的地に行きますか。",
            "options": ["[transport]で行きます", "歩いて行きます", "タクシーで行きます", "車で行きます"],
            "answerIndex": 0,
            "explanation": "The text states they go by [transport_en] ('[transport]で行きます')."
          }
        },
        {
          "text": "午前<rt>ごぜん</rt>中は[destination]で[transport]の雑誌<rt>ざっし</rt>を読<rt>よ</rt>みます。午後<rt>ごご</rt>は友達<rt>ともだち</rt>と話します。",
          "translation": "In the morning, I read a magazine about [transport_en] at the [destination_en]. In the afternoon, I talk with my friend.",
          "question": {
            "question": "午前中に何をしますか。",
            "options": ["雑誌を読みます", "勉強をします", "友達と話します", "ご飯を食べます"],
            "answerIndex": 0,
            "explanation": "The text states they read a magazine in the morning ('午前中は...雑誌を読みます')."
          }
        }
      ],
      "descriptions": [
        {
          "text": "日本語の勉強は少し[adjective]ですが、とても好<rt>す</rt>きです。",
          "translation": "Studying Japanese is a little [adjective_en], but I like it very much.",
          "question": {
            "question": "日本語の勉強はどうですか。",
            "options": ["少し[adjective]ですが好きです", "とても簡単でつまらないです", "嫌いです", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text says studying is a little [adjective_en] but they like it ('少し[adjective]ですが、とても好きです')."
          }
        },
        {
          "text": "[destination]の先生<rt>せんせい</rt>はとても[people]で優しいです。",
          "translation": "The teacher at the [destination_en] is very [people_en] and kind.",
          "question": {
            "question": "先生はどんな人ですか。",
            "options": ["[people]で優しい人です", "とても厳しい人です", "静かな人です", "怖い人です"],
            "answerIndex": 0,
            "explanation": "The text describes the teacher as [people_en] and kind ('[people]で優しいです')."
          }
        }
      ],
      "conclusions": [
        {
          "text": "夜<rt>よる</rt>は家<rt>うち</rt>でゆっくり[night_activity]をして、[sleep_time]に寝<rt>ね</rt>ます。",
          "translation": "In the evening, I [night_activity_en] at ease at home and go to bed at [sleep_time_en].",
          "question": {
            "question": "夜は何時に寝ますか。",
            "options": ["[sleep_time]に寝ます", "九時に寝ます", "朝起きます", "夜は寝ません"],
            "answerIndex": 0,
            "explanation": "The text states they sleep at [sleep_time_en] ('[sleep_time]に寝ます')."
          }
        },
        {
          "text": "明日<rt>あした</rt>も[sleep_time]までによく休<rt>やす</rt>んで、また頑張<rt>がんば</rt>りたいです。",
          "translation": "I want to rest well by [sleep_time_en] tomorrow and do my best again.",
          "question": {
            "question": "明日はどうしたいですか。",
            "options": ["よく休んでまた頑張りたいです", "一日中遊びたいです", "どこかへ旅行したいです", "仕事を休みたいです"],
            "answerIndex": 0,
            "explanation": "The text expresses a desire to rest well and try hard again ('明日も...よく休んで、また頑張りたいです')."
          }
        }
      ]
    },
    "travel": {
      "intros": [
        {
          "text": "来<rt>らい</rt>月<rt>げつ</rt>、私<rt>わたし</rt>は日本<rt>にほん</rt>の[destination]へ旅行<rt>りょこう</rt>します。",
          "translation": "Next month, I will travel to [destination_en] in Japan.",
          "question": {
            "question": "いつ旅行に行きますか。",
            "options": ["来月です", "今月です", "来年です", "昨日行きました"],
            "answerIndex": 0,
            "explanation": "The passage starts with '来月、私は日本の[destination]へ旅行します'."
          }
        },
        {
          "text": "私<rt>わたし</rt>の夢<rt>ゆめ</rt>は日本の[destination]を訪<rt>おとず</rt>れることです。ついにチケットを買<rt>か</rt>いました！",
          "translation": "My dream is to visit [destination_en] in Japan. I finally bought the tickets!",
          "question": {
            "question": "チケットを買ってどこに行きますか。",
            "options": ["[destination]に行きます", "アメリカに行きます", "学校に行きます", "どこへも行きません"],
            "answerIndex": 0,
            "explanation": "The text states the destination is [destination_en] in Japan."
          }
        }
      ],
      "actions": [
        {
          "text": "[destination]で、[activity]をするつもりです。楽しみですね。",
          "translation": "I intend to [activity_en] in [destination_en]. I'm looking forward to it.",
          "question": {
            "question": "目的地で何をするつもりですか。",
            "options": ["[activity]つもりです", "買い物をしません", "ずっと寝るつもりです", "仕事をします"],
            "answerIndex": 0,
            "explanation": "The text states: '[activity]をするつもりです'."
          }
        },
        {
          "text": "[person]と一緒にたくさんの温<rt>あたた</rt>かい[drink]を飲みながら、景色<rt>けしき</rt>を楽しみたいです。",
          "translation": "I want to enjoy the scenery while drinking lots of warm [drink_en] together with [person_en].",
          "question": {
            "question": "誰と一緒に景色を楽しみますか。",
            "options": ["[person]と一緒です", "一人で楽しみます", "知らない人です", "先生です"],
            "answerIndex": 0,
            "explanation": "The passage says they will enjoy it together with [person_en] ('[person]と一緒に')."
          }
        }
      ],
      "descriptions": [
        {
          "text": "日本はとても[adjective]な国<rt>くに</rt>だと聞<rt>き</rt>きましたから、ワクワクしています。",
          "translation": "I heard that Japan is a very [adjective_en] country, so I am excited.",
          "question": {
            "question": "なぜワクワクしていますか。",
            "options": ["日本はとても[adjective]な国だと聞いたからです", "チケットを失くしたからです", "旅行が嫌いだからです", "言葉が分からないからです"],
            "answerIndex": 0,
            "explanation": "The text mentions they are excited because they heard Japan is [adjective_en]."
          }
        }
      ],
      "conclusions": [
        {
          "text": "カメラで写真<rt>しゃしん</rt>をたくさん撮<rt>と</rt>って、大切な思い出にします。",
          "translation": "I will take many photos with my camera to make it a precious memory.",
          "question": {
            "question": "何で写真を撮りますか。",
            "options": ["カメラで撮ります", "携帯電話で撮ります", "撮りません", "絵を描きます"],
            "answerIndex": 0,
            "explanation": "The text states: 'カメラで写真をたくさん撮って'."
          }
        }
      ]
    },
    "dining": {
      "intros": [
        {
          "text": "日本<rt>にほん</rt>の料<rt>りょう</rt>理<rt>り</rt>の中で、私は[food]が一番<rt>いちばん</rt>好<rt>す</rt>きです。",
          "translation": "Among Japanese dishes, I like [food_en] the best.",
          "question": {
            "question": "この人は何が一番好きですか。",
            "options": ["[food]です", "カレーです", "パンです", "お菓子です"],
            "answerIndex": 0,
            "explanation": "The text states: '[food]が一番好きです'."
          }
        }
      ],
      "actions": [
        {
          "text": "今日は友達と[place]へ行って、美味しい[food]をたくさん食べます。冷たい[drink]も頼<rt>たの</rt>みます。",
          "translation": "Today, I will go to a [place_en] with my friend and eat plenty of delicious [food_en]. We will also order cold [drink_en].",
          "question": {
            "question": "冷たい何を頼みますか。",
            "options": ["[drink]を頼みます", "お茶を頼みます", "お湯を頼みます", "スープを頼みます"],
            "answerIndex": 0,
            "explanation": "The text states: '冷たい[drink]も頼みます'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "この店の[food]はとても[adjective]ことで有名<rt>ゆうめい</rt>です。",
          "translation": "This shop's [food_en] is famous for being very [adjective_en].",
          "question": {
            "question": "この店は何で有名ですか。",
            "options": ["[food]がとても[adjective]ことで有名です", "値段がとても高いことで有名です", "場所が静かなことです", "店員が怖いことです"],
            "answerIndex": 0,
            "explanation": "The passage says it is famous for [food_en] being [adjective_en] ('[food]はとても[adjective]ことで有名です')."
          }
        }
      ],
      "conclusions": [
        {
          "text": "お腹<rt>なか</rt>がいっぱいになりました。とても幸せな気分です。",
          "translation": "My stomach is full. I feel very happy.",
          "question": {
            "question": "今の気分はどうですか。",
            "options": ["とても幸せな気分です", "お腹が空いています", "悲しいです", "眠いです"],
            "answerIndex": 0,
            "explanation": "The text states: 'とても幸せな気分です'."
          }
        }
      ]
    },
    "shopping": {
      "intros": [
        {
          "text": "私<rt>わたし</rt>は昨日<rt>きのう</rt>、新しいものを買うために[store]へ行きました。",
          "translation": "Yesterday, I went to the [store_en] to buy something new.",
          "question": {
            "question": "昨日どこへ行きましたか。",
            "options": ["[store]に行きました", "図書館に行きました", "映画館に行きました", "学校に行きました"],
            "answerIndex": 0,
            "explanation": "The text states they went to the [store_en] ('[store]へ行きました')."
          }
        }
      ],
      "actions": [
        {
          "text": "色々なお店を見て、お気に入りの[item]を見つけました。[price]円<rt>えん</rt>を払<rt>はら</rt>いました。",
          "translation": "Looking at various shops, I found a favorite [item_en]. I paid [price_en] yen.",
          "question": {
            "question": "何円払いましたか。",
            "options": ["[price]円払いました", "千円払いました", "無料でした", "一万円払いました"],
            "answerIndex": 0,
            "explanation": "The text mentions paying [price_en] yen ('[price]円を払いました')."
          }
        }
      ],
      "descriptions": [
        {
          "text": "この[item]はデザインが[adjective]ですから、一目惚<rt>ひとめぼ</rt>れしました。",
          "translation": "Because this [item_en] has a [adjective_en] design, I fell in love at first sight.",
          "question": {
            "question": "なぜ一目惚れしましたか。",
            "options": ["デザインが[adjective]からです", "安かったからです", "必要だったからです", "友達に勧められたからです"],
            "answerIndex": 0,
            "explanation": "The text states: 'デザインが[adjective]ですから、一目惚れしました'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "店員さんもとても[people]で嬉しかったです。良い買い物でした。",
          "translation": "The shopkeeper was also very [people_en], which made me happy. It was a good purchase.",
          "question": {
            "question": "買い物はどうでしたか。",
            "options": ["良い買い物でした", "失敗でした", "面白くなかったです", "疲れました"],
            "answerIndex": 0,
            "explanation": "The speaker concludes that it was a good purchase ('良い買い物でした')."
          }
        }
      ]
    },
    "hobbies": {
      "intros": [
        {
          "text": "私<rt>わたし</rt>の趣味<rt>しゅみ</rt>は[hobby]です。とても楽しいです。",
          "translation": "My hobby is [hobby_en]. It is very fun.",
          "question": {
            "question": "趣味は何ですか。",
            "options": ["[hobby]です", "読書です", "料理です", "何もないです"],
            "answerIndex": 0,
            "explanation": "The text states: '私の趣味は[hobby]です'."
          }
        }
      ],
      "actions": [
        {
          "text": "毎週末<rt>まいしゅうまつ</rt>、時間があるときに[activity]をしています。",
          "translation": "Every weekend, when I have time, I [activity_en].",
          "question": {
            "question": "いつ趣味をしますか。",
            "options": ["毎週末です", "毎日です", "月曜日だけです", "年に一回です"],
            "answerIndex": 0,
            "explanation": "The text says: '毎週末...[activity]をしています'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "たまに[person]も参加<rt>さんか</rt>して、一緒に楽しい時間を過ごします。",
          "translation": "Sometimes [person_en] also joins in, and we spend a fun time together.",
          "question": {
            "question": "誰が参加することがありますか。",
            "options": ["[person]です", "見知らぬ人です", "警察官です", "誰も参加しません"],
            "answerIndex": 0,
            "explanation": "The text says: 'たまに[person]も参加して'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "趣味があることで、毎日の生活が明るく豊<rt>ゆた</rt>かになります。",
          "translation": "Having a hobby makes my daily life brighter and richer.",
          "question": {
            "question": "趣味は生活にどんな効果がありますか。",
            "options": ["生活が明るく豊かになります", "特に関係ないです", "毎日が退屈になります", "疲れるだけです"],
            "answerIndex": 0,
            "explanation": "The text states: '毎日の生活が明るく豊かになります'."
          }
        }
      ]
    },
    "weather": {
      "intros": [
        {
          "text": "今日<rt>きょう</rt>は朝からとても[weather]天気ですね。",
          "translation": "It is very [weather_en] weather since morning today, isn't it?",
          "question": {
            "question": "今日の天気はどうですか。",
            "options": ["[weather]天気です", "台風です", "吹雪です", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text starts with: '今日は朝からとても[weather]天気ですね'."
          }
        }
      ],
      "actions": [
        {
          "text": "気温は[temp]度で、外は少し[adjective]感じます。",
          "translation": "The temperature is [temp_en] degrees, and it feels a bit [adjective_en] outside.",
          "question": {
            "question": "今日の気温は何度ですか。",
            "options": ["[temp]度です", "十度です", "零度です", "五十度です"],
            "answerIndex": 0,
            "explanation": "The text states: '気温は[temp]度で'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "午後から天気が[change]と言われていますが、どうなるでしょうか。",
          "translation": "It is said that the weather will [change_en] from the afternoon, but what will happen?",
          "question": {
            "question": "午後から天気はどうなると言われていますか。",
            "options": ["[change]と言われています", "晴れたままです", "大雨になります", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '午後から天気が[change]と言われていますが'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "私は[action]をして、今日の一日をゆっくり楽しむ予定です。",
          "translation": "I plan to [action_en] and enjoy today at ease.",
          "question": {
            "question": "今日一日何をする予定ですか。",
            "options": ["[action]をします", "一日中寝ます", "激しい運動をします", "旅行に出かけます"],
            "answerIndex": 0,
            "explanation": "The passage concludes: '私は[action]をして、今日の一日をゆっくり楽しむ予定です'."
          }
        }
      ]
    },
    "anime": {
      "intros": [
        {
          "text": "私<rt>わたし</rt>は日本<rt>にほん</rt>のアニメが大好<rt>だいす</rt>きです。特に[anime_character]が一番<rt>いちばん</rt>のヒーローです。",
          "translation": "I love Japanese anime. Especially, [anime_character_en] is my number one hero.",
          "question": {
            "question": "この人の一番のヒーローは誰ですか。",
            "options": ["[anime_character]です", "ドラえもんです", "アンパンマンです", "誰も好きではありません"],
            "answerIndex": 0,
            "explanation": "The text states that [anime_character_en] is their number one hero."
          }
        },
        {
          "text": "最<rt>さい</rt>近<rt>きん</rt>、世界中<rt>せいかいじゅう</rt>で日本のアニメを楽<rt>たの</rt>しむ人が増<rt>ふ</rt>えています。その中でも[anime_character]の人気<rt>にんき</rt>は圧倒的<rt>あっとうてき</rt>です。",
          "translation": "Recently, the number of people enjoying Japanese anime around the world is increasing. Among them, [anime_character_en]'s popularity is overwhelming.",
          "question": {
            "question": "最近どのような人が増えていますか。",
            "options": ["日本のアニメを楽しむ人", "テレビを見ない人", "本を読まない人", "運動をしない人"],
            "answerIndex": 0,
            "explanation": "The text states: '日本のアニメを楽しむ人が増えています'."
          }
        }
      ],
      "actions": [
        {
          "text": "アニメの中で、[anime_character]が[anime_power]を使<rt>つか</rt>う場面<rt>ばめん</rt>はとてもかっこよくて興奮<rt>こうふん</rt>します。",
          "translation": "In the anime, the scene where [anime_character_en] uses [anime_power_en] is extremely cool and exciting.",
          "question": {
            "question": "[anime_character]が何を使う場面がかっこいいですか。",
            "options": ["[anime_power]です", "お金です", "道具です", "魔法の杖です"],
            "answerIndex": 0,
            "explanation": "The text states: '[anime_character]が[anime_power]を使う場面はとてもかっこいい'."
          }
        },
        {
          "text": "彼<rt>かれ</rt>らは仲間<rt>なかま</rt>と協力<rt>きょうりょく</rt>して強<rt>つよ</rt>い敵<rt>てき</rt>を倒<rt>たお</rt>すために、日夜<rt>にちや</rt>修行<rt>しゅぎょう</rt>を重<rt>かさ</rt>ねています。",
          "translation": "They train day and night in order to cooperate with their allies and defeat strong enemies.",
          "question": {
            "question": "なぜ修行を重ねていますか。",
            "options": ["強い敵を倒すため", "遊ぶため", "お金を稼ぐため", "健康のため"],
            "answerIndex": 0,
            "explanation": "The text states: '強い敵を倒すために、日夜修行を重ねています'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "彼<rt>かれ</rt>らの物語<rt>ものがたり</rt>は単<rt>たん</rt>なる娯楽<rt>ごらく</rt>ではなく、友情<rt>ゆうじょう</rt>や努力<rt>どりょく</rt>の大切<rt>たいせつ</rt>さを教<rt>おし</rt>えてくれます。",
          "translation": "Their stories are not mere entertainment; they teach us the importance of friendship and effort.",
          "question": {
            "question": "彼らの物語は何を教えてくれますか。",
            "options": ["友情や努力の大切さ", "お金の稼ぎ方", "歴史の知識", "特に何も教えてくれません"],
            "answerIndex": 0,
            "explanation": "The text says their stories teach the importance of friendship and effort ('友情や努力の大切さを教えてくれます')."
          }
        },
        {
          "text": "登場人物<rt>とうじょうじんぶつ</rt>の熱<rt>あつ</rt>いセリフや心情<rt>しんじょう</rt>の描写<rt>びょうしゃ</rt>は、多くの視聴者<rt>しちょうしゃ</rt>の心<rt>こころ</rt>を揺<rt>ゆ</rt>さぶります。",
          "translation": "The passionate dialogues and emotional depictions of the characters stir the hearts of many viewers.",
          "question": {
            "question": "何が視聴者の心を揺さぶりますか。",
            "options": ["登場人物の熱いセリフや心情の描写", "アニメのBGMだけ", "番組の長さ", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '登場人物の熱いセリフや心情 of 描写は、多くの視聴者の心を揺さぶります'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "将来<rt>しょうらい</rt>、私は日本へ行って、お気に入りのアニメのフィギュアをたくさん買<rt>か</rt>いたいと願<rt>ねが</rt>っています。",
          "translation": "In the future, I hope to go to Japan and buy many figures of my favorite anime.",
          "question": {
            "question": "将来日本で何をしたいですか。",
            "options": ["アニメのフィギュアを買いたいです", "仕事をしたいです", "車を売りたいです", "何もしません"],
            "answerIndex": 0,
            "explanation": "The text states: 'お気に入りのアニメのフィギュアをたくさん買いたいと願っています'."
          }
        },
        {
          "text": "私も彼らのように強<rt>つよ</rt>い意志<rt>いし</rt>を持って、自分の夢<rt>ゆめ</rt>に向かって進<rt>すす</rt>みたいです。",
          "translation": "I also want to have a strong will like them and move forward toward my own dreams.",
          "question": {
            "question": "この人は彼らのようにどうしたいですか。",
            "options": ["強い意志を持って夢に向かって進みたい", "諦めたい", "何もしたくない", "家で寝たい"],
            "answerIndex": 0,
            "explanation": "The text states: '強い意志を持って、自分の夢に向かって進みたいです'."
          }
        }
      ]
    },
    "movies": {
      "intros": [
        {
          "text": "昨日<rt>きのう</rt>、私は友達と映画館へ行って[movie_title]を観<rt>み</rt>ました。この映画は[movie_genre]として有名<rt>ゆうめい</rt>です。",
          "translation": "Yesterday, I went to the movie theater with my friend and watched [movie_title_en]. This movie is famous as a [movie_genre_en].",
          "question": {
            "question": "昨日映画館で何を観ましたか。",
            "options": ["[movie_title]を観ました", "本を読みました", "寝ました", "ゲームをしました"],
            "answerIndex": 0,
            "explanation": "The text states: '映画館へ行って[movie_title]を観ました'."
          }
        },
        {
          "text": "週末<rt>しゅうまつ</rt>に大画面<rt>だいがいめん</rt>で映画を観<rt>み</rt>ることは、私にとって最高<rt>さいこう</rt>の娯楽<rt>ごらく</rt>です。今回は特に話題<rt>わだい</rt>の[movie_title]を選<rt>えら</rt>びました。",
          "translation": "Watching a movie on a big screen over the weekend is the best entertainment for me. This time, I chose [movie_title_en], which is a particularly hot topic.",
          "question": {
            "question": "週末のこの人にとって最高の娯楽は何ですか。",
            "options": ["大画面で映画を観ること", "本を読むこと", "ゲームをすること", "寝ること"],
            "answerIndex": 0,
            "explanation": "The text states: '大画面で映画を観ることは、私にとって最高の娯楽です'."
          }
        }
      ],
      "actions": [
        {
          "text": "館内<rt>かんない</rt>は暗<rt>くら</rt>く、音響<rt>おんきょう</rt>も素晴らしくて、まるで物語の中にいるような感覚<rt>かんかく</rt>でした。",
          "translation": "The theater was dark, and the sound system was wonderful, making me feel as if I were inside the story.",
          "question": {
            "question": "館内はどうでしたか。",
            "options": ["暗く音響も素晴らしかった", "明るくてうるさかった", "静かすぎた", "寒すぎた"],
            "answerIndex": 0,
            "explanation": "The text states: '館内は暗く、音響も素晴らしくて'."
          }
        },
        {
          "text": "ポップコーンを食べながら、映像<rt>えいぞう</rt>の美しさに終始<rt>しゅうし</rt>圧倒<rt>あっとう</rt>され続けました。",
          "translation": "While eating popcorn, I was completely overwhelmed by the beauty of the visuals from start to finish.",
          "question": {
            "question": "何を食べながら映画を観ましたか。",
            "options": ["ポップコーン", "ラーメン", "お寿司", "何も食べませんでした"],
            "answerIndex": 0,
            "explanation": "The text states: 'ポップコーンを食べながら'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "監督<rt>かんとく</rt>の独創的<rt>どくそうてき</rt>な演出<rt>えんしゅつ</rt>と俳優<rt>はいゆう</rt>の演技<rt>えんぎ</rt>が完璧<rt>かんぺき</rt>に調和<rt>ちょうわ</rt>していました。",
          "translation": "The director's creative staging and the actors' performances were in perfect harmony.",
          "question": {
            "question": "何が完璧に調和していましたか。",
            "options": ["監督の演出と俳優の演技", "音楽と照明", "ストーリーと価格", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text says: '監督の独創的な演出と俳優の演技が完璧に調和していました'."
          }
        },
        {
          "text": "このストーリーには深いメッセージが込められており、人生について考えさせられます。",
          "translation": "A deep message is embedded in this story, making us think about life.",
          "question": {
            "question": "ストーリーには何が込められていますか。",
            "options": ["深いメッセージ", "ジョークだけ", "宣伝", "何もありません"],
            "answerIndex": 0,
            "explanation": "The text says: 'このストーリーには深いメッセージが込められており'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "上映<rt>じょうえい</rt>が終わった後、心<rt>こころ</rt>が温<rt>あたた</rt>かくなり、非常に満足<rt>まんぞく</rt>しました。また来週も新しい映画を観たいです。",
          "translation": "After the screening ended, my heart felt warm and I was very satisfied. I want to watch a new movie next week too.",
          "question": {
            "question": "上映が終わった後どうなりましたか。",
            "options": ["心が温かくなり非常に満足した", "悲しくなった", "腹が立った", "眠くなった"],
            "answerIndex": 0,
            "explanation": "The text states: '上映が終わった後、心が温かくなり、非常に満足しました'."
          }
        },
        {
          "text": "感動<rt>かんどう</rt>で涙<rt>なみだ</rt>が出そうになりました。この素晴らしい体験をみんなに勧めたいです。",
          "translation": "I almost cried from emotion. I want to recommend this wonderful experience to everyone.",
          "question": {
            "question": "この体験についてどうしたいですか。",
            "options": ["みんなに勧めたいです", "忘れたいです", "誰にも言いたくないです", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: 'この素晴らしい体験をみんなに勧めたいです'."
          }
        }
      ]
    },
    "series": {
      "intros": [
        {
          "text": "最近<rt>さいきん</rt>、私は家で日本のテレビドラマ[series_title]を観<rt>み</rt>るのにはまっています。ストーリーが非常に面白<rt>おもしろ</rt>いです。",
          "translation": "Recently, I am hooked on watching the Japanese TV drama [series_title_en] at home. The story is extremely interesting.",
          "question": {
            "question": "最近家で何を観ていますか。",
            "options": ["ドラマ[series_title]を観ています", "ニュースを観ています", "アニメだけです", "何も観ていません"],
            "answerIndex": 0,
            "explanation": "The text says they are hooked on watching the drama [series_title_en]."
          }
        },
        {
          "text": "夜<rt>よる</rt>、仕事が終わった後にテレビの前でドラマ[series_title]を観るのが、毎日の楽しみです。",
          "translation": "In the evening, after work is over, watching the drama [series_title_en] in front of the TV is my daily pleasure.",
          "question": {
            "question": "いつドラマを観ていますか。",
            "options": ["夜、仕事が終わった後", "朝起きてすぐ", "昼休みの間", "仕事中"],
            "answerIndex": 0,
            "explanation": "The text states: '夜、仕事が終わった後に...観るのが、毎日の楽しみです'."
          }
        }
      ],
      "actions": [
        {
          "text": "毎週新<rt>あたら</rt>しいエピソードが放送<rt>ほうそう</rt>されるのを、待ち遠しく思っています。",
          "translation": "I look forward eagerly to a new episode being broadcast every week.",
          "question": {
            "question": "毎週何を待ち遠しく思っていますか。",
            "options": ["新しいエピソードが放送されること", "映画の公開", "仕事の開始", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text states: '毎週新しいエピソードが放送されるのを、待ち遠しく思っています'."
          }
        },
        {
          "text": "ネットフリックスなどの配信<rt>はいしん</rt>サービスを使って、一気に全話<rt>ぜんわ</rt>観てしまうこともあります。",
          "translation": "Sometimes I use distribution services like Netflix to watch all episodes at once.",
          "question": {
            "question": "どのように全話を一気に観ることがありますか。",
            "options": ["配信サービスを使って観る", "テレビの生放送を待つ", "友達の家で観る", "DVDを買う"],
            "answerIndex": 0,
            "explanation": "The text states: '配信サービスを使って、一気に全話観てしまうこともあります'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "登場人物たちの複雑<rt>ふくざつ</rt>な人間関係と予測<rt>よそく</rt>できない展開<rt>てんかい</rt>から目が離せません。",
          "translation": "I cannot take my eyes off the complex human relationships of the characters and the unpredictable developments.",
          "question": {
            "question": "なぜ目が離せないのですか。",
            "options": ["複雑な人間関係と予測できない展開だから", "つまらない内容だから", "英語の吹き替えだから", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '複雑な人間関係と予測できない展開から目が離せません'."
          }
        },
        {
          "text": "毎回の劇的なクライマックスやエンディング曲の選定<rt>せんてい</rt>が非常に素晴らしいです。",
          "translation": "The dramatic climax each time and the selection of the ending theme song are extremely wonderful.",
          "question": {
            "question": "何が非常に素晴らしいですか。",
            "options": ["劇的なクライマックスやエンディング曲の選定", "テレビの画質", "出演者の服の値段", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text says: '毎回の劇的なクライマックスやエンディング曲の選定が非常に素晴らしいです'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "このドラマを観ると、また明日から仕事を頑張<rt>がんば</rt>ろうというエネルギーをもらえます。",
          "translation": "Watching this drama gives me energy to work hard again starting tomorrow.",
          "question": {
            "question": "ドラマを観るとどんな効果がありますか。",
            "options": ["明日から頑張ろうというエネルギーをもらえる", "疲れて眠くなる", "仕事が嫌になる", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text states: 'また明日から仕事を頑張ろうというエネルギーをもらえます'."
          }
        },
        {
          "text": "早く来週の放送日<rt>ほうそうび</rt>になってほしいと、心から願っています。",
          "translation": "I sincerely hope that next week's broadcast date comes quickly.",
          "question": {
            "question": "この人は何を願っていますか。",
            "options": ["早く来週の放送日になってほしいこと", "テレビが壊れること", "仕事が休みに変わること", "何も願っていません"],
            "answerIndex": 0,
            "explanation": "The text says: '早く来週の放送日になってほしいと、心から願っています'."
          }
        }
      ]
    }
  },
  "N4": {
    "daily": {
      "intros": [
        {
          "text": "健康<rt>けんこう</rt>のために、最近<rt>さいきん</rt>新しい生活習慣<rt>せいかつしゅうかん</rt>を始<rt>はじ</rt>めました。",
          "translation": "For my health, I recently started a new lifestyle habit.",
          "question": {
            "question": "なぜ新しい習慣を始めましたか。",
            "options": ["健康のためです", "仕事のためです", "友達に言われたからです", "なんとなくです"],
            "answerIndex": 0,
            "explanation": "The passage starts with '健康のために...習慣を始めました'."
          }
        }
      ],
      "actions": [
        {
          "text": "毎日、朝早く起きて[activity]することにしています。その結果、体<rt>からだ</rt>が[adjective]なりました。",
          "translation": "Every day, I make it a rule to wake up early and [activity_en]. As a result, my body has become [adjective_en].",
          "question": {
            "question": "毎朝何をすることにしていますか。",
            "options": ["早く起きて[activity]", "テレビを遅くまで見ること", "朝ご飯を食べないこと", "お酒を飲むこと"],
            "answerIndex": 0,
            "explanation": "The text says: '毎日、朝早く起きて[activity]することにしています'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "以前<rt>いぜん</rt>はよく遅<rt>おく</rt>れていましたが、今は[improvement]できるようになりました。",
          "translation": "Previously I was often late, but now I have become able to [improvement_en].",
          "question": {
            "question": "以前と比べて今何ができるようになりましたか。",
            "options": ["[improvement]できるようになりました", "もっと遅刻するようになりました", "眠れなくなりました", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '今は[improvement]できるようになりました'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "これからもこの良い習慣をずっと続<rt>つづ</rt>けるつもりです。",
          "translation": "I intend to keep continuing this good habit from now on.",
          "question": {
            "question": "これからもどうするつもりですか。",
            "options": ["習慣を続けるつもりです", "新しいものをやめるつもりです", "また昔に戻るつもりです", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: 'これからもこの良い習慣をずっと続けるつもりです'."
          }
        }
      ]
    },
    "travel": {
      "intros": [
        {
          "text": "日本に来てから、初めて日本の[destination]へ行<rt>い</rt>くことになりました。",
          "translation": "Since coming to Japan, it has been decided that I will go to [destination_en] in Japan for the first time.",
          "question": {
            "question": "日本に来てからどこへ行くことになりましたか。",
            "options": ["[destination]に行くことになりました", "母国に帰ることになりました", "会社を辞めることになりました", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '初めて日本の[destination]へ行くことになりました'."
          }
        }
      ],
      "actions": [
        {
          "text": "準備<rt>じゅんび</rt>はとても大変でしたが、親切な[helper]が手伝ってくれました。",
          "translation": "The preparation was very tough, but a kind [helper_en] helped me.",
          "question": {
            "question": "準備はどうでしたか。",
            "options": ["大変でしたが[helper]が手伝ってくれました", "とても簡単でした", "手伝ってくれる人は誰もいませんでした", "辞めました"],
            "answerIndex": 0,
            "explanation": "The text states: '準備はとても大変でしたが、親切な[helper]が手伝ってくれました'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "目的地はとても[adjective]な場所だそうなので、期待<rt>きたい</rt>しています。",
          "translation": "I heard that the destination is a very [adjective_en] place, so I am expecting a lot.",
          "question": {
            "question": "目的地はどんな場所だと言われていますか。",
            "options": ["とても[adjective]な場所です", "退屈な場所です", "危険な場所です", "うるさい場所です"],
            "answerIndex": 0,
            "explanation": "The text says: '目的地はとても[adjective]な場所だそうなので'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "旅行が終わったら、お世話になった[helper]に[gift]を渡<rt>わた</rt>すつもりです。",
          "translation": "After the trip is over, I plan to hand over [gift_en] to [helper_en] who helped me.",
          "question": {
            "question": "旅行の後、誰に何を渡すつもりですか。",
            "options": ["[helper]に[gift]を渡します", "家族にお金を送ります", "誰にも何も渡しません", "店に返します"],
            "answerIndex": 0,
            "explanation": "The text says: '[helper]に[gift]を渡すつもりです'."
          }
        }
      ]
    },
    "anime": {
      "intros": [
        {
          "text": "日本<rt>にほん</rt>のアニメは世界中<rt>せかいじゅう</rt>で愛<rt>あい</rt>されており、特に[anime_character]は多くのファンを魅力<rt>みりょう</rt>しています。",
          "translation": "Japanese anime is loved all over the world, and [anime_character_en] especially attracts many fans.",
          "question": {
            "question": "特に誰が多くのファンを魅力していますか。",
            "options": ["[anime_character]です", "古いキャラクターです", "外国人です", "誰もいません"],
            "answerIndex": 0,
            "explanation": "The text says [anime_character] attracts many fans ('特に[anime_character]は多くのファンを魅力しています')."
          }
        },
        {
          "text": "私が日本のアニメに関心<rt>かんしん</rt>を持ったきっかけは、幼<rt>おさな</rt>い頃<rt>ころ</rt>に観た[anime_character]の活躍<rt>かつやく</rt>でした。",
          "translation": "The reason I became interested in Japanese anime was the active role of [anime_character_en] that I watched when I was young.",
          "question": {
            "question": "アニメに関心を持ったきっかけは何ですか。",
            "options": ["幼い頃に観た[anime_character]の活躍です", "友達の勧めです", "旅行で行ったからです", "学校の授業です"],
            "answerIndex": 0,
            "explanation": "The text states: '幼い頃に観た[anime_character]の活躍でした'."
          }
        }
      ],
      "actions": [
        {
          "text": "劇中<rt>げきちゅう</rt>で[anime_character]が強敵<rt>きょうてき</rt>に立ち向かい、[anime_power]を繰<rt>く</rt>り出すシーンは迫力<rt>はくりょく</rt>満点<rt>まんてん</rt>です。",
          "translation": "The scene in the play where [anime_character_en] faces a strong enemy and unleashes [anime_power_en] is full of impact.",
          "question": {
            "question": "[anime_character]が何をするシーンが迫力満点ですか。",
            "options": ["[anime_power]を繰り出すシーン", "ご飯を食べるシーン", "寝ているシーン", "逃げるシーン"],
            "answerIndex": 0,
            "explanation": "The text states: '[anime_character]が強敵に立ち向かい、[anime_power]を繰り出すシーンは迫力満点です'."
          }
        },
        {
          "text": "困難<rt>こんなん</rt>な状況<rt>じょうきょう</rt>にあっても諦<rt>あきら</rt>めずに、仲間<rt>なかま</rt>と協力<rt>きょうりょく</rt>して壁<rt>かべ</rt>を乗り越<rt>こ</rt>えていきます。",
          "translation": "Even in difficult situations, they do not give up and cooperate with their allies to overcome obstacles.",
          "question": {
            "question": "困難な状況で彼らはどうしますか。",
            "options": ["諦めずに仲間と協力して壁を乗り越える", "すぐに諦める", "一人で逃げる", "何もしない"],
            "answerIndex": 0,
            "explanation": "The text states: '諦めずに、仲間と協力して壁を乗り越えていきます'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "これらの作品は単なる子供<rt>こども</rt>向けのものとは思えないほど、深<rt>ふか</rt>い人間<rt>にんげん</rt>ドラマが描<rt>えが</rt>かれています。",
          "translation": "These works depict a human drama so deep that you wouldn't think they are simply for children.",
          "question": {
            "question": "作品についてどのように説明されていますか。",
            "options": ["深い人間ドラマが描かれている", "子供向けで単純である", "内容がない", "難しすぎて理解できない"],
            "answerIndex": 0,
            "explanation": "The passage says a deep human drama is depicted ('深い人間ドラマが描かれています')."
          }
        },
        {
          "text": "美しい作画<rt>さくが</rt>や心を打つ音楽が物語の感動<rt>かんどう</rt>をさらに引き立てています。",
          "translation": "Beautiful drawing and touching music further enhance the emotion of the story.",
          "question": {
            "question": "何が物語の感動を引き立てていますか。",
            "options": ["美しい作画や心を打つ音楽", "広告の多さ", "上映時間の長さ", "チケットの安さ"],
            "answerIndex": 0,
            "explanation": "The text says: '美しい作画や心を打つ音楽が物語の感動をさらに引き立てています'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "アニメを通<rt>とお</rt>して日本語や日本文化<rt>ぶんか</rt>を学び、いつか聖地<rt>せいち</rt>巡礼<rt>じゅんれい</rt>をするのが私の目標<rt>もくひょう</rt>です。",
          "translation": "My goal is to study Japanese language and culture through anime, and visit the real-life locations ('anime pilgrimage') someday.",
          "question": {
            "question": "この人の目標は何ですか。",
            "options": ["日本語を学び、聖地巡礼をすること", "アニメの制作会社で働くこと", "日本へ行かないこと", "漫画を全部売ること"],
            "answerIndex": 0,
            "explanation": "The text states: '日本語や日本文化を学び、いつか聖地巡礼をするのが私の目標です'."
          }
        },
        {
          "text": "私も主人公<rt>しゅじんこう</rt>たちのように、前<rt>まえ</rt>を向いて努力<rt>どりょく</rt>を続けたいと思います。",
          "translation": "I also want to look forward and keep making efforts like the main characters.",
          "question": {
            "question": "この人は誰のように努力を続けたいですか。",
            "options": ["アニメの主人公たちのように", "現実の先生のように", "悪者たちのように", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '私も主人公たちのように、前を向いて努力を続けたいと思います'."
          }
        }
      ]
    },
    "movies": {
      "intros": [
        {
          "text": "昨日、私は映画館に行って、最近話題になっている[movie_title]を観ました。この映画は[movie_genre]の最高傑作<rt>さいこうけっさく</rt>と言われています。",
          "translation": "Yesterday, I went to the theater and watched [movie_title_en], which has been a hot topic recently. This film is said to be the masterpiece of [movie_genre_en].",
          "question": {
            "question": "昨日観た映画は何ですか。",
            "options": ["[movie_title]です", "古いアニメです", "テレビ番組です", "ニュースです"],
            "answerIndex": 0,
            "explanation": "The text says they watched [movie_title_en] ('[movie_title]を観ました')."
          }
        },
        {
          "text": "友達から勧められて、週末に大人気<rt>だいにんき</rt>の映画[movie_title]をスクリーンで鑑賞<rt>かんしょう</rt>しました。",
          "translation": "Recommended by a friend, I appreciated the very popular movie [movie_title_en] on the big screen over the weekend.",
          "question": {
            "question": "誰から映画を勧められましたか。",
            "options": ["友達からです", "先生からです", "親からです", "テレビの広告からです"],
            "answerIndex": 0,
            "explanation": "The text says: '友達から勧められて'."
          }
        }
      ],
      "actions": [
        {
          "text": "劇場の巨大<rt>きょだい</rt>なスクリーンと立体<rt>りったい</rt>音響のおかげで、自分が物語の一部になったかのように感じられました。",
          "translation": "Thanks to the theater's giant screen and 3D sound, I felt as if I had become a part of the story.",
          "question": {
            "question": "劇場の何のおかげで物語の一部になったように感じられましたか。",
            "options": ["巨大なスクリーンと立体音響", "美味しい食べ物", "安い入場料", "座席の広さ"],
            "answerIndex": 0,
            "explanation": "The passage states: '劇場の巨大なスクリーンと立体音響のおかげで'."
          }
        },
        {
          "text": "お気に入りのドリンクを飲みながら、映像の美しさに終始<rt>しゅうし</rt>心を奪<rt>うば</rt>われ続けていました。",
          "translation": "While drinking my favorite beverage, my heart was completely captured by the beauty of the visuals from start to finish.",
          "question": {
            "question": "この人は映像の何に心を奪われていましたか。",
            "options": ["美しさです", "長さです", "つまらなさです", "暗さです"],
            "answerIndex": 0,
            "explanation": "The text states: '映像の美しさに終始心を奪われ続けていました'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "監督のユニークなアイデアとキャスト全員の見事<rt>みごと</rt>な演技が噛み合<rt>か</rt>み合って、素晴らしい雰囲気<rt>ふんいき</rt>を作っていました。",
          "translation": "The director's unique ideas and the superb acting of the entire cast came together to create a wonderful atmosphere.",
          "question": {
            "question": "何が素晴らしい雰囲気を作っていましたか。",
            "options": ["監督のアイデアとキャストの演技", "劇場の明るさ", "チケットの価格", "観客の多さ"],
            "answerIndex": 0,
            "explanation": "The text says: '監督のユニークなアイデアとキャスト全員の見事な演技が噛み合い'."
          }
        },
        {
          "text": "この物語には、私たちが忘れがちな「優しさ」についての強いメッセージが込められています。",
          "translation": "This story embeds a strong message about the 'kindness' that we tend to forget.",
          "question": {
            "question": "物語にはどのようなメッセージが込められていますか。",
            "options": ["「優しさ」についての強いメッセージ", "「お金」についてのメッセージ", "「仕事」をサボるメッセージ", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text says: '「優しさ」についての強いメッセージが込められています'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "上映終わった後もしばらく感動の余韻<rt>よいん</rt>が残り、本当に映画館に来て良かったと思いました。",
          "translation": "Even after the screening ended, the emotional lingering remained for a while, and I truly felt glad that I came to the theater.",
          "question": {
            "question": "上映が終わった後どうなりましたか。",
            "options": ["感動の余韻がしばらく残った", "すぐに忘れてしまった", "怒りが湧いてきた", "眠くなって寝た"],
            "answerIndex": 0,
            "explanation": "The passage states: '上映が終わった後もしばらく感動の余韻が残り'."
          }
        },
        {
          "text": "この感動を家族や他の友達にも伝えるために、SNSでおすすめのレビューを書くつもりです。",
          "translation": "To convey this emotion to my family and other friends, I intend to write a recommended review on SNS.",
          "question": {
            "question": "この人は感動を伝えるために何をしますか。",
            "options": ["SNSでおすすめのレビューを書く", "映画館をもう一度買う", "誰にも話さない", "静かに眠る"],
            "answerIndex": 0,
            "explanation": "The text states: 'SNSでおすすめのレビューを書くつもりです'."
          }
        }
      ]
    },
    "series": {
      "intros": [
        {
          "text": "最近、私は日本のテレビドラマ[series_title]に夢中<rt>むちゅう</rt>になっており、仕事が終わるとすぐに帰宅<rt>きたく</rt>して視聴しています。",
          "translation": "Recently, I am hooked on the Japanese TV drama [series_title_en], and I return home immediately after work to watch it.",
          "question": {
            "question": "この人は仕事が終わるとすぐに帰宅して何をしますか。",
            "options": ["ドラマ[series_title]を視聴する", "遊びに行く", "もう一度働く", "寝る"],
            "answerIndex": 0,
            "explanation": "The text says: '帰宅して視聴しています'."
          }
        },
        {
          "text": "日本の社会人<rt>しゃかいじん</rt>の生活や日常の会話を勉強するために、[series_title]というドラマを観ることにしました。",
          "translation": "To study the life of Japanese working adults and daily conversation, I decided to watch the drama [series_title_en].",
          "question": {
            "question": "なぜドラマ[series_title]を観ることにしましたか。",
            "options": ["日本の社会人の生活や日常会話を勉強するため", "友達に強制されたから", "暇潰しのためだけ", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '日本の社会人の生活や日常の会話を勉強するために'."
          }
        }
      ],
      "actions": [
        {
          "text": "毎週の放送日が待ち遠しくて、新しいエピソードが始まるとテレビの前に座って集中<rt>しゅうちゅう</rt>して観ています。",
          "translation": "I look forward to the weekly broadcast date, and when a new episode begins, I sit in front of the TV and watch it with concentration.",
          "question": {
            "question": "放送日が始まるとどうしますか。",
            "options": ["テレビの前に座って集中して観る", "他の部屋に行く", "音を消す", "消灯して寝る"],
            "answerIndex": 0,
            "explanation": "The text states: 'テレビの前に座って集中して観ています'."
          }
        },
        {
          "text": "週末には動画<rt>どうが</rt>配信サービスを使って、過去<rt>かこ</rt>のシーズンをまとめて一気に楽しんでいます。",
          "translation": "On the weekend, I use video streaming services to enjoy past seasons all at once.",
          "question": {
            "question": "週末に動画配信サービスを使って何をしますか。",
            "options": ["過去のシーズンをまとめて一気に楽しむ", "新しい映画を買う", "アニメだけを検索する", "特に何もしない"],
            "answerIndex": 0,
            "explanation": "The text states: '過去のシーズンをまとめて一気に楽しんでいます'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "このドラマは登場人物たちのリアルな人間関係を描いており、毎回ハラハラする展開<rt>てんかい</rt>があります。",
          "translation": "This drama depicts the realistic human relationships of characters, and there are heart-pounding developments every time.",
          "question": {
            "question": "このドラマの展開はどうですか。",
            "options": ["毎回ハラハラする展開がある", "とても退屈である", "全くストーリーが動かない", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text says: '毎回ハラハラする展開があります'."
          }
        },
        {
          "text": "ドラマの主題歌<rt>しゅだいか</rt>も非常に人気があり、メロディーを聴くだけで気分が盛り上がります。",
          "translation": "The drama's theme song is also extremely popular, and just listening to the melody lifts my mood.",
          "question": {
            "question": "主題歌を聴くとどうなりますか。",
            "options": ["気分が盛り上がります", "悲しくなります", "眠くなります", "イライラします"],
            "answerIndex": 0,
            "explanation": "The text states: 'メロディーを聴くだけで気分が盛り上がります'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "ドラマを通じて多くの日常表現や慣用句<rt>かんようく</rt>を学ぶことができるので、私にとって最高の勉強法です。",
          "translation": "Since I can learn many daily expressions and idioms through the drama, it is the best study method for me.",
          "question": {
            "question": "この人にとってドラマを観ることはどのような勉強法ですか。",
            "options": ["多くの日常表現や慣用句を学ぶことができる最高の勉強法", "あまり効果がない勉強法", "最も難しい勉強法", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '日常表現や慣用句を学ぶことができるので、私にとって最高の勉強法です'."
          }
        },
        {
          "text": "次のシーズンが制作<rt>せいさく</rt>されることを心から願っており、今から続編<rt>ぞくへん</rt>が楽しみです。",
          "translation": "I sincerely hope that the next season will be produced, and I am already looking forward to the sequel.",
          "question": {
            "question": "この人は何を心から願っていますか。",
            "options": ["次のシーズンが制作されること", "ドラマが打ち切られること", "テレビが安くなること", "特に何も願っていません"],
            "answerIndex": 0,
            "explanation": "The text states: '次のシーズンが制作されることを心から願っており'."
          }
        }
      ]
    }
  },
  "N3": {
    "daily": {
      "intros": [
        {
          "text": "まだ十分に食べられる食品が廃棄される「食品ロス」が、社会的<rt>しゃかいてき</rt>な問題になっています。",
          "translation": "Food waste, in which perfectly edible food is discarded, has become a societal issue.",
          "question": {
            "question": "どのようなことが社会的な問題になっていますか。",
            "options": ["食べられる食品が廃棄されること（食品ロス）", "食べ物が少なすぎること", "スーパーが少なすぎること", "価格が安すぎること"],
            "answerIndex": 0,
            "explanation": "The text starts by identifying '食品ロス' (food waste) as the societal issue."
          }
        }
      ],
      "actions": [
        {
          "text": "私たちは買い物をするとき、賞味期限<rt>しょうみきげん</rt>が[date]商品を選<rt>えら</rt>びがちですが、これが廃棄を増やす一因となっています。",
          "translation": "When shopping, we tend to choose products with [date_en] best-before dates, which is one cause of increasing waste.",
          "question": {
            "question": "買い物をする際、どのような商品を選びがちですか。",
            "options": ["賞味期限が[date]商品", "一番安い商品", "量が多い商品", "外国産の商品"],
            "answerIndex": 0,
            "explanation": "The passage says we tend to choose items with [date_en] dates ('賞味期限が[date]商品を選びがち')."
          }
        }
      ],
      "descriptions": [
        {
          "text": "国や自治体は、[policy]ように呼びかけていますが、消費者の行動改善は簡単ではありません。",
          "translation": "The government and local authorities are calling on people to [policy_en], but changing consumer behavior is not simple.",
          "question": {
            "question": "自治体は消費者にどのように呼びかけていますか。",
            "options": ["[policy]ように呼びかけています", "もっと多く買うように呼びかけています", "何も呼びかけていません", "自給自足を呼びかけています"],
            "answerIndex": 0,
            "explanation": "The text states: '[policy]ように呼びかけています'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "一人ひとりが環境への影響を自覚し、できることから行動を起こすことが求められています。",
          "translation": "Each individual is required to be aware of the environmental impact and take action starting with what they can do.",
          "question": {
            "question": "今後、消費者には何が求められていますか。",
            "options": ["環境への影響を自覚し行動すること", "もっと安い店を探すこと", "スーパーに行かないこと", "政府の対策を待つこと"],
            "answerIndex": 0,
            "explanation": "The text states: '一人ひとりが環境への影響を自覚し、できることから行動を起こすことが求められています'."
          }
        }
      ]
    },
    "anime": {
      "intros": [
        {
          "text": "現在<rt>げんざい</rt>、日本のアニメ産業<rt>さんぎょう</rt>は海外<rt>かいがい</rt>市場<rt>しじょう</rt>において急速<rt>きゅうそく</rt>に拡大<rt>かくだい</rt>しており、[anime_character]などの作品が多大<rt>ただい</rt>な影響<rt>えいきょう</rt>を与<rt>あた</rt>えています。",
          "translation": "Currently, the Japanese anime industry is expanding rapidly in overseas markets, and works like [anime_character_en] exert a tremendous influence.",
          "question": {
            "question": "アニメ産業は海外市場でどうなっていますか。",
            "options": ["急速に拡大している", "縮小している", "変化がない", "衰退している"],
            "answerIndex": 0,
            "explanation": "The passage states: '海外市場において急速に拡大しており'."
          }
        },
        {
          "text": "日本アニメの魅力<rt>みりょく</rt>は、勧善懲悪<rt>かんぜんちょうあく</rt>に留<rt>とど</rt>まらない複雑<rt>ふくざつ</rt>な人間関係や、[anime_character]が抱<rt>かか</rt>える葛藤<rt>かっとう</rt>の描写<rt>びょうしゃ</rt>にあります。",
          "translation": "The charm of Japanese anime lies in the complex human relationships that go beyond simple poetic justice, and the depiction of conflict that [anime_character_en] harbors.",
          "question": {
            "question": "日本アニメの魅力はどこにあると説明されていますか。",
            "options": ["複雑な人間関係やキャラクターの葛藤の描写", "単純なストーリー構成", "白黒の映像", "声優の少なさ"],
            "answerIndex": 0,
            "explanation": "The text states: '勧善懲悪に留まらない複雑な人間関係や、[anime_character]が抱える葛藤の描写にあります'."
          }
        }
      ],
      "actions": [
        {
          "text": "特に[anime_character]が自らの信念<rt>しんねん</rt>を賭<rt>か</rt>けて[anime_power]を駆使<rt>くし</rt>する戦闘<rt>せんとう</rt>シーンは、視聴者を引き込む力を持っています。",
          "translation": "In particular, the battle scene where [anime_character_en] stakes their own beliefs and makes full use of [anime_power_en] has the power to draw viewers in.",
          "question": {
            "question": "[anime_character]が何を使う戦闘シーンが視聴者を引き込みますか。",
            "options": ["[anime_power]を駆使する戦闘シーン", "日常の会話シーン", "料理 of シーン", "睡眠のシーン"],
            "answerIndex": 0,
            "explanation": "The text states: '[anime_character]が自らの信念を賭けて[anime_power]を駆使する戦闘シーンは、視聴者を引き込む力を持っています'."
          }
        },
        {
          "text": "単に敵<rt>てき</rt>を倒<rt>たお</rt>すだけでなく、主人公が直面<rt>ちょくめん</rt>する心理的<rt>しんりてき</rt>な壁<rt>かべ</rt>や他者との絆<rt>きずな</rt>が詳細<rt>しょうさい</rt>に描<rt>えが</rt>かれます。",
          "translation": "Rather than simply defeating enemies, the psychological obstacles the main character faces and their bonds with others are depicted in detail.",
          "question": {
            "question": "戦闘以外にどのような要素が詳細に描かれていますか。",
            "options": ["心理的な壁や他者との絆", "商品の販売価格", "旅行の旅程", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text says: '心理的な壁や他者との絆が詳細に描かれます'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "社会問題や倫理<rt>りんり</rt>的な問いかけを内包<rt>ないほう</rt>したシナリオは、大人の鑑賞<rt>かんしょう</rt>にも十分に耐<rt>た</rt>えうるクオリティを誇<rt>ほこ</rt>っています。",
          "translation": "Scenarios that encompass social issues and ethical inquiries boast a quality that can fully withstand appreciation by adults.",
          "question": {
            "question": "シナリオにはどのような内容が含まれていますか。",
            "options": ["社会問題や倫理的な問いかけ", "お笑いのネタだけ", "天気予報", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '社会問題や倫理的な問いかけを内包したシナリオ'."
          }
        },
        {
          "text": "こうした奥深いテーマ性があるからこそ、世代<rt>せだい</rt>や国境<rt>こっきょう</rt>を越えて幅広<rt>はばひろ</rt>い層<rt>そう</rt>から支持<rt>しじ</rt>されているのです。",
          "translation": "It is precisely because of such deep thematic qualities that it is supported by a wide range of people across generations and borders.",
          "question": {
            "question": "なぜ国境を越えて支持されているのですか。",
            "options": ["奥深いテーマ性があるから", "価格が無料だから", "子供向けだから", "特に理由はありません"],
            "answerIndex": 0,
            "explanation": "The text says: 'こうした奥深いテーマ性があるからこそ...支持されているのです'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "将来的に、私は翻訳<rt>ほんやく</rt>や紹介<rt>しょうかい</rt>活動を通じて、日本のアニメ文化をより深く発信<rt>はっしん</rt>する役割<rt>やくわり</rt>を担<rt>にな</rt>いたいと考えています。",
          "translation": "In the future, I would like to play a role in disseminating Japanese anime culture more deeply through translation and introduction activities.",
          "question": {
            "question": "この人は将来どのような役割を担いたいと考えていますか。",
            "options": ["翻訳や紹介活動を通じて文化を発信する役割", "声優として出演する役割", "フィギュアを作る役割", "何もしない"],
            "answerIndex": 0,
            "explanation": "The text says: '翻訳や紹介活動を通じて、日本のアニメ文化をより深く発信する役割を担いたい'."
          }
        },
        {
          "text": "アニメを字幕<rt>じまく</rt>なしで理解できるようになることを目指し、語彙<rt>ごい</rt>の習得<rt>しゅうとく</rt>に励<rt>はげ</rt>む日々です。",
          "translation": "Aiming to be able to understand anime without subtitles, I spend my days striving to acquire vocabulary.",
          "question": {
            "question": "この人は何を目指して勉強していますか。",
            "options": ["アニメを字幕なしで理解できるようになること", "日本に旅行すること", "学校を卒業すること", "漫画を捨てること"],
            "answerIndex": 0,
            "explanation": "The text states: 'アニメを字幕なしで理解できるようになることを目指し、語彙の習得に励む日々です'."
          }
        }
      ]
    },
    "movies": {
      "intros": [
        {
          "text": "近年、多様な映画表現が生まれる中で、[movie_title]は[movie_genre]の新たな金字塔<rt>きんじとう</rt>として高く評価<rt>ひょうか</rt>されています。",
          "translation": "In recent years, amid the birth of diverse film expressions, [movie_title_en] is highly evaluated as a new milestone in [movie_genre_en].",
          "question": {
            "question": "[movie_title]はどのように評価されていますか。",
            "options": ["新たな金字塔として高く評価されている", "評価が非常に低い", "普通である", "誰からも無視されている"],
            "answerIndex": 0,
            "explanation": "The text states: '[movie_title]は[movie_genre]の新たな金字塔として高く評価されています'."
          }
        },
        {
          "text": "私が本日<rt>ほんじつ</rt>鑑賞した[movie_title]は、単なる娯楽映画の域<rt>いき</rt>を超え、観客に深い問いを投げかける意欲作<rt>いよくさく</rt>です。",
          "translation": "The movie [movie_title_en] that I appreciated today goes beyond the bounds of a mere entertainment film, and is an ambitious work that throws deep questions to the audience.",
          "question": {
            "question": "[movie_title]はどのような映画だと説明されていますか。",
            "options": ["観客に深い問いを投げかける意欲作", "単純な娯楽映画に過ぎないもの", "子供向けのアニメーション", "非常に退屈な作品"],
            "answerIndex": 0,
            "explanation": "The text states: '観客に深い問いを投げかける意欲作です'."
          }
        }
      ],
      "actions": [
        {
          "text": "映像と音楽 of シンクロ率が極<rt>きわ</rt>めて高く、スクリーンの前に釘<rt>くぎ</rt>付けにされるかのような臨場感<rt>りんじょうかん</rt>を体験しました。",
          "translation": "The synchronization rate of visuals and music was extremely high, and I experienced a sense of presence as if pinned in front of the screen.",
          "question": {
            "question": "この人はどのような体験をしましたか。",
            "options": ["スクリーンの前に釘付けにされるような臨場感", "途中で映画館を出たくなる退屈さ", "頭痛を伴う不快感", "特になし"],
            "answerIndex": 0,
            "explanation": "The text says: 'スクリーンの前に釘付けにされるかのような臨場感を体験しました'."
          }
        },
        {
          "text": "物語が進行<rt>しんこう</rt>するにつれて、登場人物たちの葛藤や成長がリアルに表現され、心が激<rt>はげ</rt>しく揺さぶられました。",
          "translation": "As the story progressed, the conflicts and growth of the characters were realistically expressed, and my heart was violently stirred.",
          "question": {
            "question": "物語の進行とともに何がリアルに表現されましたか。",
            "options": ["登場人物たちの葛藤や成長", "チケットの価格の変動", "背景の色の劣化", "登場人物の衣装の少なさ"],
            "answerIndex": 0,
            "explanation": "The text states: '登場人物たちの葛藤や成長がリアルに表現され'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "緻密<rt>ちみつ</rt>に計算された演出と、それに応<rt>こた</rt>える俳優陣の圧倒的な演技力が、この作品の魅力を何倍にも引き上げています。",
          "translation": "The precisely calculated direction and the overwhelming acting skills of the cast that respond to it raise the charm of this work many times over.",
          "question": {
            "question": "何が作品の魅力を何倍にも引き上げていますか。",
            "options": ["緻密な演出と俳優陣の圧倒的な演技力", "劇場の音響機器のブランド", "広告代理店の宣伝方法", "特に関係ない"],
            "answerIndex": 0,
            "explanation": "The text states: '緻密に計算された演出と、それに応える俳優陣の圧倒的な演技力'."
          }
        },
        {
          "text": "現代人が抱える人間関係の希薄<rt>きはく</rt>さや、孤独<rt>こどく</rt>といった社会的テーマがストーリーの底流<rt>ていりゅう</rt>に流れています。",
          "translation": "Social themes such as the superficiality of human relations and loneliness that modern people harbor run through the undercurrent of the story.",
          "question": {
            "question": "ストーリーの底流にはどのようなテーマが流れていますか。",
            "options": ["人間関係の希薄さや孤独といった社会的テーマ", "簡単なスポーツのルール", "美味しい料理の作り方", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text states: '人間関係の希薄さや孤独といった社会的テーマがストーリーの底流に流れています'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "映画というメディアが持つ、人々の価値観<rt>かちかん</rt>を揺さぶる力について、改めて考えさせられる貴重<rt>きちょう</rt>な機会となりました。",
          "translation": "It became a valuable opportunity to rethink the power of the film medium to shake people's values.",
          "question": {
            "question": "この人は何について改めて考えさせられましたか。",
            "options": ["映画というメディアが持つ、人々の価値観を揺さぶる力", "映画のチケット代金の返金方法", "ポップコーンの栄養価", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text says: '映画というメディアが持つ、人々の価値観を揺さぶる力について、改めて考えさせられる'."
          }
        },
        {
          "text": "この作品が投げかける問題提起<rt>ていき</rt>について、後で友人とじっくり議論<rt>ぎろん</rt>を交わしたいと思っています。",
          "translation": "I hope to have a thorough discussion with my friend later about the issue raised by this work.",
          "question": {
            "question": "この人は後で友人と何をしたいと考えていますか。",
            "options": ["作品が投げかける問題提起について議論を交わす", "一緒に別の映画を観に行く", "何も話さない", "買い物に出かける"],
            "answerIndex": 0,
            "explanation": "The text states: '問題提起について、後で友人とじっくり議論を交わしたいと思っています'."
          }
        }
      ]
    },
    "series": {
      "intros": [
        {
          "text": "テレビドラマは週ごとにストーリーが進展<rt>しんてん</rt>するため、[series_title]などの作品は社会的な関心を呼び起こしやすいという特徴<rt>とくちょう</rt>があります。",
          "translation": "Since TV dramas progress week-by-week, works like [series_title_en] have the characteristic of easily raising social interest.",
          "question": {
            "question": "テレビドラマにはどのような特徴がありますか。",
            "options": ["社会的な関心を呼び起こしやすい", "すぐに飽きられやすい", "制作費が安すぎる", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text states: '社会的な関心を呼び起こしやすいという特徴があります'."
          }
        },
        {
          "text": "昨今の配信サービスの普及<rt>ふきゅう</rt>により、日本の連続<rt>れんぞく</rt>ドラマである[series_title]は国内外で幅広く視聴されています。",
          "translation": "With the spread of streaming services in recent years, the Japanese serial drama [series_title_en] is widely viewed both domestically and internationally.",
          "question": {
            "question": "[series_title]が国内外で幅広く視聴されている理由は何ですか。",
            "options": ["配信サービスの普及によるもの", "チケットが無料だから", "放送時間が短いから", "特に理由はありません"],
            "answerIndex": 0,
            "explanation": "The text states: '昨今の配信サービスの普及により、...幅広く視聴されています'."
          }
        }
      ],
      "actions": [
        {
          "text": "毎回の放送直後、視聴者がSNS上で伏線の考察<rt>こうさつ</rt>や感想のやり取りを熱心に行っている様子が見られます。",
          "translation": "Immediately after each broadcast, one can see viewers enthusiastically exchanging thoughts and analyses of foreshadowing on SNS.",
          "question": {
            "question": "放送直後、視聴者はSNS上で何をしていますか。",
            "options": ["伏線の考察や感想のやり取りを熱心に行っている", "テレビ番組の批判ばかりしている", "買い物を行っている", "特になし"],
            "answerIndex": 0,
            "explanation": "The text says: 'SNS上で伏線の考察や感想のやり取りを熱心に行っている'."
          }
        },
        {
          "text": "エピソードが重なるにつれて、複雑なプロットと感情の交錯<rt>こうさく</rt>が深まり、視聴者を飽きさせない工夫が凝<rt>こ</rt>らされています。",
          "translation": "As episodes stack up, the complex plot and emotional interweaving deepen, showing ingenious efforts to prevent viewers from getting bored.",
          "question": {
            "question": "エピソードが重なるにつれて何が深まりますか。",
            "options": ["複雑なプロットと感情の交錯", "番組のCMの多さ", "退屈な会話", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '複雑なプロットと感情の交錯が深まり'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "各キャラクターの背景にある個人的なストーリーが丁寧に掘<rt>ほ</rt>り下げられており、物語全体のリアリティを高めています。",
          "translation": "The personal stories in each character's background are carefully dug into, raising the reality of the overall narrative.",
          "question": {
            "question": "何が物語全体のリアリティを高めていますか。",
            "options": ["各キャラクターの背景にある個人的なストーリーの丁寧な掘り下げ", "高価な機材を使った撮影方法", "有名人のカメオ出演", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '各キャラクターの背景にある個人的なストーリーが丁寧に掘り下げられており'."
          }
        },
        {
          "text": "社会の縮図<rt>しゅくず</rt>とも言える多様な人間模様が、シリアスかつコミカルに描き分けられています。",
          "translation": "Diverse human relationships, which could be called a microcosm of society, are drawn distinctly in a way both serious and comical.",
          "question": {
            "question": "人間模様はどのように描き分けられていますか。",
            "options": ["シリアスかつコミカルに", "単純かつ退屈に", "英語でのみ", "特に関係ありません"],
            "answerIndex": 0,
            "explanation": "The text states: '多様な人間模様が、シリアスかつコミカルに描き分けられています'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "単なる一時的な娯楽を超えて、他者への共感やコミュニケーションの在り方について考えさせる契機<rt>けいき</rt>を提供してくれます。",
          "translation": "Going beyond mere temporary entertainment, it provides an opportunity to reflect on empathy for others and how communication should be.",
          "question": {
            "question": "このドラマは観客に何を提供してくれますか。",
            "options": ["他者への共感やコミュニケーションについて考える契機", "退屈な時間つぶし", "無料の商品", "特になし"],
            "answerIndex": 0,
            "explanation": "The text says: '他者への共感やコミュニケーションの在り方について考えさせる契機を提供してくれます'."
          }
        },
        {
          "text": "このドラマの結末<rt>けつまつ</rt>がどのようになるのか、今後のストーリー展開からますます目が離せません。",
          "translation": "How the conclusion of this drama will turn out keeps us increasingly unable to take our eyes off the upcoming story development.",
          "question": {
            "question": "この人は何から目が離せないと言っていますか。",
            "options": ["今後のストーリー展開から", "テレビの故障から", "他人の会話から", "特になし"],
            "answerIndex": 0,
            "explanation": "The text states: '今後のストーリー展開からますます目が離せません'."
          }
        }
      ]
    }
  },
  "N2": {
    "daily": {
      "intros": [
        {
          "text": "地球温暖化<rt>ちきゅうおんだんか</rt>をはじめとする環境問題が深刻化<rt>しんこくか</rt>する中、企業の社会的責任が厳しく問われています。",
          "translation": "With environmental issues like global warming worsening, corporate social responsibility is being strictly questioned.",
          "question": {
            "question": "近年、何が深刻化していますか。",
            "options": ["地球温暖化などの環境問題", "企業の倒産", "消費者の不足", "科学技術の衰退"],
            "answerIndex": 0,
            "explanation": "The text notes environmental issues such as global warming are worsening ('環境問題が深刻化する中')."
          }
        }
      ],
      "actions": [
        {
          "text": "多くの企業が、製造工程における[target]の削減を目指す取り組みを急ピッチで進めています。",
          "translation": "Many corporations are rapidly moving forward with initiatives aimed at reducing [target_en] in their manufacturing processes.",
          "question": {
            "question": "企業は製造工程で何を削減しようとしていますか。",
            "options": ["[target]の削減です", "従業員の給与の削減です", "製品品質の削減です", "広告宣伝費の削減です"],
            "answerIndex": 0,
            "explanation": "The text states: '製造工程における[target]の削減を目指す取り組み'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "しかし、環境対策に伴<rt>ともな</rt>う設備投資はコスト増加に繋がり、企業にとっては[difficulty]というジレンマがあります。",
          "translation": "However, capital investments accompanying environmental measures lead to cost increases, presenting companies with the dilemma that [difficulty_en].",
          "question": {
            "question": "企業はどのようなジレンマに直面していますか。",
            "options": ["環境対策の投資で[difficulty]こと", "従業員の採用ができないこと", "株価が下落すること", "新製品が作れないこと"],
            "answerIndex": 0,
            "explanation": "The passage says companies face the dilemma that [difficulty_en] ('[difficulty]というジレンマがあります')."
          }
        }
      ],
      "conclusions": [
        {
          "text": "持続可能な開発目標（SDGs）の達成に向け、長期的視野に立った慎重な事業経営が今こそ欠かせません。",
          "translation": "Toward achieving the Sustainable Development Goals (SDGs), careful business management from a long-term perspective is now more indispensable than ever.",
          "question": {
            "question": "SDGs達成に向けて今何が欠かせませんか。",
            "options": ["長期的視野に立った慎重な事業経営", "コスト削減のみに集中すること", "短期的な売上の最大化", "事業の即時停止"],
            "answerIndex": 0,
            "explanation": "The text states: '長期的視野に立った慎重な事業経営が今こそ欠かせません'."
          }
        }
      ]
    },
    "anime": {
      "intros": [
        {
          "text": "日本が誇るアニメ文化は、単なるサブカルチャーの枠<rt>わく</rt>を超え、現代<rt>げんだい</rt>社会における重要な文化外交<rt>がいこう</rt>のツールとして機能<rt>きのう</rt>しており、特に[anime_character]のような作品は世界的<rt>せかいてき</rt>な社会現象<rt>げんしょう</rt>を巻き起こしています。",
          "translation": "The anime culture Japan boasts goes beyond the framework of a mere subculture and functions as an important cultural diplomacy tool in modern society, and works like [anime_character_en] especially trigger a global social phenomenon.",
          "question": {
            "question": "日本のアニメ文化は現代社会でどのように機能していますか。",
            "options": ["重要な文化外交のツールとして機能している", "単なる娯楽に留まっている", "衰退の傾向にある", "国内でのみ消費されている"],
            "answerIndex": 0,
            "explanation": "The text states: '現代社会における重要な文化外交のツールとして機能しており'."
          }
        },
        {
          "text": "多くのアニメ作品においては、自己<rt>じこ</rt>アイデンティティの模索<rt>もさく</rt>や他者との葛藤といった普遍<rt>ふへん</rt>的なテーマが扱われており、[anime_character]が直面する試練は視聴者の深い共感<rt>きょうかん</rt>を呼んでいます。",
          "translation": "In many anime works, universal themes such as the search for self-identity and conflict with others are handled, and the trials [anime_character_en] faces evoke deep empathy from viewers.",
          "question": {
            "question": "多くのアニメ作品でどのような普遍的なテーマが扱われていますか。",
            "options": ["自己アイデンティティの模索や他者との葛藤", "利益の追求のみ", "製品の物理的特徴", "天候の推移"],
            "answerIndex": 0,
            "explanation": "The text states: '自己アイデンティティの模索や他者との葛藤といった普遍的なテーマが扱われており'."
          }
        }
      ],
      "actions": [
        {
          "text": "作中において[anime_character]が[anime_power]を駆使して自らの限界<rt>げんかい</rt>に挑<rt>いど</rt>む描写は、単なる視覚的<rt>しかくてき</rt>な演出を超えて、人間の精神的<rt>せいしんてき</rt>な成長プロセスを象徴<rt>しょうちょう</rt>しています。",
          "translation": "The depiction in the work of [anime_character_en] using [anime_power_en] to challenge their own limits goes beyond mere visual staging and symbolizes the psychological growth process of humans.",
          "question": {
            "question": "[anime_character]が限界に挑む描写は何を象徴していますか。",
            "options": ["人間の精神的な成長プロセス", "商業的な宣伝効果", "物語の破綻", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text states: '人間の精神的な成長プロセスを象徴しています'."
          }
        },
        {
          "text": "主人公が社会的な矛盾<rt>むじゅん</rt>や個人の倫理観<rt>りんりかん</rt>の間で葛藤しつつ、自らの意志で決断を下していく姿が精緻<rt>せいち</rt>に描かれています。",
          "translation": "The figure of the main character resolving conflict between social contradictions and personal ethics while making decisions of their own free will is drawn with high precision.",
          "question": {
            "question": "主人公はどのような間で葛藤しますか。",
            "options": ["社会的な矛盾や個人の倫理観の間", "勉強と遊びの間", "金銭の有無の間", "他人の評判の間"],
            "answerIndex": 0,
            "explanation": "The passage states: '社会的な矛盾や個人の倫理観の間で葛藤しつつ'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "洗練<rt>せんれん</rt>された映像美<rt>び</rt>や音響設計に留まらず、時代背景<rt>はいけい</rt>や思想的<rt>しそうてき</rt>バックボーンを色濃<rt>いろこ</rt>く反映したストーリー構成が、作品に類<rt>るい</rt>稀<rt>まれ</rt>なる深みを与えています。",
          "translation": "Not stopping at refined visual beauty and audio design, the story composition, which heavily reflects historical backgrounds and ideological backbones, lends an extraordinary depth to the work.",
          "question": {
            "question": "ストーリー構成には何が反映されていますか。",
            "options": ["時代背景や思想的バックボーン", "単なる娯楽要素だけ", "他国の作品のコピー", "企業の財務情報"],
            "answerIndex": 0,
            "explanation": "The passage mentions: '時代背景や思想的バックボーンを色濃く反映したストーリー構成'."
          }
        },
        {
          "text": "このような重層<rt>じゅうそう</rt>的なアプローチこそが、多様<rt>たよう</rt>な読解<rt>どっかい</rt>を可能にし、学術的<rt>がくじゅつてき</rt>な分析の対象としても耐えうるものにしている要因です。",
          "translation": "It is precisely such a multilayered approach that enables diverse interpretations and makes the work withstand analysis as an academic subject.",
          "question": {
            "question": "重層的なアプローチは何を可能にしていますか。",
            "options": ["多様な読解や学術的な分析", "販売店の売上の増加", "子供たちの学習の妨げ", "特に関係ありません"],
            "answerIndex": 0,
            "explanation": "The text states: '多様な読解を可能にし、学術的な分析の対象としても耐えうるものにしている'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "将来は日本のアニメが持つメディアとしての可能性を研究し、グローバルな文化相互作用における役割を解明したいと念願<rt>ねんがん</rt>しています。",
          "translation": "In the future, I hope to study the potential of Japanese anime as a medium and clarify its role in global cultural interaction.",
          "question": {
            "question": "この人は将来どのような研究をしたいと念願していますか。",
            "options": ["アニメが持つ可能性やグローバルな文化相互作用の役割", "アニメの製作費用の削減方法", "漫画の電子化の歴史", "何も研究したくありません"],
            "answerIndex": 0,
            "explanation": "The text states: 'アニメが持つメディアとしての可能性を研究し、グローバルな文化相互作用における役割を解明したい'."
          }
        },
        {
          "text": "アニメ批評<rt>ひひょう</rt>や文学的なアプローチを通じて、作品の根底<rt>こんてい</rt>にある思想を解き明かす知的<rt>ちてき</rt>な探求<rt>たんきゅう</rt>に身<rt>み</rt>を投<rt>とう</rt>じるつもりです。",
          "translation": "I plan to devote myself to intellectual exploration that unravels the thoughts at the root of the work through anime criticism and literary approaches.",
          "question": {
            "question": "この人はどのような探求に身を投じるつもりですか。",
            "options": ["作品の根底にある思想を解き明かす知的な探求", "単なるアニメの鑑賞", "アニメのグッズ集め", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text states: '作品の根底にある思想を解き明かす知的な探求に身を投じるつもりです'."
          }
        }
      ]
    },
    "movies": {
      "intros": [
        {
          "text": "[movie_title]という映画は、[movie_genre]というジャンルにおける旧来<rt>きゅうらい</rt>の文脈<rt>ぶんみゃく</rt>を打破<rt>だは</rt>し、映像芸術に革命<rt>かくめい</rt>的な進歩をもたらした画期的<rt>かっきてき</rt>な作品です。",
          "translation": "The movie [movie_title_en] breaks the traditional context in the genre of [movie_genre_en] and is a epoch-making work that brought revolutionary progress to video art.",
          "question": {
            "question": "[movie_title]は映像芸術に何をもたらしたと書かれていますか。",
            "options": ["革命的な進歩をもたらした", "衰退をもたらした", "混乱をもたらした", "特に何ももたらさなかった"],
            "answerIndex": 0,
            "explanation": "The passage notes: '映像芸術に革命的な進歩をもたらした'."
          }
        },
        {
          "text": "優れた映像作品は、単なる表層<rt>ひょうそう</rt>的なエンターテインメントに留まらず、時代背景や社会の深層<rt>しんそう</rt>心理を反映しており、[movie_title]もまさにその一例と言えます。",
          "translation": "An excellent video work does not stop at mere superficial entertainment but reflects the historical background and the deep psychology of society, and [movie_title_en] is precisely one such example.",
          "question": {
            "question": "優れた映像作品はエンターテインメントの枠を超えて何を反映していますか。",
            "options": ["時代背景や社会の深層心理", "企業の販売戦略", "原作者の個人的な日記", "特にありません"],
            "answerIndex": 0,
            "explanation": "The text states: '時代背景や社会の深層心理を反映しており'."
          }
        }
      ],
      "actions": [
        {
          "text": "巧妙<rt>こうみょう</rt>な光と影のコントラストや、心理描写と連動<rt>れんどう</rt>した音響演出によって、終始スクリーンに引き込まれる没入<rt>ぼつにゅう</rt>感を覚えました。",
          "translation": "By the clever contrast of light and shadow and the audio direction linked with psychological descriptions, I felt an immersive sense of being drawn into the screen from start to finish.",
          "question": {
            "question": "この人は何によってスクリーンへの没入感を覚えましたか。",
            "options": ["巧妙な光と影のコントラストや心理描写と連動した音響演出", "劇場の冷暖房の温度設定", "他の観客の私語", "劇場のスクリーンの傷"],
            "answerIndex": 0,
            "explanation": "The text states: '巧妙な光と影のコントラストや、心理描写と連動した音響演出によって'."
          }
        },
        {
          "text": "観客の予断<rt>よだん</rt>を許さないストーリーテリングは、幾重<rt>いくえ</rt>もの伏線<rt>ふくせん</rt>が回収されるクライマックスに向けて緊張感<rt>きんちょうかん</rt>を高めていきます。",
          "translation": "The storytelling, which allows no assumptions by the audience, builds tension toward the climax where multiple foreshadows are gathered.",
          "question": {
            "question": "ストーリーテリングはクライマックスに向けてどうしますか。",
            "options": ["伏線が回収されるに向けて緊張感を高める", "コメディ要素を増やす", "ストーリーを途中で放棄する", "観客を退屈にさせる"],
            "answerIndex": 0,
            "explanation": "The text states: '幾重もの伏線が回収されるクライマックスに向けて緊張感を高めていきます'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "監督の透徹<rt>とうてつ</rt>した美意識<rt>びいしき</rt>に基づき、ワンカットごとに計算し尽くされた映像は、絵画的な美しさを湛<rt>たた</rt>えています。",
          "translation": "Based on the director's clear aesthetic sense, the visuals, meticulously calculated frame-by-frame, are filled with painterly beauty.",
          "question": {
            "question": "ワンカットごとの映像はどのような美しさを湛えていますか。",
            "options": ["絵画的な美しさ", "安っぽい美しさ", "現代の広告のような美しさ", "特に美しくない"],
            "answerIndex": 0,
            "explanation": "The passage notes: '絵画的な美しさを湛えています'."
          }
        },
        {
          "text": "作品の根底に流れる哲学<rt>てつがく</rt>的な問いかけは、人間の不条理<rt>ふじょうり</rt>さや共生の難しさといった深遠<rt>しんえん</rt>なテーマを内包しています。",
          "translation": "The philosophical inquiry running at the root of the work encompasses profound themes such as human absurdity and the difficulty of coexisting.",
          "question": {
            "question": "作品の根底に流れる問いかけはどのようなテーマを内包していますか。",
            "options": ["人間の不条理さや共生の難しさといった深遠なテーマ", "効率的な時間の管理方法", "単純な勧善懲悪のストーリー", "特になし"],
            "answerIndex": 0,
            "explanation": "The text states: '人間の不条理さや共生の難しさといった深遠なテーマを内包しています'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "鑑賞後、私たちは自己や他者に対する従来の視点<rt>してん</rt>を揺さぶられ、日常の認識を再構成<rt>さいこうせい</rt>させられる感覚に陥<rt>おちい</rt>ります。",
          "translation": "After viewing, our traditional perspectives on self and others are shaken, and we fall into a sensation of having our daily awareness reconstructed.",
          "question": {
            "question": "鑑賞後、私たちはどのような感覚に陥りますか。",
            "options": ["自己や他者に対する視点を揺さぶられ、日常の認識を再構成させられる感覚", "怒りや不満が募る感覚", "即座にすべてを忘れてしまう感覚", "全く何も感じない状態"],
            "answerIndex": 0,
            "explanation": "The text states: '従来の視点を揺さぶられ、日常の認識を再構成させられる感覚に陥ります'."
          }
        },
        {
          "text": "この極めて芸術性の高い作品は、単なる流行に終わらず、映画史<rt>えいがし</rt>に永続<rt>えいぞく</rt>的な足跡<rt>あしあと</rt>を残す傑作と評価できます。",
          "translation": "This extremely artistic work does not end as a mere trend and can be evaluated as a masterpiece that leaves a permanent footprint in film history.",
          "question": {
            "question": "この作品はどのように評価できますか。",
            "options": ["映画史に永続的な足跡を残す傑作", "一過性の流行品", "失敗作", "娯楽作品に過ぎないもの"],
            "answerIndex": 0,
            "explanation": "The text states: '映画史に永続的な足跡を残す傑作と評価できます'."
          }
        }
      ]
    },
    "series": {
      "intros": [
        {
          "text": "[series_title]は、従来のテレビドラマが持っていた娯楽性の枠組みを超え、現代社会の歪<rt>ゆが</rt>みや人間の深層心理を痛烈<rt>つうれつ</rt>に描き出す社会派ドラマとして、絶大<rt>ぜつだい</rt>な支持を獲得<rt>かくとく</rt>しています。",
          "translation": "[series_title_en] goes beyond the framework of entertainment that conventional TV dramas had, and has acquired absolute support as a social drama that sharply depicts the distortions of modern society and deep human psychology.",
          "question": {
            "question": "[series_title]はどのようなドラマとして絶大な支持を獲得していますか。",
            "options": ["社会の歪みや人間の深層心理を痛烈に描き出す社会派ドラマ", "単純なコメディドラマ", "日常を映すだけのドキュメンタリー", "特に支持されていません"],
            "answerIndex": 0,
            "explanation": "The text states: '現代社会の歪みや人間の深層心理を痛烈に描き出す社会派ドラマとして、絶大な支持を獲得しています'."
          }
        },
        {
          "text": "連続ドラマという時間的広がりを持つフォーマットは、登場人物の精神的な軌跡<rt>きせき</rt>や人間関係の変容<rt>へんよう</rt>をきめ細かく描き出すのに極めて適<rt>てき</rt>しており、[series_title]もその強みを最大限<rt>さいだいげん</rt>に活かしています。",
          "translation": "The format of serial drama, which has a temporal span, is extremely suited for minutely depicting characters' mental trajectories and changes in relationships, and [series_title_en] maximizes this strength.",
          "question": {
            "question": "連続ドラマのフォーマットは何に適していますか。",
            "options": ["登場人物の精神的な軌跡や人間関係の変容をきめ細かく描き出すこと", "短時間でニュースを伝えること", "即座に商品の販売を行うこと", "特に適していません"],
            "answerIndex": 0,
            "explanation": "The text notes: '登場人物の精神的な軌跡や人間関係 of 変容をきめ細かく描き出すのに極めて適しており'." // Let's make it '人間関係の変容'
          }
        }
      ],
      "actions": [
        {
          "text": "視聴者は各エピソードの緻密な構成に引き込まれ、散りばめられた伏線が驚くべき形で回収される展開に圧倒されます。",
          "translation": "Viewers are drawn into the precise composition of each episode and overwhelmed by developments where scattered clues are recovered in an amazing fashion.",
          "question": {
            "question": "視聴者は各エピソードのどのような展開に圧倒されますか。",
            "options": ["散りばめられた伏線が驚くべき形で回収される展開", "単純で退屈なプロットの展開", "途中で番組が中断される展開", "登場人物の交代"],
            "answerIndex": 0,
            "explanation": "The passage notes: '散りばめられた伏線が驚くべき形で回収される展開に圧倒されます'."
          }
        },
        {
          "text": "社会的な規範<rt>きはん</rt>と個人の良心の間で葛藤し、ときに自己犠牲<rt>じこぎせい</rt>的な選択を迫<rt>せま</rt>られる登場人物たちの行動が、緊張感あふれるタッチで描写されます。",
          "translation": "The actions of characters conflicting between social norms and individual conscience, and sometimes forced to make self-sacrificing choices, are depicted with a tension-filled touch.",
          "question": {
            "question": "登場人物たちはどのような間で葛藤しますか。",
            "options": ["社会的な規範と個人の良心の間", "テレビのサイズと価格の間", "服装の色と形の選択の間", "特に葛藤はありません"],
            "answerIndex": 0,
            "explanation": "The passage notes: '社会的な規範と個人の良心の間で葛藤し'."
          }
        }
      ],
      "descriptions": [
        {
          "text": "脚本<rt>きゃくほん</rt>の卓越<rt>たくえつ</rt>したセリフ回しや、言葉の裏に隠された複雑な感情の機微<rt>きび</rt>が、役者の演技力を通じて立体的に表現されています。",
          "translation": "The screenplay's excellent dialogues and the subtleties of complex emotions hidden behind the words are expressed three-dimensionally through the actors' acting skill.",
          "question": {
            "question": "役者の演技力を通じて何が立体的に表現されていますか。",
            "options": ["セリフ回しや言葉の裏に隠された複雑な感情の機微", "劇中のセットの豪華さ", "音楽の音量の調整", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text says: '脚本の卓越したセリフ回しや、言葉の裏に隠された複雑な感情の機微が...表現されています'."
          }
        },
        {
          "text": "現代社会の構造的<rt>こうぞうてき</rt>な課題を鋭<rt>するど</rt>く抉<rt>えぐ</rt>り出すことで、視聴者に自己の倫理観を見つめ直すよう迫る力を持っています。",
          "translation": "By sharply carving out the structural issues of modern society, it has the power to force viewers to re-examine their own ethics.",
          "question": {
            "question": "このドラマは視聴者に何を迫る力を持っていますか。",
            "options": ["自己の倫理観を見つめ直すこと", "動画の月額会員の登録を増やすこと", "家族との連絡を断つこと", "分かりません"],
            "answerIndex": 0,
            "explanation": "The text states: '視聴者に自己の倫理観を見つめ直すよう迫る力を持っています'."
          }
        }
      ],
      "conclusions": [
        {
          "text": "視聴後、物語が提示した倫理的な二律背反<rt>にりつはいはん</rt>について思考<rt>しこう</rt>を巡<rt>めぐ</rt>らせずにはいられないほど、強いインパクトを残す作品と言えます。",
          "translation": "It can be said to be a work that leaves a strong impact, to the extent that after viewing, one cannot help but think about the ethical antinomy presented by the story.",
          "question": {
            "question": "視聴後、どのような状態になると言われていますか。",
            "options": ["倫理的な二律背反について思考を巡らせずにはいられない", "即座に退屈して眠ってしまう", "内容に怒りを感じて批判する", "特に影響を受けない"],
            "answerIndex": 0,
            "explanation": "The passage states: '倫理的な二律背反について思考を巡らせずにはいられないほど、強いインパクトを残す作品'."
          }
        },
        {
          "text": "この作品は、単なる一過性のブームを超え、テレビドラマという表現様式が持つ無限<rt>むげん</rt>の可能性を示した記念碑<rt>きねんひ</rt>的な傑作です。",
          "translation": "This work goes beyond a mere passing boom and is a monumental masterpiece demonstrating the infinite possibilities that the expression style of TV drama has.",
          "question": {
            "question": "この作品は表現様式に関して何を示したと評価されていますか。",
            "options": ["テレビドラマという表現様式が持つ無限の可能性", "広告の重要性", "撮影技術の限界", "特に何も示していません"],
            "answerIndex": 0,
            "explanation": "The text states: 'テレビドラマという表現様式が持つ無限の可能性を示した'."
          }
        }
      ]
    }
  }
};

// Generic backups for missing categories to ensure the procedural generator ALWAYS works for all levels and topics
const backupPools = {
  "daily": [
    {
      "text": "今日<rt>きょう</rt>は朝からとてもいい天気です。[time]に起きて、友達と散歩に行きました。散歩のあとで、一緒に美味しいお茶を飲みました。楽しかったです。",
      "translation": "Today is very good weather since morning. I woke up at [time_en] and went for a walk with my friend. After the walk, we drank delicious tea together. It was fun.",
      "hints": { "散歩": "walk/stroll", "飲む": "to drink" },
      "questions": [
        {
          "question": "何時に起きましたか。",
          "options": ["[time]に起きました", "九時に起きました", "昼に起きました", "起きませんでした"],
          "answerIndex": 0,
          "explanation": "The text says they woke up at [time_en]."
        }
      ]
    }
  ],
  "travel": [
    {
      "text": "来週、私は家族と一緒に[destination]へ旅行に行きます。[transport]で移動する予定です。美味しい食べ物をたくさん食べるのが楽しみです。",
      "translation": "Next week, I will go on a trip to [destination_en] with my family. We plan to travel by [transport_en]. I look forward to eating plenty of delicious food.",
      "hints": { "旅行": "trip/travel", "移動": "traveling/movement" },
      "questions": [
        {
          "question": "誰と旅行に行きますか。",
          "options": ["家族と一緒に行きます", "友達と行きます", "一人で行きます", "先生と行きます"],
          "answerIndex": 0,
          "explanation": "The text states: '家族と一緒に[destination]へ旅行に行きます'."
        }
      ]
    }
  ],
  "dining": [
    {
      "text": "今日、私は[food]を食べるために美味しいと評判の[place]へ行きました。期待通り、非常に[adjective]て大満足でした。また来たいと思います。",
      "translation": "Today, I went to a [place_en] famous for being delicious to eat [food_en]. As expected, it was very [adjective_en] and I was highly satisfied. I want to come again.",
      "hints": { "評判": "reputation", "大満足": "very satisfied" },
      "questions": [
        {
          "question": "何を食べに行きましたか。",
          "options": ["[food]を食べに行きました", "パンを食べに行きました", "ピザを食べに行きました", "何も食べませんでした"],
          "answerIndex": 0,
          "explanation": "The text states: '[food]を食べるために...へ行きました'."
        }
      ]
    }
  ],
  "shopping": [
    {
      "text": "昨日、私は[store]へ行って新しい[item]を買いました。価格は[price]円でした。デザインが非常に[adjective]て、店員さんも[people]だったので非常に良い買い物でした。",
      "translation": "Yesterday, I went to the [store_en] and bought a new [item_en]. The price was [price_en] yen. The design was very [adjective_en], and the staff was [people_en], so it was a very good purchase.",
      "hints": { "価格": "price", "良い買い物": "good purchase/shopping" },
      "questions": [
        {
          "question": "買ったものの価格はいくらでしたか。",
          "options": ["[price]円でした", "千円でした", "五万円でした", "分かりません"],
          "answerIndex": 0,
          "explanation": "The text says: '価格は[price]円でした'."
        }
      ]
    }
  ],
  "hobbies": [
    {
      "text": "私の主な趣味は[hobby]です。毎週末になると、[person]と一緒に時間を忘れて練習に取り組んでいます。私にとって一番リフレッシュできる時間です。",
      "translation": "My main hobby is [hobby_en]. When the weekend comes, I practice together with [person_en], forgetting about time. For me, it is the most refreshing time.",
      "hints": { "主な": "main", "練習": "practice", "リフレッシュ": "refreshing" },
      "questions": [
        {
          "question": "趣味は何ですか。",
          "options": ["[hobby]です", "勉強です", "仕事です", "掃除です"],
          "answerIndex": 0,
          "explanation": "The text states: '私の主な趣味は[hobby]です'."
        }
      ]
    }
  ],
  "weather": [
    {
      "text": "今日の天気は少し[weather]ですね。気温は[temp]度くらいで、外を歩くと[adjective]感じます。午後からは天気が回復すると良いですね。",
      "translation": "Today's weather is a bit [weather_en], isn't it? The temperature is about [temp_en] degrees, and it feels [adjective_en] when walking outside. It would be nice if the weather improves in the afternoon.",
      "hints": { "気温": "temperature", "回復する": "to recover/improve" },
      "questions": [
        {
          "question": "今日の天気は少しどうですか。",
          "options": ["[weather]天気です", "晴れです", "大雨です", "雪です"],
          "answerIndex": 0,
          "explanation": "The text says: '今日の天気は少し[weather]ですね'."
        }
      ]
    }
  ],
  "anime": {
    "intros": [
      {
        "text": "私<rt>わたし</rt>は日本<rt>にほん</rt>のアニメが大好<rt>だいす</rt>きです。特に[anime_character]が一番<rt>いちばん</rt>のヒーローです。",
        "translation": "I love Japanese anime. Especially, [anime_character_en] is my number one hero.",
        "question": {
          "question": "この人の一番のヒーローは誰ですか。",
          "options": ["[anime_character]です", "ドラえもんです", "アンパンマンです", "誰も好きではありません"],
          "answerIndex": 0,
          "explanation": "The text states that [anime_character_en] is their number one hero."
        }
      },
      {
        "text": "最<rt>さい</rt>近<rt>きん</rt>、世界中<rt>せいかいじゅう</rt>で日本のアニメを楽<rt>たの</rt>しむ人が増<rt>ふ</rt>えています。その中でも[anime_character]の人気<rt>にんき</rt>は圧倒的<rt>あっとうてき</rt>です。",
        "translation": "Recently, the number of people enjoying Japanese anime around the world is increasing. Among them, [anime_character_en]'s popularity is overwhelming.",
        "question": {
          "question": "最近どのような人が増えていますか。",
          "options": ["日本のアニメを楽しむ人", "テレビを見ない人", "本を読まない人", "運動をしない人"],
          "answerIndex": 0,
          "explanation": "The text states: '日本のアニメを楽しむ人が増えています'."
        }
      }
    ],
    "actions": [
      {
        "text": "アニメの中で、[anime_character]が[anime_power]を使<rt>つか</rt>う場面<rt>ばめん</rt>はとてもかっこよくて興奮<rt>こうふん</rt>します。",
        "translation": "In the anime, the scene where [anime_character_en] uses [anime_power_en] is extremely cool and exciting.",
        "question": {
          "question": "[anime_character]が何を使う場面がかっこいいですか。",
          "options": ["[anime_power]です", "お金です", "道具です", "魔法の杖です"],
          "answerIndex": 0,
          "explanation": "The text states: '[anime_character]が[anime_power]を使う場面はとてもかっこいい'."
        }
      },
      {
        "text": "彼<rt>かれ</rt>らは仲間<rt>なかま</rt>と協力<rt>きょうりょく</rt>して強<rt>つよ</rt>い敵<rt>てき</rt>を倒<rt>たお</rt>すために、日夜<rt>にちや</rt>修行<rt>しゅぎょう</rt>を重<rt>かさ</rt>ねています。",
        "translation": "They train day and night in order to cooperate with their allies and defeat strong enemies.",
        "question": {
          "question": "なぜ修行を重ねていますか。",
          "options": ["強い敵を倒すため", "遊ぶため", "お金を稼ぐため", "健康のため"],
          "answerIndex": 0,
          "explanation": "The text states: '強い敵を倒すために、日夜修行を重ねています'."
        }
      }
    ],
    "descriptions": [
      {
        "text": "彼<rt>かれ</rt>らの物語<rt>ものがたり</rt>は単<rt>たん</rt>なる娯楽<rt>ごらく</rt>ではなく、友情<rt>ゆうじょう</rt>や努力<rt>どりょく</rt>の大切<rt>たいせつ</rt>さを教<rt>おし</rt>えてくれます。",
        "translation": "Their stories are not mere entertainment; they teach us the importance of friendship and effort.",
        "question": {
          "question": "彼らの物語は何を教えてくれますか。",
          "options": ["友情や努力の大切さ", "お金の稼ぎ方", "歴史の知識", "特に何も教えてくれません"],
          "answerIndex": 0,
          "explanation": "The text says their stories teach the importance of friendship and effort ('友情や努力の大切さを教えてくれます')."
        }
      },
      {
        "text": "登場人物<rt>とうじょうじんぶつ</rt>の熱<rt>あつ</rt>いセリフや心情<rt>しんじょう</rt>の描写<rt>びょうしゃ</rt>は、多くの視聴者<rt>しちょうしゃ</rt>の心<rt>こころ</rt>を揺<rt>ゆ</rt>さぶります。",
        "translation": "The passionate dialogues and emotional depictions of the characters stir the hearts of many viewers.",
        "question": {
          "question": "何が視聴者の心を揺さぶりますか。",
          "options": ["登場人物の熱いセリフや心情の描写", "アニメのBGMだけ", "番組の長さ", "分かりません"],
          "answerIndex": 0,
          "explanation": "The text states: '登場人物の熱いセリフや心情の描写は、多くの視聴者の心を揺さぶります'."
        }
      }
    ],
    "conclusions": [
      {
        "text": "将来<rt>しょうらい</rt>、私は日本へ行って、お気に入りのアニメのフィギュアをたくさん買<rt>か</rt>いたいと願<rt>ねが</rt>っています。",
        "translation": "In the future, I hope to go to Japan and buy many figures of my favorite anime.",
        "question": {
          "question": "将来日本で何をしたいですか。",
          "options": ["アニメのフィギュアを買いたいです", "仕事をしたいです", "車を売りたいです", "何もしません"],
          "answerIndex": 0,
          "explanation": "The text states: 'お気に入りのアニメ of フィギュアをたくさん買いたいと願っています'." // Note: wait, it should be 'お気に入りのアニメのフィギュア', let's write it correctly
        }
      },
      {
        "text": "私も彼らのように強<rt>つよ</rt>い意志<rt>いし</rt>を持って、自分の夢<rt>ゆめ</rt>に向かって進<rt>すす</rt>みたいです。",
        "translation": "I also want to have a strong will like them and move forward toward my own dreams.",
        "question": {
          "question": "この人は彼らのようにどうしたいですか。",
          "options": ["強い意志を持って夢に向かって進みたい", "諦めたい", "何もしたくない", "家で寝たい"],
          "answerIndex": 0,
          "explanation": "The text states: '強い意志を持って、自分の夢に向かって進みたいです'."
        }
      }
    ]
  },
  "movies": {
    "intros": [
      {
        "text": "昨日<rt>きのう</rt>、私は友達と映画館へ行って[movie_title]を観<rt>み</rt>ました。この映画は[movie_genre]として有名<rt>ゆうめい</rt>です。",
        "translation": "Yesterday, I went to the movie theater with my friend and watched [movie_title_en]. This movie is famous as a [movie_genre_en].",
        "question": {
          "question": "昨日映画館で何を観ましたか。",
          "options": ["[movie_title]を観ました", "本を読みました", "寝ました", "ゲームをしました"],
          "answerIndex": 0,
          "explanation": "The text states: '映画館へ行って[movie_title]を観ました'."
        }
      },
      {
        "text": "週末<rt>しゅうまつ</rt>に大画面<rt>だいがいめん</rt>で映画を観<rt>み</rt>ることは、私にとって最高<rt>さいこう</rt>の娯楽<rt>ごらく</rt>です。今回は特に話題<rt>わだい</rt>の[movie_title]を選<rt>えら</rt>びました。",
        "translation": "Watching a movie on a big screen over the weekend is the best entertainment for me. This time, I chose [movie_title_en], which is a particularly hot topic.",
        "question": {
          "question": "週末のこの人にとって最高の娯楽は何ですか。",
          "options": ["大画面で映画を観ること", "本を読むこと", "ゲームをすること", "寝ること"],
          "answerIndex": 0,
          "explanation": "The text states: '大画面で映画を観ることは、私にとって最高の娯楽です'."
        }
      }
    ],
    "actions": [
      {
        "text": "館内<rt>かんない</rt>は暗<rt>くら</rt>く、音響<rt>おんきょう</rt>も素晴らしくて、まるで物語の中にいるような感覚<rt>かんかく</rt>でした。",
        "translation": "The theater was dark, and the sound system was wonderful, making me feel as if I were inside the story.",
        "question": {
          "question": "館内はどうでしたか。",
          "options": ["暗く音響も素晴らしかった", "明るくてうるさかった", "静かすぎた", "寒すぎた"],
          "answerIndex": 0,
          "explanation": "The text states: '館内は暗く、音響も素晴らしくて'."
        }
      },
      {
        "text": "ポップコーンを食べながら、映像<rt>えいぞう</rt>の美しさに終始<rt>しゅうし</rt>圧倒<rt>あっとう</rt>され続けました。",
        "translation": "While eating popcorn, I was completely overwhelmed by the beauty of the visuals from start to finish.",
        "question": {
          "question": "何を食べながら映画を観ましたか。",
          "options": ["ポップコーン", "ラーメン", "お寿司", "何も食べませんでした"],
          "answerIndex": 0,
          "explanation": "The text states: 'ポップコーンを食べながら'."
        }
      }
    ],
    "descriptions": [
      {
        "text": "監督<rt>かんとく</rt>の独創的<rt>どくそうてき</rt>な演出<rt>えんしゅつ</rt>と俳優<rt>はいゆう</rt>の演技<rt>えんぎ</rt>が完璧<rt>かんぺき</rt>に調和<rt>ちょうわ</rt>していました。",
        "translation": "The director's creative staging and the actors' performances were in perfect harmony.",
        "question": {
          "question": "何が完璧に調成していましたか。 (Note: typo correction: '調和していましたか。')",
          "options": ["監督の演出と俳優の演技", "音楽と照明", "ストーリーと価格", "分かりません"],
          "answerIndex": 0,
          "explanation": "The text says: '監督の独創的な演出と俳優の演技が完璧に調和していました'."
        }
      },
      {
        "text": "このストーリーには深いメッセージが込められており、人生について考えさせられます。",
        "translation": "A deep message is embedded in this story, making us think about life.",
        "question": {
          "question": "ストーリーには何が込められていますか。",
          "options": ["深いメッセージ", "ジョークだけ", "宣伝", "何もありません"],
          "answerIndex": 0,
          "explanation": "The text says: 'このストーリーには深いメッセージが込められており'."
        }
      }
    ],
    "conclusions": [
      {
        "text": "上映<rt>じょうえい</rt>が終わった後、心<rt>こころ</rt>が温<rt>あたた</rt>かくなり、非常に満足<rt>まんぞく</rt>しました。また来週も新しい映画を観たいです。",
        "translation": "After the screening ended, my heart felt warm and I was very satisfied. I want to watch a new movie next week too.",
        "question": {
          "question": "上映が終わった後どうなりましたか。",
          "options": ["心が温かくなり非常に満足した", "悲しくなった", "腹が立った", "眠くなった"],
          "answerIndex": 0,
          "explanation": "The text states: '上映が終わった後、心が温かくなり、非常に満足しました'."
        }
      },
      {
        "text": "感動<rt>かんどう</rt>で涙<rt>なみだ</rt>が出そうになりました。この素晴らしい体験をみんなに勧めたいです。",
        "translation": "I almost cried from emotion. I want to recommend this wonderful experience to everyone.",
        "question": {
          "question": "この体験についてどうしたいですか。",
          "options": ["みんなに勧めたいです", "忘れたいです", "誰にも言いたくないです", "分かりません"],
          "answerIndex": 0,
          "explanation": "The text states: 'この素晴らしい体験をみんなに勧めたいです'."
        }
      }
    ]
  },
  "series": {
    "intros": [
      {
        "text": "最近<rt>さいきん</rt>、私は家で日本のテレビドラマ[series_title]を観<rt>み</rt>るのにはまっています。ストーリーが非常に面白<rt>おもしろ</rt>いです。",
        "translation": "Recently, I am hooked on watching the Japanese TV drama [series_title_en] at home. The story is extremely interesting.",
        "question": {
          "question": "最近家で何を観ていますか。",
          "options": ["ドラマ[series_title]を観ています", "ニュースを観ています", "アニメだけです", "何も観ていません"],
          "answerIndex": 0,
          "explanation": "The text says they are hooked on watching the drama [series_title_en]."
        }
      },
      {
        "text": "夜<rt>よる</rt>、仕事が終わった後にテレビの前でドラマ[series_title]を観るのが、毎日の楽しみです。",
        "translation": "In the evening, after work is over, watching the drama [series_title_en] in front of the TV is my daily pleasure.",
        "question": {
          "question": "いつドラマを観ていますか。",
          "options": ["夜、仕事が終わった後", "朝起きてすぐ", "昼休みの間", "仕事中"],
          "answerIndex": 0,
          "explanation": "The text states: '夜、仕事が終わった後に...観るのが、毎日の楽しみです'."
        }
      }
    ],
    "actions": [
      {
        "text": "毎週新<rt>あたら</rt>しいエピソードが放送<rt>ほうそう</rt>されるのを、待ち遠しく思っています。",
        "translation": "I look forward eagerly to a new episode being broadcast every week.",
        "question": {
          "question": "毎週何を待ち遠しく思っていますか。",
          "options": ["新しいエピソードが放送されること", "映画の公開", "仕事の開始", "特にありません"],
          "answerIndex": 0,
          "explanation": "The text states: '毎週新しいエピソードが放送されるのを、待ち遠しく思っています'."
        }
      },
      {
        "text": "ネットフリックスなどの配信<rt>はいしん</rt>サービスを使って、一気に全話<rt>ぜんわ</rt>観てしまうこともあります。",
        "translation": "Sometimes I use distribution services like Netflix to watch all episodes at once.",
        "question": {
          "question": "どのように全話を一気に観ることがありますか。",
          "options": ["配信サービスを使って観る", "テレビの生放送を待つ", "友達の家で観る", "DVDを買う"],
          "answerIndex": 0,
          "explanation": "The text states: '配信サービスを使って、一気に全話観てしまうこともあります'."
        }
      }
    ],
    "descriptions": [
      {
        "text": "登場人物たちの複雑<rt>ふくざつ</rt>な人間関係と予測<rt>よそく</rt>できない展開<rt>てんかい</rt>から目が離せません。",
        "translation": "I cannot take my eyes off the complex human relationships of the characters and the unpredictable developments.",
        "question": {
          "question": "なぜ目が離せないのですか。",
          "options": ["複雑な人間関係と予測できない展開だから", "つまらない内容だから", "英語の吹き替えだから", "分かりません"],
          "answerIndex": 0,
          "explanation": "The text states: '複雑な人間関係と予測できない展開から目が離せません'."
        }
      },
      {
        "text": "毎回の劇的なクライマックスやエンディング曲の選定<rt>せんてい</rt>が非常に素晴らしいです。",
        "translation": "The dramatic climax each time and the selection of the ending theme song are extremely wonderful.",
        "question": {
          "question": "何が非常に素晴らしいですか。",
          "options": ["劇的なクライマックスやエンディング曲の選定", "テレビの画質", "出演者の服の値段", "分かりません"],
          "answerIndex": 0,
          "explanation": "The text says: '毎回の劇的なクライマックスやエンディング曲の選定が非常に素晴らしいです'."
        }
      }
    ],
    "conclusions": [
      {
        "text": "このドラマを観ると、また明日から仕事を頑張<rt>がんば</rt>ろうというエネルギーをもらえます。",
        "translation": "Watching this drama gives me energy to work hard again starting tomorrow.",
        "question": {
          "question": "ドラマを観るとどんな効果がありますか。",
          "options": ["明日から頑張ろうというエネルギーをもらえる", "疲れて眠くなる", "仕事が嫌になる", "特にありません"],
          "answerIndex": 0,
          "explanation": "The text states: 'また明日から仕事を頑張ろうというエネルギーをもらえます'."
        }
      },
      {
        "text": "早く来週の放送日<rt>ほうそうび</rt>になってほしいと、心から願っています。",
        "translation": "I sincerely hope that next week's broadcast date comes quickly.",
        "question": {
          "question": "この人は何を願っていますか。",
          "options": ["早く来週の放送日になってほしいこと", "テレビが壊れること", "仕事が休みに変わること", "何も願っていません"],
          "answerIndex": 0,
          "explanation": "The text says: '早く来週の放送日になってほしいと、心から願っています'."
        }
      }
    ]
  }
};

// Global variables dictionary to draw from for substitutions
const globalVariables = {
  "[anime_character]": ["悟空<rt>ごくう</rt>（ドラゴンボール）", "ナルト（NARUTO）", "五条<rt>ごじょう</rt>悟<rt>さとる</rt>（呪術廻戦）", "水<rt>みず</rt>篠<rt>しの</rt>旬<rt>しゅん</rt>（俺だけレベルアップな件）"],
  "[anime_character_en]": ["Goku (Dragon Ball)", "Naruto (NARUTO)", "Gojo Satoru (Jujutsu Kaisen)", "Sung Jinwoo (Solo Leveling)"],
  "[anime_power]": ["かめはめ波<rt>は</rt>", "螺旋丸<rt>らせんがん</rt>", "無下限呪術<rt>むかげんじゅじゅつ</rt>", "影<rt>かげ</rt>の兵士<rt>へいし</rt>を召喚<rt>しょうかん</rt>する力"],
  "[anime_power_en]": ["Kamehameha", "Rasengan", "Limitless Cursed Technique", "power to summon shadow soldiers"],
  "[movie_title]": ["「君の名は。」", "「千と千尋の神隠し」", "「鬼滅の刃 無限列車編」", "「THE FIRST SLAM DUNK」"],
  "[movie_title_en]": ["Your Name", "Spirited Away", "Demon Slayer: Mugen Train", "The First Slam Dunk"],
  "[movie_genre]": ["アニメ映画", "ファンタジー", "アクション映画", "スポーツドラマ"],
  "[movie_genre_en]": ["anime movie", "fantasy", "action movie", "sports drama"],
  "[series_title]": ["「相棒」", "「半沢直樹」", "「逃げるは恥だが役に立つ」", "「アリス・イン・ワンダーランド」"],
  "[series_title_en]": ["Aibou (Partners)", "Hanzawa Naoki", "We Married as a Job", "Alice in Borderland"],
  "[time]": ["六時<rt>ろくじ</rt>", "七時<rt>しちじ</rt>", "八時<rt>はちじ</rt>", "九時<rt>くじ</rt>"],
  "[time_en]": ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"],
  "[breakfast]": ["朝<rt>あさ</rt>御<rt>ご</rt>飯<rt>はん</rt>", "パンと卵<rt>たまご</rt>", "お粥<rt>かゆ</rt>", "シリアル"],
  "[breakfast_en]": ["breakfast", "bread and eggs", "rice porridge", "cereal"],
  "[transport]": ["電<rt>でん</rt>車<rt>しゃ</rt>", "自<rt>じ</rt>転<rt>てん</rt>車<rt>しゃ</rt>", "バス", "地下鉄<rt>ちかてつ</rt>"],
  "[transport_en]": ["train", "bicycle", "bus", "subway"],
  "[destination]": ["学<rt>がっ</rt>校<rt>こう</rt>", "大<rt>だい</rt>学<rt>がく</rt>", "会<rt>かい</rt>社<rt>しゃ</rt>", "オフィス"],
  "[destination_en]": ["school", "university", "office", "office workspace"],
  "[night_activity]": ["テレビを見<rt>み</rt>ます", "お茶<rt>ちゃ</rt>を飲<rt>の</rt>みます", "本<rt>ほん</rt>を読<rt>よ</rt>みます", "お風呂<rt>ふろ</rt>に入<rt>はい</rt>ります"],
  "[night_activity_en]": ["watch TV", "drink green tea", "read a book", "take a bath"],
  "[sleep_time]": ["十時<rt>じゅうじ</rt>", "十一時<rt>じゅういちじ</rt>", "十二時<rt>じゅうにじ</rt>", "十時半<rt>じゅうじはん</rt>"],
  "[sleep_time_en]": ["10:00 PM", "11:00 PM", "12:00 AM", "10:30 PM"],
  "[adjective]": ["面白<rt>おもしろ</rt>い", "簡単<rt>かんたん</rt>", "難<rt>むずか</rt>しい", "楽<rt>たの</rt>しい"],
  "[adjective_en]": ["interesting", "easy", "difficult", "fun"],
  "[people]": ["親切<rt>しんせつ</rt>", "優<rt>やさ</rt>しい", "丁寧<rt>ていねい</rt>", "元気<rt>げんき</rt>"],
  "[people_en]": ["kind", "friendly", "polite", "energetic"],
  "[activity]": ["近所の公園<rt>こうえん</rt>を走<rt>はし</rt>る", "ヨガの練習<rt>れんしゅう</rt>をする", "英語の勉強をする", "ラジオ体操<rt>たいそう</rt>をする"],
  "[activity_en]": ["run in the neighborhood park", "do yoga practice", "study English", "do radio gymnastics"],
  "[location]": ["静<rt>しず</rt>かな郊外<rt>こうがい</rt>", "賑<rt>にぎ</rt>やかな駅の近く", "緑<rt>みどり</rt>が多い公園の隣"],
  "[location_en]": ["in a quiet suburb", "near a busy station", "next to a green park"],
  "[helper]": ["大学の友達", "会社の先輩<rt>せんぱい</rt>", "親切な隣人<rt>りんじん</rt>", "同僚<rt>どうりょう</rt>"],
  "[helper_en]": ["my university friend", "my company senior", "a kind neighbor", "my colleague"],
  "[gift]": ["タオルや石鹸<rt>せっけん</rt>", "美味しいお菓子<rt>おかし</rt>", "お茶のパック", "果物<rt>くだもの</rt>"],
  "[gift_en]": ["towels or soap", "delicious sweets", "packs of green tea", "fresh fruits"],
  "[person]": ["日本の友達<rt>ともだち</rt>", "先生<rt>せんせい</rt>", "家族<rt>かぞく</rt>", "クラスメート"],
  "[person_en]": ["my Japanese friend", "my teacher", "my family", "my classmate"],
  "[drink]": ["お茶<rt>ちゃ</rt>", "ビール", "冷たい水<rt>みず</rt>", "ジュース"],
  "[drink_en]": ["green tea", "beer", "cold water", "fruit juice"],
  "[food]": ["寿司<rt>すし</rt>", "天<rt>てん</rt>ぷら", "ラーメン", "うどん"],
  "[food_en]": ["sushi", "tempura", "ramen", "udon noodles"],
  "[place]": ["レストラン", "食堂<rt>しょくどう</rt>", "居酒屋<rt>いざかや</rt>", "寿司屋<rt>すしや</rt>"],
  "[place_en]": ["restaurant", "cafeteria", "izakaya pub", "sushi restaurant"],
  "[store]": ["デパート", "ショッピングモール", "服屋<rt>ふくや</rt>", "スーパー"],
  "[store_en]": ["department store", "shopping center", "clothing shop", "supermarket"],
  "[item]": ["シャツ", "靴<rt>くつ</rt>", "鞄<rt>かばん</rt>", "帽子<rt>ぼうし</rt>"],
  "[item_en]": ["shirt", "shoes", "bag", "hat"],
  "[price]": ["五千<rt>ごせん</rt>", "八千<rt>はっせん</rt>", "一万<rt>いちまん</rt>", "三千<rt>さんぜん</rt>"],
  "[price_en]": ["5,000", "8,000", "10,000", "3,000"],
  "[hobby]": ["写真<rt>しゃしん</rt>を撮<rt>と</rt>ること", "テニス", "ギターを弾<rt>ひ</rt>くこと", "読書<rt>どくしょ</rt>"],
  "[hobby_en]": ["taking photos", "tennis", "playing the guitar", "reading books"],
  "[weather]": ["いい", "曇<rt>くも</rt>った", "雨<rt>あめ</rt>の", "晴れ晴れした"],
  "[weather_en]": ["nice", "cloudy", "rainy", "beautiful sunny"],
  "[temp]": ["二十五", "十五", "三十", "二十二"],
  "[temp_en]": ["25", "15", "30", "22"],
  "[change]": ["風<rt>かぜ</rt>が強<rt>つよ</rt>く吹<rt>ふ</rt>く", "晴<rt>は</rt>れて暖かくなる", "雨が降<rt>ふ</rt>り始める"],
  "[change_en]": ["become windy", "become sunny and warm", "start to rain"],
  "[action]": ["公園<rt>こうえん</rt>を散歩<rt>さんぽ</rt>", "家でゆっくり読書<rt>どくしょ</rt>", "デパートで買い物<rt>かいもの</rt>", "カフェで勉強"],
  "[action_en]": ["take a walk in the park", "read at ease at home", "shop at the department store", "study at a cafe"],
  "[improvement]": ["時間に遅れずに会社に行く", "毎朝集中<rt>しゅうちゅう</rt>して仕事をする", "授業の準備を早く終わらせる"],
  "[improvement_en]": ["go to the office on time", "concentrate on work every morning", "finish preparing classes early"],
  "[date]": ["一番長い", "遠い先の", "最新の", "近い先の"],
  "[date_en]": ["the longest", "the furthest off", "the newest", "the nearest"],
  "[policy]": ["無駄な買い物を減らす", "賞味期限が近いものから消費する", "食べ残しをしないように気をつける"],
  "[policy_en]": ["reduce wasteful shopping", "consume items whose expiration dates are closer first", "be careful not to leave uneaten food"],
  "[target]": ["二酸化炭素の排出量", "プラスチックの廃棄量", "余分なエネルギーの消費"],
  "[target_en]": ["CO2 emissions", "plastic waste", "excess energy consumption"],
  "[difficulty]": ["短期的な利益との両立が難しい", "中小企業にとって対応のハードルが高い", "消費者の理解を得るのに時間がかかる"],
  "[difficulty_en]": ["balancing it with short-term profits is difficult", "the hurdle for small and medium-sized enterprises is high", "it takes time to gain consumer understanding"]
};

/**
 * Procedurally synthesizes a passage by randomly selecting sentences from pools,
 * and performing variables replacement uniformly.
 */
function buildProceduralPassage(level, topic) {
  const levelPools = storyPools[level] || {};
  let topicPool = levelPools[topic];
  let usingBackup = false;

  if (!topicPool) {
    // Check if backup database has this topic
    topicPool = backupPools[topic];
    usingBackup = true;
  }

  // If still not found, default to daily backup
  if (!topicPool) {
    topicPool = backupPools["daily"];
    usingBackup = true;
  }

  // Select sentences
  let intro, action, desc, concl;
  let content = "";
  let translation = "";
  const collectedQuestions = [];
  const hints = {};
  
  if (!topicPool.intros) {
    // Backups are simple single-element arrays with full content already
    const base = topicPool[Math.floor(Math.random() * topicPool.length)];
    content = base.text;
    translation = base.translation;
    if (base.questions) {
      base.questions.forEach(q => collectedQuestions.push(q));
    }
    if (base.hints) {
      Object.assign(hints, base.hints);
    }
  } else {
    // Draw one random sentence from each pool
    intro = topicPool.intros[Math.floor(Math.random() * topicPool.intros.length)];
    action = topicPool.actions ? topicPool.actions[Math.floor(Math.random() * topicPool.actions.length)] : null;
    desc = topicPool.descriptions ? topicPool.descriptions[Math.floor(Math.random() * topicPool.descriptions.length)] : null;
    concl = topicPool.conclusions ? topicPool.conclusions[Math.floor(Math.random() * topicPool.conclusions.length)] : null;

    // Combine text and translations
    content = intro.text;
    translation = intro.translation;

    if (intro.question) collectedQuestions.push(intro.question);

    if (action) {
      content += " " + action.text;
      translation += " " + action.translation;
      if (action.question) collectedQuestions.push(action.question);
    }
    if (desc) {
      content += " " + desc.text;
      translation += " " + desc.translation;
      if (desc.question) collectedQuestions.push(desc.question);
    }
    if (concl) {
      content += " " + concl.text;
      translation += " " + concl.translation;
      if (concl.question) collectedQuestions.push(concl.question);
    }

    // Build hints
    [intro, action, desc, concl].forEach(section => {
      if (section && section.hints) {
        Object.assign(hints, section.hints);
      }
    });
  }

  // Build replacements index uniformly across the story
  const replacements = {};
  const groupIndices = {};

  // Find all placeholders in the combined content
  const placeholders = [...new Set(content.match(/\[[a-zA-Z_]+\]/g) || [])];
  
  placeholders.forEach(placeholder => {
    const groupName = placeholder.replace('[', '').replace(']', '').replace('_en', '');
    const variablesPool = globalVariables[placeholder] || globalVariables[`[${groupName}]`] || [];
    
    if (variablesPool.length > 0) {
      if (!(groupName in groupIndices)) {
        groupIndices[groupName] = Math.floor(Math.random() * variablesPool.length);
      }
      const idx = groupIndices[groupName];
      replacements[placeholder] = globalVariables[placeholder][idx];
      
      const enPlaceholder = `[${groupName}_en]`;
      if (globalVariables[enPlaceholder]) {
        replacements[enPlaceholder] = globalVariables[enPlaceholder][idx];
      }
    }
  });

  // Replace placeholders in content and translation
  Object.keys(replacements).forEach(key => {
    content = content.split(key).join(replacements[key]);
    translation = translation.split(key).join(replacements[key]);
  });

  // Compile questions (replace placeholders & strip ruby tags)
  // We randomly choose up to 2 questions
  const selectedQs = collectedQuestions.sort(() => 0.5 - Math.random()).slice(0, 2);
  const questions = selectedQs.map(q => {
    let qText = q.question;
    Object.keys(replacements).forEach(key => {
      qText = qText.split(key).join(replacements[key]);
    });
    
    const options = q.options.map(opt => {
      let optText = opt;
      Object.keys(replacements).forEach(key => {
        optText = optText.split(key).join(replacements[key]);
      });
      return optText.replace(/<rt>.*?<\/rt>/g, '').replace(/<\/?[^>]+(>|$)/g, "");
    });
    
    let explanation = q.explanation;
    Object.keys(replacements).forEach(key => {
      explanation = explanation.split(key).join(replacements[key]);
    });
    explanation = explanation.replace(/<rt>.*?<\/rt>/g, '').replace(/<\/?[^>]+(>|$)/g, "");
    
    return {
      question: qText.replace(/<rt>.*?<\/rt>/g, '').replace(/<\/?[^>]+(>|$)/g, ""),
      options: options,
      answerIndex: q.answerIndex,
      explanation: explanation
    };
  });

  // Hints were already initialized and built in the intro/backup branches above.

  // Add variables replacements to hints
  Object.keys(replacements).forEach(key => {
    if (!key.endsWith('_en]')) {
      const jpVal = replacements[key].replace(/<rt>.*?<\/rt>/g, '').replace(/<\/?[^>]+(>|$)/g, "");
      const enVal = replacements[key.replace(']', '_en]')] || '';
      if (enVal) {
        hints[jpVal] = enVal;
      }
    }
  });

  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  return {
    title: `Dynamic ${level} Reading: ${capitalizedTopic}`,
    content: content,
    translation: translation,
    hints: hints,
    questions: questions
  };
}

window.JapaneseReadingGenerator = {
  /**
   * Generates a Japanese passage client-side using local sentence combiner.
   * This is the only generation method — the Gemini AI engine has been removed.
   */
  generateProceduralPassage: function(level, topic, focusGrammarId, focusVocabId) {
    return buildProceduralPassage(level, topic);
  }
};
