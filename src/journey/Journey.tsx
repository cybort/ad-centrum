import { memo, useEffect, useRef, useState, type RefObject } from "react";
import { MARKS } from "@/journey/marks";
import {
  FOCUS_VH,
  SPAN_VH,
  formatDistance,
  formatDistanceShort,
  formatLight,
  kmAt,
  stratumOf,
} from "@/journey/scale";
import { SkyCanvas, type Visual } from "@/journey/SkyCanvas";
import { createDrone, type Drone } from "@/journey/sound";

const Readout = memo(function Readout({
  valueRef,
  unitRef,
  metaRef,
}: {
  valueRef: RefObject<HTMLParagraphElement | null>;
  unitRef: RefObject<HTMLParagraphElement | null>;
  metaRef: RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <>
      <p ref={valueRef} className="num">
        0
      </p>
      <p ref={unitRef} className="unit">
        公里 · 距地心
      </p>
      <p ref={metaRef} className="meta">
        地心 · 光行 —
      </p>
    </>
  );
});

export function Journey() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const zeroRef = useRef<HTMLDivElement>(null);
  const oneRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);
  const unitRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const rnowRef = useRef<HTMLSpanElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const markEls = useRef(new Map<string, HTMLElement>());
  const visual = useRef<Visual>({ p: 0, reduced: false });
  const droneRef = useRef<Drone | null>(null);
  const stratumRef = useRef("地心");
  const spanRef = useRef(1);
  const [indexOpen, setIndexOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      visual.current.reduced = mq.matches;
    };
    syncReduced();
    mq.addEventListener("change", syncReduced);

    const measure = () => {
      const z = zeroRef.current;
      const o = oneRef.current;
      if (!z || !o) return spanRef.current;
      spanRef.current = Math.max(1, o.offsetTop - z.offsetTop);
      return spanRef.current;
    };

    const paint = () => {
      const span = spanRef.current || measure();
      const p = Math.min(1, Math.max(0, el.scrollTop / span));
      visual.current.p = p;
      const km = kmAt(p, MARKS);
      const dist = formatDistance(km);
      const stratum = stratumOf(km);
      const light = formatLight(km);
      if (valueRef.current) valueRef.current.textContent = dist.value;
      if (unitRef.current) unitRef.current.textContent = dist.unit;
      if (metaRef.current) metaRef.current.textContent = `${stratum} · ${light}`;
      if (rnowRef.current) rnowRef.current.style.top = `${p * 100}%`;
      if (stratum !== stratumRef.current && liveRef.current) {
        stratumRef.current = stratum;
        liveRef.current.textContent = `${stratum}，${dist.value} ${dist.unit.split("·")[0]?.trim() ?? ""}`;
      }
      const reduced = visual.current.reduced;
      const focus = window.innerHeight * (FOCUS_VH / 100);
      for (const node of markEls.current.values()) {
        if (reduced) {
          node.style.opacity = "1";
          continue;
        }
        const screens = Math.abs(node.getBoundingClientRect().top - focus) / window.innerHeight;
        const near = Math.max(0, 1 - screens / 0.9);
        node.style.opacity = (0.14 + near * 0.86).toFixed(3);
      }
      droneRef.current?.setProgress(p);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        paint();
      });
    };

    measure();
    paint();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIndexOpen(false);
        return;
      }
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "BUTTON" || tag === "A" || tag === "INPUT") return;
      const behavior: ScrollBehavior = mq.matches ? "auto" : "smooth";
      const page = el.clientHeight * 0.86;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        el.scrollBy({ top: page, behavior });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        el.scrollBy({ top: -page, behavior });
      } else if (e.key === "Home") {
        e.preventDefault();
        el.scrollTo({ top: 0, behavior });
      } else if (e.key === "End") {
        e.preventDefault();
        el.scrollTo({ top: el.scrollHeight, behavior });
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", syncReduced);
      droneRef.current?.dispose();
      droneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (indexOpen) closeRef.current?.focus();
  }, [indexOpen]);

  function jump(p: number) {
    const el = scrollerRef.current;
    const z = zeroRef.current;
    const o = oneRef.current;
    if (!el || !z || !o) return;
    const span = Math.max(1, o.offsetTop - z.offsetTop);
    spanRef.current = span;
    el.scrollTo({
      top: p * span,
      behavior: visual.current.reduced ? "auto" : "smooth",
    });
    setIndexOpen(false);
  }

  function scrub(clientY: number) {
    const ruler = rulerRef.current;
    const el = scrollerRef.current;
    if (!ruler || !el) return;
    const rect = ruler.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientY - rect.top) / Math.max(1, rect.height)));
    el.scrollTop = t * spanRef.current;
  }

  async function toggleSound() {
    if (!droneRef.current) droneRef.current = createDrone();
    const on = await droneRef.current.toggle();
    setSoundOn(on);
    droneRef.current.setProgress(visual.current.p);
  }

  return (
    <div className="journey">
      <SkyCanvas visual={visual} />
      <header className="hud">
        <div className="hud-row">
          <p className="word">直至银心</p>
          <div className="hud-actions">
            <button type="button" aria-pressed={soundOn} onClick={() => void toggleSound()}>
              {soundOn ? "静音" : "声音"}
            </button>
            <button type="button" aria-expanded={indexOpen} onClick={() => setIndexOpen(true)}>
              刻度
            </button>
          </div>
        </div>
        <Readout valueRef={valueRef} unitRef={unitRef} metaRef={metaRef} />
        <p ref={liveRef} className="sr-only" aria-live="polite">
          地心
        </p>
      </header>

      <div
        ref={rulerRef}
        className="ruler"
        aria-hidden="true"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          scrub(e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e.clientY);
        }}
        onWheel={(e) => scrollerRef.current?.scrollBy({ top: e.deltaY })}
      >
        <div className="ruler-line" />
        {MARKS.map((mark) => (
          <span
            key={mark.id}
            className={mark.whisper ? "rdot is-whisper" : "rdot"}
            style={{ top: `${mark.p * 100}%` }}
          />
        ))}
        <span ref={rnowRef} className="rnow" />
      </div>

      <main ref={scrollerRef} className={indexOpen ? "scroller is-locked" : "scroller"}>
        <div className="track">
          <div ref={zeroRef} className="sentinel" style={{ top: `${FOCUS_VH}vh` }} />
          <div
            ref={oneRef}
            className="sentinel"
            style={{ top: `calc(${FOCUS_VH}vh + ${SPAN_VH}vh)` }}
          />
          <section className="opening">
            <div className="column">
              <p className="kicker">AD CENTRUM</p>
              <h1>直至银心</h1>
              <p className="lead">六千三百七十一公里。海面以下，有一把尺子停在地心。</p>
              <p className="lead">这一程把尺子翻过来。从铁的中心向外，直到银河自己的中心。</p>
              <p className="hint">
                <span className="hint-line" aria-hidden="true" />
                向下滚动
              </p>
            </div>
          </section>
          {MARKS.map((mark) => (
            <article
              key={mark.id}
              className={
                mark.whisper ? "station is-whisper" : mark.pivot ? "station is-pivot" : "station"
              }
              style={{ top: `calc(${FOCUS_VH}vh + ${mark.p} * ${SPAN_VH}vh)` }}
              ref={(node) => {
                if (node) markEls.current.set(mark.id, node);
                else markEls.current.delete(mark.id);
              }}
            >
              <div className="station-inner">
                {mark.whisper ? null : <div className="rule" aria-hidden="true" />}
                {mark.kicker ? <p className="kicker">{mark.kicker}</p> : null}
                <h2>{mark.title}</h2>
                <p className="line">{mark.line}</p>
                {mark.fact ? <p className="fact">{mark.fact}</p> : null}
                {mark.id === "sgr" ? (
                  <p className="colo">
                    尺子停在这里。地心在后面，小得无法再被提起。形制向 depths.world
                    的垂直尺子致谢。数字取自公开的地球物理与天体测量；奥尔特云与旋臂仍有不确定。这不是航线。银心在人马座方向，太阳不在这把尺上。
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </main>

      {indexOpen ? (
        <div
          className="index"
          role="dialog"
          aria-modal="true"
          aria-label="刻度"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIndexOpen(false);
          }}
        >
          <div className="index-panel">
            <div className="index-head">
              <h2>刻度</h2>
              <button ref={closeRef} type="button" onClick={() => setIndexOpen(false)}>
                关闭
              </button>
            </div>
            <ul className="index-list">
              {MARKS.map((mark) => (
                <li key={mark.id}>
                  <button type="button" onClick={() => jump(mark.p)}>
                    <span className="t">{mark.title}</span>
                    <span className="d">{formatDistanceShort(mark.km)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="keys">方向键、空格行走。右侧刻度可拖动。</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
