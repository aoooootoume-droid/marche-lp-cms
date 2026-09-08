// サイト全体のコンテンツ型定義。
// Firestore の `site/content` ドキュメントは { draft: SiteContent, published: SiteContent } という形を取る。

export interface SnsLink {
  label: string;
  url: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
}

export interface HeroContent {
  brandName: string;
  catchCopy: string;
  heroImageUrl: string;
  instagramUrl: string;
}

export interface AboutContent {
  heading: string;
  story: string;
  instagramEmbedUrl: string;
  snsLinks: SnsLink[];
  accessNote: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  menu: MenuItem[];
  calendarIcsUrl: string;
  calendarKeywords: string[];
}

export interface SiteDoc {
  draft: SiteContent;
  published: SiteContent;
  updatedAt?: unknown;
  publishedAt?: unknown;
}

export interface CalendarEvent {
  uid: string;
  title: string;
  start: string; // ISO文字列
  end: string; // ISO文字列
  location?: string;
  description?: string;
}

export interface ReservationItem {
  menuItemId: string;
  name: string;
  quantity: number;
}

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id?: string;
  name: string;
  contact: string;
  desiredDate: string;
  desiredTime: string;
  items: ReservationItem[];
  note?: string;
  status: ReservationStatus;
  createdAt?: unknown;
}
