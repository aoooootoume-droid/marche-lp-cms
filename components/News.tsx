"use client";

import { useEffect, useState } from "react";
import { useSiteContentContext } from "@/context/SiteContentContext";
import { EditableText } from "./EditableText";
import type { CalendarEvent, SiteContent } from "@/types/content";

function formatDateRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const dateFmt = new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric", weekday: "short" });
  const timeFmt = new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" });
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    return `${dateFmt.format(start)} ${timeFmt.format(start)}〜${timeFmt.format(end)}`;
  }
  return `${dateFmt.format(start)} 〜 ${dateFmt.format(end)}`;
}

export function News() {
  const { content, editMode, saveDraft } = useSiteContentContext();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");

  const icsUrl = content?.calendarIcsUrl ?? "";
  const keywords = content?.calendarKeywords ?? [];

  useEffect(() => {
    if (!icsUrl) {
      setEvents([]);
      setStatus("done");
      return;
    }
    setStatus("loading");
    const params = new URLSearchParams({ icsUrl, keywords: keywords.join(",") });
    fetch(`/api/calendar?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events ?? []);
        setStatus("done");
      })
      .catch(() => setStatus("error"));
  }, [icsUrl, keywords.join(",")]);

  if (!content) return null;

  function updateField(patch: Partial<SiteContent>) {
    saveDraft((draft) => ({ ...draft, ...patch }));
  }

  return (
    <section id="news" className="bg-base px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.3em] text-deep/70">
          News &amp; Schedule
        </h2>
        <h3 className="mb-10 text-center text-2xl font-bold text-deep sm:text-3xl">お知らせ・出店スケジュール</h3>

        {editMode && (
          <div className="mb-8 rounded-xl2 border border-accent/40 bg-cream p-4 text-sm">
            <p className="mb-2 font-semibold text-deep">Googleカレンダー連携設定</p>
            <label className="mb-1 block text-xs text-accent-dark">
              iCal(.ics) 秘密のアドレス
            </label>
            <EditableText
              value={icsUrl || "(未設定)"}
              onSave={(v) => updateField({ calendarIcsUrl: v })}
              className="block break-all text-deep"
              label="カレンダーの iCal URL を編集"
            />
            <label className="mb-1 mt-3 block text-xs text-accent-dark">抽出キーワード（カンマ区切り）</label>
            <EditableText
              value={keywords.join(", ")}
              onSave={(v) =>
                updateField({ calendarKeywords: v.split(",").map((k) => k.trim()).filter(Boolean) })
              }
              className="block text-deep"
              label="抽出キーワードを編集"
            />
          </div>
        )}

        {!icsUrl && (
          <p className="text-center text-sm text-deep/70">
            現在、出店スケジュールは登録されていません。
          </p>
        )}

        {icsUrl && status === "loading" && (
          <p className="text-center text-sm text-deep/70">スケジュールを読み込み中...</p>
        )}

        {icsUrl && status === "error" && (
          <p className="text-center text-sm text-deep/70">
            カレンダー情報の取得に失敗しました。時間をおいて再度お試しください。
          </p>
        )}

        {icsUrl && status === "done" && events.length === 0 && (
          <p className="text-center text-sm text-deep/70">現在、次回の出店予定はありません。</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <div
              key={event.uid}
              className="rounded-xl2 border border-accent/30 bg-cream p-5 shadow-soft"
            >
              <span className="mb-2 inline-block rounded-full bg-deep px-3 py-1 text-xs font-semibold text-cream">
                次回出店情報
              </span>
              <h4 className="text-lg font-bold text-deep">{event.title}</h4>
              <p className="mt-1 text-sm text-deep/80">{formatDateRange(event.start, event.end)}</p>
              {event.location && (
                <p className="mt-1 text-sm text-accent-dark">📍 {event.location}</p>
              )}
              {event.description && (
                <p className="mt-2 text-sm text-deep/70">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
