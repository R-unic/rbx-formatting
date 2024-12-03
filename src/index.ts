import { trim } from "@rbxts/string-utils";

const { floor, log } = math;

/**
 * Places commas between every three decimal points in `n`
 * @example commaFormat(1000000) // 1,000,000
 */
export function commaFormat(n: number | string): string {
	let formatted = tostring(n)
		.reverse()
		.gsub("(%d%d%d)", "%1,")[0]
		.reverse();

	if (formatted.sub(1, 1) === ",")
		formatted = formatted.sub(2);

	return formatted;
}

const baseSuffixes = [
	"K",
	"M", "B", "T", "Qd", "Qt", "Sx", "Sp", "Oc", "No", "Dc",
	"Udc", "Ddc", "Tdc", "Qdc", "Qnd", "Sxd", "Spd", "Ocd", "Nvd", "Vg",
	"Uvg", "Dvg", "Tvg", "Qvg", "Qnv", "Sxv", "Spv", "Ocv", "Nvv", "Tg",
	"Utg", "G"
];

/**
 * Abbreviates numbers larger than or equal to `threshold`
 * @example
 * abbreviate(1000000) // 1M
 * abbreviate(1000000000000000000000) // 1Sx
 */
export function abbreviate(n: number, threshold = 100_000, suffixes = baseSuffixes): string {
	if (n < threshold)
		return commaFormat(n);

	const index = floor(log(n, 1000)) - 1;
	const divisor = 10 ** ((index + 1) * 3);
	const [baseNumber] = "%.1f".format(floor(n / divisor)).gsub("%.?0+$", "");
	return baseNumber + (index < 0 ? "" : suffixes[index]);
}

/**
 * Parses a number formatted by `abbreviate()` back into a number type
 * @example parseAbbreviatedNumber("1B") // 1000000000
 */
export function parseAbbreviatedNumber(suffixed: string, suffixes = baseSuffixes): number {
	const match = suffixed.gsub(",", "")[0].match("^([0-9,.]+)([KMBT]?)$");
	if (!match)
		return error("[@rbxts/formatting]: Invalid suffixed number format");

	let numberPart = tostring(match[0]);
	const suffix = tostring(match[1]);

	if (suffix && suffix !== "" && suffix !== "nil") {
		const index = (<readonly string[]>suffixes).indexOf(suffix.lower());
		if (index === -1)
			return error("[@rbxts/formatting]: Invalid suffix in suffixed number");

		const multiplier = 10 ** ((index + 1) * 3);
		numberPart = tostring(tonumber(numberPart)! * multiplier);
	}

	return tonumber(numberPart)!;
}

const s = 1, m = 60, h = 3600, d = 86400, w = 604800;
const timePatterns = {
	s, second: s, seconds: s,
	m, minute: m, minutes: m,
	h, hour: h, hours: h,
	d, day: d, days: d,
	w, week: w, weeks: w
};

/**
 * Takes a remaining time string and converts it to the amount of time it represents in seconds.
 * @example toSeconds("10m 20s") // 620
 */
export function toSeconds(time: string): number {
	let seconds = 0;
	for (const [value, unit] of time.gsub(" ", "")[0].gmatch("(%d+)(%a)")) {
		const timeUnit = <keyof typeof timePatterns>unit;
		const figure = <number>value;
		seconds += figure * timePatterns[timeUnit];
	}

	return seconds;
}

/**
 * Takes a time in seconds and converts it to a remaining time string
 * @example toRemainingTime(310) // 5m 10s
 */
export function toRemainingTime(seconds: number, secondsFormat = "%ds", minutesFormat = "%dm", hoursFormat = "%dh", daysFormat = "%dd"): string {
	const days = floor(seconds / d);
	seconds %= d;

	const hours = floor(seconds / h);
	seconds %= h;

	const minutes = floor(seconds / m);
	seconds %= m;

	let remainingTime = "";
	if (days > 0)
		remainingTime += (daysFormat + " ").format(days);
	if (hours > 0)
		remainingTime += (hoursFormat + " ").format(hours);
	if (minutes > 0)
		remainingTime += (minutesFormat + " ").format(minutes);
	if (seconds > 0)
		remainingTime += (secondsFormat + " ").format(seconds);

	return trim(remainingTime);
}

/**
 * Takes a time in seconds and converts it to a long remaining time string
 * @example toLongRemainingTime(3690) // 01:01:30
 */
export function toLongRemainingTime(seconds: number): string {
	const hours = floor(seconds / h);
	const minutes = floor((seconds % h) / m);
	const remainingSeconds = seconds % m;
	return "%02d:%02d:%02d".format(hours, minutes, remainingSeconds);
}