export type Candle = {
  o: number;
  h: number;
  l: number;
  c: number;
};

export type BuddyId = "dad" | "mom" | "lizhang" | "ligan" | "ohru" | "idee" | "goose";

export type ChapterId = "k" | "v" | "s" | "ma" | "stop" | "mix";

export type QuizChoice = {
  id: string;
  label: string;
  correct?: boolean;
};

export type PriceLine = {
  price: number;
  label: string;
};

export type ChartPanel = {
  title: string;
  candles: Candle[];
  volumes?: number[];
};

export type TeachStep = {
  kind: "teach";
  speech: string;
  body: string;
  candles?: Candle[];
  volumes?: number[];
  guide?: boolean;
  ma5?: Array<number | null>;
  ma20?: Array<number | null>;
  lines?: PriceLine[];
  panels?: ChartPanel[];
};

export type QuizStep = {
  kind: "quiz";
  speech: string;
  prompt: string;
  candles?: Candle[];
  volumes?: number[];
  /** color = 紅K/綠K/十字；place = 左/中/右，避免把答案寫在圖下。 */
  caption?: "color" | "place";
  ma5?: Array<number | null>;
  ma20?: Array<number | null>;
  lines?: PriceLine[];
  panels?: ChartPanel[];
  choices: QuizChoice[];
  explain: string;
};

export type Step = TeachStep | QuizStep;

export type SingleSimDay = {
  candle: Candle;
  volume: number;
  coach: string;
  lesson: string;
};

export type SimMarket = {
  id: string;
  name: string;
  short: string;
};

export type MultiSimDay = {
  weather: string;
  coach: string;
  lesson: string;
  markets: Record<string, { candle: Candle; volume: number }>;
};

export type HistoryBar = {
  candle: Candle;
  volume: number;
};

export type SimGradeInput = {
  start: number;
  equity: number;
  buyCount: number;
  sellCount: number;
  sharesLeft: number;
  actions: Array<"buy" | "hold" | "sell" | "sellAll">;
  boughtTypes?: string[];
  /** 這次模擬裡現金最少剩下多少。超過七成投出去時用。 */
  minCash?: number;
  cashLeft?: number;
  /** 每一天結束時是否已經全部賣掉。 */
  fullExit?: boolean[];
  /** 變天前兩個攤都還握著。 */
  heldBothBeforeChange?: boolean;
  /** 變天後才把另一個攤補上，屬於追著天氣跑。 */
  chasedWeather?: boolean;
};

export type Grade = {
  stars: 1 | 2 | 3;
  title: string;
  comment: string;
};

export type QuizLevel = {
  id: string;
  chapter: ChapterId;
  title: string;
  blurb: string;
  boss?: boolean;
  notes: string[];
  steps: Step[];
};

type SimShared = {
  id: string;
  chapter: ChapterId;
  title: string;
  blurb: string;
  stock: string;
  story: string;
  notes: string[];
  grade: (input: SimGradeInput) => Grade;
  lines?: PriceLine[];
  beats?: string[];
};

export type SingleSimLevel = SimShared & {
  simKind?: "single";
  days: SingleSimDay[];
  history?: HistoryBar[];
};

export type MultiSimLevel = SimShared & {
  simKind: "multi";
  markets: SimMarket[];
  days: MultiSimDay[];
};

export type SimLevel = SingleSimLevel | MultiSimLevel;

export type Level = QuizLevel | SimLevel;

export type LevelScore = {
  stars: number;
  points: number;
};

export type Miss = {
  levelId: string;
  step: number;
};

export type SaveV1 = {
  version: 1;
  buddy: BuddyId;
  muted: boolean;
  levels: Record<string, LevelScore>;
  misses?: Miss[];
};
