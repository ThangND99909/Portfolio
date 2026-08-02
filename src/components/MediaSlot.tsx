import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dict';
import type { MediaSlot as Slot } from '@/content/types';

/**
 * Reserved space for a screenshot or a demo video that does not exist yet. The
 * box holds its real aspect ratio so dropping the file in later does not move
 * anything, and the note states the exact path to drop it at.
 */
export function MediaSlot({
  slot,
  locale,
  dict,
}: {
  slot: Slot;
  locale: Locale;
  dict: Dictionary;
}) {
  const kindLabel = slot.kind === 'video' ? dict.study.slot.video : dict.study.slot.screenshot;

  return (
    <figure>
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-node border border-dashed border-hairline bg-panel/40 p-6 text-center"
        style={{ aspectRatio: slot.ratio }}
      >
        <p className="label text-muted">{kindLabel}</p>
        <p className="label text-muted">
          {dict.study.mediaHint} <span className="text-brand">{slot.path}</span>
        </p>
      </div>
      <figcaption className="label-val mt-3 text-muted">{slot.caption[locale]}</figcaption>
    </figure>
  );
}
