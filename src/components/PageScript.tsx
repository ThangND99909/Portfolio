/**
 * The site's entire client-side behaviour, as one inline script.
 *
 * Add `is-drawn` to each diagram as it scrolls into the middle of the
 * viewport, which starts the stroke-dashoffset animation. Each diagram is
 * unobserved once drawn — it never replays. A MutationObserver registers new
 * diagrams introduced by Next.js client navigation, including locale changes.
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
  if (!('IntersectionObserver' in window)) {
    function reveal(root) {
      if (root.nodeType !== 1) return;
      if (root.matches && root.matches('[data-diagram]')) root.classList.add('is-drawn');
      var nested = root.querySelectorAll ? root.querySelectorAll('[data-diagram]') : [];
      for (var i = 0; i < nested.length; i++) nested[i].classList.add('is-drawn');
    }
    reveal(document.body);
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        for (var j = 0; j < records[i].addedNodes.length; j++) reveal(records[i].addedNodes[j]);
      }
    }).observe(document.body, { childList: true, subtree: true });
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

  function register(root) {
    if (root.nodeType !== 1) return;
    if (root.matches && root.matches('[data-diagram]:not(.is-drawn)')) io.observe(root);
    var nested = root.querySelectorAll
      ? root.querySelectorAll('[data-diagram]:not(.is-drawn)')
      : [];
    for (var i = 0; i < nested.length; i++) io.observe(nested[i]);
  }

  register(document.body);
  new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      for (var j = 0; j < records[i].addedNodes.length; j++) register(records[i].addedNodes[j]);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
`.trim();

  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
