import type { Candle, PriceLine } from "./types";

function colorOf(c: Candle) {
  if (c.c > c.o) return "var(--color-up)";
  if (c.c < c.o) return "var(--color-down)";
  return "var(--color-doji)";
}

function volumeFill(c: Candle | undefined) {
  if (!c) return "#8b8680";
  if (c.c === c.o) return "#8b8680";
  return colorOf(c);
}

function placeName(index: number, total: number) {
  if (total === 2) return index === 0 ? "左" : "右";
  if (total === 3) return ["左", "中", "右"][index] ?? String(index + 1);
  return String(index + 1);
}

function nameOf(c: Candle) {
  if (c.c > c.o) return "紅 K";
  if (c.c < c.o) return "綠 K";
  return "十字";
}

function toCents(n: number) {
  return Math.round(n * 100);
}

function tickStepCents(spanCents: number) {
  const raw = spanCents / 3;
  const mag = 10 ** Math.floor(Math.log10(raw || 1));
  const n = raw / mag;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return Math.max(1, Math.round(nice * mag));
}

function formatCents(cents: number) {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const yuan = Math.floor(abs / 100);
  const frac = abs % 100;
  if (frac === 0) return `${sign}${yuan}`;
  if (frac % 10 === 0) return `${sign}${yuan}.${frac / 10}`;
  return `${sign}${yuan}.${String(frac).padStart(2, "0")}`;
}

function priceTicks(min: number, max: number) {
  const minC = toCents(min);
  const maxC = toCents(max);
  const step = tickStepCents(Math.max(maxC - minC, 100));
  let axisMin = Math.floor(minC / step) * step;
  let axisMax = Math.ceil(maxC / step) * step;
  if (axisMax === axisMin) {
    axisMin -= step;
    axisMax += step;
  }
  const ticks: number[] = [];
  for (let v = axisMin; v <= axisMax; v += step) ticks.push(v);
  return { axisMin, axisMax, ticks };
}

function autoMa(candles: Candle[], days: number) {
  return candles.map((_, index) => {
    if (index + 1 < days) return null;
    let sum = 0;
    for (let cursor = index - days + 1; cursor <= index; cursor += 1) sum += candles[cursor].c;
    return sum / days;
  });
}

function maPath(
  series: Array<number | null>,
  slot: number,
  labelW: number,
  y: (cents: number) => number,
) {
  let path = "";
  let drawing = false;
  series.forEach((value, index) => {
    if (value == null) {
      drawing = false;
      return;
    }
    const x = labelW + slot * index + slot / 2;
    path += `${drawing ? "L" : "M"}${x.toFixed(2)} ${y(toCents(value)).toFixed(2)}`;
    drawing = true;
  });
  return path;
}

