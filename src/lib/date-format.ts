/** Helpers per formattare date/orari sempre in fuso Europe/Rome.
 *
 *  Perché esiste: `Date#getHours()` & co. usano il fuso del runtime — su
 *  Vercel/Node il default è UTC, quindi un evento salvato come "21:30
 *  Europe/Rome" (= 19:30 UTC) veniva renderizzato come "19:30" lato server.
 *  Tutte le funzioni qui dentro forzano il fuso italiano via
 *  `Intl.DateTimeFormat`, così SSR e client mostrano lo stesso orario.
 */

const TIMEZONE = "Europe/Rome";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
  hour12: false,
});

export type RomeParts = {
  year: number;
  month: number; // 0-11
  day: number;
  hour: number;
  minute: number;
  weekday: number; // 0 = domenica
};

export function partsInRome(input: Date | string): RomeParts {
  const d = typeof input === "string" ? new Date(input) : input;
  const parts = formatter.formatToParts(d);
  const get = (t: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === t)?.value ?? "";
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0;
  return {
    year: Number(get("year")),
    month: Number(get("month")) - 1,
    day: Number(get("day")),
    hour,
    minute: Number(get("minute")),
    weekday: WEEKDAY_INDEX[get("weekday")] ?? 0,
  };
}

export function formatOraRoma(input: Date | string): string {
  const { hour, minute } = partsInRome(input);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
