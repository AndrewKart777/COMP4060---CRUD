import { useState, useEffect } from "react";
import * as api from "./api.js";
import { CSS } from "./styles.js";
import { Icon, ActaLogo, avatarColor, initials } from "./shared.jsx";
import { AuthScreen } from "./views/Auth.jsx";
import { Dashboard } from "./views/Dashboard.jsx";
import { TrackerDetail } from "./views/TrackerDetail.jsx";
import { DatabaseDetail } from "./views/DatabaseDetail.jsx";
import { TrackerModal } from "./views/TrackerModal.jsx";
import { DatabaseModal } from "./views/DatabaseModal.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [trackers, setTrackers] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [activeId, setActiveId] = useState(null);
  // view: "dashboard" | "tracker" | "database"
  const [view, setView] = useState("dashboard");
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [editTracker, setEditTracker] = useState(null);
  const [showDbModal, setShowDbModal] = useState(false);
  const [editDb, setEditDb] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login from stored token
  useEffect(() => {
    (async () => {
      try {
        const me = await api.getMe();
        setUser(me);
        const [ts, ds] = await Promise.all([api.getTrackers(), api.getDatabases()]);
        setTrackers(ts); setDatabases(ds);
      } catch (_) {} finally { setLoading(false); }
    })();
  }, []);

  const handleLogin = async (me) => {
    setUser(me);
    const [ts, ds] = await Promise.all([api.getTrackers(), api.getDatabases()]);
    setTrackers(ts); setDatabases(ds);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null); setTrackers([]); setDatabases([]);
    setActiveId(null); setView("dashboard");
  };

  // ── Tracker ops ──
  const saveTracker = (t) => {
    setTrackers(ts => ts.find(x => x.id === t.id) ? ts.map(x => x.id === t.id ? t : x) : [...ts, t]);
    setShowTrackerModal(false); setEditTracker(null);
  };
  const deleteTracker = async (id) => {
    await api.deleteTracker(id);
    setTrackers(ts => ts.filter(t => t.id !== id));
    if (activeId === id && view === "tracker") { setActiveId(null); setView("dashboard"); }
  };
  const updateTrackerInState = (t) => setTrackers(ts => ts.map(x => x.id === t.id ? t : x));

  // ── Database ops ──
  const saveDatabase = (d) => {
    setDatabases(ds => ds.find(x => x.id === d.id) ? ds.map(x => x.id === d.id ? d : x) : [...ds, d]);
    setShowDbModal(false); setEditDb(null);
  };
  const deleteDb = async (id) => {
    await api.deleteDatabase(id);
    setDatabases(ds => ds.filter(d => d.id !== id));
    if (activeId === id && view === "database") { setActiveId(null); setView("dashboard"); }
  };
  const updateDbInState = (d) => setDatabases(ds => ds.map(x => x.id === d.id ? d : x));

  const currentTracker = view === "tracker" ? trackers.find(t => t.id === activeId) : null;
  const currentDb = view === "database" ? databases.find(d => d.id === activeId) : null;

  if (loading) return <><style>{CSS}</style><div className="loading-screen"><span className="spinner"/><span>Loading…</span></div></>;
  if (!user) return <><style>{CSS}</style><AuthScreen onLogin={handleLogin}/></>;

  return (
    <>
      <style>{CSS}</style>
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <ActaLogo size={22}/>

          <div className={`sidebar-item ${view === "dashboard" ? "active" : ""}`}
               onClick={() => { setView("dashboard"); setActiveId(null); }}>
            <Icon name="home" size={15}/> Dashboard
          </div>

          {/* Trackers section */}
          <div className="sidebar-section">Trackers</div>
          {trackers.map(t => (
            <div key={t.id}
                 className={`sidebar-item ${view === "tracker" && activeId === t.id ? "active" : ""}`}
                 onClick={() => { setActiveId(t.id); setView("tracker"); }}>
              <span style={{ fontSize: 14 }}>{t.emoji}</span>
              <span className="sidebar-item-label">{t.name}</span>
              <span className="count">{t.items?.length || 0}</span>
            </div>
          ))}
          <div className="sidebar-add">
            <button className="btn btn-secondary btn-full btn-sm" onClick={() => setShowTrackerModal(true)}>
              <Icon name="plus" size={13}/> New Tracker
            </button>
          </div>

          {/* Databases section */}
          <div className="sidebar-section">Databases</div>
          {databases.map(d => (
            <div key={d.id}
                 className={`sidebar-item ${view === "database" && activeId === d.id ? "active" : ""}`}
                 onClick={() => { setActiveId(d.id); setView("database"); }}>
              <span style={{ fontSize: 14 }}>{d.emoji}</span>
              <span className="sidebar-item-label">{d.name}</span>
              <span className="count">{d.records?.length || 0}</span>
            </div>
          ))}
          <div className="sidebar-add">
            <button className="btn btn-secondary btn-full btn-sm" onClick={() => setShowDbModal(true)}>
              <Icon name="plus" size={13}/> New Database
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="avatar" style={{ background: avatarColor(user.name), color: "#fff" }}>
                {initials(user.name)}
              </div>
              <div className="user-info">
                <div className="name">{user.name}</div>
                <div className="email">{user.email}</div>
              </div>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={handleLogout} title="Log out">
                <Icon name="logout" size={14}/>
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">
              {view === "dashboard" && "Dashboard"}
              {view === "tracker" && currentTracker && `${currentTracker.emoji} ${currentTracker.name}`}
              {view === "database" && currentDb && `${currentDb.emoji} ${currentDb.name}`}
            </div>
            <div className="topbar-actions">
              {view === "tracker" && currentTracker && <>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditTracker(currentTracker)}>
                  <Icon name="edit" size={13}/> Edit
                </button>
                <button className="btn btn-danger btn-sm"
                        onClick={() => { if (confirm(`Delete "${currentTracker.name}"?`)) deleteTracker(currentTracker.id); }}>
                  <Icon name="trash" size={13}/> Delete
                </button>
              </>}
              {view === "database" && currentDb && <>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditDb(currentDb)}>
                  <Icon name="edit" size={13}/> Edit
                </button>
                <button className="btn btn-danger btn-sm"
                        onClick={() => { if (confirm(`Delete "${currentDb.name}"?`)) deleteDb(currentDb.id); }}>
                  <Icon name="trash" size={13}/> Delete
                </button>
              </>}
              {view === "dashboard" && <>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowTrackerModal(true)}>
                  <Icon name="plus" size={13}/> Tracker
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setShowDbModal(true)}>
                  <Icon name="plus" size={13}/> Database
                </button>
              </>}
            </div>
          </div>

          {view === "dashboard" && (
            <Dashboard
              trackers={trackers}
              databases={databases}
              user={user}
              onSelectTracker={(id) => { setActiveId(id); setView("tracker"); }}
              onSelectDatabase={(id) => { setActiveId(id); setView("database"); }}
              onNewTracker={() => setShowTrackerModal(true)}
              onNewDatabase={() => setShowDbModal(true)}
            />
          )}
          {view === "tracker" && currentTracker && (
            <TrackerDetail
              tracker={currentTracker}
              onUpdate={updateTrackerInState}
              onBack={() => { setView("dashboard"); setActiveId(null); }}
            />
          )}
          {view === "database" && currentDb && (
            <DatabaseDetail
              database={currentDb}
              onUpdate={updateDbInState}
              onBack={() => { setView("dashboard"); setActiveId(null); }}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {(showTrackerModal || editTracker) && (
        <TrackerModal
          tracker={editTracker}
          onSave={saveTracker}
          onClose={() => { setShowTrackerModal(false); setEditTracker(null); }}
        />
      )}
      {(showDbModal || editDb) && (
        <DatabaseModal
          database={editDb}
          onSave={saveDatabase}
          onClose={() => { setShowDbModal(false); setEditDb(null); }}
        />
      )}
    </>
  );
}
