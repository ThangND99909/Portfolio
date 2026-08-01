import { LOCALE_STORAGE_KEY } from '@/lib/i18n';

/**
 * The site's entire client-side behaviour, as one inline script.
 *
 * Two jobs:
 *   1. Add `is-drawn` to each diagram as it scrolls into the middle of the
 *      viewport, which starts the stroke-dashoffset animation. Each diagram is
 *      unobserved once drawn — it never replays.
 *   2. Record the locale the visitor is actually reading, so /index.html can
 *      send them straight back to it next time.
 *
 * Written as vanilla JS on purpose. Doing either of these in a client component
 * would pull React hydration onto every page of what is otherwise a static
 * document, and hydration was the largest single cost in the mobile profile.
 * This runs on parse, before any framework code.
 *
 * The CSS already handles the two cases this script does not: no JavaScript (a
 * <noscript> style shows the finished diagram) and prefers-reduced-motion (the
 * animation resolves instantly).
 */
export function PageScript() {
  const source = `
(function () {
  var KEY = ${JSON.stringify(LOCALE_STORAGE_KEY)};

  try {
    var lang = document.documentElement.lang;
    if (lang === 'en' || lang === 'vi') window.localStorage.setItem(KEY, lang);
  } catch (e) {
    /* storage blocked; the site does not depend on it */
  }

  var figures = document.querySelectorAll('[data-diagram]');
  if (!figures.length) return;

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < figures.length; i++) figures[i].classList.add('is-drawn');
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.classList.add('is-drawn');
        io.unobserve(entries[i].target);
      }
    },
    // A band across the middle of the viewport rather than a ratio threshold:
    // these diagrams range from 300px to 800px tall, and a ratio that works for
    // one misses the other entirely.
    { rootMargin: '-8% 0px -22% 0px' }
  );

  for (var j = 0; j < figures.length; j++) io.observe(figures[j]);
})();
`.trim();

  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
