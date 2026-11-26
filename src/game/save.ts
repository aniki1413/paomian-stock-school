import type { BuddyId, ChapterId, Level, Miss, SaveV1 } from "./types";
import { CHAPTERS, levelsIn } from "./content";

const KEY = "paomian-stock-school-v1";

export const emptySave = (): SaveV1 => ({
  version: 1,
  buddy: "dad",
  muted: false,
  levels: {},
});

export function loadSave(): SaveV1 {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySave();
    const parsed = JSON.parse(raw) as SaveV1;
    if (parsed.version !== 1 || !parsed.levels) return emptySave();
    return { ...parsed, misses: Array.isArray(parsed.misses) ? parsed.misses : [] };
  } catch {
    return emptySave();
  }
}

export function writeSave(save: SaveV1) {
  localStorage.setItem(KEY, JSON.stringify(save));
}

export function sumPoints(save: SaveV1) {
  return Object.values(save.levels).reduce((sum, level) => sum + level.points, 0);
}

export function sumStars(save: SaveV1) {
  return Object.values(save.levels).reduce((sum, level) => sum + level.stars, 0);
}

function passedGate(level: Level, stars: number) {
  if ("boss" in level && level.boss) return stars >= 2;
  return stars >= 1;
}

export function chapterOpen(save: SaveV1, id: ChapterId) {
  const index = CHAPTERS.findIndex((chapter) => chapter.id === id);
  if (index <= 0) return true;
  const prev = CHAPTERS[index - 1].id;
  return levelsIn(prev).every((level) => passedGate(level, save.levels[level.id]?.stars ?? 0));
}

export function levelOpen(save: SaveV1, level: Level) {
  if (!chapterOpen(save, level.chapter)) return false;
  const list = levelsIn(level.chapter);
  const index = list.findIndex((item) => item.id === level.id);
  if (index <= 0) return true;
  const prev = list[index - 1];
  return (save.levels[prev.id]?.stars ?? 0) >= 1;
}

export function missesOf(save: SaveV1): Miss[] {
  return save.misses ?? [];
}

export function withBuddy(save: SaveV1, buddy: BuddyId): SaveV1 {
  return { ...save, buddy };
}
