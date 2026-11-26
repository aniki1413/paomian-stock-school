import { EXTRA_LEVELS } from "./extra-levels";
import { gradeJuice, gradeMarble, gradeRain } from "./logic";
import type { BuddyId, ChapterId, Level } from "./types";

export const BUDDIES: Array<{
  id: BuddyId;
  name: string;
  role: string;
  line: string;
  img: string;
}> = [
  {
    id: "dad",
    name: "泡麵",
    role: "爸爸",
    line: "先看懂，再決定要不要衝。",
    img: "/characters/dad.png",
  },
  {
    id: "mom",
    name: "邪仔",
    role: "媽媽",
    line: "慢慢看，不急著下結論。",
    img: "/characters/mom.png",
  },
  {
    id: "lizhang",
    name: "里長伯",
    role: "姐姐",
    line: "我來幫大家整理重點。",
    img: "/characters/lizhang.png",
  },
  {
    id: "ligan",
    name: "里幹事",
    role: "妹妹",
    line: "這題我也好想知道！",
    img: "/characters/ligan.png",
  },
  {
    id: "ohru",
    name: "OHRU",
    role: "貓",
    line: "本貓只在看懂的時候睜眼。",
    img: "/characters/ohru.png",
  },
  {
    id: "idee",
    name: "I-DEE",
    role: "小恐龍",
    line: "圓圓的重點，記在肚子裡。",
    img: "/characters/idee.png",
  },
  {
    id: "goose",
    name: "I-Goose",
    role: "鵝",
    line: "答對了就揮一下翅膀。",
    img: "/characters/goose.png",
  },
];

export const CHAPTERS: Array<{
  id: ChapterId;
  index: string;
  title: string;
  subtitle: string;
  unlockHint?: string;
}> = [
  { id: "k", index: "01", title: "K棒認識", subtitle: "一天的價錢故事" },
  {
    id: "v",
    index: "02",
    title: "成交量判斷",
    subtitle: "市場熱不熱鬧",
    unlockHint: "K 棒小考答對六成以上，這章才會打開。",
  },
  {
    id: "s",
    index: "03",
    title: "模擬交易",
    subtitle: "用假錢走一遍",
    unlockHint: "成交量小考過關後，才能用假錢模擬。",
  },
  {
    id: "ma",
    index: "04",
    title: "均線是什麼",
    subtitle: "價錢的散步路線",
    unlockHint: "模擬交易都走過一次以後，均線章節才會打開。",
  },
  {
    id: "stop",
    index: "05",
    title: "停損停利",
    subtitle: "先想好怎麼離開",
    unlockHint: "均線小考答對六成以上，這一章才會打開。",
  },
  {
    id: "mix",
    index: "06",
    title: "分散投資",
    subtitle: "蛋不要放同一個籃子",
    unlockHint: "離開方法小考答對六成以上，這一章才會打開。",
  },
];

