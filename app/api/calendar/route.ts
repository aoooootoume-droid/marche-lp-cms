import { NextRequest, NextResponse } from "next/server";
import { fetchUpcomingStoreEvents } from "@/lib/ical";

export const runtime = "nodejs";
// カレンダーの更新頻度に合わせて短めにキャッシュ（未指定なら毎回取得）
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const icsUrl = req.nextUrl.searchParams.get("icsUrl");
  const keywordsParam = req.nextUrl.searchParams.get("keywords");
  const keywords = keywordsParam
    ? keywordsParam.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  if (!icsUrl) {
    return NextResponse.json({ events: [] });
  }

  try {
    const events = await fetchUpcomingStoreEvents(icsUrl, { keywords });
    return NextResponse.json({ events });
  } catch (error) {
    console.error("[/api/calendar] iCal取得に失敗しました:", error);
    return NextResponse.json(
      { events: [], error: "カレンダー情報の取得に失敗しました。" },
      { status: 200 }
    );
  }
}
