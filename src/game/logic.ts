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

export function gradeRain(input: SimGradeInput): Grade {
  const gain = input.equity / input.start;
  const sold = sellPhrase(input);
  if (input.buyCount === 0) {
    return {
      stars: 3,
      title: "傘先收著",
      comment: "一路綠 K 又大量，是很多人急著賣。你沒有買，把現金留著，不買也是正確答案。",
    };
  }
  if (gain >= 0.92) {
    return {
      stars: 2,
      title: "只淋到小雨",
      comment:
        sold === "all"
          ? "你有買，後來又全部賣掉。下跌又大量時，少買、或先不買，會比較穩。"
          : sold === "part"
            ? "你有買一點，也賣掉一部分，手上還留著一些。下跌又大量時，先少買、或先不買。"
            : "你有買一點，而且都沒有賣。沒有把假錢全部投進去。下跌又大量時，先少買、或先不買。",
    };
  }
  return {
    stars: 1,
    title: "雨有點大",
    comment:
      sold === "none"
        ? "你只買沒有賣。連續下跌而且柱子很高，代表很多人在賣。下次可以多按「先看看」，現金也是一種持有。"
        : sold === "part"
          ? "你賣掉一部分，手上還留著一些。連續下跌而且柱子很高，代表很多人在賣。下次可以多按「先看看」。"
          : "你後來把買過的股票全部賣掉了。連續下跌而且柱子很高，代表很多人在賣。下次可以先不要買。",
  };
}

export function gradeMarble(input: SimGradeInput): Grade {
  const gain = input.equity / input.start;
  const busy = input.buyCount + input.sellCount;
  const sold = sellPhrase(input);
  const roundTrip = input.buyCount > 0 && input.sellCount > 0;
  const cashLeft = input.cashLeft;
  const cashThin =
    input.buyCount > 0 && sold === "none" && cashLeft !== undefined && cashLeft <= input.start * 0.3;
  if (busy <= 2 && gain >= 0.97 && !roundTrip) {
    return {
      stars: 3,
      title: "彈珠看久一點",
      comment: cashThin
        ? `價錢在小區間跳、看不出明確的方向。你只買沒有賣，可是口袋只剩 ${yuan(cashLeft ?? 0)} 元，幾乎都換成彈珠了。`
        : input.buyCount === 0
          ? "價錢在小區間跳、看不出明確的方向。你幾乎沒有買賣，這就是橫盤時的好習慣。"
          : "價錢在小區間跳、看不出明確的方向。你只買沒有賣，沒有進進出出。",
    };
  }
  if (busy <= 2 && gain >= 0.97 && roundTrip) {
    return {
      stars: 3,
      title: "彈珠看久一點",
      comment:
        sold === "part"
          ? "價錢在小區間跳。你有賣掉一部分，手上還留著一些，沒有忙著全部進出。"
          : "價錢在小區間跳。你最後把股票全部賣掉了。動作還不多，橫盤時可以再更少動一點。",
    };
  }
  if (gain >= 0.97) {
    if (cashThin) {
      return {
        stars: 2,
        title: "現金快見底了",
        comment: `你只買沒有賣，不是進進出出。可是口袋只剩 ${yuan(cashLeft ?? 0)} 元，假錢幾乎都換成彈珠了。橫盤時少買一點，現金也可以留著。`,
      };
    }
    return {
      stars: 2,
      title: "錢還在口袋",
      comment: roundTrip
        ? sold === "part"
          ? "資產差不多守住了。你有賣掉一部分，還留著一些。橫盤時這樣來回，真實世界還有手續費，更不划算。"
          : "資產差不多守住了。你把買過的股票全部賣掉了。橫盤時進進出出很忙，真實世界還有手續費。"
        : "資產差不多守住了。你只買沒有賣，不是進進出出。橫盤時少買一點也很好。",
    };
  }
  return {
    stars: 1,
    title: "追著彈珠跑",
    comment: cashThin
      ? `你只買沒有賣，口袋只剩 ${yuan(cashLeft ?? 0)} 元。價錢上下晃、看不出方向時，一直買很容易把現金用完。下次多按「先看看」。`
      : sold === "none"
        ? "你只買沒有賣。價錢上下晃、看不出方向時，一直買很容易把錢買少。下次多按「先看看」。"
        : sold === "part"
          ? "你賣掉一部分，手上還留著一些。看不出方向時來回做，容易把錢晃少。下次多按「先看看」。"
          : "你買了又全部賣掉。看不出方向時忙著進出，容易把錢晃少。下次多按「先看看」。",
  };
}

