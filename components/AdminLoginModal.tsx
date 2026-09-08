"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
}

/** フッターの隠し導線から開く、店主向けの管理者ログインモーダル。 */
export function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      onClose();
    } catch {
      setError("ログインに失敗しました。メールアドレスとパスワードをご確認ください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-deep/60 p-4">
      <div className="w-full max-w-sm rounded-xl2 bg-cream p-6 shadow-soft border border-accent/30">
        <h2 className="mb-4 text-lg font-semibold text-deep">管理者ログイン</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-accent-dark">メールアドレス</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-accent-dark">パスワード</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-accent/40 bg-white/60 p-2.5 text-deep focus:border-deep focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm text-deep hover:bg-base/40"
            >
              閉じる
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-deep px-4 py-2 text-sm text-cream hover:bg-deep-light disabled:opacity-50"
            >
              {submitting ? "ログイン中..." : "ログイン"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
