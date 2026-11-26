import type { Level } from "./types";

export const LEVEL_MIX4: Level = {
  id: "mix4",
  chapter: "mix",
  title: "分散小考",
  blurb: "最後一次小考",
  boss: true,
  notes: [
    "別把全部放同一種。",
    "要配比較不會一起動的。",
    "現金也是小籃子。",
    "分散不是保證。"
  ],
  steps: [
    {
      kind: "quiz",
      speech: "小考第 1 題。",
      prompt: "把撲滿裡的假錢全部換成同一種東西，最像？",
      choices: [
        {
          id: "a",
          label: "蛋都放在同一個籃子裡",
          correct: true
        },
        {
          id: "b",
          label: "最確實的分散"
        },
        {
          id: "c",
          label: "一定比留下現金更安全"
        }
      ],
      explain: "全部集中，一來打擊就全中。這是這一章最想先記住的畫面。"
    },
    {
      kind: "quiz",
      speech: "第 2 題。一張是冰品，另一張是熱湯。",
      prompt: "為什麼這兩個攤放在一起，比較有分散的味道？",
      choices: [
        {
          id: "a",
          label: "天氣一變，兩邊常常不會一起走",
          correct: true
        },
        {
          id: "b",
          label: "兩個攤擺在一起，風險就消失"
        },
        {
          id: "c",
          label: "以後兩邊一定會一起上漲"
        }
      ],
      explain: "變天後冰品往下、熱湯往上，是「不一樣」的例子。沒有人保證下次還是這樣，可是它們比較不是同一掛。",
      panels: [
        {
          title: "冰品",
          candles: [
            { o: 10.0, h: 11.6, l: 9.9, c: 11.2 },
            { o: 11.2, h: 12.5, l: 11.0, c: 12.2 },
            { o: 12.2, h: 13.0, l: 12.0, c: 12.6 },
            { o: 12.5, h: 12.6, l: 10.6, c: 11.0 },
            { o: 10.9, h: 11.0, l: 9.8, c: 10.2 },
            { o: 10.2, h: 10.4, l: 9.2, c: 9.6 }
          ],
          volumes: [80, 86, 78, 90, 70, 54]
        },
        {
          title: "熱湯",
          candles: [
            { o: 10.0, h: 10.3, l: 9.6, c: 9.8 },
            { o: 9.8, h: 10.0, l: 9.3, c: 9.5 },
            { o: 9.5, h: 9.7, l: 9.1, c: 9.3 },
            { o: 9.3, h: 10.8, l: 9.2, c: 10.6 },
            { o: 10.6, h: 11.4, l: 10.4, c: 11.2 },
            { o: 11.2, h: 11.8, l: 11.0, c: 11.5 }
          ],
          volumes: [32, 30, 28, 82, 80, 66]
        }
      ]
    },
    {
      kind: "quiz",
      speech: "第 3 題。",
      prompt: "買了好多種，但它們都會因為同一件事一起跌。這算什麼？",
      choices: [
        {
          id: "a",
          label: "看起來分散，其實還不夠",
          correct: true
        },
        {
          id: "b",
          label: "已經是最完美的分散"
        },
        {
          id: "c",
          label: "比只買一種更危險，所以不該分散"
        }
      ],
      explain: "要問會不會一起動，不要只數有幾種名字。分散得不夠，不代表分散這個想法是錯的。"
    },
    {
      kind: "quiz",
      speech: "第 4 題。",
      prompt: "口袋裡留下一部分現金，最正確的說法是？",
      choices: [
        {
          id: "a",
          label: "現金也是小籃子，變化來時比較有退路",
          correct: true
        },
        {
          id: "b",
          label: "留下現金就不算認真練習"
        },
        {
          id: "c",
          label: "現金一定會自己慢慢長大"
        }
      ],
      explain: "現金不會自己變多，可是它比較穩，也能讓你下次還有選擇。認真與否，不看你有沒有全押。"
    },
    {
      kind: "quiz",
      speech: "最後一題。",
      prompt: "學會分散以後，哪一句最老實？",
      choices: [
        {
          id: "a",
          label: "打擊比較不會打中全部，但不是保證賺錢",
          correct: true
        },
        {
          id: "b",
          label: "從今以後就再也不會虧了"
        },
        {
          id: "c",
          label: "應該立刻用真正的零用錢照著買"
        }
      ],
      explain: "分散是保護，不是保證，更不是現在就去買真的股票的理由。小考結束！"
    }
  ]
}
