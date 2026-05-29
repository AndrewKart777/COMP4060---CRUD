import { useState } from "react";
import * as api from "../api.js";
import { EMOJIS, COLORS } from "../shared.jsx";

export const TrackerModal = ({ tracker, onSave, onClose }) => {
  const [form, setForm] = useState(tracker || { name: "", description: "", emoji: "📋", color: "#7c6aff" });
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const { id, items, owner_id, created_at, ...payload } = form;
      const result = tracker ? await api.updateTracker(tracker.id, payload) : await api.createTracker(payload);
      // Preserve items if editing
      if (tracker) result.items = tracker.items || [];
      onSave(result);
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{tracker ? "Edit Tracker" : "New Tracker"}</div>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" placeholder="e.g. Grocery List" value={form.name}
                 onChange={e => u("name", e.target.value)} autoFocus/>
        </div>
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <input className="form-input" placeholder="What are you tracking?" value={form.description || ""}
                 onChange={e => u("description", e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">Emoji</label>
          <div className="emoji-grid">
            {EMOJIS.map(e => (
              <div key={e} className={`emoji-opt ${form.emoji === e ? "selected" : ""}`} onClick={() => u("emoji", e)}>{e}</div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-grid">
            {COLORS.map(c => (
              <div key={c} className={`color-opt ${form.color === c ? "selected" : ""}`}
                   style={{ background: c }} onClick={() => u("color", c)}/>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={!form.name.trim() || loading}>
            {loading ? <span className="spinner"/> : tracker ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
