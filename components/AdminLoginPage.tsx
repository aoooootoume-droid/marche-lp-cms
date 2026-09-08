"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * フッターの隠しモーダルとは別に、URLを直接知っている店主が
 * ログインできる管理者ページ。ログイン後はトップページへ戻る。
 */
export function AdminLoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("ログインに失敗しました。メールアドレスとパスワードをご確認ください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="w-full max-w-sm rounded-xl2 bg-cream p-8 shadow-soft border border-accent/30">
        <h1 className="mb-1 text-lg font-bold text-deep">管理者ログイン</h1>
        <p className="mb-6 text-sm text-deep/60">
          {isLoggedIn ? "ログイン済みです。トップページから編集できます。" : "店主専用ページです。"}
        </p>

        {!isLoggedIn && (
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
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-deep px-4 py-2.5 text-sm font-semibold text-cream hover:bg-deep-light disabled:opacity-50"
            >
              {submitting ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        )}

        <a href="/" className="mt-6 block text-center text-sm text-deep/60 hover:text-deep">
          トップページへ戻る
        </a>
      </div>
    </main>
  );
}
