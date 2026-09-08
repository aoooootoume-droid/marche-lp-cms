import { AdminLoginPage } from "@/components/AdminLoginPage";

// ログイン状態を扱うため静的プリレンダリング対象から除外する。
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminLoginPage />;
}
