import { HomeClient } from "@/components/HomeClient";

// このページは Firebase Auth のログイン状態と Firestore の draft/published を
// 常にリアルタイムで参照するため、静的プリレンダリング対象から除外する。
export const dynamic = "force-dynamic";

export default function Home() {
  return <HomeClient />;
}
