import { Icon } from "../shared.jsx";

export const Dashboard = ({ trackers, databases, user, onSelectTracker, onSelectDatabase, onNewTracker, onNewDatabase }) => {
  const totalItems = trackers.reduce((a, t) => a + (t.items?.length || 0), 0);
  const doneItems = trackers.reduce((a, t) => a + (t.items?.filter(i => i.status === "done").length || 0), 0);
  const totalRecords = databases.reduce((a, d) => a + (d.records?.length || 0), 0);

  return (
    <div className="content" style={{ animation: "fadeUp 0.3s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          Hello, {user.name.split(" ")[0]} 👋
        </div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>Here's what you're working on today.</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Trackers</div>
          <div className="stat-value" style={{ color: "var(--accent)" }}>{trackers.length}</div>
          <div className="stat-sub">{doneItems}/{totalItems} items done</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Databases</div>
          <div className="stat-value" style={{ color: "var(--accent3)" }}>{databases.length}</div>
          <div className="stat-sub">{totalRecords} total records</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{doneItems}</div>
          <div className="stat-sub">across all trackers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Records Stored</div>
          <div className="stat-value" style={{ color: "var(--warn)" }}>{totalRecords}</div>
          <div className="stat-sub">across all databases</div>
        </div>
      </div>

      {/* Trackers section */}
      <div className="section-header">
        <div className="section-title">📋 Trackers</div>
        <button className="btn btn-secondary btn-sm" onClick={onNewTracker}>
          <Icon name="plus" size={14}/> New Tracker
        </button>
      </div>
      {trackers.length === 0 ? (
        <div className="empty-state" style={{ padding: "40px 20px" }}>
          <div className="empty-icon" style={{ fontSize: 36 }}>📋</div>
          <div className="empty-title" style={{ fontSize: 15 }}>No trackers yet</div>
          <div className="empty-desc" style={{ fontSize: 13 }}>Trackers are for tasks with statuses — to-dos, goals, checklists.</div>
        </div>
      ) : (
        <div className="card-grid">
          {trackers.map(t => {
            const items = t.items || [];
            const done = items.filter(i => i.status === "done").length;
            const pct = items.length ? Math.round(done / items.length * 100) : 0;
            return (
              <div key={t.id} className="card" onClick={() => onSelectTracker(t.id)}>
                <div className="card-accent" style={{ background: t.color }}/>
                <div className="card-emoji">{t.emoji}</div>
                <div className="card-name">{t.name}</div>
                {t.description && <div className="card-desc">{t.description}</div>}
                <div className="card-meta">
                  <span><strong>{done}</strong>/{items.length} done</span>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: t.color }}/></div>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Databases section */}
      <div className="section-header">
        <div className="section-title">📊 Databases</div>
        <button className="btn btn-secondary btn-sm" onClick={onNewDatabase}>
          <Icon name="plus" size={14}/> New Database
        </button>
      </div>
      {databases.length === 0 ? (
        <div className="empty-state" style={{ padding: "40px 20px" }}>
          <div className="empty-icon" style={{ fontSize: 36 }}>📊</div>
          <div className="empty-title" style={{ fontSize: 15 }}>No databases yet</div>
          <div className="empty-desc" style={{ fontSize: 13 }}>Databases store records with custom fields — students, contacts, inventory, anything.</div>
        </div>
      ) : (
        <div className="card-grid">
          {databases.map(d => (
            <div key={d.id} className="card" onClick={() => onSelectDatabase(d.id)}>
              <div className="card-accent" style={{ background: d.color }}/>
              <div className="card-emoji">{d.emoji}</div>
              <div className="card-name">{d.name}</div>
              {d.description && <div className="card-desc">{d.description}</div>}
              <div className="card-meta">
                <span><strong>{d.records?.length || 0}</strong> records</span>
                <span style={{ marginLeft: "auto" }}>{d.fields?.length || 0} fields</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
