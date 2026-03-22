/**
 * HTML Parts Loader
 * Loads reusable HTML fragments into elements with data-part attributes.
 *
 * Usage:
 *   <div data-part="header"></div>
 *   This will fetch /parts/header.html and inject it.
 *
 * For pages in subdirectories (e.g., /technology/house.html),
 * set data-base=".." so paths resolve correctly:
 *   <div data-part="header" data-base=".."></div>
 */

async function loadParts() {
  const slots = document.querySelectorAll('[data-part]');

  const loads = [...slots].map(async (slot) => {
    const name = slot.dataset.part;
    const base = slot.dataset.base || '.';
    const url = `${base}/parts/${name}.html`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      let html = await res.text();

      // Fix relative paths for subdirectory pages
      if (base !== '.') {
        // Rewrite href="/" to point to the actual root
        html = html.replace(/href="\/"/, `href="${base}/index.html"`);
      }

      slot.outerHTML = html;
    } catch (err) {
      console.warn(`Failed to load part "${name}":`, err);
    }
  });

  await Promise.all(loads);

  // After all parts are loaded, fire a custom event
  // so other scripts know the DOM is ready
  document.dispatchEvent(new Event('partsLoaded'));
}

loadParts();
