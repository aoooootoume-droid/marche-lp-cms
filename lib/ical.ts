import ical from "node-ical";
import type { CalendarEvent } from "@/types/content";

// サーバーサイド専用（node-ical は Node.js ランタイムが必要）。
// API Route (app/api/calendar/route.ts) からのみ呼び出すこと。

const DEFAULT_KEYWORDS = ["出店", "イベント", "マルシェ"];

interface FetchOptions {
  keywords?: string[];
  limit?: number;
}

// node-ical はTZID等のパラメータ付き値を { val, params } の形で返すことがあるため、
// プレーンな文字列に正規化する。
function toPlainString(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "val" in (value as Record<string, unknown>)) {
    return String((value as { val: unknown }).val);
  }
  return String(value);
}

/**
 * Google カレンダーの iCal (.ics) URL から、未来の予定のうち
 * タイトルに指定キーワードを含むものだけを抽出して返す。
 * 終日繰り返し予定 (RRULE) にも対応するため node-ical の展開結果を利用する。
 */
export async function fetchUpcomingStoreEvents(
  icsUrl: string,
  options: FetchOptions = {}
): Promise<CalendarEvent[]> {
  const keywords = options.keywords?.length ? options.keywords : DEFAULT_KEYWORDS;
  const limit = options.limit ?? 12;

  const data = await ical.async.fromURL(icsUrl);
  const now = new Date();
  const events: CalendarEvent[] = [];

  for (const key of Object.keys(data)) {
    const item = data[key];
    if (!item || item.type !== "VEVENT") continue;

    const start: Date | undefined = item.start ? new Date(item.start) : undefined;
    const end: Date | undefined = item.end ? new Date(item.end) : start;
    if (!start || !end || end.getTime() < now.getTime()) continue;

    const title = toPlainString(item.summary) ?? "";
    const matchesKeyword = keywords.some((kw) => title.includes(kw));
    if (!matchesKeyword) continue;

    events.push({
      uid: String(item.uid ?? key),
      title,
      start: start.toISOString(),
      end: end.toISOString(),
      location: toPlainString(item.location),
      description: toPlainString(item.description),
    });
  }

  events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  return events.slice(0, limit);
}
