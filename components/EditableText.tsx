"use client";

import { useState, type CSSProperties } from "react";
import { useSiteContentContext } from "@/context/SiteContentContext";

interface EditableTextProps {
  value: string;
  onSave: (nextValue: string) => void;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  multiline?: boolean;
  label?: string;
  style?: CSSProperties;
}

/**
 * 編集モード中は鉛筆アイコンをホバー表示し、クリックでモーダルを開いて
 * テキストを編集できるようにするラッパーコンポーネント。
 * 保存は draft にのみ反映される（saveDraft 経由）。
 */
export function EditableText({
  value,
  onSave,
  as = "span",
  className = "",
  multiline = false,
  label = "テキストを編集",
  style,
}: EditableTextProps) {
  const { editMode } = useSiteContentContext();
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  const Tag = as;

  if (!editMode) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  return (
    <>
      <span className="relative inline-block group align-top">
        <Tag className={className} style={style}>
          {value}
        </Tag>
        <button
          type="button"
          aria-label={label}
          onClick={() => {
            setDraftValue(value);
            setOpen(true);
          }}
          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-deep text-cream opacity-70 hover:opacity-100 transition-opacity align-middle"
        >
          <PencilIcon />
        </button>
      </span>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep/50 p-4">
          <div className="w-full max-w-lg rounded-xl2 bg-cream p-6 shadow-soft border border-accent/30">
            <h3 className="mb-3 text-sm font-semibold text-deep">{label}</h3>
            {multiline ? (
              <textarea
                className="w-full rounded-lg border border-accent/40 bg-white/60 p-3 text-deep focus:border-deep focus:outline-none"
                rows={5}
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
              />
            ) : (
              <input
                className="w-full rounded-lg border border-accent/40 bg-white/60 p-3 text-deep focus:border-deep focus:outline-none"
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
              />
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm text-deep hover:bg-base/40"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(draftValue);
                  setOpen(false);
                }}
                className="rounded-full bg-deep px-4 py-2 text-sm text-cream hover:bg-deep-light"
              >
                下書きに保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.507l-3.03.865a.5.5 0 0 1-.618-.618l.865-3.03a2 2 0 0 1 .507-.878l8.5-8.5z" />
    </svg>
  );
}
