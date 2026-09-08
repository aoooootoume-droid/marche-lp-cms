"use client";

import { useSiteContentContext } from "@/context/SiteContentContext";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import type { SiteContent } from "@/types/content";

export function Hero() {
  const { content, saveDraft } = useSiteContentContext();
  if (!content) return null;
  const { hero } = content;

  function updateHero(patch: Partial<SiteContent["hero"]>) {
    saveDraft((draft) => ({ ...draft, hero: { ...draft.hero, ...patch } }));
  }

  return (
    <section className="relative overflow-hidden bg-deep text-cream">
      <div className="absolute inset-0 opacity-40">
        <EditableImage
          src={hero.heroImageUrl}
          alt={hero.brandName}
          fill
          sizes="100vw"
          className="object-cover"
          onSave={(url) => updateHero({ heroImageUrl: url })}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/70 to-deep/30" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <EditableText
          as="h1"
          value={hero.brandName}
          onSave={(v) => updateHero({ brandName: v })}
          className="text-3xl font-bold tracking-wide sm:text-5xl"
          label="ブランド名を編集"
        />
        <EditableText
          as="p"
          value={hero.catchCopy}
          onSave={(v) => updateHero({ catchCopy: v })}
          className="max-w-xl text-base text-cream/90 sm:text-lg"
          label="キャッチコピーを編集"
        />

        <div className="flex items-center gap-2">
          <a
            href={hero.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-cream shadow-soft transition-colors hover:bg-accent-dark"
          >
            Instagramをフォロー
          </a>
        </div>
        <EditableText
          value={hero.instagramUrl}
          onSave={(v) => updateHero({ instagramUrl: v })}
          className="text-xs text-cream/60 underline decoration-cream/40"
          label="InstagramリンクURLを編集"
        />
      </div>
    </section>
  );
}
