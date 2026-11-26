/**
 * 贊助商推播設定。
 * 以後要換廣告、改多久推一次，只改這個檔案就好。
 *
 * 這是給小朋友和初學者的遊戲，請遵守：
 * - 不可以放投資商品、借貸或賭博類廣告。
 * - 不可以收集任何玩家個人資料。
 * - 廣告不可以自動跳去外部網站。「了解更多」會先問過，再用新分頁打開。
 *
 * 推播週期 cadence：
 * - { kind: "every" }                 每次按「開始闖關／繼續闖關」都推
 * - { kind: "daily" }                 每個日曆日最多一次
 * - { kind: "everyNDays", days: 3 }   距離上次至少 3 天
 * - { kind: "everyNStarts", starts: 3 } 每按開始 3 次推一次
 * - { kind: "off" }                   關閉
 *
 * 有效期間用 YYYY-MM-DD，含開始日與結束日。不填表示不限制。
 * 網址加 ?adtest=1 會立刻推播，而且不會改掉真正的推播紀錄。
 */

export type SponsorCadence =
  | { kind: "every" }
  | { kind: "daily" }
  | { kind: "everyNDays"; days: number }
  | { kind: "everyNStarts"; starts: number }
  | { kind: "off" };

export type SponsorAd = {
  id: string;
  /** 贊助商名稱。測試用請寫「示範贊助商」。 */
  sponsor: string;
  title: string;
  body: string;
  /** 站內圖片，例如 "/family.jpg"。可省略。 */
  image?: string;
  /** 影片網址，mp4 / webm，或 YouTube 連結。可省略。不會自動跳走。 */
  videoUrl?: string;
  /** 「了解更多」。可省略。開啟前會先確認，並用新分頁。 */
  link?: string;
  /** 倒數秒數。倒數結束才出現「繼續遊戲」。 */
  seconds: number;
};

export type SponsorConfig = {
  cadence: SponsorCadence;
  /** 含這一天。例如 "2026-11-01"。 */
  activeFrom?: string;
  /** 含這一天。例如 "2026-12-31"。 */
  activeUntil?: string;
  /** round 照清單輪流；random 每次抽一則。 */
  order: "round" | "random";
  ads: SponsorAd[];
};

export const sponsorConfig: SponsorConfig = {
  cadence: { kind: "daily" },
  order: "round",
  ads: [
    {
      id: "demo-stall",
      sponsor: "示範贊助商",
      title: "里長伯的假想點心攤",
      body: "這是一則示範廣告，不是真的廠商。泡麵把拔拿它來練習怎麼介紹贊助內容。這裡的錢是假的。廣告也不可以叫人去買股票、借錢，或賭博。",
      image: "/family.jpg",
      seconds: 5,
      link: "https://example.com",
    },
  ],
};
