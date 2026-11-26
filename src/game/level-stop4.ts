import type { Level } from "./types";

export const LEVEL_STOP4: Level = {
  id: "stop4",
  chapter: "stop",
  title: "離開方法小考",
  blurb: "畢業才能去下一章",
  boss: true,
  notes: [
    "買之前說好停損和停利。",
    "心跳快時先看規則。",
    "小傷先停，甜了先收一點。"
  ],
  steps: [
    {
      kind: "quiz",
      speech: "小考第 1 題。",
      prompt: "哪一件事應該在買進以前就先決定？",
      choices: [
        {
          id: "a",
          label: "先決定停損和停利的位置",
          correct: true
        },
        {
          id: "b",
          label: "先猜明天開盤一定多高"
        },
        {
          id: "c",
          label: "先把真的零用錢一次押上"
        }
      ],
      explain: "離開的方法要先想好。沒有人能先知道明天開多高。這裡只用假錢，不要把真正的零用錢一次押上。"
    },
    {
      kind: "quiz",
      speech: "第 2 題。左邊小綠、量小；右邊大綠、量大。",
      prompt: "出發前停損設在 8.5 元。哪一天比較接近「該看看規則了」？",
      choices: [
        {
          id: "a",
          label: "右邊，收盤已經跌破 8.5 元",
          correct: true
        },
        {
          id: "b",
          label: "左邊，因為它比較早出現"
        },
        {
          id: "c",
          label: "兩天都還不必看規則"
        }
      ],
      explain: "右邊這根收盤 8.3，已經低於 8.5，又是價跌量增。這就是規則要派上用場的時候。左邊那根只是小休息。",
      candles: [
        {
          o: 11.1,
          h: 11.3,
          l: 9.7,
          c: 9.9
        },
        {
          o: 11.0,
          h: 11.1,
          l: 8.0,
          c: 8.3
        }
      ],
      volumes: [
        36,
        92
      ],
      lines: [
        {
          price: 8.5,
          label: "停損 8.5"
        }
      ]
    },
    {
      kind: "quiz",
      speech: "第 3 題。",
      prompt: "已經漲到停利價，卻把規則改成「再等更高」，最像哪種心情？",
      choices: [
        {
          id: "a",
          label: "貪心，想把已經很甜的全部留著",
          correct: true
        },
        {
          id: "b",
          label: "這是冷靜的停損"
        },
        {
          id: "c",
          label: "這叫分散投資"
        }
      ],
      explain: "想再多拿一點，是很常見的心情。所以才要在平靜時先說好：甜了，先收一部分。",
      candles: [
        {
          o: 10.0,
          h: 12.6,
          l: 9.8,
          c: 12.3
        }
      ],
      volumes: [
        88
      ]
    },
    {
      kind: "quiz",
      speech: "第 4 題。",
      prompt: "做了一次小小的停損以後，比較正確的想法是？",
      choices: [
        {
          id: "a",
          label: "撲滿還在，小傷比較好醫，以後還能再練習",
          correct: true
        },
        {
          id: "b",
          label: "停損過一次就永遠不要再練習了"
        },
        {
          id: "c",
          label: "一定要把輸掉的假錢在下一根 K 棒全部賺回來"
        }
      ],
      explain: "停損不是結束遊戲，是讓遊戲可以繼續。急著一次賺回來，常常讓傷變更大。"
    },
    {
      kind: "quiz",
      speech: "最後一題。",
      prompt: "為什麼要在買之前就先想好停損？",
      choices: [
        {
          id: "a",
          label: "心跳很快時，才不會臨時改掉",
          correct: true
        },
        {
          id: "b",
          label: "想好以後，價錢就不會再跌"
        },
        {
          id: "c",
          label: "訂好停損，這次就一定會賺"
        }
      ],
      explain: "停損是寫給心跳很快的自己。先說好跌到哪裡離開，才不會臨時把線往下挪。它不能保證不跌，也不能保證賺錢。小考結束！這仍是假錢。"
    }
  ]
}
