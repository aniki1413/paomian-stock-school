import { gradeMaBreakfast } from "./logic";
import type { Level } from "./types";

export const LEVEL_MA5: Level = {
  id: "ma5",
  chapter: "ma",
  title: "早餐車",
  blurb: "跟著路線走",
  notes: [
    "路線轉強、收盤站上均線時，可以練習買一點點。",
    "第五天若只是小綠 K、還在五日線上面，不一定要全部賣掉。"
  ],
  stock: "里長伯早餐車",
  story: "里長伯跟著泡麵爸爸推早餐車，蛋餅和豆漿的價錢每天會變。前面已經走了二十二天，五日線和二十日線都畫在圖上了。I-DEE 把這條路線記在圓肚子裡；OHRU 說，本貓只在收盤走到線上面時才睜眼。接下來還有六天。這是假錢，不是叫你真的去擺攤。",
  simKind: "single",
  history: [
    {
      candle: {
        o: 13.2,
        h: 13.4,
        l: 12.8,
        c: 13.0
      },
      volume: 42
    },
    {
      candle: {
        o: 12.9,
        h: 13.1,
        l: 12.6,
        c: 12.8
      },
      volume: 40
    },
    {
      candle: {
        o: 12.8,
        h: 13.0,
        l: 12.4,
        c: 12.6
      },
      volume: 38
    },
    {
      candle: {
        o: 12.6,
        h: 12.8,
        l: 12.2,
        c: 12.4
      },
      volume: 36
    },
    {
      candle: {
        o: 12.3,
        h: 12.5,
        l: 12.0,
        c: 12.2
      },
      volume: 35
    },
    {
      candle: {
        o: 12.1,
        h: 12.3,
        l: 11.8,
        c: 12.0
      },
      volume: 34
    },
    {
      candle: {
        o: 11.9,
        h: 12.1,
        l: 11.6,
        c: 11.8
      },
      volume: 33
    },
    {
      candle: {
        o: 11.8,
        h: 12.0,
        l: 11.4,
        c: 11.6
      },
      volume: 32
    },
    {
      candle: {
        o: 11.6,
        h: 11.8,
        l: 11.2,
        c: 11.4
      },
      volume: 34
    },
    {
      candle: {
        o: 11.3,
        h: 11.5,
        l: 11.0,
        c: 11.2
      },
      volume: 30
    },
    {
      candle: {
        o: 11.1,
        h: 11.3,
        l: 10.8,
        c: 11.0
      },
      volume: 28
    },
    {
      candle: {
        o: 10.9,
        h: 11.1,
        l: 10.6,
        c: 10.8
      },
      volume: 30
    },
    {
      candle: {
        o: 10.8,
        h: 11.0,
        l: 10.4,
        c: 10.6
      },
      volume: 29
    },
    {
      candle: {
        o: 10.6,
        h: 10.8,
        l: 10.2,
        c: 10.4
      },
      volume: 31
    },
    {
      candle: {
        o: 10.3,
        h: 10.5,
        l: 10.0,
        c: 10.2
      },
      volume: 33
    },
    {
      candle: {
        o: 10.1,
        h: 10.3,
        l: 9.8,
        c: 10.0
      },
      volume: 32
    },
    {
      candle: {
        o: 9.9,
        h: 10.1,
        l: 9.6,
        c: 9.8
      },
      volume: 30
    },
    {
      candle: {
        o: 9.8,
        h: 10.0,
        l: 9.4,
        c: 9.6
      },
      volume: 28
    },
    {
      candle: {
        o: 9.6,
        h: 9.8,
        l: 9.3,
        c: 9.5
      },
      volume: 26
    },
    {
      candle: {
        o: 9.5,
        h: 9.7,
        l: 9.2,
        c: 9.4
      },
      volume: 24
    },
    {
      candle: {
        o: 9.5,
        h: 10.0,
        l: 9.3,
        c: 9.8
      },
      volume: 40
    },
    {
      candle: {
        o: 10.0,
        h: 10.6,
        l: 9.8,
        c: 10.4
      },
      volume: 58
    }
  ],
  days: [
    {
      candle: {
        o: 10.6,
        h: 11.4,
        l: 10.4,
        c: 11.2
      },
      volume: 72,
      coach: "第一天。收盤 11.2，二十日線大約 10.8，五日線大約 10.1 還在下面追。",
      lesson: "紅 K，量變高。價錢已經站回二十日線上面，五日線還在後面趕路。先看，也可以試著買一點點。"
    },
    {
      candle: {
        o: 11.4,
        h: 12.2,
        l: 11.2,
        c: 12.0
      },
      volume: 84,
      coach: "第二天，人更熱鬧了。",
      lesson: "又是紅 K，柱子更高。收盤 12.0，兩條線都還在下面。價漲量增，五日線正在往上追。"
    },
    {
      candle: {
        o: 12.2,
        h: 12.8,
        l: 12.0,
        c: 12.6
      },
      volume: 90,
      coach: "第三天，看兩條線有沒有交叉。",
      lesson: "收盤 12.6。五日線大約 11.2，從下面穿過二十日線大約 10.8。這是可能轉強的提示，不是保證。"
    },
    {
      candle: {
        o: 12.7,
        h: 13.0,
        l: 12.5,
        c: 12.8
      },
      volume: 82,
      coach: "第四天還在上面走。",
      lesson: "紅 K，收盤 12.8，仍然站在兩條線上面。路線沒有立刻說再見。"
    },
    {
      candle: {
        o: 12.7,
        h: 12.9,
        l: 12.2,
        c: 12.4
      },
      volume: 44,
      coach: "第五天轉綠了。先看它有沒有跌破五日線。",
      lesson: "小綠 K，量縮小。收盤 12.4，五日線大約 12.2，還是站在線上面一點點。I-Goose 想追著揮翅膀，邪仔會說：慢慢看，這比較像休息。"
    },
    {
      candle: {
        o: 12.6,
        h: 13.2,
        l: 12.4,
        c: 13.0
      },
      volume: 76,
      coach: "最後一天。",
      lesson: "又是紅 K，收盤 13.0。上漲中的小休息過後，早餐車又往前推了一點。這次練習到這裡。仍是假錢。"
    }
  ],
  grade: gradeMaBreakfast
}
