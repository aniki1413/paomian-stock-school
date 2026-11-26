import { gradeWeekendMarket } from "./logic";
import type { Level } from "./types";

export const LEVEL_MIX5: Level = {
  id: "mix5",
  chapter: "mix",
  title: "週末市集",
  blurb: "兩個攤一起顧",
  notes: [
    "兩個攤都顧一點，比把假錢全押在今天最熱鬧的那一個穩。",
    "現金也是小籃子。",
    "天氣會變，沒有人能先保證哪一邊贏。"
  ],
  stock: "週末市集",
  story: "週末市集開張了。一邊是邪仔的冰品攤，一邊是泡麵的熱湯攤。里長伯幫忙顧帳，里幹事負責看天氣牌子。I-Goose 一看到大太陽，就只想買冰；OHRU 卻說，兩個攤都看過，本貓才睜眼。接下來六天，天氣可能會變。同一天可以兩個攤都操作。這是假錢，不是叫你真的去擺兩個攤。",
  beats: [
    "週末市集開張了。一邊是邪仔的冰品攤，一邊是泡麵的熱湯攤。里長伯幫忙顧帳，里幹事負責看天氣牌子。",
    "I-Goose 一看到大太陽，就只想買冰。OHRU 卻說，兩個攤都看過，本貓才睜眼。",
    "接下來六天，天氣可能會變。同一天可以兩個攤都操作，也可以把現金留著。這是假錢。"
  ],
  simKind: "multi",
  markets: [
    {
      id: "ice",
      name: "邪仔冰品",
      short: "冰品"
    },
    {
      id: "soup",
      name: "泡麵熱湯",
      short: "熱湯"
    }
  ],
  days: [
    {
      weather: "大太陽",
      coach: "第一天大太陽。冰品熱鬧，熱湯比較安靜。",
      lesson: "冰品收紅、量高；熱湯小小收綠。I-Goose 想只買冰。也可以兩個都買一點，或先留下現金。",
      markets: {
        ice: {
          candle: {
            o: 10.0,
            h: 11.6,
            l: 9.9,
            c: 11.2
          },
          volume: 80
        },
        soup: {
          candle: {
            o: 10.0,
            h: 10.3,
            l: 9.6,
            c: 9.8
          },
          volume: 32
        }
      }
    },
    {
      weather: "還是很熱",
      coach: "第二天還是很熱。先別只盯著已經很熱鬧的那一個。",
      lesson: "冰品繼續價漲量增，熱湯仍偏弱。越熱越想追冰時，更要記得另一個攤和口袋裡的現金。",
      markets: {
        ice: {
          candle: {
            o: 11.2,
            h: 12.5,
            l: 11.0,
            c: 12.2
          },
          volume: 86
        },
        soup: {
          candle: {
            o: 9.8,
            h: 10.0,
            l: 9.3,
            c: 9.5
          },
          volume: 30
        }
      }
    },
    {
      weather: "熱到最高",
      coach: "第三天熱到最高。冰品很甜，可是規則還沒變：不要全押同一邊。",
      lesson: "冰品又收在更高的地方，熱湯還在安靜。越熱鬧越不一定要再把剩下的現金全部加進去。",
      markets: {
        ice: {
          candle: {
            o: 12.2,
            h: 13.0,
            l: 12.0,
            c: 12.6
          },
          volume: 78
        },
        soup: {
          candle: {
            o: 9.5,
            h: 9.7,
            l: 9.1,
            c: 9.3
          },
          volume: 28
        }
      }
    },
    {
      weather: "午後突然變天，下起雨、轉涼",
      coach: "第四天變天了。看看兩個攤有沒有換人熱鬧。",
      lesson: "冰品出現大綠 K 配高量，熱湯反而價漲量增。天氣一變，剛才最亮的攤不一定還最亮。",
      markets: {
        ice: {
          candle: {
            o: 12.5,
            h: 12.6,
            l: 10.6,
            c: 11.0
          },
          volume: 90
        },
        soup: {
          candle: {
            o: 9.3,
            h: 10.8,
            l: 9.2,
            c: 10.6
          },
          volume: 82
        }
      }
    },
    {
      weather: "連日下雨",
      coach: "第五天還在下雨。熱湯繼續忙，冰品繼續淡。",
      lesson: "現在換熱湯比較熱鬧。如果剛才只顧著冰，這時會比較難過；如果兩邊都有、還留著現金，晃動會小一點。",
      markets: {
        ice: {
          candle: {
            o: 10.9,
            h: 11.0,
            l: 9.8,
            c: 10.2
          },
          volume: 70
        },
        soup: {
          candle: {
            o: 10.6,
            h: 11.4,
            l: 10.4,
            c: 11.2
          },
          volume: 80
        }
      }
    },
    {
      weather: "雨勢變小，天氣仍涼",
      coach: "最後一天，雨小了，可是還是涼的。",
      lesson: "熱湯仍在均勢上面一點，冰品又淡了一些。沒有人能在第一天就保證哪一個攤會贏。這次練習到這裡，仍是假錢。",
      markets: {
        ice: {
          candle: {
            o: 10.2,
            h: 10.4,
            l: 9.2,
            c: 9.6
          },
          volume: 54
        },
        soup: {
          candle: {
            o: 11.2,
            h: 11.8,
            l: 11.0,
            c: 11.5
          },
          volume: 66
        }
      }
    }
  ],
  grade: gradeWeekendMarket
}