export function gradeMaBreakfast(input: SimGradeInput): Grade {
  const grade = gradeBreakfastPath(input);
  if (input.minCash === undefined || input.minCash >= input.start * 0.3) return grade;
  const tip = "不要一次把錢全部買完。";
  if (grade.title === "跟著路線走") {
    return {
      stars: 2,
      title: "有上車，但錢放太滿",
      comment: grade.comment.startsWith(tip) ? grade.comment : `${tip}${grade.comment}`,
    };
  }
  return {
    stars: grade.stars === 3 ? 2 : grade.stars,
    title: grade.title,
    comment: grade.comment.includes(tip) ? grade.comment : `${grade.comment}${tip}`,
  };
}

function gradeBreakfastPath(input: SimGradeInput): Grade {
  const t = input.equity / input.start;
  const boughtEarly = input.actions.slice(0, 3).includes("buy");
  const soldOnRest = input.actions[4] === "sell";
  const soldOnCross = input.actions[2] === "sell";
  if (input.buyCount === 0) {
    return {
      stars: 1,
      title: "車推走了",
      comment: "早餐車後面這段整體往上。一直觀望很安全，也可以在收盤站上均線、路線轉強時，試著先買一點點。",
    };
  }
  if (boughtEarly && !soldOnRest && !soldOnCross && t >= 1) {
    return {
      stars: 3,
      title: "跟著路線走",
      comment: "你在路線轉強的時候有上車，第五天那根小綠 K 也沒有把你嚇跑。收盤還在五日線上面時，休息不一定要全部賣掉。",
    };
  }
  if (t >= 1) {
    return {
      stars: 2,
      title: "有吃到蛋餅",
      comment:
        soldOnRest || soldOnCross
          ? "有賺到一些，可是在交叉或休息的那天賣掉，會少吃後面那截。提示轉強時，可以先抱著看看。"
          : "有跟上一部分。路線轉強時愈早練習買一點，愈容易吃到蛋餅的香味。",
    };
  }
  return {
    stars: 1,
    title: "路線還在，人先下車了",
    comment: "這段故事後面是往上的。如果在小休息或剛交叉時就把假錢賣光，容易錯過早餐車往前推。下次可以多按「先看看」。",
  };
}

export function gradeStickerStall(input: SimGradeInput): Grade {
  const buysAfterBreak = input.actions.slice(3).includes("buy");
  // 第 4 天（index 3）收盤跌破 8.5：那天結束時手上已經沒有股票，才算照約定離開。
  // 只看 fullExit[3]，避免「還沒買之前本來就 0 份」被誤算成已經離開。
  const exits = input.fullExit ?? [];
  const leftInTime = input.sellCount > 0 && exits[3] === true;
  const followed = input.buyCount > 0 && !buysAfterBreak && leftInTime;
  if (followed) {
    return {
      stars: 3,
      title: "說好就照著做",
      comment:
        "你照約定離開，小虧比大虧好。停損 8.5、停利 12 是出發前就說好的。跌破以後沒有再加碼，假錢的傷被停在比較小的地方。這仍是假錢，不是保證每次都這樣。",
    };
  }
  if (input.buyCount === 0) {
    return {
      stars: 2,
      title: "假錢還在口袋",
      comment: "現金留著很安全，撲滿沒有受傷。不過這次想練習的是離開的方法，下次可以買一點點，漲到 12 先收、跌破 8.5 就全部離開。",
    };
  }
  if (buysAfterBreak) {
    return {
      stars: 1,
      title: "跌破還加碼",
      comment:
        "價格已經跌破 8.5 還繼續買，小傷容易變大傷。照約定離開的人，虧得比一直抱著、或跌破還加碼的人少。下次看到停損就按「全部賣掉」。",
    };
  }
  if (input.sellCount === 0) {
    return {
      stars: 1,
      title: "一直抱到最後",
      comment: "一路拿到最後都沒有離開，跌破 8.5 之後還在往下。照約定在跌破時全部賣掉，虧得會少一截。小虧比大虧好。",
    };
  }
  const leftLate = (input.fullExit ?? []).slice(4).some(Boolean);
  return {
    stars: 2,
    title: "有用到離開的方法",
    comment: leftLate
      ? "你後來有把剩下的賣掉，方向對了。如果在剛跌破 8.5 的那天就全部離開，傷會更小。小虧比大虧好。"
      : "你有賣掉一部分。如果還留著、又跌破 8.5，可以按「全部賣掉」一次離開，不必只賣一半。",
  };
}

