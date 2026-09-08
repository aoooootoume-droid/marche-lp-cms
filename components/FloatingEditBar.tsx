"use client";

import { useState } from "react";
import { useSiteContentContext } from "@/context/SiteContentContext";
import { useAuth } from "@/hooks/useAuth";

/**
 * Firebase Authでログイン中のユーザーにのみ表示される浮遊操作バー。
 * 「編集モード切替」「プレビュー」「本番公開」を提供する。
 */
export function FloatingEditBar() {
  const { isLoggedIn } = useAuth();
  const { editMode, setEditMode, previewMode, setPreviewMode, publish, publishing } =
    useSiteContentContext();
  const { logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!isLoggedIn) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-full border border-accent/40 bg-deep px-4 py-2.5 text-cream shadow-soft">
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-cream/70 sm:inline">管理者モード</span>
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                editMode ? "bg-cream text-deep" : "bg-deep-light text-cream hover:bg-accent"
              }`}
            >
              {editMode ? "編集モード：ON" : "編集モード切替"}
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                previewMode ? "bg-cream text-deep" : "bg-deep-light text-cream hover:bg-accent"
              }`}
            >
              {previewMode ? "下書きプレビュー中" : "プレビュー"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={publishing}
              className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-cream hover:bg-accent-dark disabled:opacity-50"
            >
              {publishing ? "公開中..." : "本番公開"}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full px-2 py-1.5 text-xs text-cream/70 hover:text-cream"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-deep/50 p-4">
          <div className="w-full max-w-sm rounded-xl2 bg-cream p-6 text-center shadow-soft border border-accent/30">
            <p className="text-deep">
              下書きの内容を本番サイトへ公開します。
              <br />
              一般のお客様にもすぐに反映されます。よろしいですか？
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-full px-4 py-2 text-sm text-deep hover:bg-base/40"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={async () => {
                  await publish();
                  setConfirmOpen(false);
                }}
                className="rounded-full bg-deep px-4 py-2 text-sm text-cream hover:bg-deep-light"
              >
                公開する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
