"use client";

import { useState, type FormEvent } from "react";
import type { MenuItem } from "@/types/content";

interface MenuItemEditModalProps {
  open: boolean;
  initialItem: MenuItem | null; // nullなら新規作成
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  onDelete?: (id: string) => void;
}

function emptyItem(): MenuItem {
  return {
    id: `item-${Date.now()}`,
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    available: true,
  };
}

export function MenuItemEditModal({ open, initialItem, onClose, onSave, onDelete }: MenuItemEditModalProps) {
  const [item, setItem] = useState<MenuItem>(initialItem ?? emptyItem());

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(item);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep/50 p-4">
      <div className="w-full max-w-md rounded-xl2 bg-cream p-6 shadow-soft border border-accent/30">
        <h3 className="mb-4 text-lg font-semibold text-deep">
          {initialItem ? "商品を編集" : "商品を追加"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-accent-dark">商品名</label>
            <input
              required
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-accent-dark">価格（円）</label>
            <input
              type="number"
              min={0}
              required
              value={item.price}
              onChange={(e) => setItem({ ...item, price: Number(e.target.value) })}
              className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-accent-dark">説明</label>
            <textarea
              rows={3}
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-accent-dark">画像URL</label>
            <input
              value={item.imageUrl}
              onChange={(e) => setItem({ ...item, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-deep">
            <input
              type="checkbox"
              checked={item.available}
              onChange={(e) => setItem({ ...item, available: e.target.checked })}
            />
            販売中（取り置き予約を受け付ける）
          </label>

          <div className="mt-4 flex items-center justify-between">
            {initialItem && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialItem.id);
                  onClose();
                }}
                className="text-sm text-red-700 hover:underline"
              >
                この商品を削除
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm text-deep hover:bg-base/40"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-full bg-deep px-4 py-2 text-sm text-cream hover:bg-deep-light"
              >
                下書きに保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
