import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DOgaU-26.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AU_KM = 149597870.7;
var LY_KM = 9460730472580.8;
var GC_LY = 26996;
/** Scroll span of the ruler, in vh. Marks sit at top: calc(32vh + p * SPAN_VH). */
var SPAN_VH = 6e3;
function kmAt(p, anchors) {
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
function formatDistance(km) {
	if (km < .5) return {
		value: "0",
		unit: "公里 · 距地心"
	};
	if (km < 3e6) return {
		value: groupInt(km),
		unit: "公里 · 距地心"
	};
	if (km < 1892146094516.1602) return {
		value: formatAu(km / AU_KM),
		unit: "天文单位 · 距地心"
	};
	return {
		value: formatLy(km / LY_KM),
		unit: "光年 · 距地心"
	};
}
function formatDistanceShort(km) {
	const f = formatDistance(km);
	const unit = f.unit.split("·")[0]?.trim() ?? f.unit;
	return `${f.value} ${unit}`;
}
function formatLight(km) {
	if (km < 1) return "光行 —";
	const s = km / 299792.458;
	if (s < 1) return `光行 ${Math.round(s * 1e3)} 毫秒`;
	if (s < 90) return `光行 ${trimNum(s, 1)} 秒`;
	if (s < 5400) return `光行 ${trimNum(s / 60, 1)} 分钟`;
	if (s < 172800) return `光行 ${trimNum(s / 3600, 1)} 小时`;
	if (s < 63115200) return `光行 ${trimNum(s / 86400, 1)} 天`;
	const y = s / 31557600;
	if (y < 100) return `光行 ${trimNum(y, y < 10 ? 2 : 1)} 年`;
	return `光行 ${groupInt(y)} 年`;
}
function stratumOf(km) {
	if (km < 1) return "地心";
	if (km < 1221) return "内核";
	if (km < 3480) return "外核";
	if (km < 6330) return "地幔";
	if (km < 6352) return "地壳";
	if (km < 6366) return "海沟";
	if (km < 6376) return "海平面";
	if (km < 6383) return "对流层";
	if (km < 6471) return "高层大气";
	if (km < 5e4) return "近地";
	if (km < 384400) return "地月之间";
	if (km < 149597870.7) return "内太阳系";
	if (km < 4487936121) return "太阳系";
	if (km < 22439680605) return "日球层外";
	if (km < 299195741400) return "深空";
	if (km < 9460730472580.8) return "奥尔特云";
	if (km < 94607304725808) return "邻近恒星";
	if (km < 4730365236290400) return "本地泡";
	if (km < 0xda7925c65ecbe8) return "银河盘";
	if (km < 0x2e372a73cf214a0) return "向银心";
	return "银心";
}
function formatAu(au) {
	if (au < 10) return trimNum(au, 2);
	if (au < 100) return trimNum(au, 1);
	return groupInt(au);
}
function formatLy(ly) {
	if (ly < 10) return trimNum(ly, 2);
	if (ly < 100) return trimNum(ly, 1);
	return groupInt(ly);
}
function groupInt(n) {
	return Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function trimNum(n, digits) {
	return n.toFixed(digits);
}
function clamp01(n) {
	if (n < 0) return 0;
	if (n > 1) return 1;
	return n;
}
var ly = (n) => n * LY_KM;
var au = (n) => n * AU_KM;
var MARKS = [
	{
		id: "core",
		p: .0226,
		km: 0,
		kicker: "内核",
		title: "地心",
		pivot: true,
		line: "有一把尺子从海面落到这里，然后停住。铁还在，光还没有路程。",
		fact: "内核以铁镍为主，半径约 1 221 公里。中心温度约 5 700 °C，与太阳表面同级；压强约 360 吉帕。这里的铁是固体。"
	},
	{
		id: "lehmann",
		p: .05,
		km: 1221,
		kicker: "莱曼界面 · 1936",
		title: "固态与液态",
		line: "地震波在这里忽然加快。英厄·莱曼从那一阵加速里，读出了一颗固体的心。",
		fact: "内核边界距地心约 1 221 公里。边界之外是熔融的铁，地磁场在那一层液态金属的对流里生成。"
	},
	{
		id: "gutenberg",
		p: .0774,
		km: 3480,
		kicker: "古登堡界面",
		title: "地核结束",
		line: "液态铁到此为止。再往外，是岩石以地质的速度在爬。",
		fact: "核幔边界距地心约 3 480 公里，也就是海面下约 2 890 公里。横波过不了外核，纵波则会放慢。"
	},
	{
		id: "moho",
		p: .1048,
		km: 6336,
		kicker: "莫霍面",
		title: "地壳",
		line: "地幔用完了它的厚度。剩下薄薄一层，托住海和我们。",
		fact: "莫霍洛维奇不连续面在大洋下大约 5 到 10 公里，在高山下可以深到 70 公里。平均说来，岩石的外皮已经很近。"
	},
	{
		id: "trench",
		p: .1323,
		km: 6360,
		kicker: "挑战者深渊 · 海面下 10.9 公里",
		title: "从海沟下面经过",
		line: "那把向下的尺子在这片黑里停留过。我们从岩石这一侧经过，不再向下。",
		fact: "挑战者深渊水深约 10 935 米。此处距地心约 6 360 公里：海还在头顶，地心已经在背后。"
	},
	{
		id: "sea",
		p: .1645,
		km: 6371,
		kicker: "海平面",
		title: "回到海面",
		pivot: true,
		line: "同一条海平线，两把方向相反的尺子。向下的那把在地心停过。这一把从这里继续向外。",
		fact: "地球平均半径 6 371 公里。海面之上不再有岩石替你挡光。你已经在宇宙里了，只是还没离开空气。"
	},
	{
		id: "tropo",
		p: .1919,
		km: 6382,
		kicker: "对流层顶 · 约 11 公里",
		title: "天气的天花板",
		line: "云、雨、航线，都住在这一层薄薄的呼吸里。",
		fact: "对流层集中了大气大约四分之三的质量。再往上，气温不再随高度下降。"
	},
	{
		id: "karman",
		p: .2194,
		km: 6471,
		kicker: "卡门线 · 100 公里",
		title: "航空在此停业",
		line: "一百公里。一条约定，不是一堵墙。翅膀没用了，往后只剩下速度。",
		fact: "国际航空联合会把 100 公里当作大气与太空的边界。空气还在，只是稀得托不住机翼。距地心 6 471 公里。"
	},
	{
		id: "iss",
		p: .2484,
		km: 6791,
		kicker: "轨道高度约 420 公里",
		title: "空间站",
		line: "有人在这里每九十分钟看一次日出。",
		fact: "国际空间站距地心约 6 790 公里。它不在远处。它只是刚好没掉下来。"
	},
	{
		id: "geo",
		p: .279,
		km: 42164,
		kicker: "地球同步轨道",
		title: "停在天上的一天",
		line: "一天绕地一圈。于是对地面而言，它一动不动。",
		fact: "地球同步轨道距地心 42 164 公里，离海面约 35 786 公里。气象卫星和许多通信卫星停在这条环上。"
	},
	{
		id: "moon",
		p: .3161,
		km: 384400,
		kicker: "地月平均距离",
		title: "月球",
		line: "光从这里走到瞳孔，只要一秒多一点。潮汐是它把手放在海上。",
		fact: "地月平均距离 384 400 公里，约 1.28 光秒。月球正以每年约 3.8 厘米远离地球。"
	},
	{
		id: "l1",
		p: .3484,
		km: 15e5,
		kicker: "日地 L1",
		title: "始终看着太阳的位置",
		line: "在地球与太阳之间，有一个点可以跟着地球一起转，而不掉向任何一边。",
		fact: "日地第一拉格朗日点距地球约 150 万公里。SOHO 与 DSCOVR 停在附近，替地面盯着太阳风。"
	},
	{
		id: "sun",
		p: .3903,
		km: AU_KM,
		kicker: "1 天文单位",
		title: "八分钟的光",
		pivot: true,
		line: "这是地球平时与太阳的距离。你并没有撞上太阳。银心不在太阳那个方向。尺子只是走到了同样的长度。",
		fact: "1 天文单位 = 149 597 870.7 公里。阳光到地球约 8 分 20 秒。太阳半径 69.6 万公里，还不到这把尺子的两百分之一。"
	},
	{
		id: "jupiter",
		p: .4258,
		km: au(5.2),
		kicker: "5.2 天文单位 · 距太阳",
		title: "木星的距离",
		line: "一颗把许多彗星甩开的行星。它的磁层本身就是一小片天气。",
		fact: "木星与太阳的平均距离约 5.2 天文单位。光从太阳到木星大约 43 分钟。"
	},
	{
		id: "neptune",
		p: .4613,
		km: au(30.07),
		kicker: "30 天文单位",
		title: "海王星",
		line: "大行星的最后一站。再往外，轨道上主要是冰，和还没回来的探测器。",
		fact: "海王星距太阳约 30.1 天文单位。旅行者二号在 1989 年飞掠之后，再没有航天器近访过它。"
	},
	{
		id: "helio",
		p: .4968,
		km: au(121),
		kicker: "约 121 天文单位 · 2012",
		title: "日球层顶",
		line: "太阳风在这里停住，把路让给星际介质。一颗恒星的呼吸有了边界。",
		fact: "旅行者一号于 2012 年 8 月在约 121 天文单位处穿过日球层顶。外面的带电粒子不再来自太阳。"
	},
	{
		id: "voyager",
		p: .5387,
		km: au(172),
		kicker: "旅行者一号 · 2026 年前后",
		title: "最远的仪器",
		line: "人类送得最远的机器。电力每年弱一点。黄金唱片还在转的那一边。",
		fact: "旅行者一号 1977 年出发。到 2026 年前后，它大约在 172 天文单位外，信号单程已近 24 小时。唱片上录了五十五种人类语言，以及鲸。"
	},
	{
		id: "ice",
		p: .5968,
		km: au(2e3),
		title: "还没还清的冰",
		whisper: true,
		line: "太阳风的边境已经过去。再往外很长一段，是太阳系尚未清点完的冰。没有谁的轨道可以再借用。"
	},
	{
		id: "oort",
		p: .6484,
		km: au(5e4),
		kicker: "理论中的结构",
		title: "奥尔特云",
		line: "一圈还没被直接看见的冰。长周期彗星从这里被轻轻推一把，然后记起太阳。",
		fact: "奥尔特云仍是理论：内缘大约两三千天文单位，外缘或可延伸到约十万天文单位，接近一光年。没有飞船到过。这里取大约五万天文单位，当作它的尺度，不是一堵墙。"
	},
	{
		id: "ly",
		p: .7,
		km: LY_KM,
		kicker: "光走一年的长度",
		title: "一光年",
		line: "光不休息地走一年。到了这个刻度，整个太阳系像一句没说完的话。",
		fact: "1 光年 = 9.46 万亿公里，约 63 241 天文单位。比邻星还要再走三倍多这样的路。"
	},
	{
		id: "dark",
		p: .7613,
		km: ly(2.2),
		title: "中间没有站",
		whisper: true,
		line: "最近的另一颗恒星还不在这条线上。最近，也不等于同路。"
	},
	{
		id: "proxima",
		p: .8097,
		km: ly(4.246),
		kicker: "4.25 光年 · 不在银心方向",
		title: "比邻星",
		line: "离太阳最近的恒星，在半人马座。银心在人马座。两件事情只是差不多远到可以相提并论。",
		fact: "比邻星是半人马座 α 三合星里的红矮星，距离 4.246 光年。2016 年确认的比邻星 b，轨道在宜居带边缘。"
	},
	{
		id: "bubble",
		p: .8484,
		km: ly(300),
		kicker: "太阳所在的空腔",
		title: "本地泡",
		line: "太阳住在一个相对空的洞穴里。洞壁是更早的超新星吹出来的。",
		fact: "本地泡宽约数百光年，里面的气体比周围的星际介质更稀、更热。太阳正穿过这个空腔，而不是穿过一条密实的云。"
	},
	{
		id: "orion",
		p: .8806,
		km: ly(1344),
		kicker: "M42 · 旁边的灯",
		title: "猎户的尺度",
		line: "猎户大星云在这个距离上发光。不是路上的站，是旁边一盏很亮的灯。",
		fact: "猎户座大星云距离太阳约 1 340 光年，是离我们最近的大质量恒星形成区之一。它不在银心方向。尺子走到同样的长度时，顺便把这盏灯记下。"
	},
	{
		id: "arm",
		p: .9129,
		km: ly(6520),
		kicker: "向内约 2 千秒差距",
		title: "人马臂",
		line: "太阳在猎户支臂上。朝银心看，下一条主要旋臂是人马臂。尘埃把大部分光吃掉了。",
		fact: "人马臂大约在向银心一侧 2 千秒差距处，约 6 500 光年。太阳在银道面以北大约几十光年。再往里，是盾牌–半人马臂、银河棒，然后才是核球。太阳带着地球绕银心一周，大约两亿三千万年。"
	},
	{
		id: "dust",
		p: .9419,
		km: ly(2e4),
		kicker: "银道面里的消光",
		title: "尘埃把中心藏起来",
		line: "光学望远镜到这里大体就盲了。红外和射电还看得见。银河的中心是被自己挡住的。",
		fact: "朝人马座望去，可见光可被尘埃削弱数十个星等。中央分子区与人马座 A* 是靠近红外、射电和 X 射线一点点看清的。此节取两万光年，当作尘埃带的深处，不是一条突然的边界。"
	},
	{
		id: "sgr",
		p: .9742,
		km: ly(GC_LY),
		kicker: "人马座 A*",
		title: "银心",
		pivot: true,
		line: "四百三十万个太阳，收成一枚比水星轨道更小的暗。你看见的光动身时，末次冰期还在加深。",
		fact: "人马座 A* 距离太阳 8 277 秒差距，即 26 996 光年；质量约 4.297 × 10⁶ 太阳质量。事件视界半径约 1 270 万公里，大约十八个太阳半径。恒星 S2 大约每十六年绕它一圈。2022 年，事件视界望远镜发布了它的阴影。"
	}
];
var AT = {};
for (const m of MARKS) AT[m.id] = m.p;
var STOPS = [
	{
		p: 0,
		bg: [
			14,
			6,
			3
		],
		mid: [
			86,
			30,
			12
		],
		hot: [
			255,
			188,
			120
		]
	},
	{
		p: .1,
		bg: [
			22,
			8,
			4
		],
		mid: [
			72,
			22,
			10
		],
		hot: [
			220,
			90,
			42
		]
	},
	{
		p: .16,
		bg: [
			3,
			14,
			22
		],
		mid: [
			10,
			42,
			58
		],
		hot: [
			140,
			196,
			206
		]
	},
	{
		p: .26,
		bg: [
			2,
			6,
			14
		],
		mid: [
			8,
			22,
			42
		],
		hot: [
			186,
			206,
			220
		]
	},
	{
		p: .42,
		bg: [
			6,
			4,
			2
		],
		mid: [
			36,
			18,
			8
		],
		hot: [
			255,
			196,
			120
		]
	},
	{
		p: .58,
		bg: [
			1,
			2,
			8
		],
		mid: [
			8,
			12,
			24
		],
		hot: [
			170,
			190,
			214
		]
	},
	{
		p: .8,
		bg: [
			2,
			3,
			8
		],
		mid: [
			18,
			12,
			16
		],
		hot: [
			214,
			186,
			150
		]
	},
	{
		p: .93,
		bg: [
			8,
			4,
			3
		],
		mid: [
			42,
			16,
			8
		],
		hot: [
			255,
			160,
			80
		]
	},
	{
		p: 1,
		bg: [
			0,
			0,
			0
		],
		mid: [
			14,
			4,
			2
		],
		hot: [
			255,
			120,
			48
		]
	}
];
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var rand = mulberry32(5357790);
var NOISE = /* @__PURE__ */ new Float32Array(256);
for (let i = 0; i < 256; i++) NOISE[i] = rand();
function n1(x) {
	const i = Math.floor(x) & 255;
	const f = x - Math.floor(x);
	const u = f * f * (3 - 2 * f);
	return NOISE[i] * (1 - u) + NOISE[i + 1 & 255] * u;
}
function smooth(edge0, edge1, x) {
	const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
	return t * t * (3 - 2 * t);
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function sample(p) {
	let i = 1;
	while (i < STOPS.length && STOPS[i].p < p) i++;
	const b = STOPS[Math.min(i, STOPS.length - 1)];
	const a = STOPS[Math.max(0, i - 1)];
	const t = a === b ? 0 : (p - a.p) / (b.p - a.p);
	const mix = (x, y) => [
		lerp(x[0], y[0], t),
		lerp(x[1], y[1], t),
		lerp(x[2], y[2], t)
	];
	return {
		bg: mix(a.bg, b.bg),
		mid: mix(a.mid, b.mid),
		hot: mix(a.hot, b.hot)
	};
}
function rgb(c, a = 1) {
	return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}
function fadeIn(p, a, b) {
	return smooth(a, b, p);
}
function fadeOut(p, a, b) {
	return 1 - smooth(a, b, p);
}
/** Ahead (larger q) sits lower and rises as p increases — same way the stations travel. */
function qY(q, p, h, focus = .74, scale = 10) {
	return h * (focus + (q - p) * scale);
}
var DRIFTERS = [
	{
		q: AT.trench + .004,
		x: .78,
		s: 1,
		kind: 0,
		ph: .2
	},
	{
		q: AT.trench + .012,
		x: .3,
		s: .85,
		kind: 3,
		ph: 1.1
	},
	{
		q: AT.trench + .018,
		x: .62,
		s: 1.15,
		kind: 1,
		ph: 2.2
	},
	{
		q: AT.sea - .018,
		x: .22,
		s: 1.35,
		kind: 2,
		ph: .4
	},
	{
		q: AT.sea - .012,
		x: .72,
		s: .7,
		kind: 1,
		ph: 1.6
	},
	{
		q: AT.sea - .006,
		x: .48,
		s: .9,
		kind: 1,
		ph: 2.8
	},
	{
		q: AT.sea - .002,
		x: .58,
		s: 1,
		kind: 4,
		ph: .8
	}
];
var FISH = Array.from({ length: 16 }, () => ({
	x: (rand() - .5) * .42,
	y: (rand() - .5) * .16,
	s: .55 + rand() * .7,
	ph: rand() * 6.28
}));
var CONTINENTS = [
	{
		x: .12,
		y: -.02,
		rx: .22,
		ry: .38,
		rot: .25
	},
	{
		x: .28,
		y: -.42,
		rx: .36,
		ry: .2,
		rot: -.35
	},
	{
		x: -.42,
		y: -.12,
		rx: .18,
		ry: .34,
		rot: .5
	},
	{
		x: .42,
		y: .28,
		rx: .2,
		ry: .12,
		rot: .4
	},
	{
		x: -.08,
		y: .36,
		rx: .16,
		ry: .1,
		rot: -.2
	}
];
var CLOUDS = Array.from({ length: 9 }, () => ({
	x: rand() * 1.6 - .3,
	y: (rand() - .5) * 1.3,
	rx: .16 + rand() * .28,
	ry: .05 + rand() * .08,
	rot: 0
}));
var CITIES = Array.from({ length: 36 }, () => {
	const a = rand() * Math.PI * 2;
	const r = Math.sqrt(rand()) * .72;
	return {
		x: -Math.abs(Math.cos(a) * r),
		y: Math.sin(a) * r * .85,
		b: rand()
	};
});
var CRATERS = Array.from({ length: 16 }, () => {
	const a = rand() * Math.PI * 2;
	const r = Math.sqrt(rand()) * .78;
	return {
		x: Math.cos(a) * r,
		y: Math.sin(a) * r,
		rx: .05 + rand() * .09,
		ry: .045 + rand() * .08,
		rot: rand() * 3
	};
});
var MARIA = [
	{
		x: -.22,
		y: .08,
		rx: .28,
		ry: .2,
		rot: .3
	},
	{
		x: .18,
		y: -.22,
		rx: .18,
		ry: .14,
		rot: -.4
	},
	{
		x: .05,
		y: .28,
		rx: .16,
		ry: .12,
		rot: .2
	},
	{
		x: -.35,
		y: -.28,
		rx: .12,
		ry: .1,
		rot: .5
	}
];
var ICES = Array.from({ length: 14 }, (_, i) => ({
	q: AT.ice + i / 14 * (AT.ly - AT.ice),
	x: .18 + rand() * .68,
	s: .45 + rand() * 1.15,
	ph: rand() * 6.28,
	n: 3 + rand() * 3 | 0
}));
var STARS = Array.from({ length: 460 }, () => ({
	x: rand(),
	y: rand(),
	z: .15 + rand() * .85,
	s: rand() < .08 ? 1.8 + rand() * 1.6 : .45 + rand() * 1.35,
	warm: rand(),
	n: rand()
}));
function earthGeom(p, w, h) {
	const m = Math.min(w, h);
	const t = Math.min(1, Math.max(0, (p - (AT.sea + .028)) / (AT.moon - AT.sea - .03)));
	const k = Math.pow(t, .8);
	const R = m * (.9 * (1 - k) + .1 * k);
	let y = h * (.9 - .24 * k) + R * .12 * (1 - k);
	const limb = y - R;
	if (limb < h * .5) y += h * .5 - limb;
	return {
		x: w * (.5 + .22 * k),
		y,
		R,
		k
	};
}
function shadeSphere(ctx, x, y, R, hx, hy) {
	const g = ctx.createRadialGradient(x - R * hx, y - R * hy, R * .08, x, y, R);
	g.addColorStop(0, "rgba(255,255,255,0.22)");
	g.addColorStop(.45, "rgba(255,255,255,0)");
	g.addColorStop(1, "rgba(0,0,0,0.45)");
	ctx.fillStyle = g;
	ctx.beginPath();
	ctx.arc(x, y, R, 0, Math.PI * 2);
	ctx.fill();
}
function drawInner(ctx, w, h, p, time) {
	ctx.fillStyle = "#140604";
	ctx.fillRect(0, 0, w, h);
	const m = Math.min(w, h);
	const u = smooth(0, AT.lehmann, p);
	const R = m * lerp(.46, .62, u);
	const cx = w * .52;
	const cy = h * lerp(.9, .62, u);
	const spin = time * .05 + p * 12;
	const glow = ctx.createRadialGradient(cx, cy, R * .2, cx, cy, R * 1.35);
	glow.addColorStop(0, "rgba(255,150,70,0.55)");
	glow.addColorStop(.4, "rgba(180,50,16,0.28)");
	glow.addColorStop(1, "rgba(20,6,4,0)");
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, w, h);
	ctx.save();
	ctx.beginPath();
	ctx.arc(cx, cy, R, 0, Math.PI * 2);
	ctx.clip();
	const core = ctx.createRadialGradient(cx - R * .2, cy - R * .25, R * .05, cx, cy, R);
	core.addColorStop(0, "#ffe0b0");
	core.addColorStop(.18, "#ff9a45");
	core.addColorStop(.55, "#c2410c");
	core.addColorStop(1, "#3a0c06");
	ctx.fillStyle = core;
	ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
	for (let i = 0; i < 16; i++) {
		const a0 = spin + i / 16 * Math.PI * 2;
		const a1 = spin + (i + 1) / 16 * Math.PI * 2 + .08;
		const r0 = R * (.42 + n1(i * 1.7) * .55);
		const r1 = R * (.5 + n1(i * 2.3 + 4) * .5);
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		ctx.lineTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0);
		ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
		ctx.closePath();
		const hot = .35 + .65 * n1(i * 3.1 + spin);
		ctx.fillStyle = `rgba(${70 + hot * 170},${22 + hot * 55},10,${.28 + hot * .28})`;
		ctx.fill();
	}
	ctx.strokeStyle = "rgba(255,214,170,0.45)";
	ctx.lineWidth = 1.25;
	for (let i = 0; i < 5; i++) {
		const a = spin * .7 + i * 1.3;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * R * .1, cy + Math.sin(a) * R * .1);
		ctx.quadraticCurveTo(cx + Math.cos(a + .6) * R * .55, cy + Math.sin(a + .4) * R * .4, cx + Math.cos(a + 1.1) * R * .92, cy + Math.sin(a + .9) * R * .92);
		ctx.stroke();
	}
	ctx.restore();
	ctx.strokeStyle = "rgba(255,186,120,0.35)";
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(cx, cy, R * 1.01, 0, Math.PI * 2);
	ctx.stroke();
	for (let i = 0; i < 18; i++) {
		const rise = (time * .04 * (.4 + n1(i)) + n1(i + 8)) % 1;
		const ang = n1(i + 3) * 6.28;
		ctx.fillStyle = `rgba(255,${140 + n1(i) * 80},60,${(1 - rise) * .65})`;
		const px = cx + Math.cos(ang) * R * (.2 + n1(i + 5) * .9);
		const py = cy - rise * R * 1.3 + Math.sin(ang) * 10;
		ctx.fillRect(px, py, 2.2, 2.2);
	}
}
function wavyFill(ctx, w, y0, y1, color, seed, amp) {
	ctx.beginPath();
	ctx.moveTo(0, y0);
	for (let x = 0; x <= w; x += 20) ctx.lineTo(x, y0 + Math.sin(x * .012 + seed) * amp + (n1(x * .02 + seed) - .5) * amp);
	ctx.lineTo(w, y1 + amp);
	for (let x = w; x >= 0; x -= 20) ctx.lineTo(x, y1 + Math.sin(x * .015 + seed + 2) * amp * .65);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}
