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
  "anime": [
    {
      "text": "私<rt>わたし</rt>は日本<rt>にほん</rt>のアニメが大好<rt>だいす</rt>きです。特に[anime_character]が一番<rt>いちばん</rt>のヒーローです。",
      "translation": "I love Japanese anime. Especially, [anime_character_en] is my number one hero.",
      "hints": { "特に": "especially", "ヒーロー": "hero" },
      "questions": [
        {
          "question": "この人の一番 of ヒーローは誰ですか。",
          "options": ["[anime_character]です", "ドラえもんです", "アンパンマンです", "誰も好きではありません"],
          "answerIndex": 0,
          "explanation": "The text states that [anime_character_en] is their number one hero."
        }
      ]
    },
    {
      "text": "アニメの中で、[anime_character]が[anime_power]を使<rt>つか</rt>う場面<rt>ばめん</rt>はとてもかっこよくて興奮<rt>こうふん</rt>します。",
      "translation": "In the anime, the scene where [anime_character_en] uses [anime_power_en] is extremely cool and exciting.",
      "hints": { "場面": "scene", "興奮": "exciting/excited" },
      "questions": [
        {
          "question": "[anime_character]が何を使う場面がかっこいいですか。",
          "options": ["[anime_power]です", "お金です", "道具です", "魔法の杖です"],
          "answerIndex": 0,
          "explanation": "The text states: '[anime_character]が[anime_power]を使う場面はとてもかっこいい'."
        }
      ]
    }
  ],
  "movies": [
    {
      "text": "昨日<rt>きのう</rt>、私は友達と映画館へ行って[movie_title]を観<rt>み</rt>ました。この映画は[movie_genre]として有名<rt>ゆうめい</rt>です。",
      "translation": "Yesterday, I went to the movie theater with my friend and watched [movie_title_en]. This movie is famous as a [movie_genre_en].",
      "hints": { "映画館": "movie theater", "有名": "famous" },
      "questions": [
        {
          "question": "昨日映画館で何を観ましたか。",
          "options": ["[movie_title]を観ました", "本を読みました", "寝ました", "ゲームをしました"],
          "answerIndex": 0,
          "explanation": "The text states: '映画館へ行って[movie_title]を観ました'."
        }
      ]
    }
  ],
  "series": [
    {
      "text": "最近<rt>さいきん</rt>、私は家で日本のテレビドラマ[series_title]を観<rt>み</rt>るのにはまっています。ストーリーが非常に面白<rt>おもしろ</rt>いです。",
      "translation": "Recently, I am hooked on watching the Japanese TV drama [series_title_en] at home. The story is extremely interesting.",
      "hints": { "最近": "recently/lately", "はまっている": "hooked on/into" },
      "questions": [
        {
          "question": "最近家で何を観ていますか。",
          "options": ["ドラマ[series_title]を観ています", "ニュースを観ています", "アニメだけです", "何も観ていません"],
          "answerIndex": 0,
          "explanation": "The text says they are hooked on watching the drama [series_title_en]."
        }
      ]
    }
  ]
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
  
  if (usingBackup) {
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
