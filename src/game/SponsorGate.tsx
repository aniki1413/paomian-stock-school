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

  useEffect(() => {
    if (phase !== "offer") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onSkip();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onSkip]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-x-hidden bg-ink/45 p-3 sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (phase === "offer" && event.target === event.currentTarget) onSkip();
      }}
    >
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
      className="sticker w-full max-w-md overflow-x-hidden p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-offer-title"
    >
      <div className="flex items-end gap-2">
        <img src="/characters/dad.png" alt="" className="h-28 w-24 shrink-0 object-contain object-bottom" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-black text-maroon">泡麵</p>
          <p id="sponsor-offer-title" className="text-base font-bold leading-snug">
            把拔有一則小通知，想看的話再按。不看也沒關係，闖關進度不會少。
          </p>
        </div>
      </div>
      <p className="mt-3 text-base font-bold leading-snug text-muted">這是{ad.sponsor}提供的內容</p>
      <div className="mt-4 flex flex-col gap-2">
        <button className="btn-main w-full whitespace-normal text-center text-base leading-snug" onClick={onOpen} autoFocus>
          泡麵把拔自肥廣告時間
        </button>
        <button className="btn-ghost w-full whitespace-normal text-center text-base leading-snug" onClick={onSkip}>
          下次再說
        </button>
      </div>
    </div>
  );
}

function httpsLinkOf(url: string | undefined) {
  if (!url) return null;
  const safe = safeHttpUrl(url);
  if (!safe || !safe.startsWith("https://")) return null;
  return safe;
}

function Player({ ad, onDone }: { ad: SponsorAd; onDone: () => void }) {
  const [left, setLeft] = useState(Math.max(0, Math.round(ad.seconds)));
  const [askLink, setAskLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const ready = left <= 0;
  const link = httpsLinkOf(ad.link);
  const video = ad.videoUrl ? videoEmbed(ad.videoUrl) : null;

  useEffect(() => {
    if (left <= 0) return;
    const timer = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [left]);

  useEffect(() => {
    if (!askLink) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setAskLink(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [askLink]);

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const input = document.createElement("textarea");
      input.value = link;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
  }

  return (
    <>
      <div
        className="sticker flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden p-0"
        role="dialog"
        aria-modal={askLink ? undefined : true}
        aria-labelledby="sponsor-play-title"
      >
        <div className="relative shrink-0 px-4 pt-4 pr-14">
          <button
            type="button"
            className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full border-2 border-ink bg-cream text-xl font-black leading-none"
            onClick={onDone}
            aria-label="先跳過"
          >
            ✕
          </button>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border-2 border-ink bg-rose px-2 py-0.5 text-sm font-black">贊助內容</span>
            <span className="text-base font-black text-maroon" aria-live="polite">
              {ready ? "可以繼續了" : `還有 ${left} 秒`}
            </span>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-3">
          <div className="mt-3 flex items-end gap-2">
            <img src="/characters/dad.png" alt="" className="h-24 w-20 shrink-0 object-contain object-bottom" />
            <div className="min-w-0">
              <p className="text-base font-black leading-snug text-maroon">泡麵 · {ad.sponsor}</p>
              <h2 id="sponsor-play-title" className="break-words text-xl font-black leading-snug">
                {ad.title}
              </h2>
            </div>
          </div>
          {ad.image ? (
            <img src={ad.image} alt="" className="mt-3 max-h-40 w-full rounded-xl border-2 border-ink object-contain" />
          ) : null}
          <p className="mt-3 break-words text-base font-bold leading-relaxed">{ad.body}</p>
          {ad.notice ? (
            <p className="mt-3 break-words rounded-xl border-2 border-ink bg-bg px-3 py-2 text-sm font-bold leading-snug">
              {ad.notice}
            </p>
          ) : null}
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
        </div>
        <div className="shrink-0 border-t-[3px] border-ink bg-cream px-4 py-3">
          <div className="flex flex-col gap-2">
            {ready && link ? (
              <button
                type="button"
                className="btn-ghost h-auto min-h-11 w-full whitespace-normal break-words px-4 py-3 text-center text-base leading-snug"
                onClick={() => {
                  setCopied(false);
                  setAskLink(true);
                }}
              >
                {ad.linkLabel?.trim() || "了解更多"}
              </button>
            ) : null}
            {ready ? (
              <button className="btn-main w-full whitespace-normal text-center text-base leading-snug" onClick={onDone} autoFocus={!askLink}>
                繼續遊戲
              </button>
            ) : (
              <p className="text-center text-base font-bold leading-snug text-muted">倒數還沒完，也可以按右上角 ✕ 先跳過。</p>
            )}
          </div>
        </div>
      </div>
      {askLink && link ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-x-hidden bg-ink/45 p-3"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAskLink(false);
          }}
        >
          <div
            className="sticker w-full max-w-sm overflow-x-hidden p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-game-title"
          >
            <h2 id="leave-game-title" className="text-xl font-black leading-snug">
              即將離開遊戲
            </h2>
            <p className="mt-2 break-words text-base font-bold leading-snug">
              你即將前往外部網站（泡麵的 Facebook 粉絲專頁）。小朋友請先問過爸爸媽媽喔！
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                className="btn-main inline-flex min-h-11 w-full items-center justify-center whitespace-normal text-center text-base leading-snug no-underline"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAskLink(false)}
              >
                確定前往
              </a>
              <button
                type="button"
                className="btn-ghost min-h-11 w-full whitespace-normal text-center text-base leading-snug"
                onClick={() => setAskLink(false)}
                autoFocus
              >
                留在遊戲
              </button>
            </div>
            <p className="mt-3 text-center text-sm font-bold leading-snug">
              <a className="break-words underline" href={link} target="_self">
                如果沒有打開，按這裡改在這一頁前往
              </a>
            </p>
            <button
              type="button"
              className="btn-ghost mt-2 min-h-11 w-full text-center text-base leading-snug"
              onClick={() => void copyLink()}
            >
              {copied ? "已複製" : "複製網址"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
