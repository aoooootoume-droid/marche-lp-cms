"use client";

import { useState } from "react";
import Image from "next/image";
import { useSiteContentContext } from "@/context/SiteContentContext";
import { PencilIcon } from "./EditableText";

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (nextUrl: string) => void;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

/** 編集モード時に画像URLを差し替えられる画像コンポーネント。 */
export function EditableImage({ src, alt, onSave, className = "", fill, sizes }: EditableImageProps) {
  const { editMode } = useSiteContentContext();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(src);

  return (
    <div className={`relative ${fill ? "h-full w-full" : ""}`}>
      {fill ? (
        <Image src={src} alt={alt} fill sizes={sizes} className={className} />
      ) : (
        <Image src={src} alt={alt} width={800} height={600} className={className} />
      )}

      {editMode && (
        <button
          type="button"
          aria-label="画像を編集"
          onClick={() => {
            setUrl(src);
            setOpen(true);
          }}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-deep/90 text-cream shadow-soft hover:bg-deep"
        >
          <PencilIcon />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep/50 p-4">
          <div className="w-full max-w-lg rounded-xl2 bg-cream p-6 shadow-soft border border-accent/30">
            <h3 className="mb-3 text-sm font-semibold text-deep">画像URLを編集</h3>
            <input
              className="w-full rounded-lg border border-accent/40 bg-white/60 p-3 text-deep focus:border-deep focus:outline-none"
              value={url}
              placeholder="https://..."
              onChange={(e) => setUrl(e.target.value)}
            />
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
                  onSave(url);
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
    </div>
  );
}
