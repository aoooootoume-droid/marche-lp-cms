# マルシェ出店LP 兼 簡易CMS

マルシェ・イベント出店者向けの1ページLP兼簡易CMSです。Firebase Authenticationでログインした店主だけが、公開中のサイトに影響を与えずに内容を編集し（下書き保存）、確認のうえ本番公開できます。

## ディレクトリ構成

```
app/
  layout.tsx              ルートレイアウト
  page.tsx                トップページ（1ページLP本体）
  globals.css             Tailwindエントリ + ベース配色
  admin/page.tsx          管理者ログイン専用ページ（/admin）
  api/calendar/route.ts   iCal(.ics)取得・パースAPI（サーバー専用）
components/
  Hero.tsx                ヒーローセクション
  News.tsx                お知らせ・出店スケジュール（Googleカレンダー連携）
  Menu.tsx                お品書き・商品カタログ
  MenuItemEditModal.tsx   商品の追加・編集モーダル
  ReservationModal.tsx    事前取り置き予約フォーム
  About.tsx               ブランド紹介・SNS導線
  Footer.tsx              フッター（隠し管理者導線を含む）
  FloatingEditBar.tsx     ログイン時のみ表示される浮遊操作バー
  AdminLoginModal.tsx     フッターから開く管理者ログインモーダル
  EditableText.tsx        インプレイス編集用テキストラッパー
  EditableImage.tsx       インプレイス編集用画像ラッパー
context/
  SiteContentContext.tsx  draft/published状態を全体共有
  ReservationContext.tsx  予約モーダルの開閉状態を共有
hooks/
  useAuth.ts              Firebase Authのログイン状態管理
  useSiteContent.ts       draft/published切り替えのコアロジック
lib/
  firebase.ts             Firebase初期化
  ical.ts                 iCal取得・パースユーティリティ（サーバー専用）
  defaultContent.ts        初期コンテンツ（サイト未セットアップ時のデフォルト）
types/
  content.ts              サイトコンテンツ・予約データの型定義
firestore.rules           Firestoreセキュリティルール例
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Firebaseプロジェクトの準備

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. **Authentication** → Sign-in method で「メール/パスワード」を有効化し、店主用のアカウントを1つ作成
3. **Cloud Firestore** をネイティブモードで作成
4. `firestore.rules` の内容をFirestoreのルールに反映（Firebase Console上のルールエディタ、または `firebase deploy --only firestore:rules`）
5. プロジェクト設定 → 「マイアプリ」でウェブアプリを追加し、SDK設定値を取得

### 3. 環境変数の設定

`.env.local.example` を `.env.local` にコピーし、Firebaseの設定値を入力してください。

```bash
cp .env.local.example .env.local
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:3000` にアクセスするとLPが表示されます。初回アクセス時、Firestoreに `site/content` ドキュメントが存在しない場合はデフォルトコンテンツが画面表示のみされます（ログイン後に一度保存すると実際にドキュメントが作成されます）。

## 主要機能の使い方

### ① インプレイス編集・下書き/公開システム

- `/admin` ページ、またはフッター右下の控えめな「・」リンクからログインすると、画面下部に浮遊バーが表示されます。
- 「編集モード切替」をONにすると、各テキスト・画像に鉛筆アイコンが表示され、クリックで編集できます。
- 編集内容は即座に Firestore の `draft` フィールドに保存されます（一般公開には影響しません）。
- 「プレビュー」をONにすると、ログイン中の自分だけ下書き内容を確認できます。
- 「本番公開」を押すと確認ダイアログが表示され、OKすると `draft` の内容が `published` に一括コピーされ、一般のお客様にも即座に反映されます。

### ② Googleカレンダー連携「お知らせ」自動生成

1. Googleカレンダーの「設定と共有」→「カレンダーの統合」から**秘密のアドレス（iCal形式）**をコピー
2. 編集モードで「お知らせ」セクションを開き、iCal URLと抽出キーワード（例: 出店, イベント, マルシェ）を設定して公開
3. タイトルにキーワードを含む未来の予定が自動的に「次回出店情報カード」として表示されます

iCalの取得・パースは `app/api/calendar/route.ts`（サーバー専用API）が `lib/ical.ts` の `node-ical` ベースの関数を使って行うため、CORSの制約を受けません。

### ③ 事前取り置き予約フォーム

- お品書きの各商品にある「取り置き予約する」ボタンから、その商品があらかじめ選択された状態で予約モーダルが開きます。
- 送信内容は Firestore の `reservations` コレクションに保存されます。
- 予約の確認・管理は Firebase Console（またはログイン後の管理画面を別途拡張）から行ってください。インスタDMでのやり取りは不要になります。

## 配色ルール

| 用途 | 色 | 比率 |
| --- | --- | --- |
| メイン背景・ベースカラー | `#bdc6ca`（`bg-base`） | 7 |
| アクセント・境界線・補助色 | `#889291`（`bg-accent`） | 1 |
| テキスト・強調・UIパーツ | `#32495f`（`bg-deep` / `text-deep`） | 3 |
| カード・ベース背景の白系 | `#fbf9f5`（`bg-cream`）※純白は不使用 | - |

`tailwind.config.ts` にカスタムカラーとして定義済みです。
