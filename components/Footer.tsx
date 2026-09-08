"use client";

import { useState } from "react";
import { useSiteContentContext } from "@/context/SiteContentContext";
import { AdminLoginModal } from "./AdminLoginModal";

export function Footer() {
  const { content, isLoggedIn } = useSiteContentContext();
  const [loginOpen, setLoginOpen] = useState(false);
  const year = new Date().getFullYear();
  const brandName = content?.hero.brandName ?? "";

  return (
    <footer className="bg-deep px-6 py-10 text-center text-cream/70">
      <p className="text-sm">
        &copy; {year} {brandName}. All rights reserved.
      </p>
      {!isLoggedIn && (
        <button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="mt-3 text-xs text-cream/30 hover:text-cream/60"
          aria-label="管理者ログイン"
          title="管理者ログイン"
        >
          ・
        </button>
      )}
      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </footer>
  );
}
