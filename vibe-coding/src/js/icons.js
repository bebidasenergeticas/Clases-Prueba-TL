// Iconos de línea propios (retícula 24×24) para mantener una sola voz visual.
const ICONS = {
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12h5M10 15.5h5M10 9h2"/>',
  layout: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9h17M9.5 9v10.5"/>',
  code: '<path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5l-3 14"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="m8.2 12.3 2.6 2.6 5-5.4"/>',
  wrench: '<path d="M14.5 4.2a4.5 4.5 0 0 0-5.3 6.2L4 15.6V20h4.4l5.2-5.2a4.5 4.5 0 0 0 6.2-5.3l-2.9 2.9-2.9-.6-.6-2.9z"/>',
  cloud: '<path d="M7.5 18.5h10a4 4 0 0 0 .4-8A5.6 5.6 0 0 0 7 9.6a4.5 4.5 0 0 0 .5 8.9z"/><path d="M12 15.5v-5M9.8 12.6 12 10.4l2.2 2.2"/>',
  play: '<circle cx="12" cy="12" r="8.5"/><path d="M10 8.6v6.8l5.4-3.4z"/>',
  logic: '<path d="M4 6.5h6M4 17.5h6M14 12h6"/><path d="M10 6.5c2.5 0 1.5 5.5 4 5.5M10 17.5c2.5 0 1.5-5.5 4-5.5"/><circle cx="4" cy="6.5" r=".6"/><circle cx="4" cy="17.5" r=".6"/>',
  shield: '<path d="M12 3.5 5 6.2v5.3c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6.2z"/><path d="M12 8.5v4.5M12 16v.2"/>',
  key: '<circle cx="8" cy="15" r="3.6"/><path d="m10.6 12.4 8-8M16 7l2.4 2.4M13.8 9.2l1.8 1.8"/>',
  package: '<path d="m12 3.5 7.5 4v9L12 20.5l-7.5-4v-9z"/><path d="M4.5 7.5 12 11.5l7.5-4M12 11.5v9"/><path d="m8.2 5.5 7.5 4" opacity=".6"/>',
  tangle: '<path d="M3.5 12c2-5 5-5 6.5-1.5S14 17 16 12s1-7.5-2-6.5S7 13 10 16s7 2 10.5-2"/>',
  load: '<path d="M4.5 16a7.5 7.5 0 1 1 15 0"/><path d="m12 16 4-5"/><path d="M7 16h.2M17 16h-.2M12 8.5v.2"/>',
};

export function renderIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    const d = ICONS[el.dataset.icon];
    if (d) el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  });
}
