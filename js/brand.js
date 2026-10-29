/* Wakf — logo + rubric illustrations (inline SVG, brand palette only) */
(function () {
  'use strict';
  const W = (window.W = window.W || {});
  const J = '#12A07A', JD = '#0B7A5C', S = '#F0A830', SD = '#C9861C', N = '#1F2A44', L = '#3E6FD8', LD = '#2B54AC', A = '#8A5BD6', AD = '#6A3FB0';
  const star = (cx, cy, R, fill) => { let d = ''; for (let k = 0; k < 16; k++) { const a = (-90 + k * 22.5) * Math.PI / 180, r = k % 2 ? R * 0.7654 : R; d += (k ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); } return `<path fill="${fill}" stroke="${fill}" stroke-width="${(R * 0.18).toFixed(2)}" stroke-linejoin="round" d="${d}z"/>`; };
  W.LOGO = `<svg viewBox="0 0 64 64" role="img" aria-label="Wakf" style="width:100%;height:100%;display:block">
    <rect x="2" y="2" width="60" height="60" rx="18" fill="#0F9670"/>
    <path d="M20 2h24c9.9 0 18 8.1 18 18v8C46 22 22 20 2 28v-8C2 10.1 10.1 2 20 2z" fill="#19B78C" opacity=".55"/>
    <path d="M17 55V31.5a15 15 0 0 1 30 0V55z" fill="#fff"/>
    <path d="M21.5 51c3.4-1.7 7-1.7 10.5 0 3.5-1.7 7.1-1.7 10.5 0v-9.5c-3.4-1.7-7-1.7-10.5 0-3.5-1.7-7.1-1.7-10.5 0z" fill="#0E8E6A"/>
    <path d="M32 41.5V51" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
    ${star(32, 28.5, 6.2, S)}
  </svg>`;

  /* Game badges — illustrated tiles in the brand style (same tile, highlight and 8-point star as the logo) */
  const tile = (c, cd) => `<rect x="2" y="2" width="60" height="60" rx="18" fill="${c}"/><path d="M20 2h24c9.9 0 18 8.1 18 18v6C46 20 22 18 2 26v-6C2 10.1 10.1 2 20 2z" fill="#fff" opacity=".14"/><rect x="2" y="56" width="60" height="6" rx="3" fill="${cd}" opacity=".0"/>`;
  const wrap = (inner) => `<svg viewBox="0 0 64 64" aria-hidden="true" style="width:100%;height:100%;display:block">${inner}</svg>`;
  W.BADGE = {
    // Flashcards: two fanned cards, Arabic letter on the front, flip arrow
    flash: wrap(tile(L, LD) + `
      <rect x="21" y="13" width="26" height="34" rx="6" fill="#fff" opacity=".45" transform="rotate(12 34 30)"/>
      <rect x="15" y="15" width="26" height="34" rx="6" fill="#fff" transform="rotate(-8 28 32)"/>
      <text x="28" y="37" text-anchor="middle" font-family="Amiri, serif" font-size="22" fill="${LD}" transform="rotate(-8 28 32)">بَ</text>
      <circle cx="45" cy="46" r="9" fill="${S}"/>
      <path d="M41 45.5a4.5 4.5 0 0 1 8-2.2M49 47a4.5 4.5 0 0 1-8 2.2" fill="none" stroke="${N}" stroke-width="2" stroke-linecap="round"/>
      <path d="M49.5 40.8v3h-3M40.5 51.6v-3h3" fill="none" stroke="${N}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),
    // Tap the pairs: Arabic tile linked to a meaning tile
    pairs: wrap(tile(A, AD) + `
      <rect x="8" y="11" width="25" height="19" rx="6" fill="#fff"/>
      <text x="20.5" y="26" text-anchor="middle" font-family="Amiri, serif" font-size="13" fill="${AD}">بَيْت</text>
      <rect x="33" y="35" width="22" height="18" rx="6" fill="#fff"/>
      <path d="M38 41h12M38 46h8" stroke="${A}" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>
      <path d="M33 21c8 0 5 12 11 14" fill="none" stroke="${S}" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="33" cy="21" r="3.2" fill="${S}"/><circle cx="44" cy="35" r="3.2" fill="${S}"/>
      ${star(51, 17, 4.2, '#fff')}`),
    // How do you say…?: question bubble + Arabic answer bubble
    trans: wrap(tile(J, JD) + `
      <path d="M12 12h26a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H24l-7 6v-6h-5a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z" fill="#fff"/>
      <text x="25" y="30" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="18" fill="${JD}">?</text>
      <path d="M52 30H34a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h10l6 5v-5h2a6 6 0 0 0 6-6v-8a6 6 0 0 0-6-6z" fill="${S}"/>
      <text x="43" y="47" text-anchor="middle" font-family="Amiri, serif" font-size="16" fill="${N}">كَيْفَ</text>`),
    // Tap what you hear: speaker with waves above three word tiles
    hear: wrap(tile(S, SD) + `
      <path d="M14 18h6l8-7v24l-8-7h-6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" fill="#fff"/>
      <path d="M33 16a8 8 0 0 1 0 14M38 12a14 14 0 0 1 0 22" fill="none" stroke="${N}" stroke-width="2.8" stroke-linecap="round"/>
      <rect x="9" y="40" width="14" height="13" rx="4" fill="#fff"/><rect x="25" y="40" width="14" height="13" rx="4" fill="#fff"/><rect x="41" y="40" width="14" height="13" rx="4" fill="${N}"/>
      <text x="16" y="50.5" text-anchor="middle" font-family="Amiri, serif" font-size="12" fill="${N}">بَا</text>
      <text x="32" y="50.5" text-anchor="middle" font-family="Amiri, serif" font-size="12" fill="${N}">بُو</text>
      <path d="M46 46.5l2.2 2.2 3.6-3.8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      ${star(50, 15, 4.2, '#fff')}`),
    // Final exam: safran khatam medal with check on ribbons
    exam: wrap(tile(N, '#141B2E') + `
      <path d="M22 38l-5 18 7-3 4 6 4-15zM42 38l5 18-7-3-4 6-4-15z" fill="${J}"/>
      ${star(32, 30, 18, S)}
      <circle cx="32" cy="30" r="10.5" fill="#FDF0D7"/>
      <path d="M26.5 30.3l3.8 3.8 7.2-7.6" fill="none" stroke="${N}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="14" r="1.6" fill="#fff" opacity=".6"/><circle cx="52" cy="12" r="2" fill="${S}" opacity=".8"/><circle cx="54" cy="24" r="1.3" fill="#fff" opacity=".5"/>`),
  };

  W.ART = {
    surah: `<svg viewBox="0 0 160 160" aria-hidden="true">
      <g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55" fill="none">
        <path d="M80 80L34 38M80 80l46-42M80 80l-46 44M80 80l46 44"/></g>
      <rect x="48" y="60" width="64" height="40" rx="12" fill="#fff"/>
      <path d="M60 74h40M66 86h28" stroke="${LD}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="34" cy="38" r="15" fill="#fff"/><circle cx="34" cy="38" r="6" fill="${L}" opacity=".35"/>
      <circle cx="34" cy="124" r="15" fill="#fff"/><path d="M27 124h14" stroke="${L}" stroke-width="4" stroke-linecap="round" opacity=".5"/>
      <circle cx="126" cy="124" r="15" fill="#fff"/><circle cx="126" cy="124" r="6" fill="${L}" opacity=".35"/>
      <circle cx="126" cy="38" r="17" fill="${S}"/>${star(126, 38, 9, '#fff')}
      <circle cx="80" cy="22" r="4" fill="#fff" opacity=".5"/><circle cx="80" cy="140" r="4" fill="#fff" opacity=".5"/>
    </svg>`,
    quran: `<svg viewBox="0 0 160 160" aria-hidden="true">
      <circle cx="80" cy="80" r="62" fill="none" stroke="#fff" stroke-width="10" opacity=".25"/>
      <circle cx="80" cy="80" r="62" fill="none" stroke="${S}" stroke-width="10" stroke-linecap="round" stroke-dasharray="331 390" transform="rotate(-90 80 80)"/>
      <path d="M38 66c14-7 28-7 42 0 14-7 28-7 42 0v34c-14-7-28-7-42 0-14-7-28-7-42 0z" fill="#fff"/>
      <path d="M80 66v34" stroke="${JD}" stroke-width="3"/>
      <path d="M48 76c8-3 16-3 24 0M48 86c8-3 16-3 24 0M88 76c8-3 16-3 24 0M88 86c8-3 16-3 24 0" stroke="${J}" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>
      <path d="M58 124l44-24M102 124L58 100" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      ${star(80, 44, 8, S)}
    </svg>`,
    read: `<svg viewBox="0 0 160 160" aria-hidden="true">
      <rect x="30" y="22" width="88" height="116" rx="16" fill="#fff" transform="rotate(-6 74 80)"/>
      <rect x="36" y="18" width="88" height="116" rx="16" fill="#fff" opacity=".35" transform="rotate(8 80 76)"/>
      <text x="76" y="100" text-anchor="middle" font-family="Amiri, serif" font-size="86" fill="${AD}">بَ</text>
      <g transform="rotate(38 122 92)"><rect x="114" y="50" width="16" height="64" rx="5" fill="${S}"/><path d="M114 114h16l-8 16z" fill="#FDF0D7"/><path d="M119 124h6l-3 6z" fill="${N}"/><rect x="114" y="50" width="16" height="10" rx="4" fill="${SD}"/></g>
      ${star(44, 40, 7, S)}
    </svg>`,
    words: `<svg viewBox="0 0 160 160" aria-hidden="true">
      <rect x="40" y="50" width="76" height="92" rx="14" fill="#fff" opacity=".45" transform="rotate(-10 78 96)"/>
      <rect x="44" y="46" width="76" height="92" rx="14" fill="#fff" opacity=".7" transform="rotate(6 82 92)"/>
      <rect x="40" y="44" width="76" height="92" rx="14" fill="#fff"/>
      <text x="78" y="96" text-anchor="middle" font-family="Amiri, serif" font-size="40" fill="${N}">كَلِمَة</text>
      <path d="M56 112h44" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
      <path d="M96 14h46a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10h-22l-12 10V54h-12a10 10 0 0 1-10-10V24a10 10 0 0 1 10-10z" fill="${N}"/>
      <text x="119" y="42" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="21" fill="#fff">1000</text>
    </svg>`,
  };
})();
