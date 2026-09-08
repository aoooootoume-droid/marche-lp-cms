"use client";

import { useSiteContentContext } from "@/context/SiteContentContext";
import { useReservationContext } from "@/context/ReservationContext";

/**
 * スクロールしても画面上部に固定されるヘッダー。
 * 左にショップ名、右にInstagramリンクと取り置き予約ボタンを配置する。
 */
export function Header() {
  const { content } = useSiteContentContext();
  const { openReservation } = useReservationContext();

  if (!content) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-accent/30 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <span className="truncate text-base font-bold text-deep sm:text-lg">
          {content.hero.brandName}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={content.hero.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-deep/30 text-deep transition-colors hover:bg-deep hover:text-cream"
          >
            <InstagramIcon />
          </a>
          <button
            type="button"
            onClick={() => openReservation()}
            className="whitespace-nowrap rounded-full bg-deep px-3.5 py-2 text-xs font-semibold text-cream transition-colors hover:bg-deep-light sm:px-4 sm:text-sm"
          >
            取り置き予約
          </button>
        </div>
      </div>
    </header>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