export function gradeWeekendMarket(input: SimGradeInput): Grade {
  const types = new Set(input.boughtTypes ?? []);
  const boughtBoth = types.has("ice") && types.has("soup");
  const onlyIce = types.has("ice") && !types.has("soup");
  const onlySoup = types.has("soup") && !types.has("ice");
  const heldEarly = input.heldBothBeforeChange === true;
  return withMarketEnding(gradeWeekendBody(input, { boughtBoth, onlyIce, onlySoup, heldEarly }));
}

function withMarketEnding(grade: Grade): Grade {
  const ending = "你已經把小學堂的新關卡走完一輪了。";
  if (grade.comment.includes(ending)) return grade;
  return { ...grade, comment: `${grade.comment}${ending}` };
}

function gradeWeekendBody(
  input: SimGradeInput,
  flags: { boughtBoth: boolean; onlyIce: boolean; onlySoup: boolean; heldEarly: boolean },
): Grade {
  if (input.buyCount === 0) {
    return {
      stars: 2,
      title: "現金小籃子還在",
      comment: "假錢都留在口袋，沒有被天氣晃到，這也是一種答案。不過這次想練習的是變天前兩個攤都先顧一點。",
    };
  }
  if (flags.heldEarly) {
    return {
      stars: 3,
      title: "兩個攤都顧到了",
      comment:
        "變天以前，冰品和熱湯你都有拿著。這才是分散，不是等天氣揭曉再換邊。這次熱湯後來比較甜、冰品比較淡，出發前沒有人能先知道。假錢練習，不是保證每次分散都賺最多。OHRU 會睜一眼。",
    };
  }
  if (input.chasedWeather) {
    return {
      stars: 2,
      title: "等天氣揭曉才換邊",
      comment: "這是猜天氣，不是分散。變天以後才把兩個攤都補上，是追著天氣跑。要在變天前就兩邊都有一點，才算把雞蛋分開放。",
    };
  }
  if (flags.onlyIce) {
    return {
      stars: 1,
      title: "I-Goose 被大太陽曬得直搧翅膀",
      comment: "大太陽時只顧著冰品，變天以後假錢會一起被晃到。下次兩個攤都看過再決定，現金也可以留一點。",
    };
  }
  if (flags.onlySoup) {
    return {
      stars: 2,
      title: "這次剛好是熱湯",
      comment: "熱湯這次漲了，假錢有變多或守得還可以。可是如果天氣一直熱下去，只顧熱湯會跟這次的冰品一樣難過。下次變天前兩個攤都練看看。",
    };
  }
  if (flags.boughtBoth) {
    return {
      stars: 2,
      title: "有試著分開放",
      comment: "兩個攤都碰過，可是變天前沒有同時拿在手上。要在天氣揭曉前兩邊都還在，才算這次要練的分散。現金也可以留一點。",
    };
  }
  return {
    stars: 1,
    title: "籃子還有點斜",
    comment: "分散不是為了追今天最亮的那個攤。下次可以在變天前一邊買一點、一邊留一點現金。",
  };
}
