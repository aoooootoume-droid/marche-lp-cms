"use client";

import { useState } from "react";
import Image from "next/image";
import { useSiteContentContext } from "@/context/SiteContentContext";
import { useReservationContext } from "@/context/ReservationContext";
import { MenuItemEditModal } from "./MenuItemEditModal";
import type { MenuItem } from "@/types/content";

export function Menu() {
  const { content, editMode, saveDraft } = useSiteContentContext();
  const { openReservation } = useReservationContext();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  if (!content) return null;
  const items = content.menu;

  function upsertItem(item: MenuItem) {
    saveDraft((draft) => {
      const exists = draft.menu.some((m) => m.id === item.id);
      const menu = exists
        ? draft.menu.map((m) => (m.id === item.id ? item : m))
        : [...draft.menu, item];
      return { ...draft, menu };
    });
  }

  function deleteItem(id: string) {
    saveDraft((draft) => ({ ...draft, menu: draft.menu.filter((m) => m.id !== id) }));
  }

  return (
    <section id="menu" className="bg-cream px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.3em] text-deep/70">
          Menu &amp; Catalog
        </h2>
        <h3 className="mb-10 text-center text-2xl font-bold text-deep sm:text-3xl">お品書き</h3>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-xl2 border border-accent/30 bg-base/20 shadow-soft"
            >
              {editMode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(item);
                    setModalOpen(true);
                  }}
                  className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-deep/90 text-cream shadow-soft hover:bg-deep"
                >
                  編
                </button>
              )}
              <div className="relative h-44 w-full bg-base">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
                {!item.available && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-3 py-1 text-xs text-cream">
                    完売
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-lg font-bold text-deep">{item.name}</h4>
                  <span className="whitespace-nowrap font-semibold text-deep">
                    ¥{item.price.toLocaleString()}
                  </span>
                </div>
                <p className="flex-1 text-sm text-deep/70">{item.description}</p>
                <button
                  type="button"
                  disabled={!item.available}
                  onClick={() => openReservation(item.id)}
                  className="mt-2 w-full rounded-full bg-deep px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-deep-light disabled:cursor-not-allowed disabled:bg-accent/50"
                >
                  取り置き予約する
                </button>
              </div>
            </div>
          ))}

          {editMode && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setCreating(true);
                setModalOpen(true);
              }}
              className="flex min-h-[16rem] flex-col items-center justify-center rounded-xl2 border-2 border-dashed border-accent/50 text-accent-dark hover:border-deep hover:text-deep"
            >
              ＋ 商品を追加
            </button>
          )}
        </div>
      </div>

      <MenuItemEditModal
        open={modalOpen}
        initialItem={creating ? null : editingItem}
        onClose={() => {
          setModalOpen(false);
          setCreating(false);
          setEditingItem(null);
        }}
        onSave={upsertItem}
        onDelete={editingItem ? deleteItem : undefined}
      />
    </section>
  );
}
