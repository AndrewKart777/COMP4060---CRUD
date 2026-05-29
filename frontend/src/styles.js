export const CSS = `
  /* Cinzel = Roman inscription style for the logo. Fraunces = modern editorial serif. Inter = body */
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Site palette */
    --bg: #FFFFE3;          /* cream — main background */
    --surface: #FFFFFF;     /* white — cards on cream */
    --surface2: #F5F5DC;    /* warmer cream tint for inputs */
    --border: #CBCBCB;      /* light grey borders */
    --text: #4A4A4A;        /* dark grey body text */
    --muted: #6D8196;       /* slate blue for muted/secondary text */
    --accent: #6D8196;      /* slate blue primary accent */
    --accent-dark: #5A6D81;
    
    /* Name palette — for badges, highlights, charts */
    --name-1: #F2EF81;      /* yellow */
    --name-2: #004E89;      /* navy */
    --name-3: #CDE6F5;      /* pale blue */
    --name-4: #71816D;      /* sage */
    --name-5: #13070C;      /* near black */

    /* Status colours — keep semantic but tonally consistent */
    --success: #71816D;     /* sage = done */
    --warn: #B89B47;        /* mustard/olive */
    --danger: #A05A5A;      /* dusty red */

    /* Fonts */
    --font-display: 'Cinzel', serif;
    --font-editorial: 'Fraunces', serif;
    --font-body: 'Inter', system-ui, sans-serif;

    --radius: 8px;
    --radius-sm: 6px;
    --shadow: 0 2px 12px rgba(74,74,74,0.08);
    --shadow-lg: 0 8px 24px rgba(74,74,74,0.12);
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--muted); }

  /* ── ACTA Logo styling ───────────────────────────────────────────────────── */
  .acta-logo {
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: 4px;
    line-height: 1;
  }

  /* ── Auth Screen ─────────────────────────────────────────────────────────── */
  .auth-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); position: relative; overflow: hidden; }
  .auth-screen::before { content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(205,230,245,0.4) 0%, transparent 70%); top: -150px; right: -150px; pointer-events: none; }
  .auth-screen::after { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(242,239,129,0.25) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; }
  .auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 48px 40px; width: 100%; max-width: 440px; position: relative; z-index: 1; box-shadow: var(--shadow-lg); animation: fadeUp 0.4s ease; }
  .auth-card .acta-logo { font-size: 36px; display: block; text-align: center; margin-bottom: 12px; }
  .auth-subtitle { color: var(--muted); font-size: 13px; text-align: center; margin-bottom: 32px; font-family: var(--font-editorial); font-style: italic; letter-spacing: 0.5px; }
  .auth-tabs { display: flex; gap: 4px; margin-bottom: 28px; background: var(--surface2); border-radius: var(--radius-sm); padding: 4px; border: 1px solid var(--border); }
  .auth-tab { flex: 1; padding: 9px; border: none; background: none; color: var(--muted); font-family: var(--font-body); font-size: 13px; font-weight: 500; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
  .auth-tab.active { background: var(--name-2); color: #fff; }

  /* ── Forms ───────────────────────────────────────────────────────────────── */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
  .form-input { width: 100%; padding: 11px 13px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-family: var(--font-body); font-size: 14px; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
  .form-input:focus { border-color: var(--name-2); box-shadow: 0 0 0 3px rgba(0,78,137,0.1); }
  .form-input::placeholder { color: #B0B0B0; }

  /* ── Buttons ─────────────────────────────────────────────────────────────── */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border: none; border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; white-space: nowrap; letter-spacing: 0.2px; }
  .btn-primary { background: var(--name-2); color: #fff; }
  .btn-primary:hover { background: #003a68; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--name-2); color: var(--name-2); }
  .btn-danger { background: rgba(160,90,90,0.1); color: var(--danger); border: 1px solid rgba(160,90,90,0.25); }
  .btn-danger:hover { background: rgba(160,90,90,0.2); }
  .btn-ghost { background: none; color: var(--muted); border: none; }
  .btn-ghost:hover { color: var(--text); background: var(--surface2); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .btn-full { width: 100%; }
  .btn-icon { width: 30px; height: 30px; padding: 0; }
  .error-msg { color: var(--danger); font-size: 12px; margin-top: 12px; text-align: center; }

  /* ── Layout ──────────────────────────────────────────────────────────────── */
  .layout { display: flex; min-height: 100vh; }
  .sidebar { width: 240px; min-height: 100vh; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 24px 0 16px; flex-shrink: 0; }
  .sidebar .acta-logo { font-size: 22px; padding: 0 20px 20px; border-bottom: 1px solid var(--border); margin-bottom: 12px; display: block; }
  .sidebar-section { padding: 16px 20px 6px; font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--muted); font-weight: 700; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 20px; cursor: pointer; font-size: 13.5px; color: var(--text); transition: all 0.15s; border-left: 2px solid transparent; }
  .sidebar-item:hover { background: var(--surface2); }
  .sidebar-item.active { color: var(--name-2); background: rgba(205,230,245,0.4); border-left-color: var(--name-2); font-weight: 500; }
  .sidebar-item .count { margin-left: auto; background: var(--surface2); padding: 1px 8px; border-radius: 10px; font-size: 11px; color: var(--muted); border: 1px solid var(--border); }
  .sidebar-item-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sidebar-add { padding: 8px 16px 0; }
  .sidebar-footer { margin-top: auto; padding: 16px; border-top: 1px solid var(--border); }
  .user-chip { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
  .user-chip .user-info { flex: 1; min-width: 0; }
  .user-chip .name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-chip .email { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── Main / Topbar ───────────────────────────────────────────────────────── */
  .main { flex: 1; overflow-y: auto; background: var(--bg); }
  .topbar { position: sticky; top: 0; z-index: 10; background: rgba(255,255,227,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; }
  .topbar-title { font-family: var(--font-editorial); font-size: 17px; font-weight: 600; letter-spacing: 0.2px; }
  .topbar-actions { display: flex; gap: 8px; align-items: center; }
  .content { padding: 32px 28px; }

  /* ── Stats ───────────────────────────────────────────────────────────────── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 32px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: all 0.2s; }
  .stat-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
  .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px; font-weight: 600; }
  .stat-value { font-family: var(--font-display); font-size: 30px; font-weight: 700; line-height: 1; }
  .stat-sub { font-size: 11px; color: var(--muted); margin-top: 6px; font-family: var(--font-editorial); font-style: italic; }

  /* ── Section ─────────────────────────────────────────────────────────────── */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; margin-top: 36px; }
  .section-title { font-family: var(--font-editorial); font-size: 18px; font-weight: 600; letter-spacing: 0.2px; }
  .section-title:first-child { margin-top: 0; }

  /* ── Cards ───────────────────────────────────────────────────────────────── */
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); border-color: var(--muted); }
  .card-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .card-emoji { font-size: 22px; margin-bottom: 10px; }
  .card-name { font-family: var(--font-editorial); font-size: 16px; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.1px; }
  .card-desc { font-size: 12px; color: var(--muted); }
  .card-meta { display: flex; align-items: center; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted); }
  .card-meta strong { color: var(--text); }
  .progress-bar { height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; flex: 1; border: 1px solid var(--border); }
  .progress-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }

  /* ── Detail header ───────────────────────────────────────────────────────── */
  .detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
  .detail-name { font-family: var(--font-editorial); font-size: 28px; font-weight: 700; letter-spacing: 0.1px; }
  .detail-desc { color: var(--muted); font-size: 14px; margin-top: 4px; font-family: var(--font-editorial); font-style: italic; }

  /* ── Items ───────────────────────────────────────────────────────────────── */
  .items-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-tabs { display: flex; gap: 4px; }
  .filter-tab { padding: 5px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--muted); font-family: var(--font-body); transition: all 0.15s; }
  .filter-tab:hover { border-color: var(--muted); }
  .filter-tab.active { background: var(--name-2); color: #fff; border-color: var(--name-2); }
  .items-list { display: flex; flex-direction: column; gap: 8px; }
  .item-row { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; display: flex; align-items: center; gap: 12px; transition: all 0.15s; animation: fadeUp 0.2s ease; }
  .item-row:hover { border-color: var(--muted); box-shadow: var(--shadow); }
  .item-check { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; background: var(--surface); }
  .item-check.done { background: var(--success); border-color: var(--success); color: #fff; }
  .item-name { flex: 1; font-size: 14px; }
  .item-name.done { text-decoration: line-through; color: var(--muted); }
  .item-status { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .item-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
  .item-row:hover .item-actions { opacity: 1; }
  .status-todo { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .status-in-progress { background: rgba(205,230,245,0.6); color: var(--name-2); border: 1px solid rgba(0,78,137,0.2); }
  .status-done { background: rgba(113,129,109,0.15); color: var(--success); border: 1px solid rgba(113,129,109,0.3); }

  /* ── Database table ──────────────────────────────────────────────────────── */
  .db-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: auto; box-shadow: var(--shadow); }
  .db-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .db-table thead { background: var(--surface2); }
  .db-table th { text-align: left; padding: 12px 14px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); font-weight: 700; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .db-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); }
  .db-table tr:last-child td { border-bottom: none; }
  .db-table tr:hover td { background: rgba(205,230,245,0.25); }
  .db-table-actions { display: flex; gap: 4px; justify-content: flex-end; }
  .field-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; font-size: 12px; }
  .field-type { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Modals ──────────────────────────────────────────────────────────────── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(19,7,12,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; animation: fadeIn 0.15s ease; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; width: 100%; max-width: 520px; box-shadow: var(--shadow-lg); animation: fadeUp 0.2s ease; max-height: 90vh; overflow-y: auto; }
  .modal.modal-wide { max-width: 640px; }
  .modal-title { font-family: var(--font-editorial); font-size: 20px; font-weight: 700; margin-bottom: 20px; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }

  .emoji-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 6px; margin-top: 6px; }
  .emoji-opt { font-size: 20px; text-align: center; padding: 6px; border-radius: 6px; cursor: pointer; background: var(--surface2); border: 2px solid transparent; transition: all 0.15s; }
  .emoji-opt:hover { background: var(--border); }
  .emoji-opt.selected { border-color: var(--name-2); background: rgba(205,230,245,0.4); }

  .color-grid { display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
  .color-opt { width: 28px; height: 28px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: all 0.15s; }
  .color-opt.selected { border-color: var(--text); transform: scale(1.1); }

  .select-input { width: 100%; padding: 11px 13px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-family: var(--font-body); font-size: 14px; outline: none; appearance: none; cursor: pointer; }
  .select-input:focus { border-color: var(--name-2); box-shadow: 0 0 0 3px rgba(0,78,137,0.1); }

  .field-row { display: flex; gap: 8px; align-items: flex-start; padding: 10px; background: var(--surface2); border-radius: var(--radius-sm); margin-bottom: 8px; border: 1px solid var(--border); flex-wrap: wrap; }
  .field-row .form-input, .field-row .select-input { padding: 8px 10px; font-size: 13px; }

  .checkbox { width: 18px; height: 18px; border: 2px solid var(--border); border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; background: var(--surface); }
  .checkbox.checked { background: var(--name-2); border-color: var(--name-2); color: #fff; }

  .empty-state { text-align: center; padding: 60px 20px; }
  .empty-icon { font-size: 44px; margin-bottom: 16px; opacity: 0.7; }
  .empty-title { font-family: var(--font-editorial); font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .empty-desc { color: var(--muted); font-size: 14px; margin-bottom: 24px; font-family: var(--font-editorial); font-style: italic; }

  .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
  .btn-secondary .spinner, .btn-ghost .spinner { border-color: rgba(74,74,74,0.2); border-top-color: var(--text); }
  .loading-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); flex-direction: column; gap: 16px; color: var(--muted); font-size: 14px; font-family: var(--font-editorial); font-style: italic; }
  .loading-screen .spinner { border-color: rgba(109,129,150,0.2); border-top-color: var(--muted); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 700px) { .sidebar { display: none; } .card-grid { grid-template-columns: 1fr; } .content { padding: 16px; } }
`;
