import type { Candle, Grade, SimGradeInput } from "./types";

export const START_CASH = 100;

export function isUp(c: Candle) {
  return c.c > c.o;
}

export function isDown(c: Candle) {
  return c.c < c.o;
}

export function yuan(n: number) {
  return n.toLocaleString("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export function starsForQuiz(correct: number, total: number): 1 | 2 | 3 {
  if (total <= 0) return 3;
  const ratio = correct / total;
  if (ratio >= 0.999) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

export function quizPoints(correctFlags: boolean[]) {
  let combo = 0;
  let points = 0;
  let best = 0;
  for (const ok of correctFlags) {
    if (ok) {
      combo += 1;
      best = Math.max(best, combo);
      points += 100 + (combo - 1) * 40;
    } else {
      combo = 0;
    }
  }
  return { points, best };
}

export type Portfolio = {
  cash: number;
  shares: number;
};

export type TradeResult = Portfolio & {
  bought: number;
  sold: number;
  note: string;
};

function money(n: number) {
  return Math.round(n * 100) / 100;
}

export function trade(
  state: Portfolio,
  action: "buy" | "hold" | "sell" | "sellAll",
  price: number,
): TradeResult {
  if (action === "buy") {
    const half = Math.floor((state.cash * 0.5) / price);
    const n = half >= 1 ? half : state.cash >= price ? 1 : 0;
    if (n < 1) {
      return {
        ...state,
        bought: 0,
        sold: 0,
        note: `一份要 ${yuan(price)} 元，你現在只有 ${yuan(state.cash)} 元，所以今天買不了。`,
      };
    }
    const cost = money(n * price);
    const cash = money(state.cash - cost);
    return {
      cash,
      shares: state.shares + n,
      bought: n,
      sold: 0,
      note: `買進 ${n} 份，花了 ${yuan(cost)} 元。還剩下 ${yuan(cash)} 元。`,
    };
  }
  if (action === "sell" || action === "sellAll") {
    if (state.shares <= 0) {
      return { ...state, bought: 0, sold: 0, note: "還沒有股票可以賣，就先看看。" };
    }
    const n = action === "sellAll" ? state.shares : Math.max(1, Math.ceil(state.shares / 2));
    const got = money(n * price);
    const left = state.shares - n;
    return {
      cash: money(state.cash + got),
      shares: left,
      bought: 0,
      sold: n,
      note:
        left === 0
          ? `全部賣掉 ${n} 份，拿回 ${yuan(got)} 元。`
          : `賣掉一部分，${n} 份，拿回 ${yuan(got)} 元。還留著 ${left} 份。`,
    };
  }
  return { ...state, bought: 0, sold: 0, note: "今天先看看，現金和股票都沒有動。" };
}

export function equity(state: Portfolio, price: number) {
  return money(state.cash + state.shares * price);
}

function sellPhrase(input: SimGradeInput) {
  if (input.sellCount <= 0) return "none" as const;
  if (input.sharesLeft <= 0) return "all" as const;
  return "part" as const;
}

export function gradeJuice(input: SimGradeInput): Grade {
  const gain = input.equity / input.start;
  const dumpedDip = input.actions[2] === "sell";
  const sold = sellPhrase(input);
  const dip =
    !dumpedDip
      ? ""
      : sold === "all"
        ? "第三天你把股票全部賣掉了。"
        : "第三天你只賣掉一部分，還沒有全部出清。";
  if (gain >= 1.08) {
    return {
      stars: 3,
      title: "跟上漲勢",
      comment: dumpedDip
        ? `${dip}後來的上漲還是有跟上。價跌但量變小，常常只是休息，不一定要出清。`
        : "甜甜果汁整體往上。你沒有被中間那根小綠 K 嚇跑，這就是價跌量縮時可以先抱著看看。",
    };
  }
  if (gain >= 1.01) {
    return {
      stars: 2,
      title: "有甜到一點",
      comment: dumpedDip
        ? `${dip}有賺到一些，但休息那天賣出後，少吃到後面那截。`
        : "有賺到一些。上漲的路上會休息，休息時成交量常常變小，不一定要全部賣掉。",
    };
  }
  if (input.buyCount === 0) {
    return {
      stars: 1,
      title: "果汁跑掉了",
      comment: "這段故事整體是上漲。你都沒有買，也很安全，但也會錯過果汁店漲上去。可以試著先買一點點。",
    };
  }
  return {
    stars: 1,
    title: "果汁跑掉了",
    comment:
      sold === "all"
        ? "你把買過的股票全部賣掉了。第三天是綠 K，但柱子比較矮，那一下全部賣光，會錯過後面的上漲。"
        : sold === "part"
          ? "你有賣掉一部分，手上還留著一些。綠 K 但柱子變矮時，常常只是休息。"
          : "你有買，而且沒有賣。這段如果沒跟上漲勢，可以再看中間那根小綠 K，它常常只是休息。",
  };
}
