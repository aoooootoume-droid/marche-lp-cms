import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "マルシェ出店LP",
  description: "マルシェ・イベント出店者向け 1ページLP兼簡易CMS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="font-sans">{children}</body>
    </html>
  );
}
