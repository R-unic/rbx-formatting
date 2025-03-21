const { floor, log } = math;

const trim = (s: string, regex = "%s*") => s.match(`^${regex}(.-)${regex}$`)[0] as string;
const capitalize = (s: string) => s.sub(1, 1).upper() + s.sub(2);

const caseInsensitiveRegexCache = new Map<string[], string>;

function createCaseInsensitiveRegex(strings: string[]): string {
  if (caseInsensitiveRegexCache.has(strings))
    return caseInsensitiveRegexCache.get(strings)!;

  const escapedStrings: string[] = [];
  for (const s of strings) {
    const [pattern] = s.gsub("%a", c => "(%s%s)".format(c.upper(), c.lower()));
    escapedStrings.push(pattern);
  }

  const fullRegex = escapedStrings.join("|");
  caseInsensitiveRegexCache.set(strings, fullRegex);
  return fullRegex;
}

/**
 * Places commas between every three decimal points in `n`
 * @param n The number to format
 * @param minimum If `n` is less than this number, return `n` as a string
 * @param separator The separator to use (default: ",")
 * @param decimal The decimal separator to use (default: ".")
 * @example commaFormat(1000000) // 1,000,000
 */
export function commaFormat(n: number | string, minimum?: number, separator = ",", decimal = "."): string {
  const nString = tostring(n);
  if (minimum !== undefined && tonumber(n)! !== undefined && tonumber(n)! < minimum)
    return nString;

  const [integerPart, decimalPart] = nString.match(`([^%.]+)%${decimal}?(.*)`);
  let formatted = (integerPart as string)
    .reverse()
    .gsub("(%d%d%d)", "%1" + separator)[0]
    .reverse();

  if (formatted.sub(1, 1) === separator)
    formatted = formatted.sub(2);

  if (decimalPart !== undefined && decimalPart !== "")
    formatted += decimal + decimalPart

  return formatted;
}

const defaultSuffixes = [
  "K",
  "M", "B", "T", "Qd", "Qt", "Sx", "Sp", "Oc", "No", "Dc",
  "Udc", "Ddc", "Tdc", "Qdc", "Qnd", "Sxd", "Spd", "Ocd", "Nvd", "Vg",
  "Uvg", "Dvg", "Tvg", "Qvg", "Qnv", "Sxv", "Spv", "Ocv", "Nvv", "Tg",
  "Utg", "G"
];
createCaseInsensitiveRegex(defaultSuffixes); // cache it so it isnt generated when you call parseAbbreviated()

/**
 * Abbreviates numbers larger than or equal to `threshold`
 * @example
 * abbreviate(1000000) // 1M
 * abbreviate(1000000000000000000) // 1Qt
 */
export function abbreviate(n: number, threshold = 1000, suffixes = defaultSuffixes): string {
  if (n < threshold)
    return commaFormat(n);

  const index = floor(log(n, 1000)) - 1;
  const divisor = 10 ** ((index + 1) * 3);
  const [baseNumber] = "%.3f".format(n / divisor).gsub("%.?0+$", "");
  return baseNumber + (index < 0 ? "" : suffixes[index]);
}

/**
 * Parses a number formatted by `abbreviate()` back into a number type
 * @example parseAbbreviatedNumber("1B") // 1000000000
 */
export function parseAbbreviated(suffixed: string, suffixes = defaultSuffixes): number {
  const regex = createCaseInsensitiveRegex(suffixes);
  const match = trim(suffixed.gsub(",", "")[0]).match(`^([0-9,.]+)([(${regex})]?)$`);
  if (!match)
    throw "[@rbxts/formatting]: Invalid suffixed number format";

  let numberPart = tonumber(match[0])!;
  const suffix = tostring(match[1]);

  if (suffix !== undefined && suffix !== "" && suffix !== "nil") {
    const index = suffixes.indexOf(capitalize(suffix.lower()));
    if (index === -1)
      throw "[@rbxts/formatting]: Invalid suffix in suffixed number";

    const multiplier = 10 ** ((index + 1) * 3);
    numberPart *= multiplier;
  }

  return numberPart;
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
  const timeNumber = tonumber(time);
  if (timeNumber !== undefined)
    return timeNumber;

  let seconds = 0;
  for (const [value, unit] of time.gsub(" ", "")[0].gmatch("(%d+)(%a)")) {
    const timeUnit = <keyof typeof timePatterns>unit;
    const figure = value as number;
    seconds += figure * timePatterns[timeUnit];
  }

  return seconds;
}

/**
 * Takes a time in seconds and converts it to a remaining time string
 * @example toRemainingTime(310) // 5m 10s
 */
export function toRemainingTime(
  seconds: number,
  secondsFormat = "%ds",
  minutesFormat = "%dm",
  hoursFormat = "%dh",
  daysFormat = "%dd"
): string {
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
 * Takes a time in seconds and converts it to a long remaining time string (HH:MM:SS)
 * @example toLongRemainingTime(3690) // 01:01:30
 */
export function toLongRemainingTime(seconds: number): string {
  const hours = floor(seconds / h);
  const minutes = floor((seconds % h) / m);
  const remainingSeconds = seconds % m;

  return "%02d:%02d:%02d".format(hours, minutes, remainingSeconds);
}