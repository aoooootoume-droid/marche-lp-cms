"use client";

import { useCallback, useEffect, useState } from "react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultSiteContent } from "@/lib/defaultContent";
import type { SiteContent, SiteDoc } from "@/types/content";
import { useAuth } from "./useAuth";

const SITE_COLLECTION = "site";
const SITE_DOC_ID = "content";

/**
 * Firestore の site/content ドキュメントを購読し、
 * draft(下書き) / published(本番) の切り替えロジックを提供するフック。
 *
 * - 非ログインユーザー: 常に published を表示する。
 * - ログインユーザー: editMode / previewMode に応じて draft を表示できる。
 * - saveDraft(): 編集内容を draft フィールドにのみ保存する。
 * - publish(): draft の内容を published へ一括コピーする（本番公開）。
 */
export function useSiteContent() {
  const { user, isLoggedIn } = useAuth();
  const [siteDoc, setSiteDoc] = useState<SiteDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const docRef = db ? doc(db, SITE_COLLECTION, SITE_DOC_ID) : null;

  useEffect(() => {
    if (!docRef) {
      // Firebase未設定時（プレビュー表示のみ）はデフォルト値を表示する。
      setSiteDoc({ draft: defaultSiteContent, published: defaultSiteContent });
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          setSiteDoc(snapshot.data() as SiteDoc);
        } else if (user) {
          // ドキュメントがまだ存在しない場合、管理者ログイン中のみ初期値で作成する。
          // （Firestoreルール上、site/* への書き込みはログイン済みユーザーのみ許可されるため。）
          const initial: SiteDoc = { draft: defaultSiteContent, published: defaultSiteContent };
          await setDoc(docRef, initial);
          setSiteDoc(initial);
        } else {
          // 未ログインかつドキュメント未作成の場合は、書き込みせずデフォルト値を表示のみ行う。
          setSiteDoc({ draft: defaultSiteContent, published: defaultSiteContent });
        }
        setLoading(false);
      },
      (error) => {
        console.error("[useSiteContent] Firestore購読エラー:", error);
        setSiteDoc({ draft: defaultSiteContent, published: defaultSiteContent });
        setLoading(false);
      }
    );
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ログアウトしたら編集系のUI状態をリセットする。
  useEffect(() => {
    if (!isLoggedIn) {
      setEditMode(false);
      setPreviewMode(false);
    }
  }, [isLoggedIn]);

  // 実際に画面へ表示する内容。一般客には常に published のみを見せる。
  const viewingDraft = isLoggedIn && previewMode;
  const content: SiteContent | null = siteDoc ? (viewingDraft ? siteDoc.draft : siteDoc.published) : null;

  const saveDraft = useCallback(
    async (updater: (draft: SiteContent) => SiteContent) => {
      if (!siteDoc || !user || !docRef) return;
      const nextDraft = updater(siteDoc.draft);
      setSiteDoc((prev) => (prev ? { ...prev, draft: nextDraft } : prev));
      // setDoc(merge:true) を使うことで、ドキュメントが未作成でも安全に保存できる。
      await setDoc(
        docRef,
        { draft: nextDraft, updatedAt: serverTimestamp() },
        { merge: true }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [siteDoc, user]
  );

  const publish = useCallback(async () => {
    if (!siteDoc || !user || !docRef) return;
    setPublishing(true);
    try {
      await setDoc(
        docRef,
        { published: siteDoc.draft, publishedAt: serverTimestamp() },
        { merge: true }
      );
    } finally {
      setPublishing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteDoc, user]);

  return {
    loading,
    isLoggedIn,
    draft: siteDoc?.draft ?? null,
    published: siteDoc?.published ?? null,
    content,
    editMode,
    setEditMode,
    previewMode,
    setPreviewMode,
    publishing,
    saveDraft,
    publish,
  };
}

export type UseSiteContentReturn = ReturnType<typeof useSiteContent>;
