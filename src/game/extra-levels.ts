import type { Level } from "./types";
import { LEVEL_MA1 } from "./level-ma1";
import { LEVEL_MA2 } from "./level-ma2";
import { LEVEL_MA3 } from "./level-ma3";
import { LEVEL_MA4 } from "./level-ma4";
import { LEVEL_MA5 } from "./level-ma5";
import { LEVEL_STOP1 } from "./level-stop1";
import { LEVEL_STOP2 } from "./level-stop2";
import { LEVEL_STOP3 } from "./level-stop3";
import { LEVEL_STOP4 } from "./level-stop4";
import { LEVEL_STOP5 } from "./level-stop5";
import { LEVEL_MIX1 } from "./level-mix1";
import { LEVEL_MIX2 } from "./level-mix2";
import { LEVEL_MIX3 } from "./level-mix3";
import { LEVEL_MIX4 } from "./level-mix4";
import { LEVEL_MIX5 } from "./level-mix5";

/** 均線、停損停利、分散投資。文字與數字來自新關卡稿，不要手改正解。 */
export const EXTRA_LEVELS: Level[] = [
  LEVEL_MA1,
  LEVEL_MA2,
  LEVEL_MA3,
  LEVEL_MA4,
  LEVEL_MA5,
  LEVEL_STOP1,
  LEVEL_STOP2,
  LEVEL_STOP3,
  LEVEL_STOP4,
  LEVEL_STOP5,
  LEVEL_MIX1,
  LEVEL_MIX2,
  LEVEL_MIX3,
  LEVEL_MIX4,
  LEVEL_MIX5
];
