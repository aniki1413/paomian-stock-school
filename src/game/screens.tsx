import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ArrowLeft, Lock, RotateCcw, Star, Volume2, VolumeX } from "lucide-react";
import { MarketChart } from "./charts";
import { BUDDIES, CHAPTERS, LEVELS, levelById, levelsIn, nextLevelId } from "./content";
import {
  START_CASH,
  equity,
  quizPoints,
  starsForQuiz,
  trade,
  yuan,
  type Portfolio,
} from "./logic";
import { chapterOpen, levelOpen, missesOf, sumPoints, sumStars } from "./save";
import { playTone, unlockAudio } from "./sfx";
import type { BuddyId, Level, MultiSimLevel, QuizChoice, QuizLevel, QuizStep, SaveV1, SingleSimLevel, Step } from "./types";


export type Headline = "過關" | "再練一次" | "再試試看";

export type AttemptResult = {
  stars: 1 | 2 | 3;
  points: number;
  comment: string;
  detail: string;
  headline: Headline;
  correct?: number;
  total?: number;
  pnl?: number;
  wrongSteps: number[];
};

export type Screen =
  | { name: "title" }
  | { name: "map" }
  | { name: "level"; id: string; attempt: number }
  | { name: "review"; attempt: number }
  | ({ name: "result"; id: string } & AttemptResult);

export const MAX_STARS = LEVELS.length * 3;

export function playableMisses(save: SaveV1) {
  return missesOf(save).filter((miss) => {
    const level = LEVELS.find((item) => item.id === miss.levelId);
    const step = level && "steps" in level ? level.steps[miss.step] : undefined;
    return step?.kind === "quiz";
  });
}

export function reviewLevel(save: SaveV1): QuizLevel {
  const steps = playableMisses(save).map((miss) => {
    const level = LEVELS.find((item) => item.id === miss.levelId) as QuizLevel;
    return level.steps[miss.step] as QuizStep;
  });
  return {
    id: "review",
    chapter: "k",
    title: "錯題複習",
    blurb: "把答錯的再看一次",
    notes: ["答對的題目會從錯題裡拿掉。", "答錯的會留著，可以再練。", "錯題複習不另外加學分。"],
    steps,
  };
}


export function MapScreen({
  save,
  onBuddy,
  onToggleMute,
  onReset,
  onBack,
  onPlay,
  onReview,
}: {
  save: SaveV1;
  onBuddy: (id: BuddyId) => void;
  onToggleMute: () => void;
  onReset: () => void;
  onBack: () => void;
  onPlay: (id: string) => void;
  onReview: () => void;
}) {
  const [armReset, setArmReset] = useState(false);
  const buddy = BUDDIES.find((item) => item.id === save.buddy) ?? BUDDIES[0];
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-5">
      <header className="flex items-center gap-2">
        <button className="btn-ghost px-3" onClick={onBack} aria-label="回到封面">
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black tracking-[0.2em] text-maroon">闖關地圖</p>
          <h2 className="truncate text-2xl font-black">股市小學堂</h2>
        </div>
        <button className="btn-ghost px-3" onClick={onToggleMute} aria-label={save.muted ? "打開聲音" : "關掉聲音"}>
          {save.muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
      </header>

      <div className="sticker flex items-center gap-3 p-3">
        <img src={buddy.img} alt="" className="size-16 object-contain" />
        <div>
          <p className="text-xs font-black text-maroon">學伴 · {buddy.role}</p>
          <p className="text-lg font-black">{buddy.name}</p>
          <p className="text-sm font-medium text-muted">{buddy.line}</p>
        </div>
        <p className="ml-auto text-right text-sm font-black">
          星星 {sumStars(save)}/{MAX_STARS}
          <br />
          <span className="text-muted">學分 {sumPoints(save)}</span>
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {BUDDIES.map((item) => {
          const selected = item.id === save.buddy;
          return (
            <button
              key={item.id}
              onClick={() => onBuddy(item.id)}
              aria-pressed={selected}
              className={`flex w-20 shrink-0 flex-col items-center rounded-2xl border-2 px-1 py-2 ${
                selected ? "border-ink bg-cream shadow-[3px_3px_0_var(--color-ink)]" : "border-transparent"
              }`}
            >
              <img src={item.img} alt="" className="size-14 object-contain" />
              <span className="mt-1 text-sm font-black">{item.name}</span>
            </button>
          );
        })}
      </div>

      {CHAPTERS.map((chapter) => {
        const open = chapterOpen(save, chapter.id);
        const levels = levelsIn(chapter.id);
        const cleared = levels.filter((level) => (save.levels[level.id]?.stars ?? 0) > 0).length;
        return (
          <article key={chapter.id} className={`sticker p-4 ${open ? "" : "opacity-70"}`}>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-xs font-black tracking-[0.18em] text-maroon">
                  {chapter.index} {open ? "" : "尚未解鎖"}
                </p>
                <h3 className="text-2xl font-black">{chapter.title}</h3>
                <p className="text-sm font-medium text-muted">{chapter.subtitle}</p>
              </div>
              <p className="font-black">關卡 {cleared}/{levels.length}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {levels.map((level) => {
                const unlocked = levelOpen(save, level);
                const stars = save.levels[level.id]?.stars ?? 0;
                return (
                  <button
                    key={level.id}
                    className="choice min-h-16"
                    disabled={!unlocked}
                    onClick={() => onPlay(level.id)}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span>{level.title}</span>
                      {unlocked ? null : <Lock className="size-4 shrink-0" aria-hidden />}
                    </span>
                    <span className="mt-1 flex gap-0.5" aria-label={`${stars} 顆星`}>
                      {[0, 1, 2].map((index) => (
                        <Star
                          key={index}
                          className={`size-3.5 ${index < stars ? "fill-maroon text-maroon" : "text-muted"}`}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
            {open || !chapter.unlockHint ? null : (
              <p className="mt-2 text-sm font-bold text-muted">{chapter.unlockHint}</p>
            )}
          </article>
        );
      })}

      <button className="btn-main" onClick={onReview} disabled={playableMisses(save).length === 0}>
        錯題複習{playableMisses(save).length ? ` · ${playableMisses(save).length} 題` : " · 還沒有錯題"}
      </button>

      <div className="flex items-center justify-between gap-3 pb-6">
        <p className="text-xs leading-relaxed text-muted">學分存在這台裝置裡。假錢練習，不是投資建議。</p>
        {armReset ? (
          <button
            className="btn-ghost shrink-0"
            onClick={() => {
              onReset();
              setArmReset(false);
            }}
          >
            確定重設
          </button>
        ) : (
          <button className="text-sm font-bold text-muted underline" onClick={() => setArmReset(true)}>
            重設進度
          </button>
        )}
      </div>
    </section>
  );
}
