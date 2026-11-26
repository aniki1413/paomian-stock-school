import { useEffect, useState } from "react";
import { BUDDIES, levelById } from "./content";
import type { SponsorAd } from "../config/sponsors";
import { emptySave, loadSave, sumPoints, sumStars, writeSave } from "./save";
import { playTone, unlockAudio } from "./sfx";
import { offerSponsor } from "./sponsor";
import { SponsorGate } from "./SponsorGate";
import { LevelScreen, ResultScreen } from "./level-play";
import {
  MAX_STARS,
  MapScreen,
  playableMisses,
  reviewLevel,
  type Screen,
} from "./screens";
import type { SaveV1 } from "./types";

export function Game() {
  const [save, setSave] = useState<SaveV1>(emptySave);
  const [screen, setScreen] = useState<Screen>({ name: "title" });
  const [sponsorAd, setSponsorAd] = useState<SponsorAd | null>(null);

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
            const ad = offerSponsor(window.location.search);
            if (ad) {
              setSponsorAd(ad);
              return;
            }
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
      {sponsorAd ? (
        <SponsorGate
          ad={sponsorAd}
          onSkip={() => {
            setSponsorAd(null);
            setScreen({ name: "map" });
          }}
          onDone={() => {
            setSponsorAd(null);
            setScreen({ name: "map" });
          }}
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
      <div className="flex items-end justify-center bg-bg md:min-h-dvh">
        <img
          src="/family.jpg"
          alt="泡麵、邪仔、里長伯、里幹事、OHRU、I-DEE、I-Goose"
          className="h-auto w-full object-contain md:h-full md:max-h-dvh"
        />
      </div>
      <div className="relative flex flex-col justify-start overflow-hidden px-6 py-8 md:justify-center md:px-12">
        <span aria-hidden className="dash pointer-events-none z-0 top-3 left-3 w-16" />
        <span aria-hidden className="dash pointer-events-none z-0 top-5 right-3 w-10 rotate-12" />
        <span aria-hidden className="dash pointer-events-none z-0 bottom-3 left-3 w-8 -rotate-6" />
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