function drawOuter(ctx, w, h, p, time) {
	ctx.fillStyle = "#140403";
	ctx.fillRect(0, 0, w, h);
	const slide = (p - AT.lehmann) * h * 4.2 + time * 26;
	for (let i = 0; i < 5; i++) {
		const cy = ((i * .28 + .08) * h - slide * .35 + h * 3) % (h * 1.35) - h * .15;
		const cx = w * (.22 + i % 3 * .26);
		const R = Math.min(w, h) * (.2 + i % 2 * .1);
		const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, R);
		g.addColorStop(0, "rgba(255, 214, 150, 0.9)");
		g.addColorStop(.35, "rgba(255, 96, 28, 0.45)");
		g.addColorStop(1, "rgba(40, 8, 4, 0)");
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.arc(cx, cy, R, 0, Math.PI * 2);
		ctx.fill();
	}
	for (let i = 0; i < 7; i++) {
		const span = h * .2;
		const y = i * span - slide % span;
		ctx.beginPath();
		ctx.lineWidth = 8 + i % 3 * 7;
		ctx.strokeStyle = i % 2 === 0 ? "rgba(255, 168, 72, 0.82)" : "rgba(255, 78, 24, 0.7)";
		for (let x = 0; x <= w; x += 12) {
			const yy = y + Math.sin(x * .0075 + time * .45 + i) * (20 + i % 3 * 8) + Math.sin(x * .02 + i) * 7;
			if (x === 0) ctx.moveTo(x, yy);
			else ctx.lineTo(x, yy);
		}
		ctx.stroke();
		ctx.strokeStyle = "rgba(255, 236, 200, 0.35)";
		ctx.lineWidth = 1.5;
		ctx.stroke();
	}
	const remnant = 1 - smooth(AT.lehmann, AT.gutenberg - .006, p);
	if (remnant > .05) {
		const R = Math.min(w, h) * .18 * (.45 + remnant);
		const cx = w * .5;
		const cy = h * .8;
		const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
		g.addColorStop(0, `rgba(255, 230, 190, ${.95 * remnant})`);
		g.addColorStop(.45, `rgba(240, 110, 36, ${.7 * remnant})`);
		g.addColorStop(1, "rgba(80, 16, 6, 0)");
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.arc(cx, cy, R, 0, Math.PI * 2);
		ctx.fill();
	}
}
var MANTLE = [
	"#100c09",
	"#4a2c18",
	"#1c3326",
	"#7a4e2a",
	"#16120e",
	"#3d2818",
	"#24362a",
	"#a06838"
];
var CRUST = [
	"#1e1c18",
	"#5a5044",
	"#2a3330",
	"#6e624f",
	"#26221c",
	"#3e4844",
	"#8a7a64",
	"#141210"
];
function drawRock(ctx, w, h, p, time, colors, anchor, gems) {
	ctx.fillStyle = colors[0];
	ctx.fillRect(0, 0, w, h);
	const slide = (p - anchor) * h * 7;
	const spacing = h * .22;
	const first = Math.floor(slide / spacing) - 2;
	const last = first + Math.ceil(h / spacing) + 5;
	for (let i = first; i <= last; i++) {
		const y0 = i * spacing - slide;
		wavyFill(ctx, w, y0, y0 + spacing * (.72 + Math.abs(i) % 3 * .12), colors[Math.abs(i) % colors.length], i * 1.7, 14 + Math.abs(i) % 4 * 4);
	}
	ctx.strokeStyle = "rgba(0,0,0,0.35)";
	ctx.lineWidth = 10;
	ctx.beginPath();
	const fault = slide * .15 % (h * .5);
	let y = -h * .2 + fault;
	ctx.moveTo(w * .7, y);
	for (let i = 0; i < 10; i++) {
		y += h * .16;
		ctx.lineTo(w * (.64 + i % 2 * .1), y);
	}
	ctx.stroke();
	if (gems) {
		ctx.fillStyle = "rgba(150,170,110,0.55)";
		for (let i = 0; i < 8; i++) {
			const gy = qY(anchor + .004 * i, p, h, .2 + n1(i) * .9, 8);
			const gx = w * (.15 + n1(i + 4) * .7);
			ctx.save();
			ctx.translate(gx, gy);
			ctx.rotate(time * .05 + i);
			ctx.beginPath();
			ctx.moveTo(0, -7);
			ctx.lineTo(5, 0);
			ctx.lineTo(0, 7);
			ctx.lineTo(-5, 0);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
	} else {
		ctx.save();
		ctx.translate(w * .32, qY(AT.moho - .004, p, h, .8, 9));
		ctx.strokeStyle = "rgba(90,70,54,0.8)";
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		for (let i = 0; i < 48; i++) {
			const a = i / 48 * Math.PI * 5.2;
			const rad = 4 + i * .55;
			const px = Math.cos(a) * rad;
			const py = Math.sin(a) * rad * .7;
			if (i === 0) ctx.moveTo(px, py);
			else ctx.lineTo(px, py);
		}
		ctx.stroke();
		ctx.restore();
	}
}
function drawFish(ctx, x, y, s, dir) {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(dir * s, s);
	ctx.beginPath();
	ctx.moveTo(14, 0);
	ctx.quadraticCurveTo(2, 7, -8, 2);
	ctx.lineTo(-15, 7);
	ctx.lineTo(-11, 0);
	ctx.lineTo(-15, -7);
	ctx.lineTo(-8, -2);
	ctx.quadraticCurveTo(2, -7, 14, 0);
	ctx.fill();
	ctx.restore();
}
function drawJelly(ctx, x, y, s, time, ph) {
	const wob = Math.sin(time * 1.3 + ph);
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "rgba(186, 230, 226, 0.55)";
	ctx.beginPath();
	ctx.ellipse(0, 0, s * 16, s * (9 + wob * 2), 0, Math.PI, 0, true);
	ctx.fill();
	ctx.strokeStyle = "rgba(200, 240, 236, 0.45)";
	ctx.lineWidth = 1.2;
	for (let i = -2; i <= 2; i++) {
		ctx.beginPath();
		ctx.moveTo(i * s * 6, s * 2);
		ctx.quadraticCurveTo(i * s * 8 + wob * 8, s * 28, i * s * 3, s * 48);
		ctx.stroke();
	}
	ctx.restore();
}
function drawWhale(ctx, x, y, s, time) {
	const wag = Math.sin(time * .7) * .12;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(-.06);
	ctx.fillStyle = "rgba(6, 16, 22, 0.94)";
	ctx.beginPath();
	ctx.ellipse(0, 0, s * 86, s * 24, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "rgba(150, 206, 214, 0.55)";
	ctx.lineWidth = 1.6;
	ctx.stroke();
	ctx.fillStyle = "rgba(12, 32, 42, 0.95)";
	ctx.beginPath();
	ctx.ellipse(s * 30, -s * 2, s * 36, s * 16, .05, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(8, 20, 28, 0.95)";
	ctx.save();
	ctx.translate(-s * 74, 0);
	ctx.rotate(wag);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.quadraticCurveTo(-s * 28, -s * 26, -s * 8, -s * 34);
	ctx.quadraticCurveTo(-s * 18, -s * 8, 0, 0);
	ctx.quadraticCurveTo(-s * 18, s * 8, -s * 8, s * 34);
	ctx.quadraticCurveTo(-s * 28, s * 26, 0, 0);
	ctx.fill();
	ctx.restore();
	ctx.beginPath();
	ctx.ellipse(s * 8, s * 14, s * 16, s * 5, .9, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(210, 230, 234, 0.8)";
	ctx.beginPath();
	ctx.arc(s * 48, -s * 4, s * 1.6, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function drawAngler(ctx, x, y, s, time) {
	const lure = Math.sin(time * 1.6) * 4;
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "#061016";
	ctx.beginPath();
	ctx.ellipse(0, 0, s * 26, s * 14, .1, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(s * 18, 0);
	ctx.lineTo(s * 34, s * 8);
	ctx.lineTo(s * 18, s * 4);
	ctx.fill();
	ctx.strokeStyle = "rgba(180,220,210,0.7)";
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(-s * 6, -s * 12);
	ctx.quadraticCurveTo(-s * 20, -s * 36, -s * 4 + lure, -s * 48);
	ctx.stroke();
	ctx.fillStyle = `rgba(140, 255, 220, ${.45 + .55 * Math.sin(time * 3)})`;
	ctx.beginPath();
	ctx.arc(-s * 4 + lure, -s * 48, s * 3.2, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(140,255,220,0.15)";
	ctx.beginPath();
	ctx.arc(-s * 4 + lure, -s * 48, s * 10, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function drawSub(ctx, x, y, s, time) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(Math.sin(time * .4) * .04);
	ctx.fillStyle = "#c4552a";
	ctx.beginPath();
	ctx.ellipse(0, 0, s * 28, s * 10, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#8a3018";
	ctx.fillRect(-s * 6, -s * 16, s * 10, s * 10);
	ctx.fillStyle = "#d8e6ea";
	ctx.beginPath();
	ctx.arc(s * 8, 0, s * 3.2, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = `rgba(255, 220, 160, ${.7 + Math.sin(time * 2) * .2})`;
	ctx.beginPath();
	ctx.arc(s * 26, s * 2, s * 2.1, 0, Math.PI * 2);
	ctx.arc(-s * 20, s * 3, s * 1.6, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function drawOcean(ctx, w, h, p, time) {
	const surface = h * (.58 + (p - AT.sea) * 12);
	const floor = h * (.9 + (p - AT.trench) * 8);
	const water = ctx.createLinearGradient(0, Math.min(surface, h), 0, h);
	water.addColorStop(0, "#1c7c96");
	water.addColorStop(.16, "#0f5570");
	water.addColorStop(.5, "#0a3348");
	water.addColorStop(1, "#061824");
	ctx.fillStyle = water;
	ctx.fillRect(0, 0, w, h);
	if (surface > -40 && surface < h + 80) {
		const sky = ctx.createLinearGradient(0, 0, 0, Math.max(surface, 1));
		sky.addColorStop(0, "#071422");
		sky.addColorStop(.7, "#16324a");
		sky.addColorStop(1, "#c47848");
		ctx.fillStyle = sky;
		ctx.fillRect(0, 0, w, Math.max(0, surface));
		const sunX = w * .72;
		const sunY = surface - h * .08;
		const sg = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, Math.min(w, h) * .18);
		sg.addColorStop(0, "rgba(255,236,210,0.95)");
		sg.addColorStop(.35, "rgba(255,170,90,0.45)");
		sg.addColorStop(1, "rgba(255,140,60,0)");
		ctx.fillStyle = sg;
		ctx.beginPath();
		ctx.arc(sunX, sunY, Math.min(w, h) * .18, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = "rgba(190, 230, 228, 0.55)";
		ctx.lineWidth = 1.6;
		for (let i = 0; i < 4; i++) {
			const y = surface + i * 7;
			ctx.beginPath();
			for (let x = 0; x <= w; x += 14) {
				const yy = y + Math.sin(x * .012 + time * .9 + i) * (5 + i * 1.5);
				if (x === 0) ctx.moveTo(x, yy);
				else ctx.lineTo(x, yy);
			}
			ctx.stroke();
		}
		ctx.fillStyle = "rgba(255, 210, 160, 0.18)";
		for (let i = 0; i < 8; i++) {
			const yy = surface + 24 + i * 22;
			ctx.beginPath();
			ctx.ellipse(sunX, yy, 18 - i, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	if (surface < h * .85) {
		ctx.strokeStyle = "rgba(180, 230, 220, 0.07)";
		ctx.lineWidth = 28;
		const origin = Math.max(surface, 0);
		for (let i = 0; i < 5; i++) {
			ctx.beginPath();
			ctx.moveTo(w * (.35 + i * .08), origin);
			ctx.lineTo(w * (.15 + i * .16), h);
			ctx.stroke();
		}
	}
	const trench = 1 - smooth(AT.trench, AT.sea - .008, p);
	if (trench > .04) {
		ctx.fillStyle = `rgba(5, 7, 8, ${.92 * trench})`;
		const inset = w * lerp(.3, .04, 1 - trench);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(inset, h * .25);
		ctx.lineTo(inset * .55, h);
		ctx.lineTo(0, h);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(w, 0);
		ctx.lineTo(w - inset * .85, h * .3);
		ctx.lineTo(w - inset * .4, h);
		ctx.lineTo(w, h);
		ctx.fill();
		ctx.strokeStyle = "rgba(70, 60, 50, 0.4)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(inset, h * .25);
		ctx.lineTo(inset * .55, h);
		ctx.moveTo(w - inset * .85, h * .3);
		ctx.lineTo(w - inset * .4, h);
		ctx.stroke();
	}
	if (floor > -20 && floor < h + 40) {
		ctx.fillStyle = "#12100e";
		ctx.beginPath();
		ctx.moveTo(0, h);
		for (let x = 0; x <= w; x += 18) ctx.lineTo(x, floor + Math.sin(x * .02) * 8 + (n1(x * .03) - .5) * 16);
		ctx.lineTo(w, h);
		ctx.fill();
		const vx = w * .62;
		const glow = ctx.createRadialGradient(vx, floor, 4, vx, floor, 70);
		glow.addColorStop(0, "rgba(255,140,60,0.65)");
		glow.addColorStop(1, "rgba(255,80,20,0)");
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(vx, floor, 70, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#1a1614";
		ctx.beginPath();
		ctx.moveTo(vx - 10, floor);
		ctx.lineTo(vx - 4, floor - 36);
		ctx.lineTo(vx + 2, floor - 18);
		ctx.lineTo(vx + 8, floor - 48);
		ctx.lineTo(vx + 14, floor);
		ctx.fill();
	}
	for (const d of DRIFTERS) {
		const y = qY(d.q, p, h, .7, 9);
		if (y < -80 || y > h + 80) continue;
		const x = w * d.x + Math.sin(time * .3 + d.ph) * 10;
		if (d.kind === 0) drawAngler(ctx, x, y, d.s, time);
		else if (d.kind === 1) drawJelly(ctx, x, y, d.s, time, d.ph);
		else if (d.kind === 2) drawWhale(ctx, x, y, d.s, time);
		else if (d.kind === 3) drawSub(ctx, x, y, d.s, time);
		else {
			ctx.fillStyle = "rgba(170, 214, 216, 0.8)";
			for (const f of FISH) drawFish(ctx, x + f.x * w + Math.sin(time * .8 + f.ph) * 8, y + f.y * h, f.s * .85, Math.sin(time * .5 + f.ph) > 0 ? 1 : -1);
		}
	}
	for (let i = 0; i < 40; i++) {
		const x = n1(i * 2.1) * w;
		const y = (n1(i * 1.3) + time * .015 * (.3 + n1(i)) + p) % 1 * h;
		ctx.fillStyle = `rgba(200,230,230,${.15 + n1(i + 5) * .35})`;
		ctx.fillRect(x, y, 1.5, 1.5);
	}
}
function drawSky(ctx, w, h, p, time) {
	const t = smooth(AT.sea, AT.karman, p);
	const top = lerp(10, 2, t);
	const mid = lerp(28, 8, t);
	const g = ctx.createLinearGradient(0, 0, 0, h);
	g.addColorStop(0, `rgb(${top * .4},${top * .6},${top + 8})`);
	g.addColorStop(.45, `rgb(${mid * .5},${mid},${mid + 18})`);
	g.addColorStop(.78, `rgb(${40 + t * 10},${70 - t * 30},${110 - t * 40})`);
	g.addColorStop(1, `rgb(${120 - t * 90},${90 - t * 60},${70 - t * 40})`);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
	const slide = (p - AT.tropo) * h * 5;
	ctx.fillStyle = "rgba(236, 240, 244, 0.78)";
	for (let i = 0; i < 6; i++) {
		const y = h * (.55 + i * .08) - slide;
		if (y < -40 || y > h + 30) continue;
		ctx.beginPath();
		ctx.ellipse(w * (.3 + i % 3 * .22), y, w * (.22 + i % 2 * .08), 16 + i % 3 * 6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(w * (.42 + i % 3 * .18), y + 4, w * .12, 12, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	if (t > .35) {
		ctx.fillStyle = `rgba(255,255,255,${(t - .35) * .25})`;
		for (let i = 0; i < 12; i++) ctx.fillRect(n1(i + 9) * w, n1(i * 3) * h * .5, 1.4, 1.4);
	}
}
function drawEarth(ctx, w, h, p, time) {
	const { x, y, R, k } = earthGeom(p, w, h);
	if (R < 2) return;
	const glow = ctx.createRadialGradient(x, y, R * .9, x, y, R * 1.22);
	glow.addColorStop(0, "rgba(0,0,0,0)");
	glow.addColorStop(.55, "rgba(120,190,210,0.35)");
	glow.addColorStop(.82, "rgba(230,150,80,0.28)");
	glow.addColorStop(1, "rgba(0,0,0,0)");
	ctx.fillStyle = glow;
	ctx.beginPath();
	ctx.arc(x, y, R * 1.22, 0, Math.PI * 2);
	ctx.fill();
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, R, 0, Math.PI * 2);
	ctx.clip();
	const sea = ctx.createRadialGradient(x - R * .2, y - R * .3, R * .1, x, y, R);
	sea.addColorStop(0, "#1f6f9a");
	sea.addColorStop(.6, "#0c3d62");
	sea.addColorStop(1, "#06243e");
	ctx.fillStyle = sea;
	ctx.fillRect(x - R, y - R, R * 2, R * 2);
	ctx.fillStyle = "#1e6a48";
	for (const c of CONTINENTS) {
		ctx.beginPath();
		ctx.ellipse(x + c.x * R, y + c.y * R, Math.abs(c.rx * R), Math.abs(c.ry * R), c.rot, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = "#174e36";
	ctx.beginPath();
	ctx.ellipse(x + R * .16, y - R * .05, R * .1, R * .2, .3, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(244,248,250,0.92)";
	ctx.beginPath();
	ctx.ellipse(x, y - R * .86, R * .22, R * .07, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(255,255,255,0.72)";
	for (const c of CLOUDS) {
		const ox = (c.x + time * .012) % 1.8 - .4;
		ctx.beginPath();
		ctx.ellipse(x + ox * R, y + c.y * R, c.rx * R, c.ry * R, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	const night = smooth(AT.karman, AT.geo, p);
	if (night > .02) {
		const sh = ctx.createLinearGradient(x - R, y, x + R * .15, y);
		sh.addColorStop(0, `rgba(0,4,12,${.9 * night})`);
		sh.addColorStop(.48, `rgba(0,4,12,${.25 * night})`);
		sh.addColorStop(.7, "rgba(0,0,0,0)");
		ctx.fillStyle = sh;
		ctx.fillRect(x - R, y - R, R * 2, R * 2);
		for (const c of CITIES) {
			if (c.x > -.05) continue;
			ctx.fillStyle = `rgba(255,196,120,${night * (.35 + c.b * .65)})`;
			ctx.fillRect(x + c.x * R, y + c.y * R, Math.max(1.2, R * .008), Math.max(1.2, R * .008));
		}
	}
	ctx.restore();
	if (k > .25 && k < .72) {
		ctx.strokeStyle = "rgba(210, 220, 230, 0.35)";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.ellipse(x, y, R * 1.45, R * .42, -.4, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fillStyle = "rgba(230,236,240,0.8)";
		for (let i = 0; i < 10; i++) {
			const a = i / 10 * Math.PI * 2 + time * .05;
			ctx.fillRect(x + Math.cos(a) * R * 1.45, y + Math.sin(a) * R * .42, 2.2, 2.2);
		}
	}
}
function drawIss(ctx, w, h, p, time) {
	const { x, y, R } = earthGeom(p, w, h);
	const s = Math.max(22, Math.min(w, h) * .06);
	const px = Math.min(w * .86, x + R * .22);
	const py = Math.max(h * .4, y - R - s * .15) + Math.sin(time * .4) * 3;
	ctx.save();
	ctx.translate(px, py);
	ctx.rotate(-.35);
	ctx.strokeStyle = "#d7dde2";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(-s * 1.6, 0);
	ctx.lineTo(s * 1.6, 0);
	ctx.stroke();
	ctx.fillStyle = "#e7e1c8";
	ctx.fillRect(-s * 1.55, -s * .55, s * .7, s * 1.1);
	ctx.fillRect(s * .85, -s * .55, s * .7, s * 1.1);
	ctx.fillStyle = "#c8d0d6";
	ctx.fillRect(-s * .45, -s * .16, s * .9, s * .32);
	ctx.fillStyle = "#9aa6ae";
	ctx.fillRect(-s * .15, -s * .28, s * .3, s * .2);
	ctx.restore();
}
function drawMoon(ctx, x, y, R) {
	const body = ctx.createRadialGradient(x - R * .35, y - R * .35, R * .1, x, y, R);
	body.addColorStop(0, "#f4f1ea");
	body.addColorStop(.6, "#c8c2b4");
	body.addColorStop(1, "#8e8980");
	ctx.fillStyle = body;
	ctx.beginPath();
	ctx.arc(x, y, R, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(90, 88, 82, 0.45)";
	for (const m of MARIA) {
		ctx.beginPath();
		ctx.ellipse(x + m.x * R, y + m.y * R, m.rx * R, m.ry * R, m.rot, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.strokeStyle = "rgba(70,66,60,0.55)";
	ctx.lineWidth = 1.2;
	for (const c of CRATERS) {
		ctx.beginPath();
		ctx.ellipse(x + c.x * R, y + c.y * R, c.rx * R, c.ry * R, c.rot, 0, Math.PI * 2);
		ctx.stroke();
	}
	shadeSphere(ctx, x, y, R, .4, .35);
}
function drawSun(ctx, x, y, R, time) {
	if (R < 1.2) {
		ctx.fillStyle = "#fff6e4";
		ctx.beginPath();
		ctx.arc(x, y, 2.2, 0, Math.PI * 2);
		ctx.fill();
		return;
	}
	ctx.save();
	ctx.translate(x, y);
	for (let i = 0; i < 18; i++) {
		const a = i / 18 * Math.PI * 2 + time * .04;
		ctx.strokeStyle = `rgba(255, ${180 + i % 3 * 20}, 90, ${.08 + i % 4 * .03})`;
		ctx.lineWidth = R * .04;
		ctx.beginPath();
		ctx.moveTo(Math.cos(a) * R * .9, Math.sin(a) * R * .9);
		ctx.lineTo(Math.cos(a) * R * (1.7 + i % 3 * .25), Math.sin(a) * R * (1.7 + i % 3 * .25));
		ctx.stroke();
	}
	ctx.restore();
	const disk = ctx.createRadialGradient(x - R * .25, y - R * .25, R * .05, x, y, R);
	disk.addColorStop(0, "#fffaf0");
	disk.addColorStop(.45, "#ffe08a");
	disk.addColorStop(.82, "#ffb03a");
	disk.addColorStop(1, "#e06a18");
	ctx.fillStyle = disk;
	ctx.beginPath();
	ctx.arc(x, y, R, 0, Math.PI * 2);
	ctx.fill();
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, R, 0, Math.PI * 2);
	ctx.clip();
	for (let i = 0; i < 22; i++) {
		const a = n1(i) * 6.28 + time * .1;
		const r = n1(i + 2) * R * .75;
		ctx.fillStyle = `rgba(255,255,255,${.06 + n1(i + 4) * .08})`;
		ctx.beginPath();
		ctx.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, R * .12, R * .08, a, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
	ctx.strokeStyle = "rgba(255, 90, 40, 0.85)";
	ctx.lineWidth = 2;
	ctx.beginPath();
	const a = time * .15;
	ctx.moveTo(x + Math.cos(a) * R * .9, y + Math.sin(a) * R * .9);
	ctx.quadraticCurveTo(x + Math.cos(a + .4) * R * 1.45, y + Math.sin(a + .2) * R * 1.5, x + Math.cos(a + .8) * R * 1.05, y + Math.sin(a + .7) * R * 1.05);
	ctx.stroke();
}
function drawBandedPlanet(ctx, x, y, R, bands, spot) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(-.15);
	ctx.beginPath();
	ctx.arc(0, 0, R, 0, Math.PI * 2);
	ctx.clip();
	for (let i = 0; i < bands.length; i++) {
		ctx.fillStyle = bands[i];
		const y0 = -R + i * 2 * R / bands.length;
		ctx.fillRect(-R, y0, R * 2, 2 * R / bands.length + 1);
	}
	if (spot) {
		ctx.fillStyle = spot;
		ctx.beginPath();
		ctx.ellipse(R * .22, R * .12, R * .26, R * .16, -.2, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
	shadeSphere(ctx, x, y, R, .35, .4);
}
function drawHelio(ctx, w, h, time) {
	const sx = w * .3;
	const sy = h * .8;
	const g = ctx.createRadialGradient(sx, sy, 2, sx, sy, 70);
	g.addColorStop(0, "rgba(255, 236, 200, 0.95)");
	g.addColorStop(1, "rgba(255, 170, 70, 0)");
	ctx.fillStyle = g;
	ctx.beginPath();
	ctx.arc(sx, sy, 70, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#fff6e0";
	ctx.beginPath();
	ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(170, 214, 230, 0.8)";
	ctx.beginPath();
	ctx.moveTo(w * .8, -10);
	ctx.quadraticCurveTo(w * .58, h * .45, w * .84, h + 10);
	ctx.stroke();
	ctx.lineWidth = 18;
	ctx.strokeStyle = "rgba(140, 190, 220, 0.16)";
	ctx.stroke();
	for (let i = 0; i < 32; i++) {
		const targetY = i / 32 * h;
		const targetX = w * (.78 - Math.sin(targetY / h * Math.PI) * .16);
		const u = (time * .07 * (.45 + n1(i)) + n1(i + 3)) % 1;
		const stopped = Math.min(u, .96);
		const px = lerp(sx, targetX, stopped);
		const py = lerp(sy, targetY, stopped);
		ctx.fillStyle = `rgba(255, 220, 170, ${.25 + stopped * .55})`;
		ctx.fillRect(px, py, 2.2, 2.2);
	}
}
function drawVoyager(ctx, x, y, s) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(-.5);
	ctx.fillStyle = "#d5dbe0";
	ctx.beginPath();
	ctx.ellipse(-s * .2, 0, s * .55, s * .18, -.6, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#9aa4ae";
	ctx.fillRect(0, -s * .12, s * .7, s * .24);
	ctx.strokeStyle = "#e8eef2";
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(s * .7, 0);
	ctx.lineTo(s * 1.5, 0);
	ctx.stroke();
	ctx.restore();
}
function drawIce(ctx, w, h, p, time) {
	for (const ice of ICES) {
		const y = qY(ice.q, p, h, .72, 6.5);
		if (y < -40 || y > h + 40) continue;
		const x = w * ice.x;
		const s = Math.min(w, h) * .02 * ice.s;
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(time * .15 + ice.ph);
		ctx.fillStyle = "rgba(226, 236, 242, 0.82)";
		ctx.beginPath();
		for (let i = 0; i < ice.n; i++) {
			const a = i / ice.n * Math.PI * 2;
			const rad = s * (.7 + n1(i + ice.ph) * .6);
			const px = Math.cos(a) * rad;
			const py = Math.sin(a) * rad;
			if (i === 0) ctx.moveTo(px, py);
			else ctx.lineTo(px, py);
		}
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "rgba(255,255,255,0.55)";
		ctx.fillRect(-1, -1, 2, 2);
		ctx.restore();
	}
	const cometY = qY(AT.oort, p, h, .66, 6);
	if (cometY > -60 && cometY < h + 60) {
		const cx = w * .7;
		ctx.strokeStyle = "rgba(190, 214, 230, 0.35)";
		ctx.lineWidth = 8;
		ctx.beginPath();
		ctx.moveTo(cx, cometY);
		ctx.quadraticCurveTo(cx - w * .18, cometY - h * .08, cx - w * .38, cometY - h * .02);
		ctx.stroke();
		ctx.fillStyle = "#f4fbff";
		ctx.beginPath();
		ctx.arc(cx, cometY, 5, 0, Math.PI * 2);
		ctx.fill();
	}
}
function drawProxima(ctx, x, y, R, time) {
	const flare = .65 + .35 * Math.sin(time * .8);
	const g = ctx.createRadialGradient(x, y, R * .2, x, y, R * 3.2);
	g.addColorStop(0, `rgba(255,150,90,${.45 * flare})`);
	g.addColorStop(1, "rgba(255,60,30,0)");
	ctx.fillStyle = g;
	ctx.beginPath();
	ctx.arc(x, y, R * 3.2, 0, Math.PI * 2);
	ctx.fill();
	const body = ctx.createRadialGradient(x - R * .3, y - R * .3, R * .1, x, y, R);
	body.addColorStop(0, "#ffd0b0");
	body.addColorStop(.5, "#e2582c");
	body.addColorStop(1, "#8a1e10");
	ctx.fillStyle = body;
	ctx.beginPath();
	ctx.arc(x, y, R, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(180, 200, 210, 0.9)";
	ctx.beginPath();
	ctx.arc(x + R * 2.4, y + R * .6, R * .18, 0, Math.PI * 2);
	ctx.fill();
}
function drawNebula(ctx, w, h, p, time) {
	const x = w * .7;
	const y = h * .7;
	const s = Math.min(w, h);
	for (const c of [
		[
			0,
			0,
			.46,
			"rgba(150, 50, 80, 0.55)"
		],
		[
			.14,
			-.08,
			.3,
			"rgba(40, 110, 140, 0.5)"
		],
		[
			-.12,
			.1,
			.24,
			"rgba(200, 90, 60, 0.42)"
		],
		[
			.04,
			.14,
			.2,
			"rgba(255, 180, 140, 0.28)"
		]
	]) {
		const g = ctx.createRadialGradient(x + c[0] * s, y + c[1] * s, 8, x + c[0] * s, y + c[1] * s, c[2] * s);
		g.addColorStop(0, c[3]);
		g.addColorStop(1, "rgba(0,0,0,0)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
	}
	ctx.fillStyle = "rgba(255, 244, 230, 0.85)";
	for (let i = 0; i < 18; i++) {
		const px = x + (n1(i + p * 10) - .5) * s * .5;
		const py = y + (n1(i + 6) - .5) * s * .36;
		ctx.fillStyle = `rgba(255, 244, 230, ${.45 + .55 * Math.sin(time * 1.4 + i)})`;
		ctx.fillRect(px, py, i % 5 === 0 ? 2.4 : 1.3, i % 5 === 0 ? 2.4 : 1.3);
	}
}
function drawMilkyWay(ctx, w, h, p) {
	ctx.save();
	ctx.translate(w * .5, h * .72);
	ctx.rotate(-.55);
	const band = ctx.createLinearGradient(0, -h * .18, 0, h * .18);
	band.addColorStop(0, "rgba(0,0,0,0)");
	band.addColorStop(.35, "rgba(90, 80, 70, 0.18)");
	band.addColorStop(.5, "rgba(230, 214, 190, 0.22)");
	band.addColorStop(.65, "rgba(80, 60, 50, 0.16)");
	band.addColorStop(1, "rgba(0,0,0,0)");
	ctx.fillStyle = band;
	ctx.fillRect(-w, -h * .2, w * 2, h * .4);
	ctx.restore();
	const dust = smooth(AT.arm, AT.dust + .01, p);
	if (dust < .02) return;
	ctx.save();
	ctx.translate(w * .58, h * .74);
	ctx.rotate(-.5);
	for (let i = 0; i < 5; i++) {
		ctx.fillStyle = i % 2 ? `rgba(40, 22, 16, ${.85 * dust})` : `rgba(12, 8, 8, ${.75 * dust})`;
		ctx.beginPath();
		ctx.ellipse(0, (i - 2) * 26, w * .7, 12 + i * 7, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}
function drawHole(ctx, w, h, p, time, reduced) {
	const k = smooth(AT.dust, AT.sgr + .01, p);
	const hx = w * (w > h ? .72 : .7);
	const hy = h * (.86 - k * .08);
	const R = Math.min(w, h) * (.16 + k * .1);
	ctx.save();
	ctx.translate(hx, hy);
	ctx.rotate(-.55);
	ctx.scale(1, .36);
	for (let i = 0; i < 220; i++) {
		const ang = i / 220 * Math.PI * 2 + (reduced ? 0 : time * .28);
		const rad = R * (1.15 + i % 9 * .035);
		const facing = Math.max(0, Math.sin(ang - .4));
		const bright = facing * facing;
		ctx.fillStyle = facing > .42 ? `rgba(255,228,200,${.15 + bright * .75})` : `rgba(160,36,22,${.08 + bright * .4})`;
		ctx.beginPath();
		ctx.arc(Math.cos(ang) * rad, Math.sin(ang) * rad, R * (.035 + bright * .02), 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.strokeStyle = "rgba(255,220,180,0.7)";
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(0, 0, R * 1.04, 0, Math.PI * 2);
	ctx.stroke();
	ctx.restore();
	ctx.fillStyle = "#000";
	ctx.beginPath();
	ctx.ellipse(hx, hy, R * .42, R * .36, -.4, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "rgba(255,236,220,0.85)";
	ctx.lineWidth = 1.25;
	ctx.beginPath();
	ctx.ellipse(hx, hy, R * .62, R * .5, -.4, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = "rgba(255,220,180,0.25)";
	for (let i = 0; i < 3; i++) {
		ctx.beginPath();
		ctx.ellipse(hx, hy, R * (1.8 + i * .7), R * (.55 + i * .18), -.9 + i * .15, 0, Math.PI * 2);
		ctx.stroke();
		const a = (reduced ? i : time * (.25 + i * .08)) + i;
		const rx = R * (1.8 + i * .7);
		const ry = R * (.55 + i * .18);
		const rot = -.9 + i * .15;
		const px = hx + rx * Math.cos(a) * Math.cos(rot) - ry * Math.sin(a) * Math.sin(rot);
		const py = hy + rx * Math.cos(a) * Math.sin(rot) + ry * Math.sin(a) * Math.cos(rot);
		ctx.fillStyle = i === 2 ? "#fff4e4" : "#ffb088";
		ctx.beginPath();
		ctx.arc(px, py, 2.2, 0, Math.PI * 2);
		ctx.fill();
	}
}
function paintScenes(ctx, e) {
	const { w, h, p, time, reduced } = e;
	const m = Math.min(w, h);
	const aInner = fadeOut(p, AT.core + .008, AT.lehmann);
	const aOuter = fadeIn(p, AT.core + .01, AT.lehmann) * fadeOut(p, AT.lehmann + .01, AT.gutenberg);
	const aMantle = fadeIn(p, AT.lehmann + .008, AT.gutenberg) * fadeOut(p, AT.gutenberg + .008, AT.moho);
	const aCrust = fadeIn(p, AT.gutenberg + .006, AT.moho) * fadeOut(p, AT.moho + .008, AT.trench + .008);
	const aOcean = fadeIn(p, AT.moho + .004, AT.trench) * fadeOut(p, AT.sea + .012, AT.tropo + .02);
	const aSky = fadeIn(p, AT.sea, AT.tropo) * fadeOut(p, AT.iss, AT.geo);
	const aEarth = fadeIn(p, AT.sea + .02, AT.karman) * fadeOut(p, AT.moon + .005, AT.l1);
	const aIss = fadeIn(p, AT.iss - .012, AT.iss) * fadeOut(p, AT.iss + .006, AT.iss + .02);
	const aMoon = fadeIn(p, AT.geo + .01, AT.moon) * fadeOut(p, AT.moon + .012, AT.l1 + .01);
	const aSun = fadeIn(p, AT.l1, AT.sun) * fadeOut(p, AT.sun + .02, AT.jupiter);
	const aJup = fadeIn(p, AT.sun + .012, AT.jupiter) * fadeOut(p, AT.jupiter + .012, AT.neptune - .008);
	const aNep = fadeIn(p, AT.jupiter + .012, AT.neptune) * fadeOut(p, AT.neptune + .012, AT.helio);
	const aHelio = fadeIn(p, AT.neptune + .01, AT.helio) * fadeOut(p, AT.voyager, AT.ice);
	const aVoy = fadeIn(p, AT.helio + .01, AT.voyager) * fadeOut(p, AT.voyager + .015, AT.ice);
	const aIce = fadeIn(p, AT.ice - .01, AT.oort) * fadeOut(p, AT.ly, AT.proxima - .02);
	const aProx = fadeIn(p, AT.dark, AT.proxima) * fadeOut(p, AT.proxima + .015, AT.bubble + .01);
	const aNeb = fadeIn(p, AT.bubble, AT.orion) * fadeOut(p, AT.arm, AT.dust);
	const aMw = fadeIn(p, AT.ly, AT.bubble);
	const aHole = fadeIn(p, AT.dust - .005, AT.sgr);
	const aStar = fadeIn(p, AT.tropo, AT.karman + .01);
	const layer = (alpha, fn) => {
		if (alpha < .02) return;
		ctx.save();
		ctx.globalAlpha = alpha;
		fn();
		ctx.restore();
	};
	if (aStar > .02) {
		const density = .22 + .78 * smooth(AT.voyager, AT.sgr, p);
		const drift = reduced ? p * 40 : p * 80 + time * 6;
		for (const s of STARS) {
			if (s.n > density) continue;
			const y = ((s.y * h + drift * s.z) % h + h) % h;
			const x = (s.x * w + (reduced ? 0 : Math.sin(time * .15 + s.y * 8) * 3) + w) % w;
			const tw = reduced ? .8 : .45 + .55 * Math.sin(time * 1.2 + s.x * 20);
			const warm = s.warm * smooth(AT.orion, AT.sgr, p);
			const rr = 206 + warm * 49;
			const gg = 210 + warm * 8;
			const bb = 222 - warm * 90;
			ctx.fillStyle = `rgba(${rr | 0},${gg | 0},${bb | 0},${aStar * tw * (.25 + s.z * .75)})`;
			const size = s.s * (.55 + s.z * .75);
			ctx.fillRect(x, y, size, size);
			if (s.s > 2.4 && aStar > .6 && p > AT.ly) {
				ctx.fillRect(x - size, y + size * .35, size * 3, .7);
				ctx.fillRect(x + size * .35, y - size, .7, size * 3);
			}
		}
	}
	layer(aInner, () => drawInner(ctx, w, h, p, time));
	layer(aOuter, () => drawOuter(ctx, w, h, p, time));
	layer(aMantle, () => drawRock(ctx, w, h, p, time, MANTLE, AT.gutenberg, true));
	layer(aCrust, () => drawRock(ctx, w, h, p, time, CRUST, AT.moho, false));
	layer(aSky, () => drawSky(ctx, w, h, p, time));
	layer(aOcean, () => drawOcean(ctx, w, h, p, time));
	layer(aMw * fadeOut(p, AT.dust, AT.sgr), () => drawMilkyWay(ctx, w, h, p));
	layer(aEarth, () => drawEarth(ctx, w, h, p, time));
	layer(aIss, () => drawIss(ctx, w, h, p, time));
	layer(aMoon, () => {
		const y = qY(AT.moon, p, h, .7, 8);
		const R = m * lerp(.08, .24, fadeIn(p, AT.geo, AT.moon));
		drawMoon(ctx, w * .56, y, R);
	});
	layer(aSun, () => {
		const u = fadeIn(p, AT.l1, AT.sun);
		const v = fadeIn(p, AT.sun + .008, AT.jupiter);
		const R = m * (lerp(.04, .3, u) * (1 - v) + .012 * v);
		const y = lerp(h * .84, h * .36, fadeIn(p, AT.sun, AT.jupiter));
		drawSun(ctx, lerp(w * .62, w * .22, v), y, Math.max(R, 2), time);
	});
	layer(aJup, () => {
		const y = qY(AT.jupiter, p, h, .72, 9);
		drawBandedPlanet(ctx, w * .66, y, m * .2, [
			"#e6d3b4",
			"#c4956a",
			"#f3ecdf",
			"#b86a42",
			"#8d5a36",
			"#eadcc4",
			"#6e4428"
		], "#b23c30");
	});
	layer(aNep, () => {
		const y = qY(AT.neptune, p, h, .7, 9);
		drawBandedPlanet(ctx, w * .6, y, m * .15, [
			"#1d4e86",
			"#3d7ec4",
			"#163e74",
			"#7eb6e2",
			"#12325e",
			"#2a62a0"
		], "#e8f4ff");
	});
	layer(aHelio, () => drawHelio(ctx, w, h, time));
	layer(aVoy, () => {
		const y = qY(AT.voyager, p, h, .68, 8);
		drawVoyager(ctx, w * .64, y, Math.max(26, m * .05));
	});
	layer(aIce, () => drawIce(ctx, w, h, p, time));
	layer(aProx, () => {
		const y = qY(AT.proxima, p, h, .68, 7);
		drawProxima(ctx, w * .64, y, m * .075, time);
	});
	layer(fadeIn(p, AT.proxima, AT.bubble) * fadeOut(p, AT.orion, AT.arm), () => {
		ctx.strokeStyle = "rgba(180, 160, 140, 0.28)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(w * .5, h * .55, m * .42, 0, Math.PI * 2);
		ctx.stroke();
	});
	layer(aNeb, () => drawNebula(ctx, w, h, p, time));
	layer(aHole, () => drawHole(ctx, w, h, p, time, reduced));
	if (aStar > .75 && p > AT.helio && p < AT.dust && !reduced) {
		const u = time * .07 % 1;
		if (u < .12) {
			const x0 = w * (.25 + Math.floor(time * .07) % 4 * .12);
			const y0 = h * .2 + u / .12 * h * .35;
			ctx.strokeStyle = `rgba(255,255,255,${1 - u / .12})`;
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(x0 - 36, y0 + 14);
			ctx.stroke();
		}
	}
}
var SkyCanvas = (0, import_react.memo)(function SkyCanvas({ visual }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: false });
		if (!ctx) return;
		const grain = document.createElement("canvas");
		grain.width = 128;
		grain.height = 128;
		const gctx = grain.getContext("2d");
		let pattern = null;
		if (gctx) {
			const img = gctx.createImageData(128, 128);
			const grit = mulberry32(659918);
			for (let i = 0; i < img.data.length; i += 4) {
				const v = 160 + grit() * 90;
				img.data[i] = v;
				img.data[i + 1] = v;
				img.data[i + 2] = v;
				img.data[i + 3] = 38;
			}
			gctx.putImageData(img, 0, 0);
			pattern = ctx.createPattern(grain, "repeat");
		}
		let frame = 0;
		let alive = true;
		const draw = (now) => {
			const visualNow = visual.current;
			const p = visualNow?.p ?? 0;
			const reduced = visualNow?.reduced ?? false;
			const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth > 900 ? 1.35 : 1.6);
			const w = Math.max(1, window.innerWidth);
			const h = Math.max(1, window.innerHeight);
			const pw = Math.floor(w * dpr);
			const ph = Math.floor(h * dpr);
			if (canvas.width !== pw || canvas.height !== ph) {
				canvas.width = pw;
				canvas.height = ph;
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const pal = sample(p);
			const glowY = h * .78;
			const g = ctx.createRadialGradient(w * .5, glowY, 0, w * .5, h * .55, Math.max(w, h) * .95);
			g.addColorStop(0, rgb(pal.hot));
			g.addColorStop(.18, rgb(pal.mid));
			g.addColorStop(.5, rgb(pal.bg));
			g.addColorStop(1, rgb(pal.bg));
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, w, h);
			const time = reduced ? 0 : now * .001;
			paintScenes(ctx, {
				w,
				h,
				p,
				time,
				reduced
			});
			const veil = ctx.createLinearGradient(0, 0, 0, h * .42);
			veil.addColorStop(0, "rgba(0,0,0,0.72)");
			veil.addColorStop(.55, "rgba(0,0,0,0.28)");
			veil.addColorStop(1, "rgba(0,0,0,0)");
			ctx.fillStyle = veil;
			ctx.fillRect(0, 0, w, h * .42);
			const vg = ctx.createRadialGradient(w * .32, h * .36, mSafe(w, h) * .08, w * .4, h * .45, Math.max(w, h) * .78);
			vg.addColorStop(0, "rgba(0,0,0,0.08)");
			vg.addColorStop(.55, "rgba(0,0,0,0)");
			vg.addColorStop(1, "rgba(0,0,0,0.28)");
			ctx.fillStyle = vg;
			ctx.fillRect(0, 0, w, h);
			if (pattern) {
				ctx.save();
				ctx.globalAlpha = .1;
				if (!reduced) ctx.translate(time * 8 % 128, time * 5 % 128);
				ctx.fillStyle = pattern;
				ctx.fillRect(-128, -128, w + 256, h + 256);
				ctx.restore();
			}
		};
		const loop = (now) => {
			if (!alive) return;
			draw(now);
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		const onVis = () => {
			if (document.hidden) {
				alive = false;
				cancelAnimationFrame(frame);
			} else if (!alive) {
				alive = true;
				frame = requestAnimationFrame(loop);
			}
		};
		document.addEventListener("visibilitychange", onVis);
		return () => {
			alive = false;
			cancelAnimationFrame(frame);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, [visual]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "sky",
		"aria-hidden": "true"
	});
});
function mSafe(w, h) {
	return Math.min(w, h);
}
function createDrone() {
	let ctx = null;
	let master = null;
	let oscA = null;
	let oscB = null;
	let filter = null;
	let noiseGain = null;
	let running = false;
	let last = 0;
	function ensure() {
		if (ctx) return;
		const Ctor = window.AudioContext || window.webkitAudioContext;
		if (!Ctor) return;
		ctx = new Ctor();
		master = ctx.createGain();
		master.gain.value = 0;
		filter = ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 240;
		filter.Q.value = .5;
		oscA = ctx.createOscillator();
		oscB = ctx.createOscillator();
		oscA.type = "sine";
		oscB.type = "triangle";
		oscA.frequency.value = 82;
		oscB.frequency.value = 123;
		const mixB = ctx.createGain();
		mixB.gain.value = .22;
		oscA.connect(filter);
		oscB.connect(mixB);
		mixB.connect(filter);
		const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
		const noise = ctx.createBufferSource();
		noise.buffer = buffer;
		noise.loop = true;
		const band = ctx.createBiquadFilter();
		band.type = "bandpass";
		band.frequency.value = 480;
		band.Q.value = .35;
		noiseGain = ctx.createGain();
		noiseGain.gain.value = .012;
		noise.connect(band);
		band.connect(noiseGain);
		noiseGain.connect(master);
		filter.connect(master);
		master.connect(ctx.destination);
		noise.start();
		oscA.start();
		oscB.start();
	}
	return {
		async toggle() {
			ensure();
			if (!ctx || !master) return false;
			if (ctx.state === "suspended") await ctx.resume();
			running = !running;
			const now = ctx.currentTime;
			master.gain.cancelScheduledValues(now);
			master.gain.linearRampToValueAtTime(running ? .11 : 0, now + .35);
			last = 0;
			return running;
		},
		setProgress(p) {
			if (!running || !ctx || !oscA || !oscB || !filter || !noiseGain) return;
			const nowMs = performance.now();
			if (nowMs - last < 90) return;
			last = nowMs;
			const hole = p > .9 ? (p - .9) * 80 : 0;
			const f = Math.max(46, 78 + Math.sin(p * Math.PI) * 36 - hole);
			const t = ctx.currentTime;
			oscA.frequency.setTargetAtTime(f, t, .25);
			oscB.frequency.setTargetAtTime(f * 1.5, t, .25);
			filter.frequency.setTargetAtTime(200 + p * 1100, t, .35);
			noiseGain.gain.setTargetAtTime(.008 + (p > .5 ? (p - .5) * .03 : 0), t, .4);
		},
		dispose() {
			ctx?.close();
			ctx = null;
			running = false;
		}
	};
}
var Readout = (0, import_react.memo)(function Readout({ valueRef, unitRef, metaRef }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			ref: valueRef,
			className: "num",
			children: "0"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			ref: unitRef,
			className: "unit",
			children: "公里 · 距地心"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			ref: metaRef,
			className: "meta",
			children: "地心 · 光行 —"
		})
	] });
});
function Journey() {
	const scrollerRef = (0, import_react.useRef)(null);
	const zeroRef = (0, import_react.useRef)(null);
	const oneRef = (0, import_react.useRef)(null);
	const valueRef = (0, import_react.useRef)(null);
	const unitRef = (0, import_react.useRef)(null);
	const metaRef = (0, import_react.useRef)(null);
	const liveRef = (0, import_react.useRef)(null);
	const rnowRef = (0, import_react.useRef)(null);
	const rulerRef = (0, import_react.useRef)(null);
	const closeRef = (0, import_react.useRef)(null);
	const markEls = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const visual = (0, import_react.useRef)({
		p: 0,
		reduced: false
	});
	const droneRef = (0, import_react.useRef)(null);
	const stratumRef = (0, import_react.useRef)("地心");
	const spanRef = (0, import_react.useRef)(1);
	const [indexOpen, setIndexOpen] = (0, import_react.useState)(false);
	const [soundOn, setSoundOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
			const focus = window.innerHeight * (32 / 100);
			for (const node of markEls.current.values()) {
				if (reduced) {
					node.style.opacity = "1";
					continue;
				}
				const screens = Math.abs(node.getBoundingClientRect().top - focus) / window.innerHeight;
				const near = Math.max(0, 1 - screens / .9);
				node.style.opacity = (.14 + near * .86).toFixed(3);
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
		const onKey = (e) => {
			if (e.key === "Escape") {
				setIndexOpen(false);
				return;
			}
			const tag = e.target?.tagName;
			if (tag === "BUTTON" || tag === "A" || tag === "INPUT") return;
			const behavior = mq.matches ? "auto" : "smooth";
			const page = el.clientHeight * .86;
			if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
				e.preventDefault();
				el.scrollBy({
					top: page,
					behavior
				});
			} else if (e.key === "ArrowUp" || e.key === "PageUp") {
				e.preventDefault();
				el.scrollBy({
					top: -page,
					behavior
				});
			} else if (e.key === "Home") {
				e.preventDefault();
				el.scrollTo({
					top: 0,
					behavior
				});
			} else if (e.key === "End") {
				e.preventDefault();
				el.scrollTo({
					top: el.scrollHeight,
					behavior
				});
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
	(0, import_react.useEffect)(() => {
		if (indexOpen) closeRef.current?.focus();
	}, [indexOpen]);
	function jump(p) {
		const el = scrollerRef.current;
		const z = zeroRef.current;
		const o = oneRef.current;
		if (!el || !z || !o) return;
		const span = Math.max(1, o.offsetTop - z.offsetTop);
		spanRef.current = span;
		el.scrollTo({
			top: p * span,
			behavior: visual.current.reduced ? "auto" : "smooth"
		});
		setIndexOpen(false);
	}
	function scrub(clientY) {
		const ruler = rulerRef.current;
		const el = scrollerRef.current;
		if (!ruler || !el) return;
		const rect = ruler.getBoundingClientRect();
		el.scrollTop = Math.min(1, Math.max(0, (clientY - rect.top) / Math.max(1, rect.height))) * spanRef.current;
	}
	async function toggleSound() {
		if (!droneRef.current) droneRef.current = createDrone();
		const on = await droneRef.current.toggle();
		setSoundOn(on);
		droneRef.current.setProgress(visual.current.p);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "journey",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyCanvas, { visual }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "hud",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "word",
							children: "直至银心"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hud-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": soundOn,
								onClick: () => void toggleSound(),
								children: soundOn ? "静音" : "声音"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-expanded": indexOpen,
								onClick: () => setIndexOpen(true),
								children: "刻度"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
						valueRef,
						unitRef,
						metaRef
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						ref: liveRef,
						className: "sr-only",
						"aria-live": "polite",
						children: "地心"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: rulerRef,
				className: "ruler",
				"aria-hidden": "true",
				onPointerDown: (e) => {
					e.currentTarget.setPointerCapture(e.pointerId);
					scrub(e.clientY);
				},
				onPointerMove: (e) => {
					if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e.clientY);
				},
				onWheel: (e) => scrollerRef.current?.scrollBy({ top: e.deltaY }),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ruler-line" }),
					MARKS.map((mark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: mark.whisper ? "rdot is-whisper" : "rdot",
						style: { top: `${mark.p * 100}%` }
					}, mark.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						ref: rnowRef,
						className: "rnow"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				ref: scrollerRef,
				className: indexOpen ? "scroller is-locked" : "scroller",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "track",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: zeroRef,
							className: "sentinel",
							style: { top: `32vh` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: oneRef,
							className: "sentinel",
							style: { top: `calc(32vh + ${SPAN_VH}vh)` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "opening",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "column",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "kicker",
										children: "AD CENTRUM"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "直至银心" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "lead",
										children: "六千三百七十一公里。海面以下，有一把尺子停在地心。"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "lead",
										children: "这一程把尺子翻过来。从铁的中心向外，直到银河自己的中心。"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "hint",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hint-line",
											"aria-hidden": "true"
										}), "向下滚动"]
									})
								]
							})
						}),
						MARKS.map((mark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							className: mark.whisper ? "station is-whisper" : mark.pivot ? "station is-pivot" : "station",
							style: { top: `calc(32vh + ${mark.p} * ${SPAN_VH}vh)` },
							ref: (node) => {
								if (node) markEls.current.set(mark.id, node);
								else markEls.current.delete(mark.id);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "station-inner",
								children: [
									mark.whisper ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rule",
										"aria-hidden": "true"
									}),
									mark.kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "kicker",
										children: mark.kicker
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: mark.title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "line",
										children: mark.line
									}),
									mark.fact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "fact",
										children: mark.fact
									}) : null,
									mark.id === "sgr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "colo",
										children: "尺子停在这里。地心在后面，小得无法再被提起。形制向 depths.world 的垂直尺子致谢。数字取自公开的地球物理与天体测量；奥尔特云与旋臂仍有不确定。这不是航线。银心在人马座方向，太阳不在这把尺上。"
									}) : null
								]
							})
						}, mark.id))
					]
				})
			}),
			indexOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "index",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "刻度",
				onClick: (e) => {
					if (e.target === e.currentTarget) setIndexOpen(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "index-panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "index-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "刻度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								ref: closeRef,
								type: "button",
								onClick: () => setIndexOpen(false),
								children: "关闭"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "index-list",
							children: MARKS.map((mark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => jump(mark.p),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "t",
									children: mark.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "d",
									children: formatDistanceShort(mark.km)
								})]
							}) }, mark.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "keys",
							children: "方向键、空格行走。右侧刻度可拖动。"
						})
					]
				})
			}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Journey, {});
}
//#endregion
export { Home as component };
