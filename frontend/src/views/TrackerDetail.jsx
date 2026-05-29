import { useState } from "react";
import * as api from "../api.js";
import { Icon, STATUS_OPTIONS, STATUS_LABELS } from "../shared.jsx";

const ItemModal = ({ item, trackerId, onSave, onClose }) => {
  const [form, setForm] = useState(item || { name: "", status: "todo" });
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const result = item
        ? await api.updateItem(trackerId, item.id, { name: form.name, status: form.status })
        : await api.createItem(trackerId, form);
      onSave(result);
    } finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{item ? "Edit Item" : "Add Item"}</div>
        <div className="form-group">
          <label className="form-label">Item Name</label>
          <input className="form-input" placeholder="e.g. Buy milk" value={form.name}
                 onChange={e => u("name", e.target.value)} autoFocus
                 onKeyDown={e => e.key === "Enter" && save()}/>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="select-input" value={form.status} onChange={e => u("status", e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={!form.name.trim() || loading}>
            {loading ? <span className="spinner"/> : item ? "Save" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const TrackerDetail = ({ tracker, onUpdate, onBack }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const items = tracker.items || [];
  const filtered = items.filter(i => {
    const mf = filter === "all" || i.status === filter;
    const ms = i.name.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });
  const done = items.filter(i => i.status === "done").length;
  const pct = items.length ? Math.round(done / items.length * 100) : 0;
  const counts = STATUS_OPTIONS.reduce((a, s) => ({ ...a, [s]: items.filter(i => i.status === s).length }), {});

  const toggleDone = async (item) => {
    const updated = await api.updateItem(tracker.id, item.id, { status: item.status === "done" ? "todo" : "done" });
    onUpdate({ ...tracker, items: items.map(i => i.id === updated.id ? updated : i) });
  };
  const saveItem = (saved) => {
    const exists = items.find(i => i.id === saved.id);
    const newItems = exists ? items.map(i => i.id === saved.id ? saved : i) : [...items, saved];
    onUpdate({ ...tracker, items: newItems });
    setShowItemModal(false); setEditItem(null);
  };
  const deleteItem = async (id) => {
    await api.deleteItem(tracker.id, id);
    onUpdate({ ...tracker, items: items.filter(i => i.id !== id) });
  };

  return (
    <div className="content" style={{ maxWidth: 900, animation: "fadeUp 0.3s ease" }}>
      {(showItemModal || editItem) && (
        <ItemModal item={editItem} trackerId={tracker.id} onSave={saveItem}
                   onClose={() => { setShowItemModal(false); setEditItem(null); }}/>
      )}
      <div className="detail-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon name="back" size={14}/> Back</button>
        <div style={{ fontSize: 36 }}>{tracker.emoji}</div>
        <div style={{ flex: 1 }}>
          <div className="detail-name">{tracker.name}</div>
          {tracker.description && <div className="detail-desc">{tracker.description}</div>}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: tracker.color }}>{pct}%</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{done}/{items.length} done</div>
        </div>
      </div>
      <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: tracker.color, borderRadius: 3, transition: "width 0.4s ease" }}/>
      </div>
      <div className="items-header">
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All ({items.length})</button>
          {STATUS_OPTIONS.map(s => (
            <button key={s} className={`filter-tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
              {STATUS_LABELS[s]} {counts[s] > 0 && `(${counts[s]})`}
            </button>
          ))}
        </div>
        <input className="form-input" style={{ width: 180, padding: "6px 12px", fontSize: 13 }} placeholder="Search…"
               value={search} onChange={e => setSearch(e.target.value)}/>
        <button className="btn btn-primary btn-sm" onClick={() => setShowItemModal(true)} style={{ marginLeft: "auto" }}>
          <Icon name="plus" size={14}/> Add Item
        </button>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: "40px 20px" }}>
          <div className="empty-icon" style={{ fontSize: 32 }}>🔍</div>
          <div className="empty-title" style={{ fontSize: 15 }}>{items.length === 0 ? "No items yet" : "No items match"}</div>
          <div className="empty-desc" style={{ fontSize: 13 }}>
            {items.length === 0 ? "Add your first item to get started." : "Try a different filter or search."}
          </div>
          {items.length === 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowItemModal(true)}>
              <Icon name="plus" size={13}/> Add Item
            </button>
          )}
        </div>
      ) : (
        <div className="items-list">
          {filtered.map(item => (
            <div key={item.id} className="item-row">
              <div className={`item-check ${item.status === "done" ? "done" : ""}`} onClick={() => toggleDone(item)}>
                {item.status === "done" && <Icon name="check" size={10}/>}
              </div>
              <div className={`item-name ${item.status === "done" ? "done" : ""}`}>{item.name}</div>
              <span className={`item-status status-${item.status}`}>{STATUS_LABELS[item.status]}</span>
              <div className="item-actions">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditItem(item)}><Icon name="edit" size={13}/></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteItem(item.id)}><Icon name="trash" size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
