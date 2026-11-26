import { gradeMaBreakfast, gradeStickerStall, gradeWeekendMarket } from "./logic";
import type { Level } from "./types";

/** 均線、停損停利、分散投資。文字與數字來自新關卡稿，不要手改正解。 */
export const EXTRA_LEVELS: Level[] = [
{
  id: "ma1",
  chapter: "ma",
  title: "抹平腳印",
  blurb: "均線怎麼來",
  notes: [
    "均線＝最近幾天收盤價的平均。",
    "它把跳動抹平，比較容易看出方向。"
  ],
  steps: []
}
];
