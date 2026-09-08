import type { SiteContent } from "@/types/content";

// Firestore に site/content ドキュメントがまだ存在しない場合の初期値。
// 初回アクセス時に useSiteContent がこの内容で自動的にドキュメントを作成する。
export const defaultSiteContent: SiteContent = {
  hero: {
    brandName: "焼き菓子とコーヒー sui",
    catchCopy: "小さな窯から、心をこめてひとつずつ。",
    heroImageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600&auto=format&fit=crop",
    instagramUrl: "https://www.instagram.com/",
  },
  about: {
    heading: "わたしたちについて",
    story:
      "週末だけの小さな焼き菓子屋です。素材にこだわり、マルシェやイベントで一つひとつ手渡しできる距離感を大切にしています。",
    instagramEmbedUrl: "",
    // Instagramのリンクは hero.instagramUrl で一元管理するため、ここには含めない。
    snsLinks: [{ label: "X (Twitter)", url: "https://x.com/" }],
    accessNote: "出店場所・時間は「お知らせ」セクションのスケジュールをご確認ください。",
  },
  menu: [
    {
      id: "item-1",
      name: "焼き菓子セット",
      price: 800,
      description: "季節のフルーツを使った焼き菓子5種の詰め合わせ。",
      imageUrl: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=800&auto=format&fit=crop",
      available: true,
    },
    {
      id: "item-2",
      name: "ドリップコーヒー",
      price: 500,
      description: "自家焙煎豆を使用した1杯ずつのハンドドリップ。",
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
      available: true,
    },
  ],
  calendarIcsUrl: "",
  calendarKeywords: ["出店", "イベント", "マルシェ"],
};
