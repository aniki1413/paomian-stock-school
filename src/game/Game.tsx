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
import {
  chapterOpen,
  emptySave,
  levelOpen,
  loadSave,
  missesOf,
  sumPoints,
  sumStars,
  writeSave,
} from "./save";
import { playTone, unlockAudio } from "./sfx";
import type { BuddyId, Level, MultiSimLevel, QuizChoice, QuizLevel, QuizStep, SaveV1, SingleSimLevel, Step } from "./types";

type Headline = "過關" | "再練一次" | "再試試看";

type AttemptResult = {
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

type Screen =
  | { name: "title" }
  | { name: "map" }
  | { name: "level"; id: string; attempt: number }
  | { name: "review"; attempt: number }
  | ({ name: "result"; id: string } & AttemptResult);

const MAX_STARS = LEVELS.length * 3;

function playableMisses(save: SaveV1) {
  return missesOf(save).filter((miss) => {
    const level = LEVELS.find((item) => item.id === miss.levelId);
    const step = level && "steps" in level ? level.steps[miss.step] : undefined;
    return step?.kind === "quiz";
  });
}

function reviewLevel(save: SaveV1): QuizLevel {
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

function starHelp(total: number) {
  const two = Math.ceil(total * 0.6);
  return `全對 ${total} 題是 3 顆星，答對至少 ${two} 題是 2 顆星，再少也有 1 顆星。`;
}

export function Game() {
  const [save, setSave] = useState<SaveV1>(emptySave);
  const [screen, setScreen] = useState<Screen>({ name: "title" });

  useEffect(() => {
    setSave(loadSave());
  }, []);

  function persist(next: SaveV1) {
    setSave(next);
    writeSave(next);
  }

  function commit(id: string, stars: number, points: number, wrongSteps: number[]) {
    const prev = save.levels[id];
    const next: SaveV1 = {
      ...save,
      misses: [
        ...(save.misses ?? []).filter((miss) => miss.levelId !== id),
        ...wrongSteps.map((step) => ({ levelId: id, step })),
      ],
      levels: {
        ...save.levels,
        [id]: {
          stars: Math.max(prev?.stars ?? 0, stars),
          points: Math.max(prev?.points ?? 0, points),
        },
      },
    };
    persist(next);
    return next;
  }

  const buddy = BUDDIES.find((item) => item.id === save.buddy) ?? BUDDIES[0];

  return (
    <main className="min-h-dvh bg-bg text-ink">
      {screen.name === "title" ? (
        <Title
          save={save}
          onStart={() => {
            unlockAudio();
            setScreen({ name: "map" });
          }}
        />
      ) : null}
      {screen.name === "map" ? (
        <MapScreen
          save={save}
          onBuddy={(id) => persist({ ...save, buddy: id })}
          onToggleMute={() => persist({ ...save, muted: !save.muted })}
          onReset={() => persist(emptySave())}
          onBack={() => setScreen({ name: "title" })}
          onPlay={(id) => setScreen({ name: "level", id, attempt: 0 })}
          onReview={() => setScreen({ name: "review", attempt: Date.now() })}
        />
      ) : null}
      {screen.name === "level" ? (
        <LevelScreen
          key={`${screen.id}-${screen.attempt}`}
          level={levelById(screen.id)}
          buddyName={buddy.name}
          buddyImg={buddy.img}
          muted={save.muted}
          onExit={() => setScreen({ name: "map" })}
          onDone={(result) => {
            commit(screen.id, result.stars, result.points, result.wrongSteps);
            playTone("star", save.muted);
            setScreen({ name: "result", id: screen.id, ...result });
          }}
        />
      ) : null}
      {screen.name === "review" ? (
        <LevelScreen
          key={`review-${screen.attempt}`}
          level={reviewLevel(save)}
          buddyName={buddy.name}
          buddyImg={buddy.img}
          muted={save.muted}
          onExit={() => setScreen({ name: "map" })}
          onDone={(result) => {
            const before = playableMisses(save);
            const kept = before.filter((_, index) => result.wrongSteps.includes(index));
            persist({ ...save, misses: kept });
            playTone("star", save.muted);
            setScreen({
              name: "result",
              id: "review",
              ...result,
              points: 0,
              headline: kept.length ? "再練一次" : "過關",
              comment: kept.length
                ? `還有 ${kept.length} 題留在錯題裡，可以再練一次。`
                : "這批錯題都答對了，已經從複習清單拿掉。",
            });
          }}
        />
      ) : null}
      {screen.name === "result" ? (
        <ResultScreen
          save={save}
          result={screen}
          onMap={() => setScreen({ name: "map" })}
          onReplay={() => setScreen({ name: "level", id: screen.id, attempt: Date.now() })}
          onNext={(id) => setScreen({ name: "level", id, attempt: 0 })}
        />
      ) : null}
    </main>
  );
}

function Title({ save, onStart }: { save: SaveV1; onStart: () => void }) {
  const stars = sumStars(save);
  const points = sumPoints(save);
  const started = stars > 0;
  return (
    <section className="grid min-h-dvh grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1">
      <div className="relative flex items-center justify-center bg-bg pt-6 md:h-auto md:pt-0">
        <img
          src="/family.jpg"
          alt="泡麵、邪仔、里長伯、里幹事、OHRU、I-DEE、I-Goose"
          className="h-auto max-h-[46vh] w-full object-contain md:h-full md:max-h-none"
        />
      </div>
      <div className="relative flex flex-col justify-center overflow-hidden px-6 py-10 md:px-12">
        {/* 裝飾白線只放在四周留白處，並壓在文字下層，避免擋住封面文字 */}
        <span aria-hidden className="dash pointer-events-none left-8 top-3 z-0 w-16" />
        <span aria-hidden className="dash pointer-events-none right-6 top-5 z-0 w-10 rotate-12" />
        <span aria-hidden className="dash pointer-events-none bottom-3 right-10 z-0 w-8 -rotate-6" />
        <div className="relative z-10">
          <p className="text-sm font-black tracking-[0.28em] text-maroon">泡麵家族</p>
          <h1 className="title-hero mt-2">
            股市
            <br />
            小學堂
          </h1>
          <p className="mt-4 max-w-sm text-lg font-bold leading-snug">
            給初學者與小朋友的闖關課：先認識 K 棒和成交量，再用假錢練習模擬、均線、停損停利和分散投資。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="btn-main" onClick={onStart}>
              {started ? "繼續闖關" : "開始闖關"}
            </button>
            <p className="text-sm font-bold text-muted">
              星星 {stars}/{MAX_STARS}
              {points > 0 ? ` · 學分 ${points}` : ""}
            </p>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            台灣股市習慣紅漲、綠跌。這裡的錢都是假的，學會看圖，不是叫你現在去買股票。
          </p>
        </div>
      </div>
    </section>
  );
}

function MapScreen({
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
              <span className="mt-1 text-xs font-black">{item.name}</span>
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

function LevelScreen({
  level,
  buddyName,
  buddyImg,
  muted,
  onExit,
  onDone,
}: {
  level: Level;
  buddyName: string;
  buddyImg: string;
  muted: boolean;
  onExit: () => void;
  onDone: (result: AttemptResult) => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const [leaveAsk, setLeaveAsk] = useState(false);
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-4">
      <header className="flex items-center gap-2">
        <button className="btn-ghost px-3" onClick={() => setLeaveAsk(true)} aria-label="回到地圖">
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-maroon">{CHAPTERS.find((item) => item.id === level.chapter)?.title}</p>
          <h2 className="truncate text-xl font-black">{level.title}</h2>
        </div>
        <button className="btn-ghost" onClick={() => setShowHint((value) => !value)}>
          {showHint ? "收起" : "重點整理"}
        </button>
      </header>
      {leaveAsk ? (
        <div className="sticker p-4">
          <p className="text-base font-black leading-snug">現在離開，這次的作答不會保存，確定嗎？</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="btn-ghost" onClick={() => setLeaveAsk(false)}>
              繼續作答
            </button>
            <button className="btn-main" onClick={onExit}>
              確定離開
            </button>
          </div>
        </div>
      ) : null}
      {showHint ? (
        <div className="sticker p-4">
          <p className="font-black text-maroon">重點整理</p>
          <ul className="mt-2 grid gap-2">
            {level.notes.map((line) => (
              <li key={line} className="text-base font-bold leading-snug">
                · {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {"days" in level ? (
        level.simKind === "multi" ? (
          <MultiSimRunner level={level} buddyName={buddyName} buddyImg={buddyImg} muted={muted} onDone={onDone} />
        ) : (
          <SimRunner level={level} buddyName={buddyName} buddyImg={buddyImg} muted={muted} onDone={onDone} />
        )
      ) : (
        <QuizRunner level={level} buddyName={buddyName} buddyImg={buddyImg} muted={muted} onDone={onDone} />
      )}
    </section>
  );
}

function shuffleChoices(choices: QuizChoice[]) {
  const next = [...choices];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = next[i];
    next[i] = next[j];
    next[j] = swap;
  }
  return next;
}

function Speech({ name, img, text }: { name: string; img: string; text: string }) {
  return (
    <div className="flex items-end gap-2 overflow-visible">
      <img src={img} alt="" className="h-24 w-[4.5rem] shrink-0 object-contain object-bottom" />
      <div className="sticker rounded-bl-md px-3 py-2">
        <p className="text-xs font-black text-maroon">{name}</p>
        <p className="text-base font-bold leading-snug">{text}</p>
      </div>
    </div>
  );
}

function StepVisual({ step }: { step: Step }) {
  if (step.panels?.length) {
    const cols = step.panels.length >= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";
    return (
      <div className={`grid gap-2 ${cols}`}>
        {step.panels.map((panel) => (
          <div key={panel.title} className="min-w-0">
            <p className="mb-1 text-center text-base font-black">{panel.title}</p>
            <MarketChart candles={panel.candles} volumes={panel.volumes} />
          </div>
        ))}
      </div>
    );
  }
  if (!step.candles) return null;
  return (
    <MarketChart
      candles={step.candles}
      volumes={step.volumes}
      guide={step.kind === "teach" && step.guide}
      caption={step.kind === "quiz" ? step.caption : undefined}
      ma5={step.ma5}
      ma20={step.ma20}
      lines={step.lines}
    />
  );
}

function QuizRunner({
  level,
  buddyName,
  buddyImg,
  muted,
  onDone,
}: {
  level: QuizLevel;
  buddyName: string;
  buddyImg: string;
  muted: boolean;
  onDone: (result: AttemptResult) => void;
}) {
  const quizzes = useMemo(() => level.steps.filter((step) => step.kind === "quiz"), [level]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [choiceIds, setChoiceIds] = useState<string[] | null>(null);
  const step = level.steps[index];
  useLayoutEffect(() => {
    if (step?.kind !== "quiz") {
      setChoiceIds(null);
      return;
    }
    setChoiceIds(shuffleChoices(step.choices).map((choice) => choice.id));
  }, [step]);
  const choices =
    step?.kind === "quiz" && choiceIds
      ? choiceIds.flatMap((id) => {
          const choice = step.choices.find((item) => item.id === id);
          return choice ? [choice] : [];
        })
      : [];
  const quizOrder = step?.kind === "quiz" ? flags.length + (picked ? 0 : 1) : flags.length;

  function choose(id: string) {
    if (step.kind !== "quiz" || picked) return;
    unlockAudio();
    const ok = step.choices.find((choice) => choice.id === id)?.correct === true;
    setPicked(id);
    setFlags((prev) => [...prev, ok]);
    if (ok) {
      setCombo((value) => value + 1);
      playTone("ok", muted);
    } else {
      setCombo(0);
      setShake(true);
      playTone("no", muted);
    }
  }

  function next() {
    unlockAudio();
    if (index + 1 >= level.steps.length) {
      const correct = flags.filter(Boolean).length;
      const stars = starsForQuiz(correct, quizzes.length);
      const scored = quizPoints(flags);
      const need = Math.ceil(quizzes.length * 0.6);
      const quizIndexes = level.steps.flatMap((item, stepIndex) => (item.kind === "quiz" ? [stepIndex] : []));
      const wrongSteps = flags.flatMap((ok, flagIndex) => (ok ? [] : [quizIndexes[flagIndex]]));
      const headline: Headline = correct === 0 || (level.boss && stars < 2) ? "再練一次" : "過關";
      const comment =
        correct === 0
          ? level.boss
            ? `這次一題都還沒對。再練一次。答對至少 ${need} 題，下一章才會打開。`
            : "這次一題都還沒對。再練一次，看圖的時候慢一點就好。"
          : level.boss && stars < 2
            ? `小考再練一次。答對至少 ${need} 題，下一章才會打開。`
            : stars === 3
              ? "全部答對。這關的重點已經在你手上了。"
              : stars === 2
                ? "大多看懂了。錯的題目可以再玩一次，把星星補滿。"
                : "你把故事走完了。再挑戰一次，星星會變多。";
      onDone({
        stars,
        points: scored.points + stars * 80,
        comment,
        detail: `答對 ${correct}/${quizzes.length} · 最高連擊 ${scored.best}`,
        headline,
        correct,
        total: quizzes.length,
        wrongSteps,
      });
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
    setShake(false);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (step.kind === "quiz" && !picked && ["1", "2", "3"].includes(event.key)) {
        const choice = choices[Number(event.key) - 1];
        if (choice) choose(choice.id);
      } else if (event.key === "Enter" && (step.kind === "teach" || picked)) {
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // choose/next close over latest state via render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, picked, index, flags, combo, choices]);

  const answered = step.kind === "quiz" && picked;
  const correctChoice = step.kind === "quiz" ? step.choices.find((choice) => choice.correct) : undefined;

  return (
    <div className={shake ? "shake" : "pop"}>
      <p className="mb-2 text-sm font-black text-muted">
        {step.kind === "quiz" ? `題目 ${Math.min(quizOrder, quizzes.length)}/${quizzes.length}` : "先看故事"}
        {combo >= 2 ? ` · 連擊 ${combo}` : ""}
      </p>
      <Speech name={buddyName} img={buddyImg} text={step.speech} />
      <div className="sticker mt-3 p-4">
        <StepVisual step={step} />
        <p className="mt-3 text-lg font-black leading-snug">{step.kind === "teach" ? step.body : step.prompt}</p>
      </div>
      {step.kind === "quiz" ? (
        <div className="mt-3 grid gap-2">
          {choices.map((choice, choiceIndex) => {
            const show = Boolean(picked);
            const good = show && choice.correct;
            const bad = show && picked === choice.id && !choice.correct;
            const dim = show && !choice.correct && picked !== choice.id;
            const mark = show && choice.correct ? "✓" : show && picked === choice.id ? "✗" : String(choiceIndex + 1);
            return (
              <button
                key={choice.id}
                className={`choice text-base ${good ? "choice-good" : ""} ${bad ? "choice-bad" : ""} ${dim ? "choice-dim" : ""}`}
                disabled={Boolean(picked)}
                onClick={() => choose(choice.id)}
              >
                <span className="mr-2 font-black">{mark}</span>
                {choice.label}
              </button>
            );
          })}
        </div>
      ) : null}
      {answered ? (
        <p className="sticker mt-3 px-4 py-3 text-base font-bold leading-snug" role="status">
          {picked === correctChoice?.id ? "答對了。" : "這次不對，記住這句就好。"} {step.explain}
        </p>
      ) : null}
      {step.kind === "teach" || picked ? (
        <button className="btn-main mt-3 w-full" onClick={next}>
          {index + 1 >= level.steps.length ? "看成績" : "下一題"}
        </button>
      ) : null}
    </div>
  );
}

function SimRunner({
  level,
  buddyName,
  buddyImg,
  muted,
  onDone,
}: {
  level: SingleSimLevel;
  buddyName: string;
  buddyImg: string;
  muted: boolean;
  onDone: (result: AttemptResult) => void;
}) {
  const [dayIndex, setDayIndex] = useState(0);
  const [phase, setPhase] = useState<"intro" | "choose" | "review">("intro");
  const [beat, setBeat] = useState(0);
  const [port, setPort] = useState<Portfolio>({ cash: START_CASH, shares: 0 });
  const [note, setNote] = useState("");
  const [actions, setActions] = useState<Array<"buy" | "hold" | "sell">>([]);
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [minCash, setMinCash] = useState(START_CASH);
  const [fullExit, setFullExit] = useState<boolean[]>([]);

  const beats = level.beats?.length ? level.beats : [level.story];
  const history = level.history ?? [];
  const seen = level.days.slice(0, dayIndex + (phase === "intro" ? 0 : 1));
  const day = level.days[dayIndex];
  const chartCandles = [...history.map((item) => item.candle), ...seen.map((item) => item.candle)];
  const chartVolumes = [...history.map((item) => item.volume), ...seen.map((item) => item.volume)];
  const mark = seen.length ? equity(port, seen[seen.length - 1].candle.c) : START_CASH;

  function act(action: "buy" | "hold" | "sell" | "sellAll") {
    unlockAudio();
    const result = trade(port, action, day.candle.c);
    const didBuy = result.bought > 0;
    const didSell = result.sold > 0;
    setPort({ cash: result.cash, shares: result.shares });
    setMinCash((value) => Math.min(value, result.cash));
    setFullExit((prev) => [...prev, result.shares === 0]);
    setNote(result.note);
    setActions((prev) => [...prev, didBuy ? "buy" : didSell ? "sell" : "hold"]);
    if (didBuy) setBuyCount((value) => value + 1);
    if (didSell) setSellCount((value) => value + 1);
    playTone(didBuy || didSell || action === "hold" ? "ok" : "no", muted);
    setPhase("review");
  }

  function advance() {
    unlockAudio();
    if (dayIndex + 1 >= level.days.length) {
      const last = level.days[level.days.length - 1].candle.c;
      const worth = equity(port, last);
      const pnl = Math.round((worth - START_CASH) * 100) / 100;
      const grade = level.grade({
        start: START_CASH,
        equity: worth,
        buyCount,
        sellCount,
        sharesLeft: port.shares,
        actions,
        minCash,
        cashLeft: port.cash,
        fullExit,
      });
      onDone({
        stars: grade.stars,
        points: grade.stars * 220 + (grade.stars === 3 ? 80 : 0),
        comment: `${grade.title}。${grade.comment}`,
        detail: `現金 ${yuan(port.cash)} 元 · 股票 ${port.shares} 份 · 總資產 ${yuan(worth)} 元`,
        headline: grade.stars === 3 ? "過關" : "再試試看",
        pnl,
        wrongSteps: [],
      });
      return;
    }
    setDayIndex((value) => value + 1);
    setPhase("choose");
  }

  function begin() {
    unlockAudio();
    if (beat + 1 < beats.length) {
      setBeat((value) => value + 1);
      return;
    }
    setPhase("choose");
  }

  return (
    <div className="pop">
      <Speech
        name={buddyName}
        img={buddyImg}
        text={phase === "intro" ? beats[Math.min(beat, beats.length - 1)] : phase === "choose" ? day.coach : day.lesson}
      />
      <div className="sticker mt-3 p-4">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-black">{level.stock}</h3>
          <p className="text-sm font-black text-muted">
            {phase === "intro" ? "開始前" : `第 ${dayIndex + 1} / ${level.days.length} 天`}
          </p>
        </div>
        {chartCandles.length ? (
          <>
            <MarketChart
              candles={chartCandles}
              volumes={chartVolumes}
              ma5={history.length ? true : undefined}
              ma20={history.length ? true : undefined}
              lines={level.lines}
            />
            {phase === "intro" ? (
              <p className="mt-2 text-center text-base font-bold leading-snug text-muted">
                前面 {history.length} 天已經走完。接下來還有 {level.days.length} 天。
              </p>
            ) : null}
          </>
        ) : (
          <p className="py-6 text-center font-bold text-muted">{level.days.length} 天的圖會一天天長出來。</p>
        )}
        <dl className="mt-3 grid grid-cols-2 gap-2 text-center text-base">
          <div className="rounded-xl bg-bg px-2 py-2">
            <dt className="text-muted">當天價格</dt>
            <dd className="font-black">{phase === "intro" ? "—" : `${yuan(day.candle.c)} 元`}</dd>
          </div>
          <div className="rounded-xl bg-bg px-2 py-2">
            <dt className="text-muted">持有份數</dt>
            <dd className="font-black">{port.shares} 份</dd>
          </div>
          <div className="rounded-xl bg-bg px-2 py-2">
            <dt className="text-muted">現金</dt>
            <dd className="font-black">{yuan(port.cash)} 元</dd>
          </div>
          <div className="rounded-xl bg-bg px-2 py-2">
            <dt className="text-muted">損益</dt>
            <dd className={`font-black ${mark > START_CASH ? "text-up" : mark < START_CASH ? "text-down" : "text-muted"}`}>
              {mark > START_CASH ? "+" : ""}
              {yuan(Math.round((mark - START_CASH) * 100) / 100)} 元
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-center text-base font-black">
          總資產 {yuan(mark)} 元
          <span className={`mt-0.5 block text-base ${mark > START_CASH ? "text-up" : mark < START_CASH ? "text-down" : "text-muted"}`}>
            {mark > START_CASH ? "比開始多" : mark < START_CASH ? "比開始少" : "跟開始一樣"}
          </span>
        </p>
      </div>
      {phase === "review" ? (
        <p className="sticker mt-3 px-4 py-3 text-base font-bold leading-snug" role="status">
          {note}
        </p>
      ) : null}
      {phase === "intro" ? (
        <button className="btn-main mt-3 w-full" onClick={begin}>
          {beat + 1 < beats.length ? "下一句" : "從第一天開始"}
        </button>
      ) : null}
      {phase === "choose" ? (
        <div className="mt-3 grid gap-2">
          <button className="choice" onClick={() => act("buy")}>
            買一點
            <span className="mt-0.5 block text-base font-medium text-muted">
              先用一半現金。一半不夠 1 份、但現金夠，就買 1 份
            </span>
          </button>
          <button className="choice" onClick={() => act("hold")}>
            先看看
            <span className="mt-0.5 block text-base font-medium text-muted">今天不買也不賣</span>
          </button>
          <button className="choice" onClick={() => act("sell")} disabled={port.shares <= 0}>
            賣掉一些
            <span className="mt-0.5 block text-base font-medium text-muted">
              {port.shares > 0 ? "賣掉大約一半；只剩 1 份就全部賣掉" : "現在沒有股票"}
            </span>
          </button>
          {level.id === "stop5" ? (
            <button className="choice" onClick={() => act("sellAll")} disabled={port.shares <= 0}>
              全部賣掉／照停損離開
              <span className="mt-0.5 block text-base font-medium text-muted">
                {port.shares > 0 ? "一次把剩下的全部賣掉" : "現在沒有股票"}
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
      {phase === "review" ? (
        <button className="btn-main mt-3 w-full" onClick={advance}>
          {dayIndex + 1 >= level.days.length ? "結算假錢" : "下一天"}
        </button>
      ) : null}
    </div>
  );
}

function MultiSimRunner({
  level,
  buddyName,
  buddyImg,
  muted,
  onDone,
}: {
  level: MultiSimLevel;
  buddyName: string;
  buddyImg: string;
  muted: boolean;
  onDone: (result: AttemptResult) => void;
}) {
  const [dayIndex, setDayIndex] = useState(0);
  const [phase, setPhase] = useState<"intro" | "choose" | "review">("intro");
  const [beat, setBeat] = useState(0);
  const [tab, setTab] = useState(0);
  const [cash, setCash] = useState(START_CASH);
  const [shares, setShares] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const [actions, setActions] = useState<Array<"buy" | "hold" | "sell">>([]);
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [boughtTypes, setBoughtTypes] = useState<string[]>([]);
  const [firstBuy, setFirstBuy] = useState<Record<string, number>>({});
  const [heldBoth, setHeldBoth] = useState(false);
  const [moved, setMoved] = useState(false);

  const beats = level.beats?.length ? level.beats : [level.story];
  const seen = level.days.slice(0, dayIndex + (phase === "intro" ? 0 : 1));
  const day = level.days[dayIndex];
  const changeAt = level.days.findIndex((item) => item.weather.includes("變天"));

  function worthAt(days: MultiSimLevel["days"], cashNow: number, sharesNow: Record<string, number>) {
    const last = days[days.length - 1];
    if (!last) return cashNow;
    const total = level.markets.reduce(
      (sum, market) => sum + (sharesNow[market.id] ?? 0) * last.markets[market.id].candle.c,
      cashNow,
    );
    return Math.round(total * 100) / 100;
  }

  const mark = worthAt(seen, cash, shares);

  function act(action: "buy" | "sell", marketId: string) {
    unlockAudio();
    const market = level.markets.find((item) => item.id === marketId);
    const price = day.markets[marketId].candle.c;
    const result = trade({ cash, shares: shares[marketId] ?? 0 }, action, price);
    const didBuy = result.bought > 0;
    const didSell = result.sold > 0;
    setCash(result.cash);
    setShares((prev) => ({ ...prev, [marketId]: result.shares }));
    setNote(`${market?.short ?? ""}：${result.note}`);
    if (didBuy) {
      setBuyCount((value) => value + 1);
      setBoughtTypes((prev) => (prev.includes(marketId) ? prev : [...prev, marketId]));
      setFirstBuy((prev) => (prev[marketId] !== undefined ? prev : { ...prev, [marketId]: dayIndex }));
      setMoved(true);
    }
    if (didSell) {
      setSellCount((value) => value + 1);
      setMoved(true);
    }
    playTone(didBuy || didSell ? "ok" : "no", muted);
  }

  function endDay() {
    unlockAudio();
    if (!moved) setNote("今天先這樣，兩個攤都沒有動。");
    if (changeAt > 0 && dayIndex === changeAt - 1) {
      const both = level.markets.every((market) => (shares[market.id] ?? 0) > 0);
      setHeldBoth(both);
    }
    setActions((prev) => [...prev, moved ? "buy" : "hold"]);
    setPhase("review");
  }

  function advance() {
    unlockAudio();
    if (dayIndex + 1 >= level.days.length) {
      const worth = worthAt(level.days, cash, shares);
      const pnl = Math.round((worth - START_CASH) * 100) / 100;
      const late = (id: string) => firstBuy[id] !== undefined && changeAt >= 0 && firstBuy[id] >= changeAt;
      const chasedWeather = Boolean(
        firstBuy.ice !== undefined && firstBuy.soup !== undefined && !heldBoth && (late("ice") || late("soup")),
      );
      const grade = level.grade({
        start: START_CASH,
        equity: worth,
        buyCount,
        sellCount,
        sharesLeft: level.markets.reduce((sum, market) => sum + (shares[market.id] ?? 0), 0),
        actions,
        boughtTypes,
        cashLeft: cash,
        heldBothBeforeChange: heldBoth,
        chasedWeather,
      });
      const held = level.markets.map((market) => `${market.short} ${shares[market.id] ?? 0} 份`).join(" · ");
      onDone({
        stars: grade.stars,
        points: grade.stars * 220 + (grade.stars === 3 ? 80 : 0),
        comment: `${grade.title}。${grade.comment}`,
        detail: `現金 ${yuan(cash)} 元 · ${held} · 總資產 ${yuan(worth)} 元`,
        headline: grade.stars === 3 ? "過關" : "再試試看",
        pnl,
        wrongSteps: [],
      });
      return;
    }
    setDayIndex((value) => value + 1);
    setMoved(false);
    setNote("");
    setPhase("choose");
  }

  function begin() {
    unlockAudio();
    if (beat + 1 < beats.length) {
      setBeat((value) => value + 1);
      return;
    }
    setPhase("choose");
  }

  const tone = mark > START_CASH ? "text-up" : mark < START_CASH ? "text-down" : "text-muted";
  const active = level.markets[Math.min(tab, level.markets.length - 1)];

  return (
    <div className="pop">
      <Speech
        name={buddyName}
        img={buddyImg}
        text={phase === "intro" ? beats[Math.min(beat, beats.length - 1)] : phase === "choose" ? day.coach : day.lesson}
      />
      <div className="sticker mt-3 p-4">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-black">{level.stock}</h3>
          <p className="text-right text-sm font-black text-muted">
            {phase === "intro" ? "開始前" : `第 ${dayIndex + 1} / ${level.days.length} 天`}
          </p>
        </div>
        {phase === "intro" ? null : <p className="mb-2 text-base font-black">天氣：{day.weather}</p>}
        {seen.length && active ? (
          <>
            <div className="mb-2 grid grid-cols-2 gap-2 sm:hidden">
              {level.markets.map((market, index) => (
                <button
                  key={market.id}
                  className={index === tab ? "btn-main" : "btn-ghost"}
                  aria-pressed={index === tab}
                  onClick={() => setTab(index)}
                >
                  {market.short}
                  <span className="mt-0.5 block text-base font-bold">持有 {shares[market.id] ?? 0} 份</span>
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {level.markets.map((market, index) => (
                <div key={market.id} className={index === tab ? "block" : "hidden sm:block"}>
                  <p className="mb-1 text-base font-black">
                    {market.name}
                    <span className="ml-2 font-bold text-muted">持有 {shares[market.id] ?? 0} 份</span>
                  </p>
                  <MarketChart
                    candles={seen.map((item) => item.markets[market.id].candle)}
                    volumes={seen.map((item) => item.markets[market.id].volume)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="py-6 text-center font-bold text-muted">{level.days.length} 天的圖會一天天長出來。</p>
        )}
        <dl className="mt-3 grid grid-cols-2 gap-2 text-center text-base">
          {level.markets.map((market) => (
            <div key={market.id} className="rounded-xl bg-bg px-2 py-2">
              <dt className="text-muted">{market.short}價格</dt>
              <dd className="font-black">{phase === "intro" ? "—" : `${yuan(day.markets[market.id].candle.c)} 元`}</dd>
            </div>
          ))}
          <div className="rounded-xl bg-bg px-2 py-2">
            <dt className="text-muted">現金</dt>
            <dd className="font-black">{yuan(cash)} 元</dd>
          </div>
          <div className="rounded-xl bg-bg px-2 py-2">
            <dt className="text-muted">損益</dt>
            <dd className={`font-black ${tone}`}>
              {mark > START_CASH ? "+" : ""}
              {yuan(Math.round((mark - START_CASH) * 100) / 100)} 元
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-center text-base font-black">
          總資產 {yuan(mark)} 元
          <span className={`mt-0.5 block text-base ${tone}`}>
            {mark > START_CASH ? "比開始多" : mark < START_CASH ? "比開始少" : "跟開始一樣"}
          </span>
        </p>
      </div>
      {note && phase !== "intro" ? (
        <p className="sticker mt-3 px-4 py-3 text-base font-bold leading-snug" role="status">
          {note}
        </p>
      ) : null}
      {phase === "intro" ? (
        <button className="btn-main mt-3 w-full" onClick={begin}>
          {beat + 1 < beats.length ? "下一句" : "從第一天開始"}
        </button>
      ) : null}
      {phase === "choose" ? (
        <div className="mt-3 grid gap-2">
          {level.markets.map((market) => (
            <button key={`buy-${market.id}`} className="choice" onClick={() => act("buy", market.id)}>
              買一點{market.short}
              <span className="mt-0.5 block text-base font-medium text-muted">
                先用一半現金。一半不夠 1 份、但現金夠，就買 1 份
              </span>
            </button>
          ))}
          {level.markets.map((market) => (
            <button
              key={`sell-${market.id}`}
              className="choice"
              onClick={() => act("sell", market.id)}
              disabled={(shares[market.id] ?? 0) <= 0}
            >
              賣掉一些{market.short}
              <span className="mt-0.5 block text-base font-medium text-muted">
                {(shares[market.id] ?? 0) > 0 ? "賣掉大約一半；只剩 1 份就全部賣掉" : "現在沒有這個攤"}
              </span>
            </button>
          ))}
          <button className="btn-main" onClick={endDay}>
            今天先這樣
            <span className="mt-0.5 block text-base font-bold">兩個攤都看過，就進入今天的說明</span>
          </button>
        </div>
      ) : null}
      {phase === "review" ? (
        <button className="btn-main mt-3 w-full" onClick={advance}>
          {dayIndex + 1 >= level.days.length ? "結算假錢" : "下一天"}
        </button>
      ) : null}
    </div>
  );
}

function ResultScreen({
  save,
  result,
  onMap,
  onReplay,
  onNext,
}: {
  save: SaveV1;
  result: Extract<Screen, { name: "result" }>;
  onMap: () => void;
  onReplay: () => void;
  onNext: (id: string) => void;
}) {
  const review = result.id === "review";
  const level = review ? null : levelById(result.id);
  const next = review ? null : nextLevelId(result.id);
  const bossBlocked = level && "boss" in level && level.boss && result.stars < 2;
  const nextOpen = next && level ? levelOpen(save, levelById(next)) && !bossBlocked : false;
  const best = review ? 0 : (save.levels[result.id]?.points ?? result.points);
  const pnlClass =
    result.pnl === undefined ? "" : result.pnl > 0 ? "text-up" : result.pnl < 0 ? "text-down" : "text-muted";
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-4 px-4 pb-40 pt-8" style={{ overflowAnchor: "none" }}>
      <h2 className="text-4xl font-black">{result.headline}</h2>
      <p className="text-lg font-black text-maroon">{review ? "錯題複習" : level?.title}</p>
      <p className="text-lg font-black">這次拿到 {result.stars} 顆星</p>
      <div className="flex gap-2" aria-label={`${result.stars} 顆星`}>
        {[0, 1, 2].map((index) => (
          <Star
            key={index}
            className={`star-in size-12 ${index < result.stars ? "fill-maroon text-maroon" : "text-ink"}`}
            style={{ animationDelay: `${index * 80}ms` }}
          />
        ))}
      </div>
      <div className="sticker p-4 text-base">
        <p className="font-black leading-snug">{result.comment}</p>
        <p className="mt-2 font-bold text-muted">{result.detail}</p>
        {result.pnl !== undefined ? (
          <p className={`mt-2 font-black ${pnlClass}`}>
            {result.pnl > 0 ? `這次賺了 ${yuan(result.pnl)} 元` : result.pnl < 0 ? `這次賠了 ${yuan(Math.abs(result.pnl))} 元` : "這次沒有賺也沒有賠"}
          </p>
        ) : null}
        {result.total ? <p className="mt-2 font-bold leading-snug">{starHelp(result.total)}</p> : null}
        {result.pnl !== undefined ? (
          <p className="mt-2 font-bold leading-snug">
            這關沒有選擇題。星星看你有沒有做到這關要學的事，不看賺賠。做到會顯示「過關」，還沒做到會顯示「再試試看」。
          </p>
        ) : null}
        {review ? (
          <p className="mt-2 font-bold leading-snug">錯題複習不加學分。總學分仍是每一關最好的一次加起來。</p>
        ) : (
          <p className="mt-2 font-bold leading-snug">
            學分只留每一關最好的一次，重玩不會累加。這關這次 {result.points} 分，這關最佳 {best} 分。總學分 {sumPoints(save)} 是各關最佳加起來。
          </p>
        )}
        {level && "days" in level ? (
          <p className="mt-2 text-muted">還沒賣掉的股票，用最後一天的收盤價算進總資產。這仍是假錢。</p>
        ) : null}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-[3px] border-ink bg-bg px-4 py-3">
        <div className="mx-auto grid max-w-xl gap-2 sm:grid-cols-2">
          {nextOpen && next ? (
            <button className="btn-main" onClick={() => onNext(next)}>
              下一關
            </button>
          ) : (
            <button className="btn-main" onClick={onMap}>
              回地圖
            </button>
          )}
          {review ? null : (
            <button className="btn-ghost" onClick={onReplay}>
              <span className="inline-flex items-center justify-center gap-2">
                <RotateCcw className="size-4" />
                再挑戰
              </span>
            </button>
          )}
          {nextOpen ? (
            <button className="text-base font-bold text-muted underline sm:col-span-2" onClick={onMap}>
              回地圖
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
