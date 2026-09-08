"use client";

import { useSiteContentContext } from "@/context/SiteContentContext";
import { EditableText } from "./EditableText";
import type { SiteContent } from "@/types/content";

export function About() {
  const { content, editMode, saveDraft } = useSiteContentContext();
  if (!content) return null;
  const { about, hero } = content;

  function updateAbout(patch: Partial<SiteContent["about"]>) {
    saveDraft((draft) => ({ ...draft, about: { ...draft.about, ...patch } }));
  }

  // Instagramリンクはヒーローセクションと共通の1箇所（hero.instagramUrl）で管理し、
  // どちらから編集しても同じ値が反映されるようにする。
  function updateInstagramUrl(url: string) {
    saveDraft((draft) => ({ ...draft, hero: { ...draft.hero, instagramUrl: url } }));
  }

  function updateSnsLink(index: number, patch: Partial<{ label: string; url: string }>) {
    saveDraft((draft) => {
      const snsLinks = draft.about.snsLinks.map((link, i) => (i === index ? { ...link, ...patch } : link));
      return { ...draft, about: { ...draft.about, snsLinks } };
    });
  }

  return (
    <section id="about" className="bg-base px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-deep/70">
            About &amp; SNS
          </h2>
          <EditableText
            as="h3"
            value={about.heading}
            onSave={(v) => updateAbout({ heading: v })}
            className="mb-4 text-2xl font-bold text-deep sm:text-3xl"
            label="見出しを編集"
          />
          <EditableText
            as="p"
            value={about.story}
            onSave={(v) => updateAbout({ story: v })}
            multiline
            className="whitespace-pre-line text-deep/80 leading-relaxed"
            label="店主の想いを編集"
          />

          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <a
                href={hero.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-deep px-4 py-2 text-sm font-semibold text-deep hover:bg-deep hover:text-cream transition-colors"
              >
                Instagram
              </a>
              {editMode && (
                <EditableText
                  value={hero.instagramUrl}
                  onSave={updateInstagramUrl}
                  className="text-xs text-deep/60"
                  label="InstagramのURLを編集（ヒーローセクションと共通）"
                />
              )}
            </div>
            {about.snsLinks
              .map((link, i) => ({ link, i }))
              .filter(({ link }) => link.label.trim().toLowerCase() !== "instagram")
              .map(({ link, i }) => (
              <div key={i} className="flex items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-deep px-4 py-2 text-sm font-semibold text-deep hover:bg-deep hover:text-cream transition-colors"
                >
                  {link.label}
                </a>
                {editMode && (
                  <>
                    <EditableText
                      value={link.label}
                      onSave={(v) => updateSnsLink(i, { label: v })}
                      className="text-xs text-deep/60"
                      label="ラベルを編集"
                    />
                    <EditableText
                      value={link.url}
                      onSave={(v) => updateSnsLink(i, { url: v })}
                      className="text-xs text-deep/60"
                      label="URLを編集"
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-deep/60">
            <EditableText
              value={about.accessNote}
              onSave={(v) => updateAbout({ accessNote: v })}
              multiline
              className="whitespace-pre-line"
              label="アクセスに関する注記を編集"
            />
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="aspect-square w-full overflow-hidden rounded-xl2 border border-accent/40 bg-cream shadow-soft">
            {about.instagramEmbedUrl ? (
              <iframe
                src={about.instagramEmbedUrl}
                title="Instagram"
                className="h-full w-full border-0"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-accent-dark">
                Instagram埋め込みエリア（未設定）
              </div>
            )}
          </div>
          {editMode && (
            <EditableText
              value={about.instagramEmbedUrl || "(未設定)"}
              onSave={(v) => updateAbout({ instagramEmbedUrl: v })}
              className="text-xs text-deep/60"
              label="Instagram埋め込みURLを編集"
            />
          )}
        </div>
      </div>
    </section>
  );
}