export function MarketChart({
  candles,
  volumes,
  guide = false,
  caption = "color",
  ma5,
  ma20,
  lines,
}: {
  candles: Candle[];
  volumes?: number[];
  guide?: boolean;
  caption?: "color" | "place";
  ma5?: Array<number | null> | true;
  ma20?: Array<number | null> | true;
  lines?: PriceLine[];
}) {
  const labelW = 42;
  const padR = volumes ? 68 : 10;
  const padTop = 14;
  const width = 320;
  const priceBottom = volumes ? 108 : 154;
  const volTop = 124;
  const height = volumes ? 176 : 168;
  const ma5Series = ma5 === true ? autoMa(candles, 5) : ma5;
  const ma20Series = ma20 === true ? autoMa(candles, 20) : ma20;
  const maValues = [ma5Series, ma20Series].flatMap((series) =>
    (series ?? []).filter((value): value is number => typeof value === "number"),
  );
  const linePrices = (lines ?? []).map((line) => line.price);
  const max = Math.max(...candles.map((c) => c.h), ...maValues, ...linePrices);
  const min = Math.min(...candles.map((c) => c.l), ...maValues, ...linePrices);
  const { axisMin, axisMax, ticks } = priceTicks(min, max);
  const span = axisMax - axisMin || 1;
  const slot = (width - labelW - padR) / candles.length;
  const plotH = priceBottom - padTop;
  const wick = Math.max(1.25, Math.min(3, slot * 0.34));

  const y = (cents: number) => padTop + ((axisMax - cents) / span) * plotH;
  const ma5Draw = maPath(ma5Series ?? [], slot, labelW, y);
  const ma20Draw = maPath(ma20Series ?? [], slot, labelW, y);
  const showNames = candles.length > 1 && candles.length <= 6;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={volumes ? "h-52 w-full" : "h-40 w-full"}
        role="img"
        aria-label="K 棒圖"
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={labelW}
              x2={width - padR}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--color-bg-deep)"
              strokeWidth="1"
            />
            <text
              x={labelW - 6}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="central"
              fontSize="12"
              fontWeight="700"
              fontFamily="inherit"
              fill="var(--color-ink)"
            >
              {formatCents(tick)}
            </text>
          </g>
        ))}
        {candles.map((candle, index) => {
          const cx = labelW + slot * index + slot / 2;
          const bodyW = Math.min(28, slot * 0.46);
          const yHigh = y(toCents(candle.h));
          const yLow = y(toCents(candle.l));
          const yOpen = y(toCents(candle.o));
          const yClose = y(toCents(candle.c));
          const top = Math.min(yOpen, yClose);
          const bodyH = Math.max(Math.abs(yClose - yOpen), 2);
          const fill = colorOf(candle);
          return (
            <g key={index}>
              <line x1={cx} x2={cx} y1={yHigh} y2={yLow} stroke={fill} strokeWidth={wick} strokeLinecap="round" />
              <rect x={cx - bodyW / 2} y={top} width={bodyW} height={bodyH} rx="2" fill={fill} />
            </g>
          );
        })}
        {ma5Draw ? (
          <path d={ma5Draw} fill="none" stroke="var(--color-maroon)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        ) : null}
        {ma20Draw ? (
          <path d={ma20Draw} fill="none" stroke="var(--color-slow)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        ) : null}
        {(lines ?? []).map((line) => {
          const yLine = y(toCents(line.price));
          return (
            <g key={`${line.label}-${line.price}`}>
              <line
                x1={labelW}
                x2={width - padR}
                y1={yLine}
                y2={yLine}
                stroke="var(--color-ink)"
                strokeWidth="1.6"
                strokeDasharray="5 4"
              />
              <text
                x={labelW + 4}
                y={yLine - 5}
                fontSize="12"
                fontWeight="700"
                fontFamily="inherit"
                fill="var(--color-ink)"
              >
                {line.label}
              </text>
            </g>
          );
        })}
        {volumes ? (
          <g>
            <line
              x1={labelW}
              x2={width - padR}
              y1={volTop}
              y2={volTop}
              stroke="var(--color-ink)"
              strokeWidth="2"
            />
            {(() => {
              const usual = 50;
              const yUsual = volTop + 6 + (40 - (usual / 100) * 40);
              return (
                <g>
                  <line
                    x1={labelW}
                    x2={width - padR}
                    y1={yUsual}
                    y2={yUsual}
                    stroke="var(--color-ink)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <text
                    x={width - 2}
                    y={yUsual}
                    textAnchor="end"
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="700"
                    fontFamily="inherit"
                    fill="var(--color-ink)"
                  >
                    平常的量
                  </text>
                </g>
              );
            })()}
            {volumes.map((volume, index) => {
              const cx = labelW + slot * index + slot / 2;
              const bodyW = Math.min(28, slot * 0.46);
              const h = Math.max(4, (volume / 100) * 40);
              return (
                <rect
                  key={index}
                  x={cx - bodyW / 2}
                  y={volTop + 6 + (40 - h)}
                  width={bodyW}
                  height={h}
                  rx="2"
                  fill={candles[index] ? volumeFill(candles[index]) : "#8b8680"}
                />
              );
            })}
          </g>
        ) : null}
      </svg>
      {guide && candles.length === 1 ? <CandleGuide candle={candles[0]} /> : null}
      {showNames ? (
        <div
          className="mt-1 flex text-base font-black"
          style={{ paddingLeft: `${(labelW / width) * 100}%`, paddingRight: `${(padR / width) * 100}%` }}
        >
          {candles.map((candle, index) => (
            <span
              key={index}
              className="min-w-0 flex-1 text-center"
              style={{ color: caption === "place" ? "var(--color-ink)" : colorOf(candle) }}
            >
              {caption === "place" ? placeName(index, candles.length) : nameOf(candle)}
            </span>
          ))}
        </div>
      ) : null}
      {ma5Draw || ma20Draw ? (
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-base font-black">
          {ma5Draw ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-7 rounded-full bg-maroon" />
              五日線
            </span>
          ) : null}
          {ma20Draw ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-7 rounded-full" style={{ background: "var(--color-slow)" }} />
              二十日線
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CandleGuide({ candle }: { candle: Candle }) {
  const up = candle.c > candle.o;
  const flat = candle.c === candle.o;
  const rows = [
    { name: "最高", value: candle.h, hint: "細線最上" },
    { name: up ? "收盤" : "開盤", value: Math.max(candle.o, candle.c), hint: "身體上緣" },
    { name: up ? "開盤" : "收盤", value: Math.min(candle.o, candle.c), hint: "身體下緣" },
    { name: "最低", value: candle.l, hint: "細線最下" },
  ];
  return (
    <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
      {rows.map((row) => (
        <div key={row.name} className="rounded-xl bg-bg px-3 py-2">
          <dt className="font-black">{row.name}</dt>
          <dd className="text-muted">
            {row.value} 元 · {flat && (row.name === "開盤" || row.name === "收盤") ? "同一點" : row.hint}
          </dd>
        </div>
      ))}
    </dl>
  );
}
