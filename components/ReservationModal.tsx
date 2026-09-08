"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSiteContentContext } from "@/context/SiteContentContext";
import { useReservationContext } from "@/context/ReservationContext";
import type { ReservationItem } from "@/types/content";

interface CartLine {
  menuItemId: string;
  name: string;
  quantity: number;
}

/**
 * お品書きから商品を選んで事前予約・取り置きができるモーダルフォーム。
 * 送信内容は Firestore の `reservations` コレクションへ保存され、
 * インスタDM等での個別のやり取りを不要にする。
 */
export function ReservationModal() {
  const { content } = useSiteContentContext();
  const { isOpen, presetMenuItemId, closeReservation } = useReservationContext();

  const [cart, setCart] = useState<CartLine[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [desiredTime, setDesiredTime] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableItems = useMemo(
    () => content?.menu.filter((m) => m.available) ?? [],
    [content]
  );

  useEffect(() => {
    if (!isOpen) return;
    setSubmitted(false);
    setError(null);
    if (presetMenuItemId) {
      const item = content?.menu.find((m) => m.id === presetMenuItemId);
      if (item) {
        setCart([{ menuItemId: item.id, name: item.name, quantity: 1 }]);
        return;
      }
    }
    setCart([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, presetMenuItemId]);

  if (!isOpen) return null;

  function toggleItem(menuItemId: string, name: string) {
    setCart((prev) => {
      const exists = prev.find((c) => c.menuItemId === menuItemId);
      if (exists) return prev.filter((c) => c.menuItemId !== menuItemId);
      return [...prev, { menuItemId, name, quantity: 1 }];
    });
  }

  function updateQuantity(menuItemId: string, quantity: number) {
    setCart((prev) =>
      prev.map((c) => (c.menuItemId === menuItemId ? { ...c, quantity: Math.max(1, quantity) } : c))
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError("ご希望の商品を1つ以上選択してください。");
      return;
    }

    if (!db) {
      setError("Firebaseが設定されていないため、現在は予約を送信できません（プレビュー表示のみ）。");
      return;
    }

    setSubmitting(true);
    try {
      const items: ReservationItem[] = cart.map((c) => ({
        menuItemId: c.menuItemId,
        name: c.name,
        quantity: c.quantity,
      }));

      await addDoc(collection(db, "reservations"), {
        name,
        contact,
        desiredDate,
        desiredTime,
        items,
        note,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    closeReservation();
    setName("");
    setContact("");
    setDesiredDate("");
    setDesiredTime("");
    setNote("");
    setCart([]);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl2 bg-cream p-6 shadow-soft border border-accent/30">
        {submitted ? (
          <div className="py-8 text-center">
            <h3 className="mb-2 text-xl font-bold text-deep">ご予約ありがとうございます！</h3>
            <p className="text-sm text-deep/70">
              取り置きのご予約を受け付けました。当日、店頭にてお名前をお伝えください。
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-full bg-deep px-6 py-2.5 text-sm font-semibold text-cream hover:bg-deep-light"
            >
              閉じる
            </button>
          </div>
        ) : (
          <>
            <h3 className="mb-4 text-lg font-semibold text-deep">事前取り置き予約</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-accent-dark">ご希望の商品</p>
                <div className="space-y-2">
                  {availableItems.map((item) => {
                    const line = cart.find((c) => c.menuItemId === item.id);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-accent/30 bg-white/50 p-3"
                      >
                        <label className="flex items-center gap-2 text-sm text-deep">
                          <input
                            type="checkbox"
                            checked={!!line}
                            onChange={() => toggleItem(item.id, item.name)}
                          />
                          {item.name}（¥{item.price.toLocaleString()}）
                        </label>
                        {line && (
                          <input
                            type="number"
                            min={1}
                            value={line.quantity}
                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                            className="w-16 rounded-lg border border-accent/40 bg-white p-1.5 text-center text-deep"
                          />
                        )}
                      </div>
                    );
                  })}
                  {availableItems.length === 0 && (
                    <p className="text-sm text-deep/60">現在、予約可能な商品がありません。</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-accent-dark">受け取り希望日</label>
                  <input
                    type="date"
                    required
                    value={desiredDate}
                    onChange={(e) => setDesiredDate(e.target.value)}
                    className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-accent-dark">受け取り希望時間</label>
                  <input
                    type="time"
                    required
                    value={desiredTime}
                    onChange={(e) => setDesiredTime(e.target.value)}
                    className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-accent-dark">お名前</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-accent-dark">
                  連絡先（電話番号 または Instagram ID）
                </label>
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-accent-dark">備考（任意）</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full px-4 py-2 text-sm text-deep hover:bg-base/40"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-deep px-5 py-2.5 text-sm font-semibold text-cream hover:bg-deep-light disabled:opacity-50"
                >
                  {submitting ? "送信中..." : "予約を確定する"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
