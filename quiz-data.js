const quizDatabase = [
    {
        question: "忍術学園の一年生で眼鏡をかけているキャラクターは誰でしょう？",
        options: ["乱太郎", "きり丸", "しんべヱ", "利吉"],
        correct: 0
    },
    {
        question: "「ドケチ」として知られる忍術学園の一年生は誰でしょう？",
        options: ["乱太郎", "きり丸", "しんべヱ", "利吉"],
        correct: 1
    },
    {
        question: "福富屋の息子で商人の家系出身のキャラクターは誰でしょう？",
        options: ["乱太郎", "きり丸", "しんべヱ", "利吉"],
        correct: 2
    },
    {
        question: "18歳のフリーの売れっ子忍者で火縄銃が得意なキャラクターは誰でしょう？",
        options: ["山田利吉", "戸部", "乱太郎", "きり丸"],
        correct: 0
    },
    {
        question: "忍術学園で剣術を教える厳しい先生は誰でしょう？",
        options: ["利吉", "戸部", "乱太郎", "しんべヱ"],
        correct: 1
    },
    {
        question: "乱太郎の正式な名前は何でしょう？",
        options: ["猪名寺乱太郎", "摂津乱太郎", "福富乱太郎", "山田乱太郎"],
        correct: 0
    },
    {
        question: "きり丸の正式な名前は何でしょう？",
        options: ["猪名寺きり丸", "摂津のきり丸", "福富きり丸", "山田きり丸"],
        correct: 1
    },
    {
        question: "しんべヱの正式な名前は何でしょう？",
        options: ["猪名寺しんべヱ", "摂津しんべヱ", "福富しんべヱ", "山田しんべヱ"],
        correct: 2
    },
    {
        question: "忍たま乱太郎の原作漫画のタイトルは何でしょう？",
        options: ["忍者乱太郎", "落第忍者乱太郎", "忍術乱太郎", "修行忍者乱太郎"],
        correct: 1
    },
    {
        question: "忍たま乱太郎のアニメが放送開始されたのは何年でしょう？",
        options: ["1991年", "1992年", "1993年", "1994年"],
        correct: 2
    },
    {
        question: "忍たま乱太郎のアニメを放送しているのはどのテレビ局でしょう？",
        options: ["フジテレビ", "TBS", "NHK", "テレビ朝日"],
        correct: 2
    },
    {
        question: "忍術学園の一年い組の担任の先生は誰でしょう？",
        options: ["戸部", "土井", "山田", "ユキ"],
        correct: 1
    },
    {
        question: "乱太郎の特徴的な持ち物は何でしょう？",
        options: ["眼鏡", "手裏剣", "刀", "弓矢"],
        correct: 0
    },
    {
        question: "きり丸が最も大切にしているものは何でしょう？",
        options: ["友情", "お金", "忍術", "食べ物"],
        correct: 1
    },
    {
        question: "しんべヱの家業は何でしょう？",
        options: ["農業", "商業", "武士", "忍者"],
        correct: 1
    },
    {
        question: "忍術学園は何時代を舞台にしているでしょう？",
        options: ["平安時代", "鎌倉時代", "戦国時代", "江戸時代"],
        correct: 2
    },
    {
        question: "山田利吉の父親の名前は何でしょう？",
        options: ["山田平助", "山田伝蔵", "山田太郎", "山田次郎"],
        correct: 1
    },
    {
        question: "忍術学園の校長先生の名前は何でしょう？",
        options: ["学園長", "校長", "園長", "頭領"],
        correct: 0
    },
    {
        question: "一年い組のメンバーは全部で何人でしょう？",
        options: ["3人", "5人", "7人", "10人"],
        correct: 0
    },
    {
        question: "乱太郎の声優は誰でしょう？（初期）",
        options: ["高山みなみ", "田中真弓", "丹下桜", "林原めぐみ"],
        correct: 0
    },
    {
        question: "きり丸の声優は誰でしょう？",
        options: ["高山みなみ", "田中真弓", "丹下桜", "林原めぐみ"],
        correct: 1
    },
    {
        question: "忍たま乱太郎の原作者は誰でしょう？",
        options: ["高橋留美子", "尼子騒兵衛", "青山剛昌", "藤子不二雄"],
        correct: 1
    },
    {
        question: "忍術学園で学ぶ主な科目は何でしょう？",
        options: ["国語・算数", "忍術・体術", "歴史・地理", "音楽・美術"],
        correct: 1
    },
    {
        question: "乱太郎たちが所属するのは何年生でしょう？",
        options: ["一年生", "二年生", "三年生", "四年生"],
        correct: 0
    },
    {
        question: "忍術学園の制服の色は何色でしょう？",
        options: ["青", "赤", "緑", "黄"],
        correct: 0
    },
    {
        question: "しんべヱの性格として最も当てはまるのは何でしょう？",
        options: ["せっかち", "のんびり", "怒りっぽい", "泣き虫"],
        correct: 1
    },
    {
        question: "忍たま乱太郎でよく登場する食べ物は何でしょう？",
        options: ["寿司", "うどん", "おにぎり", "ラーメン"],
        correct: 2
    },
    {
        question: "乱太郎の家族構成で正しいのはどれでしょう？",
        options: ["両親と兄", "両親のみ", "両親と妹", "祖父母も同居"],
        correct: 1
    },
    {
        question: "忍術学園の生徒たちが使う武器で最も一般的なのは何でしょう？",
        options: ["刀", "手裏剣", "弓矢", "槍"],
        correct: 1
    },
    {
        question: "忍たま乱太郎のアニメの主な視聴者層は何でしょう？",
        options: ["男性のみ", "女性のみ", "子供のみ", "幅広い年齢層"],
        correct: 3
    }
];