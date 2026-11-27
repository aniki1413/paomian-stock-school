import { sponsorConfig, type SponsorAd, type SponsorConfig } from "../config/sponsors";

const STORAGE_KEY = "paomian-sponsor-v1";

export type SponsorMemory = {
  lastShownAt: number | null;
  startsSinceShow: number;
  nextIndex: number;
};

export const emptySponsorMemory = (): SponsorMemory => ({
  lastShownAt: null,
  startsSinceShow: 0,
  nextIndex: 0,
});

function ymd(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function dayStamp(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function inWindow(config: SponsorConfig, now: Date) {
  const today = ymd(now);
  if (config.activeFrom && today < config.activeFrom) return false;
  if (config.activeUntil && today > config.activeUntil) return false;
  return true;
}

function pickAd(config: SponsorConfig, memory: SponsorMemory): SponsorAd {
  if (config.order === "random") {
    const index = Math.floor(Math.random() * config.ads.length);
    return config.ads[index] ?? config.ads[0];
  }
  const index = memory.nextIndex % config.ads.length;
  return config.ads[index] ?? config.ads[0];
}

function isDue(config: SponsorConfig, memory: SponsorMemory, now: Date) {
  const cadence = config.cadence;
  if (cadence.kind === "off") return false;
  if (cadence.kind === "every") return true;
  if (cadence.kind === "everyNStarts") {
    return memory.startsSinceShow + 1 >= Math.max(1, cadence.starts);
  }
  if (memory.lastShownAt == null) return true;
  const last = new Date(memory.lastShownAt);
  if (cadence.kind === "daily") return ymd(last) !== ymd(now);
  const days = Math.round((dayStamp(now) - dayStamp(last)) / 86_400_000);
  return days >= Math.max(1, cadence.days);
}

export function decideSponsor(input: {
  config: SponsorConfig;
  memory: SponsorMemory;
  now: Date;
  force: boolean;
}): { show: boolean; ad: SponsorAd | null; next: SponsorMemory } {
  const { config, memory, now, force } = input;
  if (!config.ads.length) return { show: false, ad: null, next: memory };
  const ad = pickAd(config, memory);
  if (force) return { show: true, ad, next: memory };
  if (config.cadence.kind === "off" || !inWindow(config, now)) {
    return { show: false, ad: null, next: memory };
  }
  if (!isDue(config, memory, now)) {
    return {
      show: false,
      ad: null,
      next: { ...memory, startsSinceShow: memory.startsSinceShow + 1 },
    };
  }
  const nextIndex = config.order === "round" ? (memory.nextIndex + 1) % config.ads.length : memory.nextIndex;
  return {
    show: true,
    ad,
    next: { lastShownAt: now.getTime(), startsSinceShow: 0, nextIndex },
  };
}

export function readSponsorMemory(): SponsorMemory {
  if (typeof localStorage === "undefined") return emptySponsorMemory();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySponsorMemory();
    const parsed = JSON.parse(raw) as Partial<SponsorMemory>;
    return {
      lastShownAt: typeof parsed.lastShownAt === "number" ? parsed.lastShownAt : null,
      startsSinceShow: Number.isFinite(parsed.startsSinceShow) ? Number(parsed.startsSinceShow) : 0,
      nextIndex: Number.isFinite(parsed.nextIndex) ? Number(parsed.nextIndex) : 0,
    };
  } catch {
    return emptySponsorMemory();
  }
}

export function writeSponsorMemory(memory: SponsorMemory) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
}

/** 按下開始時呼叫。要推播就回傳廣告；?adtest=1 不寫入推播紀錄。 */
export function offerSponsor(search: string, now = new Date()): SponsorAd | null {
  const force = new URLSearchParams(search).get("adtest") === "1";
  const memory = readSponsorMemory();
  const decision = decideSponsor({ config: sponsorConfig, memory, now, force });
  if (!force && decision.next !== memory) writeSponsorMemory(decision.next);
  return decision.show ? decision.ad : null;
}

export function videoEmbed(url: string): { kind: "file" | "youtube"; src: string } {
  const matched = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (matched) {
    return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${matched[1]}?rel=0` };
  }
  return { kind: "file", src: url };
}

export function linkHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function safeHttpUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.toString();
  } catch {
    return null;
  }
  return null;
}
