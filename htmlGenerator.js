const generateHTML = (product, data) => {
  const { scores, pointsForts, vigilances, analyseFrags, risques, fiscalite, conclusion, interpretation } = data;
  const date = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  const scoreColor = (score, max) => {
    const pct = score / max;
    if (pct >= 0.75) return '#27AE60';
    if (pct >= 0.5) return '#F5A623';
    return '#C0392B';
  };

  const niveauClass = (n) => {
    if (!n) return 'level-check';
    const l = n.toLowerCase();
    if (l.includes('faible')) return 'level-low';
    if (l.includes('élevé') || l.includes('eleve')) return 'level-high';
    if (l.includes('vérifier') || l.includes('verifier')) return 'level-check';
    return 'level-mod';
  };

  const evalClass = (e) => {
    if (!e) return '';
    const l = e.toLowerCase();
    if (l.includes('élevé') || l.includes('eleve') || l.includes('très')) return 'tag-elev';
    if (l.includes('normal') || l.includes('norme')) return 'tag-ok';
    if (l.includes('inconnu') || l.includes('manquant') || l.includes('vérifier')) return 'tag-miss';
    if (l.includes('faible')) return 'tag-ok';
    return 'tag-warn';
  };

  const amortColor = (pct) => {
    if (pct >= 80) return '#C0392B';
    if (pct >= 50) return '#F5A623';
    return '#27AE60';
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1024">
<title>Clario - Rapport ${product.name}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:Arial,Helvetica,sans-serif; background:#fff; color:#1B2E4B; -webkit-print-color-adjust:exact; print-color-adjust:exact; width:1024px; }
  .page { width:1024px; height:1448px; overflow:hidden; position:relative; page-break-after:always; background:#fff; }
  .page:last-child { page-break-after:auto; }

  /* PAGE 1 */
  .p1 { background:#1B2E4B; color:#fff; }
  .p1-header { display:table; width:100%; padding:38px 52px 24px 52px; }
  .p1-logo { display:table-cell; vertical-align:middle; width:50%; }
  .p1-logo-text { font-size:38px; font-weight:900; color:#fff; letter-spacing:5px; }
  .p1-logo-sub { font-size:11px; color:#4A90D9; letter-spacing:3px; text-transform:uppercase; margin-top:4px; }
  .p1-date { display:table-cell; vertical-align:middle; text-align:right; font-size:11px; color:#7a9cc4; line-height:1.6; }
  .p1-hero { display:table; width:100%; padding:0 52px; margin-top:36px; }
  .p1-hero-left { display:table-cell; vertical-align:top; width:55%; padding-right:36px; }
  .p1-hero-right { display:table-cell; vertical-align:top; width:45%; }
  .p1-report-label { font-size:11px; color:#4A90D9; text-transform:uppercase; letter-spacing:3px; margin-bottom:14px; }
  .p1-product-name { font-size:64px; font-weight:900; color:#fff; line-height:1.05; margin-bottom:14px; }
  .p1-product-sub { font-size:16px; color:#7a9cc4; margin-bottom:36px; line-height:1.6; }
  .p1-score-label { font-size:11px; color:#4A90D9; text-transform:uppercase; letter-spacing:2px; margin-bottom:5px; }
  .p1-score-big { font-size:110px; font-weight:900; color:#fff; line-height:1; }
  .p1-score-denom { font-size:34px; color:#4A90D9; font-weight:700; }
  .p1-score-qual { font-size:13px; color:#7a9cc4; margin-top:8px; }
  .p1-fiche { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:22px; margin-bottom:20px; }
  .p1-fiche-title { font-size:9px; color:#4A90D9; text-transform:uppercase; letter-spacing:2px; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; }
  .p1-fiche-row { display:table; width:100%; margin-bottom:9px; }
  .p1-fiche-key { display:table-cell; font-size:11px; color:#7a9cc4; width:55%; }
  .p1-fiche-val { display:table-cell; font-size:11px; color:#fff; font-weight:700; text-align:right; }
  .p1-bar-row { margin-bottom:12px; }
  .p1-bar-label { display:table; width:100%; margin-bottom:4px; }
  .p1-bar-ltext { display:table-cell; font-size:10px; color:#7a9cc4; }
  .p1-bar-lval { display:table-cell; font-size:10px; color:#fff; font-weight:700; text-align:right; }
  .p1-bar-track { background:rgba(255,255,255,0.1); border-radius:4px; height:8px; width:100%; }
  .p1-bar-fill { height:8px; border-radius:4px; }
  .p1-footer { position:absolute; bottom:0; left:0; right:0; padding:14px 52px; background:rgba(0,0,0,0.25); font-size:8px; color:rgba(255,255,255,0.35); line-height:1.6; }

  /* HEADER PAGES 2-5 */
  .page-header { display:table; width:100%; background:#1B2E4B; padding:18px 52px; }
  .ph-left { display:table-cell; vertical-align:middle; }
  .ph-logo { font-size:20px; font-weight:900; color:#fff; letter-spacing:3px; }
  .ph-subtitle { font-size:8px; color:#4A90D9; text-transform:uppercase; letter-spacing:2px; margin-top:2px; }
  .ph-right { display:table-cell; vertical-align:middle; text-align:right; }
  .ph-page { font-size:10px; color:#7a9cc4; line-height:1.5; }
  .ph-page strong { color:#fff; }
  .page-body { padding:26px 52px 20px 52px; }
  .section-title { font-size:24px; font-weight:900; color:#1B2E4B; margin-bottom:4px; }
  .section-sub { font-size:11px; color:#7a9cc4; margin-bottom:20px; }

  /* PAGE 2 */
  .p2-cols { display:table; width:100%; }
  .p2-left { display:table-cell; vertical-align:top; width:52%; padding-right:22px; }
  .p2-right { display:table-cell; vertical-align:top; width:48%; }
  .ring-label { font-size:9px; color:#7a9cc4; text-transform:uppercase; letter-spacing:2px; margin-bottom:8px; text-align:center; }
  .ring-wrapper { text-align:center; margin-bottom:18px; }
  .score-bars { margin-bottom:18px; }
  .sbar-row { margin-bottom:12px; }
  .sbar-head { display:table; width:100%; margin-bottom:5px; }
  .sbar-name { display:table-cell; font-size:12px; color:#1B2E4B; font-weight:700; }
  .sbar-score { display:table-cell; font-size:12px; font-weight:900; text-align:right; }
  .sbar-track { background:#F0F3F7; border-radius:5px; height:11px; width:100%; }
  .sbar-fill { height:11px; border-radius:5px; }
  .interp-box { background:#F5F5F5; border-left:4px solid #4A90D9; padding:14px; border-radius:0 5px 5px 0; font-size:11px; color:#1B2E4B; line-height:1.6; }
  .no-verdict { background:#FFF3CD; border:1px solid #F5A623; border-radius:4px; padding:9px 14px; font-size:10px; color:#7A4E00; margin-bottom:14px; text-align:center; }
  .point-block-title { font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
  .point-item { display:table; width:100%; margin-bottom:9px; border-radius:5px; padding:10px 12px; }
  .point-icon { display:table-cell; vertical-align:top; width:20px; font-size:13px; }
  .point-text { display:table-cell; vertical-align:top; font-size:10px; line-height:1.5; }
  .point-text strong { font-size:11px; display:block; margin-bottom:2px; }
  .point-fort { background:#F0FAF4; }
  .point-fort .point-icon { color:#27AE60; }
  .point-fort .point-text { color:#1B5E2E; }
  .point-fort .point-text strong { color:#27AE60; }
  .point-vig { background:#FFF8EE; }
  .point-vig .point-icon { color:#F5A623; }
  .point-vig .point-text { color:#7A4E00; }
  .point-vig .point-text strong { color:#F5A623; }
  .stripe-band { background:#1B2E4B; border-radius:8px; padding:16px 18px; margin-top:14px; display:table; width:100%; }
  .stripe-left { display:table-cell; vertical-align:middle; }
  .stripe-right { display:table-cell; vertical-align:middle; text-align:right; width:26%; }
  .stripe-title { font-size:13px; font-weight:900; color:#fff; margin-bottom:4px; }
  .stripe-sub { font-size:10px; color:#7a9cc4; line-height:1.4; }
  .stripe-btn { background:#4A90D9; color:#fff; font-size:12px; font-weight:700; padding:11px 20px; border-radius:5px; text-decoration:none; display:inline-block; }

  /* PAGE 3 */
  .p3-cols { display:table; width:100%; }
  .p3-left { display:table-cell; vertical-align:top; width:56%; padding-right:22px; }
  .p3-right { display:table-cell; vertical-align:top; width:44%; }
  table.comp { width:100%; border-collapse:collapse; font-size:10px; margin-bottom:14px; }
  table.comp th { background:#1B2E4B; color:#fff; padding:9px 11px; text-align:left; font-size:9px; }
  table.comp td { padding:8px 11px; border-bottom:1px solid #eef0f3; color:#1B2E4B; vertical-align:middle; }
  table.comp tr:nth-child(even) td { background:#F9FAFB; }
  .tag-elev { color:#C0392B; font-weight:700; }
  .tag-ok { color:#27AE60; font-weight:700; }
  .tag-warn { color:#F5A623; font-weight:700; }
  .tag-miss { color:#999; font-style:italic; }
  .impact-box { background:#F5F5F5; border-radius:5px; padding:13px; margin-bottom:12px; font-size:10px; color:#1B2E4B; line-height:1.65; }
  .impact-title { font-size:9px; font-weight:900; color:#1B2E4B; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px; }
  .impact-row { display:table; width:100%; margin-bottom:4px; }
  .impact-key { display:table-cell; color:#555; }
  .impact-val { display:table-cell; font-weight:700; text-align:right; }
  .impact-neg { color:#C0392B; }
  .impact-pos { color:#27AE60; }
  .impact-sep { border:none; border-top:1px solid #ddd; margin:5px 0; }
  .amort-title { font-size:11px; font-weight:900; color:#1B2E4B; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
  .amort-bar-row { margin-bottom:11px; }
  .amort-bar-head { display:table; width:100%; margin-bottom:4px; }
  .amort-bar-label { display:table-cell; font-size:10px; color:#555; }
  .amort-bar-val { display:table-cell; font-size:10px; font-weight:700; text-align:right; }
  .amort-track { background:#F0F3F7; border-radius:5px; height:12px; width:100%; }
  .amort-fill { height:12px; border-radius:5px; }
  .peda-box { background:#EFF6FF; border-left:4px solid #4A90D9; padding:14px; border-radius:0 5px 5px 0; font-size:10px; color:#1B2E4B; line-height:1.55; margin-top:14px; }
  .score-badge { display:table; margin-left:auto; margin-top:14px; background:#1B2E4B; color:#fff; border-radius:8px; padding:10px 18px; }
  .score-badge-inner { display:table-cell; vertical-align:middle; }
  .score-badge-label { font-size:8px; color:#7a9cc4; text-transform:uppercase; letter-spacing:1px; }
  .score-badge-val { font-size:32px; font-weight:900; color:#4A90D9; line-height:1; }
  .score-badge-denom { font-size:14px; color:#7a9cc4; }

  /* PAGE 4 */
  .sri-section { margin-bottom:16px; }
  .sri-title { font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#1B2E4B; margin-bottom:10px; }
  .sri-track { display:table; width:100%; border-collapse:separate; border-spacing:4px; }
  .sri-cell { display:table-cell; text-align:center; padding:10px 0 8px 0; font-size:12px; font-weight:700; color:#fff; border-radius:5px; width:14.28%; }
  .sri-1{background:#27AE60;} .sri-2{background:#6EC25B;} .sri-3{background:#BCD63A;color:#333;}
  .sri-4{background:#F5C842;color:#333;} .sri-5{background:#F5A623;} .sri-6{background:#E07020;} .sri-7{background:#C0392B;}
  .sri-active { outline:3px solid #1B2E4B; outline-offset:2px; }
  .sri-labels { display:table; width:100%; margin-top:5px; }
  .sri-lbl-l { display:table-cell; font-size:8px; color:#7a9cc4; }
  .sri-lbl-r { display:table-cell; font-size:8px; color:#7a9cc4; text-align:right; }
  .risk-blocks { display:table; width:100%; margin-bottom:14px; }
  .risk-col1 { display:table-cell; vertical-align:top; width:50%; padding-right:10px; }
  .risk-col2 { display:table-cell; vertical-align:top; width:50%; }
  .risk-item { background:#F5F5F5; border-radius:5px; padding:13px; margin-bottom:10px; }
  .risk-item-head { display:table; width:100%; margin-bottom:5px; }
  .risk-item-name { display:table-cell; font-size:11px; font-weight:700; color:#1B2E4B; }
  .risk-item-level { display:table-cell; text-align:right; font-size:8px; font-weight:700; border-radius:3px; padding:2px 8px; }
  .level-low { background:#E8F8ED; color:#27AE60; }
  .level-mod { background:#FFF3CD; color:#F5A623; }
  .level-high { background:#FDE8E8; color:#C0392B; }
  .level-check { background:#EEF0F3; color:#555; }
  .risk-item-text { font-size:10px; color:#555; line-height:1.55; }
  .retrait-box { background:#FFF8EE; border-left:4px solid #F5A623; border-radius:0 5px 5px 0; padding:14px; margin-bottom:12px; }
  .retrait-title { font-size:11px; font-weight:900; color:#F5A623; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }

  /* PAGE 5 */
  .p5-cols { display:table; width:100%; }
  .p5-left { display:table-cell; vertical-align:top; width:55%; padding-right:22px; }
  .p5-right { display:table-cell; vertical-align:top; width:45%; }
  .fiscal-regime { background:#F5F5F5; border-radius:5px; padding:14px; margin-bottom:14px; font-size:10px; color:#1B2E4B; line-height:1.65; }
  .fiscal-regime-title { font-size:12px; font-weight:900; color:#1B2E4B; margin-bottom:9px; }
  .horizon-box { background:#EFF6FF; border-left:4px solid #4A90D9; padding:14px; border-radius:0 5px 5px 0; font-size:10px; color:#1B2E4B; line-height:1.55; }
  .vig-box { background:#FFF8EE; border-left:4px solid #F5A623; border-radius:0 5px 5px 0; padding:14px; margin-bottom:12px; }
  .vig-box-title { font-size:11px; font-weight:900; color:#F5A623; text-transform:uppercase; letter-spacing:1px; margin-bottom:9px; }
  .vig-item { display:table; width:100%; margin-bottom:7px; }
  .vig-bullet { display:table-cell; width:14px; color:#F5A623; font-size:12px; font-weight:900; }
  .vig-text { display:table-cell; font-size:10px; color:#7A4E00; line-height:1.45; }
  .optim-box { background:#F0FAF4; border-left:4px solid #27AE60; border-radius:0 5px 5px 0; padding:14px; }
  .optim-box-title { font-size:11px; font-weight:900; color:#27AE60; text-transform:uppercase; letter-spacing:1px; margin-bottom:9px; }
  .optim-item { display:table; width:100%; margin-bottom:7px; }
  .optim-bullet { display:table-cell; width:14px; color:#27AE60; font-size:14px; font-weight:900; }
  .optim-text { display:table-cell; font-size:10px; color:#1B5E2E; line-height:1.45; }

  /* PAGE 6 */
  .p6 { background:#1B2E4B; color:#fff; }
  .p6-header { display:table; width:100%; padding:26px 52px 18px 52px; border-bottom:1px solid rgba(255,255,255,0.1); }
  .p6-logo { display:table-cell; vertical-align:middle; }
  .p6-logo-text { font-size:26px; font-weight:900; color:#fff; letter-spacing:5px; }
  .p6-logo-sub { font-size:8px; color:#4A90D9; text-transform:uppercase; letter-spacing:2px; margin-top:3px; }
  .p6-section-name { display:table-cell; vertical-align:middle; text-align:right; }
  .p6-section-label { font-size:14px; color:#4A90D9; text-transform:uppercase; letter-spacing:2px; font-weight:700; }
  .p6-section-sub { font-size:10px; color:#7a9cc4; }
  .p6-body { display:table; width:100%; padding:22px 52px; }
  .p6-left { display:table-cell; vertical-align:top; width:52%; padding-right:30px; }
  .p6-right { display:table-cell; vertical-align:top; width:48%; }
  .p6-block-title { font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#4A90D9; margin-bottom:14px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.1); }
  .p6-key-item { display:table; width:100%; margin-bottom:11px; padding:12px; background:rgba(255,255,255,0.06); border-radius:5px; }
  .p6-key-num { display:table-cell; vertical-align:top; width:28px; font-size:18px; font-weight:900; color:#4A90D9; line-height:1; }
  .p6-key-content { display:table-cell; vertical-align:top; }
  .p6-key-title { font-size:11px; font-weight:700; color:#fff; margin-bottom:3px; }
  .p6-key-text { font-size:10px; color:#7a9cc4; line-height:1.45; }
  .p6-q-item { display:table; width:100%; margin-bottom:10px; padding:10px 12px; background:rgba(255,255,255,0.05); border-left:3px solid #4A90D9; border-radius:0 5px 5px 0; }
  .p6-q-num { display:table-cell; vertical-align:top; width:24px; font-size:11px; font-weight:900; color:#4A90D9; }
  .p6-q-text { display:table-cell; font-size:10px; color:#c0cfe0; line-height:1.45; }
  .p6-links { margin-top:12px; padding:12px; background:rgba(255,255,255,0.05); border-radius:5px; }
  .p6-links-title { font-size:9px; font-weight:700; color:#4A90D9; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
  .p6-link-row { font-size:10px; color:#7a9cc4; margin-bottom:5px; }
  .p6-link-row strong { color:#fff; }
  .p6-footer { position:absolute; bottom:0; left:0; right:0; padding:12px 52px; background:rgba(0,0,0,0.25); border-top:1px solid rgba(255,255,255,0.08); }
  .p6-footer-inner { display:table; width:100%; }
  .p6-footer-left { display:table-cell; vertical-align:middle; }
  .p6-footer-right { display:table-cell; vertical-align:middle; text-align:right; width:140px; }
  .p6-footer-text { font-size:7.5px; color:rgba(255,255,255,0.35); line-height:1.6; }
  .p6-watermark { font-size:22px; font-weight:900; color:rgba(255,255,255,0.07); letter-spacing:7px; }

  @media print { body{margin:0;} .page{page-break-after:always;} .page:last-child{page-break-after:auto;} }
</style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page p1">
  <div class="p1-header">
    <div class="p1-logo">
      <div class="p1-logo-text">CLARIO</div>
      <div class="p1-logo-sub">Analyse p&eacute;dagogique ind&eacute;pendante</div>
    </div>
    <div class="p1-date">Rapport g&eacute;n&eacute;r&eacute; le ${date}<br>R&eacute;serv&eacute; &agrave; usage informatif</div>
  </div>
  <div class="p1-hero">
    <div class="p1-hero-left">
      <div class="p1-report-label">Rapport d&apos;analyse p&eacute;dagogique</div>
      <div class="p1-product-name">${product.name}</div>
      <div class="p1-product-sub">${product.type}<br>${product.emetteur} &bull; ${product.enveloppe}</div>
      <div class="p1-score-label">Score global</div>
      <div><span class="p1-score-big">${scores.global}</span><span class="p1-score-denom">&nbsp;/100</span></div>
      <div class="p1-score-qual">${scores.global >= 75 ? 'Bonne qualit&eacute; globale' : scores.global >= 60 ? 'Dans la moyenne &mdash; points de vigilance' : 'Vigilance recommand&eacute;e &mdash; frais &eacute;lev&eacute;s'}</div>
      <div style="margin-top:36px;">
        <svg width="260" height="12" viewBox="0 0 260 12">
          <rect x="0" y="0" width="260" height="12" rx="6" fill="rgba(255,255,255,0.1)"/>
          <rect x="0" y="0" width="${Math.round(260 * scores.global / 100)}" height="12" rx="6" fill="#4A90D9"/>
        </svg>
        <div style="font-size:9px;color:#7a9cc4;margin-top:6px;">Indice de qualit&eacute; globale</div>
      </div>
    </div>
    <div class="p1-hero-right">
      <div class="p1-fiche">
        <div class="p1-fiche-title">Fiche produit</div>
        <div class="p1-fiche-row"><span class="p1-fiche-key">Type</span><span class="p1-fiche-val">${product.type}</span></div>
        <div class="p1-fiche-row"><span class="p1-fiche-key">&Eacute;metteur</span><span class="p1-fiche-val">${product.emetteur}</span></div>
        <div class="p1-fiche-row"><span class="p1-fiche-key">Enveloppe</span><span class="p1-fiche-val">${product.enveloppe}</span></div>
        <div class="p1-fiche-row"><span class="p1-fiche-key">Horizon</span><span class="p1-fiche-val">${product.horizon}</span></div>
        <div class="p1-fiche-row"><span class="p1-fiche-key">SRI</span><span class="p1-fiche-val">${product.sri} / 7</span></div>
        <div class="p1-fiche-row"><span class="p1-fiche-key">Frais d&apos;entr&eacute;e</span><span class="p1-fiche-val">${product.fraisEntree} %</span></div>
        <div class="p1-fiche-row"><span class="p1-fiche-key">Frais de gestion</span><span class="p1-fiche-val">${product.fraisGestion} % / an</span></div>
        <div class="p1-fiche-row"><span class="p1-fiche-key">Date d&apos;analyse</span><span class="p1-fiche-val">${date}</span></div>
      </div>
      <div class="p1-bar-row">
        <div class="p1-bar-label"><span class="p1-bar-ltext">Frais</span><span class="p1-bar-lval">${scores.frais} / 35</span></div>
        <div class="p1-bar-track"><div class="p1-bar-fill" style="width:${Math.round(scores.frais/35*100)}%;background:${scoreColor(scores.frais,35)};"></div></div>
      </div>
      <div class="p1-bar-row">
        <div class="p1-bar-label"><span class="p1-bar-ltext">Fiscalit&eacute;</span><span class="p1-bar-lval">${scores.fiscalite} / 25</span></div>
        <div class="p1-bar-track"><div class="p1-bar-fill" style="width:${Math.round(scores.fiscalite/25*100)}%;background:${scoreColor(scores.fiscalite,25)};"></div></div>
      </div>
      <div class="p1-bar-row">
        <div class="p1-bar-label"><span class="p1-bar-ltext">Risque &amp; Liquidit&eacute;</span><span class="p1-bar-lval">${scores.risque} / 40</span></div>
        <div class="p1-bar-track"><div class="p1-bar-fill" style="width:${Math.round(scores.risque/40*100)}%;background:${scoreColor(scores.risque,40)};"></div></div>
      </div>
    </div>
  </div>
  <div class="p1-footer">Ce rapport est produit &agrave; titre exclusivement informatif et p&eacute;dagogique par Clario. Il ne constitue pas un conseil en investissement au sens de la directive MIF II. Clario n&apos;est pas agr&eacute;&eacute; CGP et n&apos;est pas li&eacute; &agrave; ${product.emetteur}. Investir comporte des risques de perte en capital.</div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="page-header">
    <div class="ph-left"><div class="ph-logo">CLARIO</div><div class="ph-subtitle">Rapport d&apos;analyse p&eacute;dagogique</div></div>
    <div class="ph-right"><div class="ph-page">Page <strong>2</strong> / 6 &mdash; Synth&egrave;se</div><div class="ph-page">${product.name} &bull; ${date}</div></div>
  </div>
  <div class="page-body">
    <div class="section-title">Synth&egrave;se &mdash; Version gratuite</div>
    <div class="section-sub">Vue d&apos;ensemble du produit &bull; Score calcul&eacute; selon la grille Clario</div>
    <div class="no-verdict">&#9888; Cette page pr&eacute;sente uniquement les informations p&eacute;dagogiques. Aucun verdict d&apos;investissement n&apos;est &eacute;mis par Clario.</div>
    <div class="p2-cols">
      <div class="p2-left">
        <div class="ring-label">Score global Clario</div>
        <div class="ring-wrapper">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="66" fill="none" stroke="#F0F3F7" stroke-width="16"/>
            <circle cx="80" cy="80" r="66" fill="none" stroke="#4A90D9" stroke-width="16"
              stroke-dasharray="${Math.round(414.7 * scores.global / 100)} 414.7"
              stroke-dashoffset="103.7" stroke-linecap="round" transform="rotate(-90 80 80)"/>
            <text x="80" y="74" text-anchor="middle" font-family="Arial" font-size="42" font-weight="900" fill="#1B2E4B">${scores.global}</text>
            <text x="80" y="94" text-anchor="middle" font-family="Arial" font-size="14" fill="#7a9cc4">/100</text>
          </svg>
        </div>
        <div class="score-bars">
          <div class="sbar-row">
            <div class="sbar-head"><span class="sbar-name">Frais</span><span class="sbar-score" style="color:${scoreColor(scores.frais,35)};">${scores.frais} / 35</span></div>
            <div class="sbar-track"><div class="sbar-fill" style="width:${Math.round(scores.frais/35*100)}%;background:${scoreColor(scores.frais,35)};"></div></div>
          </div>
          <div class="sbar-row">
            <div class="sbar-head"><span class="sbar-name">Fiscalit&eacute;</span><span class="sbar-score" style="color:${scoreColor(scores.fiscalite,25)};">${scores.fiscalite} / 25</span></div>
            <div class="sbar-track"><div class="sbar-fill" style="width:${Math.round(scores.fiscalite/25*100)}%;background:${scoreColor(scores.fiscalite,25)};"></div></div>
          </div>
          <div class="sbar-row">
            <div class="sbar-head"><span class="sbar-name">Risque &amp; Liquidit&eacute;</span><span class="sbar-score" style="color:${scoreColor(scores.risque,40)};">${scores.risque} / 40</span></div>
            <div class="sbar-track"><div class="sbar-fill" style="width:${Math.round(scores.risque/40*100)}%;background:${scoreColor(scores.risque,40)};"></div></div>
          </div>
        </div>
        <div class="interp-box">${interpretation}</div>
      </div>
      <div class="p2-right">
        <div class="point-block-title" style="color:#27AE60;">&#10003; Points forts</div>
        ${pointsForts.map(p => `
        <div class="point-item point-fort">
          <div class="point-icon">&#10004;</div>
          <div class="point-text"><strong>${p.titre}</strong>${p.texte}</div>
        </div>`).join('')}
        <div class="point-block-title" style="color:#F5A623;margin-top:12px;">&#9888; Points de vigilance</div>
        ${vigilances.map(v => `
        <div class="point-item point-vig">
          <div class="point-icon">&#9888;</div>
          <div class="point-text"><strong>${v.titre}</strong>${v.texte}</div>
        </div>`).join('')}
        <div class="stripe-band">
          <div class="stripe-left">
            <div class="stripe-title">&#128274; D&eacute;bloquez l&apos;analyse compl&egrave;te</div>
            <div class="stripe-sub">Frais d&eacute;taill&eacute;s &bull; Risque &bull; Fiscalit&eacute; &bull; Conclusion<br>5 questions &agrave; poser &agrave; votre distributeur</div>
          </div>
          <div class="stripe-right"><a class="stripe-btn" href="https://buy.stripe.com/00w00k0Ex7Z2f2182c67S01">11 &euro; &rarr;</a></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 3 -->
<div class="page">
  <div class="page-header">
    <div class="ph-left"><div class="ph-logo">CLARIO</div><div class="ph-subtitle">Rapport d&apos;analyse p&eacute;dagogique</div></div>
    <div class="ph-right"><div class="ph-page">Page <strong>3</strong> / 6 &mdash; Analyse des frais</div><div class="ph-page">${product.name} &bull; ${date}</div></div>
  </div>
  <div class="page-body">
    <div class="section-title">Analyse des frais</div>
    <div class="section-sub">Comparaison march&eacute; &bull; Impact sur le rendement &bull; Score : ${scores.frais}/35</div>
    <div class="p3-cols">
      <div class="p3-left">
        <table class="comp">
          <thead><tr><th>Type de frais</th><th>${product.name}</th><th>Moy. march&eacute;</th><th>&Eacute;valuation</th></tr></thead>
          <tbody>
            ${analyseFrags.tableauComparatif.map(row => `
            <tr><td>${row.type}</td><td><strong>${row.produit}</strong></td><td>${row.marche}</td><td class="${evalClass(row.evaluation)}">${row.evaluation}</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="impact-box">
          <div class="impact-title">&#128202; Impact sur le rendement (hypoth&egrave;se brut : ${analyseFrags.impactRendement.brut} %/an)</div>
          <div class="impact-row"><span class="impact-key">Rendement brut cible</span><span class="impact-val impact-pos">+ ${analyseFrags.impactRendement.brut} %</span></div>
          <hr class="impact-sep"/>
          <div class="impact-row"><span class="impact-key">Frais de gestion fonds</span><span class="impact-val impact-neg">&minus; ${analyseFrags.impactRendement.fraisGestion} %</span></div>
          <div class="impact-row"><span class="impact-key">Frais enveloppe (estim&eacute;)</span><span class="impact-val impact-neg">&minus; ${analyseFrags.impactRendement.fraisAV} %</span></div>
          <div class="impact-row"><span class="impact-key">Frais d&apos;entr&eacute;e amortis</span><span class="impact-val impact-neg">&minus; ${analyseFrags.impactRendement.fraisEntreeAmorti} %</span></div>
          <hr class="impact-sep"/>
          <div class="impact-row"><span class="impact-key"><strong>Rendement net estim&eacute;</strong></span><span class="impact-val impact-neg"><strong>&asymp; + ${analyseFrags.impactRendement.net} %</strong></span></div>
          <div style="font-size:8px;color:#999;margin-top:6px;">* Hors fiscalit&eacute;. Hypoth&egrave;ses illustratives.</div>
        </div>
      </div>
      <div class="p3-right">
        <div class="amort-title">Amortissement frais d&apos;entr&eacute;e (${product.fraisEntree} %)</div>
        ${analyseFrags.amortissement.map(a => `
        <div class="amort-bar-row">
          <div class="amort-bar-head"><span class="amort-bar-label">${a.horizon}</span><span class="amort-bar-val" style="color:${amortColor(a.pct)};">${a.annuel}</span></div>
          <div class="amort-track"><div class="amort-fill" style="width:${a.pct}%;background:${amortColor(a.pct)};"></div></div>
        </div>`).join('')}
        <div class="peda-box">${analyseFrags.lectureP}</div>
        <div class="score-badge">
          <div class="score-badge-inner">
            <div class="score-badge-label">Score frais</div>
            <div><span class="score-badge-val">${scores.frais}</span><span class="score-badge-denom"> / 35</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 4 -->
<div class="page">
  <div class="page-header">
    <div class="ph-left"><div class="ph-logo">CLARIO</div><div class="ph-subtitle">Rapport d&apos;analyse p&eacute;dagogique</div></div>
    <div class="ph-right"><div class="ph-page">Page <strong>4</strong> / 6 &mdash; Risque &amp; Liquidit&eacute;</div><div class="ph-page">${product.name} &bull; ${date}</div></div>
  </div>
  <div class="page-body">
    <div class="section-title">Risque &amp; Liquidit&eacute;</div>
    <div class="section-sub">Indicateur SRI &bull; 4 dimensions de risque &bull; Score : ${scores.risque}/40</div>
    <div class="sri-section">
      <div class="sri-title">Indicateur synth&eacute;tique de risque (SRI)</div>
      <div class="sri-track">
        ${[1,2,3,4,5,6,7].map(i => `<div class="sri-cell sri-${i}${i === parseInt(product.sri) ? ' sri-active' : ''}">${i}</div>`).join('')}
      </div>
      <div class="sri-labels">
        <span class="sri-lbl-l">Risque plus faible / Rendement potentiel plus faible</span>
        <span class="sri-lbl-r">Risque plus &eacute;lev&eacute; / Rendement potentiel plus &eacute;lev&eacute;</span>
      </div>
    </div>
    <div style="font-size:10px;color:#555;margin-bottom:16px;padding:11px 14px;background:#F5F5F5;border-radius:5px;line-height:1.55;">
      <strong>SRI ${product.sri}/7</strong> : le SRI est un indicateur europ&eacute;en standardis&eacute; calcul&eacute; &agrave; partir de la volatilit&eacute; historique et du risque de cr&eacute;dit. <strong>Ce n&apos;est pas un produit garanti en capital.</strong>
    </div>
    <div class="risk-blocks">
      <div class="risk-col1">
        <div class="risk-item">
          <div class="risk-item-head"><span class="risk-item-name">&#128200; Risque de march&eacute;</span><span class="risk-item-level ${niveauClass(risques.marche.niveau)}">${risques.marche.niveau}</span></div>
          <div class="risk-item-text">${risques.marche.texte}</div>
        </div>
        <div class="risk-item">
          <div class="risk-item-head"><span class="risk-item-name">&#127981; Risque de contrepartie</span><span class="risk-item-level ${niveauClass(risques.contrepartie.niveau)}">${risques.contrepartie.niveau}</span></div>
          <div class="risk-item-text">${risques.contrepartie.texte}</div>
        </div>
      </div>
      <div class="risk-col2">
        <div class="risk-item">
          <div class="risk-item-head"><span class="risk-item-name">&#128274; Risque de liquidit&eacute;</span><span class="risk-item-level ${niveauClass(risques.liquidite.niveau)}">${risques.liquidite.niveau}</span></div>
          <div class="risk-item-text">${risques.liquidite.texte}</div>
        </div>
        <div class="risk-item">
          <div class="risk-item-head"><span class="risk-item-name">&#128178; Risque d&apos;inflation</span><span class="risk-item-level ${niveauClass(risques.inflation.niveau)}">${risques.inflation.niveau}</span></div>
          <div class="risk-item-text">${risques.inflation.texte}</div>
        </div>
      </div>
    </div>
    <div class="retrait-box">
      <div class="retrait-title">&#9888; D&eacute;lai de retrait &amp; conditions de sortie</div>
      <div style="font-size:10px;color:#7A4E00;line-height:1.55;">${risques.retrait}</div>
    </div>
    <div class="score-badge">
      <div class="score-badge-inner">
        <div class="score-badge-label">Score Risque &amp; Liquidit&eacute;</div>
        <div><span class="score-badge-val">${scores.risque}</span><span class="score-badge-denom"> / 40</span></div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 5 -->
<div class="page">
  <div class="page-header">
    <div class="ph-left"><div class="ph-logo">CLARIO</div><div class="ph-subtitle">Rapport d&apos;analyse p&eacute;dagogique</div></div>
    <div class="ph-right"><div class="ph-page">Page <strong>5</strong> / 6 &mdash; Fiscalit&eacute;</div><div class="ph-page">${product.name} &bull; ${date}</div></div>
  </div>
  <div class="page-body">
    <div class="section-title">Fiscalit&eacute;</div>
    <div class="section-sub">R&eacute;gime applicable &bull; Vigilances &bull; Optimisations &bull; Score : ${scores.fiscalite}/25</div>
    <div class="p5-cols">
      <div class="p5-left">
        <div class="fiscal-regime">
          <div class="fiscal-regime-title">&#127979; R&eacute;gime fiscal : ${product.enveloppe}</div>
          <p style="font-size:10px;color:#555;line-height:1.65;">${fiscalite.regime}</p>
        </div>
        <div class="horizon-box">
          <strong>&#128279; Coh&eacute;rence horizon / fiscalit&eacute; :</strong><br/><br/>
          ${fiscalite.coherence}
        </div>
      </div>
      <div class="p5-right">
        <div class="vig-box">
          <div class="vig-box-title">&#9888; Points de vigilance fiscaux</div>
          ${fiscalite.vigilances.map(v => `
          <div class="vig-item"><span class="vig-bullet">&#9656;</span><span class="vig-text">${v}</span></div>`).join('')}
        </div>
        <div class="optim-box">
          <div class="optim-box-title">&#9889; Optimisations possibles</div>
          ${fiscalite.optimisations.map(o => `
          <div class="optim-item"><span class="optim-bullet">+</span><span class="optim-text">${o}</span></div>`).join('')}
        </div>
        <div class="score-badge" style="margin-top:18px;">
          <div class="score-badge-inner">
            <div class="score-badge-label">Score Fiscalit&eacute;</div>
            <div><span class="score-badge-val">${scores.fiscalite}</span><span class="score-badge-denom"> / 25</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 6 -->
<div class="page p6">
  <div class="p6-header">
    <div class="p6-logo"><div class="p6-logo-text">CLARIO</div><div class="p6-logo-sub">Analyse p&eacute;dagogique ind&eacute;pendante</div></div>
    <div class="p6-section-name"><div class="p6-section-label">Conclusion</div><div class="p6-section-sub">Page 6 / 6 &mdash; ${product.name}</div></div>
  </div>
  <div class="p6-body">
    <div class="p6-left">
      <div class="p6-block-title">5 points cl&eacute;s &agrave; retenir</div>
      ${conclusion.pointsCles.map((p, i) => `
      <div class="p6-key-item">
        <div class="p6-key-num">${i+1}</div>
        <div class="p6-key-content"><div class="p6-key-title">${p.titre}</div><div class="p6-key-text">${p.texte}</div></div>
      </div>`).join('')}
    </div>
    <div class="p6-right">
      <div class="p6-block-title">5 questions &agrave; poser &agrave; votre distributeur</div>
      ${conclusion.questions.map((q, i) => `
      <div class="p6-q-item"><div class="p6-q-num">Q${i+1}</div><div class="p6-q-text">${q}</div></div>`).join('')}
      <div class="p6-links">
        <div class="p6-links-title">Ressources officielles</div>
        ${conclusion.ressources.map(r => `
        <div class="p6-link-row"><strong>${r.nom}</strong> &mdash; ${r.url}${r.desc ? ' &bull; ' + r.desc : ''}</div>`).join('')}
      </div>
    </div>
  </div>
  <div class="p6-footer">
    <div class="p6-footer-inner">
      <div class="p6-footer-left"><div class="p6-footer-text">Ce rapport a &eacute;t&eacute; g&eacute;n&eacute;r&eacute; par CLARIO, outil d&apos;analyse p&eacute;dagogique ind&eacute;pendant. Il ne constitue pas un conseil en investissement au sens de la directive MIF II. CLARIO n&apos;est pas agr&eacute;&eacute; CGP. Toute d&eacute;cision d&apos;investissement rel&egrave;ve de votre responsabilit&eacute;. &copy; Clario 2026.</div></div>
      <div class="p6-footer-right"><div class="p6-watermark">CLARIO</div></div>
    </div>
  </div>
</div>

</body>
</html>`;
};

module.exports = { generateHTML };
