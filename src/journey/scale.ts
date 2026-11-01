export const AU_KM = 149_597_870.7;
export const LY_KM = 9_460_730_472_580.8;
export const GC_LY = 26_996;

/** Scroll span of the ruler, in vh. Marks sit at top: calc(32vh + p * SPAN_VH). */
export const SPAN_VH = 6000;
export const FOCUS_VH = 32;

export type Anchor = { p: number; km: number };

export function kmAt(p: number, anchors: readonly Anchor[]): number {
  const t = clamp01(p);
  if (anchors.length === 0) return 0;
  if (t <= anchors[0].p) return anchors[0].km;
  const last = anchors[anchors.length - 1];
  if (t >= last.p) return last.km;
  for (let i = 1; i < anchors.length; i++) {
    const b = anchors[i];
    if (t > b.p) continue;
    const a = anchors[i - 1];
    const u = (t - a.p) / (b.p - a.p);
    if (a.km <= 0) return b.km * u;
    return Math.exp(Math.log(a.km) + (Math.log(b.km) - Math.log(a.km)) * u);
  }
  return last.km;
}

export function formatDistance(km: number): { value: string; unit: string } {
  if (km < 0.5) return { value: "0", unit: "公里 · 距地心" };
  if (km < 3_000_000) return { value: groupInt(km), unit: "公里 · 距地心" };
  if (km < 0.2 * LY_KM) {
    const au = km / AU_KM;
    return { value: formatAu(au), unit: "天文单位 · 距地心" };
  }
  const ly = km / LY_KM;
  return { value: formatLy(ly), unit: "光年 · 距地心" };
}

export function formatDistanceShort(km: number): string {
  const f = formatDistance(km);
  const unit = f.unit.split("·")[0]?.trim() ?? f.unit;
  return `${f.value} ${unit}`;
}

export function formatLight(km: number): string {
  if (km < 1) return "光行 —";
  const s = km / 299792.458;
  if (s < 1) return `光行 ${Math.round(s * 1000)} 毫秒`;
  if (s < 90) return `光行 ${trimNum(s, 1)} 秒`;
  if (s < 5400) return `光行 ${trimNum(s / 60, 1)} 分钟`;
  if (s < 172800) return `光行 ${trimNum(s / 3600, 1)} 小时`;
  if (s < 86400 * 365.25 * 2) return `光行 ${trimNum(s / 86400, 1)} 天`;
  const y = s / (86400 * 365.25);
  if (y < 100) return `光行 ${trimNum(y, y < 10 ? 2 : 1)} 年`;
  return `光行 ${groupInt(y)} 年`;
}

export function stratumOf(km: number): string {
  if (km < 1) return "地心";
  if (km < 1221) return "内核";
  if (km < 3480) return "外核";
  if (km < 6330) return "地幔";
  if (km < 6352) return "地壳";
  if (km < 6366) return "海沟";
  if (km < 6376) return "海平面";
  if (km < 6383) return "对流层";
  if (km < 6471) return "高层大气";
  if (km < 50_000) return "近地";
  if (km < 384_400) return "地月之间";
  if (km < AU_KM) return "内太阳系";
  if (km < 30 * AU_KM) return "太阳系";
  if (km < 150 * AU_KM) return "日球层外";
  if (km < 2_000 * AU_KM) return "深空";
  if (km < LY_KM) return "奥尔特云";
  if (km < 10 * LY_KM) return "邻近恒星";
  if (km < 500 * LY_KM) return "本地泡";
  if (km < 6_500 * LY_KM) return "银河盘";
  if (km < 22_000 * LY_KM) return "向银心";
  return "银心";
}

function formatAu(au: number): string {
  if (au < 10) return trimNum(au, 2);
  if (au < 100) return trimNum(au, 1);
  return groupInt(au);
}

function formatLy(ly: number): string {
  if (ly < 10) return trimNum(ly, 2);
  if (ly < 100) return trimNum(ly, 1);
  return groupInt(ly);
}

function groupInt(n: number): string {
  const s = Math.abs(Math.round(n)).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function trimNum(n: number, digits: number): string {
  return n.toFixed(digits);
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}
