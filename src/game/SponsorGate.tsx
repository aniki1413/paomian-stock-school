import { useEffect, useState } from "react";
import type { SponsorAd } from "../config/sponsors";
import { safeHttpUrl, videoEmbed } from "./sponsor";

export function SponsorGate({
  ad,
  onSkip,
  onDone,
}: {
  ad: SponsorAd;
  onSkip: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"offer" | "play">("offer");
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-3 sm:items-center" role="presentation">
      {phase === "offer" ? (
        <Offer ad={ad} onOpen={() => setPhase("play")} onSkip={onSkip} />
      ) : (
        <Player ad={ad} onDone={onDone} />
      )}
    </div>
  );
}

function Offer({ ad, onOpen, onSkip }: { ad: SponsorAd; onOpen: () => void; onSkip: () => void }) {
  return (
    <div
      className="sticker w-full max-w-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-offer-title"
    >
      <div className="flex items-end gap-2">
        <img src="/characters/dad.png" alt="" className="h-28 w-24 shrink-0 object-contain object-bottom" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-maroon">泡麵</p>
          <p id="sponsor-offer-title" className="text-base font-bold leading-snug">
            把拔有一則小通知，想看的話再按。不看也沒關係，闖關進度不會少。
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs font-bold text-muted">這一則是{ad.sponsor}</p>
      <div className="mt-4 flex flex-col gap-2">
        <button className="btn-main w-full text-base leading-snug" onClick={onOpen} autoFocus>
          泡麵把拔自肥廣告時間
        </button>
        <button className="btn-ghost w-full" onClick={onSkip}>
          下次再說
        </button>
      </div>
    </div>
  );
}

function Player({ ad, onDone }: { ad: SponsorAd; onDone: () => void }) {
  const [left, setLeft] = useState(Math.max(0, Math.round(ad.seconds)));
  const [askLink, setAskLink] = useState(false);
  const ready = left <= 0;
  const link = ad.link ? safeHttpUrl(ad.link) : null;
  const video = ad.videoUrl ? videoEmbed(ad.videoUrl) : null;

  useEffect(() => {
    if (left <= 0) return;
    const timer = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [left]);

  return (
    <div
      className="sticker max-h-[92dvh] w-full max-w-md overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-play-title"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border-2 border-ink bg-rose px-2 py-0.5 text-xs font-black">贊助內容</span>
        <span className="text-sm font-black text-maroon" aria-live="polite">
          {ready ? "可以繼續了" : `還有 ${left} 秒`}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <img src="/characters/dad.png" alt="" className="h-24 w-20 shrink-0 object-contain object-bottom" />
        <div className="min-w-0">
          <p className="text-xs font-black text-maroon">泡麵 · {ad.sponsor}</p>
          <h2 id="sponsor-play-title" className="text-xl font-black leading-snug">
            {ad.title}
          </h2>
        </div>
      </div>
      {ad.image ? (
        <img src={ad.image} alt="" className="mt-3 max-h-40 w-full rounded-xl border-2 border-ink object-contain" />
      ) : null}
      <p className="mt-3 text-base font-bold leading-relaxed">{ad.body}</p>
      {video?.kind === "file" ? (
        <video className="mt-3 w-full rounded-xl border-2 border-ink" controls playsInline preload="metadata" src={video.src} />
      ) : null}
      {video?.kind === "youtube" ? (
        <iframe
          className="mt-3 aspect-video w-full rounded-xl border-2 border-ink"
          src={video.src}
          title={ad.title}
          allow="encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}
      {ready && link && askLink ? (
        <div className="mt-3 rounded-xl border-2 border-ink bg-bg p-3">
          <p className="text-sm font-bold leading-snug">要開新分頁看介紹嗎？遊戲會留在這一頁，不會自己跳走。</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                window.open(link, "_blank", "noopener,noreferrer");
                setAskLink(false);
              }}
            >
              開新分頁
            </button>
            <button className="btn-ghost" onClick={() => setAskLink(false)}>
              先不要
            </button>
          </div>
        </div>
      ) : null}
      {ready ? (
        <div className="mt-4 flex flex-col gap-2">
          {link && !askLink ? (
            <button className="btn-ghost w-full" onClick={() => setAskLink(true)}>
              了解更多
            </button>
          ) : null}
          <button className="btn-main w-full" onClick={onDone} autoFocus>
            繼續遊戲
          </button>
        </div>
      ) : (
        <p className="mt-4 text-sm font-bold text-muted">看完倒數就可以繼續闖關。</p>
      )}
    </div>
  );
}