export const LEVELS: Level[] = [
  {
    id: "k1",
    chapter: "k",
    title: "一根 K 棒",
    blurb: "身體與影線",
    notes: [
      "粗身體是開盤走到收盤。",
      "上下細線是這天的最高和最低。",
      "身體很長，代表開盤和收盤差很多。",
      "身體很短，代表價錢差不多停在原地。",
    ],
    steps: [
      {
        kind: "teach",
        speech: "K 棒是一天的價錢故事。",
        body: "粗粗的身體，是開盤價走到收盤價。上下兩根細線叫影線，是這天摸到的最高和最低。先不要管名字好不好記，把它想成一根棒棒糖就好。",
        candles: [{ o: 10, h: 16, l: 8, c: 14 }],
        guide: true,
      },
      {
        kind: "quiz",
        speech: "看這根棒棒糖。",
        prompt: "粗粗的身體，代表什麼？",
        candles: [{ o: 10, h: 16, l: 8, c: 14 }],
        choices: [
          { id: "a", label: "從開盤走到收盤", correct: true },
          { id: "b", label: "從最高走到最低" },
          { id: "c", label: "今天成交了多少" },
        ],
        explain: "身體是開盤到收盤。最高和最低在細細的影線上，不在身體裡。",
      },
      {
        kind: "quiz",
        speech: "再看一次細線。",
        prompt: "上下兩根細線，代表什麼？",
        candles: [{ o: 12, h: 18, l: 9, c: 11 }],
        choices: [
          { id: "a", label: "這天的最高和最低", correct: true },
          { id: "b", label: "昨天收盤到今天" },
          { id: "c", label: "開盤價和收盤價" },
        ],
        explain: "上影線摸到最高，下影線摸到最低。身體才是開盤和收盤。",
      },
      {
        kind: "quiz",
        speech: "身體有長有短。",
        prompt: "身體很長，通常是什麼意思？",
        candles: [{ o: 8, h: 15, l: 7.5, c: 14.5 }],
        choices: [
          { id: "a", label: "開盤和收盤差很多", correct: true },
          { id: "b", label: "開盤和收盤差不多" },
          { id: "c", label: "今天根本沒有開市" },
        ],
        explain: "身體長，代表開盤到收盤移動很多。身體很短，代表這天價錢差不多停在原地。",
      },
    ],
  },
  {
    id: "k2",
    chapter: "k",
    title: "紅漲綠跌",
    blurb: "台灣的顏色",
    notes: [
      "台灣：收盤比開盤高是紅 K，叫上漲。",
      "收盤比開盤低是綠 K，叫下跌。",
      "顏色只看這一根自己，先不要跟昨天比。",
      "真實看盤軟體常跟昨天收盤比，這堂課先不這樣。",
      "開盤和收盤幾乎一樣，叫十字線。",
    ],
    steps: [
      {
        kind: "teach",
        speech: "顏色先看這一根自己。",
        body: "在台灣，收盤比開盤高是紅 K，叫上漲；收盤比開盤低是綠 K，叫下跌。有的外國書顏色剛好相反。我們這堂課用台灣的習慣。而且先別跟昨天比，只看這一根的開盤和收盤。",
        candles: [
          { o: 10, h: 14, l: 9.5, c: 13 },
          { o: 13, h: 13.5, l: 9, c: 10 },
        ],
      },
      {
        kind: "quiz",
        speech: "開盤 10，收盤 14。",
        prompt: "這根是上漲還是下跌？",
        candles: [{ o: 10, h: 15, l: 9.5, c: 14 }],
        choices: [
          { id: "a", label: "這是上漲的紅 K", correct: true },
          { id: "b", label: "這是下跌的綠 K" },
          { id: "c", label: "這根幾乎沒有變" },
        ],
        explain: "收盤 14 比開盤 10 高，所以是紅 K。影線再長，也改不了這個顏色。",
      },
      {
        kind: "quiz",
        speech: "這根下面的影子很長。",
        prompt: "這根長下影線，今天是上漲還是下跌？",
        candles: [{ o: 20, h: 21, l: 12, c: 18 }],
        choices: [
          { id: "a", label: "這根是下跌", correct: true },
          { id: "b", label: "這根是上漲" },
          { id: "c", label: "這根看不出來" },
        ],
        explain: "收盤 18 比開盤 20 低，是綠 K。長長的下影線只代表曾經跌更深，後來有拉回一點，但還是收在開盤下面。",
      },
      {
        kind: "quiz",
        speech: "昨天收盤是 30。今天開 18、收 20。",
        prompt: "今天這根 K 棒是？",
        candles: [{ o: 18, h: 21, l: 17, c: 20 }],
        choices: [
          { id: "a", label: "紅 K，比開盤高", correct: true },
          { id: "b", label: "綠 K，比昨天便宜" },
          { id: "c", label: "這根幾乎沒變" },
        ],
        explain:
          "入門先看這一根：20 比 18 高，是紅 K。它確實比昨天便宜，那是跟昨天比，不是這根棒子的顏色。真實的看盤軟體常用「跟昨天收盤比」來決定顏色，這堂課先只看這一根自己。",
      },
      {
        kind: "quiz",
        speech: "開盤和收盤幾乎一樣。",
        prompt: "這根最像哪一句？",
        candles: [{ o: 15, h: 17.5, l: 13, c: 15 }],
        choices: [
          { id: "a", label: "這天幾乎沒漲也沒跌", correct: true },
          { id: "b", label: "這天是明顯的大漲" },
          { id: "c", label: "這天是明顯的大跌" },
        ],
        explain: "開盤和收盤幾乎一樣，身體扁扁的，叫十字線。這天價錢差不多停在原地。",
      },
    ],
  },
  {
    id: "k3",
    chapter: "k",
    title: "長長的影子",
    blurb: "被拉回的故事",
    notes: [
      "長下影：先跌很深，收盤又拉回來。",
      "長上影：先衝高，後來被壓回來。",
      "大身體、短影子：這天方向比較乾脆。",
      "影子長短不會改變這根是紅還是綠。",
    ],
    steps: [
      {
        kind: "teach",
        speech: "影子會說「曾經走到哪裡」。",
        body: "下影線很長、身體在上面：價錢曾經掉很深，但收盤拉回來了。上影線很長、身體在下面：曾經衝很高，但被壓回去。大身體配短影子：這天方向很乾脆。",
        candles: [
          { o: 12, h: 13, l: 6, c: 12.6 },
          { o: 14, h: 20, l: 13.5, c: 13.8 },
        ],
      },
      {
        kind: "quiz",
        speech: "身體小，下面一根很長。",
        prompt: "這根比較像哪個故事？",
        candles: [{ o: 11, h: 12, l: 6, c: 11.6 }],
        choices: [
          { id: "a", label: "先跌深，後來拉回來", correct: true },
          { id: "b", label: "整天都在痛快上漲" },
          { id: "c", label: "先衝高，後來被壓回" },
        ],
        explain: "這像一把鎚子。最低曾經到很下面，但收盤回到上面。有人在低的地方把它接住了。",
      },
      {
        kind: "quiz",
        speech: "上面的線拉很長。",
        prompt: "這根上影線很長的 K 棒，比較像哪個故事？",
        candles: [{ o: 15, h: 22, l: 14.4, c: 14.8 }],
        choices: [
          { id: "a", label: "先衝高，後來被壓回", correct: true },
          { id: "b", label: "先跌深，後來拉回來" },
          { id: "c", label: "這天幾乎沒有交易" },
        ],
        explain: "最高摸到很上面，可是收盤掉回開盤附近。衝高沒有站穩。",
      },
      {
        kind: "quiz",
        speech: "身體很大，影子很短。",
        prompt: "這根紅 K 在說什麼？",
        candles: [{ o: 10, h: 16.2, l: 9.6, c: 15.8 }],
        choices: [
          { id: "a", label: "這天乾脆地往上走", correct: true },
          { id: "b", label: "這天價錢幾乎沒動" },
          { id: "c", label: "這天是明顯的大跌" },
        ],
        explain: "開盤到收盤拉出長紅身體，最高最低也沒有離身體太遠。方向清楚。",
      },
      {
        kind: "quiz",
        speech: "兩根放在一起。",
        prompt: "哪一根是「先跌深、再拉回」？",
        candles: [
          { o: 18, h: 22, l: 17.5, c: 18.4 },
          { o: 14, h: 14.6, l: 8, c: 13.8 },
        ],
        choices: [
          { id: "a", label: "右邊那根", correct: true },
          { id: "b", label: "左邊那根" },
          { id: "c", label: "兩根都是" },
        ],
        explain: "右邊下影線很長，身體留在上面。左邊上影線比較長，是衝高後被壓住的樣子。",
      },
    ],
  },
  {
    id: "k4",
    chapter: "k",
    title: "K 棒小考",
    blurb: "畢業才能去下一章",
    boss: true,
    notes: [
      "紅漲綠跌，只比這一根的開盤和收盤。",
      "細線上端是最高價，下端是最低價。",
      "比昨天貴，不代表這根就是紅 K。",
      "長下影是先跌深，收盤再拉回來。",
      "小考答對至少 3 題，下一章才打開。",
    ],
    steps: [
      {
        kind: "quiz",
        speech: "小考第 1 題。",
        prompt: "收盤比開盤低，這根是？",
        candles: [{ o: 16, h: 16.5, l: 12, c: 13 }],
        choices: [
          { id: "a", label: "綠 K，今天在下跌", correct: true },
          { id: "b", label: "紅 K，今天在上漲" },
          { id: "c", label: "十字，幾乎沒變動" },
        ],
        explain: "13 比 16 低，是綠 K。下影線長，只代表曾經更低。",
      },
      {
        kind: "quiz",
        speech: "第 2 題。",
        prompt: "細線的上端是什麼價格？",
        candles: [{ o: 11, h: 17, l: 10, c: 15 }],
        choices: [
          { id: "a", label: "細線上端是最高價", correct: true },
          { id: "b", label: "細線上端是收盤價" },
          { id: "c", label: "細線上端是成交量" },
        ],
        explain: "最上面是最高，最下面是最低。收盤在身體的某一端。",
      },
      {
        kind: "quiz",
        speech: "第 3 題。昨天收 10，今天開 14 收 13。",
        prompt: "今天這根是？",
        candles: [{ o: 14, h: 14.5, l: 12.5, c: 13 }],
        choices: [
          { id: "a", label: "綠 K，比開盤低", correct: true },
          { id: "b", label: "紅 K，比昨天貴" },
          { id: "c", label: "這根無法判斷" },
        ],
        explain: "跟昨天比確實比較貴，但這一根自己是從 14 收到 13，所以是綠 K。",
      },
      {
        kind: "quiz",
        speech: "第 4 題。",
        prompt: "這根長下影，最像？",
        candles: [{ o: 19, h: 19.5, l: 11, c: 18.6 }],
        choices: [
          { id: "a", label: "先跌深，收盤拉回", correct: true },
          { id: "b", label: "先衝高，後來被壓" },
          { id: "c", label: "開盤收盤差不多" },
        ],
        explain: "最低很深，收盤卻回到身體上方。是被拉回來的故事。",
      },
      {
        kind: "quiz",
        speech: "最後一題。",
        prompt: "哪一根是紅 K？",
        caption: "place",
        candles: [
          { o: 12, h: 13, l: 9, c: 10 },
          { o: 10, h: 14, l: 9.5, c: 13.5 },
          { o: 15, h: 16, l: 14.8, c: 15 },
        ],
        choices: [
          { id: "a", label: "中間那根", correct: true },
          { id: "b", label: "左邊那根" },
          { id: "c", label: "右邊那根" },
        ],
        explain: "中間收盤明顯高於開盤。左邊是綠 K，右邊開盤收盤一樣，是十字線。小考結束！",
      },
    ],
  },
  {
    id: "v1",
    chapter: "v",
    title: "熱鬧還是安靜",
    blurb: "柱子就是人潮",
    notes: [
      "柱子是成交量，只說忙不忙，不說漲跌。",
      "換手就是股票從一個人手上換到另一個人手上。",
      "柱子比虛線高，買賣的人比較多。",
      "柱子比虛線矮，市場比較安靜。",
      "要比較高矮時，至少看三根柱子。",
    ],
    steps: [
      {
        kind: "teach",
        speech: "K 棒下面常常還有柱子。",
        body: "那些柱子是成交量：這段時間股票換手的數量。換手就是股票從一個人手上換到另一個人手上。柱子高，像遊樂場大排長龍，市場很熱鬧。柱子矮，像圖書館，人很少。橫的虛線是平常的量，用來比較。成交量不是漲跌，它只說「忙不忙」。",
        candles: [
          { o: 10, h: 12, l: 9.5, c: 11.5 },
          { o: 11.5, h: 12, l: 10, c: 10.6 },
          { o: 10.6, h: 11.4, l: 10.2, c: 11 },
        ],
        volumes: [30, 90, 45],
      },
      {
        kind: "quiz",
        speech: "三天的柱子。",
        prompt: "哪一天市場最熱鬧？",
        candles: [
          { o: 20, h: 21, l: 19, c: 20.5 },
          { o: 20.5, h: 22, l: 20, c: 21.5 },
          { o: 21.5, h: 22, l: 21, c: 21.2 },
        ],
        volumes: [28, 86, 40],
        choices: [
          { id: "a", label: "中間那天最熱鬧", correct: true },
          { id: "b", label: "左邊那天最熱鬧" },
          { id: "c", label: "三天一樣熱鬧" },
        ],
        explain: "成交量看柱子高度，不看它是第幾天。中間最高，換手最多。換手就是股票從一個人手上換到另一個人手上。",
      },
      {
        kind: "quiz",
        speech: "看三根柱子，中間特別矮。",
        prompt: "中間那天的矮柱子，比較像哪句？",
        candles: [
          { o: 15, h: 15.8, l: 14.6, c: 15.4 },
          { o: 15.3, h: 15.6, l: 14.7, c: 15.2 },
          { o: 15.1, h: 15.7, l: 14.8, c: 15.5 },
        ],
        volumes: [62, 18, 58],
        choices: [
          { id: "a", label: "買賣的人比較少", correct: true },
          { id: "b", label: "這天一定是大漲" },
          { id: "c", label: "這天一定是大跌" },
        ],
        explain: "中間柱子比平常的量矮，只代表安靜。漲或跌要看 K 棒的顏色，不能只看柱子。",
      },
      {
        kind: "quiz",
        speech: "三根都是紅 K。",
        prompt: "中間這根紅 K，可以怎麼讀？",
        candles: [
          { o: 10, h: 11.4, l: 9.7, c: 11.1 },
          { o: 10.6, h: 11.6, l: 10.2, c: 11.4 },
          { o: 10.9, h: 11.5, l: 10.4, c: 11.3 },
        ],
        volumes: [70, 16, 66],
        choices: [
          { id: "a", label: "有漲，但跟著的人少", correct: true },
          { id: "b", label: "大家搶著買很熱鬧" },
          { id: "c", label: "中間這根是大跌" },
        ],
        explain: "顏色說上漲，中間的柱子說很安靜。漲了，但人氣不夠旺。",
      },
    ],
  },
  {
    id: "v2",
    chapter: "v",
    title: "上漲要看人",
    blurb: "價漲量增",
    notes: [
      "價漲量增：紅 K 配高柱子，認同的人比較多。",
      "價漲量縮：雖然上漲，跟著的人不多。",
      "人很多但價錢沒走遠，先觀察就好。",
      "人氣足，不代表以後一定繼續漲。",
    ],
    steps: [
      {
        kind: "teach",
        speech: "上漲如果有人跟著，力氣比較足。",
        body: "價漲量增：紅 K，而且柱子高。很多人用行動同意這次上漲。價漲量縮：雖然收紅，柱子卻很矮，像只有幾個人在拍手。入門先記這兩句，不必背更多術語。",
        candles: [
          { o: 10, h: 13, l: 9.8, c: 12.6 },
          { o: 12.4, h: 13, l: 12.2, c: 12.8 },
          { o: 12.6, h: 13.4, l: 12.3, c: 13.1 },
        ],
        volumes: [88, 48, 22],
      },
      {
        kind: "quiz",
        speech: "三根都是紅 K。",
        prompt: "哪一根上漲比較有人氣？",
        candles: [
          { o: 11, h: 14, l: 10.8, c: 13.6 },
          { o: 13.5, h: 13.9, l: 13.2, c: 13.7 },
          { o: 13.6, h: 14.2, l: 13.4, c: 14 },
        ],
        volumes: [84, 48, 20],
        choices: [
          { id: "a", label: "左邊，柱子比較高", correct: true },
          { id: "b", label: "右邊，收盤比較高" },
          { id: "c", label: "三根一樣有人氣" },
        ],
        explain: "三根都是紅 K，但左邊換手多很多。換手就是股票換到另一個人手上。收盤更高不代表人比較多。",
      },
      {
        kind: "quiz",
        speech: "看中間這根小紅 K。",
        prompt: "中間這根，比較接近？",
        candles: [
          { o: 19.2, h: 20.4, l: 18.8, c: 20 },
          { o: 20, h: 20.8, l: 19.6, c: 20.4 },
          { o: 20.3, h: 21.4, l: 20, c: 21 },
        ],
        volumes: [40, 92, 38],
        choices: [
          { id: "a", label: "人很多，價錢沒走遠", correct: true },
          { id: "b", label: "又安靜，又是大漲" },
          { id: "c", label: "這天沒有人交易" },
        ],
        explain: "中間柱子很高代表忙碌，身體很短代表開盤和收盤差不多。人很多，但方向還沒選好。先觀察，不要因為熱鬧就衝。",
      },
      {
        kind: "quiz",
        speech: "連續三天。",
        prompt: "最後一天發生了什麼？",
        candles: [
          { o: 8, h: 9.2, l: 7.8, c: 8.8 },
          { o: 8.8, h: 10, l: 7.8, c: 9.6 },
          { o: 9.7, h: 12.4, l: 9.5, c: 12 },
        ],
        volumes: [30, 40, 85],
        choices: [
          { id: "a", label: "繼續上漲，人變多了", correct: true },
          { id: "b", label: "有上漲，但人變少" },
          { id: "c", label: "最後一天開始大跌" },
        ],
        explain: "最後一天仍是紅 K，柱子更高。這就是價漲量增，認同的人變多。",
      },
      {
        kind: "quiz",
        speech: "看最後一根。",
        prompt: "最後這根紅 K 配高量，可以先說？",
        candles: [
          { o: 14, h: 15.2, l: 13.8, c: 14.8 },
          { o: 14.8, h: 16, l: 14.6, c: 15.6 },
          { o: 15.5, h: 18, l: 14.7, c: 17.6 },
        ],
        volumes: [32, 45, 80],
        choices: [
          { id: "a", label: "上漲有人，力氣比較足", correct: true },
          { id: "b", label: "以後一定每天都大漲" },
          { id: "c", label: "應該把錢全部買完" },
        ],
        explain: "人氣足只代表這一天比較多人同意，不是保證未來。也不要把所有錢一次押上。",
      },
    ],
  },
  {
    id: "v3",
    chapter: "v",
    title: "下跌也看人",
    blurb: "價跌量增要小心",
    notes: [
      "價跌量增：綠 K 配高柱子，想賣的人比較多。",
      "價跌量縮：有跌，但賣的人不多，可能只是休息。",
      "想賣的人很多時，先不要一次買光。",
      "現金留著，也是一種做法。",
    ],
    steps: [
      {
        kind: "teach",
        speech: "跌的時候，也要看忙不忙。",
        body: "價跌量增：綠 K 加上高柱子，很多人急著賣，要小心。價跌量縮：雖然收綠，柱子變矮，賣的人沒有變多，有時只是上漲中間休息。先分清楚這兩種，再決定要不要動作。",
        candles: [
          { o: 18, h: 18.4, l: 14, c: 14.6 },
          { o: 14.6, h: 15, l: 13.8, c: 14.1 },
          { o: 14.2, h: 14.6, l: 13.6, c: 14.4 },
        ],
        volumes: [90, 24, 48],
      },
      {
        kind: "quiz",
        speech: "看中間這根綠 K。",
        prompt: "中間這根大綠 K，最該記住哪句？",
        candles: [
          { o: 21, h: 21.4, l: 20.2, c: 20.6 },
          { o: 22, h: 22.4, l: 16, c: 16.8 },
          { o: 16.6, h: 17, l: 15.8, c: 16.2 },
        ],
        volumes: [40, 93, 36],
        choices: [
          { id: "a", label: "想賣的人多，先別全買", correct: true },
          { id: "b", label: "人越多越要立刻買光" },
          { id: "c", label: "中間這根其實上漲" },
        ],
        explain: "綠 K 配比較高的柱子，常常是很多人急著賣。急著在下跌時全部買進之前，先看清楚。",
      },
      {
        kind: "quiz",
        speech: "上漲之後，出現一根小綠 K。",
        prompt: "中間這根小綠 K，比較像？",
        candles: [
          { o: 10, h: 13, l: 9.8, c: 12.6 },
          { o: 12.6, h: 13.1, l: 11.8, c: 12 },
          { o: 12, h: 12.6, l: 11.6, c: 12.3 },
        ],
        volumes: [78, 26, 52],
        choices: [
          { id: "a", label: "跌一點，賣的人不多", correct: true },
          { id: "b", label: "大家急著全部賣掉" },
          { id: "c", label: "中間的成交量變高" },
        ],
        explain: "中間是綠的，可是柱子明顯變矮。這種價跌量縮，不一定是崩掉，常常只是喘口氣。",
      },
      {
        kind: "quiz",
        speech: "三根都是綠 K。",
        prompt: "哪一根更要小心？",
        candles: [
          { o: 16.4, h: 16.6, l: 15.6, c: 15.8 },
          { o: 16, h: 16.2, l: 15.2, c: 15.4 },
          { o: 16, h: 16.3, l: 12, c: 12.4 },
        ],
        volumes: [36, 22, 88],
        choices: [
          { id: "a", label: "右邊，跌多柱子也高", correct: true },
          { id: "b", label: "左邊，因為比較安靜" },
          { id: "c", label: "三根都該立刻大買" },
        ],
        explain: "右邊跌得多、柱子也高，想賣的人比較多。左邊跌一點、柱子矮，先觀察就好。",
      },
      {
        kind: "quiz",
        speech: "選一個做法。",
        prompt: "看到連續大綠 K 配高量，入門比較穩的是？",
        candles: [
          { o: 20, h: 20.2, l: 17, c: 17.4 },
          { o: 17.3, h: 17.6, l: 14.5, c: 15 },
          { o: 14.9, h: 15.2, l: 13.2, c: 13.6 },
        ],
        volumes: [80, 86, 82],
        choices: [
          { id: "a", label: "先看著，不要一次把錢全部買進", correct: true },
          { id: "b", label: "越跌越把所有零用錢投進去" },
          { id: "c", label: "顏色不重要，只看好不好看" },
        ],
        explain: "現金也是一種答案。等跌勢和大量沒有那麼兇，再慢慢想。這不是叫你永遠不買，是叫你不要急。",
      },
    ],
  },
  {
    id: "v4",
    chapter: "v",
    title: "量價小考",
    blurb: "看圖說一句話",
    boss: true,
    notes: [
      "先看顏色，再看柱子比平常的量高還是矮。",
      "價漲量增，不等於明天一定會漲。",
      "價跌量增時，先別急著全部買進。",
      "小綠 K 又量小，比較像休息。",
      "小考答對至少 3 題，才算達標。",
    ],
    steps: [
      {
        kind: "quiz",
        speech: "小考第 1 題。",
        prompt: "最後一天最像哪句？",
        candles: [
          { o: 11, h: 12, l: 10.6, c: 11.6 },
          { o: 11.6, h: 12.8, l: 11.4, c: 12.4 },
          { o: 12.2, h: 15.2, l: 11.8, c: 14.8 },
        ],
        volumes: [28, 36, 86],
        choices: [
          { id: "a", label: "價漲量增，上漲有人氣", correct: true },
          { id: "b", label: "價跌量增，很多人在賣" },
          { id: "c", label: "這是很安靜的上漲" },
        ],
        explain: "最後一天是紅 K，柱子也高過平常的量。就是價漲量增。",
      },
      {
        kind: "quiz",
        speech: "第 2 題。",
        prompt: "最後一天最像哪句？",
        candles: [
          { o: 18.6, h: 18.8, l: 17.4, c: 17.6 },
          { o: 17.5, h: 17.8, l: 16.2, c: 16.5 },
          { o: 18, h: 18.3, l: 14, c: 14.6 },
        ],
        volumes: [30, 34, 90],
        choices: [
          { id: "a", label: "價跌量增，很多人在賣", correct: true },
          { id: "b", label: "價漲量縮，漲得很冷清" },
          { id: "c", label: "市場很安靜沒什麼人" },
        ],
        explain: "最後一天是綠 K，柱子也高。先小心，別急著全部買。",
      },
      {
        kind: "quiz",
        speech: "看中間這根。",
        prompt: "中間的紅 K 柱子很矮，意思是？",
        candles: [
          { o: 9.2, h: 10.2, l: 9, c: 10 },
          { o: 9, h: 10, l: 8.8, c: 9.8 },
          { o: 9.7, h: 10.4, l: 9.5, c: 10.2 },
        ],
        volumes: [68, 15, 60],
        choices: [
          { id: "a", label: "有漲，但很少人跟著", correct: true },
          { id: "b", label: "大家搶著買，很熱鬧" },
          { id: "c", label: "中間這根是大跌" },
        ],
        explain: "顏色和柱子要一起讀。中間漲了，可是柱子比另外兩天矮，很冷清。",
      },
      {
        kind: "quiz",
        speech: "第 4 題。",
        prompt: "哪一天比較像休息，不是很多人急著賣？",
        candles: [
          { o: 15, h: 16.2, l: 14.6, c: 16 },
          { o: 14, h: 14.4, l: 13.2, c: 13.5 },
          { o: 14, h: 14.2, l: 10.5, c: 11 },
        ],
        volumes: [55, 20, 84],
        choices: [
          { id: "a", label: "中間，小綠而且量小", correct: true },
          { id: "b", label: "右邊，大綠而且量高" },
          { id: "c", label: "三天都是急著賣" },
        ],
        explain: "中間跌一點、柱子矮，比較像喘一口氣。右邊又跌又忙，想賣的人很多。",
      },
      {
        kind: "quiz",
        speech: "最後一題。",
        prompt: "只看成交量，不能確定的是？",
        candles: [
          { o: 11, h: 11.3, l: 10.6, c: 11.1 },
          { o: 11.1, h: 11.4, l: 10.6, c: 11.2 },
          { o: 11.2, h: 11.5, l: 10.8, c: 11.3 },
        ],
        volumes: [28, 78, 30],
        choices: [
          { id: "a", label: "未來一定會漲", correct: true },
          { id: "b", label: "中間這天換手較多" },
          { id: "c", label: "中間這根柱子最高" },
        ],
        explain:
          "中間柱子最高，那天換手比較多。換手就是股票從一個人手上換到另一個人手上。柱子不能保證明天一定會漲，也不能單靠柱子決定紅還是綠。小考結束！",
      },
    ],
  },
  {
    id: "s1",
    chapter: "s",
    title: "甜甜果汁",
    blurb: "上漲裡的休息",
    stock: "甜甜果汁",
    story: "天氣變熱，果汁店的價錢慢慢往上。中間會休息一下。這是假錢，不是叫你真的去買。",
    notes: [
      "買一點會先用大約一半現金。",
      "一半不夠 1 份、但現金夠，就買 1 份。",
      "價跌但柱子變矮，常常只是休息。",
      "不要因為一根小綠 K 就全部賣掉。",
      "這裡的錢是假的，不是叫你真的去買。",
    ],
    grade: gradeJuice,
    days: [
      {
        candle: { o: 10, h: 12.2, l: 9.5, c: 11 },
        volume: 55,
        coach: "第一天。先看顏色，再看柱子高不高。",
        lesson: "紅 K，量中等。上漲剛開始，還不算爆量。",
      },
      {
        candle: { o: 11.1, h: 13.2, l: 10.8, c: 12.6 },
        volume: 82,
        coach: "第二天，人變多了。",
        lesson: "又是紅 K，柱子更高。價漲量增，認同的人變多。",
      },
      {
        candle: { o: 12.5, h: 12.8, l: 11, c: 11.4 },
        volume: 34,
        coach: "第三天轉綠了。先別慌，看柱子。",
        lesson: "綠 K，但量縮小。很多時候這是上漲中的休息，不是很多人急著賣。",
      },
      {
        candle: { o: 11.5, h: 13.6, l: 11.2, c: 13.1 },
        volume: 78,
        coach: "第四天。",
        lesson: "紅 K 配上比較高的量，上漲又熱鬧起來。",
      },
      {
        candle: { o: 13, h: 15, l: 12.7, c: 14.4 },
        volume: 88,
        coach: "第五天走到比較高的地方。",
        lesson: "還是價漲量增。價錢已經比第一天高一截了。",
      },
      {
        candle: { o: 14.3, h: 14.6, l: 13.3, c: 13.7 },
        volume: 48,
        coach: "最後一天，小小休息。",
        lesson: "小綠 K，量普通。上漲後歇一口氣，不代表故事一定結束，但這次練習到這裡。",
      },
    ],
  },
  {
    id: "s2",
    chapter: "s",
    title: "下雨雨傘",
    blurb: "下跌又大量",
    stock: "下雨雨傘",
    story: "連續下雨，雨傘店的價錢往下，而且很多人在賣。看看「先不買」會不會是好答案。",
    notes: [
      "綠 K 配高柱子，想賣的人比較多。",
      "連續下跌時，先看看是比較穩的做法。",
      "不買，也可以是正確答案。",
      "跌到一半就急著買，常常還會再跌。",
    ],
    grade: gradeRain,
    days: [
      {
        candle: { o: 20, h: 20.4, l: 17.6, c: 18.2 },
        volume: 80,
        coach: "開場就是一根比較大的綠 K。",
        lesson: "價跌量增。第一天就有不少人在賣。",
      },
      {
        candle: { o: 18.1, h: 18.3, l: 16, c: 16.4 },
        volume: 84,
        coach: "第二天還在跌，柱子仍然高。",
        lesson: "連續價跌量增。跌到一半就急著買，常常還會再跌。",
      },
      {
        candle: { o: 16.3, h: 16.6, l: 14.5, c: 14.9 },
        volume: 76,
        coach: "第三天。",
        lesson: "還是綠的，量也沒有縮小。想賣的人還沒有變少。",
      },
      {
        candle: { o: 14.8, h: 15.2, l: 13.4, c: 13.8 },
        volume: 70,
        coach: "第四天依然往下。",
        lesson: "方向沒有轉成紅 K。先看看，仍然是一種做法。",
      },
      {
        candle: { o: 13.7, h: 14, l: 12.8, c: 13.1 },
        volume: 60,
        coach: "第五天跌勢慢了一點。",
        lesson: "還是綠 K。量比前幾天小一點，但還沒有變成上漲。",
      },
      {
        candle: { o: 13, h: 13.3, l: 12.2, c: 12.6 },
        volume: 48,
        coach: "最後一天。",
        lesson: "六天都收在開盤下面。這次的功課是：不買，也可以是正確答案。",
      },
    ],
  },
  {
    id: "s3",
    chapter: "s",
    title: "晃晃彈珠",
    blurb: "沒有方向時少動",
    stock: "晃晃彈珠",
    story: "價錢在一個小盒子裡跳來跳去。真實世界買賣還要付手續費，這次先不扣，但你會感覺到忙不一定有用。",
    notes: [
      "價錢在小範圍晃來晃去，叫橫盤。",
      "看不出明確的方向時，少動比較好。",
      "只買沒有賣，不算進進出出。",
      "賣掉一部分，手上還會留著一些。",
      "這次不扣手續費，但忙不一定有用。",
    ],
    grade: gradeMarble,
    days: [
      {
        candle: { o: 16, h: 16.8, l: 15.6, c: 16.3 },
        volume: 40,
        coach: "第一天只是小紅 K，量不高。",
        lesson: "有漲一點點，但看不出明確的方向。",
      },
      {
        candle: { o: 16.3, h: 17.2, l: 16.1, c: 16.9 },
        volume: 44,
        coach: "第二天又高了一點點。",
        lesson: "還在原來的附近晃，柱子也不高。",
      },
      {
        candle: { o: 16.8, h: 16.9, l: 15.4, c: 15.7 },
        volume: 50,
        coach: "第三天掉回去了。",
        lesson: "綠 K 把前兩天漲的又跌回去。這就是橫盤。",
      },
      {
        candle: { o: 15.8, h: 16.8, l: 15.5, c: 16.5 },
        volume: 42,
        coach: "第四天又彈上來。",
        lesson: "紅 K，可是沒有突破一個明顯的新高很多。彈珠彈回來了。",
      },
      {
        candle: { o: 16.4, h: 16.6, l: 15.5, c: 15.8 },
        volume: 38,
        coach: "第五天再縮回去。",
        lesson: "量還是普普通通。沒有價漲量增，也沒有很多人急著賣掉的大量。",
      },
      {
        candle: { o: 15.9, h: 16.5, l: 15.6, c: 16.2 },
        volume: 36,
        coach: "最後一天，幾乎回到起點附近。",
        lesson: "六天忙完，價錢還在 16 元左右。少動，通常比較不白忙。",
      },
    ],
  },
  ...EXTRA_LEVELS,
];

export function levelsIn(chapter: ChapterId) {
  return LEVELS.filter((level) => level.chapter === chapter);
}

export function levelById(id: string) {
  const level = LEVELS.find((item) => item.id === id);
  if (!level) throw new Error(`missing level ${id}`);
  return level;
}

export function nextLevelId(id: string) {
  const index = LEVELS.findIndex((item) => item.id === id);
  return LEVELS[index + 1]?.id ?? null;
}
